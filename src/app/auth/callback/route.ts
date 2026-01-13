import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/ideas'
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()

    // Exchange the code for a session
    const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

    if (sessionError) {
      console.error('Error exchanging code for session:', sessionError)
      return NextResponse.redirect(`${origin}/login?error=auth-failed`)
    }

    if (session?.user) {
      const userEmail = session.user.email

      if (!userEmail) {
        await supabase.auth.signOut()
        return NextResponse.redirect(`${origin}/login?error=no-email`)
      }

      // Check if the email is whitelisted
      const { data: whitelistData, error: whitelistError } = await supabase
        .from('whitelist')
        .select('*')
        .eq('email', userEmail)
        .eq('is_active', true)
        .single()

      if (whitelistError || !whitelistData) {
        // Email not whitelisted - sign out the user
        await supabase.auth.signOut()
        return NextResponse.redirect(
          `${origin}/login?error=unauthorized&email=${encodeURIComponent(userEmail)}`
        )
      }

      // User is whitelisted, proceed with redirect
      return NextResponse.redirect(`${origin}${redirectTo}`)
    }
  }

  // If no code or session, redirect to login
  return NextResponse.redirect(`${origin}/login?error=no-code`)
}
