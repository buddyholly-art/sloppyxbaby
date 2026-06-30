import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

type AuditAnswer = 'yes' | 'partial' | 'no' | null;

const CONCEPTS = [
  {
    id: 1,
    name: 'Externalized Memory',
    source: 'Alan Baddeley · Working Memory Model',
    accent: 'Memory Vault',
    body: 'Your working memory is smaller than the model context window. Offload task state, specs, and session headers into durable external stores.',
    question: 'Can you resume your last coding task in under 5 seconds without re-reading chat history?',
  },
  {
    id: 2,
    name: 'Executive Guardrails',
    source: 'Russell Barkley · Executive Function',
    accent: 'Impulsivity Shield',
    body: 'ADHD is an executive function deficit. Guidance must be externalized, visual, and rollback-safe — not vibes and hope.',
    question: 'Do your prompts enforce validation gates, error recovery, and reversible state before shipping?',
  },
  {
    id: 3,
    name: 'One Clear Next Step',
    source: 'CAST UDL Guidelines',
    accent: 'Intent Router',
    body: 'Choice paralysis destroys action. Every surface should expose exactly one recommended default next step.',
    question: 'Does your workspace show one obvious recommended action instead of a wall of equal options?',
  },
  {
    id: 4,
    name: 'Low-Arousal Surfaces',
    source: 'Winnie Dunn · Sensory Processing',
    accent: 'Soft Premium UI',
    body: 'Flashing telemetry, alarm colors, and metric spam exhaust working memory. Calm surfaces preserve focus bandwidth.',
    question: 'Are your tools free of urgent badges, fake stats, and high-arousal visual noise?',
  },
  {
    id: 5,
    name: 'CapEx Discipline',
    source: 'Andrej Karpathy · TCO',
    accent: 'SSOT Auditor',
    body: 'Code is a liability: money (tokens), space (context weight), and maintenance (debugging debt). Every line must earn its keep.',
    question: 'Do you audit new features for duplicate schemas, redundant files, and prompt bloat before building?',
  },
  {
    id: 6,
    name: 'OpEx Awareness',
    source: 'Token economics',
    accent: 'TCO Board',
    body: 'Subscriptions compound. Track per-loop token cost, model tier routing, and whether a cheaper pass would suffice.',
    question: 'Can you see what each agent loop costs before you run another spin?',
  },
  {
    id: 7,
    name: 'The Harness',
    source: 'BYOK architecture',
    accent: 'Bring Your Own Key',
    body: 'You own the keys, routes, and upstream providers. The workspace supplies cognitive guardrails — not compute markups.',
    question: 'Are your API keys local, rotatable, and routed by task tier instead of one default model?',
  },
  {
    id: 8,
    name: 'Agent Loop',
    source: 'Loop Engineering',
    accent: 'Trigger → Skill → Verify → State',
    body: 'Every prompt is a loop, not a one-shot. Trigger the mess, compile with a skill, verify output, persist state for the next turn.',
    question: 'Does your workflow store attempt history and score outputs instead of starting from zero each time?',
  },
  {
    id: 9,
    name: 'Lost-in-the-Middle',
    source: 'Liu et al. · Context decay',
    accent: 'Context positioning',
    body: 'Attention peaks at the start and end of the context window. Critical constraints buried in the middle get forgotten.',
    question: 'Are your hardest constraints placed at the top and repeated at the end of every prompt?',
  },
  {
    id: 10,
    name: 'Monotropism Channels',
    source: 'Murray et al. · Autism attention',
    accent: 'Single-thread focus',
    body: 'Deep-focus brains run one intense channel at a time. Scatter tabs, parallel agents, and context switches multiply slop.',
    question: 'Do you protect one active thread instead of juggling five half-finished agent sessions?',
  },
  {
    id: 11,
    name: 'Structure That Bends',
    source: 'AuDHD design edict',
    accent: 'Recommended paths',
    body: 'Offer guided defaults without bossy imperatives. Scaffolding should feel like a ramp, not a cage.',
    question: 'Can you override defaults without breaking the workflow or losing session state?',
  },
  {
    id: 12,
    name: 'Anti-Slop Invariants',
    source: 'SloppyXBaby edicts',
    accent: 'Visual + copy hygiene',
    body: 'Ban nested cards, purple gradients, #6366f1 indigo, fake metrics, hero-number clichés, and ChatGPT-template voice.',
    question: 'Would your last generated UI pass a slop scan — solid surfaces, honest copy, no AI-default tells?',
  },
] as const;

const SCORE_LABELS: Record<string, { label: string; color: string }> = {
  high: { label: 'Thread held — ship with confidence', color: 'text-sage' },
  mid: { label: 'Gaps detected — patch before the next loop', color: 'text-gold' },
  low: { label: 'Context collapse risk — run the compiler first', color: 'text-pink' },
};

function scoreAnswer(answer: AuditAnswer): number {
  if (answer === 'yes') return 2;
  if (answer === 'partial') return 1;
  return 0;
}

