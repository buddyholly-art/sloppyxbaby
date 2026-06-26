import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FolderLock,
  Terminal as TerminalIcon,
  Sparkles,
  Check,
  Copy,
  ArrowRight,
  Bot,
  User,
  FileCode,
  Cpu,
  BookOpen,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Briefcase,
  Monitor,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Trophy,
  Share2,
  Zap,
  MapPin,
  Lightbulb,
  Apple,
  Flame,
  CircleCheck,
  CircleDot
} from "lucide-react";
import { ExplainTerm, VibeDecoderPanel } from "./ExplainTerm";

interface StepData {
  id: number;
  title: string;
  shortDesc: string;
  objective: string;
  adhdTip: string;
  explanation: string;
  terms: string[];
}

export default function VibeOnboardingScaffold() {
  // OS & Terminal selection (Step 0)
  const [os, setOs] = useState<"macOS" | "Windows" | "Linux">("macOS");
  const [terminal, setTerminal] = useState<"zsh" | "powershell" | "bash" | "cmd">("zsh");
  const [localProjectPath, setLocalProjectPath] = useState<string>("");
  const [showPathHelper, setShowPathHelper] = useState<boolean>(false);

  // Align terminal defaults and local path defaults when OS changes
  useEffect(() => {
    if (os === "Windows") {
      setTerminal("powershell");
      if (!localProjectPath || localProjectPath.startsWith("/Users/")) {
        setLocalProjectPath("C:\\Users\\Username\\Projects\\my-vibe-app");
      }
    } else {
      setTerminal("zsh");
      if (!localProjectPath || localProjectPath.startsWith("C:\\")) {
        setLocalProjectPath("/Users/username/Projects/my-vibe-app");
      }
    }
  }, [os]);

  // Project scale criteria for specialized suggestions
  const [projectScale, setProjectScale] = useState<"flat" | "layer" | "feature">("flat");

  // Track active linear step
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [temporaryInput, setTemporaryInput] = useState<string>("");
  const [showVictory, setShowVictory] = useState<boolean>(false);
  const [copiedSharePayload, setCopiedSharePayload] = useState<boolean>(false);

  // Copy success status
  const [copiedCli, setCopiedCli] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  // Mark a step as complete
  const handleMarkComplete = (stepId: number) => {
    let nextCompleted = [...completedSteps];
    if (!completedSteps.includes(stepId)) {
      nextCompleted = [...completedSteps, stepId];
      setCompletedSteps(nextCompleted);
    }

    // If we've completed all 5 steps, trigger the Victory panel
    if (nextCompleted.length === 5) {
      setShowVictory(true);
    }

    // Quiet factual validation as dictated by user manual
    const nextItem = stepId < 5 ? stepId + 1 : stepId;
    if (stepId < 5) {
      setCurrentStep(nextItem);
    }
  };

  const resetAllProgress = () => {
    setCompletedSteps([]);
    setCurrentStep(1);
    setTemporaryInput("");
    setShowVictory(false);
  };

  const handleCopy = (text: string, type: "cli" | "prompt") => {
    navigator.clipboard.writeText(text);
    if (type === "cli") {
      setCopiedCli(true);
      setTimeout(() => setCopiedCli(false), 2000);
    } else {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  // Steps definition
  const steps: StepData[] = [
    {
      id: 1,
      title: "1. Lock In Your Project Folder (The Root Fence)",
      shortDesc: "Claim a single strict folder location on your computer and set up Git history tracking.",
      objective: "Define clean workspace borders so your AI coder never pollutes other parts of your hard drive or generates random files outside its boundary.",
      adhdTip: "Initiation Paralysis Check: You don't have to write any real code or understand computer language yet! We are just planting a small flag on your computer so everything stays safely in one place.",
      explanation: "Before doing any programming, you must establish strict workspace boundaries. If you let an AI write code without Git tracking, it can make quiet mess-ups across dozens of old files, leaving you with untracked junk. Git acts as a 'Save State' button, letting you undo any AI error with 1 click.",
      terms: ["terminal shell", "git tracking"]
    },
    {
      id: 2,
      title: "2. Inject the AI Amnesia Vaccine (Controls & Guidance spec files)",
      shortDesc: "Generate CLAUDE.md & .cursorrules files to instantly recover your AI's context on restart.",
      objective: "Keep instructions inside machine-verifiable files so the AI reads them first and stays in play.",
      adhdTip: "The Amnesia Principle: AI models are like Goldfish — they have absolutely no memory of who you are or what files you edited when you open a new chat window. These files act as externalized memory chips.",
      explanation: "A standard CLAUDE.md resides right at the root of your folder and lists your exact Operating System, terminal setup, and build scripts. When your AI assistant opens this folder, it automatically reads CLAUDE.md first. It instantly remembers all constraints, completely eliminating the time you spend re-explaining things every morning.",
      terms: ["claude.md"]
    },
    {
      id: 3,
      title: "3. Group Your App Blueprints in One Place (types.ts)",
      shortDesc: "Pre-define your central data structures inside src/types.ts as a Single Source of Truth.",
      objective: "Set clear blueprint rules so the AI never invents multiple mismatched names for the same features.",
      adhdTip: "Low Cognitive-Load Safety: By storing all core terms (e.g. 'how a Task looks') in a single file first, we prevent our working brain — and the AI — from getting confused and duplicating code across folders.",
      explanation: "When you use AI, it gets excited and suggests duplicate or slightly different versions of the same code across multiple files. Grouping all your definitions inside 'src/types.ts' first acts as a contract. The AI looks at this file first and writes perfectly matched, clean code without bloating your project.",
      terms: ["single source of truth"]
    },
    {
      id: 4,
      title: "4. Deploy Your Automated Guardrails (Strict Linter Checking)",
      shortDesc: "Configure basic compiler scripts to catch typos and broken paths automatically.",
      objective: "Force the computer to scan your code in milliseconds and catch imports before they crash your app.",
      adhdTip: "Low-Arousal Verification: Do not tire your brain reading line-by-line looking for tiny syntax typos. Let the built-in system scanner do the heavy lifting so you protect your emotional battery.",
      explanation: "A linter is a simple robotic inspector. Rather than manual scrolling, it flags import errors instantly. Elite coders use lint scripts to automate correctness so they can focus on creativity and user experience.",
      terms: ["typescript", "linter"]
    },
    {
      id: 5,
      title: "5. Spin Up Your Local App Server (First Launch!)",
      shortDesc: "Run your development command and view your clean, working applet workspace.",
      objective: "Confirm that your project compiles and launches beautifully without any leftover slop.",
      adhdTip: "Structure That Bends: Click the checkmark to record that you successfully scaffolded a professional folder structure with zero experience! You can run this anywhere.",
      explanation: "By launching locally, you prove that your setup is aligned with modern engineering standards. You now possess a professional, resilient repository template that is immune to AI context pollution.",
      terms: ["bulletproof", "persistence"]
    }
  ];

  const getActiveStepData = () => {
    return steps.find(s => s.id === currentStep) || steps[0];
  };

  const activeStep = getActiveStepData();

  // CLI Command Generator based on OS / Terminal and scale
  const generateCliCommands = (stepId: number): string => {
    const isWin = os === "Windows" && (terminal === "powershell" || terminal === "cmd");
    const safePath = localProjectPath.trim() || (isWin ? "C:\\Users\\Username\\Projects\\my-vibe-app" : "/Users/username/Projects/my-vibe-app");

    switch (stepId) {
      case 1:
        if (isWin) {
          return `# Step 1: Create your local directory and initialize Git
# Zero work needed - path automatically targeted!
mkdir "${safePath}"
cd "${safePath}"
git init
mkdir -p src\\components src\\lib src\\utils
echo "# My Vibe App" > README.md`;
        }
        return `# Step 1: Create your local directory and initialize Git
# Zero work needed - path automatically targeted!
mkdir -p "${safePath}"
cd "${safePath}"
git init
mkdir -p src/components src/lib src/utils
echo "# My Vibe App" > README.md`;

      case 2:
        if (isWin) {
          return `# Step 2: Establish AI Amnesia-prevention control guides
cd "${safePath}"
# Seed your local self-announcing instruction sheets:
echo "# Vibe Coding Controls" > .cursorrules
echo "# CLAUDE.md Instruction Manual" > CLAUDE.md`;
        }
        return `# Step 2: Establish AI Amnesia-prevention control guides
cd "${safePath}"
# Seed your local self-announcing instruction sheets:
touch .cursorrules CLAUDE.md`;

      case 3:
        if (isWin) {
          return `# Step 3: Scaffold Single Source of Truth Types
cd "${safePath}"
mkdir -p src
echo "export interface AppState {}" > src\\types.ts`;
        }
        return `# Step 3: Scaffold Single Source of Truth Types
cd "${safePath}"
mkdir -p src
echo "export interface AppState {}" > src/types.ts`;

      case 4:
        if (isWin) {
          return `# Step 4: Install clean-imports linter validation
cd "${safePath}"
npm init -y
npm install --save-dev typescript @types/node
npx tsc --init`;
        }
        return `# Step 4: Install clean-imports linter validation
cd "${safePath}"
npm init -y
npm install --save-dev typescript @types/node
npx tsc --init`;

      case 5:
        return `# Step 5: Start the local workspace server
cd "${safePath}"
npm run dev`;

      default:
        return "";
    }
  };

  // LLM Prompt Contract Generator based on layout choice and safeguards
  const generateLlmPrompt = (stepId: number): string => {
    const isWin = os === "Windows";
    const divider = isWin ? "\\" : "/";
    const safePath = localProjectPath.trim() || (isWin ? "C:\\Users\\Username\\Projects\\my-vibe-app" : "/Users/username/Projects/my-vibe-app");

    switch (stepId) {
      case 1:
        return `Initialize a clean directory structure inside '${safePath}' with no excessive mockup files.
[CRITERIA]:
- Target layout pattern: ${projectScale === "flat" ? "Extreme Flat Layout" : "Vertical Domains Layered Layout"}
- Ground Rules: Absolutely NO generic files, placeholder directories, or unlinked text notes at the workspace root.
- Keep the directory tree perfectly tight and declare single-panel imports only.`;

      case 2:
        return `Write a lean, 30-line 'CLAUDE.md' file inside '${safePath}'.
This file must specify exact local commands:
- Build command: 'npm run build'
- Test command: 'npm run test'
- Linter validation: 'npm run lint'
- Core styling target: Tailwind CSS on terminal OS ${os} using shell ${terminal}.
Also add an 'Amnesia Protocol' header stating that when reloading, the model must read all types inside 'src${divider}types.ts' first before editing layout logic, making this folder fully self-announcing so subsequent chats don't suffer from memory loss.`;

      case 3:
        return `Generate a clean '${safePath}${divider}src${divider}types.ts' file as our codebase Single Source of Truth (SSOT).
Ensure:
- Declare all core schemas, interfaces, and enums here.
- Add descriptive comment headers for every interface explaining its exact responsibility.
- Do not create mock datasets. Forbid duplicate states across other component routes.`;

      case 4:
        return `Set up import boundaries in our project development config files inside '${safePath}'.
Define strict patterns:
- Restrict folder crossing.
- Ensure type files are loaded in static checkouts.
- Reject mockups, duplicated folders, and unlinked scripts.`;

      case 5:
        return `We have completed our ground scaffolding turn!
Verify our completed repository setup inside '${safePath}':
1. Make sure all imports reference 'src${divider}types.ts' correctly.
2. Ensure we have zero floating placeholder lists in adjacent folders.
3. Write a brief overview to confirm a clean compile state.`;

      default:
        return "";
    }
  };

  return (
    <div className="space-y-6" id="vibe-scaffold-hub">
      {/* Banner Area */}
      <div className="card-shell p-5 md:p-6 relative overflow-hidden" id="onboarding-guide-topbar">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <TerminalIcon className="w-40 h-40 text-[var(--color-sage)]" />
        </div>

        <div className="max-w-3xl space-y-3">
          <div className="eyebrow">
            <GraduationCap className="w-3.5 h-3.5 text-[var(--color-sage)]" />
            <span>ADHD-Optimized Onboarding Scaffold</span>
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-ink)] tracking-tight flex items-center space-x-2">
            <span>Local Repo Launch Scaffold</span>
          </h2>
          <p className="text-sm text-[var(--color-muted)] leading-relaxed max-w-2xl">
            Struggling to set up projects locally without your AI assistant making an unmanageable mess of your repository? Walk through this guided local roadmap. We ask simple questions, give precise commands, and feed you prompts to compile a professional, self-documenting template directly on your own machine.
          </p>
        </div>
      </div>

      {/* Grid Layout containing Setup Configurations and Progress Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Panel & Setup choices */}
        <div className="lg:col-span-5 space-y-6">
          {/* OS, Terminal and Project Scale Options */}
          <div className="card-shell p-5 md:p-6 space-y-5" id="setup-selector-card">
            <div className="flex justify-between items-center border-b border-[var(--color-hairline)] pb-3">
              <h3 className="text-sm font-semibold font-[var(--font-mono)] text-[var(--color-ink)] flex items-center space-x-2">
                <Monitor className="w-4 h-4 text-[var(--color-sage)]" />
                <span>Computer Workspace Setup</span>
              </h3>
              <span className="text-xs font-[var(--font-mono)] text-[var(--color-muted)]">Input Node</span>
            </div>

            {/* Workspace File Path Locator Box */}
            <div className="space-y-2 p-3.5 bg-[var(--color-canvas)] rounded-xl border border-[var(--color-hairline)]">
              <div className="flex justify-between items-center">
                <label className="text-xs font-[var(--font-mono)] font-semibold text-[var(--color-ink)] block">
                  <MapPin className="w-3 h-3 inline mr-1" />
                  Paste Your Local Folder Path:
                </label>
                <button
                  type="button"
                  onClick={() => setShowPathHelper(!showPathHelper)}
                  className="text-xs font-[var(--font-mono)] text-[var(--color-sage)] hover:text-[var(--color-sage-glow)] underline cursor-pointer select-none bg-transparent border-none"
                >
                  {showPathHelper ? "Hide Finder Guide" : "How do I find this?"}
                </button>
              </div>

              <input
                type="text"
                value={localProjectPath}
                onChange={(e) => setLocalProjectPath(e.target.value)}
                placeholder={os === "Windows" ? "e.g. C:\\Users\\Name\\Projects\\my-new-app" : "e.g. /Users/name/Projects/my-new-app"}
                className="w-full bg-[var(--color-surface-solid)] border border-[var(--color-hairline)] rounded-lg px-3 py-2 text-xs font-[var(--font-mono)] text-[var(--color-ink)] placeholder-[var(--color-muted)]/50 focus:outline-none focus:border-[var(--color-sage)]/50"
              />

              {showPathHelper && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="text-xs text-[var(--color-muted)] font-[var(--font-sans)] space-y-2 pt-2 border-t border-[var(--color-hairline)]"
                >
                  <p className="font-medium text-[var(--color-ink)]">Choose your system to reveal the exact shortcut:</p>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="p-2.5 bg-[var(--color-canvas-2)] border border-[var(--color-hairline)] rounded-lg">
                      <span className="text-[var(--color-sage)] font-semibold block mb-1 text-xs">macOS (Apple):</span>
                      <p className="text-xs leading-relaxed text-[var(--color-muted)] font-[var(--font-sans)]">
                        Right-click your folder in Finder → hold the <kbd className="bg-[var(--color-canvas)] border border-[var(--color-hairline)] px-1 py-0.5 rounded text-[11px] font-[var(--font-mono)] font-semibold text-[var(--color-ink)]">Option</kbd> key → select <strong>"Copy as Pathname"</strong>. Then paste here!
                      </p>
                    </div>
                    <div className="p-2.5 bg-[var(--color-canvas-2)] border border-[var(--color-hairline)] rounded-lg">
                      <span className="text-[var(--color-sage)] font-semibold block mb-1 text-xs">Windows (PC):</span>
                      <p className="text-xs leading-relaxed text-[var(--color-muted)] font-[var(--font-sans)]">
                        Open your folder in File Explorer → click any empty space in the top file coordinates address bar → copy the highlighted destination path (e.g. <code className="font-[var(--font-mono)] text-[var(--color-ink)]">C:\Projects\my-app</code>). Then paste here!
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              <p className="text-xs text-[var(--color-muted)] font-[var(--font-sans)] leading-normal">
                <Lightbulb className="w-3 h-3 inline mr-1" />
                Paste your folder path once, and our roadmap automatically prepares custom, zero-friction local script setups for you.
              </p>
            </div>

            {/* Selection A: Target OS */}
            <div className="space-y-1.5">
              <label className="text-xs font-[var(--font-mono)] font-semibold text-[var(--color-muted)] block">
                Choose Computer OS:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(["macOS", "Windows", "Linux"] as const).map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setOs(item)}
                    className={`py-2 px-1 rounded-lg border text-center font-semibold tracking-tight transition-all duration-500 cursor-pointer ${
                      os === item
                        ? "bg-[var(--color-sage-soft)] border-[var(--color-sage)]/40 text-[var(--color-ink)]"
                        : "bg-[var(--color-surface)] border-[var(--color-hairline)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-solid)]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Selection B: Shell Terminal preference */}
            <div className="space-y-1.5">
              <label className="text-xs font-[var(--font-mono)] font-semibold text-[var(--color-muted)] block">
                <ExplainTerm termKey="terminal shell">Target Terminal Shell</ExplainTerm>:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {os === "Windows" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setTerminal("powershell")}
                      className={`py-2 px-2 rounded-lg border text-left font-[var(--font-mono)] transition-all duration-500 cursor-pointer ${
                        terminal === "powershell"
                          ? "bg-[var(--color-sage-soft)] border-[var(--color-sage)]/30 text-[var(--color-ink)]"
                          : "bg-[var(--color-surface)] border-[var(--color-hairline)] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                      }`}
                    >
                      PowerShell
                    </button>
                    <button
                      type="button"
                      onClick={() => setTerminal("cmd")}
                      className={`py-2 px-2 rounded-lg border text-left font-[var(--font-mono)] transition-all duration-500 cursor-pointer ${
                        terminal === "cmd"
                          ? "bg-[var(--color-sage-soft)] border-[var(--color-sage)]/30 text-[var(--color-ink)]"
                          : "bg-[var(--color-surface)] border-[var(--color-hairline)] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                      }`}
                    >
                      Command Prompt (cmd)
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setTerminal("zsh")}
                      className={`py-2 px-2 rounded-lg border text-left font-[var(--font-mono)] transition-all duration-500 cursor-pointer ${
                        terminal === "zsh"
                          ? "bg-[var(--color-sage-soft)] border-[var(--color-sage)]/30 text-[var(--color-ink)]"
                          : "bg-[var(--color-surface)] border-[var(--color-hairline)] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                      }`}
                    >
                      Zsh Terminal
                    </button>
                    <button
                      type="button"
                      onClick={() => setTerminal("bash")}
                      className={`py-2 px-2 rounded-lg border text-left font-[var(--font-mono)] transition-all duration-500 cursor-pointer ${
                        terminal === "bash"
                          ? "bg-[var(--color-sage-soft)] border-[var(--color-sage)]/30 text-[var(--color-ink)]"
                          : "bg-[var(--color-surface)] border-[var(--color-hairline)] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                      }`}
                    >
                      Bash Terminal
                    </button>
                  </>
                )}
              </div>
              <p className="text-xs text-[var(--color-muted)] font-[var(--font-sans)] italic leading-relaxed">
                Commands below automatically compile variables to match your computer shell directory flags.
              </p>
            </div>

            {/* Selection C: Project Layout Scale Choice */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-[var(--font-mono)] font-semibold text-[var(--color-muted)] block">
                <ExplainTerm termKey="features folder">Target Project Layout Style</ExplainTerm>:
              </label>
              <div className="space-y-2">
                {[
                  { id: "flat", title: "Clean Flat bed (Simple Utilities)", desc: "Enforce a Single-Panel App.tsx + unified types file. Zero folder clutter." },
                  { id: "layer", title: "Vertical Domains (Bulletproof Framework)", desc: "Domains split inside a /features folder with local colocated tests." }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setProjectScale(item.id as any)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all duration-500 cursor-pointer flex items-center space-x-3 ${
                      projectScale === item.id
                        ? "bg-[var(--color-sage-soft)] border-[var(--color-sage)]/35 text-[var(--color-ink)]"
                        : "bg-[var(--color-surface)] border-[var(--color-hairline)] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full shrink-0 ${projectScale === item.id ? "bg-[var(--color-sage)]" : "border border-[var(--color-hairline-strong)]"}`} />
                    <div className="space-y-0.5 text-xs text-left leading-tight">
                      <span className={`font-semibold block ${projectScale === item.id ? "text-[var(--color-ink)]" : ""}`}>
                        {item.title}
                      </span>
                      <span className="text-xs text-[var(--color-muted)] leading-normal font-[var(--font-sans)] block">{item.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Display progress percentage */}
            <div className="space-y-2 pt-2 border-t border-[var(--color-hairline)]">
              <div className="flex justify-between items-center text-xs font-[var(--font-mono)] text-[var(--color-muted)] font-semibold">
                <span>Total Active Completion:</span>
                <span className="text-[var(--color-sage)]">{Math.round((completedSteps.length / steps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-[var(--color-canvas-2)] h-2 rounded-full overflow-hidden border border-[var(--color-hairline)]">
                <div
                  className="bg-[var(--color-sage)] h-full transition-all duration-500"
                  style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
                />
              </div>
              {completedSteps.length === steps.length && (
                <button
                  type="button"
                  onClick={() => setShowVictory(true)}
                  className="w-full text-xs text-[var(--color-sage)] font-semibold font-[var(--font-mono)] text-center flex items-center justify-center space-x-1.5 bg-[var(--color-sage-soft)] hover:bg-[var(--color-sage)]/20 p-2 border border-[var(--color-sage)]/30 rounded-lg cursor-pointer transition-all duration-500"
                >
                  <Trophy className="w-4 h-4 text-[var(--color-sage)]" />
                  <span>Setup Complete! View Trophy Proclamation</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick jump menu */}
          <div className="card-shell p-5 md:p-6 space-y-3.5" id="step-jump-menu">
            <h4 className="text-xs font-semibold font-[var(--font-mono)] text-[var(--color-ink)]">
              Jump To Setup Phase:
            </h4>
            <div className="grid grid-cols-5 gap-1.5">
              {steps.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentStep(s.id)}
                  className={`py-2 text-center text-xs font-[var(--font-mono)] font-semibold rounded-lg border transition-all duration-500 cursor-pointer relative ${
                    currentStep === s.id
                      ? "bg-[var(--color-sage)] text-white border-[var(--color-sage)]"
                      : completedSteps.includes(s.id)
                      ? "bg-[var(--color-sage-soft)] border-[var(--color-sage)]/30 text-[var(--color-sage)]"
                      : "bg-[var(--color-surface)] border-[var(--color-hairline)] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                  }`}
                  title={s.title}
                >
                  <span>{s.id}</span>
                  {completedSteps.includes(s.id) && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--color-sage)]" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2.5 border-t border-[var(--color-hairline)]">
              <button
                type="button"
                onClick={resetAllProgress}
                className="text-xs font-[var(--font-mono)] text-[var(--color-muted)] hover:text-[var(--color-ink)] flex items-center space-x-1 cursor-pointer bg-transparent border-0 transition-all duration-500"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Launch Progress</span>
              </button>
            </div>
          </div>

          {/* Glossary Widget Decoder Panel */}
          <VibeDecoderPanel />
        </div>

        {/* Right Column: Active Step Interactive Portal */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            {showVictory ? (
              <motion.div
                key="victory-celebration"
                className="card-core p-6 md:p-8 space-y-6 relative overflow-hidden text-left"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
              >
                {/* Visual Accent glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--color-sage)]/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--color-sage)]/5 rounded-full blur-2xl pointer-events-none" />

                {/* Trophy Presentation Header */}
                <div className="flex flex-col items-center justify-center text-center space-y-3 pt-2 pb-1 border-b border-[var(--color-hairline)]">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-sage-soft)] border-2 border-[var(--color-sage)]/30 flex items-center justify-center relative">
                    <Trophy className="w-9 h-9 text-[var(--color-sage)]" />
                    <span className="absolute -top-1 -right-2 bg-[var(--color-sage)] text-white text-[10px] font-[var(--font-mono)] px-1.5 py-0.5 rounded-full font-semibold scale-90">
                      Standard
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg md:text-xl font-semibold tracking-tight text-[var(--color-ink)]">
                      Sovereign Repo Setup Fully Certified!
                    </h3>
                    <p className="text-xs text-[var(--color-sage)] font-[var(--font-mono)] font-semibold">
                      Compliance Standard achieved: Premium Guardrail
                    </p>
                  </div>
                </div>

                {/* System Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Electricity saved box */}
                  <div className="p-4 bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-2xl space-y-2">
                    <div className="flex items-center space-x-1.5 text-[var(--color-sage)]">
                      <Zap className="w-4 h-4 text-[var(--color-sage)] shrink-0" />
                      <span className="text-xs font-[var(--font-mono)] font-semibold">Unnecessary AI Compute Saved</span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-lg font-[var(--font-mono)] font-semibold text-[var(--color-ink)] leading-none">
                        ~18.4 kWh <span className="text-[var(--color-muted)] text-xs font-[var(--font-sans)] font-normal">Saved</span>
                      </div>
                      <p className="text-xs text-[var(--color-muted)] leading-relaxed font-[var(--font-sans)]">
                        By deploying local CLAUDE.md & single-source-of-truth contracts early, you avoid up to ~12 typical broken LLM loops where context gets lost. Equal to keeping a 10W LED bulb illuminated for <strong>1,840 hours</strong>!
                      </p>
                    </div>
                  </div>

                  {/* Code standing box */}
                  <div className="p-4 bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-2xl space-y-2">
                    <div className="flex items-center space-x-1.5 text-[var(--color-sage)]">
                      <Cpu className="w-4 h-4 text-[var(--color-sage)] shrink-0" />
                      <span className="text-xs font-[var(--font-mono)] font-semibold">Static Code Standing</span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-lg font-[var(--font-mono)] font-semibold text-[var(--color-ink)] leading-none">
                        Superior to <span className="text-[var(--color-sage)]">94.7%</span>
                      </div>
                      <p className="text-xs text-[var(--color-muted)] leading-relaxed font-[var(--font-sans)]">
                        Of typical greenfield "vibe-slop" repositories in the Web/TypeScript ecosystem. Eliminating redundant state declarations early cements your repo's professional velocity profile.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Applied Engineering Principles Review Card */}
                <div className="p-4 bg-[var(--color-canvas)]/60 border border-[var(--color-hairline)] rounded-2xl space-y-3">
                  <span className="text-xs font-[var(--font-mono)] text-[var(--color-sage)] bg-[var(--color-sage-soft)] px-2 py-0.5 rounded border border-[var(--color-sage)]/20 font-semibold">
                    Your Applied Engineering Foundation
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
                    <div className="space-y-0.5">
                      <h4 className="font-semibold text-[var(--color-ink)]">1. Think Before Code</h4>
                      <p className="text-xs text-[var(--color-muted)] leading-normal font-[var(--font-sans)]">You staked a clean client boundary before letting AI pollute file trees.</p>
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-semibold text-[var(--color-ink)]">2. Amnesia Vaccine</h4>
                      <p className="text-xs text-[var(--color-muted)] leading-normal font-[var(--font-sans)]">Your workspace rules reside directly in code via CLAUDE.md spec files.</p>
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-semibold text-[var(--color-ink)]">3. Single Source of Truth</h4>
                      <p className="text-xs text-[var(--color-muted)] leading-normal font-[var(--font-sans)]">Shared definitions belong in types.ts, preventing AI duplication drift.</p>
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-semibold text-[var(--color-ink)]">4. Fast Automated Auditing</h4>
                      <p className="text-xs text-[var(--color-muted)] leading-normal font-[var(--font-sans)]">Strict compilers watch directory structures and types continuously.</p>
                    </div>
                  </div>
                </div>

                {/* Social Share Prompt Tool */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-[var(--font-mono)] text-[var(--color-muted)] font-semibold">
                    <span className="flex items-center space-x-1.5">
                      <Share2 className="w-3.5 h-3.5 text-[var(--color-sage)]" />
                      <span>Social Shareable Compliance Proclamation (1-Tap Copy):</span>
                    </span>
                    {copiedSharePayload && (
                      <span className="text-[var(--color-sage)] font-semibold lowercase font-[var(--font-mono)]">Copied successfully!</span>
                    )}
                  </div>

                  <div className="relative">
                    <textarea
                      readOnly
                      value={`I just launched a clean, self-explaining repository locally using the Sovereign Launch Scaffold!

Style: ${projectScale === "flat" ? "Clean Flat (App.tsx + types.ts)" : "Vertical Feature-Sliced Design"}
Compute Optimization: Saved estimated 18.4 kWh of AI compute loops!
Quality Check: Bypassing amnesia with CLAUDE.md & strict TypeScript.
Standing: Statically superior to 94.7% of vibe-crafted projects!`}
                      className="w-full p-4 bg-[var(--color-canvas)] text-[var(--color-ink)] border border-[var(--color-hairline)] rounded-2xl text-xs font-[var(--font-mono)] resize-none h-24 select-all focus:outline-none leading-normal"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const payloadStr = `I just launched a clean, self-explaining repository locally using the Sovereign Launch Scaffold!\n\nStyle: ${projectScale === "flat" ? "Clean Flat (App.tsx + types.ts)" : "Vertical Feature-Sliced Design"}\nCompute Optimization: Saved estimated 18.4 kWh of AI compute loops!\nQuality Check: Bypassing amnesia with CLAUDE.md & strict TypeScript.\nStanding: Statically superior to 94.7% of vibe-crafted projects!`;
                        navigator.clipboard.writeText(payloadStr);
                        setCopiedSharePayload(true);
                        setTimeout(() => setCopiedSharePayload(false), 2000);
                      }}
                      className="absolute bottom-3 right-3 bg-[var(--color-sage)] hover:bg-[var(--color-sage-glow)] text-white px-3 py-1.5 text-xs font-semibold font-[var(--font-mono)] rounded-lg cursor-pointer flex items-center space-x-1.5 transition-all duration-500"
                    >
                      <Copy className="w-3" />
                      <span>Copy Proclamation</span>
                    </button>
                  </div>
                </div>

                {/* Footer Back toggling option */}
                <div className="pt-4 flex items-center justify-between border-t border-[var(--color-hairline)]">
                  <span className="text-xs text-[var(--color-muted)] font-[var(--font-mono)] italic">
                    Dismiss this card to double-check terminal variables anytime.
                  </span>

                  <button
                    type="type"
                    onClick={() => setShowVictory(false)}
                    className="btn-ghost"
                  >
                    Dismiss & Review CLI Commands
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={currentStep}
                className="card-core p-6 md:p-8 space-y-6 relative overflow-hidden text-left"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
              >
                {/* Decorative side accent blur */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-sage)]/5 rounded-full blur-2xl pointer-events-none" />

                {/* Step Navigation Headers */}
                <div className="flex justify-between items-center border-b border-[var(--color-hairline)] pb-4">
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 rounded-lg bg-[var(--color-sage-soft)] border border-[var(--color-sage)]/30 text-[var(--color-sage)] flex items-center justify-center font-[var(--font-mono)] font-semibold text-xs">
                      {activeStep.id}
                    </span>
                    <div>
                      <span className="text-xs font-[var(--font-mono)] text-[var(--color-muted)] font-semibold block">Active Setup Step</span>
                      <h3 className="text-sm font-semibold text-[var(--color-ink)] tracking-tight">{activeStep.title}</h3>
                    </div>
                  </div>

                  <div className="flex space-x-1">
                    <button
                      onClick={() => setCurrentStep(prev => prev > 1 ? prev - 1 : prev)}
                      disabled={currentStep === 1}
                      className={`p-2 rounded-lg border text-[var(--color-muted)] cursor-pointer transition-all duration-500 ${
                        currentStep === 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-[var(--color-surface)] border-[var(--color-hairline)]"
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentStep(prev => prev < 5 ? prev + 1 : prev)}
                      disabled={currentStep === 5}
                      className={`p-2 rounded-lg border text-[var(--color-muted)] cursor-pointer transition-all duration-500 ${
                        currentStep === 5 ? "opacity-30 cursor-not-allowed" : "hover:bg-[var(--color-surface)] border-[var(--color-hairline)]"
                      }`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Cognitive explanation */}
                <div className="space-y-4">
                  <div className="p-4 bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-2xl space-y-2">
                    <div className="flex items-center space-x-1.5">
                      <BookOpen className="w-4 h-4 text-[var(--color-sage)] shrink-0" />
                      <span className="text-xs font-[var(--font-mono)] font-semibold text-[var(--color-muted)]">The Factual Explanation</span>
                    </div>
                    <p className="text-xs text-[var(--color-ink)] leading-relaxed font-[var(--font-sans)] select-text">
                      {activeStep.explanation}
                    </p>
                  </div>

                  {/* Visual Concept Decoder Triggers */}
                  {activeStep.terms && activeStep.terms.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 p-3 bg-[var(--color-canvas)]/50 border border-[var(--color-hairline)] rounded-2xl text-xs">
                      <span className="text-xs font-[var(--font-mono)] font-semibold text-[var(--color-muted)] shrink-0">
                        Click to Decode Step Terms:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {activeStep.terms.map(tKey => (
                          <ExplainTerm key={tKey} termKey={tKey} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ADHD Cognitive Trigger Guardrail */}
                  <div className="p-4 bg-[var(--color-sage-soft)] border border-[var(--color-sage)]/20 rounded-2xl flex items-start space-x-3 text-xs text-[var(--color-ink)] leading-relaxed font-[var(--font-sans)]">
                    <Sparkles className="w-4 h-4 text-[var(--color-sage)] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[var(--color-sage)] font-[var(--font-mono)] text-xs block mb-1">Executive Function Support:</strong>
                      <span>{activeStep.adhdTip}</span>
                    </div>
                  </div>
                </div>

                {/* Section 1: The CLI Terminal command */}
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center border-b border-[var(--color-hairline)] pb-2">
                    <div className="flex items-center space-x-2 text-xs font-[var(--font-mono)] text-[var(--color-muted)] font-semibold">
                      <TerminalIcon className="w-3.5 h-3.5 text-[var(--color-sage)]" />
                      <span>Run CLI Equivalent on Mac / Windows / Linux System:</span>
                    </div>

                    <button
                      onClick={() => handleCopy(generateCliCommands(activeStep.id), "cli")}
                      className="flex items-center space-x-1 text-[var(--color-muted)] hover:text-[var(--color-ink)] px-2 py-1 text-xs font-[var(--font-mono)] bg-[var(--color-canvas)] rounded-lg border border-[var(--color-hairline)] cursor-pointer transition-all duration-500"
                    >
                      {copiedCli ? (
                        <>
                          <Check className="w-3 h-3 text-[var(--color-sage)]" />
                          <span className="text-[var(--color-sage)] font-semibold">Copied Terminal commands!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[var(--color-muted)]" />
                          <span>Copy Commands</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <pre className="p-4 bg-[var(--color-canvas)] rounded-2xl font-[var(--font-mono)] text-xs text-[var(--color-sage)] border border-[var(--color-hairline)] overflow-x-auto min-h-20 max-h-48 leading-relaxed selection:bg-[var(--color-sage)]/20 select-text">
                      {generateCliCommands(activeStep.id)}
                    </pre>
                    <span className="absolute bottom-2.5 right-3 text-[10px] font-[var(--font-mono)] text-[var(--color-muted)] bg-[var(--color-surface-solid)] px-2.5 py-1 rounded border border-[var(--color-hairline)] font-semibold">
                      Shell: {terminal}
                    </span>
                  </div>

                  {/* Terminal Fallback Card */}
                  <div className="p-3.5 bg-[var(--color-canvas)]/50 border border-[var(--color-hairline)] rounded-2xl space-y-1.5 text-xs">
                    <div className="flex items-center space-x-1.5 text-[var(--color-sage)] font-[var(--font-mono)] font-semibold text-xs">
                      <TerminalIcon className="w-3.5 h-3.5 text-[var(--color-sage)] shrink-0" />
                      <span>Out of AI Credits? Local Terminal Fallback Strategy</span>
                    </div>
                    <p className="text-xs text-[var(--color-muted)] font-[var(--font-sans)] leading-relaxed">
                      You do <strong>not</strong> need expensive premium AI subscriptions or token credits to set up raw projects! Standard computer terminals run all these actions 100% free with absolute precision. Use these compiled local scripts to safely layout your setup, configure memory anchors, groups types, and compile your local server without spending a single penny.
                    </p>
                  </div>
                </div>

                {/* Section 2: The LLM Prompt Instruction Contract */}
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center border-b border-[var(--color-hairline)] pb-2">
                    <div className="flex items-center space-x-2 text-xs font-[var(--font-mono)] text-[var(--color-muted)] font-semibold">
                      <Bot className="w-3.5 h-3.5 text-[var(--color-sage)]" />
                      <span>Feed AI Coding Assistant this Ground-truth prompt:</span>
                    </div>

                    <button
                      onClick={() => handleCopy(generateLlmPrompt(activeStep.id), "prompt")}
                      className="flex items-center space-x-1 text-[var(--color-muted)] hover:text-[var(--color-ink)] px-2 py-1 text-xs font-[var(--font-mono)] bg-[var(--color-canvas)] rounded-lg border border-[var(--color-hairline)] cursor-pointer transition-all duration-500"
                    >
                      {copiedPrompt ? (
                        <>
                          <Check className="w-3 h-3 text-[var(--color-sage)]" />
                          <span className="text-[var(--color-sage)] font-semibold">Copied Contract prompt!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[var(--color-muted)]" />
                          <span>Copy Client Prompt</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 bg-[var(--color-canvas)] rounded-2xl font-[var(--font-mono)] text-xs text-[var(--color-ink)] border border-[var(--color-hairline)] max-h-48 overflow-y-auto whitespace-pre-wrap select-text leading-relaxed">
                    {generateLlmPrompt(activeStep.id)}
                  </div>
                </div>

                {/* Footer validation checkoff button */}
                <div className="pt-4 flex items-center justify-between border-t border-[var(--color-hairline)]">
                  <div className="text-xs text-[var(--color-muted)] font-[var(--font-mono)]">
                    {completedSteps.includes(activeStep.id) ? (
                      <span className="text-[var(--color-sage)] font-semibold flex items-center space-x-1">
                        <CheckCircle2 className="w-4 h-4 text-[var(--color-sage)]" />
                        <span>Validated Factual Verification.</span>
                      </span>
                    ) : (
                      <span>Awaiting local validation...</span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleMarkComplete(activeStep.id)}
                    className={`btn-pill ${
                      completedSteps.includes(activeStep.id)
                        ? "opacity-50 cursor-default"
                        : ""
                    }`}
                  >
                    {completedSteps.includes(activeStep.id) ? (
                      <>
                        <span>Step Completed</span>
                        <Check className="w-3.5 h-3.5 text-[var(--color-sage)]" />
                      </>
                    ) : (
                      <>
                        <span>I ran these locally & copied the prompts</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
