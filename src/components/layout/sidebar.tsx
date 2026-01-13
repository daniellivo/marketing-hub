'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Lightbulb, FileText, PenTool, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const navigation = [
  {
    name: 'Ideas',
    href: '/ideas',
    icon: Lightbulb,
  },
  {
    name: 'Artículos',
    href: '/articles',
    icon: FileText,
  },
  {
    name: 'Configuración',
    href: '/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      toast.success('Sesión cerrada')
      router.push('/login')
      router.refresh()
    } catch (error) {
      toast.error('Error al cerrar sesión')
      console.error(error)
    }
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-slate-50">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/ideas" className="flex items-center space-x-2">
          <PenTool className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">Livo Content</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-slate-700 hover:bg-slate-100'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
