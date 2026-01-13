/**
 * Outline View Page
 * Displays an outline in readonly mode
 */

import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { TiptapEditor } from '@/components/editor/tiptap-editor'
import { outlineToTiptap } from '@/lib/editor/outline-converter'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, Edit, FileText } from 'lucide-react'

export default async function OutlineViewPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  // Fetch outline
  const { data, error } = await supabase
    .from('outlines')
    .select('*, content_ideas(*)')
    .eq('id', params.id)
    .single()

  if (error || !data) {
    notFound()
  }

  // Type cast to work around Supabase type inference issues
  const outline = data as any

  // Convert outline content to Tiptap format
  const tiptapContent = outlineToTiptap(outline.content)

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <Link href="/ideas" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Ideas
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Outline: {outline.content.title || 'Sin título'}
            </h1>
            <p className="text-muted-foreground">
              Generado el {new Date(outline.created_at).toLocaleDateString('es-ES')}
            </p>
          </div>

          <div className="flex gap-2">
            <Link href={`/outlines/${outline.id}/edit`}>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Editar Outline
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metadata Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Información del Outline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Estado</p>
              <Badge variant={outline.status === 'approved' ? 'default' : 'secondary'}>
                {outline.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Template</p>
              <p className="text-sm">{outline.template_used}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Idea Original</p>
              <Link
                href={`/ideas/${outline.content_ideas?.id}`}
                className="text-sm text-blue-600 hover:underline"
              >
                {outline.content_ideas?.title?.substring(0, 30)}...
              </Link>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Secciones</p>
              <p className="text-sm">{outline.content.sections?.length || 0} secciones</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editor (Read-only) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Contenido del Outline
          </CardTitle>
          <CardDescription>
            Vista de solo lectura. Haz clic en "Editar Outline" para modificar el contenido.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TiptapEditor content={tiptapContent} editable={false} />
        </CardContent>
      </Card>
    </div>
  )
}
