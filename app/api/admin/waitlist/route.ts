import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

function code(len=8){const c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';for(let i=0;i<len;i++)s+=c[Math.floor(Math.random()*c.length)];return s}

async function isAdmin(token: string){
  const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data: { user } } = await supa.auth.getUser(token)
  if (!user) return { ok:false }
  const { data } = await supa.from('admins').select('user_id').eq('user_id', user.id).maybeSingle()
  return { ok: !!data, user }
}

export async function GET(req: Request){
  const auth = req.headers.get('authorization') || ''
  const token = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7) : ''
  const admin = await isAdmin(token)
  if (!admin.ok) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data } = await supa.from('waitlist').select('*').order('created_at', { ascending: false })
  return NextResponse.json({ items: data || [] })
}

export async function POST(req: Request){
  const auth = req.headers.get('authorization') || ''
  const token = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7) : ''
  const admin = await isAdmin(token)
  if (!admin.ok) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const salt = process.env.INVITE_CODE_SALT || ''
  const inviteCode = code()
  const code_hash = bcrypt.hashSync(inviteCode + salt, 10)
  await supa.from('invites').insert({ email, code_hash, expires_at: new Date(Date.now()+1000*60*60*24*14).toISOString() })

  const key = process.env.SENDGRID_API_KEY
  const FROM = process.env.INVITER_FROM_EMAIL || 'invites@thecirclenetwork.org'
  const APP_URL = process.env.APP_URL || 'https://thecirclenetwork.org'
  if (key) {
    const html = `<p>You’ve been invited to <b>The Circle Network</b>.</p><p>Use this code: <b>${inviteCode}</b></p><p>Accept: <a href="${APP_URL}/invite">${APP_URL}/invite</a></p>`
    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ personalizations: [{ to: [{ email }] }], from: { email: FROM }, subject: 'Your invite to The Circle Network', content: [{ type:'text/html', value: html }] })
    })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request){
  const auth = req.headers.get('authorization') || ''
  const token = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7) : ''
  const admin = await isAdmin(token)
  if (!admin.ok) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  await supa.from('waitlist').delete().eq('id', id)
  return NextResponse.json({ ok: true })
}
