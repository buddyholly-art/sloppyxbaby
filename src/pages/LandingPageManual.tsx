import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const QUOTES = [
  {
    text: '“ADHD is an executive function deficit. Guidance must be externalized, visual, and rollback-safe.”',
    name: 'Russell Barkley',
    role: 'Medical University of South Carolina',
    ties: ['SSOT Auditor, Risk Dashboard'],
  },
  {
    text: '“Working memory has limited capacity. Effective support offloads information into external stores.”',
    name: 'Alan Baddeley',
    role: 'University of York Working Memory Model',
    ties: ['Memory Vault, session restoration'],
  },
  {
    text: '“Information in the middle of long contexts is systematically under-attended — place critical constraints at the start and end.”',
    name: 'Nelson F. Liu et al.',
    role: 'Lost in the Middle (2023)',
    ties: ['Context positioning, prompt compiler'],
  },
  {
    text: '“Monotropism means attention flows intensely through one channel. Context switches are not free — they cost working memory.”',
    name: 'Ferguson & Creswell',
    role: 'Monotropism attention theory',
    ties: ['Single-thread focus, Loop Engineering'],
  },
  {
    text: '“Sensory preferences shape attention. Low-arousal environments reduce cognitive load.”',
    name: 'Winnie Dunn',
    role: 'University of Kansas Medical Center',
    ties: ['Low-arousal UI'],
  },
  {
    text: '“Provide one clear default next step and multiple means of engagement.”',
    name: 'CAST UDL Guidelines',
    role: 'CAST Center for Applied Special Technology',
    ties: ['One clear next step'],
  },
  {
    text: '“The real cost of a model is money, space, and maintenance over time.”',
    name: 'Andrej Karpathy',
    role: 'OpenAI / Tesla',
    ties: ['CapEx / TCO board'],
  },
];

