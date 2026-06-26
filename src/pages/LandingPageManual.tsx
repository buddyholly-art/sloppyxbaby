import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, Shield, Zap, Mail, ArrowRight, Check,
  Target, Brain, Bot, Scale, Coins, Cpu, ShieldAlert,
  ChevronRight, Lightbulb, FileText, Lock, Scroll, Rocket, FlaskConical
} from 'lucide-react';
import { AUTHORITIES_SSOT } from '../lib/authoritySsot';
import '../manual-landing.css';

type Intent = 'fix' | 'lessgeneric' | 'learn';

const INTENTS: { key: Intent; title: string; sub: string; cta: string }[] = [
  {
    key: 'fix',
    title: 'Fix my sloppy prompt',
    sub: 'Paste the brain dump. We turn scattered thoughts into a clean, machine-readable spec — whether you’re distracted, exhausted, or just not a prompt engineer.',
    cta: 'Try it free',
  },
  {
    key: 'lessgeneric',
    title: 'Make my AI output less generic',
    sub: 'Stop sounding like every AI slop template. We inject your constraints, voice, and guardrails so the model sounds like you.',
    cta: 'See the difference',
  },
  {
    key: 'learn',
    title: 'Learn the tactics',
    sub: 'Get the free cheatsheet. Built on working-memory research used in ADHD support — and useful for anyone whose context window is smaller than ChatGPT’s.',
    cta: 'Send me the cheatsheet',
  },
];

