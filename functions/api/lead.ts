import type { Env } from './_lib/env';

export const onRequestPost = async (context: any) => {
  const { request, env } = context;

  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const { email, source } = body;
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return new Response(JSON.stringify({ error: 'Valid email is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const id = crypto.randomUUID();
  await env.SXB_KV.put(
    `lead:${id}`,
    JSON.stringify({ email, source: source || 'cheatsheet', createdAt: new Date().toISOString() })
  );

  return new Response(JSON.stringify({ success: true, id }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
