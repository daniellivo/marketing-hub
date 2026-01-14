import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createUntypedClient } from '@/lib/supabase/server-untyped'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams

    // Optional filters
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const job = searchParams.get('job')

    let query = supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }
    if (category) {
      query = query.eq('category', category)
    }
    if (job) {
      query = query.eq('job', job)
    }

    const { data: articles, error } = await query

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(articles)
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch articles',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createUntypedClient()
    const body = await request.json()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate required fields
    const { title, slug, content, category, job } = body

    if (!title || !slug || !content || !category || !job) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, content, category, job' },
        { status: 400 }
      )
    }

    // Check slug uniqueness
    const { data: existingArticle } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existingArticle) {
      return NextResponse.json(
        { error: 'An article with this slug already exists' },
        { status: 409 }
      )
    }

    // Insert new article
    const { data: article, error } = await supabase
      .from('articles')
      .insert({
        title,
        slug,
        content,
        meta_description: body.meta_description || null,
        alt_text: body.alt_text || null,
        category,
        job,
        tags: body.tags || [],
        author: body.author || null,
        keywords: body.keywords || [],
        word_count: body.word_count || 0,
        reading_time: body.reading_time || 0,
        status: 'draft',
        version: 1,
        idea_id: body.idea_id || null,
        outline_id: body.outline_id || null,
        generation_metadata: body.generation_metadata || {},
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      {
        error: 'Failed to create article',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
