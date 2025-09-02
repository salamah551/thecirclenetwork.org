import { createClient, SupabaseClient } from '@supabase/supabase-js'

export const supabaseBrowser = (): SupabaseClient<any, any, any> => {
  const isBrowser = typeof window !== 'undefined'
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!isBrowser) {
    const handler: ProxyHandler<any> = { get(){ throw new Error('supabaseBrowser() is browser-only') } }
    // @ts-ignore
    return new Proxy({}, handler)
  }
  if (!url || !anon) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  return createClient(url, anon, { auth: { persistSession: true } })
}