export default function LandingPageManual() {
  const [intent, setIntent] = useState<Intent | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [leadStatus, setLeadStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [authorityIndex, setAuthorityIndex] = useState(0);
  const [tcoAspect, setTcoAspect] = useState<'money' | 'space' | 'maintenance'>('maintenance');
  const chosenRef = useRef<HTMLDivElement>(null);

  const selectIntent = (i: Intent) => {
    setIntent(i);
    setTimeout(() => chosenRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const runFreeTaste = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setLeadStatus('loading');
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'cheatsheet' }),
      });
      setLeadStatus('success');
    } catch {
      setLeadStatus('idle');
    }
  };

  const buyCredits = async () => {
    try {
      const res = await fetch('/api/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // fail silently
    }
  };

  useEffect(() => {
    const id = setInterval(() => setAuthorityIndex((p) => (p + 1) % AUTHORITIES_SSOT.length), 12000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-in')),
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [intent]);

  const currentAuthority = AUTHORITIES_SSOT[authorityIndex];

  const stickyLabel =
    intent === 'fix' ? 'Fix my prompt — $5 for 50 premium runs' :
    intent === 'lessgeneric' ? 'Stop generic output — try the compiler' :
    intent === 'learn' ? 'Get the tactics cheatsheet' : 'Start with the prompt compiler';

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] font-[var(--font-sans)] overflow-x-hidden">
      <div className="ambient-mesh" aria-hidden="true" />
      <div className="paper-grain" aria-hidden="true" />

      {/* Nav */}
      <nav className="nav-shell">
        <div className="flex items-center gap-4 px-2 py-1.5">
          <Link to="/" className="flex items-center gap-2 font-bold text-[15px] tracking-tight">
            <span className="w-5 h-5 rounded-md bg-[var(--color-sage)]" />
            SloppyXBaby
          </Link>
          <div className="hidden md:flex items-center gap-1 text-[13px] font-medium text-[var(--color-muted)]">
            <Link to="/tactics" className="px-3 py-1.5 rounded-full hover:bg-black/5 transition-colors">Tactics</Link>
            <Link to="/app" className="px-3 py-1.5 rounded-full hover:bg-black/5 transition-colors">Workspace</Link>
            <a href="#pricing" className="px-3 py-1.5 rounded-full hover:bg-black/5 transition-colors">Pricing</a>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero / Intent Router */}
        <section className="min-h-[92dvh] md:min-h-[88dvh] flex flex-col justify-center max-w-[1200px] mx-auto px-6 pt-28 pb-16">
          <div className="max-w-3xl mb-10 md:mb-14">
            <span className="eyebrow"><span className="eyebrow-dot" /> Prompt engineering for distracted builders</span>
            <h1 className="mt-6 text-[clamp(40px,6vw,72px)] font-bold leading-[1.05] tracking-[-0.035em]">
              Your ideas are good.{' '}
              <span className="text-[var(--color-sage)]">Your prompts are sloppy.</span>
            </h1>
            <p className="mt-5 text-lg md:text-xl text-[var(--color-muted)] leading-relaxed max-w-2xl">
              A context-engineering workspace built from ADHD/AuDHD research. Low-arousal, high-clarity, and designed for brains that lose the thread.
            </p>
          </div>

          <div className="mb-8">
            <p className="font-[var(--font-mono)] text-[11px] tracking-[0.18em] uppercase text-[var(--color-muted)] mb-4">What brings you here?</p>
            <div className="grid md:grid-cols-3 gap-4">
              {INTENTS.map((it, idx) => {
                const active = intent === it.key;
                const dominant = idx === 0;
                return (
                  <button
                    key={it.key}
                    onClick={() => selectIntent(it.key)}
                    className={`intent-card text-left ${dominant ? 'md:row-span-1' : ''} ${active ? 'intent-card--active' : ''}`}
                  >
                    <span className="inline-flex items-center gap-2 text-[10px] font-[var(--font-mono)] uppercase tracking-wider text-[var(--color-sage)] mb-3">
                      {it.key === 'fix' && <Target className="w-3.5 h-3.5" />}
                      {it.key === 'lessgeneric' && <Sparkles className="w-3.5 h-3.5" />}
                      {it.key === 'learn' && <Lightbulb className="w-3.5 h-3.5" />}
                      0{idx + 1}
                    </span>
                    <h3 className="font-semibold text-lg mb-2">{it.title}</h3>
                    <p className="text-[var(--color-muted)] text-sm leading-relaxed mb-4">{it.sub}</p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-sage)] group">
                      {it.cta} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-5 text-center md:text-left">
              <a href="#story" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors underline decoration-[var(--color-hairline-strong)] underline-offset-4">
                Not sure? Browse the full story →
              </a>
            </div>
          </div>

          {/* Gold drip mark */}
          <div className="absolute top-24 right-0 md:right-12 w-48 h-48 md:w-72 md:h-72 pointer-events-none opacity-60 gold-drift">
            <svg viewBox="0 0 200 200" className="w-full h-full gold-drip">
              <defs>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#F2D06B" />
                </linearGradient>
              </defs>
              {/* X cross */}
              <path
                d="M55 45 L145 135 M145 45 L55 135"
                stroke="url(#goldGrad)"
                strokeWidth="18"
                strokeLinecap="round"
                fill="none"
              />
              {/* Drip from the bottom-right arm of the X */}
              <path
                d="M135 135 V165 Q135 180 150 180"
                stroke="url(#goldGrad)"
                strokeWidth="14"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="150" cy="188" r="9" fill="#F2D06B" className="gold-drop" />
            </svg>
          </div>
        </section>

        {/* Chosen path */}
        {intent && (
          <section ref={chosenRef} className="max-w-[1200px] mx-auto px-6 py-16 scroll-mt-24">
            {intent === 'fix' && (
              <div className="card-shell p-6 md:p-10">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Free taste: fix my sloppy prompt</h2>
                <p className="text-[var(--color-muted)] mb-6">Paste a messy request. Get back a structured, context-engineered prompt. No signup. 10 free generations per day.</p>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. build me a login system"
                  className="w-full h-40 p-4 rounded-[var(--radius-core)] bg-white/70 border border-[var(--color-hairline)] text-base resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]/30"
                />
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={runFreeTaste}
                    disabled={loading || !prompt.trim()}
                    className="btn-pill"
                  >
                    <span>{loading ? 'Thinking…' : 'Generate prompt'}</span>
                    <span className="btn-pill-icon"><Sparkles className="w-3 h-3" /></span>
                  </button>
                  {error && <span className="text-sm text-red-600">{error}</span>}
                </div>
                {result && (
                  <div className="mt-6 p-5 rounded-[var(--radius-core)] bg-[var(--color-sage-dim)] border border-[var(--color-sage-soft)]">
                    <p className="text-xs font-[var(--font-mono)] uppercase tracking-wide text-[var(--color-sage)] mb-2">Advocate Prompt · Score {result.promptScore}/100</p>
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed font-[var(--font-sans)]">{result.advocatePrompt}</pre>
                  </div>
                )}
              </div>
            )}

            {intent === 'lessgeneric' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="card-shell p-6">
                  <h3 className="text-sm font-[var(--font-mono)] uppercase tracking-wider text-[var(--color-muted)] mb-4">Sloppy prompt</h3>
                  <p className="text-[var(--color-ink)] text-lg leading-relaxed">"Make a nice landing page for my app. Use a modern design. Include pricing."</p>
                  <div className="mt-6 p-4 rounded-[var(--radius-core)] bg-rose-50 border border-rose-100 text-rose-700 text-sm">
                    Generic output: purple gradients, fake stats, vague CTAs, no personality.
                  </div>
                </div>
                <div className="card-shell p-6 border-[var(--color-sage)]/30">
                  <h3 className="text-sm font-[var(--font-mono)] uppercase tracking-wider text-[var(--color-sage)] mb-4">Baby-smooth prompt</h3>
                  <p className="text-[var(--color-ink)] text-lg leading-relaxed">"Build a soft-cream landing page for SloppyXBaby, a prompt-engineering workspace for ADHD/AuDHD builders. Lead with an intent router, cite working-memory research, use sage #1F4D3F and gold #D4AF37 accents, and end with three pricing tiers."</p>
                  <div className="mt-6 p-4 rounded-[var(--radius-core)] bg-[var(--color-sage-dim)] border border-[var(--color-sage-soft)] text-[var(--color-sage)] text-sm">
                    Specific voice, constraints, evidence, and structure.
                  </div>
                </div>
              </div>
            )}

            {intent === 'learn' && (
              <div className="card-shell p-6 md:p-10">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Get the free cheatsheet</h2>
                <p className="text-[var(--color-muted)] mb-6">A condensed, copy-paste guide to the context-engineering tactics that separate decent prompts from great ones.</p>
                {leadStatus === 'success' ? (
                  <p className="inline-flex items-center gap-2 text-[var(--color-sage)] font-semibold"><Check className="w-4 h-4" /> Cheatsheet link sent to your inbox.</p>
                ) : (
                  <form onSubmit={submitLead} className="flex flex-col sm:flex-row gap-3 max-w-md">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="flex-1 px-4 py-2.5 rounded-full bg-white/70 border border-[var(--color-hairline)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]/30"
                    />
                    <button type="submit" disabled={leadStatus === 'loading'} className="btn-pill">
                      <span>Send it</span>
                      <span className="btn-pill-icon"><Mail className="w-3 h-3" /></span>
                    </button>
                  </form>
                )}
                <div className="mt-8 grid sm:grid-cols-3 gap-4">
                  {[
                    { title: 'XML delimiters', body: 'Wrap instructions, rules, and data in explicit tags for 20–40% more consistency.' },
                    { title: 'Context positioning', body: 'Put key constraints at the start and end; the middle of the context window decays.' },
                    { title: 'Chain-of-Verification', body: 'Draft, fact-check in isolation, then synthesize. Cuts hallucinations.' },
                  ].map((t) => (
                    <div key={t.title} className="card-core p-4">
                      <h4 className="font-semibold text-sm mb-1">{t.title}</h4>
                      <p className="text-[var(--color-muted)] text-xs leading-relaxed">{t.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Gravitas strip */}
        <section className="max-w-[1200px] mx-auto px-6 py-16 border-t border-[var(--color-hairline)]">
          <div className="card-shell p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              <div className="lg:flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="eyebrow"><span className="eyebrow-dot" /> Edict {currentAuthority.edictId}</span>
                  <span className="text-xs text-[var(--color-muted)] uppercase tracking-wide font-semibold">Gravitas Authority</span>
                </div>
                <blockquote className="text-[var(--color-ink)] text-lg md:text-xl leading-relaxed font-medium italic mb-4">
                  “{currentAuthority.quote}”
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-sage)]" />
                  <div>
                    <p className="text-sm font-bold text-[var(--color-ink)]">{currentAuthority.name}</p>
                    <p className="text-xs text-[var(--color-muted)]">{currentAuthority.role} · {currentAuthority.institution}</p>
                  </div>
                </div>
              </div>
              <div className="lg:w-[420px]">
                <div className="card-core p-5">
                  <div className="flex items-center gap-2 text-[10px] font-[var(--font-mono)] uppercase tracking-wide text-[var(--color-muted)] font-bold mb-3">
                    <Scale className="w-3.5 h-3.5 text-[var(--color-sage)]" />
                    Structural consequence: {tcoAspect}
                  </div>
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-4">{currentAuthority.tcoVector[tcoAspect]}</p>
                  <div className="flex gap-2 flex-wrap">
                    {(['money', 'space', 'maintenance'] as const).map((a) => (
                      <button
                        key={a}
                        onClick={() => setTcoAspect(a)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-[var(--font-mono)] transition-colors ${
                          tcoAspect === a
                            ? 'bg-[var(--color-sage)]/10 border-[var(--color-sage)]/20 text-[var(--color-sage)] font-bold'
                            : 'bg-[var(--color-surface)] border-[var(--color-hairline)] text-[var(--color-muted)] hover:text-[var(--color-ink)]'
                        }`}
                      >
                        {a === 'money' && <Coins className="w-3 h-3 inline mr-1" />}
                        {a === 'space' && <Cpu className="w-3 h-3 inline mr-1" />}
                        {a === 'maintenance' && <ShieldAlert className="w-3 h-3 inline mr-1" />}
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="max-w-[1200px] mx-auto px-6 py-16 border-t border-[var(--color-hairline)]">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-10 text-center">Pick your path</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card-shell p-6">
              <h3 className="font-semibold text-lg mb-2">Free Taste</h3>
              <p className="text-[var(--color-muted)] text-sm mb-4">10 generations per day on free models.</p>
              <p className="text-3xl font-bold mb-6">$0</p>
              <ul className="space-y-2 text-sm text-[var(--color-muted)] mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[var(--color-sage)]" /> Prompt compiler</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[var(--color-sage)]" /> Chat & refinement loop</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[var(--color-sage)]" /> Rate limited</li>
              </ul>
              <button onClick={() => selectIntent('fix')} className="block w-full text-center px-5 py-2.5 rounded-full bg-white/60 border border-[var(--color-hairline)] text-sm font-semibold hover:bg-white/90 transition-colors">Start free</button>
            </div>

            <div className="rounded-[var(--radius-shell)] bg-[var(--color-sage)] text-white p-6 shadow-[var(--shadow-card)] relative">
              <span className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-white text-[var(--color-sage)] text-[10px] font-bold uppercase tracking-wide">Popular</span>
              <h3 className="font-semibold text-lg mb-2">Credit Pack</h3>
              <p className="text-white/80 text-sm mb-4">Premium generations backed by OpenAI.</p>
              <p className="text-3xl font-bold mb-6">$5</p>
              <ul className="space-y-2 text-sm text-white/80 mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4" /> 50 premium generations</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4" /> GPT-4 class models</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4" /> No daily limit</li>
              </ul>
              <button onClick={buyCredits} className="w-full px-5 py-2.5 rounded-full bg-white text-[var(--color-sage)] text-sm font-semibold hover:bg-white/90 transition-colors">Buy credits</button>
            </div>

            <div className="card-shell p-6">
              <h3 className="font-semibold text-lg mb-2">Bring Your Own Key</h3>
              <p className="text-[var(--color-muted)] text-sm mb-4">Use your OpenAI key inside the workspace.</p>
              <p className="text-3xl font-bold mb-6">Free</p>
              <ul className="space-y-2 text-sm text-[var(--color-muted)] mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[var(--color-sage)]" /> Full workspace access</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[var(--color-sage)]" /> Key stays in your session</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[var(--color-sage)]" /> Use any OpenAI model</li>
              </ul>
              <Link to="/app" className="block w-full text-center px-5 py-2.5 rounded-full bg-white/60 border border-[var(--color-hairline)] text-sm font-semibold hover:bg-white/90 transition-colors">Open workspace</Link>
            </div>
          </div>
        </section>

        {/* Magazine sections */}
        <section id="story" className="max-w-[1200px] mx-auto px-6 py-16 border-t border-[var(--color-hairline)]">
          {/* Manifesto */}
          <div className="mb-20">
            <span className="eyebrow"><span className="eyebrow-dot" /> Manifesto</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-6 mb-6">Built for distracted builders.</h2>
            <p className="text-lg md:text-xl text-[var(--color-muted)] leading-relaxed max-w-3xl">
              Everyone is distracted. Notifications, context switching, and shiny-object syndrome make every builder’s working memory smaller than the model they’re prompting. SloppyXBaby is a context-engineering workspace designed from ADHD/AuDHD research — externalized memory, sensory-safe surfaces, and one clear next step — so you can vibe-code without the slop.
            </p>
          </div>

          {/* Founder truth */}
          <div className="mb-20 closing-surface p-8 md:p-12">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[var(--color-sage-glow)] text-[10px] font-semibold tracking-wide uppercase mb-6">
              <Sparkles className="w-3 h-3" /> Founder truth
            </span>
            <blockquote className="text-2xl md:text-4xl font-bold leading-[1.15] tracking-tight mb-6">
              “Vibe coding is an AuDHD recipe for disaster in the most addictive pill. Shiny-thing syndrome, but make EVERYTHING shiny?! So if we care so much about it, how does it turn into AI slop?”
            </blockquote>
            <p className="text-white/70 text-lg leading-relaxed max-w-2xl mb-6">
              I have ADHD and autism and I spent 2 years and hundreds monthly on AI, and this is what I came up with to write good, Karpathy-level code.
            </p>
            <p className="text-white/50 text-sm">— SloppyXBaby founder</p>
          </div>

          {/* Evidence basis */}
          <div className="mb-20">
            <span className="eyebrow"><span className="eyebrow-dot" /> Evidence basis</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-6 mb-8">Research-backed, not vibe-backed.</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {AUTHORITIES_SSOT.map((a) => (
                <div key={a.id} className="card-shell p-6">
                  <p className="text-xs text-[var(--color-muted)] uppercase tracking-wide font-semibold mb-3">{a.institution}</p>
                  <blockquote className="text-[var(--color-ink)] font-medium italic leading-relaxed mb-4">“{a.quote}”</blockquote>
                  <p className="text-sm font-bold text-[var(--color-ink)]">{a.name}</p>
                  <p className="text-xs text-[var(--color-muted)] mt-2">Built into: {a.edictName}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Service grid */}
          <div className="mb-20">
            <span className="eyebrow"><span className="eyebrow-dot" /> What’s inside</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-6 mb-8">The full workspace.</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { group: 'Start', items: ['Prompt Compiler', 'Agent Interface Chat', 'Repo Scaffold', 'Repo Architect'] },
                { group: 'Protect', items: ['Security Scanner', 'Risk Dashboard', 'SSOT Auditor', 'Refinement Loop'] },
                { group: 'Remember', items: ['Memory Vault', 'File Tree Viewer', 'Vector RAG'] },
                { group: 'Level up', items: ['Working Memory Playground', 'Cost Board', 'Quote Banner', 'Onboarding Scaffold'] },
              ].map((g) => (
                <div key={g.group} className="card-shell p-5">
                  <h4 className="text-xs font-[var(--font-mono)] uppercase tracking-wider text-[var(--color-sage)] mb-4">{g.group}</h4>
                  <ul className="space-y-2">
                    {g.items.map((item) => (
                      <li key={item} className="text-sm text-[var(--color-muted)] flex items-center gap-2">
                        <ChevronRight className="w-3 h-3 text-[var(--color-sage)]" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link to="/app" className="btn-pill inline-flex">
                <span>Open the workspace</span>
                <span className="btn-pill-icon"><ArrowRight className="w-3 h-3" /></span>
              </Link>
            </div>
          </div>

          {/* Tactics teaser */}
          <div>
            <span className="eyebrow"><span className="eyebrow-dot" /> Tactics</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-6 mb-6">The tactics that separate decent prompts from great ones.</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {[
                'XML Structural Delimiters',
                'Context Positioning & Decay',
                'Chain-of-Verification',
                'Anti-Sycophancy',
                'Uncertainty Calibration',
              ].map((t) => (
                <div key={t} className="card-core p-4 text-center">
                  <p className="text-sm font-semibold text-[var(--color-ink)]">{t}</p>
                </div>
              ))}
            </div>
            <Link to="/tactics" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-sage)] hover:text-[var(--color-sage-glow)]">
              Read the full tactics guide <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* Sticky CTA */}
      {intent && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:hidden">
          <button
            onClick={() => selectIntent('fix')}
            className="w-full btn-pill justify-between"
          >
            <span>{stickyLabel}</span>
            <span className="btn-pill-icon"><ArrowRight className="w-3 h-3" /></span>
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 max-w-[1200px] mx-auto px-6 py-10 border-t border-[var(--color-hairline)]">
        <div className="flex flex-col md:flex-row justify-between gap-4 text-sm text-[var(--color-muted)]">
          <span>© {new Date().getFullYear()} SloppyXBaby. Evidence-based prompt engineering.</span>
          <div className="flex flex-wrap gap-6">
            <Link to="/tactics" className="hover:text-[var(--color-ink)]">Tactics</Link>
            <Link to="/app" className="hover:text-[var(--color-ink)]">Workspace</Link>
            <Link to="/privacy" className="hover:text-[var(--color-ink)]">Privacy</Link>
            <Link to="/terms" className="hover:text-[var(--color-ink)]">Terms</Link>
            <Link to="/cookies" className="hover:text-[var(--color-ink)]">Cookies</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
