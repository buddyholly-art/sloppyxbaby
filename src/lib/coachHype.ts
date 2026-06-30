export type BuilderConcept = {
  id: number;
  name: string;
  source: string;
  accent: string;
  body: string;
  question: string;
  coach: {
    hook: string;
    tangent?: string;
    pivot: string;
    stat?: string;
    cite: string;
  };
};

export const COACH_HYPE_TAGLINE =
  'Smart friend energy. Zero toxic positivity. Every punchline lands on a citation.';

export const COACH_HYPE_MISSION = {
  headline: 'Your brain and your LLM share the same failure modes.',
  body: 'Transformer attention bleeds like an ADHD Default Mode Network. Context windows overflow like working memory. Models confabulate like gist-heavy recall. SloppyXBaby is the external scaffolding both systems need — point-of-performance rules, offloaded state, and prompts explicit enough for a monotropic mind.',
  stat: 'Meta-analyses put ADHD working-memory impairment at Cohen\'s d ≈ 0.69–0.74 versus neurotypical controls.',
  cite: 'Barkley executive-function model · ADHD working-memory literature',
};

export const COACH_HYPE_PAIN_POINTS = [
  {
    label: 'Working memory overflow',
    symptom: 'You remember the first instruction and the last panic — the middle evaporates.',
    stat: 'Cohen\'s d 0.69–0.74 on WM deficits',
    cite: 'ADHD meta-analyses · Barkley',
  },
  {
    label: 'Lost in the middle',
    symptom: 'Bury a constraint mid-prompt and both you and the model act like it never existed.',
    stat: '>30% accuracy collapse mid-context',
    cite: 'Liu et al., Stanford · Lost in the Middle (2023)',
  },
  {
    label: 'Distractibility tax',
    symptom: 'One irrelevant sentence — cat trivia, shiny sidebar — and reasoning derails.',
    stat: '300%+ error spike on math reasoning',
    cite: 'CatAttack · DeepSeek R1 & OpenAI o1 studies (2024)',
  },
  {
    label: 'Time blindness',
    symptom: '"Now" and "Not Now." Deadlines stay abstract until they become emergencies.',
    stat: '500–1000% duration-estimate error in LLMs',
    cite: 'Tan, Tan & Soatto (2026) · TimeSpeak benchmarks',
  },
  {
    label: 'Confabulation drift',
    symptom: 'Pattern completion fills gaps with a story that feels true because it fits the vibe.',
    stat: 'DRM false-memory effect d ≈ 0.69+ in ADHD adults',
    cite: 'Soliman & Elfar (2017) · Fuzzy-Trace Theory',
  },
  {
    label: 'Monotropic split',
    symptom: 'Context-switch mid-thread and the whole attention tunnel collapses.',
    stat: 'MQ validated on 1,110 participants',
    cite: 'Murray, Lesser & Lawson · Monotropism theory (2005)',
  },
] as const;

