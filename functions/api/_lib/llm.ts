import type { Env } from './env';

export type Tier = 'free' | 'credits' | 'byok';

export interface LlmRequest {
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
  model?: string;
  jsonMode?: boolean;
  temperature?: number;
  env: Env;
  tier: Tier;
  byok?: string; // OpenAI API key for bring-your-own-key
  customerId?: string;
}

export interface LlmResponse {
  text: string;
  modelUsed: string;
}

export async function callLlm(req: LlmRequest): Promise<LlmResponse> {
  if (req.tier === 'byok' && req.byok) {
    return callOpenAI(req.messages, req.model || 'gpt-4.1-mini', req.byok, req.jsonMode);
  }

  if (req.tier === 'credits') {
    return callOpenAI(req.messages, req.model || 'gpt-4.1-mini', req.env.SXB_OPENAI_API_KEY, req.jsonMode);
  }

  // Free tier -> OpenRouter free models
  const freeModel = req.model || 'meta-llama/llama-3.3-70b-instruct:free';
  return callOpenRouter(req.messages, freeModel, req.env.SXB_OPENROUTER_FREE_KEY, req.jsonMode);
}

async function callOpenAI(
  messages: { role: string; content: string }[],
  model: string,
  apiKey: string,
  jsonMode?: boolean
): Promise<LlmResponse> {
  const body: any = {
    model,
    messages,
    temperature: 0.4,
  };
  if (jsonMode) {
    body.response_format = { type: 'json_object' };
  }
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${text}`);
  }
  const data = await res.json();
  return { text: data.choices?.[0]?.message?.content || '', modelUsed: model };
}

async function callOpenRouter(
  messages: { role: string; content: string }[],
  model: string,
  apiKey: string,
  jsonMode?: boolean
): Promise<LlmResponse> {
  const body: any = {
    model,
    messages,
    temperature: 0.4,
  };
  if (jsonMode) {
    body.response_format = { type: 'json_object' };
  }
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://sloppyxbaby.com',
      'X-Title': 'SloppyXBaby Prompt Advocate',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${text}`);
  }
  const data = await res.json();
  return { text: data.choices?.[0]?.message?.content || '', modelUsed: model };
}
