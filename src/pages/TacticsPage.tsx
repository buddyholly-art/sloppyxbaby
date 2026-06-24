import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const tactics = [
  {
    title: 'XML Structural Delimiters',
    body: 'Wrap instructions, rules, and data in explicit tags like <instruction>, <rules>, and <content>. This increases output consistency by 20–40% and prevents data-instruction overrides in RAG.'
  },
  {
    title: 'Context Positioning & Decay',
    body: 'Attention is strongest at the start and end of the context window. Place reference documents at the top and the final query at the absolute end. Ask the model to quote evidence before answering.'
  },
  {
    title: 'Chain-of-Verification (CoVe)',
    body: 'Draft an answer, generate atomic fact-checking questions, answer them in isolated fresh contexts, then synthesize the final response from verified facts only.'
  },
  {
    title: 'Anti-Sycophancy',
    body: 'Explicitly instruct the model to correct you when wrong. Ask for evidence before agreement. Use critical transitions like "However" to prime objective evaluation.'
  },
  {
    title: 'Uncertainty Calibration',
    body: 'Self-reported confidence is often miscalibrated. Prefer linguistic verbal uncertainty (LVU) — classify hedging language — and avoid fake precision.'
  },
  {
    title: 'Dynamic Context Editing',
    body: 'Target 60–80% context utilization. Clear bulky tool payloads when thresholds are hit and keep only the final few execution loops.'
  },
  {
    title: 'Deliberative Models',
    body: 'For o-series / reasoning models, use minimal objective-oriented prompts. Avoid few-shot examples and forced step-by-step traces; let the model self-schedule its thinking.'
  },
  {
    title: 'Prompt Refinement',
    body: 'Fix spelling, punctuation, and terminology before the main LLM call. Repeat key source sentences to improve alignment.'
  },
];

export default function TacticsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] font-[var(--font-sans)]">
      <div className="ambient-mesh" aria-hidden="true" />
      <nav className="relative z-10 max-w-[800px] mx-auto px-6 py-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back home
        </Link>
      </nav>
      <main className="relative z-10 max-w-[800px] mx-auto px-6 pb-20">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">LLM Context Engineering Tactics</h1>
        <p className="text-lg text-[var(--color-muted)] mb-12">
          A condensed reference for turning vague ideas into high-integrity prompts. These principles are baked into every prompt the SloppyXBaby advocate produces.
        </p>
        <div className="space-y-6">
          {tactics.map((t, i) => (
            <div key={t.title} className="p-6 rounded-[var(--radius-core)] bg-white/50 border border-[var(--color-hairline)] shadow-[var(--shadow-card)]">
              <h2 className="font-semibold text-lg mb-2">{i + 1}. {t.title}</h2>
              <p className="text-[var(--color-muted)] leading-relaxed">{t.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 p-6 rounded-[var(--radius-shell)] bg-[var(--color-ink)] text-[var(--color-inverted-text)] text-center">
          <p className="mb-4">Want the full source document in your repo?</p>
          <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-sage)] text-white text-sm font-semibold hover:bg-[var(--color-sage-glow)] transition-colors">
            Get the cheatsheet
          </Link>
        </div>
      </main>
    </div>
  );
}
