import { useState, useEffect, useCallback, useRef } from 'react';
import {
  LlmOsPromptCompiler,
  LlmOsCoreInterface,
  DataFlywheelGuard,
  DataFlywheelAcademy,
  VibeRepoCenter,
  VibeOnboardingScaffold,
  VibeRepoArchitect,
  RiskMitigationDashboard,
  SovereignInsight,
  GravitasBoard,
  RefinementLoop,
  MemoryManager,
  ImpulsivityShield,
  SkeletonViewer,
  VectorAdvisor,
} from './components';

/* ─── AUTH TYPES ─── */
interface User {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  uid: string;
}

type StageKey =
  | 'compile'
  | 'chat'
  | 'academy'
  | 'guard'
  | 'repoCenter'
  | 'onboarding'
  | 'repoArchitect'
  | 'riskDashboard'
  | 'sovereignInsight'
  | 'gravitasBoard'
  | 'refinementLoop'
  | 'memoryManager'
  | 'impulsivityShield'
  | 'skeletonViewer'
  | 'vectorAdvisor';

/* ─── STAGE CONFIG ─── */
const STAGES: {
  key: StageKey;
  label: string;
  tag: string;
}[] = [
  { key: 'compile',    label: 'Prompt Compiler',        tag: '01 · compiler' },
  { key: 'chat',       label: 'Agent Interface',        tag: '02 · chat' },
  { key: 'guard',      label: 'Security Scanner',       tag: '03 · audit' },
  { key: 'academy',    label: 'Working Memory Playground', tag: '04 · sandbox' },
  { key: 'repoCenter', label: 'Repository Scaffold',    tag: '05 · repo' },
  { key: 'onboarding', label: 'Onboarding',             tag: '06 · onboard' },
  { key: 'repoArchitect', label: 'Repo Architect',      tag: '07 · architect' },
  { key: 'riskDashboard', label: 'Risk Dashboard',      tag: '08 · risk' },
  { key: 'sovereignInsight', label: 'Quote Banner',     tag: '09 · quotes' },
  { key: 'gravitasBoard',    label: 'Cost Board',        tag: '10 · tco' },
  { key: 'refinementLoop',   label: 'Refinement Loop',   tag: '11 · refine' },
  { key: 'memoryManager',    label: 'Memory Vault',      tag: '12 · memory' },
  { key: 'impulsivityShield', label: 'SSOT Auditor',     tag: '13 · audit' },
  { key: 'skeletonViewer',   label: 'File Tree',         tag: '14 · files' },
  { key: 'vectorAdvisor',    label: 'Vector RAG',        tag: '15 · vectors' },
];

/* ─── SVG CHEVRON ─── */
function ChevronRight({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" strokeWidth="1.6" className={className} fill="none" stroke="currentColor">
      <path d="M2.5 6h7M6 2.5L9.5 6 6 9.5" />
    </svg>
  );
}

