'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')

  const joinWaitlist = async () => {
    if (!email.trim()) { alert('Enter your email.'); return }
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), note })
    })
    const data = await res.json()
    if (!res.ok) { alert(data.error || 'Something went wrong'); return }
    alert('Added to waitlist. We will reach out by email.')
    setEmail(''); setNote('')
  }

  return (
    <div className="container" style={{padding:'32px 0'}}>
      <div className="grid grid-2">
        <div className="card">
          <h2>Already invited?</h2>
          <p>Use your unique code to create your account.</p>
          <Link href="/invite"><button>Accept Invite</button></Link>
        </div>
        <div className="card">
          <h2>No invite yet? Join the waitlist</h2>
          <input placeholder="Your email" value={email} onChange={e=>setEmail(e.target.value)} />
          <textarea placeholder="Optional note (who you are, what you’re looking for)" value={note} onChange={e=>setNote(e.target.value)} />
          <div className="row"><span className="space" /><button onClick={joinWaitlist}>Join Waitlist</button></div>
        </div>
      </div>
    </div>
  )
}
