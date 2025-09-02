import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { email, code, password } = await req.json()
    if (!email || !code || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const service = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supa = createClient(url, service)

    const { data: invite } = await supa.from('invites').select('*').eq('email', email).is('used_at', null).maybeSingle()
    if (!invite) return NextResponse.json({ error: 'Invite not found or already used' }, { status: 400 })
    if (new Date(invite.expires_at).getTime() < Date.now()) return NextResponse.json({ error: 'Invite expired' }, { status: 400 })

    const salt = process.env.INVITE_CODE_SALT || ''
    const ok = bcrypt.compareSync((code as string) + salt, invite.code_hash)
    if (!ok) return NextResponse.json({ error: 'Invalid code' }, { status: 400 })

    const { data: userResp, error: createErr } = await supa.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { full_name: '', source: 'invite' }
    })
    if (createErr || !userResp.user) return NextResponse.json({ error: createErr?.message || 'Could not create user' }, { status: 500 })

    await supa.from('invites').update({ used_at: new Date().toISOString(), invited_user_auth_id: userResp.user.id }).eq('id', invite.id)
    await supa.from('profiles').upsert({ id: userResp.user.id, full_name: '' })

    return NextResponse.json({ ok: true })
  } catch (e:any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 })
  }
}
