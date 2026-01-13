'use client'

import { IdeaForm, IdeaFormValues } from '@/components/ideas/idea-form'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { useEffect, useState, use } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function EditIdeaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [idea, setIdea] = useState<IdeaFormValues | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const response = await fetch(`/api/ideas/${id}`)
        if (!response.ok) {
          throw new Error('Error al cargar la idea')
        }
        const data = await response.json()
        setIdea(data)
      } catch (error) {
        console.error('Error loading idea:', error)
        toast.error('Error al cargar la idea')
        router.push('/ideas')
      } finally {
        setIsLoading(false)
      }
    }

    fetchIdea()
  }, [id, router])

  const handleSubmit = async (data: IdeaFormValues) => {
    try {
      const response = await fetch(`/api/ideas/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error al actualizar la idea')
      }

      toast.success('Idea actualizada exitosamente')
      router.push(`/ideas/${id}`)
      router.refresh()
    } catch (error) {
      console.error('Error updating idea:', error)
      toast.error(error instanceof Error ? error.message : 'Error al actualizar la idea')
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!idea) {
    return null
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/ideas/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Idea</h1>
          <p className="text-muted-foreground">Modifica los detalles de esta idea de contenido</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información de la Idea</CardTitle>
          <CardDescription>Actualiza los detalles de tu idea de contenido</CardDescription>
        </CardHeader>
        <CardContent>
          <IdeaForm initialData={idea} onSubmit={handleSubmit} submitLabel="Guardar Cambios" />
        </CardContent>
      </Card>
    </div>
  )
}
