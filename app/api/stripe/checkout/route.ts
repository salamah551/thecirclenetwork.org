// app/api/stripe/checkout/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs'; // Stripe SDK requires Node.js runtime
export const revalidate = 0;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Missing STRIPE_SECRET_KEY');
    }

    // Optional: allow overriding priceId via request body, else use env default
    const body = (await req.json().catch(() => ({}))) as {
      priceId?: string;
      customerEmail?: string;
      metadata?: Record<string, string>;
    };

    const priceId =
      body.priceId || process.env.NEXT_PUBLIC_STRIPE_MEMBERSHIP_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Missing Stripe price ID.' },
        { status: 400 }
      );
    }

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/billing/cancelled`,
      allow_promotion_codes: true,
      customer_email: body.customerEmail,
      metadata: body.metadata,
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Unknown Stripe error';
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
