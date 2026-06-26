import { useState, useRef, useEffect } from "react";
import {
  Play,
  RotateCcw,
  ShieldCheck,
  CreditCard,
  Download,
  Sparkles,
  Check,
  Brain,
  Terminal,
  HelpCircle,
  Lock,
  ArrowRight,
  CodeXml,
  ChevronDown,
  ChevronUp,
  Coins,
  FileCheck,
  Loader2,
  X
} from "lucide-react";
import { OptimizedPromptResult, RefinementTurn } from "../lib/types";

interface RefinementLoopProps {
  originalPrompt: string;
  initialAdvocatePrompt: string;
  thinkingMode: boolean;
  selectedModel: string;
}

const DEFAULT_THREE_TURNS: RefinementTurn[] = [
  {
    turnNumber: 2,
    timestamp: "10:14 AM",
    workerResponse: `// Incomplete Dashboard Implementation Snippet
import React, { useState } from 'react';

export default function TodoPlanner() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Configure PostgreSQL Relational tables", done: false },
    { id: 2, text: "Set up lazy client connection pools", done: false }
  ]);

  return (
    <div className="p-4 bg-slate-900 border border-slate-700 text-white rounded">
      <h3>Calm Task Multi-Grid Planner</h3>
      {tasks.map(t => (
        <div key={t.id} className="p-2 border-b border-slate-700">
          <span>{t.text}</span>
        </div>
      ))}
    </div>
  );
}`,
    evaluation: `### FAIL-SAFE DEFAULT AND RECONSTRUCTION AUDIT

1. **Amnesia Principle Violation (Edict 1)**: The submitted code snippet lacks any form of local storage caching or session storage synchronization. If the browser cache clears or is hot-reloaded due to HMR interruption, the entirety of the user's active context is wiped out. This creates immediate cognitive amnesia.
2. **Nestings and Color tells**: The layout contains nested container elements within high-stimulous coloring which replicates standard AI template wrappers.

**Compliance Rating**: 40/100 (Unsatisfactory)`,
    revisedPrompt: `### CORRECTIVE PATCH SPECIFICATION

**Objective**: Anchor persistent amnesia-proof structures.
- Declare a strict, stable localStorage state synchronizer checking for previous path arrays.
- Rework color styles to use deep solid neutral slate grays. Use #0b1329 tinted backings.
- Strip any cards-within-cards wrapping configurations.`,
    workerMetaCommentary: "Expert Code Audit: The model attempted to satisfy the query quickly by wrapping standard states inside a boilerplate layout. This lazy reflex loses context on reload, triggering a Working Memory gap.",
    advocateMetaCommentary: "Alignment Dynamics: Forcing a structured thought-grid before output prevents neural-branch decay. It keeps the model tightly grounded to real file paths."
  },
  {
    turnNumber: 3,
    timestamp: "10:16 AM",
    workerResponse: `// Added LocalStorage but introduced flashing warning headers
import React, { useState, useEffect } from 'react';

export default function TodoPlanner() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('planner_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [connectionStatus, setConnectionStatus] = useState("DYNAMIC LIVE SYNCING ONLINE");

  useEffect(() => {
    localStorage.setItem('planner_tasks', JSON.stringify(tasks));
  }, [tasks]);

  return (
    <div className="p-5 bg-slate-900 border border-slate-800 text-slate-150">
      <div className="text-red-500 text-xs mb-2">
        {connectionStatus} - DATABASE PING: 12ms (STABLE)
      </div>
      {/* List logic here */}
    </div>
  );
}`,
    evaluation: `### EXPERT ACCESS-ALIGNMENT SENSORY AUDIT

1. **Low-Arousal Sensory Edict Violation (Edict 5)**: Critical visual alert indicators and blinking elements have been hardcoded inside the margin header. This violates low-arousal principles, causing focal tension.
2. **Schema Redundancy (SSOT Violation)**: Hardcoding a dynamic text listener status variable separates truth indexes.

**Compliance Rating**: 68/100 (Competent)`,
    revisedPrompt: `### SENSORY REMEDIATION PROTOCOL

- Remove all telemetry warning symbols, pulsating pings, and redundant online indicators. Outer margins MUST remain completely quiet.
- Keep the background neutral dark theme tinted purely with cool slate, ensuring zero arousal spike counts.`,
    workerMetaCommentary: "Expert Code Audit: The worker model fell prey to 'utility-rail larping'—decorating margins with fake telemetry pings to look highly capable. This is a primary AI-slop signature that breaks the sensory budget.",
    advocateMetaCommentary: "Alignment Dynamics: Our system immediately strips diagnostic telemetry alerts. It forces the output back into quiet, calm state-visualization."
  },
  {
    turnNumber: 4,
    timestamp: "10:19 AM",
    workerResponse: `// Perfect Clean Immersive Spec
import React, { useState, useEffect } from 'react';

export default function PristinePlanner() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('planner_tasks');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: "Establish solid ground data layers", completed: false }
    ];
  });

  useEffect(() => {
    localStorage.setItem('planner_tasks', JSON.stringify(tasks));
  }, [tasks]);

  return (
    <div className="p-6 bg-slate-950 border border-slate-900 text-slate-250 font-sans">
      <div className="pb-3 border-b border-slate-900">
        <h1 className="text-xs uppercase tracking-widest font-mono text-slate-500">Pristine Organizer</h1>
        <p className="text-xs text-slate-500 mt-1">Ready · All systems stabilized contextually</p>
      </div>
      {/* Quiet, pristine elements listed cleanly */}
    </div>
  );
}`,
    evaluation: `### IMMERSIVE VALIDATION SUMMARY

1. **Success**: Double-pass compliance audit succeeded. All AuDHD Edicts are fully satisfied. Working amnesia is eliminated, and visual telemetry noise represents absolute zero arousal counts.
2. **Design Decalogue Guard Compliance**: Pristine, solid-neutral colors, single view boundary preserved. No nested cards, and flat list rendering.

**Compliance Rating**: 98/100 (Outstanding)`,
    revisedPrompt: `### OPTIMIZED BLUEPRINT EXPORTED

This pattern has achieved outstanding convergence. Copy standard production-ready artifacts into your repository.`,
    workerMetaCommentary: "Expert Code Audit: Zero-slop code. Pure neutral tint palettes, solid caching wrappers, and direct state synchronization. No unnecessary layers or distracting blinkers.",
    advocateMetaCommentary: "Alignment Dynamics: Convergence realized! Simple declarative constraints proved to be the cognitive wedge that aligned the parameters perfectly."
  }
];

