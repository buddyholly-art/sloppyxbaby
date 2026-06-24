import { useState, useEffect } from "react";
import { AUTHORITIES_SSOT, calculatePromptTco, Authority } from "../lib/authoritySsot";
import { Scale, ShieldAlert, Award, ChevronRight, Coins, Cpu, HelpCircle } from "lucide-react";

interface GravitasBoardProps {
  currentInputPrompt: string;
}

export default function GravitasBoard({ currentInputPrompt }: GravitasBoardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [focusedTcoAspect, setFocusedTcoAspect] = useState<"money" | "space" | "maintenance">("maintenance");
  const [isHovered, setIsHovered] = useState(false);
  const [showFormulaBreakdown, setShowFormulaBreakdown] = useState(false);

  // Auto-rotate quotes every 20 seconds, unless hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % AUTHORITIES_SSOT.length);
    }, 20000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const currentAuthority = AUTHORITIES_SSOT[currentIndex];
  const tco = calculatePromptTco(currentInputPrompt);

  const nextAuthorityGracefully = () => {
    setCurrentIndex((prev) => (prev + 1) % AUTHORITIES_SSOT.length);
  };

  // Safe color scale for Complexity Debt Index
  const getComplexityColor = (score: number) => {
    if (score === 0) return "text-[var(--color-muted)] bg-[var(--color-canvas-2)] border-[var(--color-hairline)]";
    if (score < 25) return "text-[var(--color-sage)] bg-[var(--color-sage)]/[0.05] border-[var(--color-sage)]/[0.12]";
    if (score < 60) return "text-amber-600 bg-amber-500/[0.05] border-amber-500/[0.12]";
    return "text-rose-500 bg-rose-500/[0.05] border-rose-500/[0.12]";
  };

  const getRiskBorderColor = (level: string) => {
    if (level === "Ultra Low") return "border-[var(--color-sage)]/30";
    if (level === "Moderate (Careful)") return "border-amber-500/30";
    return "border-rose-500/30";
  };

  return (
    <div
      className="card-shell overflow-hidden transition-all duration-500"
      id="gravitas-board-root"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[var(--color-hairline)]">

        {/* Left: Authority Carousel */}
        <div className="lg:col-span-7 p-6 flex flex-col justify-between gap-5" id="authority-carousel-side">
          <div className="space-y-4 text-left">
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="eyebrow">
                  <span className="eyebrow-dot" />
                  <span>Edict {currentAuthority.edictId}</span>
                </span>
                <span className="text-xs text-[var(--color-muted)] font-[var(--font-sans)] tracking-wide uppercase font-semibold">
                  Gravitas Authority
                </span>
              </div>
              <button
                id="next-authority-btn"
                onClick={nextAuthorityGracefully}
                className="btn-ghost flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5"
                title="Rotate to next academic or industry authority"
              >
                <span>Rotate Expert</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 min-h-[100px] flex flex-col justify-center" id="authority-quote-viewport">
              <blockquote className="text-[var(--color-ink)] text-sm font-[var(--font-sans)] italic leading-relaxed font-medium">
                &ldquo;{currentAuthority.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3 pt-1">
                <div className="w-2 h-2 rounded-full bg-[var(--color-sage)] shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-[var(--color-ink)] font-[var(--font-sans)] tracking-tight">
                    {currentAuthority.name}
                  </h4>
                  <p className="text-xs text-[var(--color-muted)] font-[var(--font-sans)]">
                    {currentAuthority.role} · <span className="text-[var(--color-muted)]/60">{currentAuthority.institution}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* TCO Impact Vector */}
          <div
            className="card-core p-4 space-y-3 transition-all text-left"
            id="authority-vector-consequence"
          >
            <div className="flex items-center gap-1.5 text-xs font-[var(--font-mono)] tracking-wide text-[var(--color-muted)] uppercase font-bold">
              <Scale className="w-3.5 h-3.5 text-[var(--color-sage)]" />
              <span>SSOT Structural Consequence: {focusedTcoAspect.toUpperCase()}</span>
            </div>

            <p className="text-xs text-[var(--color-muted)] leading-relaxed font-[var(--font-sans)]">
              {currentAuthority.tcoVector[focusedTcoAspect]}
            </p>

            <div className="flex gap-2 pt-1 font-[var(--font-mono)] text-xs flex-wrap">
              <button
                id="vector-tab-money"
                onClick={() => setFocusedTcoAspect("money")}
                className={`px-3 py-1.5 rounded-lg border transition-all duration-300 cursor-pointer ${
                  focusedTcoAspect === "money"
                    ? "bg-[var(--color-sage)]/10 border-[var(--color-sage)]/20 text-[var(--color-sage)] font-bold"
                    : "bg-[var(--color-surface)] border-[var(--color-hairline)] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                }`}
              >
                Money ($)
              </button>
              <button
                id="vector-tab-space"
                onClick={() => setFocusedTcoAspect("space")}
                className={`px-3 py-1.5 rounded-lg border transition-all duration-300 cursor-pointer ${
                  focusedTcoAspect === "space"
                    ? "bg-sky-50 border-sky-200 text-sky-700 font-bold"
                    : "bg-[var(--color-surface)] border-[var(--color-hairline)] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                }`}
              >
                Space (Cache)
              </button>
              <button
                id="vector-tab-maint"
                onClick={() => setFocusedTcoAspect("maintenance")}
                className={`px-3 py-1.5 rounded-lg border transition-all duration-300 cursor-pointer ${
                  focusedTcoAspect === "maintenance"
                    ? "bg-rose-50 border-rose-200 text-rose-700 font-bold"
                    : "bg-[var(--color-surface)] border-[var(--color-hairline)] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                }`}
              >
                Maintenance Liability
              </button>
            </div>
          </div>
        </div>

        {/* Right: TCO Calculus */}
        <div className="lg:col-span-5 p-6 flex flex-col justify-between gap-5 bg-[var(--color-canvas)]" id="tco-ledger-side">
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--color-muted)] font-[var(--font-sans)] tracking-wider uppercase font-bold">
                  Total Cost of Ownership
                </span>
                <button
                  type="button"
                  onClick={() => setShowFormulaBreakdown(!showFormulaBreakdown)}
                  className="text-xs font-bold text-[var(--color-sage)] hover:text-[var(--color-sage-glow)] font-[var(--font-sans)] flex items-center gap-1 cursor-pointer transition-colors"
                  title="View TCO mathematical calculation formula"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[var(--color-sage)] shrink-0" />
                  <span className="text-xs font-[var(--font-mono)] underline">Formula</span>
                </button>
              </div>
              <div className={`px-2.5 py-1 rounded-lg border text-xs font-[var(--font-mono)] uppercase font-bold tracking-wide ${
                tco.maintenanceRiskLevel === "Ultra Low" ? "bg-[var(--color-sage)]/10 border-[var(--color-sage)]/20 text-[var(--color-sage)]" :
                tco.maintenanceRiskLevel === "Moderate (Careful)" ? "bg-amber-50 border-amber-200 text-amber-700" :
                "bg-rose-50 border-rose-200 text-rose-700"
              }`}>
                {tco.maintenanceRiskLevel}
              </div>
            </div>

            {/* Main TCO Metrics */}
            <div className="grid grid-cols-3 gap-3" id="tco-metrics-dashboard">

              {/* Metric 1: Financial */}
              <div className="card-core p-3 flex flex-col justify-between h-[72px]" id="metric-tco-money">
                <span className="text-xs text-[var(--color-muted)] font-[var(--font-sans)] tracking-wide uppercase font-bold flex items-center gap-1">
                  <Coins className="w-3 h-3 text-[var(--color-sage)]" />
                  <span>Cost/100</span>
                </span>
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-[var(--color-ink)] font-[var(--font-mono)] truncate tabular-nums">
                    ${(tco.totalExecutionCost * 100).toFixed(4)}
                  </div>
                  <p className="text-xs text-[var(--color-muted)] truncate font-[var(--font-mono)]">{tco.estimatedTokens} tkn</p>
                </div>
              </div>

              {/* Metric 2: Spatial */}
              <div className="card-core p-3 flex flex-col justify-between h-[72px]" id="metric-tco-space">
                <span className="text-xs text-[var(--color-muted)] font-[var(--font-sans)] tracking-wide uppercase font-bold flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-sky-600" />
                  <span>Cache</span>
                </span>
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-[var(--color-ink)] font-[var(--font-mono)] tabular-nums">
                    {tco.contextWindowWeightPercentage}%
                  </div>
                  <p className="text-xs text-[var(--color-muted)] font-[var(--font-mono)]">of 128K</p>
                </div>
              </div>

              {/* Metric 3: Maintenance Liability */}
              <div className="card-core p-3 flex flex-col justify-between h-[72px]" id="metric-tco-liability">
                <span className="text-xs text-[var(--color-muted)] font-[var(--font-sans)] tracking-wide uppercase font-bold flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-rose-500" />
                  <span>Debt</span>
                </span>
                <div className="space-y-0.5">
                  <div className={`text-xs font-bold font-[var(--font-mono)] px-1.5 py-0.5 rounded-md inline-block ${
                    tco.complexityDebtIndex > 60 ? "text-rose-700 bg-rose-50" : tco.complexityDebtIndex > 25 ? "text-amber-700 bg-amber-50" : "text-[var(--color-sage)] bg-[var(--color-sage)]/10"
                  }`}>
                    {tco.complexityDebtIndex}/100
                  </div>
                  <p className="text-xs text-[var(--color-muted)]">Liability</p>
                </div>
              </div>

            </div>
          </div>

          {/* Formula Breakdown Panel */}
          {showFormulaBreakdown && (
            <div className="card-core p-4 text-xs text-[var(--color-muted)] space-y-3 font-[var(--font-mono)] text-left" id="tco-formula-breakdown-panel">
              <div className="flex justify-between items-center text-[var(--color-sage)] font-[var(--font-sans)] font-bold border-b border-[var(--color-hairline)] pb-2 text-xs uppercase">
                <span>Mathematical Calculus Rules</span>
                <button onClick={() => setShowFormulaBreakdown(false)} className="text-[var(--color-muted)] hover:text-[var(--color-ink)] text-xs cursor-pointer font-bold transition-colors">Hide</button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[var(--color-ink)] font-bold block text-xs font-[var(--font-sans)]">1. Cost/100 Runs ($):</span>
                  <div className="text-[var(--color-sage)] text-xs bg-[var(--color-canvas-2)] px-2 py-1 rounded-md border border-[var(--color-hairline)] mt-1 select-all">
                    Tokens = Char_Length / 4<br />
                    Cost = (Tokens / 1000) * $0.00125 * 100
                  </div>
                  <p className="text-xs text-[var(--color-muted)] font-[var(--font-sans)] leading-relaxed mt-1">
                    Based on standard API developer pricing ($0.00125 per 1K tokens) extrapolated across 100 context re-loads.
                  </p>
                </div>
                <div className="border-t border-[var(--color-hairline)] pt-2">
                  <span className="text-[var(--color-ink)] font-bold block text-xs font-[var(--font-sans)]">2. Cache Weight (%):</span>
                  <div className="text-[var(--color-sage)] text-xs bg-[var(--color-canvas-2)] px-2 py-1 rounded-md border border-[var(--color-hairline)] mt-1 select-all">
                    Cache % = (Tokens / 128,000) * 100
                  </div>
                  <p className="text-xs text-[var(--color-muted)] font-[var(--font-sans)] leading-relaxed mt-1">
                    Proportion of developer's working context window used. Excessively long prompts congest active memory.
                  </p>
                </div>
                <div className="border-t border-[var(--color-hairline)] pt-2">
                  <span className="text-[var(--color-ink)] font-bold block text-xs font-[var(--font-sans)]">3. Complexity Debt Index (/100):</span>
                  <div className="text-[var(--color-sage)] text-xs bg-[var(--color-canvas-2)] px-2 py-1 rounded-md border border-[var(--color-hairline)] mt-1 select-all">
                    Debt = (Lines * 0.8) + (CurlyVars * 5) + (VagueAdjectives * 10) + (NestedUIIndicators * 15)
                  </div>
                  <p className="text-xs text-[var(--color-muted)] font-[var(--font-sans)] leading-relaxed mt-1">
                    Computes code fragility risk. Heavy line weights, unvetted curly brackets, or vague hype adjectives produce unstable code.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Diagnostic Feedback */}
          <div className="card-core p-4 space-y-2 text-left">
            <div className="flex items-center gap-2 text-xs font-[var(--font-mono)] uppercase tracking-wide text-[var(--color-muted)] font-bold">
              <Award className="w-4 h-4 text-[var(--color-sage)]" />
              <span>Real-time Liability Diagnosis</span>
            </div>
            <p className="text-xs text-[var(--color-muted)] leading-relaxed font-[var(--font-sans)]">
              {tco.criticism}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
