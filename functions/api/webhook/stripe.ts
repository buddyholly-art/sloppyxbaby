import type { Env } from '../_lib/env';

const CREDITS_PER_PACK = 50;

async function verifyStripeSignature(payload: string, signature: string, secret: string): Promise<any | null> {
  const parts = signature.split(',').map((s) => s.trim());
  const timestampPart = parts.find((p) => p.startsWith('t='));
  const sigPart = parts.find((p) => p.startsWith('v1='));
  if (!timestampPart || !sigPart) return null;

  const timestamp = timestampPart.slice(2);
  const sig = sigPart.slice(3);

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signed = await crypto.subtle.sign('HMAC', key, encoder.encode(`${timestamp}.${payload}`));
  const expected = Array.from(new Uint8Array(signed))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  if (sig !== expected) return null;

  // Check timestamp tolerance (5 min)
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp, 10)) > 300) return null;

  return JSON.parse(payload);
}

export const onRequestPost = async (context: any) => {
  const { request, env } = context;

  const signature = request.headers.get('Stripe-Signature') || '';
  const payload = await request.text();

  if (!env.SXB_STRIPE_WEBHOOK_SECRET) {
    return new Response('Webhook secret not configured', { status: 500 });
  }

  const event = await verifyStripeSignature(payload, signature, env.SXB_STRIPE_WEBHOOK_SECRET);
  if (!event) {
    return new Response('Invalid signature', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerId = session.client_reference_id || session.customer;
    if (customerId) {
      const key = `credits:${customerId}`;
      const current = await env.SXB_KV.get(key);
      const total = (current ? parseInt(current, 10) : 0) + CREDITS_PER_PACK;
      await env.SXB_KV.put(key, String(total));
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
