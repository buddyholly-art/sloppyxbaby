import type { KVNamespace } from '@cloudflare/workers-types';

export interface Env {
  SXB_KV: KVNamespace;
  SXB_OPENROUTER_FREE_KEY: string;
  SXB_OPENAI_API_KEY: string;
  SXB_STRIPE_SECRET_KEY: string;
  SXB_STRIPE_PUBLISHABLE_KEY: string;
  SXB_STRIPE_WEBHOOK_SECRET: string;
  SXB_STRIPE_PRICE_CREDIT_PACK: string;
  APP_NAME?: string;
}
