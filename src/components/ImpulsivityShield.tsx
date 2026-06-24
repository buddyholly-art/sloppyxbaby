import { useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  Coins,
  Gauge,
  Zap,
  Copy,
  Check,
  Eye,
  Info
} from "lucide-react";

interface ImpulsivityShieldProps {
  currentInputPrompt?: string;
}

export default function ImpulsivityShield({ currentInputPrompt = "" }: ImpulsivityShieldProps) {
  // Scenario selector for impulsivity test
  const [targetSurface, setTargetSurface] = useState("App.tsx");
  const [newIdeaName, setNewIdeaName] = useState("");
  const [copiedAudit, setCopiedAudit] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Diagnostic questions
  const [answers, setAnswers] = useState<Record<string, number>>({
    dup_input: 1,
    new_db: 1,
    high_arousal: 1,
    dup_config: 0,
    card_vs_page: 2,
    ai_slop_tells: 1,
    metric_and_copy_slop: 1
  });

  // Simple script parser playground
  const [draftProposal, setDraftProposal] = useState(currentInputPrompt || "");
  const [simulatedAuditResult, setSimulatedAuditResult] = useState<{
    bloatScore: number;
    grade: string;
    gradeColor: string;
    actionableAdvice: string[];
    contractChecks: Array<{ edictId: number; title: string; subtitle: string; pass: boolean; feedback: string }>;
  } | null>(null);

  const questions = [
    {
      key: "dup_input",
      label: "Input Overlap",
      desc: "Does another file or screen in your project already handle a general input form, search, or button trigger?",
      options: [
        { label: "No (Unique interaction)", val: 0 },
        { label: "Partially (Can be merged)", val: 1 },
        { label: "Yes (Identical inputs present)", val: 2 }
      ]
    },
    {
      key: "new_db",
      label: "Database & Tables State",
      desc: "Are you planning to deploy a new table/file schema, rather than extending an existing collection or local state?",
      options: [
        { label: "No (Uses current state)", val: 0 },
        { label: "Partially (Extends existing schema)", val: 1 },
        { label: "Yes (Needs new schema/collections)", val: 2 }
      ]
    },
    {
      key: "high_arousal",
      label: "Arousal / Dopamine Trigger",
      desc: "Is this feature prompted by a sudden wave of ideas (shiny-object syndrome), or does it address an explicit daily friction point?",
      options: [
        { label: "Proven Daily Friction", val: 0 },
        { label: "Curiosity (Semi-tested idea)", val: 1 },
        { label: "High-Arousal Hyper-Focus", val: 2 }
      ]
    },
    {
      key: "dup_config",
      label: "Config or Environment Overhead",
      desc: "Will this require adding secondary API key inputs, external keys, or separate service modules?",
      options: [
        { label: "No (Fully autonomous)", val: 0 },
        { label: "Partially (Reuses existing secret keys)", val: 1 },
        { label: "Yes (Requires new environment setup)", val: 2 }
      ]
    },
    {
      key: "card_vs_page",
      label: "View Container Density",
      desc: "Could this feature live perfectly as an optional collapsible card or dashboard tab, rather than a whole new page/view?",
      options: [
        { label: "No (Absolutely needs full width)", val: 0 },
        { label: "Probably (Can be a nested tab)", val: 1 },
        { label: "Yes (Must be a compact card/modal)", val: 2 }
      ]
    },
    {
      key: "ai_slop_tells",
      label: "Standard AI Slop Tells Check",
      desc: "Does your concept prompt nested cards, indigo overlays, purple gradients, generic glow effects, or modals as the primary structural interface?",
      options: [
        { label: "No (Bespoke, solid layout)", val: 0 },
        { label: "Maybe/Slightly (Uses default SaaS presets)", val: 1 },
        { label: "Yes (Default LLM-template tells)", val: 2 }
      ]
    },
    {
      key: "metric_and_copy_slop",
      label: "SaaS Copy & Metric Hyperbole",
      desc: "Does your prompt proposal demand fictitious telemetry metrics, fake performance claims (e.g., '10x faster'), or hyperbole like 'stellar' / 'gorgeous'?",
      options: [
        { label: "No (Factual and context-friendly)", val: 0 },
        { label: "Partially (Uses typical SaaS marketing copy)", val: 1 },
        { label: "Yes (Heavy LLM hype phrases present)", val: 2 }
      ]
    }
  ];

  const handleAnswerChange = (key: string, val: number) => {
    setAnswers(prev => ({ ...prev, [key]: val }));
  };

  // Compile calculations
  const calculateScores = () => {
    const rawSum = Object.values(answers).reduce((a, b) => a + b, 0);
    const maxPossible = questions.length * 2;
    const bloatPercent = Math.round((rawSum / maxPossible) * 100);

    let grade = "Extremely Potent & Lean (Perfect SSOT Alignment)";
    let gradeColor = "text-[var(--color-sage)] border-[var(--color-sage)]/20 bg-[var(--color-sage)]/5";
    let advice: string[] = [];

    if (bloatPercent <= 30) {
      grade = "Lean Masterpiece (SSOT Vetted)";
      gradeColor = "text-[var(--color-sage)] border-[var(--color-sage)]/20 bg-[var(--color-sage)]/5";
      advice = [
        "Perfect. Proceed with direct execution.",
        "Your concept does not copy existing state patterns. Keep interfaces compact.",
        "Include short session states inside ~/.hermes/SESSION_STATE.md to maintain working memory flow."
      ];
    } else if (bloatPercent <= 60) {
      grade = "Loose Bloat Risk (Rethinking Recommended)";
      gradeColor = "text-amber-600 border-amber-500/20 bg-amber-500/5";
      advice = [
        `Consolidate into your existing ${targetSurface} surface or component instead of scaffolding a duplicate view.`,
        "Check folder boundaries: Place help flags inside binaries to prevent amnesia.",
        "Refactor your schemas. Try to extend current tables rather than making secondary ones."
      ];
    } else {
      grade = "Hyper-Focus Bloat Trap (IMMEDIATE MERGE REQUIRED)";
      gradeColor = "text-rose-500 border-rose-500/20 bg-rose-500/5";
      advice = [
        "STOP. This idea is a candidate for consolidation. Do not start a new codebase/file.",
        "Force the AI to implement this inside a collapsible modular panel in your existing dashboard.",
        "Prevent scattered knowledge: Use one single, validated state hook to manage indicators.",
        "Take a 5-second breath. Your working memory is overloading. Generate a merging prompt below."
      ];
    }

    return { bloatPercent, grade, gradeColor, advice };
  };

  const { bloatPercent, grade, gradeColor, advice } = calculateScores();

  // Run the code/intent audit generator
  const runIntentAudit = () => {
    if (!draftProposal.trim()) return;

    const text = draftProposal.toLowerCase();
    const hasAmnesiaCheck = text.includes("amnesia") || text.includes("session") || text.includes("restore") || text.includes("header") || text.includes("state");
    const hasTunneling = text.includes("tunnel") || text.includes("recommend") || text.includes("default") || text.includes("next step");
    const hasGuardrails = text.includes("validator") || text.includes("guard") || text.includes("error") || text.includes("rollback") || text.includes("undo") || text.includes("revers");
    const hasNoHighArousal = !text.includes("urgent") && !text.includes("flash") && !text.includes("alert") && !text.includes("!!!") && !text.includes("critical!!!!");
    const hasSSOT = text.includes("db") || text.includes("schema") || text.includes("normalization") || text.includes("single source") || text.includes("duplicat") || text.includes("ssot");

    // Anti-AI Slop heuristic checks
    const hasNoAiVisualTells = !(
      text.includes("purple") ||
      text.includes("gradient") ||
      text.includes("glow") ||
      text.includes("modal") ||
      text.includes("#6366f1") ||
      text.includes("glassmorphism") ||
      text.includes("nested card")
    );
    const hasNoCopyTells = !(
      text.includes("gorgeous") ||
      text.includes("stellar") ||
      text.includes("jaw-dropping") ||
      text.includes("flawless") ||
      text.includes("10x") ||
      text.includes("100x") ||
      text.includes("faster") ||
      text.includes("revolution")
    );

    // Compute simple diagnostics
    const checks = [
      {
        edictId: 1,
        title: "The Amnesia Principle Check (Anti-Forgetfulness)",
        subtitle: "Does the concept guarantee context re-entry in 5 seconds (saving/restoring task states)?",
        pass: hasAmnesiaCheck,
        feedback: hasAmnesiaCheck
          ? "Passed. Direct context restoration hooks are mentioned."
          : "Fails. No context header or SESSION_STATE.md integration specified. User risks forgetting what they were doing on reload."
      },
      {
        edictId: 2,
        title: "Demonstrable Tunneling Plan (Step-by-Step Guidance)",
        subtitle: "Does it avoid options overload by enforcing a single default next step?",
        pass: hasTunneling,
        feedback: hasTunneling
          ? "Passed. Contains clear pathway triggers."
          : "Fails. Prompts a blank slate. Operator will suffer executive block on startup unless you define a default recommended action."
      },
      {
        edictId: 3,
        title: "Objective Guardrails Coverage (Error Defenses)",
        subtitle: "Are automated rollback states and type-checkers mentioned?",
        pass: hasGuardrails,
        feedback: hasGuardrails
          ? "Passed. Defensive error proofing is planned."
          : "Fails. Lacks structured recovery. Fails default safety on unstable API requests."
      },
      {
        edictId: 5,
        title: "Low-Arousal Validation Shield (Calming Sensory Standard)",
        subtitle: "Are blinking badges, urgent logs, or high-stimulus margin telemetry banned?",
        pass: hasNoHighArousal,
        feedback: hasNoHighArousal
          ? "Passed. Free from sensory visual chatter."
          : "Fails. Urgency triggers and noisy alert indicators detected under analysis."
      },
      {
        edictId: 6,
        title: "Single Source of Truth Check (Anti-System Bloat)",
        subtitle: "Are redundant tables or duplicate files designed out?",
        pass: hasSSOT,
        feedback: hasSSOT
          ? "Passed. Promotes modular consolidation."
          : "Fails. Reinvents schemas instead of merging. Likely to cause state synchronization discrepancies."
      },
      {
        edictId: 7,
        title: "AI Visual Slop Detector",
        subtitle: "Does the text request overused templates like purple gradients, nested cards, glows, or modals?",
        pass: hasNoAiVisualTells,
        feedback: hasNoAiVisualTells
          ? "Passed. Avoids primary SaaS clichés, utilizing solid, clean, bespoke designs."
          : "Fails. Default AI design patterns detected (purple, gradient, glows, nested cards, or modals as the quick answer)."
      },
      {
        edictId: 8,
        title: "Content Authenticity Compliance",
        subtitle: "Are marketing-flavored hype buzzwords and unproven metrics banned?",
        pass: hasNoCopyTells,
        feedback: hasNoCopyTells
          ? "Passed. Keeps information perfectly honest, factual, and clinical without hype."
          : "Fails. Found SaaS hyperbole, 'stellar', or unproven performance stats instead of honest placeholders."
      }
    ];

    const passedCount = checks.filter(c => c.pass).length;
    const score = Math.round((passedCount / checks.length) * 100);
    const rawSum = checks.length - passedCount;
    const bloatScore = Math.round((rawSum / checks.length) * 100);

    setSimulatedAuditResult({
      bloatScore: bloatScore,
      grade: score >= 80 ? "Passes AuDHD Edicts (Ultra Lean)" : "Requires Clinical Prompt Refactoring",
      gradeColor: score >= 80 ? "text-[var(--color-sage)] bg-[var(--color-sage)]/5 border-[var(--color-sage)]/10" : "text-amber-600 bg-amber-500/5 border-amber-500/10",
      actionableAdvice: [
        score >= 80
          ? "Outstanding! Paste this prompt directly into your Worker. It enforces rigid developer structure, uses solid tinted neutrals, and keeps the design beautifully bespoke."
          : "Add specific instructions targeting amnesia (e.g. 'write state files') and make sure to explicitly ban nested cards, purple gradients, and hype buzzwords."
      ],
      contractChecks: checks
    });
  };

  // Compile the Anti-Bloat Consolidation Prompt Template
  const compilationPrompt = `## AuDHD SYSTEM CONSOLIDATION CONTRACT (SSOT-VETTED)
Please inspect our current files, specifically \`${targetSurface}\`.
We are looking to implement a new feature described as: "${newIdeaName || draftProposal || "Modular addition"}".

### CRITICAL CORE INVARIANTS:
1. **NO SYSTEM BLOAT (Anti-Impulsivity Constraint)**:
   Do NOT generate an entirely new app, directory, or database module. We are maintaining a single, integrated source of truth. Integrate this new feature directly into \`${targetSurface}\` as a modular sub-component, slider, card, or tab.

2. **THE AMNESIA PRINCIPLE (Working Memory Restore)**:
   Ensure the revised file has a clear, comment header explanation showing:
   * What this component does
   * Why it exists
   * EXACTLY one single recommended button or next step to test the code.

3. **STRUCTURE THAT BENDS (PDA Shield)**:
   Make the features highly reversible. Include easy button states to reset form inputs, clear lists, and toggle back to standard default states with zero friction.

4. **LOW-AROUSAL DESIGN**:
   Apply calming color utilities (slate, charcoal, soft sage accents). Do not clutter the margins with system telemetry statistics, online logs, or flashing gauges. Use clean typography and human labels.

Implement this merged, highly optimized feature now. Preserve all prior functionality.`;

  const copyToClipboard = (text: string, isPrompt: boolean) => {
    navigator.clipboard.writeText(text);
    if (isPrompt) {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } else {
      setCopiedAudit(true);
      setTimeout(() => setCopiedAudit(false), 2000);
    }
  };

  return (
    <div className="space-y-8" id="impulsivity-shield-viewport">
      {/* Introduction Banner */}
      <div className="card-shell p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between" id="shield-headline-card">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="pulse-dot" />
            <h4 className="text-sm font-semibold text-[var(--color-ink)] font-[var(--font-sans)] tracking-tight">Active Impulsivity Shield &amp; SSOT Auditor</h4>
          </div>
          <p className="text-xs text-[var(--color-muted)] leading-relaxed max-w-2xl font-[var(--font-sans)]">
            ADHD hyper-focus makes launching new apps highly dopamine-charging, but leaves a trail of abandoned databases, duplicate state files, and massive cognitive debt. This shield enforces <b>Single Source of Truth (SSOT)</b> principles to prevent system bloat.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 card-core text-xs font-[var(--font-mono)] text-[var(--color-sage)]">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-sage)]" />
          <span>Edict Invariants Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* PANEL LEFT: Impulsivity / Bloat Calculator */}
        <div className="card-shell p-6 flex flex-col gap-5 text-left" id="anti-bloat-diagnostic">
          <div className="flex items-center justify-between border-b border-[var(--color-hairline)] pb-3" id="diagnostic-header">
            <h3 className="text-xs font-bold font-[var(--font-sans)] uppercase tracking-wider text-[var(--color-ink)] flex items-center gap-2">
              <Gauge className="w-4 h-4 text-[var(--color-sage)]" />
              <span>ADHD Impulsivity &amp; Bloat Calculator</span>
            </h3>
            <span className="text-xs font-[var(--font-mono)] text-[var(--color-muted)]">Prune Unfinished Loops</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--color-ink)] font-[var(--font-sans)]">
              Which file/component gets impacted?
            </label>
            <input
              id="diagnostic-surface-input"
              type="text"
              className="w-full card-core px-3 py-2.5 text-xs text-[var(--color-ink)] placeholder:text-[var(--color-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]/20 font-[var(--font-mono)]"
              placeholder="e.g., App.tsx, LlmOsPromptCompiler.tsx, dashboard"
              value={targetSurface}
              onChange={(e) => setTargetSurface(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--color-ink)] font-[var(--font-sans)]">
              What is the impulsive feature you want to add?
            </label>
            <input
              id="diagnostic-feature-name"
              type="text"
              className="w-full card-core px-3 py-2.5 text-xs text-[var(--color-ink)] placeholder:text-[var(--color-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]/20 font-[var(--font-sans)]"
              placeholder="e.g., A secondary dashboard for telemetry logging"
              value={newIdeaName}
              onChange={(e) => setNewIdeaName(e.target.value)}
            />
          </div>

          {/* Test Questions */}
          <div className="space-y-4 pt-2">
            <p className="text-xs font-medium text-[var(--color-sage)] font-[var(--font-sans)] uppercase tracking-wider">
              Verify Bloat Metrics:
            </p>
            {questions.map((q) => (
              <div key={q.key} className="space-y-2 border-l-2 border-[var(--color-hairline)] pl-4">
                <span className="text-xs font-medium text-[var(--color-ink)]">{q.label}</span>
                <p className="text-xs text-[var(--color-muted)] leading-normal">{q.desc}</p>
                <div className="flex gap-2 pt-1 flex-wrap">
                  {q.options.map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => handleAnswerChange(q.key, opt.val)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-300 cursor-pointer font-[var(--font-sans)] font-medium ${
                        answers[q.key] === opt.val
                          ? "bg-[var(--color-sage)]/10 border-[var(--color-sage)]/30 text-[var(--color-sage)]"
                          : "bg-[var(--color-surface)] border-[var(--color-hairline)] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Gauge Output */}
          <div className="pt-3 border-t border-[var(--color-hairline)] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--color-ink)] font-[var(--font-sans)]">Results Summary:</span>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-[var(--font-mono)] font-bold ${bloatPercent > 60 ? "text-rose-500" : "text-[var(--color-sage)]"} tabular-nums`}>
                  {bloatPercent}%
                </span>
                <span className="text-xs text-[var(--color-muted)] font-[var(--font-sans)]">Bloat score</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-[var(--color-canvas-2)] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  bloatPercent <= 30 ? "bg-[var(--color-sage)]" : bloatPercent <= 60 ? "bg-amber-500" : "bg-rose-500"
                }`}
                style={{ width: `${bloatPercent}%` }}
              />
            </div>

            <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1.5 font-[var(--font-sans)] ${gradeColor}`}>
              <div className="font-bold flex items-center gap-1.5">
                {bloatPercent > 60 ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                <span>{grade}</span>
              </div>
              <p className="text-xs text-[var(--color-muted)]">
                {bloatPercent > 60
                  ? "We must intervene to prevent scattered structures. Generate the consolidated prompt below to safely incorporate this inside our existing modules rather than adding bloat."
                  : "This is quite clean, but remember to always attach help guides to minimize amnesia loops."}
              </p>
            </div>

            {/* Advice lines */}
            <div className="space-y-1.5 pl-1.5">
              {advice.map((line, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <span className="text-[var(--color-sage)] mt-0.5 shrink-0">·</span>
                  <span className="text-[var(--color-muted)] font-[var(--font-sans)]">{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PANEL RIGHT: Consolidation Prompt Builder */}
        <div className="card-shell p-6 flex flex-col gap-5 text-left" id="consolidate-prompt-generator">
          <div className="flex items-center justify-between border-b border-[var(--color-hairline)] pb-3" id="prompt-generator-header">
            <h3 className="text-xs font-bold font-[var(--font-sans)] uppercase tracking-wider text-[var(--color-ink)] flex items-center gap-2">
              <Coins className="w-4 h-4 text-[var(--color-sage)]" />
              <span>The Antidote: Consolidation Prompt</span>
            </h3>
            <span className="text-xs bg-[var(--color-sage)]/10 text-[var(--color-sage)] border border-[var(--color-sage)]/20 rounded-md px-2 py-0.5 font-[var(--font-mono)]">
              Save energy
            </span>
          </div>

          <p className="text-xs text-[var(--color-muted)] leading-relaxed font-[var(--font-sans)] mt-1">
            Feed this prompt directly to your worker LLM or coding system. It forces it to bypass standard AI over-engineering behaviors and safely refactor the system into a single neat component.
          </p>

          <div className="relative flex-1" id="contract-textarea-box">
            <textarea
              id="consolidation-contract-textarea"
              readOnly
              className="w-full h-[320px] card-core p-4 text-xs text-[var(--color-ink)] font-[var(--font-mono)] resize-none leading-relaxed"
              value={compilationPrompt}
            />
            <div className="absolute bottom-3 right-3">
              <button
                id="copy-consolidation-prompt-btn"
                onClick={() => copyToClipboard(compilationPrompt, true)}
                className="btn-pill flex items-center gap-1.5 text-xs"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Contract</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="card-core p-4 text-xs text-[var(--color-muted)] leading-relaxed space-y-1.5" id="explain-box">
            <p className="font-bold text-[var(--color-ink)] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[var(--color-sage)]" />
              <span>Why this works:</span>
            </p>
            <p className="text-xs">
              By specifying exactly target files (like <code className="bg-[var(--color-canvas-2)] px-1 py-0.5 rounded text-[var(--color-sage)]">{targetSurface}</code>), and forcing the model to respect <b>The Amnesia Principle</b> and <b>Low-Arousal standards</b>, you mitigate its tendency to write hundreds of unlinked, empty scaffold scripts that you have to delete later.
            </p>
          </div>
        </div>

      </div>

      {/* SECTION 3: SSOT Compliance Analyzer */}
      <div className="card-shell p-6 flex flex-col gap-5 text-left" id="play-audit-section">
        <div className="flex items-center justify-between border-b border-[var(--color-hairline)] pb-3" id="play-audit-header">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[var(--color-sage)]" />
            <h3 className="text-xs font-bold font-[var(--font-sans)] uppercase tracking-wider text-[var(--color-ink)]">
              SSOT Proposal Invariance Checker (Playground)
            </h3>
          </div>
          <span className="text-xs font-[var(--font-mono)] text-[var(--color-muted)]">Local Compliance Test v1.0</span>
        </div>

        <p className="text-xs text-[var(--color-muted)] font-[var(--font-sans)] leading-relaxed">
          Draft or paste your detailed project specification, tool flow, or feature list below. We will locally analyze the text against the 6 core AuDHD accessibility edicts to ensure zero duplicate canonical schema paths.
        </p>

        <div className="flex gap-3">
          <input
            id="draft-audit-proposal-input"
            type="text"
            className="flex-1 card-core px-3 py-2.5 text-xs text-[var(--color-ink)] placeholder:text-[var(--color-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]/20 font-[var(--font-sans)]"
            placeholder="Type features, e.g. 'Build a task monitor that integrates amnesia session files...'"
            value={draftProposal}
            onChange={(e) => setDraftProposal(e.target.value)}
          />
          <button
            id="run-interactive-audit-btn"
            onClick={runIntentAudit}
            className="btn-pill flex items-center gap-1.5 shrink-0"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Audit Proposal</span>
          </button>
        </div>

        {/* Audit result report panel */}
        {simulatedAuditResult ? (
          <div className="space-y-4 pt-2" id="playground-results-panel">
            <div className={`card-core p-4 flex items-center justify-between text-xs font-[var(--font-sans)] ${simulatedAuditResult.gradeColor}`}>
              <div className="space-y-1">
                <span className="font-bold block text-[var(--color-ink)]">{simulatedAuditResult.grade}</span>
                <span className="text-xs opacity-80">Edict Compliance: {(100 - simulatedAuditResult.bloatScore)}%</span>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center font-[var(--font-mono)] font-bold text-sm shrink-0 tabular-nums">
                {100 - simulatedAuditResult.bloatScore}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {simulatedAuditResult.contractChecks.map((chk) => (
                <div
                  key={chk.edictId}
                  className={`card-core p-4 flex flex-col justify-between gap-2 text-xs leading-normal transition-all duration-300 ${
                    chk.pass
                      ? "border-[var(--color-sage)]/[0.08] hover:border-[var(--color-sage)]/20"
                      : "border-amber-500/[0.08] hover:border-amber-500/20"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-xs text-[var(--color-muted)] font-[var(--font-mono)] block">EDICT {chk.edictId}</span>
                    <h5 className="font-bold text-[var(--color-ink)] font-[var(--font-sans)] tracking-tight">{chk.title}</h5>
                    <p className="text-xs text-[var(--color-muted)]">{chk.subtitle}</p>
                  </div>
                  <div className="pt-2 border-t border-[var(--color-hairline)] flex items-start gap-1.5 mt-1">
                    <span className={`text-xs font-[var(--font-mono)] leading-none ${chk.pass ? "text-[var(--color-sage)]" : "text-amber-600"}`}>
                      {chk.pass ? "PASS" : "WARN"}
                    </span>
                    <p className="text-xs text-[var(--color-muted)] leading-normal">{chk.feedback}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="card-core p-4 space-y-1.5 text-xs">
              <span className="font-bold text-[var(--color-sage)] block font-[var(--font-sans)]">Actionable Guidance:</span>
              <ul className="list-disc pl-4 space-y-1 text-[var(--color-muted)]">
                {simulatedAuditResult.actionableAdvice.map((adv, idx) => (
                  <li key={idx} className="text-xs leading-relaxed">{adv}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="p-6 border border-dashed border-[var(--color-hairline)] rounded-xl text-center" id="empty-audit-placeholder">
            <p className="text-xs text-[var(--color-muted)] font-[var(--font-sans)]">
              Enter a draft proposal above and click <b>Audit Proposal</b> to evaluate clinical edict compliance instantly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
