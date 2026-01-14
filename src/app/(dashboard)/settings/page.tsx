import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Key, CheckCircle, XCircle } from 'lucide-react'

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle() as { data: { full_name: string | null; role: string | null } | null }

  // Check API configurations (from environment)
  const hasOpenRouterKey = !!process.env.OPENROUTER_API_KEY
  const hasNotionKey = !!process.env.NOTION_API_KEY

  return (
    <div className="container mx-auto py-6 max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Gestiona tu perfil y configuraciones del sistema
        </p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Perfil de Usuario
          </CardTitle>
          <CardDescription>
            Información de tu cuenta y permisos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Email
              </p>
              <p className="text-sm font-medium">{user.email}</p>
            </div>

            {profile?.full_name && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Nombre Completo
                </p>
                <p className="text-sm font-medium">{profile.full_name}</p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-muted-foreground">Rol</p>
              <Badge variant={profile?.role === 'admin' ? 'default' : 'secondary'}>
                {profile?.role || 'editor'}
              </Badge>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Cuenta creada
              </p>
              <p className="text-sm">
                {new Date(user.created_at).toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integrations Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Integraciones
          </CardTitle>
          <CardDescription>
            Estado de las integraciones configuradas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* OpenRouter AI */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  hasOpenRouterKey ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                {hasOpenRouterKey ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div>
                <p className="font-medium">OpenRouter AI</p>
                <p className="text-sm text-muted-foreground">
                  Generación de outlines y contenido
                </p>
              </div>
            </div>
            <Badge
              variant={hasOpenRouterKey ? 'default' : 'destructive'}
            >
              {hasOpenRouterKey ? 'Configurado' : 'No configurado'}
            </Badge>
          </div>

          {/* Notion */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  hasNotionKey ? 'bg-green-100' : 'bg-gray-100'
                }`}
              >
                {hasNotionKey ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <div>
                <p className="font-medium">Notion</p>
                <p className="text-sm text-muted-foreground">
                  Exportación de artículos a Notion
                </p>
              </div>
            </div>
            <Badge variant={hasNotionKey ? 'default' : 'secondary'}>
              {hasNotionKey ? 'Configurado' : 'Opcional'}
            </Badge>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Las integraciones se configuran mediante
              variables de entorno. Contacta al administrador del sistema si
              necesitas modificar alguna configuración.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* System Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Sistema</CardTitle>
          <CardDescription>
            Detalles técnicos y capacidades
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Plataforma
            </span>
            <span className="text-sm font-medium">Livo Content Hub</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Editor
            </span>
            <span className="text-sm font-medium">Tiptap (Notion-style)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Modelo AI
            </span>
            <span className="text-sm font-medium">Claude 3.5 Sonnet</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
