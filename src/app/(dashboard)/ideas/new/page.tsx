'use client'

import { IdeaForm, IdeaFormValues } from '@/components/ideas/idea-form'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function NewIdeaPage() {
  const router = useRouter()

  const handleSubmit = async (data: IdeaFormValues) => {
    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error al crear la idea')
      }

      const result = await response.json()
      toast.success('Idea creada exitosamente')
      router.push(`/ideas/${result.id}`)
    } catch (error) {
      console.error('Error creating idea:', error)
      toast.error(error instanceof Error ? error.message : 'Error al crear la idea')
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nueva Idea de Contenido</h1>
        <p className="text-muted-foreground">
          Crea una nueva idea que luego podrás convertir en outline y artículo
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información de la Idea</CardTitle>
          <CardDescription>
            Completa los detalles básicos de tu idea de contenido
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IdeaForm onSubmit={handleSubmit} submitLabel="Crear Idea" />
        </CardContent>
      </Card>
    </div>
  )
}
