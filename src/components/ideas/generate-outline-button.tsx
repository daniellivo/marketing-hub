'use client'

import { Button } from '@/components/ui/button'
import { Sparkles, Loader2 } from 'lucide-react'
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

interface GenerateOutlineButtonProps {
  ideaId: string
  disabled?: boolean
}

export function GenerateOutlineButton({ ideaId, disabled = false }: GenerateOutlineButtonProps) {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleGenerate = async () => {
    setShowConfirmDialog(false)
    setIsGenerating(true)

    const toastId = toast.loading('Generando outline con AI...', {
      description: 'Esto puede tomar 15-30 segundos',
    })

    try {
      const response = await fetch(`/api/ideas/${ideaId}/generate-outline`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Error al generar outline')
      }

      toast.success('Outline generado exitosamente', {
        id: toastId,
        description: `Generado en ${Math.round(data.duration_ms / 1000)}s`,
      })

      // Redirect to outline page (we'll create this later)
      router.push(`/outlines/${data.outline.id}`)
      router.refresh()
    } catch (error) {
      console.error('Error generating outline:', error)
      toast.error('Error al generar outline', {
        id: toastId,
        description: error instanceof Error ? error.message : 'Error desconocido',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setShowConfirmDialog(true)}
        disabled={disabled || isGenerating}
        size="lg"
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Generando...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            Generar Outline con AI
          </>
        )}
      </Button>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Generar outline con AI?</DialogTitle>
            <DialogDescription className="space-y-2 pt-2">
              <p>
                La AI creará una estructura detallada de contenido basada en:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm pl-2">
                <li>El template seleccionado</li>
                <li>La base de conocimiento de Livo</li>
                <li>Las mejores prácticas de SEO y GEO</li>
                <li>Las keywords y audiencia objetivo</li>
              </ul>
              <p className="text-sm font-medium pt-2">
                Este proceso puede tomar 15-30 segundos.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleGenerate}>
              <Sparkles className="mr-2 h-4 w-4" />
              Generar Outline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
