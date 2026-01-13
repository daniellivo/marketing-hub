import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Database } from '@/types/database'

type ContentIdea = Database['public']['Tables']['content_ideas']['Row']

export default async function IdeasPage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('content_ideas')
    .select('*')
    .order('created_at', { ascending: false })

  const ideas = (data as ContentIdea[]) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ideas de Contenido</h1>
          <p className="text-muted-foreground">
            Gestiona y crea nuevas ideas para artículos
          </p>
        </div>
        <Link href="/ideas/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Idea
          </Button>
        </Link>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">Error al cargar ideas: {error.message}</p>
        </div>
      ) : ideas && ideas.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ideas.map((idea) => (
            <Link
              key={idea.id}
              href={`/ideas/${idea.id}`}
              className="rounded-lg border bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="space-y-2">
                <h3 className="font-semibold">{idea.title}</h3>
                {idea.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {idea.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {idea.template_type}
                  </span>
                  <span className="text-xs font-medium">{idea.status}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <p className="text-muted-foreground">No hay ideas aún</p>
            <Link href="/ideas/new">
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Crear Primera Idea
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
