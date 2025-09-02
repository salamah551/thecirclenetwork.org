import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const to = url.searchParams.get('to')
    if (!to) return NextResponse.redirect(new URL('/messages', url))

    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.toLowerCase().startsWith('bearer ') ? authHeader.slice(7) : null
    if (!token) return NextResponse.redirect(new URL('/billing', url))

    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const { data: { user } } = await admin.auth.getUser(token)
    if (!user) return NextResponse.redirect(new URL('/billing', url))

    const me = user.id
    const pair = [me, to].sort()
    const { data: conv, error } = await admin
      .from('conversations')
      .upsert({ user_a_id: pair[0], user_b_id: pair[1], created_by: me })
      .select('*')
      .maybeSingle()

    if (error || !conv) throw error || new Error('Failed to create conversation')
    return NextResponse.redirect(new URL(`/messages/${conv.id}`, url))
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 })
  }
}
