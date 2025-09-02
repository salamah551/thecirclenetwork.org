'use client'
import RequireActive from '@/components/RequireActive'
import { supabaseBrowser } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
export const dynamic = 'force-dynamic'

type Conversation = { id: string, user_a_id: string, user_b_id: string }

export default function MessagesHome() {
  const [convos, setConvos] = useState<Conversation[]>([])
  const [me, setMe] = useState<string>('')

  useEffect(() => {
    (async () => {
      const supabase = supabaseBrowser()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setMe(user.id)
      const { data } = await supabase.from('conversations').select('*')
      setConvos(data as Conversation[] || [])
    })()
  }, [])

  return (
    <RequireActive>
      <div className="grid" style={{padding:'24px 0'}}>
        <h1>Messages</h1>
        <div className="list">
          {convos.map(c => {
            const other = c.user_a_id === me ? c.user_b_id : c.user_a_id
            return <a key={c.id} href={`/messages/${c.id}`} className="card">Conversation with {other.slice(0,8)}…</a>
          })}
          {!convos.length && <small className="muted">No conversations yet.</small>}
        </div>
      </div>
    </RequireActive>
  )
}