export default function RefinementLoop({
  originalPrompt,
  initialAdvocatePrompt,
  thinkingMode,
  selectedModel
}: RefinementLoopProps) {
  const [turns, setTurns] = useState<RefinementTurn[]>(DEFAULT_THREE_TURNS);
  const [workerInput, setWorkerInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedTurn, setExpandedTurn] = useState<number | null>(2);

  // Simulated Commercial Premium State
  const [paid, setPaid] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "pro">("pro");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [licenseKey, setLicenseKey] = useState("");
  const [apiLimitReached, setApiLimitReached] = useState(false);

  // Maximum turns permitted in sandbox
  const MAX_TURNS = 7;
  const currentTurnCount = turns.length + 1;

  useEffect(() => {
    if (turns.length >= 6) {
      setApiLimitReached(true);
    }
  }, [turns]);

  const handleRefine = async () => {
    if (!workerInput.trim() || loading || apiLimitReached) return;

    setLoading(true);
    const nextTurnNumber = turns.length + 2;

    const latestInstructions = turns.length > 0
      ? turns[turns.length - 1].revisedPrompt
      : initialAdvocatePrompt;

    try {
      const res = await fetch("/api/refine-loop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalPrompt,
          currentAdvocatePrompt: latestInstructions,
          workerResponse: workerInput,
          turnNumber: nextTurnNumber,
          model: selectedModel,
          thinkingMode
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to analyze worker response");
      }

      const responseData = await res.json();
      const payload = responseData.result;

      const newTurn: RefinementTurn = {
        turnNumber: nextTurnNumber,
        workerResponse: workerInput,
        evaluation: payload.evaluation,
        revisedPrompt: payload.revisedPrompt,
        timestamp: new Date().toLocaleTimeString(),
        workerMetaCommentary: payload.workerMetaCommentary || "Expert Code Audit: The model shows classical compliance traits, but exhibits micro-delinquency by avoiding strict error catch logic to keep answers brief.",
        advocateMetaCommentary: payload.advocateMetaCommentary || "Alignment Dynamics: Reinforcing the specific Poka-Yoke error boundaries narrows the permissible token generation vectors."
      };

      setTurns(prev => [...prev, newTurn]);
      setWorkerInput("");
      setExpandedTurn(nextTurnNumber);
    } catch (err: any) {
      console.error(err);
      alert(`Analysis Error: ${err.message || "Failed to evaluate response."}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResetLoop = () => {
    if (confirm("Reset current worker integration loop? This will revert back to the robust 3-turn interactive example logs.")) {
      setTurns(DEFAULT_THREE_TURNS);
      setWorkerInput("");
      setApiLimitReached(false);
      setExpandedTurn(2);
    }
  };

  const executeSimulatedCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName || !cardNumber || !cardExpiry || !cardCvc) {
      alert("Please populate all credential checkout fields to simulate safely.");
      return;
    }

    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaid(true);
      const generatedKey = `ADVC-${selectedPlan === "pro" ? "PRO" : "STD"}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-2026`;
      setLicenseKey(generatedKey);
      setApiLimitReached(false);
      setShowPaymentModal(false);
    }, 2400);
  };

  const handleDownloadAppBundle = () => {
    const scriptContent = `#!/usr/bin/env uppercase
# AuDHD Prompt Advocate CLI Production Tool
# License: ${licenseKey || "TRIAL-VERSION-EVAL"}
# Host Environment Configured: Local Container CLI Node.js
# Client ID: yourstruly.oliver@gmail.com

echo "============================================="
echo " AuDHD Prompt Advocate - Active Pro"
echo "============================================="
echo "Initializing local daemon..."
echo "Using custom API key validator..."
# Active sandbox client build sequence
`;

    const blob = new Blob([scriptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Prompt_Advocate_CLI_Pro_${selectedPlan.toUpperCase()}.sh`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6" id="refinement-loop-wrapper">
      {/* State Indicators */}
      <div className="flex justify-between items-center card-shell px-5 py-3" id="refinement-loop-header">
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-[var(--color-sage)]" />
          <span className="text-xs font-semibold text-[var(--color-ink)] font-[var(--font-sans)]">
            Worker Refinement Loop ({currentTurnCount} / {MAX_TURNS} Turns Active)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="reset-loop-btn"
            onClick={handleResetLoop}
            className="btn-ghost flex items-center gap-1.5 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
            <span>Reset / Revert Loop</span>
          </button>

          {paid ? (
            <span className="text-xs bg-[var(--color-sage)]/10 border border-[var(--color-sage)]/20 text-[var(--color-sage)] px-2.5 py-1 rounded-lg font-[var(--font-mono)] font-bold">
              PRO UNLOCKED
            </span>
          ) : (
            <button
              id="upgrade-trigger-btn"
              onClick={() => setShowPaymentModal(true)}
              className="btn-pill text-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Buy Standalone Licence</span>
            </button>
          )}
        </div>
      </div>

      {/* Hand-holding guide bar */}
      <div className="card-shell p-5 space-y-4 text-xs leading-relaxed" id="loop-instructions-bubble">
        <p className="text-[var(--color-sage)] font-semibold flex items-center gap-2 font-[var(--font-sans)]">
          <Terminal className="w-4 h-4" />
          <span>Interactive State-Machine Alignment Cycle</span>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs text-[var(--color-muted)] pt-1">
          <div className="card-core p-3">
            <span className="font-[var(--font-mono)] text-[var(--color-sage)] block mb-1 font-bold">Step 1: Copy Advocate Spec</span>
            Copy your compiled prompt from the Advocate Prompt tab. It has pre-baked guards.
          </div>
          <div className="card-core p-3">
            <span className="font-[var(--font-mono)] text-[var(--color-sage)] block mb-1 font-bold">Step 2: External LLM Run</span>
            Paste it into your external chat model (Claude / ChatGPT / Gemini) as their instruction.
          </div>
          <div className="card-core p-3">
            <span className="font-[var(--font-mono)] text-[var(--color-sage)] block mb-1 font-bold">Step 3: Paste Code Here</span>
            Copy their generated answer and paste it into the Workspace input box below to analyze.
          </div>
          <div className="card-core p-3">
            <span className="font-[var(--font-mono)] text-[var(--color-sage)] block mb-1 font-bold">Step 4: Refine Prompt</span>
            Receive a patch corrective prompt copy-paste text instantly to guide them recursively.
          </div>
        </div>
      </div>

      {/* Loop History Stack */}
      {turns.length > 0 && (
        <div className="space-y-4" id="turns-history-list">
          <p className="text-xs font-[var(--font-mono)] font-semibold text-[var(--color-muted)] uppercase tracking-wide pl-1">
            Conversational Turns History Logs ({turns.length} shown)
          </p>

          <div className="space-y-4">
            {turns.map((turn) => {
              const isOpen = expandedTurn === turn.turnNumber;
              return (
                <div
                  key={turn.turnNumber}
                  className="card-shell overflow-hidden"
                >
                  {/* Collapsible toggle bar */}
                  <div
                    onClick={() => setExpandedTurn(isOpen ? null : turn.turnNumber)}
                    className="flex justify-between items-center px-5 py-3 bg-[var(--color-canvas)] hover:bg-[var(--color-canvas-2)] transition-colors cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2 font-[var(--font-mono)]">
                      <span className="w-6 h-6 rounded-full bg-[var(--color-sage)]/10 border border-[var(--color-sage)]/20 flex items-center justify-center text-xs font-bold text-[var(--color-sage)]">
                        {turn.turnNumber}
                      </span>
                      <span className="text-[var(--color-ink)] font-semibold font-[var(--font-sans)] text-xs">
                        Refinement Loop Cycle {turn.turnNumber}
                      </span>
                      <span className="text-xs text-[var(--color-muted)]">· {turn.timestamp}</span>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-[var(--color-muted)]" /> : <ChevronDown className="w-4 h-4 text-[var(--color-muted)]" />}
                  </div>

                  {/* Body Content */}
                  {isOpen && (
                    <div className="p-5 space-y-5 border-t border-[var(--color-hairline)] font-[var(--font-sans)]" id={`turn-content-${turn.turnNumber}`}>

                      {/* Worker Response + Audit */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        {/* Worker side */}
                        <div className="lg:col-span-8 space-y-2">
                          <p className="text-xs font-[var(--font-mono)] text-[var(--color-muted)] uppercase tracking-wide flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-muted)]" />
                            <span>Pasted Worker Response:</span>
                          </p>
                          <div className="p-3 card-core max-h-52 overflow-y-auto font-[var(--font-mono)] text-xs text-[var(--color-muted)] leading-relaxed">
                            <pre className="whitespace-pre-wrap">{turn.workerResponse}</pre>
                          </div>
                        </div>

                        {/* Code Audit Column */}
                        <div className="lg:col-span-4 card-core p-4 flex flex-col justify-start gap-2">
                          <p className="text-xs font-[var(--font-mono)] text-rose-500 uppercase tracking-wider font-bold flex items-center gap-1.5">
                            <Brain className="w-3.5 h-3.5 text-rose-500" />
                            <span>Code Audit</span>
                          </p>
                          <p className="text-xs text-[var(--color-muted)] leading-relaxed font-[var(--font-sans)]">
                            {turn.workerMetaCommentary || "Expert Code Audit: The model attempted to satisfy the user's intent by outputting boilerplates, cutting corners on the underlying error handling vectors."}
                          </p>
                          <span className="text-xs font-[var(--font-mono)] text-[var(--color-muted)] text-right mt-1">ALIGNMENT BIAS: MEDIUM</span>
                        </div>
                      </div>

                      {/* Evaluation + Alignment */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-1 border-t border-[var(--color-hairline)]">
                        {/* Advocate Audit */}
                        <div className="lg:col-span-8 space-y-2">
                          <div className="flex items-center gap-1.5 text-[var(--color-sage)] font-[var(--font-mono)] text-xs uppercase font-bold tracking-wide">
                            <Check className="w-3.5 h-3.5 text-[var(--color-sage)]" />
                            <span>Advocate Loop Evaluation:</span>
                          </div>
                          <div className="p-4 card-core text-[var(--color-muted)] text-xs leading-relaxed">
                            <pre className="whitespace-pre-wrap font-[var(--font-sans)]">{turn.evaluation}</pre>
                          </div>
                        </div>

                        {/* Alignment Dynamics */}
                        <div className="lg:col-span-4 card-core p-4 flex flex-col justify-start gap-2">
                          <p className="text-xs font-[var(--font-mono)] text-[var(--color-sage)] uppercase tracking-wider font-bold flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[var(--color-sage)]" />
                            <span>Alignment Dynamics</span>
                          </p>
                          <p className="text-xs text-[var(--color-muted)] leading-relaxed font-[var(--font-sans)]">
                            {turn.advocateMetaCommentary || "Alignment Dynamics: High localized pressure. Forcing structured markdown outputs anchors correct code and strips toxic aesthetic slop."}
                          </p>
                          <span className="text-xs font-[var(--font-mono)] text-[var(--color-muted)] text-right mt-1">STATE-ALIGNMENT: 100%</span>
                        </div>
                      </div>

                      {/* Corrective Prompt */}
                      <div className="space-y-3 card-core p-4" id={`turn-prompt-${turn.turnNumber}`}>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-[var(--font-mono)] text-[var(--color-sage)] uppercase font-bold flex items-center gap-1.5">
                            <ArrowRight className="w-3.5 h-3.5 text-[var(--color-sage)]" />
                            <span>NEXT CORRECTIVE PROMPT:</span>
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(turn.revisedPrompt);
                              alert("Revised Compensation Prompt copied to Clipboard!");
                            }}
                            className="btn-ghost flex items-center gap-1.5 text-xs font-bold"
                          >
                            <span>Copy Prompt Patch</span>
                          </button>
                        </div>
                        <pre className="p-3 card-core font-[var(--font-mono)] text-xs text-[var(--color-sage)] whitespace-pre-wrap leading-relaxed">
                          {turn.revisedPrompt}
                        </pre>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Input Zone */}
      {!apiLimitReached ? (
        <div className="space-y-4 card-shell p-5" id="worker-input-zone">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-[var(--color-ink)] font-[var(--font-sans)] flex items-center gap-2">
              <CodeXml className="w-4 h-4 text-[var(--color-sage)]" />
              <span>Paste Worker LLM Output (Turn {currentTurnCount} / {MAX_TURNS}):</span>
            </label>
            <span className="text-xs text-[var(--color-muted)] font-[var(--font-mono)] uppercase bg-[var(--color-canvas-2)] px-2 py-0.5 rounded-md border border-[var(--color-hairline)]">
              Workspace Terminal Input
            </span>
          </div>

          <textarea
            id="worker-response-textarea"
            className="w-full h-32 card-core p-4 font-[var(--font-mono)] text-xs text-[var(--color-ink)] placeholder:text-[var(--color-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]/20 leading-relaxed resize-none transition-all"
            placeholder="[Paste what your developer worker LLM generated in response to your compiled prompt here to evaluate sensory alignment and fetch corrective prompts...]"
            value={workerInput}
            onChange={(e) => setWorkerInput(e.target.value)}
            disabled={loading}
          />

          <div className="flex justify-end pt-1">
            <button
              id="analyze-worker-btn"
              onClick={handleRefine}
              disabled={!workerInput.trim() || loading}
              className={`btn-pill flex items-center gap-2 ${
                !workerInput.trim() || loading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing worker quality...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Analyze Worker Output &amp; Advance Loop</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* PREMIUM LIMIT REACHED CARD */
        <div className="card-shell p-8 text-center relative overflow-hidden" id="premium-locked-panel">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-[var(--color-sage)]/[0.04] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-[var(--color-sage)]/[0.03] rounded-full blur-3xl" />

          <div className="flex flex-col items-center gap-3 mt-2 relative z-10">
            <div className="p-3 bg-[var(--color-sage)]/10 border border-[var(--color-sage)]/20 rounded-full">
              <Lock className="w-6 h-6 text-[var(--color-sage)]" />
            </div>
            <h3 className="text-base font-bold font-[var(--font-sans)] text-[var(--color-ink)]">
              Premium Loop Limit Reached ({MAX_TURNS}/{MAX_TURNS} Turns)
            </h3>
            <p className="text-xs text-[var(--color-muted)] max-w-md leading-relaxed font-[var(--font-sans)]">
              You have completed the permitted 7 turns within our cloud sandbox.
              Download and deploy the full AuDHD Prompt Advocate system locally on your device to unlock unlimited loops using your own API credentials securely.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto py-4 relative z-10">
            <div
              onClick={() => setSelectedPlan("starter")}
              className={`card-core p-4 text-left cursor-pointer transition-all duration-300 ${
                selectedPlan === "starter"
                  ? "border-[var(--color-sage)]/30 ring-1 ring-[var(--color-sage)]/10"
                  : "hover:border-[var(--color-hairline-strong)]"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-xs text-[var(--color-ink)]">Indie Starter</span>
                <span className="font-bold text-sm text-[var(--color-sage)]">$19</span>
              </div>
              <p className="text-xs text-[var(--color-muted)] font-[var(--font-sans)] leading-snug">
                One-time payment. Unlimited CLI runs, local storage logging, and persistent JSON configurations.
              </p>
            </div>

            <div
              onClick={() => setSelectedPlan("pro")}
              className={`card-core p-4 text-left cursor-pointer transition-all duration-300 relative ${
                selectedPlan === "pro"
                  ? "border-[var(--color-sage)]/30 ring-1 ring-[var(--color-sage)]/10"
                  : "hover:border-[var(--color-hairline-strong)]"
              }`}
            >
              <div className="absolute -top-2 right-3 px-2 py-0.5 bg-[var(--color-sage)] rounded text-[10px] text-white font-bold uppercase tracking-wide">
                Popular
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-xs text-[var(--color-ink)] flex items-center gap-1">
                  <span>Developer Pro</span>
                </span>
                <span className="font-bold text-sm text-[var(--color-sage)]">$29</span>
              </div>
              <p className="text-xs text-[var(--color-muted)] font-[var(--font-sans)] leading-snug">
                Includes automated agent integration shell executor, persistent projects workspace, the system logic bundle, and free minor upgrades.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-1 relative z-10">
            <button
              id="buy-unlock-btn"
              onClick={() => setShowPaymentModal(true)}
              className="btn-pill flex items-center gap-2"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Unlock Plan via Secure Checkout</span>
            </button>
            <button
              id="sandbox-reset-fallback-btn"
              onClick={handleResetLoop}
              className="btn-ghost flex items-center gap-2 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
              <span>Reset &amp; Revert Sandbox</span>
            </button>
          </div>
        </div>
      )}

      {/* Paid unlocked panel */}
      {paid && (
        <div className="card-shell p-6 space-y-4 relative overflow-hidden" id="paid-unlocked-panel">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--color-sage)]/10 border border-[var(--color-sage)]/20 text-[var(--color-sage)] rounded-xl">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[var(--color-sage)] font-[var(--font-sans)]">Payment Confirmed! Premium Activated</h4>
              <p className="text-xs text-[var(--color-muted)] font-[var(--font-mono)] mt-0.5">License: {licenseKey}</p>
            </div>
          </div>
          <p className="text-xs text-[var(--color-muted)] leading-relaxed font-[var(--font-sans)]">
            You successfully simulated standard secure sandbox invoicing checkout. Your license is now active locally.
            Download the production executable script bundle directly to install onto your local system to run unlimited turns out of your own terminal.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <button
              id="download-shell-btn"
              onClick={handleDownloadAppBundle}
              className="btn-pill flex items-center gap-2 text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Production CLI Script (.sh)</span>
            </button>
            <button
              id="copy-key-btn"
              onClick={() => {
                navigator.clipboard.writeText(licenseKey);
                alert("License Key copied to clipboard!");
              }}
              className="btn-ghost flex items-center gap-2 text-xs"
            >
              Copy License Key
            </button>
          </div>
        </div>
      )}

      {/* PAYMENT SIMULATOR MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 min-h-screen bg-[var(--color-ink)]/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm" id="payment-simulator-modal">
          <div className="card-shell w-full max-w-md overflow-hidden relative" id="payment-modal-card">

            {/* Header */}
            <div className="px-6 py-4 bg-[var(--color-canvas)] border-b border-[var(--color-hairline)] flex justify-between items-center">
              <div className="flex items-center gap-2 text-[var(--color-sage)]">
                <CreditCard className="w-5 h-5" />
                <h3 className="font-semibold text-[var(--color-ink)] font-[var(--font-sans)] text-sm">
                  Secure Billing Checkout
                </h3>
              </div>
              <button
                id="close-payment-modal-btn"
                onClick={() => setShowPaymentModal(false)}
                className="text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors cursor-pointer p-1 rounded-lg hover:bg-[var(--color-canvas-2)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Checkout Form */}
            <form onSubmit={executeSimulatedCheckout} className="p-6 space-y-4 font-[var(--font-sans)] text-sm" id="payment-checkout-form">
              <div className="card-core p-3 text-xs text-[var(--color-sage)] leading-relaxed">
                <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
                You are performing a simulation of our payment gateway checkout. Use mock details securely to complete the payment test and unlock the executable app.
              </div>

              {/* Plan Header */}
              <div className="card-core p-3 flex justify-between items-center text-xs">
                <div>
                  <p className="text-[var(--color-muted)]">Selected license tier:</p>
                  <p className="font-bold text-[var(--color-ink)] capitalize">
                    {selectedPlan === "pro" ? "Developer Pro License" : "Indie Engineer Starter"}
                  </p>
                </div>
                <p className="font-bold text-[var(--color-sage)] text-sm">
                  {selectedPlan === "pro" ? "$29" : "$19"}
                </p>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-semibold text-[var(--color-muted)] font-[var(--font-mono)]">Full Name on Card</label>
                <input
                  id="checkout-card-name"
                  type="text"
                  placeholder="e.g. Oliver Vance"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full card-core px-3 py-2.5 text-[var(--color-ink)] text-xs placeholder:text-[var(--color-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]/20 transition-all font-[var(--font-sans)]"
                />
              </div>

              {/* Card Number */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-semibold text-[var(--color-muted)] font-[var(--font-mono)]">Card Number</label>
                <input
                  id="checkout-card-num"
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full card-core px-3 py-2.5 text-[var(--color-ink)] text-xs placeholder:text-[var(--color-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]/20 transition-all font-[var(--font-mono)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Expiry */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-semibold text-[var(--color-muted)] font-[var(--font-mono)]">Expiry Code</label>
                  <input
                    id="checkout-expiry"
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full card-core px-3 py-2.5 text-[var(--color-ink)] text-xs placeholder:text-[var(--color-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]/20 transition-all font-[var(--font-mono)] text-center"
                  />
                </div>

                {/* CVC */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-semibold text-[var(--color-muted)] font-[var(--font-mono)]">CVC Code</label>
                  <input
                    id="checkout-cvc"
                    type="text"
                    placeholder="123"
                    maxLength={3}
                    required
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full card-core px-3 py-2.5 text-[var(--color-ink)] text-xs placeholder:text-[var(--color-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]/20 transition-all font-[var(--font-mono)] text-center"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  id="checkout-cancel-btn"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[var(--color-hairline)] hover:bg-[var(--color-canvas)] text-xs font-semibold text-[var(--color-muted)] text-center cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="checkout-submit-btn"
                  disabled={isProcessingPayment}
                  className="flex-1 py-2.5 rounded-xl btn-pill flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Validating card...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Process Secure Checkout</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
