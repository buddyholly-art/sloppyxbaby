import type { Env } from './_lib/env';

export const onRequestPost = async (context: any) => {
  const { request, env } = context;

  if (!env.SXB_STRIPE_SECRET_KEY || !env.SXB_STRIPE_PRICE_CREDIT_PACK) {
    return new Response(JSON.stringify({ error: 'Stripe is not configured' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
  }

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    // allow empty body
  }

  const domain = new URL(request.url).origin;

  const params = new URLSearchParams();
  params.append('mode', 'payment');
  params.append('payment_method_types[]', 'card');
  params.append('line_items[0][price]', env.SXB_STRIPE_PRICE_CREDIT_PACK);
  params.append('line_items[0][quantity]', '1');
  params.append('success_url', `${domain}/thanks?session_id={CHECKOUT_SESSION_ID}`);
  params.append('cancel_url', `${domain}/`);
  params.append('client_reference_id', body.customerId || crypto.randomUUID());

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.SXB_STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Stripe checkout error:', text);
    return new Response(JSON.stringify({ error: 'Stripe checkout failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  const session = await res.json();
  return new Response(JSON.stringify({ url: session.url, id: session.id }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
