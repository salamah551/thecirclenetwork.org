'use client'
import RequireActive from '@/components/RequireActive'
import { supabaseBrowser } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
export const dynamic = 'force-dynamic'

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([])
  const [q, setQ] = useState('')

  const load = async (text?: string) => {
    const supabase = supabaseBrowser()
    let query = supabase.from('profiles').select('id, full_name, headline, company, role, location').order('full_name')
    if (text && text.trim()) {
      query = supabase.rpc('search_profiles', { query: text.trim() }) as any
    }
    const { data } = await query
    setMembers(data || [])
  }

  useEffect(() => { load() }, [])

  return (
    <RequireActive>
      <div className="grid" style={{padding:'24px 0'}}>
        <div className="row">
          <h1>Members</h1>
          <span className="space" />
          <div className="row">
            <input placeholder="Search name, company, role…" value={q} onChange={e=>setQ(e.target.value)} />
            <button className="secondary" onClick={()=>load(q)}>Search</button>
          </div>
        </div>
        <div className="list">
          {members.map(m => (
            <div key={m.id} className="card">
              <div className="row">
                <div className="avatar">{(m.full_name||'M')[0]}</div>
                <div className="space">
                  <b>{m.full_name || 'Member'}</b>
                  <div><small className="muted">{m.headline || [m.role,m.company].filter(Boolean).join(' @ ')}</small></div>
                  {m.location && <div><small className="muted">{m.location}</small></div>}
                </div>
                <a href={`/messages/new?to=${m.id}`}><button>Message</button></a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RequireActive>
  )
}
