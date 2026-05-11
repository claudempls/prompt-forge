import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const admin = createAdminClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    let userId = session.metadata?.supabase_user_id ?? session.client_reference_id

    if (!userId && session.subscription) {
      try {
        const subscription = await stripe.subscriptions.retrieve(session.subscription)
        userId = subscription.metadata?.supabase_user_id
      } catch (e) {
        console.error('[webhook] failed to retrieve subscription:', e.message)
      }
    }

    if (!userId) {
      const { data: profile } = await admin
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', session.customer)
        .maybeSingle()
      userId = profile?.id
    }

    if (userId) {
      await admin
        .from('profiles')
        .update({
          plan: 'pro',
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
        })
        .eq('id', userId)
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object
    const userId = subscription.metadata?.supabase_user_id

    if (userId) {
      await admin
        .from('profiles')
        .update({ plan: 'free', stripe_subscription_id: null })
        .eq('id', userId)
    } else {
      // Fallback: look up by customer id
      const customerId = subscription.customer
      await admin
        .from('profiles')
        .update({ plan: 'free', stripe_subscription_id: null })
        .eq('stripe_customer_id', customerId)
    }
  }

  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object
    if (subscription.status === 'active') {
      const userId = subscription.metadata?.supabase_user_id
      if (userId) {
        await admin
          .from('profiles')
          .update({ plan: 'pro', stripe_subscription_id: subscription.id })
          .eq('id', userId)
      }
    }
  }

  return NextResponse.json({ received: true })
}
