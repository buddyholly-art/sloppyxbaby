import type { Env } from './_lib/env';
import { callLlm } from './_lib/llm';
import { checkFreeLimit, getTier, deductCredit } from './_lib/rateLimit';
import { CHAT_SYSTEM } from './_lib/systemPrompts';

export const onRequestPost = async (context: any) => {
  const { request, env } = context;
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const { messages, mode, model, thinkingMode } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: 'messages array is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const tierInfo = await getTier(env, request);

  if (tierInfo.tier === 'free') {
    const { allowed, remaining } = await checkFreeLimit(env, ip);
    if (!allowed) {
      return new Response(
        JSON.stringify({ error: 'Free daily limit reached. Upgrade for more chats.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  const modeDirective =
    mode === 'replyPrompts'
      ? 'The user is sharing a disappointing output from another LLM. Audit it for neurotypical blind spots, AI slop, and context-engineering failures, then write a Direct Corrective Reply Prompt in a markdown code block.'
      : 'Engage in warm co-design conversation. Write any prompts you create inside markdown code fences with XML delimiters.';

  try {
    const llmModel = thinkingMode ? 'o4-mini' : model;
    const result = await callLlm({
      env,
      tier: tierInfo.tier,
      byok: tierInfo.byok,
      model: llmModel,
      jsonMode: false,
      messages: [
        { role: 'system', content: `${CHAT_SYSTEM}\n\n${modeDirective}` },
        ...messages,
      ],
    });

    if (tierInfo.tier === 'credits' && tierInfo.customerId) {
      await deductCredit(env, tierInfo.customerId);
    }

    return new Response(
      JSON.stringify({ reply: result.text, modelUsed: result.modelUsed, tier: tierInfo.tier }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('conversational-chat error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Chat request failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
