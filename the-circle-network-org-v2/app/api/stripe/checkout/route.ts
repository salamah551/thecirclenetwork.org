import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.toLowerCase().startsWith('bearer ') ? authHeader.slice(7) : null
    if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 401 })

    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const { data: { user } } = await admin.auth.getUser(token)
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })
    const price = process.env.NEXT_PUBLIC_STRIPE_MEMBERSHIP_PRICE_ID!
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price, quantity: 1 }],
      success_url: `${process.env.APP_URL}/dashboard`,
      cancel_url: `${process.env.APP_URL}/billing`,
      customer_email: user.email || undefined,
      metadata: { user_id: user.id, type: 'membership' }
    })
    return NextResponse.json({ url: session.url })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Stripe error' }, { status: 500 })
  }
}