export const BUILDER_CONCEPTS: BuilderConcept[] = [
  {
    id: 1,
    name: 'Externalized Memory',
    source: 'Alan Baddeley · Working Memory Model',
    accent: 'Memory Vault',
    body: 'Your working memory is smaller than the model context window. Offload task state, specs, and session headers into durable external stores.',
    question: 'Can you resume your last coding task in under 5 seconds without re-reading chat history?',
    coach: {
      hook: 'Object permanence failure is not a moral flaw — it is a bandwidth problem.',
      tangent: 'If the spec lives only in chat, you will re-discover the doom pile every Monday.',
      pivot: 'Barkley\'s point-of-performance rule: behavior rules must sit where the behavior happens. Vaults and session files are your synthetic hippocampus.',
      stat: 'RAG mirrors human second-brain offloading — state outside the active buffer.',
      cite: 'Barkley · Baddeley working-memory model',
    },
  },
  {
    id: 2,
    name: 'Executive Guardrails',
    source: 'Russell Barkley · Executive Function',
    accent: 'Impulsivity Shield',
    body: 'ADHD is an executive function deficit. Guidance must be externalized, visual, and rollback-safe — not vibes and hope.',
    question: 'Do your prompts enforce validation gates, error recovery, and reversible state before shipping?',
    coach: {
      hook: 'Executive dysfunction parity: you can architect the whole product and still forget to save the file.',
      pivot: 'Inhibition is downstream of working memory. No mental workspace for constraints means no impulse control — for you or the model.',
      stat: 'Guardrails must be ≥95% explicit; implied context is neurotypical fiction.',
      cite: 'Russell Barkley · Medical University of South Carolina',
    },
  },
  {
    id: 3,
    name: 'One Clear Next Step',
    source: 'CAST UDL Guidelines',
    accent: 'Intent Router',
    body: 'Choice paralysis destroys action. Every surface should expose exactly one recommended default next step.',
    question: 'Does your workspace show one obvious recommended action instead of a wall of equal options?',
    coach: {
      hook: 'Six equal buttons is not freedom — it is analysis paralysis with better typography.',
      pivot: 'UDL: one clear default next step, multiple means of engagement. Tunneling beats option grids for initiation energy.',
      cite: 'CAST Universal Design for Learning Guidelines',
    },
  },
  {
    id: 4,
    name: 'Low-Arousal Surfaces',
    source: 'Winnie Dunn · Sensory Processing',
    accent: 'Soft Premium UI',
    body: 'Flashing telemetry, alarm colors, and metric spam exhaust working memory. Calm surfaces preserve focus bandwidth.',
    question: 'Are your tools free of urgent badges, fake stats, and high-arousal visual noise?',
    coach: {
      hook: 'Fake metrics and purple gradients are dopamine bait — not information.',
      pivot: 'Sensory load is cognitive load. Low-arousal UI is not aesthetic preference; it is working-memory conservation.',
      cite: 'Winnie Dunn · University of Kansas Medical Center',
    },
  },
  {
    id: 5,
    name: 'CapEx Discipline',
    source: 'Andrej Karpathy · TCO',
    accent: 'SSOT Auditor',
    body: 'Code is a liability: money (tokens), space (context weight), and maintenance (debugging debt). Every line must earn its keep.',
    question: 'Do you audit new features for duplicate schemas, redundant files, and prompt bloat before building?',
    coach: {
      hook: 'Shiny-object syndrome, but make every file a permanent maintenance subscription.',
      pivot: 'Karpathy: code costs money, space, and maintenance over time. CapEx discipline means deleting before you duplicate.',
      cite: 'Andrej Karpathy · TCO framing',
    },
  },
  {
    id: 6,
    name: 'OpEx Awareness',
    source: 'Token economics · CatAttack research',
    accent: 'TCO Board',
    body: 'Subscriptions compound. Track per-loop token cost, model tier routing, and whether a cheaper pass would suffice.',
    question: 'Can you see what each agent loop costs before you run another spin?',
    coach: {
      hook: 'Another agent loop feels free until the invoice teaches temporal economics.',
      tangent: 'Cat fact in your math prompt: errors up 300%. That is OpEx with comedy.',
      pivot: 'Track tokens per loop. Route by task tier. Distraction is a billable event for both brains.',
      stat: 'Irrelevant tokens can more than triple reasoning failures.',
      cite: 'CatAttack · LRM distraction studies (2024)',
    },
  },
  {
    id: 7,
    name: 'The Harness',
    source: 'BYOK architecture',
    accent: 'Bring Your Own Key',
    body: 'You own the keys, routes, and upstream providers. The workspace supplies cognitive guardrails — not compute markups.',
    question: 'Are your API keys local, rotatable, and routed by task tier instead of one default model?',
    coach: {
      hook: 'You would not let a life coach hold your bank PIN — why let a SaaS hold your API keys?',
      pivot: 'The Harness keeps routes local and wholesale. We sell scaffolding, not compute markup.',
      cite: 'SloppyXBaby architecture · BYOK policy',
    },
  },
  {
    id: 8,
    name: 'Agent Loop',
    source: 'Loop Engineering',
    accent: 'Trigger → Skill → Verify → State',
    body: 'Every prompt is a loop, not a one-shot. Trigger the mess, compile with a skill, verify output, persist state for the next turn.',
    question: 'Does your workflow store attempt history and score outputs instead of starting from zero each time?',
    coach: {
      hook: 'One-shot prompting is wishful thinking with a markdown wrapper.',
      pivot: 'Trigger → Skill → Verify → State. NSF funded $500K in 2026 to explore LLMs as executive-function coaches — because loops beat lectures.',
      stat: '$500,000 NSF grant · neurodivergent job-coaching LLMs',
      cite: 'Kim & Riedl · NSF (2026)',
    },
  },
  {
    id: 9,
    name: 'Lost-in-the-Middle',
    source: 'Liu et al. · Context decay',
    accent: 'Context positioning',
    body: 'Attention peaks at the start and end of the context window. Critical constraints buried in the middle get forgotten.',
    question: 'Are your hardest constraints placed at the top and repeated at the end of every prompt?',
    coach: {
      hook: 'You put the important rule in paragraph four. The model put it in the void.',
      pivot: 'U-shaped attention curve: primacy and recency win, middle dies. Bookend your constraints — top and tail.',
      stat: '>30% performance drop when facts sit mid-context',
      cite: 'Nelson F. Liu et al. · Lost in the Middle (Stanford, 2023)',
    },
  },
  {
    id: 10,
    name: 'Monotropism Channels',
    source: 'Murray, Lesser & Lawson',
    accent: 'Single-thread focus',
    body: 'Deep-focus brains run one intense channel at a time. Scatter tabs, parallel agents, and context switches multiply slop.',
    question: 'Do you protect one active thread instead of juggling five half-finished agent sessions?',
    coach: {
      hook: 'Pathologically obsessive squirrel syndrome is not a joke — it is monotropic split with extra steps.',
      pivot: 'One attention tunnel per session. LLMs and autistic cognition both degrade on hard channel switches.',
      stat: 'Monotropism Questionnaire · n = 1,110',
      cite: 'Murray, Lesser & Lawson · Monotropism theory (2005)',
    },
  },
  {
    id: 11,
    name: 'Structure That Bends',
    source: 'Baron-Cohen · Systemizing',
    accent: 'Recommended paths',
    body: 'Offer guided defaults without bossy imperatives. Scaffolding should feel like a ramp, not a cage.',
    question: 'Can you override defaults without breaking the workflow or losing session state?',
    coach: {
      hook: 'Hyper-systemizing is not rigidity — it is hypothesis testing with better notes.',
      pivot: 'Baron-Cohen\'s PNAS mega-study (n ≈ 671,000): systemizing minds map input→output rules. Prompt engineering is native AuDHD interface design.',
      stat: 'n ≈ 671,000 · Empathizing-Systemizing theory',
      cite: 'Simon Baron-Cohen · PNAS (2018)',
    },
  },
  {
    id: 12,
    name: 'Anti-Slop Invariants',
    source: 'SloppyXBaby edicts',
    accent: 'Visual + copy hygiene',
    body: 'Ban nested cards, purple gradients, #6366f1 indigo, fake metrics, hero-number clichés, and ChatGPT-template voice.',
    question: 'Would your last generated UI pass a slop scan — solid surfaces, honest copy, no AI-default tells?',
    coach: {
      hook: 'If your landing page has a hero metric and a purple gradient, you built a template — not a product.',
      tangent: 'The ADHD apps market is ~$2–3.2B in 2026. Slop does not capture share; specificity does.',
      pivot: 'Instructional humor only works when the joke illustrates the rule. Ban fake stats, nested cards, and corporate coach hype.',
      stat: 'ADHD digital therapeutics · ~$2–3.2B market (2026)',
      cite: 'Market reports · neurodiversity content economy (2026)',
    },
  },
];