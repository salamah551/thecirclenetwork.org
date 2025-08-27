'use client'
import RequireActive from '@/components/RequireActive'
import { supabaseBrowser } from '@/lib/supabaseClient'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
export const dynamic = 'force-dynamic'

export default function ThreadPage() {
  const { id } = useParams<{id:string}>()
  const [msgs, setMsgs] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [me, setMe] = useState<string>('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    (async () => {
      const supabase = supabaseBrowser()
      const { data } = await supabase.from('messages').select('*').eq('conversation_id', id).order('created_at', { ascending: true })
      setMsgs(data || [])
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setMe(user.id)
    })()
    const supabase = supabaseBrowser()
    const channel = supabase.channel('messages-'+id).on('postgres_changes', {
      event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${id}`
    }, (payload) => setMsgs(prev => [...prev, payload.new])).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [id])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth'}) }, [msgs])

  const send = async () => {
    if (!input.trim()) return
    const supabase = supabaseBrowser()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('messages').insert({ conversation_id: id, sender_id: user.id, body: input.trim() })
    setInput('')
  }

  return (
    <RequireActive>
      <div className="grid" style={{padding:'24px 0'}}>
        <h1>Conversation</h1>
        <div className="card">
          <div className="list">
            {msgs.map(m => (
              <div key={m.id} className="row">
                <div className="badge">{m.sender_id === me ? 'You' : 'Member'}</div>
                <div className="space">{m.body}</div>
                <small className="muted">{new Date(m.created_at).toLocaleTimeString()}</small>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div className="row" style={{marginTop:12}}>
            <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Write a message…" style={{flex:1}} />
            <button onClick={send}>Send</button>
          </div>
        </div>
      </div>
    </RequireActive>
  )
}
