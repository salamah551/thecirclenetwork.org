'use client'
import { supabaseBrowser } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function UserMenu(){
  const [email, setEmail] = useState<string|null>(null)
  useEffect(() => { (async () => {
    const supabase = supabaseBrowser()
    const { data: { user } } = await supabase.auth.getUser()
    setEmail(user?.email ?? null)
  })() }, [])

  const signOut = async () => {
    const supabase = supabaseBrowser()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (!email) return <Link href="/auth">Sign In</Link>
  return (
    <div className="row" style={{gap:8}}>
      <span className="badge">{email}</span>
      <button className="ghost" onClick={signOut}>Sign out</button>
    </div>
  )
}
