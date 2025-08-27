'use client'
import { useState } from 'react'
import { supabaseBrowser } from '@/lib/supabaseClient'

export default function AuthPage(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<string|undefined>()

  const signIn = async () => {
    setStatus('Signing in…')
    const supabase = supabaseBrowser()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setStatus(error.message); return }
    window.location.href = '/dashboard'
  }

  return (
    <div className="container" style={{padding:'32px 0'}}>
      <div className="card" style={{maxWidth:420}}>
        <h2>Sign in</h2>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div className="row"><span className="space" /><button onClick={signIn}>Sign In</button></div>
        {status && <div className="alert" style={{marginTop:10}}>{status}</div>}
      </div>
    </div>
  )
}
