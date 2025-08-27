'use client'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabaseClient'
import RequireActive from '@/components/RequireActive'

export default function SettingsPage(){
  const [form, setForm] = useState({ full_name:'', headline:'', company:'', role:'', location:'', bio:'', avatar_url:'' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { (async () => {
    const supabase = supabaseBrowser()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
    if (data) setForm({ full_name: data.full_name||'', headline:data.headline||'', company:data.company||'', role:data.role||'', location:data.location||'', bio:data.bio||'', avatar_url:data.avatar_url||'' })
  })() }, [])

  const save = async () => {
    setSaving(true)
    try {
      const supabase = supabaseBrowser()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { error } = await supabase.from('profiles').update(form).eq('id', user.id)
      if (error) { alert(error.message); return }
      alert('Saved')
    } finally { setSaving(false) }
  }

  const on = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.value })

  return (
    <RequireActive>
      <div className="container" style={{padding:'24px 0'}}>
        <div className="card" style={{maxWidth:720}}>
          <h2>Profile Settings</h2>
          <label>Full name</label>
          <input value={form.full_name} onChange={on('full_name')} />
          <label>Headline</label>
          <input value={form.headline} onChange={on('headline')} />
          <div className="grid grid-2">
            <div>
              <label>Company</label>
              <input value={form.company} onChange={on('company')} />
            </div>
            <div>
              <label>Role</label>
              <input value={form.role} onChange={on('role')} />
            </div>
          </div>
          <label>Location</label>
          <input value={form.location} onChange={on('location')} />
          <label>Bio</label>
          <textarea value={form.bio} onChange={on('bio')} />
          <label>Avatar URL (optional)</label>
          <input value={form.avatar_url} onChange={on('avatar_url')} />
          <div className="row"><span className="space" /><button onClick={save} disabled={saving}>{saving?'Saving…':'Save'}</button></div>
        </div>
      </div>
    </RequireActive>
  )
}
