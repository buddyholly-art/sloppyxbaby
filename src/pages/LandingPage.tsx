import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Zap, Mail, ArrowRight, Check } from 'lucide-react';

export default function LandingPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [leadStatus, setLeadStatus] = useState<'idle' | 'loading' | 'success'>('idle');

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

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] font-[var(--font-sans)]">
      <div className="ambient-mesh" aria-hidden="true" />

      {/* Nav */}
      <nav className="relative z-10 max-w-[1200px] mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <span className="w-6 h-6 rounded-md bg-[var(--color-sage)]" />
          SloppyXBaby
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-[var(--color-muted)]">
          <Link to="/tactics" className="hover:text-[var(--color-ink)] transition-colors">Tactics</Link>
          <Link to="/app" className="hover:text-[var(--color-ink)] transition-colors">Workspace</Link>
          <a href="#pricing" className="hover:text-[var(--color-ink)] transition-colors">Pricing</a>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero */}
        <section className="max-w-[1200px] mx-auto px-6 pt-16 md:pt-28 pb-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-sage-dim)] text-[var(--color-sage)] text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              X AI slop! → baby-smooth prompts
            </span>
            <h1 className="mt-6 text-[clamp(44px,6vw,76px)] font-bold leading-[1.05] tracking-[-0.035em]">
              Your prompts are sloppy.{' '}
              <span className="text-[var(--color-sage)]">Make them baby-smooth.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-[var(--color-muted)] leading-relaxed max-w-xl">
              Turn vague ideas into structured, context-engineered instructions that get worker LLMs to build what you actually want — without the generic SaaS slop.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#taste" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-sage)] text-white text-sm font-semibold hover:bg-[var(--color-sage-glow)] transition-colors">
                Try it free <ArrowRight className="w-4 h-4" />
              </a>
              <Link to="/app" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 border border-[var(--color-hairline)] text-sm font-semibold hover:bg-white/90 transition-colors">
                Open full workspace
              </Link>
            </div>
          </div>
        </section>

        {/* Pain points */}
        <section className="max-w-[1200px] mx-auto px-6 py-16 border-t border-[var(--color-hairline)]">
          <p className="font-[var(--font-mono)] text-[11px] tracking-[0.18em] uppercase text-[var(--color-muted)] mb-8">Sound familiar?</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Generic output', body: 'Your prompts return the same purple-gradient, card-on-card slop every other tool produces.' },
              { icon: Zap, title: 'Context gets lost', body: 'After three messages the model forgets your constraints and starts inventing things.' },
              { icon: Sparkles, title: 'No structure', body: 'You know what you want but can not translate it into instructions a literal machine can follow.' },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-[var(--radius-core)] bg-white/50 border border-[var(--color-hairline)] shadow-[var(--shadow-card)]">
                <item.icon className="w-6 h-6 text-[var(--color-sage)] mb-4" />
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-[var(--color-muted)] text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Free taste */}
        <section id="taste" className="max-w-[1200px] mx-auto px-6 py-16">
          <div className="rounded-[var(--radius-shell)] bg-white/55 border border-[var(--color-hairline)] shadow-[var(--shadow-shell)] p-6 md:p-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Free taste: fix my sloppy prompt</h2>
            <p className="text-[var(--color-muted)] mb-6">Paste a messy request. Get back a structured, context-engineered prompt. No signup. 10 free generations per day.</p>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. build me a login system"
              className="w-full h-32 p-4 rounded-[var(--radius-core)] bg-white/70 border border-[var(--color-hairline)] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]/30"
            />
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={runFreeTaste}
                disabled={loading || !prompt.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-sage)] text-white text-sm font-semibold disabled:opacity-50 hover:bg-[var(--color-sage-glow)] transition-colors"
              >
                {loading ? 'Thinking…' : 'Generate prompt'} <Sparkles className="w-4 h-4" />
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
        </section>

        {/* Tactics teaser */}
        <section className="max-w-[1200px] mx-auto px-6 py-16 border-t border-[var(--color-hairline)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Built on LLM Context Engineering Tactics</h2>
              <p className="text-[var(--color-muted)]">XML delimiters, context positioning, Chain-of-Verification, anti-sycophancy, uncertainty calibration, and dynamic context editing — baked into every prompt the advocate produces.</p>
            </div>
            <Link to="/tactics" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 border border-[var(--color-hairline)] text-sm font-semibold hover:bg-white/90 transition-colors self-start">
              Read the tactics <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Lead magnet */}
        <section className="max-w-[1200px] mx-auto px-6 py-16">
          <div className="rounded-[var(--radius-shell)] bg-[var(--color-ink)] text-[var(--color-inverted-text)] p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Get the free cheatsheet</h2>
            <p className="text-white/70 max-w-md mx-auto mb-6">A condensed, copy-paste guide to the context-engineering tactics that separate decent prompts from great ones.</p>
            {leadStatus === 'success' ? (
              <p className="inline-flex items-center gap-2 text-[var(--color-sage-glow)] font-semibold"><Check className="w-4 h-4" /> Cheatsheet link sent to your inbox.</p>
            ) : (
              <form onSubmit={submitLead} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-glow)]"
                />
                <button
                  type="submit"
                  disabled={leadStatus === 'loading'}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-sage)] text-white text-sm font-semibold hover:bg-[var(--color-sage-glow)] transition-colors disabled:opacity-50"
                >
                  <Mail className="w-4 h-4" /> Send it
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="max-w-[1200px] mx-auto px-6 py-16 border-t border-[var(--color-hairline)]">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-10 text-center">Pick your path</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-[var(--radius-core)] bg-white/50 border border-[var(--color-hairline)] shadow-[var(--shadow-card)]">
              <h3 className="font-semibold text-lg mb-2">Free Taste</h3>
              <p className="text-[var(--color-muted)] text-sm mb-4">10 generations per day on free models.</p>
              <p className="text-3xl font-bold mb-6">$0</p>
              <ul className="space-y-2 text-sm text-[var(--color-muted)] mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[var(--color-sage)]" /> Prompt compiler</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[var(--color-sage)]" /> Chat & refinement loop</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[var(--color-sage)]" /> Rate limited</li>
              </ul>
              <a href="#taste" className="block text-center px-5 py-2.5 rounded-full bg-white/60 border border-[var(--color-hairline)] text-sm font-semibold hover:bg-white/90 transition-colors">Start free</a>
            </div>

            <div className="p-6 rounded-[var(--radius-core)] bg-[var(--color-sage)] text-white shadow-[var(--shadow-card)] relative">
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

            <div className="p-6 rounded-[var(--radius-core)] bg-white/50 border border-[var(--color-hairline)] shadow-[var(--shadow-card)]">
              <h3 className="font-semibold text-lg mb-2">Bring Your Own Key</h3>
              <p className="text-[var(--color-muted)] text-sm mb-4">Use your OpenAI key inside the workspace.</p>
              <p className="text-3xl font-bold mb-6">Free</p>
              <ul className="space-y-2 text-sm text-[var(--color-muted)] mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[var(--color-sage)]" /> Full workspace access</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[var(--color-sage)]" /> Key stays in your session</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[var(--color-sage)]" /> Use any OpenAI model</li>
              </ul>
              <Link to="/app" className="block text-center px-5 py-2.5 rounded-full bg-white/60 border border-[var(--color-hairline)] text-sm font-semibold hover:bg-white/90 transition-colors">Open workspace</Link>
            </div>
          </div>
        </section>
      </main>

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
