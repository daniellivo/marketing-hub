import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, FileText } from 'lucide-react'
import type { Database } from '@/types/database'

type Article = Database['public']['Tables']['articles']['Row']

interface ArticleCardProps {
  article: Article
}

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

export function ArticleCard({ article }: ArticleCardProps) {
  const formattedDate = new Date(article.created_at).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <Link href={`/articles/${article.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-2 mb-2">
            <Badge className={statusColors[article.status as keyof typeof statusColors]}>
              {statusLabels[article.status as keyof typeof statusLabels]}
            </Badge>
            <Badge variant="outline">{article.category}</Badge>
          </div>
          <CardTitle className="line-clamp-2">{article.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {article.meta_description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {article.meta_description}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-500">
              {article.word_count && (
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>{article.word_count} palabras</span>
                </div>
              )}
              {article.reading_time && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{article.reading_time} min</span>
                </div>
              )}
            </div>

            {article.keywords && article.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {article.keywords.slice(0, 3).map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
                {article.keywords.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{article.keywords.length - 3}
                  </Badge>
                )}
              </div>
            )}

            <div className="text-xs text-gray-400 mt-2">
              Creado: {formattedDate}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
