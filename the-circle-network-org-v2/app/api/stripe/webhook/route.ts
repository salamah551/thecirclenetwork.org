import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })
  const sig = req.headers.get('stripe-signature') as string
  const text = await req.text()
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(text, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature verification failed. ${err.message}` }, { status: 400 })
  }

  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = (session.metadata && (session.metadata as any).user_id) as string | undefined
    if (userId) {
      await admin.from('member_subscriptions').upsert({
        user_id: userId,
        status: 'active',
        stripe_customer_id: (session.customer as string) || null,
        stripe_subscription_id: (session.subscription as string) || null
      })
    }
  }
  if (event.type === 'customer.subscription.deleted' || event.type === 'customer.subscription.updated') {
    const sub = event.data.object as Stripe.Subscription
    const status = sub.status === 'active' || sub.status === 'trialing' ? 'active' : 'canceled'
    const userId = (sub.metadata && (sub.metadata as any).user_id) as string | undefined
    if (userId) {
      await admin.from('member_subscriptions').upsert({
        user_id: userId, status,
        stripe_customer_id: (sub.customer as string) || null,
        stripe_subscription_id: sub.id
      })
    }
  }

  return NextResponse.json({ received: true })
}
