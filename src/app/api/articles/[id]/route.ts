import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createUntypedClient } from '@/lib/supabase/server-untyped'

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id: articleId } = await params

    const { data: article, error } = await supabase
      .from('articles')
      .select('*, content_ideas(*), outlines(*)')
      .eq('id', articleId)
      .single()

    if (error || !article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch article',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createUntypedClient()
    const { id: articleId } = await params
    const body = await request.json()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if article exists
    const { data: existingArticle, error: fetchError } = await supabase
      .from('articles')
      .select('*')
      .eq('id', articleId)
      .single()

    if (fetchError || !existingArticle) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Prepare update data
    const updateData: any = {}

    // Only update fields that are provided
    if (body.title !== undefined) updateData.title = body.title
    if (body.slug !== undefined) {
      // Check slug uniqueness if it's being changed
      if (body.slug !== existingArticle.slug) {
        const { data: slugCheck } = await supabase
          .from('articles')
          .select('id')
          .eq('slug', body.slug)
          .neq('id', articleId)
          .single()

        if (slugCheck) {
          return NextResponse.json(
            { error: 'An article with this slug already exists' },
            { status: 409 }
          )
        }
      }
      updateData.slug = body.slug
    }
    if (body.content !== undefined) {
      updateData.content = body.content
      // Recalculate word count and reading time when content is updated
      const wordCount = calculateWordCount(body.content)
      updateData.word_count = wordCount
      updateData.reading_time = calculateReadingTime(wordCount)
    }
    if (body.meta_description !== undefined)
      updateData.meta_description = body.meta_description
    if (body.alt_text !== undefined) updateData.alt_text = body.alt_text
    if (body.category !== undefined) updateData.category = body.category
    if (body.job !== undefined) updateData.job = body.job
    if (body.tags !== undefined) updateData.tags = body.tags
    if (body.author !== undefined) updateData.author = body.author
    if (body.keywords !== undefined) updateData.keywords = body.keywords
    if (body.status !== undefined) updateData.status = body.status
    if (body.published_at !== undefined) updateData.published_at = body.published_at
    if (body.notion_page_id !== undefined)
      updateData.notion_page_id = body.notion_page_id

    // Update the article
    const { data: article, error } = await supabase
      .from('articles')
      .update(updateData)
      .eq('id', articleId)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json(
      {
        error: 'Failed to update article',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const untypedSupabase = await createUntypedClient()
    const { id: articleId } = await params

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin (only admins can delete articles)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle() as { data: { role: string } | null }

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Only admins can delete articles' },
        { status: 403 }
      )
    }

    // Delete the article
    const { error } = await untypedSupabase
      .from('articles')
      .delete()
      .eq('id', articleId)

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({ message: 'Article deleted successfully' })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json(
      {
        error: 'Failed to delete article',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