export default function BuildersCodePage() {
  const [answers, setAnswers] = useState<Record<number, AuditAnswer>>({});
  const [audited, setAudited] = useState(false);

  const result = useMemo(() => {
    const scored = CONCEPTS.map((c) => scoreAnswer(answers[c.id] ?? null));
    const total = scored.reduce((a, b) => a + b, 0);
    const max = CONCEPTS.length * 2;
    const percent = Math.round((total / max) * 100);
    const gaps = CONCEPTS.filter((c) => (answers[c.id] ?? 'no') === 'no' || answers[c.id] === 'partial');
    const tier = percent >= 75 ? 'high' : percent >= 45 ? 'mid' : 'low';
    return { percent, gaps, tier };
  }, [answers]);

  function setAnswer(id: number, value: AuditAnswer) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setAudited(false);
  }

  function runAudit() {
    setAudited(true);
  }

  return (
    <div className="min-h-screen bg-canvas text-ink font-[var(--font-sans)] overflow-x-hidden">
      <nav className="sticky top-[20px] z-50 mx-auto mt-[20px] p-[6px] w-max max-w-[calc(100%-48px)] rounded-[var(--radius-pill)] bg-surface backdrop-blur-[22px] saturate-[160%] shadow-[var(--shadow-nav)]">
        <div className="flex items-center gap-2 px-2">
          <Link to="/" className="px-4 py-2 text-[13.5px] font-semibold text-muted hover:text-ink no-underline transition-colors">
            ← SloppyXBaby
          </Link>
          <span className="px-4 py-2 text-[13.5px] font-bold text-ink">The Builder&apos;s Code</span>
        </div>
      </nav>

      <main className="w-full max-w-[900px] mx-auto px-6 py-14 md:py-20">
        <span className="eyebrow">
          <span className="eyebrow-dot" />
          12 concepts · runnable self-audit
        </span>
        <h1 className="text-display mt-5">The Builder&apos;s Code</h1>
        <p className="text-lede mt-5">
          Twelve evidence-based concepts for AuDHD builders who vibe-code with LLMs. Each maps to a cognitive analog —
          working memory, executive function, monotropism, context decay — and a concrete SloppyXBaby surface.
        </p>
        <p className="text-[15px] text-muted mt-4 leading-relaxed">
          Answer honestly. The audit runs locally in your browser. No signup.
        </p>

        <div className="mt-10 flex flex-col gap-5">
          {CONCEPTS.map((concept) => (
            <article
              key={concept.id}
              className="p-6 md:p-8 rounded-[var(--radius-core)] bg-surface-solid border border-hairline"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <span className="font-[var(--font-mono)] text-[11px] text-gold tracking-[0.1em] uppercase">
                    {String(concept.id).padStart(2, '0')}
                  </span>
                  <h2 className="text-xl font-bold mt-1">{concept.name}</h2>
                  <p className="text-sm text-muted mt-1">{concept.source}</p>
                </div>
                <span className="px-2.5 py-[5px] rounded-[var(--radius-pill)] bg-sage-dim text-sage font-[var(--font-mono)] text-[10.5px]">
                  {concept.accent}
                </span>
              </div>
              <p className="text-[15px] text-muted leading-relaxed">{concept.body}</p>
              <p className="mt-4 text-[15px] font-medium text-ink">{concept.question}</p>
              <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={`Audit: ${concept.name}`}>
                {(['yes', 'partial', 'no'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAnswer(concept.id, opt)}
                    className={`px-4 py-2 rounded-[var(--radius-pill)] text-sm font-semibold border-0 cursor-pointer transition-colors ${
                      answers[concept.id] === opt
                        ? opt === 'yes'
                          ? 'bg-sage text-white'
                          : opt === 'partial'
                            ? 'bg-gold text-ink'
                            : 'bg-pink/15 text-pink'
                        : 'bg-white/60 text-muted hover:bg-white hover:text-ink'
                    }`}
                  >
                    {opt === 'yes' ? 'Yes' : opt === 'partial' ? 'Partially' : 'Not yet'}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 p-7 md:p-10 rounded-[var(--radius-shell)] bg-ink text-canvas">
          <button
            type="button"
            onClick={runAudit}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[var(--radius-pill)] text-sm font-bold text-ink bg-gold hover:brightness-105 transition-all border-0 cursor-pointer active:scale-[0.98]"
          >
            Run self-audit
          </button>

          {audited && (
            <div className="mt-8">
              <div className="flex items-baseline gap-3">
                <span className="font-[var(--font-mono)] text-5xl font-extrabold text-gold tracking-[-0.04em]">
                  {result.percent}%
                </span>
                <span className="font-[var(--font-mono)] text-xs text-slate-muted uppercase tracking-[0.12em]">
                  Code alignment
                </span>
              </div>
              <p className={`mt-3 text-lg font-semibold ${SCORE_LABELS[result.tier].color}`}>
                {SCORE_LABELS[result.tier].label}
              </p>
              {result.gaps.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-sm text-slate-muted uppercase tracking-[0.1em] font-[var(--font-mono)] mb-3">
                    Patch these first
                  </p>
                  <ul className="list-none p-0 m-0 flex flex-col gap-2">
                    {result.gaps.map((g) => (
                      <li key={g.id} className="text-[15px] text-[#cbd5e1]">
                        <strong className="text-canvas">{g.name}</strong> — {g.accent}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/#scanner"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[var(--radius-pill)] text-sm font-bold text-white bg-sage hover:bg-sage-glow transition-colors no-underline active:scale-[0.98]"
                >
                  Fix my prompt
                </Link>
                <Link
                  to="/#pricing"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[var(--radius-pill)] text-sm font-bold text-ink bg-surface hover:bg-surface-solid shadow-[inset_0_0_0_1px_var(--color-hairline-strong)] transition-colors no-underline active:scale-[0.98]"
                >
                  Initialize workspace
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="py-12 pb-16 border-t border-hairline">
        <div className="w-full max-w-[900px] mx-auto px-6 flex flex-wrap gap-6 text-sm text-muted">
          <Link to="/" className="no-underline hover:text-pink transition-colors">Home</Link>
          <Link to="/tactics" className="no-underline hover:text-pink transition-colors">Tactics</Link>
          <Link to="/privacy" className="no-underline hover:text-pink transition-colors">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}