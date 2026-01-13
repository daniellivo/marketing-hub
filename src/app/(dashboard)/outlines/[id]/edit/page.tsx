'use client'

/**
 * Outline Edit Page
 * Allows editing an outline with auto-save functionality
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TiptapEditor } from '@/components/editor/tiptap-editor'
import { outlineToTiptap } from '@/lib/editor/outline-converter'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useDebounce } from 'use-debounce'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

export default function OutlineEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const supabase = createClient()

  const [outline, setOutline] = useState<any>(null)
  const [content, setContent] = useState<any>(null)
  const [debouncedContent] = useDebounce(content, 2000)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')
  const [isLoading, setIsLoading] = useState(true)

  // Load outline
  useEffect(() => {
    async function loadOutline() {
      const { data, error } = await supabase
        .from('outlines')
        .select('*, content_ideas(*)')
        .eq('id', params.id)
        .single()

      if (error) {
        toast.error('Error al cargar el outline')
        return
      }

      setOutline(data)
      const tiptapContent = outlineToTiptap((data as any).content)
      setContent(tiptapContent)
      setIsLoading(false)
    }

    loadOutline()
  }, [params.id])

  // Auto-save when content changes
  useEffect(() => {
    if (!debouncedContent || !outline || isLoading) return

    async function saveContent() {
      setSaveStatus('saving')

      try {
        const { error } = await supabase
          .from('outlines')
          // @ts-expect-error - Supabase type inference issue with Json type
          .update({
            content: debouncedContent,
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
          <p className="text-muted-foreground">Cargando outline...</p>
        </div>
      </div>
    )
  }

  if (!outline) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-600" />
          <p className="text-muted-foreground">Outline no encontrado</p>
          <Link href="/ideas">
            <Button className="mt-4">Volver a Ideas</Button>
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
          <Link href={`/outlines/${params.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          </Link>

          <div>
            <h1 className="text-2xl font-bold">
              Editando: {(outline as any)?.content?.title || 'Sin título'}
            </h1>
            <div className="flex items-center gap-2 mt-1">
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
          </div>
        </div>

        <Link href={`/outlines/${params.id}`}>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Guardar y Salir
          </Button>
        </Link>
      </div>

      {/* Editor Card */}
      <Card>
        <CardHeader>
          <CardTitle>Edita tu outline</CardTitle>
          <CardDescription>
            Los cambios se guardan automáticamente cada 2 segundos.
            Usa la barra de herramientas para dar formato al texto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TiptapEditor
            content={content}
            onChange={setContent}
            editable={true}
          />
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-sm">💡 Consejos de edición</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• <strong>Cmd+B</strong> para negrita, <strong>Cmd+I</strong> para cursiva</p>
          <p>• <strong>Cmd+Z</strong> para deshacer, <strong>Cmd+Shift+Z</strong> para rehacer</p>
          <p>• Usa los botones de la barra para cambiar títulos y crear listas</p>
          <p>• Los cambios se guardan automáticamente - no te preocupes por perder tu trabajo</p>
        </CardContent>
      </Card>
    </div>
  )
}
