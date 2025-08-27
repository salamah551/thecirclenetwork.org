'use client'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabaseClient'

export default function AdminPage(){
  const [isAdmin, setIsAdmin] = useState(false)
  const [waitlist, setWaitlist] = useState<any[]>([])
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')

  const load = async () => {
    setStatus('Loading…')
    const supabase = supabaseBrowser()
    const { data: session } = await supabase.auth.getSession()
    const token = session.session?.access_token
    if (!token) { setStatus('Please sign in'); return }
    const res = await fetch('/api/admin/waitlist', { headers: { 'Authorization': `Bearer ${token}` } })
    const data = await res.json()
    if (res.status === 403) { setIsAdmin(false); setStatus('You are not an admin.'); return }
    setIsAdmin(true)
    setWaitlist(data.items || [])
    setStatus('')
  }

  useEffect(() => { load() }, [])

  const invite = async (wlEmail?: string, removeId?: string) => {
    setStatus('Inviting…')
    const supabase = supabaseBrowser()
    const { data: session } = await supabase.auth.getSession()
    const token = session.session?.access_token
    const res = await fetch('/api/admin/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ email: wlEmail || email })
    })
    const data = await res.json()
    if (!res.ok) { setStatus(data.error || 'Error'); return }
    if (removeId) await remove(removeId)
    setEmail('')
    load()
  }

  const remove = async (id: string) => {
    const supabase = supabaseBrowser()
    const { data: session } = await supabase.auth.getSession()
    const token = session.session?.access_token
    await fetch('/api/admin/waitlist', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ id })
    })
    load()
  }

  return (
    <div className="container" style={{padding:'24px 0'}}>
      <div className="card">
        <h2>Admin</h2>
        {!isAdmin && <div className="alert">You are not an admin.</div>}
        {isAdmin && (
          <>
            <h3>Invite directly</h3>
            <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <div className="row"><span className="space" /><button onClick={()=>invite()}>Send Invite</button></div>
            <h3 style={{marginTop:24}}>Waitlist</h3>
            <div className="list">
              {waitlist.map(w => (
                <div key={w.id} className="row card">
                  <div className="space">
                    <b>{w.email}</b>
                    {w.note && <div className="muted">{w.note}</div>}
                    <small className="muted">{new Date(w.created_at).toLocaleString()}</small>
                  </div>
                  <button onClick={()=>invite(w.email, w.id)}>Invite</button>
                  <button className="secondary" onClick={()=>remove(w.id)}>Remove</button>
                </div>
              ))}
              {!waitlist.length && <small className="muted">No waitlist entries.</small>}
            </div>
          </>
        )}
        {status && <div className="alert" style={{marginTop:10}}>{status}</div>}
      </div>
    </div>
  )
}
