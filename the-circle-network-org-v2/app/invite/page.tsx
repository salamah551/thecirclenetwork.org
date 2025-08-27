'use client'
import { useState } from 'react'

export default function InvitePage() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<string|undefined>()

  const accept = async () => {
    setStatus('Creating your account…')
    try {
      const res = await fetch('/api/auth/accept-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error')
      setStatus('Success! You can go to Billing to activate membership.')
    } catch (e:any) {
      setStatus(e.message)
    }
  }

  return (
    <div className="container" style={{padding:'32px 0'}}>
      <div className="card" style={{maxWidth:560}}>
        <h2>Accept Invite</h2>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Invite code" value={code} onChange={e=>setCode(e.target.value)} />
        <input placeholder="Set a password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div className="row"><span className="space" /><button onClick={accept}>Create Account</button></div>
        {status && <div style={{marginTop:12}} className="alert">{status}</div>}
      </div>
    </div>
  )
}
