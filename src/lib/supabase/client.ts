/**
 * Supabase Client for Browser
 * Used in Client Components and browser-side code
 */

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Create a singleton instance for convenience
// This will only be created when imported, not during build
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const supabase = typeof window !== 'undefined'
  ? (supabaseInstance || (supabaseInstance = createClient()))
  : null as any
