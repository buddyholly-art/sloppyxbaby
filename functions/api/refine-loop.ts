import type { Env } from './_lib/env';
import { callLlm } from './_lib/llm';
import { checkFreeLimit, getTier, deductCredit } from './_lib/rateLimit';
import { REFINEMENT_SYSTEM } from './_lib/systemPrompts';

export const onRequestPost = async (context: any) => {
  const { request, env } = context;
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const { originalPrompt, currentAdvocatePrompt, workerResponse, model, thinkingMode } = body;
  if (!workerResponse || typeof workerResponse !== 'string') {
    return new Response(JSON.stringify({ error: 'workerResponse is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const tierInfo = await getTier(env, request);

  if (tierInfo.tier === 'free') {
    const { allowed } = await checkFreeLimit(env, ip);
    if (!allowed) {
      return new Response(
        JSON.stringify({ error: 'Free daily limit reached. Upgrade for more audits.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  const contents = `ORIGINAL USER INTENT:\n${originalPrompt || 'Not provided'}\n\nLATEST ADVOCATE PROMPT DESIRED SPEC:\n${currentAdvocatePrompt || 'Not provided'}\n\nPASTED WORKER LLM RESPONSE TO AUDIT:\n${workerResponse}`;

  try {
    const llmModel = thinkingMode ? 'o4-mini' : model;
    const result = await callLlm({
      env,
      tier: tierInfo.tier,
      byok: tierInfo.byok,
      model: llmModel,
      jsonMode: true,
      messages: [
        { role: 'system', content: REFINEMENT_SYSTEM },
        { role: 'user', content: contents },
      ],
    });

    let data: any;
    try {
      const cleaned = result.text.trim().replace(/^```json\s*|\s*```$/g, '');
      data = JSON.parse(cleaned);
    } catch {
      data = {
        evaluation: 'Parser fallback.',
        revisedPrompt: result.text,
        workerMetaCommentary: '',
        advocateMetaCommentary: '',
        isTaskDone: false,
      };
    }

    if (tierInfo.tier === 'credits' && tierInfo.customerId) {
      await deductCredit(env, tierInfo.customerId);
    }

    return new Response(
      JSON.stringify({ result: data, modelUsed: result.modelUsed, tier: tierInfo.tier }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('refine-loop error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Refinement audit failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
