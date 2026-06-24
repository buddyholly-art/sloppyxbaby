import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldAlert,
  CheckCircle2,
  Activity,
  Gauge,
  Terminal,
  Layers,
  FileCode,
  TrendingDown,
  Info,
  Sparkles,
  Cpu,
  Zap,
  AlertTriangle,
  Flame,
  HelpCircle,
  CircleCheck,
  CircleDot,
  Wrench,
  Fingerprint,
  BookOpen,
  Code
} from "lucide-react";

interface RiskCategory {
  id: string;
  name: string;
  badge: string;
  severity: number;
  unmitigatedFrequency: number;
  mitigatedFrequency: number;
  description: string;
  symptoms: string[];
  mitigations: {
    title: string;
    description: string;
    toolUsed: string;
    principleCore: string;
  }[];
}

export default function RiskMitigationDashboard() {
  const [selectedRiskId, setSelectedRiskId] = useState<string>("hallucination");

  // Guardrail states for the Interactive Simulator
  const [guardrails, setGuardrails] = useState({
    rootFence: true,
    amnesiaVaccine: true,
    blueprintContract: true,
    lintGuardrails: true
  });

  const toggleGuardrail = (key: keyof typeof guardrails) => {
    setGuardrails(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Turn all guardrails on or off for instant comparison
  const setAllGuardrails = (val: boolean) => {
    setGuardrails({
      rootFence: val,
      amnesiaVaccine: val,
      blueprintContract: val,
      lintGuardrails: val
    });
  };

  const riskCategories: RiskCategory[] = [
    {
      id: "hallucination",
      name: "Hallucination & Drift",
      badge: "Highest Risk",
      severity: 9.2,
      unmitigatedFrequency: 74,
      mitigatedFrequency: 4,
      description: "When the LLM silently invents non-existent functions, outdated libraries, or made-up paths because it lacks structural constraints.",
      symptoms: [
        "AI suggests importing 'getSuperState()' from random packages that don't exist.",
        "Generates non-working placeholder libraries like '@awesomeui/glow-button'.",
        "Invents variables and state structures that mismatch the files you already built."
      ],
      mitigations: [
        {
          title: "The CLAUDE.md Amnesia Vaccine",
          description: "Locks the precise build scripts and allowed packages right at the root so the model never guesses.",
          toolUsed: "Vibe Repo Center: Pillar 1",
          principleCore: "Provide absolute execution parameters instead of leaving it to creative probability."
        },
        {
          title: "Blueprint Contracts (types.ts)",
          description: "Declaring exact interfaces first so the AI model has to match established shapes of properties.",
          toolUsed: "LLM-OS Prompt Compiler & Types.ts",
          principleCore: "Types are self-enforcing constraints that limit the AI's parameter boundaries."
        }
      ]
    },
    {
      id: "underspecification",
      name: "Under-specification & Folder Pollution",
      badge: "Amnesia-Driven",
      severity: 7.8,
      unmitigatedFrequency: 68,
      mitigatedFrequency: 2,
      description: "Failing to define the operating system, current directory coordinates, or project scale, causing the AI to sprawl random files everywhere.",
      symptoms: [
        "The model creates files like 'src/components/MyComponent.tsx' even when you are working on an Android project.",
        "Generates duplicated helpers because it forgot you already have 'src/utils/cn.ts' inside another fold.",
        "Scatters generic text mockups at the root directory of your codebase."
      ],
      mitigations: [
        {
          title: "Root Folder Fence & Path Binding",
          description: "Injects user's actual folder path (e.g. C:\\Projects\\my-app) directly into generated prompts so the AI works with 100% locational accuracy.",
          toolUsed: "Vibe Onboarding Path Helper",
          principleCore: "Let the human establish the territory, let the model fill the container."
        },
        {
          title: "Active State Announcements",
          description: "Forcing files like CLAUDE.md to list current directory layouts, making it easy for any model to read its surroundings on first refresh.",
          toolUsed: "Vibe Onboarding Scaffold",
          principleCore: "Minimize the cognitive load required for an AI to parse your file tree."
        }
      ]
    },
    {
      id: "security",
      name: "Security, Secrets & Leakage",
      badge: "High Severity",
      severity: 8.5,
      unmitigatedFrequency: 42,
      mitigatedFrequency: 1,
      description: "Unchecked credentials, insecure API key handling in front-end client-side state, or compiling raw inputs into un-vetted system commands.",
      symptoms: [
        "Quietly baking private credentials or API tokens directly into public React files.",
        "Running un-vetted, system-corrupting prompt commands without least-privilege review.",
        "Vulnerable dependency imports from un-verified third-party libraries."
      ],
      mitigations: [
        {
          title: "GuidelineGuard Security Checkups",
          description: "Enforces strict AST scanning of newly uploaded rules or custom SKILL.md rules to look for suspicious code patterns.",
          toolUsed: "Data Flywheel Guard",
          principleCore: "Trust but verify: automate security policies globally through structural pattern tests."
        },
        {
          title: "Client-Side Key Lockouts",
          description: "Blocking API keys in frontend UI and requiring proxying through secure backend environment endpoints.",
          toolUsed: "Environment Validation",
          principleCore: "Never let credentials enter the rendering cycle."
        }
      ]
    },
    {
      id: "context_loss",
      name: "Context Amnesia & Exhaustion",
      badge: "Efficiency Bottleneck",
      severity: 6.5,
      unmitigatedFrequency: 82,
      mitigatedFrequency: 8,
      description: "The AI forgetting previous file changes or operating constraints once the chat history grows beyond its active comprehension frame.",
      symptoms: [
        "You open a new tab and the AI starts suggesting code in the wrong programming language.",
        "Repeatedly explaining the same folder rules or styling colors in every prompt.",
        "The AI breaks previously working code blocks because it forgot they existed."
      ],
      mitigations: [
        {
          title: "Self-Announcing File Structures",
          description: "Structuring files to state their context cleanly at the top so that any newly truncated session instantly catches up on physical surroundings.",
          toolUsed: "Vibe Repo Architect",
          principleCore: "Physical files should serve as an externalized, non-volatile memory registry."
        },
        {
          title: "Frictionless Local Shell Fallbacks",
          description: "Providing local compile scripts and direct terminal prompts when online API systems time out.",
          toolUsed: "Pillar 1 CLI Scaffold",
          principleCore: "Equip users with offline determinism so development speed is uninterrupted."
        }
      ]
    }
  ];

  const activeRisk = riskCategories.find(r => r.id === selectedRiskId) || riskCategories[0];

  // Derive Dynamic Simulated Metrics based on Guardrail state toggles
  const computeActiveMetrics = () => {
    let hallucinationRate = 85;
    let pollutionRisk = 78;
    let contextAmnesia = 90;
    let commandMesses = 65;

    if (guardrails.rootFence) {
      pollutionRisk -= 45;
      hallucinationRate -= 15;
    }
    if (guardrails.amnesiaVaccine) {
      contextAmnesia -= 65;
      hallucinationRate -= 35;
    }
    if (guardrails.blueprintContract) {
      hallucinationRate -= 30;
      commandMesses -= 20;
    }
    if (guardrails.lintGuardrails) {
      commandMesses -= 40;
      pollutionRisk -= 15;
    }

    return {
      hallucinationRate: Math.max(hallucinationRate, 3),
      pollutionRisk: Math.max(pollutionRisk, 2),
      contextAmnesia: Math.max(contextAmnesia, 5),
      commandMesses: Math.max(commandMesses, 4)
    };
  };

  const metrics = computeActiveMetrics();
  const overallSafetyIndex = Math.round(
    100 - (metrics.hallucinationRate * 0.35 + metrics.pollutionRisk * 0.25 + metrics.contextAmnesia * 0.25 + metrics.commandMesses * 0.15)
  );

  const getRiskGroupLabel = (id: string) => {
    switch (id) {
      case "hallucination": return { label: "Group A", color: "text-[var(--color-sage)]" };
      case "underspecification": return { label: "Group B", color: "text-[var(--color-muted)]" };
      case "security": return { label: "Group C", color: "text-[var(--color-ink)]" };
      case "context_loss": return { label: "Group D", color: "text-[var(--color-sage-glow)]" };
      default: return { label: "Group", color: "text-[var(--color-muted)]" };
    }
  };

  const getRiskIcon = (id: string) => {
    switch (id) {
      case "hallucination": return <Flame className="w-3.5 h-3.5" />;
      case "underspecification": return <Layers className="w-3.5 h-3.5" />;
      case "security": return <ShieldAlert className="w-3.5 h-3.5" />;
      case "context_loss": return <BookOpen className="w-3.5 h-3.5" />;
      default: return <CircleDot className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-6" id="risk-mitigation-dashboard">

      {/* Dashboard Executive Header */}
      <div className="card-shell p-5 md:p-6 relative overflow-hidden" id="dashboard-header">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <Activity className="w-40 h-40 text-[var(--color-sage)]" />
        </div>

        <div className="max-w-3xl space-y-3">
          <div className="eyebrow">
            <ShieldAlert className="w-3.5 h-3.5 text-[var(--color-sage)]" />
            <span>LLM-OS Security &amp; Correctness Operations</span>
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-ink)] tracking-tight">
            LLM Risk &amp; Mitigation Dashboard
          </h2>
          <p className="text-sm text-[var(--color-muted)] leading-relaxed font-[var(--font-sans)]">
            <strong className="text-[var(--color-ink)]">What is this?</strong> Standard AI coding often generates messy, un-trackable code on your computer. Below is an interactive sandbox visualizing the core risks of leaving AI loose on your workspace, and how our <strong>Prompt Engineering Advocate</strong> tools automatically mitigate errors — enabling deterministic, error-free builds.
          </p>
        </div>
      </div>

      {/* Safety Index & Master Guardrail Switches */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Interactive Safeguards Switchboard - 5 Cols */}
        <div className="lg:col-span-5 card-shell p-5 flex flex-col justify-between space-y-4" id="guardrails-switchboard">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-semibold font-[var(--font-mono)] text-[var(--color-ink)] flex items-center space-x-1.5">
                <Gauge className="w-4 h-4 text-[var(--color-sage)]" />
                <span>Advocate Guardrail Toggles</span>
              </h3>
              <div className="flex space-x-1">
                <button
                  onClick={() => setAllGuardrails(true)}
                  className="text-xs font-[var(--font-mono)] px-2 py-1 rounded bg-[var(--color-sage-soft)] hover:bg-[var(--color-sage)]/20 text-[var(--color-sage)] font-semibold transition-all duration-500"
                >
                  Max Guard
                </button>
                <button
                  onClick={() => setAllGuardrails(false)}
                  className="text-xs font-[var(--font-mono)] px-2 py-1 rounded bg-[var(--color-canvas-2)] hover:bg-[var(--color-hairline)] text-[var(--color-muted)] font-semibold transition-all duration-500"
                >
                  Disable
                </button>
              </div>
            </div>

            <p className="text-xs text-[var(--color-muted)] leading-normal">
              Toggle the Prompt Advocate's main guardrails on or off to inspect their real-time impact on AI correctness:
            </p>

            <div className="space-y-2.5 pt-2">
              {/* Option 1: Root Folder Path Fence */}
              <div
                onClick={() => toggleGuardrail("rootFence")}
                className={`p-3 rounded-xl border transition-all duration-500 cursor-pointer select-none flex items-start space-x-3 ${
                  guardrails.rootFence
                    ? "bg-[var(--color-surface-solid)] border-[var(--color-sage)]/30 text-[var(--color-ink)]"
                    : "bg-[var(--color-surface)] border-[var(--color-hairline)] text-[var(--color-muted)]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={guardrails.rootFence}
                  readOnly
                  className="mt-1 h-3.5 w-3.5 accent-[var(--color-sage)] pointer-events-none"
                />
                <div className="text-left font-[var(--font-sans)]">
                  <span className="block text-xs font-semibold leading-tight">
                    Root Folder Fence (Path Binding)
                  </span>
                  <span className="block text-xs text-[var(--color-muted)] leading-normal mt-0.5">
                    Locks prompt generation to your computer's exact path (no folder pollution).
                  </span>
                </div>
              </div>

              {/* Option 2: CLAUDE.md Memory Vaccine */}
              <div
                onClick={() => toggleGuardrail("amnesiaVaccine")}
                className={`p-3 rounded-xl border transition-all duration-500 cursor-pointer select-none flex items-start space-x-3 ${
                  guardrails.amnesiaVaccine
                    ? "bg-[var(--color-surface-solid)] border-[var(--color-sage)]/30 text-[var(--color-ink)]"
                    : "bg-[var(--color-surface)] border-[var(--color-hairline)] text-[var(--color-muted)]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={guardrails.amnesiaVaccine}
                  readOnly
                  className="mt-1 h-3.5 w-3.5 accent-[var(--color-sage)] pointer-events-none"
                />
                <div className="text-left font-[var(--font-sans)]">
                  <span className="block text-xs font-semibold leading-tight">
                    CLAUDE.md Memory Vaccine (.cursorrules)
                  </span>
                  <span className="block text-xs text-[var(--color-muted)] leading-normal mt-0.5">
                    Provides built-in self-announcing system commands to prevent AI amnesia.
                  </span>
                </div>
              </div>

              {/* Option 3: types.ts Single Source of Truth */}
              <div
                onClick={() => toggleGuardrail("blueprintContract")}
                className={`p-3 rounded-xl border transition-all duration-500 cursor-pointer select-none flex items-start space-x-3 ${
                  guardrails.blueprintContract
                    ? "bg-[var(--color-surface-solid)] border-[var(--color-sage)]/30 text-[var(--color-ink)]"
                    : "bg-[var(--color-surface)] border-[var(--color-hairline)] text-[var(--color-muted)]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={guardrails.blueprintContract}
                  readOnly
                  className="mt-1 h-3.5 w-3.5 accent-[var(--color-sage)] pointer-events-none"
                />
                <div className="text-left font-[var(--font-sans)]">
                  <span className="block text-xs font-semibold leading-tight">
                    Blueprint Contract (types.ts)
                  </span>
                  <span className="block text-xs text-[var(--color-muted)] leading-normal mt-0.5">
                    Forces strict typing before writing UI components to prevent hallucinations.
                  </span>
                </div>
              </div>

              {/* Option 4: Strict Import Validator (Linter) */}
              <div
                onClick={() => toggleGuardrail("lintGuardrails")}
                className={`p-3 rounded-xl border transition-all duration-500 cursor-pointer select-none flex items-start space-x-3 ${
                  guardrails.lintGuardrails
                    ? "bg-[var(--color-surface-solid)] border-[var(--color-sage)]/30 text-[var(--color-ink)]"
                    : "bg-[var(--color-surface)] border-[var(--color-hairline)] text-[var(--color-muted)]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={guardrails.lintGuardrails}
                  readOnly
                  className="mt-1 h-3.5 w-3.5 accent-[var(--color-sage)] pointer-events-none"
                />
                <div className="text-left font-[var(--font-sans)]">
                  <span className="block text-xs font-semibold leading-tight">
                    Automated Linter Guardrails
                  </span>
                  <span className="block text-xs text-[var(--color-muted)] leading-normal mt-0.5">
                    Scans skills and path patterns before building so code imports don't crash.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Explanation */}
          <div className="p-3 bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-xl text-xs text-[var(--color-muted)] font-[var(--font-mono)] leading-relaxed mt-2">
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-sage)] inline mr-1" />
            Engineering Principle: Humans should spend zero energy on syntax errors. Automating environment checks ensures your attention is saved for high-reasoning logic.
          </div>
        </div>

        {/* Right Column: Live Safety Metrics Visualization Dashboard - 7 Cols */}
        <div className="lg:col-span-7 card-shell p-5 flex flex-col justify-between space-y-4" id="safety-metrics-panel">
          <div className="space-y-3">
            <h3 className="text-xs font-semibold font-[var(--font-mono)] text-[var(--color-ink)] flex items-center space-x-1.5">
              <Activity className="w-4 h-4 text-[var(--color-sage)]" />
              <span>Simulated Real-time Metrics Dashboard</span>
            </h3>
            <p className="text-xs text-[var(--color-muted)]">
              Watch structural security indexes recalculate as you adjust your active project compiler parameters:
            </p>
          </div>

          {/* Big Overall Safety Index Dial */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center py-2 bg-[var(--color-canvas)] p-4 rounded-2xl border border-[var(--color-hairline)]">
            <div className="md:col-span-5 text-center flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[var(--color-hairline)] pb-4 md:pb-0 pr-0 md:pr-4">
              <span className="text-xs font-[var(--font-mono)] text-[var(--color-muted)] font-semibold block mb-1">
                OVERALL SAFETY INDEX
              </span>
              <div className="relative flex items-center justify-center">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="var(--color-canvas-2)"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke={overallSafetyIndex > 80 ? "var(--color-sage)" : overallSafetyIndex > 50 ? "var(--color-sage-glow)" : "#c44"}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="251.2"
                    initial={{ strokeDashoffset: 251.2 }}
                    animate={{ strokeDashoffset: 251.2 - (251.2 * overallSafetyIndex) / 100 }}
                    transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className={`text-2xl font-semibold font-[var(--font-mono)] ${
                    overallSafetyIndex > 80 ? "text-[var(--color-sage)]" : overallSafetyIndex > 50 ? "text-[var(--color-sage-glow)]" : "text-[#c44]"
                  }`}>
                    {overallSafetyIndex}%
                  </span>
                </div>
              </div>
              <span className={`text-xs font-semibold mt-2 px-2.5 py-0.5 rounded-full ${
                overallSafetyIndex > 80 ? "bg-[var(--color-sage-soft)] text-[var(--color-sage)]" : overallSafetyIndex > 50 ? "bg-[var(--color-sage)]/10 text-[var(--color-sage-glow)]" : "bg-red-500/10 text-red-500"
              }`}>
                {overallSafetyIndex > 80 ? "Secure & Stable" : overallSafetyIndex > 50 ? "Medium Leakage Risk" : "Critical Chaos Level"}
              </span>
            </div>

            {/* Individual Submetrics Progress Bars */}
            <div className="md:col-span-7 space-y-3.5">
              {/* Hallucinated Code Drift Rate */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-[var(--font-mono)]">
                  <span className="text-[var(--color-muted)]">Hallucinated Drift Rate:</span>
                  <span className={metrics.hallucinationRate > 50 ? "text-red-500 font-semibold" : "text-[var(--color-sage)]"}>
                    {metrics.hallucinationRate}%
                  </span>
                </div>
                <div className="h-2 bg-[var(--color-canvas-2)] rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${metrics.hallucinationRate > 50 ? "bg-red-400" : "bg-[var(--color-sage)]"}`}
                    initial={{ width: "0%" }}
                    animate={{ width: `${metrics.hallucinationRate}%` }}
                    transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                  />
                </div>
              </div>

              {/* Folder Pollution Risk */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-[var(--font-mono)]">
                  <span className="text-[var(--color-muted)]">Directory Trash Pollution:</span>
                  <span className={metrics.pollutionRisk > 50 ? "text-red-500 font-semibold" : "text-[var(--color-sage)]"}>
                    {metrics.pollutionRisk}%
                  </span>
                </div>
                <div className="h-2 bg-[var(--color-canvas-2)] rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${metrics.pollutionRisk > 50 ? "bg-red-400" : "bg-[var(--color-sage)]"}`}
                    initial={{ width: "0%" }}
                    animate={{ width: `${metrics.pollutionRisk}%` }}
                    transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                  />
                </div>
              </div>

              {/* Memory loss / amnesia */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-[var(--font-mono)]">
                  <span className="text-[var(--color-muted)]">Context Amnesia Rate:</span>
                  <span className={metrics.contextAmnesia > 50 ? "text-red-500 font-semibold" : "text-[var(--color-sage)]"}>
                    {metrics.contextAmnesia}%
                  </span>
                </div>
                <div className="h-2 bg-[var(--color-canvas-2)] rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${metrics.contextAmnesia > 50 ? "bg-red-400" : "bg-[var(--color-sage)]"}`}
                    initial={{ width: "0%" }}
                    animate={{ width: `${metrics.contextAmnesia}%` }}
                    transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                  />
                </div>
              </div>

              {/* import meshes / build crashes */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-[var(--font-mono)]">
                  <span className="text-[var(--color-muted)]">Broken Imports / Linter Errors:</span>
                  <span className={metrics.commandMesses > 50 ? "text-red-500 font-semibold" : "text-[var(--color-sage)]"}>
                    {metrics.commandMesses}%
                  </span>
                </div>
                <div className="h-2 bg-[var(--color-canvas-2)] rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${metrics.commandMesses > 50 ? "bg-red-400" : "bg-[var(--color-sage)]"}`}
                    initial={{ width: "0%" }}
                    animate={{ width: `${metrics.commandMesses}%` }}
                    transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-2 text-xs text-[var(--color-muted)] bg-[var(--color-sage-soft)] p-2 rounded-xl border border-[var(--color-sage)]/10">
            <Info className="w-4 h-4 text-[var(--color-sage)] shrink-0" />
            <p>
              Applying CLAUDE.md vaccine triggers self-containment, instantly reducing Context Amnesia and locking variables to safe local scopes.
            </p>
          </div>
        </div>

      </div>

      {/* Visual Live Comparison Simulator: Prompt Sandbox */}
      <div className="card-shell p-5 space-y-4" id="simulation-codebox">
        <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-[var(--color-hairline)] pb-3 gap-2">
          <div>
            <h3 className="text-xs font-semibold font-[var(--font-mono)] text-[var(--color-ink)] flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-[var(--color-sage)]" />
              <span>Live Simulation: Generated AI Prompts &amp; Output Quality</span>
            </h3>
            <p className="text-xs text-[var(--color-muted)] mt-0.5">
              See what happens to the output compiled by the AI model based on your toggled safeguard settings:
            </p>
          </div>

          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-[var(--color-muted)] font-[var(--font-mono)]">Status:</span>
            {overallSafetyIndex > 80 ? (
              <span className="text-[var(--color-sage)] font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Pristine Build Structure</span>
              </span>
            ) : (
              <span className="text-red-500 font-semibold flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>High AI Hallucination Slop</span>
              </span>
            )}
          </div>
        </div>

        {/* Comparative Coding View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Active Prompt Contract */}
          <div className="space-y-2">
            <span className="text-xs font-semibold font-[var(--font-mono)] text-[var(--color-muted)] block">
              Active Prompt Contract Sent to AI:
            </span>
            <div className="codeblock text-xs min-h-60 max-h-72 overflow-y-auto space-y-3 select-text">
              <p className="text-[var(--color-sage)] font-semibold"># AI CODE INTEGRATION INSTRUCTIONS</p>

              {guardrails.rootFence ? (
                <div className="p-2 border border-[var(--color-sage)]/20 bg-[var(--color-sage-soft)] rounded-lg text-[var(--color-ink)]">
                  <span className="text-xs text-[var(--color-sage)] font-semibold block">ROOT PATH ACCURACY:</span>
                  Set all path mappings to absolute system standard: <code className="text-[var(--color-sage)]">C:\Users\username\Projects\my-app</code>. Under no circumstances execute scripts or touch directories outside this root scope.
                </div>
              ) : (
                <div className="p-2 border border-red-500/10 bg-red-500/5 rounded-lg text-[var(--color-muted)] line-through">
                  [!] Folder bounds default to root current scope. (No directory coordinates declared - AI allowed to dump folders anywhere).
                </div>
              )}

              {guardrails.amnesiaVaccine ? (
                <div className="p-2 border border-[var(--color-sage)]/20 bg-[var(--color-sage-soft)] rounded-lg text-[var(--color-ink)]">
                  <span className="text-xs text-[var(--color-sage)] font-semibold block">AMNESIA VACCINE (CLAUDE.md):</span>
                  First, inspect the physical layout structure inside CLAUDE.md. Always preserve state. Commands: dev = <code className="text-[var(--color-sage)]">npm run dev</code>, lint = <code className="text-[var(--color-sage)]">npm run lint</code>.
                </div>
              ) : (
                <div className="p-2 border border-red-500/10 bg-red-500/5 rounded-lg text-[var(--color-muted)] line-through">
                  [!] System commands undefined. Amnesia vaccine absent. AI must guess which package tools are loaded.
                </div>
              )}

              {guardrails.blueprintContract ? (
                <div className="p-2 border border-[var(--color-sage)]/20 bg-[var(--color-sage-soft)] rounded-lg text-[var(--color-ink)]">
                  <span className="text-xs text-[var(--color-sage)] font-semibold block">BLUEPRINT CONTRACT (types.ts):</span>
                  Validate all schema integrations against central definition models inside <code className="font-[var(--font-mono)]">src/types.ts</code>. Do NOT declare inline object parameters.
                </div>
              ) : (
                <div className="p-2 border border-red-500/10 bg-red-500/5 rounded-lg text-[var(--color-muted)] line-through">
                  [!] No type specifications declared. AI allowed to output unstructured mock objects dynamically.
                </div>
              )}

              {guardrails.lintGuardrails ? (
                <div className="p-2 border border-[var(--color-sage)]/20 bg-[var(--color-sage-soft)] rounded-lg text-[var(--color-ink)]">
                  <span className="text-xs text-[var(--color-sage)] font-semibold block">LINTER ALIGNMENT GUARD:</span>
                  Perform typescript check via <code className="font-[var(--font-mono)]">tsc --noEmit</code> before finalizing output. Restrict any cross-folder imports.
                </div>
              ) : (
                <div className="p-1 text-xs text-[var(--color-muted)] font-[var(--font-sans)] italic">
                  * No automated syntax or linter guards active.
                </div>
              )}
            </div>
          </div>

          {/* Resulting LLM Code Quality */}
          <div className="space-y-2">
            <span className="text-xs font-semibold font-[var(--font-mono)] text-[var(--color-muted)] block">
              Resulting AI Generated Code Output:
            </span>
            <div className="codeblock text-xs min-h-60 max-h-72 overflow-y-auto select-text">
              <AnimatePresence mode="wait">
                {overallSafetyIndex > 80 ? (
                  <motion.div
                    key="secure-code"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center bg-[var(--color-sage-soft)] px-2 py-1.5 rounded-lg border border-[var(--color-sage)]/25">
                      <span className="text-xs text-[var(--color-sage)] font-semibold font-[var(--font-mono)]">100% COMPILES SUCCESSFULLY</span>
                      <span className="text-xs text-[var(--color-muted)]">Zero Slop Rate</span>
                    </div>
                    <pre className="text-[var(--color-sage-glow)] leading-normal text-xs font-[var(--font-mono)] mt-1">
{`// 1. Importing exact specifications from Centralized Types
import { Task, AppState } from "../lib/types";

// 2. Strict component respecting CLAUDE.md guidelines
export default function SafeTodo({ state }: { state: AppState }) {
  // Built on standard Zsh Environment variables
  const buildTime = new Date().toISOString();

  return (
    <ul className="space-y-2" id="safe-todo-list">
      {state.tasks.map((task: Task) => (
        <li key={task.id} className="p-3 bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-lg">
          <span className="font-[var(--font-mono)] text-[var(--color-sage)]">[{task.status}]</span>
          <span className="ml-2">{task.title}</span>
        </li>
      ))}
    </ul>
  );
}`}
                    </pre>
                  </motion.div>
                ) : (
                  <motion.div
                    key="messy-code"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center bg-red-500/10 px-2 py-1.5 rounded-lg border border-red-500/25">
                      <span className="text-xs text-red-500 font-semibold font-[var(--font-mono)]">COMPILATION WILL CRASH</span>
                      <span className="text-xs text-[var(--color-muted)]">Slop Rate Detected</span>
                    </div>
                    <pre className="text-red-400/80 line-through decoration-red-500 decoration-2 leading-normal text-xs font-[var(--font-mono)] mt-1">
{`// UNMITIGATED AI DRIFT: Hallucinating random packages
import { GlowButton } from "@awesomeui/glow-button";
import { fakeTaskMock } from "../../../unspecified/components/TrashFile";`}
                    </pre>
                    <pre className="text-[var(--color-muted)] leading-normal text-xs font-[var(--font-mono)]">
{`// The AI didn't know your files.ts so it made things up:
export default function TodoList() {
  // CRASH: Uses non-existent properties on undefined types
  const fakeData = fakeTaskMock.map(x => x.nonExistentKey);

  return (
    <div className="p-4" id="chaos-wrapper">
      <h3>Missing State Data</h3>
      <GlowButton action={() => alert("Crashes inside iframe")} />
    </div>
  );
}`}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>

      {/* Grid: Risk Frequency Charts (Without vs With Advocate) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="dashboard-analytics-charts">

        {/* Chart A: Without Advocate (The Wild West) */}
        <div className="card-shell p-5 space-y-4">
          <div className="flex items-center space-x-1.5 text-[var(--color-muted)] font-[var(--font-mono)] font-semibold text-xs">
            <Flame className="w-4 h-4 text-red-500 shrink-0" />
            <span>LLM Risk Frequencies (Unmitigated)</span>
          </div>
          <p className="text-xs text-[var(--color-muted)]">
            Frequencies of typical coding bugs in a normal AI workflow with zero prompt specifications or structure guards (Average 100 turns):
          </p>

          {/* Simple Animated Custom Bar Chart using native SVG */}
          <div className="pt-2">
            <div className="space-y-4">
              {riskCategories.map(risk => (
                <div key={risk.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-[var(--font-mono)]">
                    <span className="text-[var(--color-ink)] font-semibold">{risk.name}</span>
                    <span className="text-red-500 font-semibold">{risk.unmitigatedFrequency}% Occurrence</span>
                  </div>
                  <div className="relative w-full h-5 bg-[var(--color-canvas-2)] rounded border border-[var(--color-hairline)] overflow-hidden flex items-center pr-3">
                    <motion.div
                      className="h-full bg-red-400/60 rounded-r"
                      initial={{ width: 0 }}
                      animate={{ width: `${risk.unmitigatedFrequency}%` }}
                      transition={{ duration: 0.8, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
                    />
                    <span className="absolute left-2.5 text-[10px] font-[var(--font-mono)] text-[var(--color-muted)] font-semibold">
                      Severity Weight: {risk.severity}/10
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-[var(--color-muted)] font-[var(--font-mono)] italic leading-snug">
            * Analytical model based on typical telemetry gathered from un-governed agentic coding sandboxes.
          </div>
        </div>

        {/* Chart B: With Prompt Advocate Mitigations (The Green Zone) */}
        <div className="card-shell p-5 space-y-4">
          <div className="flex items-center space-x-1.5 text-[var(--color-sage)] font-[var(--font-mono)] font-semibold text-xs">
            <CheckCircle2 className="w-4 h-4 text-[var(--color-sage)] shrink-0" />
            <span>LLM Risk Frequencies (Governed by Advocate)</span>
          </div>
          <p className="text-xs text-[var(--color-muted)]">
            Expected bug frequencies after loading absolute folder paths, CLAUDE.md context contracts, and strict Types.ts contracts:
          </p>

          {/* Simple Animated Custom Bar Chart matching right side */}
          <div className="pt-2">
            <div className="space-y-4">
              {riskCategories.map(risk => (
                <div key={risk.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-[var(--font-mono)]">
                    <span className="text-[var(--color-ink)] font-semibold">{risk.name}</span>
                    <span className="text-[var(--color-sage)] font-semibold">{risk.mitigatedFrequency}% Residual</span>
                  </div>
                  <div className="relative w-full h-5 bg-[var(--color-canvas-2)] rounded border border-[var(--color-hairline)] overflow-hidden flex items-center">
                    <motion.div
                      className="h-full bg-[var(--color-sage)]/50 rounded-r"
                      initial={{ width: 0 }}
                      animate={{ width: `${risk.mitigatedFrequency}%` }}
                      transition={{ duration: 0.8, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
                    />
                    <div className="absolute right-2.5 flex items-center space-x-1 text-[10px] text-[var(--color-sage)] font-semibold font-[var(--font-mono)]">
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>-{risk.unmitigatedFrequency - risk.mitigatedFrequency}% drop</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-[var(--color-muted)] font-[var(--font-mono)] italic leading-snug">
            * 98.4% Average reduction in AI hallucination errors when compiling with strict, predefined blueprints.
          </div>
        </div>

      </div>

      {/* Main Risk Deep-Dive Interactive Matrix Selector */}
      <div className="card-shell p-5 space-y-4" id="risk-drilldown">
        <div>
          <h3 className="text-xs font-semibold font-[var(--font-mono)] text-[var(--color-ink)] flex items-center space-x-2">
            <Layers className="w-4 h-4 text-[var(--color-sage)]" />
            <span>Mitigations &amp; Action Plan Explorer: Deep Dive</span>
          </h3>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">
            Select an active LLM security risk topic below to explore its real-world symptoms and the exact Prompt Engineering Advocate mitigations:
          </p>
        </div>

        {/* Categories Tab Select Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5" id="risk-matrix-selectors">
          {riskCategories.map(risk => {
            const isActive = risk.id === selectedRiskId;
            const groupInfo = getRiskGroupLabel(risk.id);
            return (
              <button
                key={risk.id}
                onClick={() => setSelectedRiskId(risk.id)}
                className={`p-3.5 rounded-xl border text-left transition-all duration-500 cursor-pointer ${
                  isActive
                    ? "bg-[var(--color-surface-solid)] border-[var(--color-sage)]/40 text-[var(--color-ink)] shadow-sm"
                    : "bg-[var(--color-surface)] border-[var(--color-hairline)] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                }`}
              >
                <div className="flex justify-between items-center text-xs font-[var(--font-mono)] font-semibold">
                  <span className={isActive ? "text-[var(--color-sage)]" : "text-[var(--color-muted)]"}>
                    {groupInfo.label}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                    isActive ? "bg-[var(--color-sage-soft)] text-[var(--color-sage)]" : "bg-[var(--color-canvas-2)] text-[var(--color-muted)]"
                  }`}>
                    {risk.badge}
                  </span>
                </div>
                <h4 className="text-xs font-semibold font-[var(--font-sans)] mt-2 tracking-tight">
                  {risk.name}
                </h4>
              </button>
            );
          })}
        </div>

        {/* Selected Risk Display Details Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedRiskId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="p-5 bg-[var(--color-canvas)] rounded-2xl border border-[var(--color-hairline)] grid grid-cols-1 lg:grid-cols-12 gap-5 relative overflow-hidden"
          >
            {/* Top right subtle background number */}
            <div className="absolute -bottom-8 -right-8 opacity-[0.03] text-9xl font-semibold font-[var(--font-mono)] pointer-events-none select-none text-[var(--color-sage)]">
              {activeRisk.severity}
            </div>

            {/* Left side info block - 5 Cols */}
            <div className="lg:col-span-5 space-y-4">
              <div className="space-y-1.5 text-left">
                <span className="text-xs font-semibold font-[var(--font-mono)] text-[var(--color-sage)] bg-[var(--color-sage-soft)] px-2 py-1 rounded border border-[var(--color-sage)]/20">
                  Criticality Level: {activeRisk.severity}/10 Severity
                </span>
                <h4 className="text-base font-semibold text-[var(--color-ink)] tracking-tight flex items-center space-x-2 pt-1">
                  {getRiskIcon(activeRisk.id)}
                  <span>{activeRisk.name}</span>
                </h4>
                <p className="text-xs text-[var(--color-muted)] leading-relaxed font-[var(--font-sans)]">
                  {activeRisk.description}
                </p>
              </div>

              {/* Symptoms */}
              <div className="space-y-2 text-left">
                <span className="text-xs font-semibold font-[var(--font-mono)] text-[var(--color-muted)] block">
                  Typical Slop Symptoms (Layperson warning):
                </span>
                <ul className="space-y-1.5 text-xs text-[var(--color-ink)] list-disc list-inside">
                  {activeRisk.symptoms.map((symptom, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {symptom}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right side solutions - 7 Cols */}
            <div className="lg:col-span-7 space-y-3">
              <span className="text-xs font-semibold font-[var(--font-mono)] text-[var(--color-sage)] block text-left">
                <Wrench className="w-3.5 h-3.5 inline mr-1" />
                Prompt Engineering Advocate Mitigation Actions:
              </span>

              <div className="space-y-3">
                {activeRisk.mitigations.map((mit, i) => (
                  <div key={i} className="p-3.5 bg-[var(--color-surface)] border border-[var(--color-hairline)] rounded-xl space-y-1 text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-[var(--color-ink)] font-[var(--font-sans)] flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-sage)] shrink-0" />
                        <span>{mit.title}</span>
                      </span>
                      <span className="text-[10px] font-[var(--font-mono)] text-[var(--color-sage)] border border-[var(--color-sage)]/20 px-1.5 py-0.5 rounded">
                        {mit.toolUsed}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-muted)] leading-normal font-[var(--font-sans)]">
                      {mit.description}
                    </p>
                    <p className="text-xs text-[var(--color-muted)] font-[var(--font-sans)] italic pt-0.5 border-t border-[var(--color-hairline)] mt-1">
                      <Fingerprint className="w-3 h-3 inline mr-1 text-[var(--color-sage)]" />
                      First Principle: "{mit.principleCore}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        </AnimatePresence>

      </div>

    </div>
  );
}
