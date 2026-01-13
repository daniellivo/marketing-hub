import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createUntypedClient } from '@/lib/supabase/server-untyped'
import { buildOutlinePrompt, getRelevantKBFiles, getTemplate } from '@/lib/ai/prompt-builder'
import { generateContent, parseAIJSON, isConfigured } from '@/lib/ai/openrouter'
import { Database } from '@/types/database'

type ContentIdea = Database['public']['Tables']['content_ideas']['Row']

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now()
  const supabase = await createClient()
  const untypedSupabase = await createUntypedClient()

  try {
    const { id } = await params

    // Check if OpenRouter is configured
    if (!isConfigured()) {
      return NextResponse.json(
        { error: 'AI service is not configured. Please set OPENROUTER_API_KEY in environment variables.' },
        { status: 503 }
      )
    }

    // 1. Get idea
    const { data, error: ideaError } = await supabase
      .from('content_ideas')
      .select('*')
      .eq('id', id)
      .single()

    if (ideaError || !data) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404 }
      )
    }

    const idea = data as ContentIdea

    // 2. Check if outline already exists
    const { data: existingOutline } = await supabase
      .from('outlines')
      .select('id')
      .eq('idea_id', id)
      .maybeSingle()

    if (existingOutline) {
      return NextResponse.json(
        { error: 'Outline already exists for this idea. Delete it first to generate a new one.' },
        { status: 409 }
      )
    }

    // 3. Get template
    const template = await getTemplate(idea.template_type)
    if (!template) {
      return NextResponse.json(
        { error: `Template not found for type: ${idea.template_type}. Please sync templates first.` },
        { status: 404 }
      )
    }

    // 4. Get knowledge base
    const kbFiles = await getRelevantKBFiles()
    if (kbFiles.length === 0) {
      console.warn('No knowledge base files found. AI will generate without company context.')
    }

    // 5. Build prompt
    const prompt = await buildOutlinePrompt(idea, template, kbFiles)

    // 6. Generate with AI
    console.log(`Generating outline for idea ${id}...`)
    const aiResponse = await generateContent(prompt, {
      model: process.env.OPENROUTER_DEFAULT_MODEL || 'anthropic/claude-3.5-sonnet',
      maxTokens: 4000,
      temperature: 0.7,
    })

    // 7. Parse JSON response
    let outlineContent
    try {
      outlineContent = parseAIJSON(aiResponse)
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)

      // Log to generation history
      await untypedSupabase.from('generation_history').insert({
        operation_type: 'outline_generation',
        input_data: { idea_id: id },
        ai_model: process.env.OPENROUTER_DEFAULT_MODEL || 'anthropic/claude-3.5-sonnet',
        duration_ms: Date.now() - startTime,
        success: false,
        error_message: 'AI returned invalid JSON format',
      })

      return NextResponse.json(
        { error: 'AI returned invalid format. Please try again.' },
        { status: 500 }
      )
    }

    // 8. Save to database
    const { data: outline, error: outlineError } = await untypedSupabase
      .from('outlines')
      .insert({
        idea_id: id,
        content: outlineContent,
        template_used: idea.template_type,
        generation_metadata: {
          model: process.env.OPENROUTER_DEFAULT_MODEL || 'anthropic/claude-3.5-sonnet',
          prompt_length: prompt.length,
          response_length: aiResponse.length,
          kb_files_count: kbFiles.length,
        },
        status: 'draft',
      })
      .select()
      .single()

    if (outlineError) {
      console.error('Error saving outline:', outlineError)
      throw new Error(outlineError.message)
    }

    // 9. Log successful generation
    await untypedSupabase.from('generation_history').insert({
      operation_type: 'outline_generation',
      input_data: { idea_id: id },
      output_data: { outline_id: outline.id },
      ai_model: process.env.OPENROUTER_DEFAULT_MODEL || 'anthropic/claude-3.5-sonnet',
      duration_ms: Date.now() - startTime,
      success: true,
    })

    // 10. Update idea status
    await untypedSupabase
      .from('content_ideas')
      .update({ status: 'outline-ready' })
      .eq('id', id)

    console.log(`✓ Outline generated successfully for idea ${id} in ${Date.now() - startTime}ms`)

    return NextResponse.json({
      outline,
      duration_ms: Date.now() - startTime,
    })
  } catch (error) {
    console.error('Error generating outline:', error)

    // Log error
    try {
      const { id } = await params
      await untypedSupabase.from('generation_history').insert({
        operation_type: 'outline_generation',
        input_data: { idea_id: id },
        ai_model: process.env.OPENROUTER_DEFAULT_MODEL || 'anthropic/claude-3.5-sonnet',
        duration_ms: Date.now() - startTime,
        success: false,
        error_message: error instanceof Error ? error.message : 'Unknown error',
      })
    } catch (logError) {
      console.error('Error logging to generation_history:', logError)
    }

    return NextResponse.json(
      {
        error: 'Failed to generate outline',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
