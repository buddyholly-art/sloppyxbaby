import type { Env } from './_lib/env';
import { callLlm } from './_lib/llm';
import { checkFreeLimit, getTier, deductCredit } from './_lib/rateLimit';
import { PROMPT_COMPILER_SYSTEM } from './_lib/systemPrompts';

export const onRequestPost = async (context: any) => {
  const { request, env } = context;
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const { prompt, model, thinkingMode } = body;
  if (!prompt || typeof prompt !== 'string') {
    return new Response(JSON.stringify({ error: 'prompt is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const tierInfo = await getTier(env, request);

  if (tierInfo.tier === 'free') {
    const { allowed, remaining } = await checkFreeLimit(env, ip);
    if (!allowed) {
      return new Response(
        JSON.stringify({ error: 'Free daily limit reached. Upgrade for more generations.' }),
        { status: 429, headers: { 'Content-Type': 'application/json', 'X-RateLimit-Remaining': '0' } }
      );
    }
  }

  try {
    const llmModel = thinkingMode ? 'o4-mini' : model;
    const result = await callLlm({
      env,
      tier: tierInfo.tier,
      byok: tierInfo.byok,
      model: llmModel,
      jsonMode: true,
      messages: [
        { role: 'system', content: PROMPT_COMPILER_SYSTEM },
        { role: 'user', content: `<user_input>\n${prompt}\n</user_input>\n\nGenerate the advocatePrompt and required JSON fields.` },
      ],
    });

    let data: any;
    try {
      const cleaned = result.text.trim().replace(/^```json\s*|\s*```$/g, '');
      data = JSON.parse(cleaned);
    } catch {
      data = {
        intentDiagnosis: 'Parser fallback: LLM returned non-JSON.',
        llmRiskAnalysis: [],
        advocatePrompt: result.text,
        executionSkeleton: '',
        promptScore: 60,
        caliberStatus: 'standard',
        shouldSaveAdvisory: 'Non-JSON response; inspect manually.',
        reusabilityTags: ['fallback'],
      };
    }

    if (tierInfo.tier === 'credits' && tierInfo.customerId) {
      await deductCredit(env, tierInfo.customerId);
    }

    return new Response(
      JSON.stringify({ result: data, modelUsed: result.modelUsed, rawResponse: result.text, tier: tierInfo.tier }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('generate-prompt error:', err);
    return new Response(JSON.stringify({ error: err.message || 'LLM request failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