/* ─── MAIN APP ─── */
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<StageKey>('compile');
  const [openTabs, setOpenTabs] = useState<StageKey[]>(['compile']);
  const [tabScroll, setTabScroll] = useState(0);

  const navRef = useRef<HTMLDivElement>(null);

  /* ── OAuth ── */
  const loadGapi = useCallback(() => {
    const existing = document.getElementById('gapi-script') as HTMLScriptElement | null;
    if (existing) return;
    const script = document.createElement('script');
    script.id = 'gapi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleLoaded(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => { loadGapi(); }, [loadGapi]);

  const handleCredentialResponse = useCallback(
    (response: any) => {
      try {
        const jwt = response.credential;
        const payload = JSON.parse(atob(jwt.split('.')[1]));
        setUser({
          displayName: payload.name || null,
          email: payload.email || null,
          photoURL: payload.picture || null,
          uid: payload.sub,
        });
      } catch {
        console.error('Auth parse failed');
      }
    },
    []
  );

  useEffect(() => {
    if (!googleLoaded || !window.google?.accounts?.id) return;
    const clientId = (window as any).__VITE_GAPI_CLIENT_ID__;
    if (!clientId) return;
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse,
      auto_select: false,
    });
    window.google.accounts.id.renderButton(
      document.getElementById('google-signin-btn'),
      { theme: 'outline', size: 'medium', text: 'signin_with', width: 200 }
    );
  }, [googleLoaded, handleCredentialResponse]);

  /* ── Tab management ── */
  const selectTab = useCallback((stage: StageKey) => {
    setActiveTab(stage);
    setOpenTabs((prev) => (prev.includes(stage) ? prev : [...prev, stage]));
  }, []);

  const closeTab = useCallback(
    (stage: StageKey) => {
      setOpenTabs((prev) => {
        const next = prev.filter((s) => s !== stage);
        if (activeTab === stage && next.length > 0) setActiveTab(next[next.length - 1]);
        return next;
      });
    },
    [activeTab]
  );

  /* ── Scroll reveal ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activeTab]);

  /* ── Scroll handler for tab strip ── */
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setTabScroll((prev) => prev + e.deltaY * 0.5);
  };

  const stageCfg = STAGES.find((s) => s.key === activeTab);

  /* ── Keyboard shortcuts ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '1' && e.ctrlKey) { e.preventDefault(); selectTab('compile'); }
      if (e.key === '2' && e.ctrlKey) { e.preventDefault(); selectTab('chat'); }
      if (e.key === '3' && e.ctrlKey) { e.preventDefault(); selectTab('guard'); }
      if (e.key === '4' && e.ctrlKey) { e.preventDefault(); selectTab('academy'); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectTab]);

  /* ── Google Drive helpers ── */
  const gapiLogin = async () => {
    if (!window.google?.accounts?.oauth2) return;
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: (window as any).__VITE_GAPI_CLIENT_ID__,
      scope: 'https://www.googleapis.com/auth/drive.file',
      callback: (tokenResponse: any) => {
        (window as any).__GDRIVE_ACCESS_TOKEN__ = tokenResponse.access_token;
      },
    });
    client.requestAccessToken();
  };

  const saveToDrive = async (filename: string, content: string) => {
    const token = (window as any).__GDRIVE_ACCESS_TOKEN__;
    if (!token) { await gapiLogin(); return saveToDrive(filename, content); }
    const file = new Blob([content], { type: 'application/json' });
    const metadata = { name: filename, mimeType: 'application/json' };
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);
    const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: new Headers({ Authorization: 'Bearer ' + token }),
      body: form,
    });
    if (!res.ok) throw new Error('Drive upload failed');
    return res.json();
  };

  return (
    <div className="relative min-h-[100dvh] bg-[var(--color-canvas)] text-[var(--color-ink)] font-[var(--font-sans)]">
      {/* Ambient mesh background */}
      <div className="ambient-mesh" aria-hidden="true" />

      {/* ─── FLOATING PILL NAV ─── */}
      <div className="nav-shell" ref={navRef}>
        <header className="flex items-center gap-[18px] px-3 py-1.5 rounded-full bg-white/[0.55] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
          {/* Brand mark */}
          <span className="flex items-center gap-2 font-bold text-[16px] tracking-[-0.02em] select-none">
            <span className="w-[22px] h-[22px] rounded-lg bg-linear-to-br from-[var(--color-sage)] to-[var(--color-sage-glow)] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_1px_2px_rgba(10,10,10,0.18)]" />
            AuDHD Prompt Advocate
          </span>

          {/* Stage links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {STAGES.slice(0, 6).map((stage) => (
              <button
                key={stage.key}
                onClick={() => selectTab(stage.key)}
                className={`relative inline-flex items-center px-3.5 py-2 rounded-full text-[13px] font-medium transition-colors duration-300 cursor-pointer ${
                  activeTab === stage.key
                    ? 'bg-[var(--color-sage)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
                    : 'text-[var(--color-ink)] hover:bg-black/5'
                }`}
              >
                {stage.label}
              </button>
            ))}
          </nav>

          {/* User auth */}
          <div className="flex items-center gap-3 ml-auto">
            {!user ? (
              <div id="google-signin-btn" />
            ) : (
              <div className="flex items-center gap-2">
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt=""
                    className="w-7 h-7 rounded-full ring-1 ring-black/10"
                  />
                )}
                <span className="hidden sm:inline text-[13px] font-medium text-[var(--color-muted)]">
                  {user.displayName || user.email}
                </span>
              </div>
            )}
          </div>
        </header>
      </div>

      <main className="relative z-[1] max-w-[1400px] mx-auto px-6 pt-8 pb-20">

        {/* ─── HERO AREA ─── */}
        <section className="py-16 md:py-24 reveal">
          <div className="max-w-3xl">
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              AuDHD · Working-Memory Support · 2025
            </span>
            <h1 className="text-display mt-6 mb-7 max-w-[14ch]">
              Anti-slop prompt engineering{' '}
              <span className="text-soft">for neurodivergent builders.</span>
            </h1>
            <p className="text-lede mb-8">
              A systematic prompt-compilation workspace grounded in cognitive
              accessibility research. No hero worship, no filler. Just rigor,
              structure, and clarity.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => selectTab('compile')}
                className="btn-pill"
              >
                <span>Open Compiler</span>
                <span className="btn-pill-icon"><ChevronRight className="w-3 h-3" /></span>
              </button>
              <button
                onClick={() => selectTab('academy')}
                className="btn-ghost"
              >
                Explore Sandbox
              </button>
            </div>
          </div>

          {/* Quick access bento */}
          <div className="mt-14">
            <p className="font-[var(--font-mono)] text-[10px] tracking-[0.22em] uppercase text-[var(--color-muted)] mb-4">
              Quick Access
            </p>
            <div
              className="flex gap-3 overflow-x-auto pb-3 cursor-grab active:cursor-grabbing"
              onWheel={handleWheel}
              style={{ transform: `translateX(${-tabScroll}px)` }}
            >
              {STAGES.map((stage) => (
                <button
                  key={stage.key}
                  onClick={() => selectTab(stage.key)}
                  className={`flex-shrink-0 px-5 py-3 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-500 cursor-pointer ${
                    activeTab === stage.key
                      ? 'bg-[var(--color-sage)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
                      : 'bg-white/50 shadow-[inset_0_0_0_1px_var(--color-hairline),0_12px_36px_-18px_rgba(10,10,10,0.12)] text-[var(--color-ink)] hover:bg-white/80'
                  }`}
                >
                  {stage.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TAB STRIP ─── */}
        {openTabs.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {openTabs.map((stageKey) => {
              const cfg = STAGES.find((s) => s.key === stageKey);
              if (!cfg) return null;
              return (
                <div
                  key={stageKey}
                  className={`group flex items-center gap-1.5 pl-4 pr-2 py-1.5 rounded-full text-[13px] font-medium transition-all duration-300 ${
                    activeTab === stageKey
                      ? 'bg-[var(--color-ink)] text-[var(--color-canvas)]'
                      : 'bg-white/50 text-[var(--color-muted)] hover:text-[var(--color-ink)] shadow-[inset_0_0_0_1px_var(--color-hairline)]'
                  }`}
                >
                  <button
                    onClick={() => selectTab(stageKey)}
                    className="cursor-pointer"
                  >
                    {cfg.label}
                  </button>
                  <button
                    onClick={() => closeTab(stageKey)}
                    className="w-5 h-5 inline-flex items-center justify-center rounded-full text-[11px] opacity-50 hover:opacity-100 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    &times;
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── ACTIVE STAGE TITLE ─── */}
        {stageCfg && (
          <div className="mb-8 reveal">
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              {stageCfg.tag}
            </span>
            <h2 className="text-section-head mt-3">{stageCfg.label}</h2>
          </div>
        )}

        {/* ─── VIEW CONTENT ─── */}
        <div className="reveal">
          {activeTab === 'compile' && (
            <LlmOsPromptCompiler
              user={user}
              saveToDrive={saveToDrive}
            />
          )}
          {activeTab === 'chat' && (
            <LlmOsCoreInterface user={user} />
          )}
          {activeTab === 'guard' && (
            <DataFlywheelGuard user={user} saveToDrive={saveToDrive} />
          )}
          {activeTab === 'academy' && (
            <DataFlywheelAcademy user={user} saveToDrive={saveToDrive} />
          )}
          {activeTab === 'repoCenter' && (
            <VibeRepoCenter user={user} saveToDrive={saveToDrive} />
          )}
          {activeTab === 'onboarding' && (
            <VibeOnboardingScaffold user={user} saveToDrive={saveToDrive} />
          )}
          {activeTab === 'repoArchitect' && (
            <VibeRepoArchitect user={user} saveToDrive={saveToDrive} />
          )}
          {activeTab === 'riskDashboard' && (
            <RiskMitigationDashboard user={user} saveToDrive={saveToDrive} />
          )}
          {activeTab === 'sovereignInsight' && (
            <SovereignInsight user={user} saveToDrive={saveToDrive} />
          )}
          {activeTab === 'gravitasBoard' && (
            <GravitasBoard user={user} saveToDrive={saveToDrive} />
          )}
          {activeTab === 'refinementLoop' && (
            <RefinementLoop user={user} saveToDrive={saveToDrive} />
          )}
          {activeTab === 'memoryManager' && (
            <MemoryManager user={user} saveToDrive={saveToDrive} />
          )}
          {activeTab === 'impulsivityShield' && (
            <ImpulsivityShield user={user} saveToDrive={saveToDrive} />
          )}
          {activeTab === 'skeletonViewer' && (
            <SkeletonViewer user={user} saveToDrive={saveToDrive} />
          )}
          {activeTab === 'vectorAdvisor' && (
            <VectorAdvisor user={user} saveToDrive={saveToDrive} />
          )}
        </div>

        {/* ─── MARQUEE ─── */}
        <section className="mt-24 py-14 overflow-hidden marquee reveal">
          <div className="marquee-track">
            <span className="font-bold text-[22px] tracking-[-0.02em] text-[var(--color-ink)] opacity-55 whitespace-nowrap">
              Baddeley Working Memory<em className="not-italic text-[var(--color-muted)] mx-3">&middot;</em>
              Barkley Executive Functions<em className="not-italic text-[var(--color-muted)] mx-3">&middot;</em>
              Dunn Sensory Processing<em className="not-italic text-[var(--color-muted)] mx-3">&middot;</em>
              No Fake Metrics<em className="not-italic text-[var(--color-muted)] mx-3">&middot;</em>
              Evidence-Based Prompting<em className="not-italic text-[var(--color-muted)] mx-3">&middot;</em>
              Working-Memory Scaffolding<em className="not-italic text-[var(--color-muted)] mx-3">&middot;</em>
            </span>
            <span className="font-bold text-[22px] tracking-[-0.02em] text-[var(--color-ink)] opacity-55 whitespace-nowrap" aria-hidden="true">
              Baddeley Working Memory<em className="not-italic text-[var(--color-muted)] mx-3">&middot;</em>
              Barkley Executive Functions<em className="not-italic text-[var(--color-muted)] mx-3">&middot;</em>
              Dunn Sensory Processing<em className="not-italic text-[var(--color-muted)] mx-3">&middot;</em>
              No Fake Metrics<em className="not-italic text-[var(--color-muted)] mx-3">&middot;</em>
              Evidence-Based Prompting<em className="not-italic text-[var(--color-muted)] mx-3">&middot;</em>
              Working-Memory Scaffolding<em className="not-italic text-[var(--color-muted)] mx-3">&middot;</em>
            </span>
          </div>
        </section>

        {/* ─── CLOSING BAND ─── */}
        <section className="closing-surface mt-16 mx-auto max-w-[1040px] px-8 py-24 text-center reveal">
          <div className="relative z-[1]">
            <h2 className="text-[clamp(40px,5.5vw,76px)] font-bold tracking-[-0.035em] leading-[1] mb-5 max-w-[18ch] mx-auto">
              Less noise, more signal.
            </h2>
            <p className="text-[var(--color-inverted-text)] opacity-65 text-[17px] max-w-[48ch] mx-auto mb-8 leading-relaxed">
              Built on cognitive accessibility research. Every pattern is
              evidence-based. Every template serves working-memory support.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => selectTab('compile')}
                className="btn-pill"
              >
                <span>Start Compiling</span>
                <span className="btn-pill-icon"><ChevronRight className="w-3 h-3" /></span>
              </button>
              <button
                onClick={() => selectTab('academy')}
                className="btn-ghost"
              >
                Open Sandbox
              </button>
            </div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className="mt-16 pt-9 pb-7 border-t border-[var(--color-hairline)]">
          <div className="flex justify-between items-center gap-4 flex-wrap font-[var(--font-mono)] text-[11px] text-[var(--color-muted)] tracking-[0.06em]">
            <span>AuDHD Prompt Advocate &middot; Evidence-Based Design &middot; 2025</span>
            <div className="flex gap-4">
              <button onClick={() => selectTab('compile')} className="hover:text-[var(--color-ink)] transition-colors cursor-pointer">Compiler</button>
              <button onClick={() => selectTab('academy')} className="hover:text-[var(--color-ink)] transition-colors cursor-pointer">Sandbox</button>
              <button onClick={() => selectTab('guard')} className="hover:text-[var(--color-ink)] transition-colors cursor-pointer">Scanner</button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
