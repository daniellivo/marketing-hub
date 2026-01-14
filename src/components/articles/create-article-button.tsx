'use client'

import { Button } from '@/components/ui/button'
import { FileText, Loader2, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface CreateArticleButtonProps {
  outlineId: string
  disabled?: boolean
  hasArticle?: boolean
}

export function CreateArticleButton({
  outlineId,
  disabled = false,
  hasArticle = false,
}: CreateArticleButtonProps) {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleCreate = async () => {
    setShowConfirmDialog(false)
    setIsCreating(true)

    const toastId = toast.loading('Creando artículo desde outline...')

    try {
      const response = await fetch(
        `/api/outlines/${outlineId}/create-article`,
        {
          method: 'POST',
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || data.message || 'Error al crear artículo'
        )
      }

      toast.success('Artículo creado exitosamente', {
        id: toastId,
        description: 'Redirigiendo al editor...',
      })

      // Redirect to article edit page
      router.push(`/articles/${data.article.id}/edit`)
      router.refresh()
    } catch (error) {
      console.error('Error creating article:', error)
      toast.error('Error al crear artículo', {
        id: toastId,
        description:
          error instanceof Error ? error.message : 'Error desconocido',
      })
    } finally {
      setIsCreating(false)
    }
  }

  // If article already exists, show a different button
  if (hasArticle) {
    return (
      <Button disabled size="lg" className="w-full" variant="secondary">
        <CheckCircle className="mr-2 h-5 w-5" />
        Artículo ya creado
      </Button>
    )
  }

  return (
    <>
      <Button
        onClick={() => setShowConfirmDialog(true)}
        disabled={disabled || isCreating}
        size="lg"
        className="w-full"
      >
        {isCreating ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Creando...
          </>
        ) : (
          <>
            <FileText className="mr-2 h-5 w-5" />
            Aprobar y Crear Artículo
          </>
        )}
      </Button>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Crear artículo desde este outline?</DialogTitle>
            <DialogDescription className="space-y-2 pt-2">
              <p>Se creará un nuevo artículo con el siguiente contenido:</p>
              <ul className="list-disc list-inside space-y-1 text-sm pl-2">
                <li>El contenido del outline convertido a formato editable</li>
                <li>Metadatos heredados de la idea original</li>
                <li>Keywords y categoría de la idea</li>
                <li>Estado inicial: Borrador</li>
              </ul>
              <p className="text-sm font-medium pt-2">
                Podrás editar el artículo después de crearlo.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreate}>
              <FileText className="mr-2 h-4 w-4" />
              Crear Artículo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
