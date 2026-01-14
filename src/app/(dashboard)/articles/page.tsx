import { createClient } from '@/lib/supabase/server'
import { FileText } from 'lucide-react'
import { ArticleCard } from '@/components/articles/article-card'
import type { Database } from '@/types/database'

type Article = Database['public']['Tables']['articles']['Row']

export default async function ArticlesPage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  const articles = (data as Article[]) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Artículos</h1>
          <p className="text-muted-foreground">
            Gestiona y edita tus artículos generados
          </p>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            Error al cargar artículos: {error.message}
          </p>
        </div>
      ) : articles && articles.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No hay artículos aún
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Los artículos se crean desde los outlines aprobados
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
