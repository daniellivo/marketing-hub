import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Sparkles, Trash2, FileText, Eye } from 'lucide-react'
import Link from 'next/link'
import { IdeaActions } from '@/components/ideas/idea-actions'
import { GenerateOutlineButton } from '@/components/ideas/generate-outline-button'
import { Database } from '@/types/database'

type ContentIdea = Database['public']['Tables']['content_ideas']['Row']

export default async function IdeaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const { data, error } = await supabase
    .from('content_ideas')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    notFound()
  }

  const idea = data as ContentIdea

  // Check if outline exists
  const { data: outline } = await supabase
    .from('outlines')
    .select('id, created_at, status')
    .eq('idea_id', id)
    .maybeSingle() as { data: { id: string; created_at: string; status: string } | null }

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  }

  const priorityLabels = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    urgent: 'Urgente',
  }

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    'outline-ready': 'bg-blue-100 text-blue-800',
    'in-writing': 'bg-purple-100 text-purple-800',
    'in-review': 'bg-yellow-100 text-yellow-800',
    published: 'bg-green-100 text-green-800',
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/ideas">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{idea.title}</h1>
          <div className="mt-2 flex items-center gap-2">
            <Badge className={statusColors[idea.status as keyof typeof statusColors]}>
              {idea.status}
            </Badge>
            <Badge className={priorityColors[idea.priority as keyof typeof priorityColors]}>
              {priorityLabels[idea.priority as keyof typeof priorityLabels]}
            </Badge>
          </div>
        </div>
        <IdeaActions ideaId={idea.id} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información de la Idea</CardTitle>
          <CardDescription>Detalles y configuración de esta idea de contenido</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {idea.description && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Descripción</h3>
              <p className="text-sm">{idea.description}</p>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Audiencia Objetivo</h3>
              <p className="text-sm font-medium">{idea.target_audience}</p>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                Categoría de Trabajo
              </h3>
              <p className="text-sm font-medium">{idea.job_category}</p>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Tipo de Template</h3>
              <p className="text-sm font-medium capitalize">{idea.template_type}</p>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Prioridad</h3>
              <Badge className={priorityColors[idea.priority as keyof typeof priorityColors]}>
                {priorityLabels[idea.priority as keyof typeof priorityLabels]}
              </Badge>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {idea.keywords?.map((keyword: string) => (
                <Badge key={keyword} variant="outline">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Creada</h3>
              <p className="text-sm">{new Date(idea.created_at).toLocaleDateString('es-ES')}</p>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                Última actualización
              </h3>
              <p className="text-sm">{new Date(idea.updated_at).toLocaleDateString('es-ES')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Próximos Pasos</CardTitle>
          <CardDescription>Acciones disponibles para esta idea</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {outline ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Outline generado</p>
                    <p className="text-sm text-green-700">
                      Creado el {new Date(outline.created_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
                <Link href={`/outlines/${outline.id}`}>
                  <Button size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Outline
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Puedes visualizar y editar el outline generado
              </p>
            </div>
          ) : (
            <>
              <GenerateOutlineButton ideaId={idea.id} />
              <p className="text-xs text-muted-foreground text-center">
                La AI generará una estructura detallada basada en el template seleccionado y la knowledge base de Livo
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
