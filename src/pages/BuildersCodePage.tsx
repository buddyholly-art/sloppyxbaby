import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CoachHypeLesson from '../components/CoachHypeLesson';
import { BUILDER_CONCEPTS, COACH_HYPE_TAGLINE } from '../lib/coachHype';

type AuditAnswer = 'yes' | 'partial' | 'no' | null;

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
    const scored = BUILDER_CONCEPTS.map((c) => scoreAnswer(answers[c.id] ?? null));
    const total = scored.reduce((a, b) => a + b, 0);
    const max = BUILDER_CONCEPTS.length * 2;
    const percent = Math.round((total / max) * 100);
    const gaps = BUILDER_CONCEPTS.filter((c) => (answers[c.id] ?? 'no') === 'no' || answers[c.id] === 'partial');
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
          Coach Hype · 12 concepts · self-audit
        </span>
        <h1 className="text-display mt-5">The Builder&apos;s Code</h1>
        <p className="text-lede mt-5">
          Coach Hype teaches each concept with relatable setup, a controlled tangent, and a cited pivot — because AuDHD builders
          deserve research-backed scaffolding, not motivational poster rhetoric.
        </p>
        <p className="text-sm text-muted mt-3 font-[var(--font-mono)]">{COACH_HYPE_TAGLINE}</p>
        <p className="text-[15px] text-muted mt-4 leading-relaxed">
          Answer honestly below. The audit runs locally in your browser. No signup.
        </p>

        <CoachHypeLesson
          hook="Welcome. I am not here to crush your goals. I am here because your LLM and your brain share the same bugs."
          pivot="Twelve concepts. Twelve cognitive analogs. One workspace that externalizes what both systems keep dropping."
          stat="LLM failure modes map onto ADHD cognitive science — six parallels from independent research."
          cite="AuDHD ↔ LLM Cognitive Analogs · isomorphism thesis"
        />

        <div className="mt-10 flex flex-col gap-5">
          {BUILDER_CONCEPTS.map((concept) => (
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

              <CoachHypeLesson compact {...concept.coach} />

              <p className="mt-5 text-[15px] font-medium text-ink">{concept.question}</p>
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
          <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-gold mb-4">Coach Hype · value pivot</p>
          <p className="text-[17px] leading-relaxed text-[#e2e8f0]">
            Structure is the force multiplier. Externalize memory, bookend constraints, protect one thread — then ship.
          </p>
          <button
            type="button"
            onClick={runAudit}
            className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[var(--radius-pill)] text-sm font-bold text-ink bg-gold hover:brightness-105 transition-all border-0 cursor-pointer active:scale-[0.98]"
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