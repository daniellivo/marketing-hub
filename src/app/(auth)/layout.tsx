import { Toaster } from '@/components/ui/sonner'

// Force dynamic rendering for auth pages
export const dynamic = 'force-dynamic'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <Toaster position="top-center" />
    </>
  )
}
