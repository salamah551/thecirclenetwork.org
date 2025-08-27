'use client'
import { supabaseBrowser } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'

export default function BillingPage(){
  const [loading, setLoading] = useState(false)

  const startCheckout = async () => {
    setLoading(true)
    try {
      const supabase = supabaseBrowser()
      const { data: session } = await supabase.auth.getSession()
      const token = session.session?.access_token
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error')
      window.location.href = data.url
    } catch (e:any) {
      alert(e.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="container" style={{padding:'24px 0'}}>
      <div className="card" style={{maxWidth:520}}>
        <h2>Membership</h2>
        <p>One plan, everything included. <b>$199.99/month</b></p>
        <button onClick={startCheckout} disabled={loading}>{loading?'Starting…':'Activate Membership'}</button>
      </div>
    </div>
  )
}
