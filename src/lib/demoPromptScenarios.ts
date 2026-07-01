export type DemoCognitiveAnalog = {
  label: string;
  humanParallel: string;
  llmParallel: string;
  insight: string;
  mitigation: string;
  cite: string;
  scaffolds: string[];
  metricLabels: {
    combined: string;
    executive: string;
    wmOverflow: string;
    confabulation: string;
  };
};

export type DemoAuditResult = {
  impulsivityScore: number;
  bloatScore: number;
  flags: string[];
  summary: string;
};

export type DemoPromptScenario = {
  id: string;
  label: string;
  tag: string;
  sloppyPrompt: string;
  cognitive: DemoCognitiveAnalog;
  audit: DemoAuditResult;
  compiledPrefix: string;
  compiledBody: string;
};

export const DEMO_PROMPT_SCENARIOS: DemoPromptScenario[] = [
  {
    id: 'auth-bug',
    label: 'Vague auth bug',
    tag: 'Most common',
    sloppyPrompt:
      'fix my login it logs me out randomly maybe cookies?? just make it work idk',
    cognitive: {
      label: 'Executive function + confabulation',
      humanParallel:
        'Barkley: inhibition is downstream of working memory — without held constraints, you hedge ("idk") and reach for the first plausible fix.',
      llmParallel:
        'Fuzzy-Trace / DRM parallel: missing verbatim detail forces gist completion — the model invents a coherent cookie/session story that fits the vibe.',
      insight:
        'You and the model are both pattern-completing under constraint failure. "Maybe cookies??" is human gist; the model will do the same with session middleware.',
      mitigation:
        'Externalize repro steps and done-when checks at the point of performance — same scaffold as re-injecting system constraints before generation.',
      cite: 'Barkley · executive function model · Soliman & Elfar (2017) · Fuzzy-Trace Theory',
      scaffolds: [
        'Reproduction block (verbatim steps)',
        'Done-when checklist',
        'Constraints bookended at top',
        'Point-of-performance rules',
      ],
      metricLabels: {
        combined: 'Combined cognitive risk',
        executive: 'Executive load',
        wmOverflow: 'WM overflow',
        confabulation: 'Confabulation pressure',
      },
    },
    audit: {
      impulsivityScore: 78,
      bloatScore: 12,
      flags: [
        'Inhibition without held constraints — hedging ("idk", "just make it work")',
        'Gist over verbatim — symptom named, repro missing',
        'No environment anchor — stack/deploy target absent',
        'Confabulation-ready gap — model will invent a cookie fix',
      ],
      summary:
        'High executive load, high confabulation risk. The model will not reproduce your bug — it will narrate a plausible auth fix.',
    },
    compiledPrefix: 'SXB · compiled spec',
    compiledBody: `## Objective
Diagnose intermittent logout after login. Restore a stable authenticated session without regressing security.

## Context
- Symptom: user is logged out unexpectedly (frequency unknown)
- Hypothesis mentioned: cookie/session handling
- Stack: [USER: fill in framework + auth library]

## Reproduction (required before fixes)
1. Login with test account
2. Note exact action before logout (navigation, idle time, tab switch)
3. Capture: browser, deploy target (local/staging/prod), auth provider

## Constraints
- Do not disable CSRF/session checks as a shortcut
- Prefer minimal diff; explain root cause before patching

## Done when
- [ ] Repro steps documented
- [ ] Root cause identified (cookie expiry, rotation, domain, TTL, etc.)
- [ ] Fix verified across two browsers`,
  },
  {
    id: 'dashboard-feature',
    label: 'Feature dump',
    tag: 'Scope creep',
    sloppyPrompt:
      'build me a dashboard with charts and export and dark mode and make it fast and also add auth and billing',
    cognitive: {
      label: 'Monotropic split + WM overflow',
      humanParallel:
        'Monotropism: attention tunnels through one channel. Six deliverables in one breath forces a monotropic split — each item competes for the same working-memory slot.',
      llmParallel:
        'CatAttack / distractibility: every feature token attends to every other token. Charts, billing, and dark mode bleed into each other; reasoning depth collapses.',
      insight:
        'This is not ambition — it is channel collision. You overloaded the attention tunnel; the model will skim the list and ship the shallowest intersection.',
      mitigation:
        'Micro-step to Phase 1 only; vault the backlog externally (RAG / ticket list) so the active buffer holds one monotropic thread.',
      cite: 'Murray, Lesser & Lawson (2005) · Monotropism · CatAttack (2024) · Liu · Lost in the Middle',
      scaffolds: [
        'Phase 1 scope lock',
        'Explicit out-of-scope backlog',
        'Single-thread objective',
        'Done-when per phase',
      ],
      metricLabels: {
        combined: 'Combined cognitive risk',
        executive: 'Channel collision',
        wmOverflow: 'WM overflow',
        confabulation: 'Shallow-completion risk',
      },
    },
    audit: {
      impulsivityScore: 65,
      bloatScore: 71,
      flags: [
        'Monotropic split — six channels in one prompt',
        'No priority order — middle items will be lost',
        'Distractibility tax — unrelated features attend to each other',
        'Time-blind scope — "fast" has no temporal anchor',
      ],
      summary:
        'Classic attention-tunnel collapse. Mid-list features (auth, billing) will land in the "lost in the middle" dead zone for both you and the model.',
    },
    compiledPrefix: 'SXB · compiled spec',
    compiledBody: `## Objective
Ship **Phase 1** of an analytics dashboard: one chart, one table, CSV export. Defer auth, billing, and dark mode.

## Phase 1 scope (this thread only)
- Single overview chart (metric + date range)
- Sortable table beneath chart
- Export current view to CSV

## Out of scope (explicit backlog)
- Authentication / roles
- Billing
- Dark mode theming
- Performance work beyond "no obvious N+1 on first load"

## Constraints
- Use existing design tokens / component library
- No new charting dependency without approval

## Done when
- [ ] Chart renders from seeded or mocked data
- [ ] Export downloads CSV matching visible filters
- [ ] Backlog items listed as follow-up tickets, not implemented`,
  },
  {
    id: 'refactor-entire-app',
    label: 'Giant refactor',
    tag: 'High risk',
    sloppyPrompt:
      'refactor the whole app to clean architecture and fix all the tech debt and update dependencies',
    cognitive: {
      label: 'Time blindness + task initiation failure',
      humanParallel:
        'Time blindness: "whole app" and "all tech debt" live in "Not Now" until they become emergencies. Prospective timing collapses — the task feels abstract, so initiation never fires.',
      llmParallel:
        'Context-window anterograde amnesia: an unbounded refactor exceeds effective working memory. Mid-sequence constraints (test safety, migration order) fall off the edge.',
      insight:
        'You asked for a future-you problem in present-you words. The model will mirror that with a mega-diff that forgets rollback rules buried in the middle.',
      mitigation:
        'Task initiation scaffold: one vertical slice, first 5 actions under 2 minutes, characterization tests before moves — micro-stepping for both brains.',
      cite: 'Barkley · time blindness & point of performance · Liu et al. · Lost in the Middle (2023)',
      scaffolds: [
        'Single vertical slice',
        'Strangler pattern boundary',
        'Test safety net before moves',
        'Per-PR rollback notes',
      ],
      metricLabels: {
        combined: 'Combined cognitive risk',
        executive: 'Initiation paralysis',
        wmOverflow: 'Context decay',
        confabulation: 'Mega-diff risk',
      },
    },
    audit: {
      impulsivityScore: 82,
      bloatScore: 58,
      flags: [
        'Temporal myopia — unbounded "whole app" scope',
        'No micro-steps — task initiation blocked',
        'Mid-context rules will decay — migration order unspecified',
        'Architecture + deps conflated — two channels, one tunnel',
      ],
      summary:
        'Abstract "Not Now" scope. Without a slice and externalized plan, both you and the model will produce a risky, unreproducible mega-diff.',
    },
    compiledPrefix: 'SXB · compiled spec',
    compiledBody: `## Objective
Reduce tech debt in **one vertical slice** (e.g. checkout flow) using strangler pattern — not a whole-app rewrite.

## Context
- Pain: mixed layers, hard-to-test modules, stale deps in [USER: package name]
- Target slice: [USER: e.g. \`src/features/checkout/\`]

## Approach
1. Inventory deps used only by target slice
2. Introduce ports/adapters at slice boundary only
3. Add characterization tests before moves
4. Bump deps with changelog review per package

## Constraints
- No drive-by renames outside slice
- Each PR must leave main green

## Done when
- [ ] Slice has clear inbound/outbound boundaries
- [ ] Tests cover previous behavior
- [ ] Dependency bumps isolated with rollback notes`,
  },
  {
    id: 'almost-there',
    label: 'Almost structured',
    tag: 'Low impulsivity',
    sloppyPrompt: `Bug: Stripe webhook returns 400 on checkout.session.completed in staging.
Steps: deploy preview → test card 4242 → webhook logs show invalid signature.
Want: fix verification, add test, don't change prod secrets.`,
    cognitive: {
      label: 'Hyper-systemizing (native LLM interface)',
      humanParallel:
        'Baron-Cohen systemizing: you isolated variables — symptom, environment, repro path, constraint. This is the autistic communication style that maps input→output rules.',
      llmParallel:
        'Explicit constraints at primacy/recency positions. Mid-context decay is low because the prompt is short and literal — Theory-of-Mind filler is absent.',
      insight:
        'You are already speaking the model\'s native language. The compiler\'s job here is bookending and vaulting — not translating vagueness into structure.',
      mitigation:
        'Encode done-when checks and environment locks; vault this spec so the next session restores verbatim state (Baddeley offload).',
      cite: 'Baron-Cohen · E-S theory · PNAS mega-study (n≈671,000) · Baddeley · working memory model',
      scaffolds: [
        'Environment lock (staging only)',
        'Repro path preserved verbatim',
        'Done-when verification gates',
        'Prod constraint bookended',
      ],
      metricLabels: {
        combined: 'Combined cognitive risk',
        executive: 'Executive load',
        wmOverflow: 'WM overflow',
        confabulation: 'Confabulation pressure',
      },
    },
    audit: {
      impulsivityScore: 22,
      bloatScore: 18,
      flags: [
        'Hyper-explicit — symptom, env, repro present',
        'Low gist reliance — verbatim detail dominates',
        'Constraint bookended — prod secrets protected',
        'Compiler adds done-when, not rescue',
      ],
      summary:
        'Low risk across the board. This is what AuDHD-explicit communication looks like when it meets an LLM — structure is already there; vault it.',
    },
    compiledPrefix: 'SXB · compiled spec',
    compiledBody: `## Objective
Fix Stripe webhook signature verification for \`checkout.session.completed\` in **staging** only.

## Reproduction
1. Deploy preview / staging
2. Complete checkout with test card 4242
3. Observe 400 on webhook — logs cite invalid signature

## Constraints
- Do not rotate or expose production webhook secrets
- Staging must use staging signing secret from env

## Implementation notes
- Verify raw body is passed to Stripe signature check (no JSON re-parse)
- Align endpoint path with Stripe dashboard configuration

## Done when
- [ ] Webhook returns 2xx for valid staging events
- [ ] Test covers bad signature + good signature paths
- [ ] Prod configuration untouched`,
  },
];

export function getDemoScenario(id: string): DemoPromptScenario | undefined {
  return DEMO_PROMPT_SCENARIOS.find((s) => s.id === id);
}

export function formatCompiledPrompt(scenario: DemoPromptScenario): string {
  const scaffoldLine = scenario.cognitive.scaffolds.join(' · ');
  return `${scenario.compiledPrefix}\nScaffolds applied: ${scaffoldLine}\n\n${scenario.compiledBody}`;
}