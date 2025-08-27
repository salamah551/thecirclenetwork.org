'use client'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function RequireActive({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(false)
  const router = useRouter()

  useEffect(() => {
    (async () => {
      const supabase = supabaseBrowser()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/invite'); return }
      const { data, error } = await supabase.from('member_subscriptions').select('status').eq('user_id', user.id).maybeSingle()
      if (error || !data || (data.status !== 'active')) { router.push('/billing'); return }
      setOk(true)
    })()
  }, [router])

  if (!ok) return <div className="container" style={{padding:'24px 0'}}><div className="card">Checking membership…</div></div>
  return <>{children}</>
}
