import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CognitiveAnalogPanel from './CognitiveAnalogPanel';
import {
  DEMO_PROMPT_SCENARIOS,
  formatCompiledPrompt,
  getDemoScenario,
  type DemoPromptScenario,
} from '../lib/demoPromptScenarios';
import { scanFromHeuristic, scanFromScenario, type PromptScanResult } from '../lib/demoPromptAudit';

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
  const range = endValue;

  function step(now: number) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    setter((range * eased).toFixed(decimals) + suffix);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

export type SloppyPromptTourProps = {
  variant?: 'dark' | 'light';
  mode: 'demo' | 'live';
  inputPrompt?: string;
  onPromptChange?: (text: string) => void;
  onScenarioChange?: (scenario: DemoPromptScenario | null) => void;
  onScanResultChange?: (result: PromptScanResult | null) => void;
  initialScenarioId?: string;
  layout?: 'split' | 'stacked';
  metricsImageSrc?: string;
};

export default function SloppyPromptTour({
  variant = 'dark',
  mode,
  inputPrompt = '',
  onPromptChange,
  onScenarioChange,
  onScanResultChange,
  initialScenarioId,
  layout = 'stacked',
  metricsImageSrc,
}: SloppyPromptTourProps) {
  const defaultId = initialScenarioId && getDemoScenario(initialScenarioId)
    ? initialScenarioId
    : DEMO_PROMPT_SCENARIOS[0].id;

  const [selectedScenarioId, setSelectedScenarioId] = useState(defaultId);
  const [customMode, setCustomMode] = useState(false);
  const [prompt, setPrompt] = useState(getDemoScenario(defaultId)?.sloppyPrompt ?? '');
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  const [scanResult, setScanResult] = useState<PromptScanResult | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState('');

  const [displayScore, setDisplayScore] = useState('0%');
  const [displayExecutive, setDisplayExecutive] = useState('0%');
  const [displayWmOverflow, setDisplayWmOverflow] = useState('0%');
  const [displayConfab, setDisplayConfab] = useState('0.0σ');

  const selectedScenario = getDemoScenario(selectedScenarioId);
  const isDark = variant === 'dark';

  const publishScan = (result: PromptScanResult | null) => {
    setScanResult(result);
    onScanResultChange?.(result);
  };

  const syncPrompt = (text: string) => {
    setPrompt(text);
    onPromptChange?.(text);
  };

  const applyScenario = (scenario: DemoPromptScenario, runAudit = true) => {
    setCustomMode(false);
    setSelectedScenarioId(scenario.id);
    syncPrompt(scenario.sloppyPrompt);
    onScenarioChange?.(scenario);
    setGenerated(null);
    setGenerateError('');
    if (runAudit) runAuditForScenario(scenario);
  };

  const runAuditForScenario = (scenario: DemoPromptScenario) => {
    setScanError('');
    setGenerated(null);
    setGenerateError('');
    setScanning(true);
    setTimeout(() => {
      publishScan(scanFromScenario(scenario));
      setScanning(false);
    }, mode === 'demo' ? 650 : 400);
  };

  const runAudit = () => {
    if (!customMode && selectedScenario) {
      runAuditForScenario(selectedScenario);
      return;
    }
    const text = prompt.trim();
    if (!text) {
      setScanError('Paste a prompt first.');
      return;
    }
    setScanError('');
    setGenerated(null);
    setGenerateError('');
    setScanning(true);
    onScenarioChange?.(null);
    setTimeout(() => {
      publishScan(scanFromHeuristic(text));
      setScanning(false);
    }, 700);
  };

  const selectScenario = (id: string) => {
    const scenario = getDemoScenario(id);
    if (scenario) applyScenario(scenario);
  };

  const runDemoCompile = () => {
    if (!selectedScenario || customMode) {
      setGenerateError('Demo compile uses preset scenarios. Open the codespace for live compile with your keys.');
      return;
    }
    setGenerating(true);
    setGenerateError('');
    setGenerated(null);
    setTimeout(() => {
      setGenerated(formatCompiledPrompt(selectedScenario));
      setGenerating(false);
    }, 500);
  };

  useEffect(() => {
    const scenario = getDemoScenario(defaultId);
    if (scenario) {
      onScenarioChange?.(scenario);
      runAuditForScenario(scenario);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount bootstrap only
  }, []);

  useEffect(() => {
    if (!scanResult) return;
    countUp(setDisplayScore, scanResult.score, '%', 900, 0);
    countUp(setDisplayExecutive, scanResult.impulsivityScore, '%', 900, 0);
    countUp(setDisplayWmOverflow, scanResult.bloatScore, '%', 900, 0);
    countUp(setDisplayConfab, scanResult.confabScore / 30, 'σ', 900, 1);
  }, [scanResult]);

  useEffect(() => {
    if (customMode && inputPrompt !== prompt) {
      setPrompt(inputPrompt);
    }
  }, [customMode, inputPrompt, prompt]);

  const controls = (
    <>
      <div className="flex flex-wrap gap-2" role="listbox" aria-label="Demo prompt scenarios">
        {DEMO_PROMPT_SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            role="option"
            aria-selected={!customMode && selectedScenarioId === scenario.id}
            onClick={() => selectScenario(scenario.id)}
            className={`scenario-chip ${!customMode && selectedScenarioId === scenario.id ? 'scenario-chip-active' : ''} ${!isDark ? 'scenario-chip-light' : ''}`}
          >
            <span className="scenario-chip-label">{scenario.label}</span>
            <span className="scenario-chip-tag">{scenario.tag}</span>
          </button>
        ))}
      </div>

      {!customMode && selectedScenario ? (
        <div className={`scanner-prompt-preview mt-4 ${!isDark ? 'scanner-prompt-preview-light' : ''}`}>
          <p className={`font-[var(--font-mono)] text-[10px] tracking-[0.14em] uppercase mb-2 ${isDark ? 'text-pink' : 'text-[var(--color-pink)]'}`}>
            Sloppy input
          </p>
          <p className={`text-[15px] leading-relaxed m-0 ${isDark ? 'text-[#e2e8f0]' : 'text-[var(--color-ink)]'}`}>
            {selectedScenario.sloppyPrompt}
          </p>
        </div>
      ) : (
        <>
          <label className="sr-only" htmlFor="sloppy-tour-input">
            Paste your prompt
          </label>
          <textarea
            id="sloppy-tour-input"
            value={prompt}
            onChange={(e) => syncPrompt(e.target.value)}
            className={`scanner-input mt-4 ${!isDark ? 'scanner-input-light' : ''}`}
            placeholder="e.g. build me a login system with magic links and decent UX"
          />
        </>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={runAudit}
          disabled={scanning}
          className={
            isDark
              ? 'inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[var(--radius-pill)] text-sm font-bold text-white bg-sage hover:bg-sage-glow transition-colors border-0 cursor-pointer active:scale-[0.98] disabled:opacity-70'
              : 'btn-pill text-sm disabled:opacity-70'
          }
        >
          {scanning ? 'Auditing…' : customMode ? 'Run heuristic audit' : 'Re-run audit'}
        </button>
        <button
          type="button"
          onClick={() => {
            if (customMode) {
              setCustomMode(false);
              selectScenario(selectedScenarioId);
            } else {
              setCustomMode(true);
              syncPrompt('');
              publishScan(null);
              setGenerated(null);
              setGenerateError('');
              onScenarioChange?.(null);
            }
          }}
          className={`text-sm bg-transparent border-0 cursor-pointer underline underline-offset-2 ${isDark ? 'text-slate-muted hover:text-[#e2e8f0]' : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'}`}
        >
          {customMode ? 'Back to demo prompts' : 'Or paste your own (audit only)'}
        </button>
        {scanError && <span className={`text-sm ${isDark ? 'text-pink' : 'text-[var(--color-pink)]'}`}>{scanError}</span>}
      </div>
    </>
  );

  const results = (
    <div className={`scanner-result-accordion ${scanResult ? 'visible' : ''}`}>
      <div className={`mt-6 p-6 rounded-2xl border ${isDark ? 'bg-[rgba(0,0,0,0.25)] border-slate-2' : 'card-core'}`}>
        {!customMode && selectedScenario && scanResult && (
          <div className="mb-5">
            <CognitiveAnalogPanel cognitive={selectedScenario.cognitive} variant={variant} />
          </div>
        )}
        <div className="flex items-baseline gap-3 mb-4">
          <span className={`font-[var(--font-mono)] text-5xl font-extrabold tracking-[-0.04em] ${isDark ? 'text-pink' : 'text-[var(--color-pink)]'}`}>
            {displayScore}
          </span>
          <span className={`font-[var(--font-mono)] text-xs uppercase tracking-[0.12em] ${isDark ? 'text-slate-muted' : 'text-[var(--color-muted)]'}`}>
            {!customMode && selectedScenario
              ? selectedScenario.cognitive.metricLabels.combined
              : 'Combined heuristic risk'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mb-3.5">
          {scanResult?.flags.map((f) => (
            <span key={f} className="scanner-flag">{f}</span>
          ))}
        </div>
        <p className={`text-[15px] leading-relaxed ${isDark ? 'text-[#cbd5e1]' : 'text-[var(--color-muted)]'}`}>
          {scanResult?.summary}
        </p>

        {mode === 'demo' && (
          <div className={`mt-7 pt-6 border-t ${isDark ? 'border-slate-2' : 'border-[var(--color-hairline)]'}`}>
            <p className={`text-[17px] font-semibold mb-3 ${isDark ? 'text-[#e2e8f0]' : 'text-[var(--color-ink)]'}`}>
              See the compiled spec for this scenario.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={runDemoCompile}
                disabled={generating || customMode}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[var(--radius-pill)] text-sm font-bold text-ink bg-gold hover:brightness-105 transition-all border-0 cursor-pointer active:scale-[0.98] disabled:opacity-70"
              >
                {generating ? 'Compiling…' : 'Show compiled spec (demo)'}
              </button>
              <Link
                to={`/app?stage=compile&scenario=${selectedScenarioId}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[var(--radius-pill)] text-sm font-bold text-ink bg-surface hover:bg-surface-solid shadow-[inset_0_0_0_1px_var(--color-hairline-strong)] transition-colors no-underline active:scale-[0.98]"
              >
                Live compile in codespace
              </Link>
            </div>
            {generateError && <p className={`mt-3 text-sm ${isDark ? 'text-pink' : 'text-[var(--color-pink)]'}`}>{generateError}</p>}
            {generated && selectedScenario && (
              <div className={`mt-4 p-4 rounded-2xl border ${isDark ? 'bg-[rgba(0,0,0,0.35)] border-slate-2' : 'card-core'}`}>
                <p className="text-xs font-[var(--font-mono)] uppercase tracking-wide text-sage-glow mb-2">
                  {selectedScenario.compiledPrefix}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedScenario.cognitive.scaffolds.map((scaffold) => (
                    <span key={scaffold} className="scaffold-chip">{scaffold}</span>
                  ))}
                </div>
                <pre className={`whitespace-pre-wrap text-sm leading-relaxed m-0 font-[var(--font-sans)] ${isDark ? 'text-[#e2e8f0]' : 'text-[var(--color-ink)]'}`}>
                  {generated}
                </pre>
              </div>
            )}
          </div>
        )}

        {mode === 'live' && !customMode && selectedScenario && (
          <div className={`mt-7 pt-6 border-t ${isDark ? 'border-slate-2' : 'border-[var(--color-hairline)]'}`}>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-[#cbd5e1]' : 'text-[var(--color-muted)]'}`}>
              Scaffolds above will be injected into your live compile. Use <strong className="text-[var(--color-ink)]">Optimize Prompt Spec</strong> below when your API key is configured.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedScenario.cognitive.scaffolds.map((scaffold) => (
                <span key={scaffold} className="scaffold-chip">{scaffold}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const metrics = (
    <div className={`p-6 rounded-2xl border font-[var(--font-mono)] text-[13px] leading-relaxed ${isDark ? 'bg-[rgba(0,0,0,0.25)] border-slate-2' : 'card-core'}`}>
      {metricsImageSrc && (
        <img
          src={metricsImageSrc}
          alt="Slop Scanner terminal interface showing cognitive analog metrics."
          className={`w-full h-auto rounded-xl mb-[18px] border shadow-[0_12px_30px_-16px_rgba(0,0,0,0.4)] ${isDark ? 'border-slate-2' : 'border-[var(--color-hairline)]'}`}
        />
      )}
      <div className={`flex items-center gap-2 mb-[18px] text-[11px] uppercase tracking-[0.08em] ${isDark ? 'text-slate-muted' : 'text-[var(--color-muted)]'}`}>
        <span className="w-2 h-2 rounded-full bg-red-500" />
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        Cognitive analog metrics
      </div>
      <MetricRow
        label={!customMode && selectedScenario ? selectedScenario.cognitive.metricLabels.executive : 'Executive load'}
        value={scanResult ? displayExecutive : '39%'}
        barWidth={scanResult ? scanResult.barExecutive : '39%'}
        isDark={isDark}
      />
      <MetricRow
        label={!customMode && selectedScenario ? selectedScenario.cognitive.metricLabels.wmOverflow : 'WM overflow'}
        value={scanResult ? displayWmOverflow : '12%'}
        barWidth={scanResult ? scanResult.barWmOverflow : '12%'}
        isDark={isDark}
      />
      <MetricRow
        label={!customMode && selectedScenario ? selectedScenario.cognitive.metricLabels.confabulation : 'Confabulation pressure'}
        value={scanResult ? displayConfab : '0.8σ'}
        barWidth={scanResult ? scanResult.barConfab : '45%'}
        isDark={isDark}
      />
      <div className="flex justify-between items-center py-2.5 mt-2">
        <span className={isDark ? 'text-slate-muted' : 'text-[var(--color-muted)]'}>Shield Status</span>
        <span className="text-sage-glow font-semibold">active</span>
      </div>
    </div>
  );

  if (layout === 'split') {
    return (
      <div className="grid md:grid-cols-2 gap-9 items-start">
        <div>
          {controls}
          {results}
        </div>
        {metrics}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="card-shell p-5 space-y-4" id="sloppy-prompt-tour">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-[var(--font-mono)] font-bold text-[var(--color-sage)] uppercase tracking-wide">
            Sloppy prompt tour
          </span>
          {mode === 'live' && (
            <span className="text-[10px] font-[var(--font-mono)] text-[var(--color-muted)]">
              · continues from landing demo
            </span>
          )}
        </div>
        {controls}
        <div className="grid md:grid-cols-2 gap-4">
          {results}
          {metrics}
        </div>
      </div>
    </div>
  );
}

function MetricRow({
  label,
  value,
  barWidth,
  isDark,
}: {
  label: string;
  value: string;
  barWidth: string;
  isDark: boolean;
}) {
  return (
    <>
      <div className={`flex justify-between items-center py-2.5 border-b ${isDark ? 'border-slate-2' : 'border-[var(--color-hairline)]'}`}>
        <span className={isDark ? 'text-slate-muted' : 'text-[var(--color-muted)]'}>{label}</span>
        <span className={`font-semibold ${isDark ? 'text-[#f8fafc]' : 'text-[var(--color-ink)]'}`}>{value}</span>
      </div>
      <div className="metric-bar mt-2">
        <div className="metric-bar-fill" style={{ width: barWidth }} />
      </div>
    </>
  );
}