'use client'
import { useState } from 'react'
import { supabaseBrowser } from '@/lib/supabaseClient'
import RequireActive from '@/components/RequireActive'

function randomCode(len=8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i=0; i<len; i++) out += chars[Math.floor(Math.random()*chars.length)]
  return out
}

export default function ReferPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<string|undefined>(undefined)

  const sendInvite = async () => {
    setStatus('Sending...')
    try {
      if (!email.trim()) throw new Error('Enter an email')
      const code = randomCode()
      const supabase = supabaseBrowser()
      const { data: session } = await supabase.auth.getSession()
      const token = session.session?.access_token
      if (!token) throw new Error('Please sign in first.')

      const res = await fetch('/api/send-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ email: email.trim(), code })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Server error')
      setStatus('Invite sent (or stored if email disabled).')
      setEmail('')
    } catch (e:any) {
      setStatus(e.message)
    }
  }

  return (
    <RequireActive>
      <div className="container" style={{padding:'32px 0'}}>
        <div className="card" style={{maxWidth:560}}>
          <h2>Refer a Friend</h2>
          <p>Members can invite trusted peers. We’ll send them a unique code that expires in 14 days.</p>
          <input placeholder="Friend’s email" value={email} onChange={e=>setEmail(e.target.value)} />
          <div className="row">
            <button onClick={sendInvite}>Send Invite</button>
            {status && <small className="muted" style={{marginLeft:12}}>{status}</small>}
          </div>
        </div>
      </div>
    </RequireActive>
  )
}
