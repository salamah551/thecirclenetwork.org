import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'

function generateCode(len=8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i=0; i<len; i++) out += chars[Math.floor(Math.random()*chars.length)]
  return out
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.toLowerCase().startsWith('bearer ') ? authHeader.slice(7) : null
    if (!token) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const service = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supa = createClient(url, service)
    const { data: { user } } = await supa.auth.getUser(token)
    if (!user) return NextResponse.json({ error: 'Invalid session' }, { status: 401 })

    const { data: sub } = await supa.from('member_subscriptions').select('status').eq('user_id', user.id).maybeSingle()
    if (!sub || sub.status !== 'active') return NextResponse.json({ error: 'Active membership required to send invites' }, { status: 403 })

    const body = await req.json()
    const email = (body.email as string || '').trim()
    let code = (body.code as string) || generateCode()
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })

    const salt = process.env.INVITE_CODE_SALT || ''
    const code_hash = bcrypt.hashSync(code + salt, 10)
    const { error } = await supa.from('invites').insert({
      email, code_hash, expires_at: new Date(Date.now()+1000*60*60*24*14).toISOString(), invited_user_auth_id: null
    })
    if (error) throw error

    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
    const FROM = process.env.INVITER_FROM_EMAIL || 'invites@thecirclenetwork.org'
    const APP_URL = process.env.APP_URL || 'https://thecirclenetwork.org'

    if (SENDGRID_API_KEY) {
      const html = `<p>You’ve been invited to <b>The Circle Network</b>.</p><p>Use this code: <b>${code}</b></p><p>Accept: <a href="${APP_URL}/invite">${APP_URL}/invite</a></p>`
      await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${SENDGRID_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ personalizations: [{ to: [{ email }] }], from: { email: FROM }, subject: 'Your invite to The Circle Network', content: [{ type:'text/html', value: html }] })
      })
    }

    return NextResponse.json({ ok: true })
  } catch (e:any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 })
  }
}
