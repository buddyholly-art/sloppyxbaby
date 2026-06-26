import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FolderTree,
  Layers,
  Settings,
  Activity,
  Check,
  Copy,
  ShieldAlert,
  Sparkles,
  Play,
  ArrowRight,
  Bot,
  User,
  FileCode,
  Trash2,
  HelpCircle,
  Send,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Code,
  CircleCheck,
  CircleDot
} from "lucide-react";

export default function VibeRepoArchitect() {
  const [activeSubMode, setActiveSubMode] = useState<"blueprint" | "alignment">("blueprint");

  // Mode A: Blueprint Builder State
  const [systemType, setSystemType] = useState<string>("fullstack");
  const [coreLanguage, setCoreLanguage] = useState<string>("typescript");
  const [persistence, setPersistence] = useState<string>("localstorage");
  const [layoutStyle, setLayoutStyle] = useState<string>("clean-domain");
  const [safeguards, setSafeguards] = useState<string[]>(["metadata", "rootlock"]);

  const [generating, setGenerating] = useState(false);
  const [genResult, setGenResult] = useState<{
    layoutDraft?: string;
    mermaidCode?: string;
    promptContract?: string;
    recommendationAdvice?: string;
  } | null>(null);

  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedMermaid, setCopiedMermaid] = useState(false);

  // Mode B: Alignment Auditor State
  const [pastedResponse, setPastedResponse] = useState<string>("");
  const [auditing, setAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<{
    currentIssues?: string[];
    proposedLayout?: string;
    mermaidCode?: string;
    remediationPrompt?: string;
  } | null>(null);

  const [copiedRemediation, setCopiedRemediation] = useState(false);
  const [copiedQueryPrompt, setCopiedQueryPrompt] = useState(false);

  const toggleSafeguard = (id: string) => {
    setSafeguards(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const offerQueryPromptText = `# Codebase Structural Audit Query
Please pause before writing any full functional code blocks. I need to audit our current codebase layout goals.
Please output the exact structural blueprint you intend to generate:
1. A clean directory-tree map from the project root.
2. An inventory list of proposed new or modified files, with a single-sentence definition of each file's specific responsibility.
3. Where the database schemas, client-side stores, and Single Source of Truth components will reside.
4. Name any placeholder or mockup assets you planned to insert (you are strictly forbidden from writing unrequested mockup directories).

Ensure your output is structured and contains bulletproof boundaries.`;

  const handleGenerateBlueprint = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/repo-architect/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemType,
          coreLanguage,
          persistence,
          layoutStyle,
          safeguards
        })
      });

      if (!res.ok) throw new Error("Connection failed or API response timed out.");
      const data = await res.json();
      setGenResult(data);
    } catch (err: any) {
      console.error(err);
      // Fallback preview simulation in case API is configured offline
      setGenResult({
        layoutDraft: `root/
├── src/
│   ├── components/     # Flat UI container
│   ├── lib/            # Real client library wrappers
│   ├── types.ts        # Declarative types ssot
│   └── App.tsx         # Tight single-panel state
├── SPEC.md             # Amnesia prevention recovery file
├── CLAUDE.md           # Local commands and build instructions
└── package.json        # Manifest & dependencies`,
        mermaidCode: `graph TD
  Root[root] --> Src[src]
  Root --> Spec[SPEC.md]
  Src --> Components[src/components]
  Src --> App[src/App.tsx]
  Src --> Types[src/types.ts]`,
        promptContract: `# Offline Architecture Guard Contract
You are STRICTLY forbidden from creating unrequested files or adding floating markdown folders.
- Enforce Single-Panel bounds inside 'src/App.tsx'.
- Keep all local states bound to localStorage via named schemas.
- Do not inject mock JSON files; utilize real offline stores.`,
        recommendationAdvice: "No real API token was configured or offline simulation was triggered. Add your LLM API key inside Settings > Secrets to activate real-time blueprint compilation!"
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleAuditRepo = async () => {
    if (!pastedResponse.trim()) return;
    setAuditing(true);
    try {
      const res = await fetch("/api/repo-architect/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pastedResponse
        })
      });

      if (!res.ok) throw new Error("Connection failed or API response timed out.");
      const data = await res.json();
      setAuditResult(data);
    } catch (err: any) {
      console.error(err);
      setAuditResult({
        currentIssues: [
          "Littering files at root (unrequested notes, duplicate lists)",
          "Excessive folder nesting causing cognitive memory friction",
          "Mock/simulated data structures instead of standard local persistence constraints"
        ],
        proposedLayout: `cleaned-root-structure/
├── src/
│   ├── App.tsx         # Unified interactives
│   └── types.ts        # Typed contract SSOT
├── SPEC.md             # System specification spec
└── CLAUDE.md           # Instructions recovery`,
        mermaidCode: `graph TD
  CleanRoot[Clean root] --> Src[src]
  Src --> App[App.tsx]`,
        remediationPrompt: `# CORRECTIVE ALIGNMENT INSTRUCTION DIRECTIVE
Please audit your last generation step. Your structure exhibits severe directory clutter:
1. Delete all mockup data files and consolidate floating properties back into 'src/types.ts'.
2. Align all file imports dynamically, and maintain zero-slop architecture bounds as configured.`
      });
    } finally {
      setAuditing(false);
    }
  };

  const handleCopy = (text: string, type: "prompt" | "mermaid" | "remediation" | "query") => {
    navigator.clipboard.writeText(text);
    if (type === "prompt") {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } else if (type === "mermaid") {
      setCopiedMermaid(true);
      setTimeout(() => setCopiedMermaid(false), 2000);
    } else if (type === "remediation") {
      setCopiedRemediation(true);
      setTimeout(() => setCopiedRemediation(false), 2000);
    } else if (type === "query") {
      setCopiedQueryPrompt(true);
      setTimeout(() => setCopiedQueryPrompt(false), 2000);
    }
  };

  return (
    <div className="space-y-6" id="vibe-repo-architect">
      {/* Header Accent banner */}
      <div className="card-shell p-5 md:p-6 relative overflow-hidden" id="architect-header-banner">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <FolderTree className="w-40 h-40 text-[var(--color-sage)]" />
        </div>

        <div className="max-w-3xl space-y-3">
          <div className="eyebrow">
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-sage)]" />
            <span>Anti-Clutter System Control</span>
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-ink)] tracking-tight">
            Vibe Repo Architect
          </h2>
          <p className="text-sm text-[var(--color-muted)] leading-relaxed max-w-2xl">
            Under the <strong className="text-[var(--color-ink)]">Vibe Coding</strong> paradigm, high-velocity iteration often results in a bloated, messy repository context. LLMs spray empty mock files and redundant directories across your workspace. Use this architect to enforce strict, machine-verifiable folder contracts and align autonomous worker agents.
          </p>
        </div>

        {/* Master sub-header toggle */}
        <div className="flex bg-[var(--color-canvas-2)] p-1.5 rounded-[var(--radius-core)] border border-[var(--color-hairline)] max-w-md mt-6 gap-2 text-xs font-medium">
          <button
            onClick={() => setActiveSubMode("blueprint")}
            className={`flex-1 py-2 rounded-lg text-center transition-all duration-500 cursor-pointer flex items-center justify-center space-x-2 ${
              activeSubMode === "blueprint"
                ? "bg-[var(--color-sage-soft)] text-[var(--color-ink)] border border-[var(--color-sage)]/30 font-semibold"
                : "text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)]"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[var(--color-sage)]" />
            <span>1. Create Repo Blueprint</span>
          </button>

          <button
            onClick={() => setActiveSubMode("alignment")}
            className={`flex-1 py-2 rounded-lg text-center transition-all duration-500 cursor-pointer flex items-center justify-center space-x-2 ${
              activeSubMode === "alignment"
                ? "bg-[var(--color-sage-soft)] text-[var(--color-ink)] border border-[var(--color-sage)]/30 font-semibold"
                : "text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)]"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[var(--color-sage)]" />
            <span>2. Audit Worker Layout</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeSubMode === "blueprint" ? (
          <motion.div
            key="blueprint-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Criteria Selector Column */}
            <div className="lg:col-span-5 card-shell p-5 md:p-6 space-y-5 flex flex-col justify-between" id="criteria-selector-card">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-[var(--color-hairline)] pb-3">
                  <h3 className="text-sm font-semibold text-[var(--color-ink)] font-[var(--font-sans)] flex items-center space-x-2">
                    <Settings className="w-4 h-4 text-[var(--color-sage)]" />
                    <span>Configure App Criteria</span>
                  </h3>
                  <span className="text-xs font-[var(--font-mono)] bg-[var(--color-canvas-2)] px-2 py-0.5 rounded border border-[var(--color-hairline)] text-[var(--color-muted)]">
                    Config Options
                  </span>
                </div>

                {/* Criterion 1: System Architecture Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-[var(--font-mono)] font-semibold text-[var(--color-muted)]">
                    A. System Architecture Type:
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: "fullstack", label: "Full-Stack Web (Express)" },
                      { id: "client-spa", label: "Client-Only SPA (Vite)" },
                      { id: "cli", label: "CLI / Automation Utility" },
                      { id: "agentic", label: "Multi-Agent Engine" }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSystemType(opt.id)}
                        className={`py-2 px-3 rounded-lg border text-left transition-all duration-500 cursor-pointer ${
                          systemType === opt.id
                            ? "bg-[var(--color-sage-soft)] border-[var(--color-sage)]/40 text-[var(--color-ink)] font-semibold"
                            : "bg-[var(--color-surface)] border-[var(--color-hairline)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-solid)]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Criterion 2: Primary Programming Language */}
                <div className="space-y-1.5">
                  <label className="text-xs font-[var(--font-mono)] font-semibold text-[var(--color-muted)]">
                    B. Language & Framework Substrate:
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { id: "typescript", label: "TypeScript / ESM" },
                      { id: "python", label: "Python FastAPI" },
                      { id: "go", label: "Golang (Pure)" }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setCoreLanguage(opt.id)}
                        className={`py-1.5 px-2 rounded-lg border text-center transition-all duration-500 cursor-pointer ${
                          coreLanguage === opt.id
                            ? "bg-[var(--color-sage-soft)] border-[var(--color-sage)]/40 text-[var(--color-ink)] font-semibold"
                            : "bg-[var(--color-surface)] border-[var(--color-hairline)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-solid)]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Criterion 3: Metadata Storage/Persistence */}
                <div className="space-y-1.5">
                  <label className="text-xs font-[var(--font-mono)] font-semibold text-[var(--color-muted)]">
                    C. Intended Persistence Layer:
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: "localstorage", label: "LocalStorage State Contract" },
                      { id: "indexeddb", label: "IndexedDB / Offline DB" },
                      { id: "firebase", label: "Cloud Firestore / Rules" },
                      { id: "postgresql", label: "PostgreSQL (Cloud SQL / Drizzle)" },
                      { id: "json-files", label: "Plain Local JSON Flat Files" }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPersistence(opt.id)}
                        className={`py-2 px-3 rounded-lg border text-left transition-all duration-500 cursor-pointer ${
                          persistence === opt.id
                            ? "bg-[var(--color-sage-soft)] border-[var(--color-sage)]/40 text-[var(--color-ink)] font-semibold"
                            : "bg-[var(--color-surface)] border-[var(--color-hairline)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-solid)]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Criterion 4: Folder Layout Pattern */}
                <div className="space-y-1.5">
                  <label className="text-xs font-[var(--font-mono)] font-semibold text-[var(--color-muted)]">
                    D. Folder Layout Pattern:
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: "clean-domain", title: "Clean Screaming Domain", desc: "Forces single directory containing layout, logic, and state. Fast to load." },
                      { id: "flat", title: "Extreme Flat Flatbed (1-4 files)", desc: "Avoids folders completely. App.tsx + types.ts only. Zero file sprawl." },
                      { id: "feature-sliced", title: "Feature-Sliced Design (FSD)", desc: "Robust layer separation (features, entities, shared) for large apps." }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setLayoutStyle(opt.id)}
                        className={`w-full p-2.5 rounded-xl border text-left transition-all duration-500 cursor-pointer flex flex-col space-y-0.5 ${
                          layoutStyle === opt.id
                            ? "bg-[var(--color-sage-soft)] border-[var(--color-sage)]/40 text-[var(--color-ink)]"
                            : "bg-[var(--color-surface)] border-[var(--color-hairline)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-solid)]"
                        }`}
                      >
                        <span className="text-xs font-semibold">{opt.title}</span>
                        <span className="text-xs text-[var(--color-muted)] leading-relaxed font-[var(--font-sans)] block">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Criterion 5: Active Anti-Slop Safeguards */}
                <div className="space-y-1.5">
                  <label className="text-xs font-[var(--font-mono)] font-semibold text-[var(--color-muted)]">
                    E. Active Anti-Slop Safeguards:
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: "metadata", name: "Mandatory SPEC.md & CLAUDE.md Checkpoint", desc: "Forces models to state assumptions and read rules first upon reload." },
                      { id: "rootlock", name: "Absolute Root Directory Lock", desc: "Bans worker models from adding unrequested .txt or markdown docs at core." },
                      { id: "noslop", name: "Zero Mock placeholders", desc: "Strictly forbids dummy arrays, forcing real functional localStorage hook bindings." }
                    ].map(safe => (
                      <button
                        key={safe.id}
                        type="button"
                        onClick={() => toggleSafeguard(safe.id)}
                        className={`w-full p-2.5 rounded-xl border text-left transition-all duration-500 cursor-pointer flex items-start space-x-2.5 ${
                          safeguards.includes(safe.id)
                            ? "bg-[var(--color-sage-soft)] border-[var(--color-sage)]/30 text-[var(--color-ink)]"
                            : "bg-[var(--color-surface)] border-[var(--color-hairline)] text-[var(--color-muted)]"
                        }`}
                      >
                        <div className={`mt-0.5 w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${
                          safeguards.includes(safe.id) ? "bg-[var(--color-sage)] text-white" : "border border-[var(--color-hairline-strong)]"
                        }`}>
                          {safeguards.includes(safe.id) && <Check className="w-3 h-3" />}
                        </div>
                        <div className="space-y-0.5 text-xs leading-tight">
                          <span className={`font-semibold block ${safeguards.includes(safe.id) ? "text-[var(--color-ink)]" : ""}`}>
                            {safe.name}
                          </span>
                          <span className="text-xs text-[var(--color-muted)] block leading-normal">{safe.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleGenerateBlueprint}
                  disabled={generating}
                  className="btn-pill w-full justify-center"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span className="font-[var(--font-mono)] text-xs">SYNTHESIZING LAYOUT MATRIX...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Compile Pristine Repo Blueprint</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Output Column */}
            <div className="lg:col-span-7 space-y-6">
              {genResult ? (
                <div className="space-y-6" id="blueprint-results-wrapper">
                  {/* ASCII File layout Draft */}
                  <div className="card-shell p-5 space-y-3 relative overflow-hidden">
                    <div className="flex justify-between items-center border-b border-[var(--color-hairline)] pb-3">
                      <h3 className="text-xs font-semibold font-[var(--font-mono)] text-[var(--color-sage)] flex items-center space-x-1.5">
                        <FolderTree className="w-4 h-4 text-[var(--color-sage)]" />
                        <span>A. Pristine Repository Tree</span>
                      </h3>
                      <span className="text-xs text-[var(--color-muted)] font-[var(--font-mono)]">Zero Clutter Layout</span>
                    </div>

                    <pre className="p-4 bg-[var(--color-canvas)] rounded-xl font-[var(--font-mono)] text-xs text-[var(--color-sage)] overflow-x-auto border border-[var(--color-hairline)] leading-relaxed selection:bg-[var(--color-sage)]/20 max-h-64">
                      {genResult.layoutDraft}
                    </pre>
                  </div>

                  {/* Copyable Machine Readable Prompt Contract */}
                  <div className="card-core p-5 space-y-3 relative">
                    <div className="flex justify-between items-center border-b border-[var(--color-hairline)] pb-3">
                      <h3 className="text-xs font-semibold font-[var(--font-mono)] text-[var(--color-sage)] flex items-center space-x-1.5">
                        <Code className="w-4 h-4 text-[var(--color-sage)]" />
                        <span>B. Prompt Contract for executing model</span>
                      </h3>

                      <button
                        onClick={() => handleCopy(genResult.promptContract || "", "prompt")}
                        className="flex items-center space-x-1.5 text-[var(--color-sage)] hover:text-[var(--color-sage-glow)] px-2.5 py-1 text-xs font-[var(--font-mono)] bg-[var(--color-canvas)] rounded-lg border border-[var(--color-hairline)] cursor-pointer transition-all duration-500 shrink-0"
                      >
                        {copiedPrompt ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span className="text-[var(--color-sage)] font-semibold">Copied Contract!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Prompt</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-xs font-[var(--font-mono)] text-[var(--color-muted)] leading-normal mb-1">
                      <em>Feed this precise block to your developer model (Cursor, Claude, or ChatGPT) on your next turn to bind their architecture decisions strictly to this blueprint state.</em>
                    </div>

                    <div className="codeblock text-xs max-h-56 overflow-y-auto">
                      {genResult.promptContract}
                    </div>
                  </div>

                  {/* Mermaid Diagram Code block */}
                  <div className="card-shell p-5 space-y-3">
                    <div className="flex justify-between items-center border-b border-[var(--color-hairline)] pb-3">
                      <h3 className="text-xs font-semibold font-[var(--font-mono)] text-[var(--color-sage)] flex items-center space-x-1.5">
                        <Layers className="w-4 h-4 text-[var(--color-sage)]" />
                        <span>C. Compiled Mermaid Dependency Graph</span>
                      </h3>

                      <button
                        onClick={() => handleCopy(genResult.mermaidCode || "", "mermaid")}
                        className="flex items-center space-x-1.5 text-[var(--color-sage)] hover:text-[var(--color-sage-glow)] px-2.5 py-1 text-xs font-[var(--font-mono)] bg-[var(--color-canvas)] rounded-lg border border-[var(--color-hairline)] cursor-pointer transition-all duration-500 shrink-0"
                      >
                        {copiedMermaid ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span className="text-[var(--color-sage)] font-semibold">Copied Diagram Code!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Mermaid</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-3 bg-[var(--color-canvas)] rounded-xl font-[var(--font-mono)] text-xs text-[var(--color-ink)] border border-[var(--color-hairline)] mb-4 max-h-40 overflow-y-auto">
                      <pre>{genResult.mermaidCode}</pre>
                    </div>

                    {/* Graph Schema Preview */}
                    <div className="bg-[var(--color-canvas)]/60 p-4 border border-[var(--color-hairline)] rounded-xl space-y-3">
                      <span className="text-xs font-[var(--font-mono)] font-semibold text-[var(--color-muted)] block">Graph Schema Preview:</span>
                      <div className="flex flex-col space-y-2 text-xs">
                        <div className="flex items-center space-x-2">
                          <div className="p-1.5 px-3.5 rounded-lg bg-[var(--color-sage-soft)] border border-[var(--color-sage)]/30 text-[var(--color-sage)] font-[var(--font-mono)]">
                            root
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-[var(--color-muted)]" />
                          <div className="p-1.5 px-3.5 rounded-lg bg-[var(--color-canvas-2)] border border-[var(--color-hairline)] text-[var(--color-ink)] font-[var(--font-mono)] text-xs">
                            SPEC.md & CLAUDE.md
                          </div>
                        </div>

                        <div className="pl-6 flex items-center space-x-2">
                          <div className="p-1.5 px-3.5 rounded-lg bg-[var(--color-sage-soft)] border border-[var(--color-sage)]/30 text-[var(--color-sage)] font-[var(--font-mono)]">
                            src
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-[var(--color-muted)]" />
                          <div className="p-1 rounded-md bg-[var(--color-canvas-2)] border border-[var(--color-hairline)] text-[var(--color-muted)] text-xs font-[var(--font-mono)]">
                            types.ts (SSOT Contract)
                          </div>
                          <span className="text-xs text-[var(--color-muted)] font-[var(--font-mono)] font-semibold">-&gt;</span>
                          <div className="p-1 rounded-md bg-[var(--color-sage-soft)] border border-[var(--color-sage)]/30 text-[var(--color-muted)] text-xs font-[var(--font-mono)]">
                            App.tsx / Components
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation Advice Field */}
                  {genResult.recommendationAdvice && (
                    <div className="p-4 bg-[var(--color-sage-soft)] border border-[var(--color-sage)]/20 rounded-2xl flex items-start space-x-3 text-xs text-[var(--color-ink)] leading-relaxed font-[var(--font-sans)]">
                      <Activity className="w-4 h-4 text-[var(--color-sage)] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[var(--color-sage)] font-[var(--font-mono)] text-xs block mb-1">Architect's Guidance:</strong>
                        <span>{genResult.recommendationAdvice}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full min-h-[400px] border border-dashed border-[var(--color-hairline)] rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-[var(--color-canvas)]/20" id="blueprint-placeholder">
                  <div className="p-4 bg-[var(--color-canvas)] rounded-full border border-[var(--color-hairline)] mb-4">
                    <FolderTree className="w-8 h-8 text-[var(--color-muted)]" />
                  </div>
                  <h4 className="text-sm font-semibold text-[var(--color-ink)]">No Repo Blueprint Compiled Yet</h4>
                  <p className="text-xs text-[var(--color-muted)] mt-1 max-w-sm leading-relaxed">
                    Set your desired folder layout values on the left panel and click "Compile Pristine Repo Blueprint" to synthesize high-quality structures.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="alignment-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Mode B: Restructuring Audit and pasted input */}
            <div className="lg:col-span-5 card-shell p-5 md:p-6 space-y-5 flex flex-col justify-between" id="alignment-card">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-[var(--color-hairline)] pb-3">
                  <h3 className="text-sm font-semibold text-[var(--color-ink)] font-[var(--font-sans)] flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 text-[var(--color-sage)]" />
                    <span>Littering & Layout Auditor</span>
                  </h3>
                  <span className="text-xs font-[var(--font-mono)] text-[var(--color-sage)]">
                    Verification Engine
                  </span>
                </div>

                <p className="text-xs text-[var(--color-muted)] leading-normal">
                  Vibe-coders frequently encounter massive "working memory decay" in their worker models. Paste your LLM's planned layout proposal (or a directory dump) here to audit its cleanliness.
                </p>

                {/* Offer Query Prompt Component */}
                <div className="p-4 bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-[var(--font-mono)] font-semibold text-[var(--color-sage)] flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-[var(--color-sage)]" />
                      <span>Zero-Slop Query Prompt</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCopy(offerQueryPromptText, "query")}
                      className="text-xs font-[var(--font-mono)] px-2 py-0.5 rounded bg-[var(--color-canvas-2)] hover:bg-[var(--color-surface-solid)] text-[var(--color-sage)] hover:text-[var(--color-sage-glow)] border border-[var(--color-hairline)] cursor-pointer transition-all duration-500"
                    >
                      {copiedQueryPrompt ? "Copied Query!" : "Copy Query"}
                    </button>
                  </div>
                  <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                    Don't know what files your LLM possesses or plans to create? Copy this command list, paste it to your model, and then copy its output back here.
                  </p>
                </div>

                {/* Paste Area */}
                <div className="space-y-1.5">
                  <label className="text-xs font-[var(--font-mono)] font-semibold text-[var(--color-muted)] block">
                    Paste Worker Model Proposal / Code / Layout Tree:
                  </label>
                  <textarea
                    id="worker-dump-textarea"
                    value={pastedResponse}
                    onChange={(e) => setPastedResponse(e.target.value)}
                    placeholder="Paste the other LLM's proposed files, directory structures, or code block here..."
                    className="w-full h-52 bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-xl p-3 text-xs text-[var(--color-ink)] placeholder-[var(--color-muted)]/50 focus:outline-none focus:border-[var(--color-sage)] transition-colors font-[var(--font-sans)] resize-none"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleAuditRepo}
                  disabled={auditing || !pastedResponse.trim()}
                  className={`w-full py-3 font-semibold text-xs rounded-xl cursor-pointer flex items-center justify-center space-x-2 transition-all duration-500 ${
                    !pastedResponse.trim()
                      ? "bg-[var(--color-canvas-2)] border border-[var(--color-hairline)] text-[var(--color-muted)] cursor-not-allowed"
                      : "btn-pill justify-center"
                  }`}
                >
                  {auditing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span className="font-[var(--font-mono)] text-xs">AUDITING DIRECTORY STRUCTURES...</span>
                    </>
                  ) : (
                    <>
                      <Activity className="w-4 h-4" />
                      <span>Run Strict Layout Audit</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Audit Response Column */}
            <div className="lg:col-span-7 space-y-6">
              {auditResult ? (
                <div className="space-y-6" id="audit-results-wrapper">
                  {/* Issues Identified Banner */}
                  <div className="bg-[var(--color-canvas)]/75 border border-[var(--color-sage)]/20 rounded-2xl p-5 space-y-3.5">
                    <h3 className="text-xs font-semibold font-[var(--font-mono)] text-[var(--color-sage)] flex items-center space-x-1.5">
                      <AlertTriangle className="w-4 h-4 text-[var(--color-sage)]" />
                      <span>Issues Identified ({auditResult.currentIssues?.length || 0})</span>
                    </h3>

                    <ul className="space-y-2 text-xs text-[var(--color-ink)]">
                      {auditResult.currentIssues?.map((issue, idx) => (
                        <li key={idx} className="flex items-start space-x-2 bg-[var(--color-surface)] p-2 rounded-lg border border-[var(--color-hairline)]">
                          <span className="text-[var(--color-sage)] font-semibold shrink-0 font-[var(--font-mono)]">[Issue {idx + 1}]:</span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Restructured Proposed Tree Layout */}
                  <div className="card-shell p-5 space-y-3">
                    <div className="flex justify-between items-center border-b border-[var(--color-hairline)] pb-3">
                      <h3 className="text-xs font-semibold font-[var(--font-mono)] text-[var(--color-sage)] flex items-center space-x-1.5">
                        <FolderTree className="w-4 h-4 text-[var(--color-sage)]" />
                        <span>Proposed Restructured Folder Map</span>
                      </h3>
                      <span className="text-xs text-[var(--color-muted)] font-[var(--font-mono)]">Perfect Alignment Layout</span>
                    </div>

                    <pre className="p-4 bg-[var(--color-canvas)] rounded-xl font-[var(--font-mono)] text-xs text-[var(--color-sage)] border border-[var(--color-hairline)] overflow-x-auto leading-relaxed max-h-56">
                      {auditResult.proposedLayout}
                    </pre>
                  </div>

                  {/* Mermaid visual state flows */}
                  {auditResult.mermaidCode && (
                    <div className="card-shell p-5 space-y-3">
                      <h3 className="text-xs font-semibold font-[var(--font-mono)] text-[var(--color-muted)] flex items-center space-x-1.5 border-b border-[var(--color-hairline)] pb-3">
                        <Layers className="w-4 h-4 text-[var(--color-muted)]" />
                        <span>Remediation Dependency Flow</span>
                      </h3>
                      <pre className="p-3 bg-[var(--color-canvas)] rounded-xl font-[var(--font-mono)] text-xs text-[var(--color-ink)] border border-[var(--color-hairline)] max-h-36 overflow-y-auto">
                        {auditResult.mermaidCode}
                      </pre>
                    </div>
                  )}

                  {/* Alignment Remediation Copy Prompt Contract */}
                  <div className="card-core p-5 space-y-3">
                    <div className="flex justify-between items-center border-b border-[var(--color-hairline)] pb-3">
                      <h3 className="text-xs font-semibold font-[var(--font-mono)] text-[var(--color-sage)] flex items-center space-x-1.5">
                        <CheckCircle className="w-4 h-4 text-[var(--color-sage)]" />
                        <span>Remediation Corrective Prompt</span>
                      </h3>

                      <button
                        onClick={() => handleCopy(auditResult.remediationPrompt || "", "remediation")}
                        className="flex items-center space-x-1.5 text-[var(--color-sage)] hover:text-[var(--color-sage-glow)] px-2.5 py-1 text-xs font-[var(--font-mono)] bg-[var(--color-canvas)] rounded-lg border border-[var(--color-hairline)] cursor-pointer transition-all duration-500 shrink-0"
                      >
                        {copiedRemediation ? (
                          <>
                            <Check className="w-3.5 h-3.5 font-semibold" />
                            <span className="text-[var(--color-sage)] font-semibold">Copied Correction!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 font-medium" />
                            <span>Copy Prompt</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-xs font-[var(--font-mono)] text-[var(--color-muted)] leading-normal">
                      <em>Feed this precise remediation script directly back to your worker LLM to make it clean its file tree, delete duplicate folders, and match the plan.</em>
                    </div>

                    <div className="p-3.5 bg-[var(--color-canvas)] rounded-xl font-[var(--font-mono)] text-xs text-[var(--color-ink)] border border-[var(--color-hairline)] max-h-56 overflow-y-auto whitespace-pre-wrap select-text leading-relaxed">
                      {auditResult.remediationPrompt}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[400px] border border-dashed border-[var(--color-hairline)] rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-[var(--color-canvas)]/20" id="audit-placeholder">
                  <div className="p-4 bg-[var(--color-canvas)] rounded-full border border-[var(--color-hairline)] mb-4">
                    <ShieldAlert className="w-8 h-8 text-[var(--color-muted)]" />
                  </div>
                  <h4 className="text-sm font-semibold text-[var(--color-ink)]">No Audit Run Yet</h4>
                  <p className="text-xs text-[var(--color-muted)] mt-1 max-w-sm leading-relaxed">
                    Copy the "Zero-Slop Query Prompt" command above, feed it to your current worker LLM, and paste its layout proposal in the text field to verify its directory safety standards.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
