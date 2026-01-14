'use client'

/**
 * Article Edit Page
 * Allows editing an article with auto-save functionality
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TiptapEditor } from '@/components/editor/tiptap-editor'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { useDebounce } from 'use-debounce'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

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

  const words = text.trim().split(/\s+/).filter((word) => word.length > 0)
  return words.length
}

// Helper function to calculate reading time (assuming 200 words per minute)
function calculateReadingTime(wordCount: number): number {
  return Math.ceil(wordCount / 200)
}

export default function ArticleEditPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const supabase = createClient()

  const [article, setArticle] = useState<any>(null)
  const [content, setContent] = useState<any>(null)
  const [debouncedContent] = useDebounce(content, 2000)
  const [saveStatus, setSaveStatus] = useState<
    'saved' | 'saving' | 'error'
  >('saved')
  const [isLoading, setIsLoading] = useState(true)
  const [wordCount, setWordCount] = useState(0)
  const [readingTime, setReadingTime] = useState(0)

  // Load article
  useEffect(() => {
    async function loadArticle() {
      const { data, error } = await supabase
        .from('articles')
        .select('*, content_ideas(*), outlines(*)')
        .eq('id', params.id)
        .single()

      if (error) {
        toast.error('Error al cargar el artículo')
        return
      }

      setArticle(data)
      setContent((data as any).content)
      setWordCount((data as any).word_count || 0)
      setReadingTime((data as any).reading_time || 0)
      setIsLoading(false)
    }

    loadArticle()
  }, [params.id])

  // Update word count when content changes
  useEffect(() => {
    if (content) {
      const count = calculateWordCount(content)
      setWordCount(count)
      setReadingTime(calculateReadingTime(count))
    }
  }, [content])

  // Auto-save when content changes
  useEffect(() => {
    if (!debouncedContent || !article || isLoading) return

    async function saveContent() {
      setSaveStatus('saving')

      try {
        const count = calculateWordCount(debouncedContent)
        const time = calculateReadingTime(count)

        const { error } = await supabase
          .from('articles')
          // @ts-expect-error - Supabase type inference issue with Json type
          .update({
            content: debouncedContent,
            word_count: count,
            reading_time: time,
            updated_at: new Date().toISOString(),
          })
          .eq('id', params.id)

        if (error) throw error

        setSaveStatus('saved')
        toast.success('Cambios guardados', { duration: 2000 })
      } catch (error) {
        setSaveStatus('error')
        toast.error('Error al guardar. Reintentando...')

        // Retry after 3 seconds
        setTimeout(() => {
          saveContent()
        }, 3000)
      }
    }

    saveContent()
  }, [debouncedContent])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">Cargando artículo...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-600" />
          <p className="text-muted-foreground">Artículo no encontrado</p>
          <Link href="/articles">
            <Button className="mt-4">Volver a Artículos</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/articles/${params.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          </Link>

          <div>
            <h1 className="text-2xl font-bold">
              Editando: {article?.title || 'Sin título'}
            </h1>
            <div className="flex items-center gap-4 mt-1">
              {/* Save status */}
              <div>
                {saveStatus === 'saved' && (
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Guardado
                  </div>
                )}
                {saveStatus === 'saving' && (
                  <div className="flex items-center text-sm text-yellow-600">
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Guardando...
                  </div>
                )}
                {saveStatus === 'error' && (
                  <div className="flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Error al guardar
                  </div>
                )}
              </div>
              {/* Word count and reading time */}
              <div className="text-sm text-muted-foreground">
                {wordCount} palabras · {readingTime} min de lectura
              </div>
            </div>
          </div>
        </div>

        <Link href={`/articles/${params.id}`}>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Guardar y Salir
          </Button>
        </Link>
      </div>

      {/* Editor Card */}
      <Card>
        <CardHeader>
          <CardTitle>Edita tu artículo</CardTitle>
          <CardDescription>
            Los cambios se guardan automáticamente cada 2 segundos. Usa la barra
            de herramientas para dar formato al texto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TiptapEditor content={content} onChange={setContent} editable={true} />
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-sm">💡 Consejos de edición</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            • <strong>Cmd+B</strong> para negrita, <strong>Cmd+I</strong> para
            cursiva
          </p>
          <p>
            • <strong>Cmd+Z</strong> para deshacer,{' '}
            <strong>Cmd+Shift+Z</strong> para rehacer
          </p>
          <p>
            • Usa los botones de la barra para cambiar títulos y crear listas
          </p>
          <p>
            • El contador de palabras y tiempo de lectura se actualizan
            automáticamente
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