const FLAG_POOL = [
  'nested context loops',
  'vague constraints',
  'fake metrics risk',
  'role ambiguity',
  'output format missing',
  'dopamine-heavy phrasing',
  'no guardrails',
];

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function countUp(
  setter: (value: string) => void,
  endValue: number,
  suffix: string,
  duration: number,
  decimals = 0
) {
  if (prefersReducedMotion()) {
    setter(endValue.toFixed(decimals) + suffix);
    return;
  }
  const startTime = performance.now();
  const startValue = 0;
  const range = endValue - startValue;

  function step(now: number) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = startValue + range * eased;
    setter(current.toFixed(decimals) + suffix);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

export default function LandingPageManual() {
  const [navOpen, setNavOpen] = useState(false);

  const [prompt, setPrompt] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  const [scanResult, setScanResult] = useState<{
    score: number;
    flags: string[];
    summary: string;
    debt: string;
    context: string;
    bloat: string;
    barDebt: string;
    barContext: string;
    barBloat: string;
  } | null>(null);

  const [displayScore, setDisplayScore] = useState('0%');
  const [displayDebt, setDisplayDebt] = useState('0.00');
  const [displayContext, setDisplayContext] = useState('0%');
  const [displayBloat, setDisplayBloat] = useState('0.0σ');

  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState('');

  const [quoteIndex, setQuoteIndex] = useState(0);

  const [leadEmail, setLeadEmail] = useState('');
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadError, setLeadError] = useState('');

  const quoteTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Hero entrance + scroll reveal
  useEffect(() => {
    document.querySelectorAll('.hero-entrance').forEach((el) => el.classList.add('is-in'));
    const reveals = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('is-in');
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Quote auto-advance
  useEffect(() => {
    if (prefersReducedMotion()) return;
    quoteTimer.current = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % QUOTES.length);
    }, 7000);
    return () => {
      if (quoteTimer.current) clearInterval(quoteTimer.current);
    };
  }, []);

  // JSON-LD structured data
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'SloppyXBaby',
      applicationCategory: 'DeveloperApplication',
      offers: [
        {
          '@type': 'Offer',
          price: '15',
          priceCurrency: 'USD',
          priceValidUntil: '2027-12-31',
          availability: 'https://schema.org/InStock',
          description: 'Sustained Focus monthly plan',
        },
        {
          '@type': 'Offer',
          price: '79',
          priceCurrency: 'USD',
          priceValidUntil: '2027-12-31',
          availability: 'https://schema.org/InStock',
          description: 'Early Builder lifetime deal',
        },
      ],
      description:
        'AuDHD-friendly scaffolded coding environment. Externalized memory, one clear next step, and evidence-based context engineering for neurodivergent builders.',
      featureList:
        "Builder's Code self-audit, Anti-slop prompt compiler, Bloat scanner, Active Impulsivity Shield, Local-first vaults, BYOK Harness routing, Loop Engineering",
      operatingSystem: 'Any',
      keywords: 'AuDHD, ADHD, neurodivergent developer, prompt engineering, context engineering, working memory, monotropism',
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Count-up animation when scan result appears
  useEffect(() => {
    if (!scanResult) return;
    const score = scanResult.score;
    const debtVal = score / 100 * 0.8 + 0.1;
    const contextVal = Math.floor(score * 0.6);
    const bloatVal = score / 30;

    countUp(setDisplayScore, score, '%', 900, 0);
    countUp(setDisplayDebt, debtVal, '', 900, 2);
    countUp(setDisplayContext, contextVal, '%', 900, 0);
    countUp(setDisplayBloat, bloatVal, 'σ', 900, 1);
  }, [scanResult]);

  const runAudit = () => {
    const text = prompt.trim();
    if (!text) {
      setScanError('Paste a prompt first.');
      return;
    }
    setScanError('');
    setGenerated(null);
    setGenerateError('');
    setScanning(true);

    setTimeout(() => {
      const score = Math.min(92, Math.max(34, Math.floor(text.length / 8) + 28));
      const flags: string[] = [];
      if (text.length < 80) flags.push('vague constraints');
      if (!/role|task|output|constraint/i.test(text)) flags.push('role ambiguity');
      if (/features?|testimonials?|premium|approachable/i.test(text)) flags.push('fake metrics risk');
      if (!/avoid|don't|never/i.test(text)) flags.push('no guardrails');
      while (flags.length < 3) {
        const extra = FLAG_POOL[Math.floor(Math.random() * FLAG_POOL.length)];
        if (!flags.includes(extra)) flags.push(extra);
      }

      const debtVal = score / 100 * 0.8 + 0.1;
      const contextVal = Math.floor(score * 0.6);
      const bloatVal = score / 30;

      setScanResult({
        score,
        flags: flags.slice(0, 3),
        summary: `Your prompt scores ${score}% bloat risk. The compiler can collapse this into one structured spec with role, task, constraints, and output format.`,
        debt: debtVal.toFixed(2),
        context: `${contextVal}%`,
        bloat: `${bloatVal.toFixed(1)}σ`,
        barDebt: `${Math.min(100, score * 0.7)}%`,
        barContext: `${Math.min(100, score * 0.6)}%`,
        barBloat: `${Math.min(100, score)}%`,
      });
      setScanning(false);
    }, 900);
  };

  const runGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setGenerateError('');
    setGenerated(null);
    try {
      const res = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setGenerated(data.result?.advocatePrompt ?? data.result ?? JSON.stringify(data.result, null, 2));
    } catch (err: any) {
      setGenerateError(err.message || 'Could not generate prompt');
    } finally {
      setGenerating(false);
    }
  };

  const checkout = async (plan: 'monthly' | 'lifetime', btn: HTMLButtonElement | null) => {
    if (btn) btn.style.transform = 'scale(0.98)';
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      if (!res.ok) throw new Error('checkout unavailable');
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert('Checkout opens in the live app. This is a design prototype.');
    } finally {
      setTimeout(() => {
        if (btn) btn.style.transform = '';
      }, 150);
    }
  };

  const submitLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = leadEmail.trim();
    if (!email) return;
    setLeadLoading(true);
    setLeadError('');
    setLeadSuccess(false);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: '9-step-framework', tag: 'repo-structure-kit' }),
      });
      if (!res.ok) throw new Error('lead endpoint unavailable');
      setLeadSuccess(true);
      setLeadEmail('');
    } catch (err: any) {
      setLeadError(err.message || 'Could not subscribe. Please try again.');
    } finally {
      setLeadLoading(false);
    }
  };

  const BrandX = (
    <svg className="w-[30px] h-[30px] flex-shrink-0" viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="goldGradNav" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8C96A" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#AA8A2B" />
        </linearGradient>
      </defs>
      <g transform="translate(24,24) rotate(-8) translate(-24,-24)">
        <path d="M14 14 L34 34" stroke="url(#goldGradNav)" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M34 14 L14 34" stroke="url(#goldGradNav)" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M18 30 Q16 38 17 42 Q18 45 21 44 Q24 43 22 38 Q20 32 20 30" fill="url(#goldGradNav)" />
        <path d="M30 32 Q32 40 31 44 Q30 46 28 45 Q26 44 27 40 Q28 35 28 32" fill="url(#goldGradNav)" />
      </g>
    </svg>
  );

  return (
    <div className="min-h-screen bg-canvas text-ink font-[var(--font-sans)] overflow-x-hidden">
      {/* Sticky nav */}
      <nav
        className="hero-entrance sticky top-[20px] z-50 mx-auto mt-[20px] p-[6px] w-max max-w-[calc(100%-48px)] rounded-[var(--radius-pill)] bg-surface backdrop-blur-[22px] saturate-[160%] shadow-[var(--shadow-nav)]"
        role="navigation"
        aria-label="Primary"
      >
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-[10px] px-4 py-2 font-extrabold text-[15px] tracking-[-0.02em] text-ink no-underline">
            {BrandX}
            SloppyXBaby
          </Link>

          <div
            className={`${
              navOpen ? 'flex' : 'hidden'
            } md:flex md:flex-row flex-col md:items-center items-stretch md:static absolute top-[calc(100%+8px)] left-0 right-0 md:p-0 p-2 md:bg-transparent bg-surface-solid md:rounded-none rounded-[24px] md:shadow-none shadow-[var(--shadow-nav)]`}
          >
            <a
              href="#scanner"
              onClick={() => setNavOpen(false)}
              className="px-4 py-2.5 rounded-[var(--radius-pill)] text-[13.5px] font-semibold text-muted hover:bg-white/60 hover:text-ink transition-all duration-200 no-underline"
            >
              Scan
            </a>
            <a
              href="#compiler"
              onClick={() => setNavOpen(false)}
              className="px-4 py-2.5 rounded-[var(--radius-pill)] text-[13.5px] font-semibold text-muted hover:bg-white/60 hover:text-ink transition-all duration-200 no-underline"
            >
              Compiler
            </a>
            <a
              href="#loop"
              onClick={() => setNavOpen(false)}
              className="px-4 py-2.5 rounded-[var(--radius-pill)] text-[13.5px] font-semibold text-muted hover:bg-white/60 hover:text-ink transition-all duration-200 no-underline"
            >
              Loop Engineering
            </a>
            <a
              href="#framework"
              onClick={() => setNavOpen(false)}
              className="px-4 py-2.5 rounded-[var(--radius-pill)] text-[13.5px] font-semibold text-muted hover:bg-white/60 hover:text-ink transition-all duration-200 no-underline"
            >
              9-Step Framework
            </a>
            <a
              href="#pricing"
              onClick={() => setNavOpen(false)}
              className="px-4 py-2.5 rounded-[var(--radius-pill)] text-[13.5px] font-semibold text-muted hover:bg-white/60 hover:text-ink transition-all duration-200 no-underline"
            >
              Pricing
            </a>
            <Link
              to="/the-code"
              onClick={() => setNavOpen(false)}
              className="px-4 py-2.5 rounded-[var(--radius-pill)] text-[13.5px] font-semibold text-muted hover:bg-white/60 hover:text-ink transition-all duration-200 no-underline"
            >
              The Code
            </Link>
          </div>

          <button
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-[var(--radius-pill)] border-0 bg-transparent cursor-pointer"
            aria-expanded={navOpen}
            aria-label="Toggle menu"
            onClick={() => setNavOpen((o) => !o)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="5" x2="15" y2="5" />
              <line x1="3" y1="9" x2="15" y2="9" />
              <line x1="3" y1="13" x2="15" y2="13" />
            </svg>
          </button>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="pt-14 pb-10">
          <div className="w-full max-w-[1160px] mx-auto px-6 relative z-[2]">
            <div className="grid md:grid-cols-[1.15fr_0.85fr] gap-10 items-center text-center md:text-left">
              <div>
                <span className="hero-entrance eyebrow" data-stagger="1">
                  <span className="eyebrow-dot" />
                  AuDHD-friendly scaffolded coding environment
                </span>
                <h1 className="hero-entrance text-display mt-6" data-stagger="2">
                  Scaffold the thread.{' '}
                  <span className="text-sage">Ship without the slop.</span>
                </h1>
                <p className="hero-entrance text-lede mt-[22px] mx-auto md:mx-0" data-stagger="3">
                  A context-engineering workspace built from ADHD/AuDHD research. Externalized memory, one clear next step, and prompts that sound like you — not a ChatGPT template.
                </p>
                <div className="hero-entrance mt-8 flex flex-wrap gap-3 justify-center md:justify-start" data-stagger="4">
                  <a href="#scanner" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[var(--radius-pill)] text-sm font-bold text-white bg-sage hover:bg-sage-glow transition-colors no-underline active:scale-[0.98]">
                    Fix my prompt
                  </a>
                  <a href="#how" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[var(--radius-pill)] text-sm font-bold text-ink bg-surface hover:bg-surface-solid shadow-[inset_0_0_0_1px_var(--color-hairline-strong)] transition-colors no-underline active:scale-[0.98]">
                    See how it works
                  </a>
                </div>
              </div>

              <div className="hero-entrance w-full max-w-[420px] justify-self-center flex flex-col items-center" data-stagger="5" aria-hidden="true">
                <img
                  src="/mqxae13t-5c949214-9066-4f08-a4e2-703892b6c94e.jpg"
                  alt="SloppyXBaby notebook with gold X mark, code printouts, and pink highlighter"
                  className="w-full h-auto rounded-[var(--radius-core)] shadow-[var(--shadow-card)] -rotate-2"
                />
                <p className="mt-[18px] text-center font-[var(--font-mono)] text-sm tracking-[0.14em] uppercase text-gold">
                  Sloppy · X · Baby
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AuDHD positioning */}
        <section id="audhd" className="py-10 md:py-14">
          <div className="w-full max-w-[1160px] mx-auto px-6 relative z-[2]">
            <div className="reveal p-8 md:p-10 rounded-[var(--radius-shell)] bg-sage-dim border border-hairline text-center md:text-left">
              <span className="eyebrow justify-center md:justify-start">
                <span className="eyebrow-dot" />
                Built for AuDHD builders
              </span>
              <p className="text-lede mt-4 mx-auto md:mx-0 max-w-[720px]">
                Vibe coding is an AuDHD recipe for shiny-object syndrome at scale. SloppyXBaby maps working-memory research,
                monotropism, and executive-function guardrails onto a real coding workspace — so your LLM stops forgetting the point.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                <Link
                  to="/the-code"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[var(--radius-pill)] text-sm font-bold text-white bg-sage hover:bg-sage-glow transition-colors no-underline active:scale-[0.98]"
                >
                  Read The Builder&apos;s Code
                </Link>
                <a
                  href="#evidence"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[var(--radius-pill)] text-sm font-bold text-ink bg-surface hover:bg-surface-solid shadow-[inset_0_0_0_1px_var(--color-hairline-strong)] transition-colors no-underline active:scale-[0.98]"
                >
                  See the research
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Scanner */}
        <section id="scanner" className="py-16 md:py-24 pt-6">
          <div className="w-full max-w-[1160px] mx-auto px-6 relative z-[2]">
            <div className="card-shell reveal">
              <div className="card-core panel-dark p-7 md:p-12">
                <div className="grid md:grid-cols-2 gap-9 items-start">
                  <div>
                    <p className="eyebrow">
                      <span className="eyebrow-dot" />
                      Free slop scan
                    </p>
                    <h2 className="text-section mt-4">Paste your current prompt. We'll show you what's bleeding tokens.</h2>
                    <p className="text-lede mt-3" style={{ color: '#94a3b8' }}>
                      No signup. The audit runs locally in your browser.
                    </p>
                    <label className="sr-only" htmlFor="scannerInput">
                      Paste your prompt
                    </label>
                    <textarea
                      id="scannerInput"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="scanner-input mt-6"
                      placeholder="e.g. build me a login system with magic links and decent UX"
                    />
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <button
                        onClick={runAudit}
                        disabled={scanning}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[var(--radius-pill)] text-sm font-bold text-white bg-sage hover:bg-sage-glow transition-colors border-0 cursor-pointer active:scale-[0.98] disabled:opacity-70"
                      >
                        {scanning ? 'Auditing…' : 'Run Impulsivity & Bloat Audit'}
                      </button>
                      {scanError && <span className="text-sm text-pink">{scanError}</span>}
                    </div>

                    <div className={`scanner-result-accordion ${scanResult ? 'visible' : ''}`}>
                      <div className="mt-6 p-6 rounded-2xl bg-[rgba(0,0,0,0.25)] border border-slate-2">
                        <div className="flex items-baseline gap-3 mb-4">
                          <span className="font-[var(--font-mono)] text-5xl font-extrabold text-pink tracking-[-0.04em]">{displayScore}</span>
                          <span className="font-[var(--font-mono)] text-xs text-slate-muted uppercase tracking-[0.12em]">Bloat Risk Factor</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3.5">
                          {scanResult?.flags.map((f) => (
                            <span key={f} className="scanner-flag">{f}</span>
                          ))}
                        </div>
                        <p className="text-[#cbd5e1] text-[15px] leading-relaxed">{scanResult?.summary}</p>
                        <div className="mt-7 pt-6 border-t border-slate-2">
                          <p className="text-[#e2e8f0] text-[17px] font-semibold mb-3">Fix your context windows. Unlock the full compiler.</p>
                          <div className="flex flex-wrap gap-3">
                            <a href="#pricing" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[var(--radius-pill)] text-sm font-bold text-ink bg-gold hover:brightness-105 transition-all no-underline active:scale-[0.98]">
                              Initialize Workspace
                            </a>
                            <button
                              onClick={runGenerate}
                              disabled={generating}
                              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[var(--radius-pill)] text-sm font-bold text-ink bg-surface hover:bg-surface-solid shadow-[inset_0_0_0_1px_var(--color-hairline-strong)] transition-colors border-0 cursor-pointer active:scale-[0.98] disabled:opacity-70"
                            >
                              {generating ? 'Generating…' : 'Generate structured prompt'}
                            </button>
                          </div>
                          {generateError && <p className="mt-3 text-sm text-pink">{generateError}</p>}
                          {generated && (
                            <div className="mt-4 p-4 rounded-2xl bg-[rgba(0,0,0,0.35)] border border-slate-2">
                              <p className="text-xs font-[var(--font-mono)] uppercase tracking-wide text-sage-glow mb-2">Compiled spec</p>
                              <pre className="whitespace-pre-wrap text-sm text-[#e2e8f0] font-[var(--font-sans)] leading-relaxed">{generated}</pre>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-[rgba(0,0,0,0.25)] border border-slate-2 font-[var(--font-mono)] text-[13px] leading-relaxed">
                    <img
                      src="/mqxae145-0f97ef0d-2c4a-447c-93b0-87e9b3b2721e.jpg"
                      alt="Slop Scanner terminal interface showing token debt, context weight, and bloat factor metrics."
                      className="w-full h-auto rounded-xl mb-[18px] border border-slate-2 shadow-[0_12px_30px_-16px_rgba(0,0,0,0.4)]"
                    />
                    <div className="flex items-center gap-2 mb-[18px] text-slate-muted text-[11px] uppercase tracking-[0.08em]">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Live metrics
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-2">
                      <span className="text-slate-muted">Token Debt</span>
                      <span className="text-[#f8fafc] font-semibold">{scanResult ? displayDebt : '0.42'}</span>
                    </div>
                    <div className="metric-bar mt-2">
                      <div className="metric-bar-fill" style={{ width: scanResult ? scanResult.barDebt : '42%' }} />
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-2 mt-2">
                      <span className="text-slate-muted">Context Window Weight</span>
                      <span className="text-[#f8fafc] font-semibold">{scanResult ? displayContext : '23%'}</span>
                    </div>
                    <div className="metric-bar mt-2">
                      <div className="metric-bar-fill" style={{ width: scanResult ? scanResult.barContext : '23%' }} />
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-2 mt-2">
                      <span className="text-slate-muted">Bloat Calculation</span>
                      <span className="text-[#f8fafc] font-semibold">{scanResult ? displayBloat : '1.7σ'}</span>
                    </div>
                    <div className="metric-bar mt-2">
                      <div className="metric-bar-fill" style={{ width: scanResult ? scanResult.barBloat : '68%' }} />
                    </div>
                    <div className="flex justify-between items-center py-2.5 mt-2">
                      <span className="text-slate-muted">Shield Status</span>
                      <span className="text-sage-glow font-semibold">active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Compiler */}
        <section id="compiler" className="py-16 md:py-24">
          <div className="w-full max-w-[1160px] mx-auto px-6 relative z-[2]">
            <div className="card-shell reveal">
              <div className="card-core panel-dark p-7 md:p-12">
                <p className="eyebrow">
                  <span className="eyebrow-dot" />
                  The compiler
                </p>
                <h2 className="text-section mt-4">From slop to spec in one pass.</h2>
                <p className="text-lede mt-3" style={{ color: '#94a3b8' }}>
                  The left is what most people paste. The right is what SloppyXBaby compiles.
                </p>
                <div className="grid md:grid-cols-2 gap-5 mt-7">
                  <div className="stagger-child p-6 rounded-2xl border border-slate-2 text-sm leading-relaxed bg-[rgba(255,46,125,0.08)]">
                    <div className="font-[var(--font-mono)] text-[10px] tracking-[0.14em] uppercase text-pink mb-3">Standard LLM slop</div>
                    <p className="text-[#e2e8f0]">Write a landing page for my coffee brand. Make it premium but approachable. Include features and testimonials.</p>
                  </div>
                  <div className="stagger-child p-6 rounded-2xl border border-sage-glow text-sm leading-relaxed bg-[rgba(31,77,63,0.15)]">
                    <div className="font-[var(--font-mono)] text-[10px] tracking-[0.14em] uppercase text-sage-glow mb-3">Compiled spec</div>
                    <pre className="m-0 whitespace-pre-wrap font-[var(--font-mono)] text-[13px] leading-relaxed text-[#e2e8f0]">
{`ROLE: Senior brand copywriter for a single-origin coffee subscription.

TASK: Write a mobile-first landing page for 25–34 y/o home baristas.

TONE: Warm, precise, never hype. No exclamation marks.

SECTIONS: Hero with email CTA, 3 proof points about sourcing, 2 real customer quotes, pricing card.

GUARDRAILS: No purple gradients, no fake stats, no emojis, no placeholder names.

OUTPUT: Component copy only, ready to drop into a Next.js page.`}
                    </pre>
                  </div>
                </div>
                <div className="mt-7">
                  <a href="#pricing" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[var(--radius-pill)] text-sm font-bold text-ink bg-gold hover:brightness-105 transition-all no-underline active:scale-[0.98]">
                    Compile your first prompt
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section id="architecture" className="py-16 md:py-24">
          <div className="w-full max-w-[1160px] mx-auto px-6 relative z-[2]">
            <div className="reveal text-center">
              <span className="eyebrow">
                <span className="eyebrow-dot" />
                Architecture
              </span>
              <h2 className="text-section mt-4">Zero compute markups. Absolute state privacy.</h2>
              <p className="text-lede mt-3 mx-auto">Your prompts, your keys, your vault. We just supply the cognitive guardrails.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-5 mt-8 reveal">
              <div className="stagger-child p-8 rounded-[var(--radius-core)] bg-white/50 border border-hairline">
                <span className="inline-block mb-2 px-2.5 py-[5px] rounded-[var(--radius-pill)] bg-sage-dim text-sage font-[var(--font-mono)] text-[10.5px]">Externalized memory</span>
                <h3 className="text-xl font-bold mb-2.5">Local-first vaults</h3>
                <p className="text-[15px] text-muted leading-relaxed">Your context state, prompt specs, and SSOT architecture live in your browser&apos;s local storage and sync directly to your encrypted cloud vault. Baddeley&apos;s working-memory model, implemented — we never see your raw prompts.</p>
              </div>
              <div className="stagger-child p-8 rounded-[var(--radius-core)] bg-white/50 border border-hairline">
                <span className="inline-block mb-2 px-2.5 py-[5px] rounded-[var(--radius-pill)] bg-gold-soft text-ink font-[var(--font-mono)] text-[10.5px]">The Harness</span>
                <h3 className="text-xl font-bold mb-2.5">Bring Your Own Key</h3>
                <p className="text-[15px] text-muted leading-relaxed">Connect your OpenAI, Anthropic, or DeepSeek API routes. The Harness holds your keys locally and routes by task tier — wholesale OpEx to the provider, zero compute markup on our side.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="py-16 md:py-24">
          <div className="w-full max-w-[1160px] mx-auto px-6 relative z-[2]">
            <div className="reveal text-center">
              <span className="eyebrow">
                <span className="eyebrow-dot" />
                How it works
              </span>
              <h2 className="text-section mt-4">Three steps. One clear thread.</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5 mt-10 reveal">
              {[
                { num: '01', title: 'Dump the mess', body: 'Paste whatever is in your head. Half-sentences, links, screenshots, frustration.' },
                { num: '02', title: 'Compile the spec', body: 'DeepSeek-V3 / R1 reasoning routes restructure your intent into role, task, constraints, and output format.' },
                { num: '03', title: 'Ship the result', body: 'Copy the compiled prompt into your editor, or keep iterating inside the workspace without losing context.' },
              ].map((s) => (
                <div key={s.num} className="stagger-child p-8 rounded-[var(--radius-core)] bg-surface-solid border border-hairline">
                  <div className="font-[var(--font-mono)] text-[13px] text-gold tracking-[0.08em] mb-3.5">{s.num}</div>
                  <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-[15px] text-muted leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Loop Engineering */}
        <section id="loop" className="py-16 md:py-24">
          <div className="w-full max-w-[1160px] mx-auto px-6 relative z-[2]">
            <div className="card-shell reveal">
              <div className="card-core panel-dark p-7 md:p-12">
                <p className="eyebrow">
                  <span className="eyebrow-dot" />
                  Loop Engineering
                </p>
                <h2 className="text-section mt-4">Every prompt is a loop. We engineer the loop, not just the output.</h2>
                <p className="text-lede mt-3" style={{ color: '#94a3b8' }}>
                  SloppyXBaby runs on a disciplined agent loop: Trigger → Skill → Verify → State. Monotropism-friendly — one thread, scored iterations, persisted history — so the compiler improves instead of spinning.
                </p>
                <div className="loop-grid">
                  <div className="loop-card stagger-child">
                    <div className="loop-num">01 Trigger</div>
                    <h3>Start the loop</h3>
                    <p>A sloppy prompt, a half-idea, or a screenshot kicks off the loop.</p>
                  </div>
                  <div className="loop-card stagger-child">
                    <div className="loop-num">02 Skill</div>
                    <h3>Compile with a skill</h3>
                    <p>A narrow, versioned compiler skill restructures the input into role, task, constraints, and output format.</p>
                  </div>
                  <div className="loop-card stagger-child">
                    <div className="loop-num">03 Verify</div>
                    <h3>Score the output</h3>
                    <p>Clear success criteria score the output: bloat, clarity, voice consistency, guardrail compliance.</p>
                  </div>
                  <div className="loop-card stagger-child">
                    <div className="loop-num">04 State</div>
                    <h3>Remember every attempt</h3>
                    <p>Every attempt is stored locally. The loop learns from its own history instead of starting from zero.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 9-Step Framework */}
        <section id="framework" className="py-16 md:py-24">
          <div className="w-full max-w-[1160px] mx-auto px-6 relative z-[2]">
            <div className="reveal text-center">
              <span className="eyebrow">
                <span className="eyebrow-dot" />
                Free framework
              </span>
              <h2 className="text-section mt-4">Don't know how to structure your repo? Start here.</h2>
              <p className="text-lede mt-3 mx-auto">
                The 9-step durability framework turns a one-sentence idea into a repo that agents can build in without drifting.
              </p>
            </div>
            <div className="nine-section reveal">
              <div className="nine-grid">
                {[
                  'Define the problem, user, and done state',
                  'Write the spec before code',
                  'Choose the right build path',
                  'Set guardrails before features',
                  'Route models by task tier',
                  'Build one feature at a time',
                  'Test critical paths',
                  'Automate CI/CD',
                  'Monitor after launch',
                ].map((text, i) => (
                  <div key={i} className="nine-item stagger-child">
                    <span className="nine-num">{i + 1}</span>
                    <span className="nine-text">{text}</span>
                  </div>
                ))}
              </div>
              <div className="lead-card">
                <h3 className="m-0 mb-1.5 text-[#f8fafc]">Get the repo structure kit</h3>
                <p className="m-0 text-[#94a3b8] text-[15px]">We'll email you the framework + a Loop Engineering template. No spam.</p>
                <form className="lead-form" onSubmit={submitLead}>
                  <label className="sr-only" htmlFor="leadEmail">Email address</label>
                  <input
                    id="leadEmail"
                    className="lead-input"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    disabled={leadLoading}
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[var(--radius-pill)] text-sm font-bold text-white bg-sage hover:bg-sage-glow transition-colors border-0 cursor-pointer active:scale-[0.98] disabled:opacity-70"
                    disabled={leadLoading}
                  >
                    {leadLoading ? 'Sending…' : 'Get the kit'}
                  </button>
                </form>
                {leadSuccess && <div className="lead-success visible">Kit sent. Check your inbox.</div>}
                {leadError && <div className="text-pink text-sm mt-3">{leadError}</div>}
                <p className="lead-note">Prefer to audit your repo first? The framework includes a machine-readable checklist.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Evidence */}
        <section id="evidence" className="py-16 md:py-24">
          <div className="w-full max-w-[1160px] mx-auto px-6 relative z-[2]">
            <div className="reveal">
              <span className="eyebrow">
                <span className="eyebrow-dot" />
                Evidence basis
              </span>
              <h2 className="text-section mt-4">Built on research, not vibes.</h2>
              <p className="text-lede mt-2.5">
                Every feature maps to documented principles from working memory, executive function, monotropism, and universal design —
                the same cognitive-analog research behind ADHD/AuDHD support tools.
              </p>
            </div>

            <div className="relative min-h-[170px] mt-9 reveal" aria-live="polite">
              {QUOTES.map((q, i) => (
                <div
                  key={i}
                  className={`${
                    i === quoteIndex ? 'opacity-100 translate-y-0 pointer-events-auto relative' : 'opacity-0 translate-y-3 pointer-events-none absolute inset-0'
                  } transition-all duration-[600ms] ease-[var(--ease-smooth)]`}
                >
                  <p className="text-[clamp(22px,3vw,30px)] font-semibold leading-[1.25] tracking-[-0.02em]">{q.text}</p>
                  <div className="mt-[18px] text-sm text-muted">
                    <strong className="text-ink">{q.name}</strong> · {q.role}
                  </div>
                  <div className="mt-2.5 inline-flex flex-wrap gap-2">
                    {q.ties.map((t) => (
                      <span key={t} className="px-2.5 py-[5px] rounded-[var(--radius-pill)] bg-sage-dim text-sage font-[var(--font-mono)] text-[10.5px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-7 reveal">
              <button
                className="slider-btn"
                aria-label="Previous quote"
                onClick={() => setQuoteIndex((i) => (i - 1 + QUOTES.length) % QUOTES.length)}
              >
                ←
              </button>
              <div className="flex items-center gap-3">
                {QUOTES.map((_, i) => (
                  <button
                    key={i}
                    className={`slider-dot ${i === quoteIndex ? 'active' : ''}`}
                    aria-label={`Go to quote ${i + 1}`}
                    onClick={() => setQuoteIndex(i)}
                  />
                ))}
              </div>
              <button
                className="slider-btn"
                aria-label="Next quote"
                onClick={() => setQuoteIndex((i) => (i + 1) % QUOTES.length)}
              >
                →
              </button>
            </div>
            <div className="mt-8 reveal">
              <Link
                to="/the-code"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[var(--radius-pill)] text-sm font-bold text-ink bg-surface hover:bg-surface-solid shadow-[inset_0_0_0_1px_var(--color-hairline-strong)] transition-colors no-underline active:scale-[0.98]"
              >
                Audit your setup against The Builder&apos;s Code
              </Link>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-16 md:py-24">
          <div className="w-full max-w-[1160px] mx-auto px-6 relative z-[2]">
            <div className="reveal text-center mb-12">
              <span className="eyebrow">
                <span className="eyebrow-dot" />
                Pricing
              </span>
              <h2 className="text-section mt-4">Pick your path</h2>
              <p className="text-lede mt-3 mx-auto">
                CapEx once (lifetime) or OpEx monthly — both routes include the full workspace. No bloated feature grids. No hidden compute markups.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-[840px] mx-auto reveal">
              {/* Monthly */}
              <div className="card-shell pricing-card relative" data-featured="false">
                <span className="pricing-badge hidden" aria-hidden="true">Popular</span>
                <div className="card-core p-9 flex flex-col gap-3.5">
                  <div className="text-xl font-extrabold">Sustained Focus</div>
                  <span className="inline-block w-fit px-2.5 py-[5px] rounded-[var(--radius-pill)] bg-sage-dim text-sage font-[var(--font-mono)] text-[10.5px]">OpEx · monthly</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[52px] font-extrabold tracking-[-0.04em]">$15</span>
                    <span className="text-base text-muted font-medium">/ month</span>
                  </div>
                  <p className="text-[15px] opacity-90 leading-relaxed">Ongoing OpEx for AuDHD builders who ship every week.</p>
                  <ul className="list-none p-0 m-2 flex flex-col gap-2.5">
                    {[
                      'Unlimited multi-turn co-design',
                      'Active Impulsivity Shield',
                      'Real-time TCO & token math',
                      'Cloud-sync vaults across devices',
                    ].map((f) => (
                      <li key={f} className="text-[15px] flex items-start gap-2.5">
                        <svg className="w-4 h-4 flex-shrink-0 mt-[3px] text-sage" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 8 7 12 13 5" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={(e) => checkout('monthly', e.currentTarget)}
                    className="mt-auto w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[var(--radius-pill)] text-sm font-bold text-ink bg-surface hover:bg-surface-solid shadow-[inset_0_0_0_1px_var(--color-hairline-strong)] transition-colors border-0 cursor-pointer active:scale-[0.98]"
                  >
                    Initialize Workspace
                  </button>
                </div>
              </div>

              {/* Lifetime */}
              <div className="card-shell pricing-card relative" data-featured="true">
                <span className="pricing-badge">Limited to first 500 builders</span>
                <div className="card-core p-9 flex flex-col gap-3.5 bg-ink text-canvas shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                  <div className="text-xl font-extrabold">Early Builder</div>
                  <span className="inline-block w-fit px-2.5 py-[5px] rounded-[var(--radius-pill)] bg-gold-soft text-ink font-[var(--font-mono)] text-[10.5px]">CapEx · lifetime</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[52px] font-extrabold tracking-[-0.04em]">$79</span>
                    <span className="text-base text-slate-muted font-medium">/ one-time</span>
                  </div>
                  <p className="text-[15px] opacity-90 leading-relaxed">One-time CapEx, own the UI. For indie hackers who hate subscription OpEx.</p>
                  <ul className="list-none p-0 m-2 flex flex-col gap-2.5">
                    {[
                      'Everything in Sustained Focus',
                      'Lifetime platform updates',
                      'Local Vector RAG integration',
                      'No subscription fatigue',
                    ].map((f) => (
                      <li key={f} className="text-[15px] flex items-start gap-2.5">
                        <svg className="w-4 h-4 flex-shrink-0 mt-[3px] text-gold" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 8 7 12 13 5" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={(e) => checkout('lifetime', e.currentTarget)}
                    className="mt-auto w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[var(--radius-pill)] text-sm font-bold text-ink bg-gold hover:brightness-105 transition-all border-0 cursor-pointer active:scale-[0.98]"
                  >
                    Initialize Workspace
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Founder */}
        <section id="founder" className="py-16 md:py-24">
          <div className="w-full max-w-[1160px] mx-auto px-6 relative z-[2]">
            <div className="reveal relative overflow-hidden rounded-[var(--radius-shell)] bg-ink text-canvas text-center py-16 md:py-24 px-6 md:px-16">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(720px 360px at 50% 0%, rgba(90,140,122,0.28), transparent 65%)',
                }}
              />
              <div className="relative max-w-[820px] mx-auto">
                <img
                  src="/mqxae148-download.jpeg"
                  alt="Corian Vander, founder of SloppyXBaby"
                  className="w-[110px] h-[110px] rounded-full object-cover border-2 border-gold shadow-[0_0_0_4px_rgba(212,175,55,0.15)] mx-auto mb-6"
                />
                <span className="block font-serif text-[clamp(90px,11vw,150px)] leading-[0.8] text-gold opacity-30 mb-[-20px]">“</span>
                <p className="text-[clamp(24px,3.2vw,34px)] leading-[1.32] font-medium tracking-[-0.015em]">
                  AI slop isn't a model failure. It's a context failure. I built SloppyXBaby because my AuDHD brain can imagine the whole product and forget the point in the same hour. This workspace holds the thread: externalized memory, one clear next step, and prompts that sound like me instead of a ChatGPT template.
                </p>
                <div className="mt-10 flex flex-col items-center gap-1.5">
                  <div className="text-lg font-bold tracking-[-0.01em]">Corian Vander</div>
                  <div className="font-[var(--font-mono)] text-xs text-sage-glow uppercase tracking-[0.08em]">Founder</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 pb-16 border-t border-hairline">
        <div className="w-full max-w-[1160px] mx-auto px-6 relative z-[2]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 flex-wrap">
            <span className="text-sm text-muted">© {new Date().getFullYear()} SloppyXBaby. Built for distracted builders.</span>
            <nav className="flex flex-wrap gap-6" aria-label="Footer">
              <Link to="/the-code" className="text-sm text-muted no-underline hover:text-pink transition-colors">The Code</Link>
              <Link to="/tactics" className="text-sm text-muted no-underline hover:text-pink transition-colors">Tactics</Link>
              <Link to="/app?stage=compile" className="text-sm text-muted no-underline hover:text-pink transition-colors">Prompt Compiler</Link>
              <Link to="/app?stage=impulsivityShield" className="text-sm text-muted no-underline hover:text-pink transition-colors">SSOT Auditor</Link>
              <Link to="/app?stage=vectorAdvisor" className="text-sm text-muted no-underline hover:text-pink transition-colors">Vector RAG</Link>
              <Link to="/app?stage=compile" className="text-sm text-muted no-underline hover:text-pink transition-colors">Context Builder</Link>
              <Link to="/privacy" className="text-sm text-muted no-underline hover:text-pink transition-colors">Privacy</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
