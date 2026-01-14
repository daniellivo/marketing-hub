import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createUntypedClient } from '@/lib/supabase/server-untyped'
import { outlineToTiptap } from '@/lib/editor/outline-converter'

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
}

// Helper function to calculate word count from Tiptap JSON
function calculateWordCount(tiptapDoc: any): number {
  if (!tiptapDoc || !tiptapDoc.content) return 0

  let text = ''

  function extractText(node: any) {
    if (node.type === 'text') {
      text += node.text + ' '
    }
    if (node.content && Array.isArray(node.content)) {
      node.content.forEach(extractText)
    }
  }

  extractText(tiptapDoc)

  const words = text.trim().split(/\s+/).filter(word => word.length > 0)
  return words.length
}

// Helper function to calculate reading time (assuming 200 words per minute)
function calculateReadingTime(wordCount: number): number {
  return Math.ceil(wordCount / 200)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const untypedSupabase = await createUntypedClient()
    const { id: outlineId } = await params

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 1. Fetch the outline
    const { data: outline, error: outlineError } = await supabase
      .from('outlines')
      .select('*, content_ideas(*)')
      .eq('id', outlineId)
      .maybeSingle() as { data: { content: any; content_ideas: any; template_used: string } | null; error: any }

    if (outlineError || !outline) {
      return NextResponse.json(
        { error: 'Outline not found' },
        { status: 404 }
      )
    }

    // 2. Check if an article already exists for this outline
    const { data: existingArticle } = await supabase
      .from('articles')
      .select('id')
      .eq('outline_id', outlineId)
      .maybeSingle() as { data: { id: string } | null }

    if (existingArticle) {
      return NextResponse.json(
        { error: 'An article already exists for this outline', articleId: existingArticle.id },
        { status: 409 }
      )
    }

    // 3. Get the idea to inherit metadata
    const idea = outline.content_ideas as any

    if (!idea) {
      return NextResponse.json(
        { error: 'Related idea not found' },
        { status: 404 }
      )
    }

    // 4. Convert outline content to Tiptap format
    const tiptapContent = outlineToTiptap(outline.content as any)

    // 5. Calculate word count and reading time
    const wordCount = calculateWordCount(tiptapContent)
    const readingTime = calculateReadingTime(wordCount)

    // 6. Generate slug from outline title
    const outlineTitle = (outline.content as any)?.title || idea.title
    let slug = generateSlug(outlineTitle)

    // 7. Check slug uniqueness and add number if needed
    const { data: existingSlugs } = await supabase
      .from('articles')
      .select('slug')
      .like('slug', `${slug}%`)

    if (existingSlugs && existingSlugs.length > 0) {
      slug = `${slug}-${existingSlugs.length + 1}`
    }

    // 8. Extract meta description from outline if available
    const metaDescription = (outline.content as any)?.meta_description ||
      (outline.content as any)?.introduction?.substring(0, 155)

    // 9. Create the article
    const { data: article, error: articleError } = await untypedSupabase
      .from('articles')
      .insert({
        idea_id: idea.id,
        outline_id: outlineId,
        title: outlineTitle,
        slug,
        content: tiptapContent,
        meta_description: metaDescription,
        category: idea.target_audience,
        job: idea.job_category,
        keywords: idea.keywords,
        word_count: wordCount,
        reading_time: readingTime,
        status: 'draft',
        version: 1,
        created_by: user.id,
        generation_metadata: {
          generated_from_outline: outlineId,
          generated_at: new Date().toISOString(),
          outline_template: outline.template_used,
        },
      })
      .select()
      .single()

    if (articleError) {
      console.error('Error creating article:', articleError)
      throw new Error(articleError.message)
    }

    // 10. Update the idea status to 'article-ready'
    const { error: ideaUpdateError } = await untypedSupabase
      .from('content_ideas')
      .update({ status: 'article-ready' })
      .eq('id', idea.id)

    if (ideaUpdateError) {
      console.error('Error updating idea status:', ideaUpdateError)
      // Don't fail the request if this fails
    }

    return NextResponse.json(
      {
        article,
        message: 'Article created successfully from outline',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating article from outline:', error)
    return NextResponse.json(
      {
        error: 'Failed to create article',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
