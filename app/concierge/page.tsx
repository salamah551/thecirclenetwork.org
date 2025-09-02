'use client'
import { useState } from 'react'
import RequireActive from '@/components/RequireActive'
import { supabaseBrowser } from '@/lib/supabaseClient'

export default function ConciergePage(){
  const [form, setForm] = useState({ title:'', ask:'', intro_to:'', urgency:'normal' })
  const [status, setStatus] = useState<string|undefined>()

  const submit = async () => {
    setStatus('Submitting…')
    try {
      const supabase = supabaseBrowser()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Please sign in')
      const { error } = await supabase.from('concierge_requests').insert({
        requester_id: user.id, title: form.title, ask: form.ask, intro_to: form.intro_to, urgency: form.urgency
      })
      if (error) throw error
      setStatus('Received. Our concierge will follow up.')
      setForm({ title:'', ask:'', intro_to:'', urgency:'normal' })
    } catch (e:any) {
      setStatus(e.message)
    }
  }

  return (
    <RequireActive>
      <div className="container" style={{padding:'24px 0'}}>
        <div className="card" style={{maxWidth:720}}>
          <h2>Concierge Request</h2>
          <label>Title</label>
          <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
          <label>What do you need?</label>
          <textarea value={form.ask} onChange={e=>setForm({...form, ask:e.target.value})} />
          <label>Anyone specific? (Optional)</label>
          <input value={form.intro_to} onChange={e=>setForm({...form, intro_to:e.target.value})} />
          <label>Urgency</label>
          <select value={form.urgency} onChange={e=>setForm({...form, urgency:e.target.value})}>
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <div className="row" style={{marginTop:12}}><span className="space" /><button onClick={submit}>Submit</button></div>
          {status && <div className="alert" style={{marginTop:10}}>{status}</div>}
        </div>
      </div>
    </RequireActive>
  )
}
