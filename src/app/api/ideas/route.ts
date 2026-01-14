import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createUntypedClient } from '@/lib/supabase/server-untyped'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams

    // Optional filters
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const target_audience = searchParams.get('target_audience')
    const job_category = searchParams.get('job_category')

    let query = supabase
      .from('content_ideas')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }
    if (priority) {
      query = query.eq('priority', priority)
    }
    if (target_audience) {
      query = query.eq('target_audience', target_audience)
    }
    if (job_category) {
      query = query.eq('job_category', job_category)
    }

    const { data: ideas, error } = await query

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(ideas)
  } catch (error) {
    console.error('Error fetching ideas:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ideas', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createUntypedClient()
    const body = await request.json()

    // Validate required fields
    const { title, target_audience, job_category, template_type, keywords, priority } = body

    if (!title || !target_audience || !job_category || !template_type || !keywords || !priority) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Insert new idea
    const { data: idea, error } = await supabase
      .from('content_ideas')
      .insert({
        title,
        description: body.description || null,
        target_audience,
        job_category,
        template_type,
        keywords,
        priority,
        status: 'new',
      })
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(idea, { status: 201 })
  } catch (error) {
    console.error('Error creating idea:', error)
    return NextResponse.json(
      { error: 'Failed to create idea', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
