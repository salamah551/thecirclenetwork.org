'use client'
import RequireActive from '@/components/RequireActive'
import { supabaseBrowser } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
export const dynamic = 'force-dynamic'

export default function RequestsPage() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [items, setItems] = useState<any[]>([])
  const [posting, setPosting] = useState(false)

  const load = async () => {
    const supabase = supabaseBrowser()
    const { data } = await supabase.from('requests').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }

  useEffect(() => { load() }, [])

  const post = async () => {
    if (!title.trim()) return
    setPosting(true)
    try {
      const supabase = supabaseBrowser()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { alert('Please accept your invite and sign in.'); return }
      const { error } = await supabase.from('requests').insert({ title: title.trim(), body: body.trim(), author_id: user.id })
      if (error) { alert(error.message); return }
      setTitle(''); setBody(''); load()
    } finally {
      setPosting(false)
    }
  }

  return (
    <RequireActive>
      <div className="grid" style={{padding:'24px 0'}}>
        <div className="row"><h1>Requests Board</h1><span className="space" /></div>
        <div className="card">
          <h3>Post a request</h3>
          <div className="grid">
            <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
            <textarea placeholder="Details (optional)" value={body} onChange={e=>setBody(e.target.value)} />
            <div className="row"><span className="space" /><button onClick={post} disabled={posting}>{posting ? 'Posting…' : 'Publish'}</button></div>
          </div>
        </div>
        <div className="list">
          {items.map(i => (
            <div key={i.id} className="card">
              <b>{i.title}</b>
              {i.body && <p>{i.body}</p>}
              <small className="muted">{new Date(i.created_at).toLocaleString()}</small>
            </div>
          ))}
        </div>
      </div>
    </RequireActive>
  )
}
