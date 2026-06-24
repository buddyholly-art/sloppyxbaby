import type { Env } from './env';

const FREE_DAILY_LIMIT = 10;

export async function checkFreeLimit(env: Env, ip: string): Promise<{ allowed: boolean; remaining: number }> {
  const key = `rate:${ip}`;
  const now = Date.now();
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const stored = await env.SXB_KV.get(key);
  let record = stored ? JSON.parse(stored) : { date: today, count: 0 };

  if (record.date !== today) {
    record = { date: today, count: 0 };
  }

  if (record.count >= FREE_DAILY_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  // Expire at end of day UTC
  const midnight = new Date(today + 'T23:59:59.999Z').getTime();
  const ttlSeconds = Math.max(60, Math.floor((midnight - now) / 1000));
  await env.SXB_KV.put(key, JSON.stringify(record), { expirationTtl: ttlSeconds });

  return { allowed: true, remaining: FREE_DAILY_LIMIT - record.count };
}

export async function getTier(env: Env, request: Request): Promise<{ tier: 'free' | 'credits' | 'byok'; customerId?: string; byok?: string }> {
  const auth = request.headers.get('Authorization') || '';
  const byok = request.headers.get('X-SXB-OpenAI-Key') || undefined;

  if (byok) {
    return { tier: 'byok', byok };
  }

  if (auth.startsWith('Bearer ')) {
    const customerId = auth.slice(7).trim();
    if (customerId) {
      const credits = await env.SXB_KV.get(`credits:${customerId}`);
      const remaining = credits ? parseInt(credits, 10) : 0;
      if (remaining > 0) {
        return { tier: 'credits', customerId };
      }
    }
  }

  return { tier: 'free' };
}

export async function deductCredit(env: Env, customerId: string): Promise<number> {
  const key = `credits:${customerId}`;
  const current = await env.SXB_KV.get(key);
  const remaining = current ? Math.max(0, parseInt(current, 10) - 1) : 0;
  await env.SXB_KV.put(key, String(remaining));
  return remaining;
}
