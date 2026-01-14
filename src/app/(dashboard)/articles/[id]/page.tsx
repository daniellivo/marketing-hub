/**
 * Article View Page
 * Displays an article in readonly mode
 */

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { TiptapEditor } from '@/components/editor/tiptap-editor'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, Edit, FileText, Clock } from 'lucide-react'

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  'in-review': 'bg-blue-100 text-blue-800',
  ready: 'bg-green-100 text-green-800',
  published: 'bg-purple-100 text-purple-800',
}

const statusLabels = {
  draft: 'Borrador',
  'in-review': 'En Revisión',
  ready: 'Listo',
  published: 'Publicado',
}

export default async function ArticleViewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { id } = await params

  // Fetch article with related data
  const { data, error } = await supabase
    .from('articles')
    .select('*, content_ideas(*), outlines(*)')
    .eq('id', id)
    .single()

  if (error || !data) {
    notFound()
  }

  // Type cast to work around Supabase type inference issues
  const article = data as any

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/articles"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Artículos
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                className={
                  statusColors[article.status as keyof typeof statusColors]
                }
              >
                {statusLabels[article.status as keyof typeof statusLabels]}
              </Badge>
              <Badge variant="outline">{article.category}</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {article.title}
            </h1>
            <p className="text-muted-foreground">
              Creado el{' '}
              {new Date(article.created_at).toLocaleDateString('es-ES')}
            </p>
          </div>

          <div className="flex gap-2">
            <Link href={`/articles/${article.id}/edit`}>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Editar Artículo
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metadata Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Información del Artículo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Palabras
              </p>
              <p className="text-sm font-semibold">
                {article.word_count || 0} palabras
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Lectura
              </p>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <p className="text-sm font-semibold">
                  {article.reading_time || 0} min
                </p>
              </div>
            </div>
            {article.author && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Autor
                </p>
                <p className="text-sm">{article.author}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Categoría Trabajo
              </p>
              <p className="text-sm">{article.job}</p>
            </div>
          </div>

          {/* Keywords */}
          {article.keywords && article.keywords.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Keywords
              </p>
              <div className="flex flex-wrap gap-1">
                {article.keywords.map((keyword: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Links to related content */}
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
            {article.content_ideas && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Idea Original
                </p>
                <Link
                  href={`/ideas/${article.content_ideas.id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {article.content_ideas.title}
                </Link>
              </div>
            )}
            {article.outlines && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Outline
                </p>
                <Link
                  href={`/outlines/${article.outlines.id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Ver outline
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Editor (Read-only) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Contenido del Artículo
          </CardTitle>
          <CardDescription>
            Vista de solo lectura. Haz clic en "Editar Artículo" para modificar
            el contenido.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TiptapEditor content={article.content} editable={false} />
        </CardContent>
      </Card>
    </div>
  )
}
