import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createUntypedClient } from '@/lib/supabase/server-untyped'
import { Database } from '@/types/database'

type ContentIdeaUpdate = Database['public']['Tables']['content_ideas']['Update']

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    const { data: idea, error } = await supabase
      .from('content_ideas')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Idea not found' },
          { status: 404 }
        )
      }
      throw new Error(error.message)
    }

    return NextResponse.json(idea)
  } catch (error) {
    console.error('Error fetching idea:', error)
    return NextResponse.json(
      { error: 'Failed to fetch idea', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createUntypedClient()
    const { id } = await params
    const body = await request.json()

    // Build update object directly
    const {title, description, target_audience, job_category, template_type, keywords, priority, status} = body

    const { data: idea, error } = await supabase
      .from('content_ideas')
      .update({
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(target_audience !== undefined && { target_audience }),
        ...(job_category !== undefined && { job_category }),
        ...(template_type !== undefined && { template_type }),
        ...(keywords !== undefined && { keywords }),
        ...(priority !== undefined && { priority }),
        ...(status !== undefined && { status }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Idea not found' },
          { status: 404 }
        )
      }
      throw new Error(error.message)
    }

    return NextResponse.json(idea)
  } catch (error) {
    console.error('Error updating idea:', error)
    return NextResponse.json(
      { error: 'Failed to update idea', message: error instanceof Error ? error.message : 'Unknown error' },
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
    const { id } = await params

    const { error } = await supabase
      .from('content_ideas')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting idea:', error)
    return NextResponse.json(
      { error: 'Failed to delete idea', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
