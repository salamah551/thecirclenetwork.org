'use client'
import RequireActive from '@/components/RequireActive'
import { supabaseBrowser } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
export const dynamic = 'force-dynamic'

export default function Dashboard() {
  const [requests, setRequests] = useState<any[]>([])
  const [members, setMembers] = useState<any[]>([])

  useEffect(() => {
    (async () => {
      const supabase = supabaseBrowser()
      const { data: reqs } = await supabase.from('requests').select('*').order('created_at', { ascending: false }).limit(10)
      setRequests(reqs || [])
      const { data: profs } = await supabase.from('profiles').select('id, full_name, headline, company, role, location').order('full_name').limit(10)
      setMembers(profs || [])
    })()
  }, [])

  return (
    <RequireActive>
      <div className="grid" style={{padding:'24px 0'}}>
        <div className="row">
          <h1>Dashboard</h1><span className="badge">$199.99/mo</span>
          <span className="space" />
        </div>
        <div className="grid grid-2">
          <div className="card">
            <h2>Latest Requests</h2>
            <div className="list">
              {requests.map(r => (
                <div key={r.id} className="card">
                  <b>{r.title}</b>
                  <p>{r.body}</p>
                  <div className="row">
                    <small className="muted">{new Date(r.created_at).toLocaleString()}</small>
                    <span className="space" />
                    <a href={`/messages/new?to=${r.author_id}`}><button>Message</button></a>
                  </div>
                </div>
              ))}
              {!requests.length && <small className="muted">No requests yet.</small>}
            </div>
          </div>
          <div className="card">
            <h2>Members</h2>
            <div className="list">
              {members.map(m => (
                <div key={m.id} className="row">
                  <div className="avatar">{(m.full_name||'M')[0]}</div>
                  <div className="space">
                    <b>{m.full_name || 'Member'}</b>
                    <div><small className="muted">{m.headline || [m.role,m.company].filter(Boolean).join(' @ ')}</small></div>
                    {m.location && <div><small className="muted">{m.location}</small></div>}
                  </div>
                  <a href={`/messages/new?to=${m.id}`}><button>Message</button></a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RequireActive>
  )
}
