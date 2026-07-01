import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SkeletonViewer from "./SkeletonViewer";
import RefinementLoop from "./RefinementLoop";
import MemoryManager from "./MemoryManager";
import ImpulsivityShield from "./ImpulsivityShield";
import GravitasBoard from "./GravitasBoard";
import SloppyPromptTour from "./SloppyPromptTour";
import { buildCognitiveCompileContext } from "../lib/demoPromptAudit";
import type { DemoPromptScenario } from "../lib/demoPromptScenarios";
import {
  Sparkles, Loader2, Copy, Check, FileText, ShieldAlert, BadgeHelp, Play, History, ArrowRight, Bot, RefreshCw, Database, Award, ShieldCheck, HelpCircle, MessageSquare, User, Activity, Send, Undo, Redo, FolderTree, Brain, Lightbulb, Target, Folder, Layers, Zap, Globe, HardDrive, Building2, ClipboardList, BookOpen, Wrench, Code, Package, Cloud, Clock, Lock, Ruler, Puzzle, AlertTriangle, Shield, Crown, Scroll, Sprout, Rocket, FlaskConical, BarChart3, Pin, Settings, Search, Pencil, Monitor, GraduationCap, X, CheckCircle2, Circle, ArrowDown, Sparkle, TrendingUp, Bookmark, KeyRound, Server, XCircle, ChevronRight
} from "lucide-react";
import { OptimizedPromptResult, PromptHistoryItem } from "../lib/types";
import { getAccessToken, findOrCreateAppFolder, uploadPromptFile } from "../lib/googleDrive";
import { SkillSpectorEngine } from "../lib/skillSpectorEngine";

const STARTER_SCENARIOS = [
  {
    title: "Select interactive prompt scenario to start...",
    intentText: "",
    techStack: "Full-Stack Express + Node (CJS Bundler)",
    persistence: "Relational Cloud SQL Schema (Drizzle PostgreSQL)",
    persona: "TypeScript & React Software Architect",
    format: "Beautiful Markdown with Section Flags (e.g., ###)",
    reasoning: "Double-Pass / Multi-Step reasoning chain inside <thought> block",
    boundaries: ["strict_no_mock_data", "lazy_init_secret_keys", "single_view_constraint", "lucide_icons_only"]
  },
  {
    title: "1. Bulletproof ADHD Habit Calendar Tracker (High Alignment)",
    intentText: "I want an ADHD-friendly habit calendar tracker with visual daily boards. It must have zero distracting clutter on the outer margins, persistent streak tallies saved securely in client caching, and calm slate colors.",
    techStack: "React + Tailwind SPA (Client Only)",
    persistence: "localStorage Offline Cache",
    persona: "TypeScript & React Software Architect",
    format: "Beautiful Markdown with Section Flags (e.g., ###)",
    reasoning: "Strict Double-Pass reasoning chain with <thought> constraints",
    boundaries: ["strict_no_mock_data", "single_view_constraint", "lucide_icons_only"]
  },
  {
    title: "2. Low-Pressure Mindful Micro-Notebook (Cloud Sync)",
    intentText: "A visual, relaxing micro-notebook journaling workspace designed for lightweight entries. Must prevent double-saving, support folder classification indexes, and run background SQL verification schema checks.",
    techStack: "Full-Stack Express + Node (CJS Bundler)",
    persistence: "Relational Cloud SQL Schema (Drizzle PostgreSQL)",
    persona: "Clinical Cognitive Systems Architect",
    format: "Strict YAML Blueprint Structure",
    reasoning: "Double-Pass / Multi-Step reasoning chain inside <thought> block",
    boundaries: ["strict_no_mock_data", "lazy_init_secret_keys", "lucide_icons_only"]
  },
  {
    title: "3. Micro-Relational seed/migration command line helper",
    intentText: "A developer CLI database seeder that automatically compiles standard PostgreSQL schemas and validates connection pools dynamically on startup behind port 3000.",
    techStack: "Full-Stack Express + Node (CJS Bundler)",
    persistence: "Relational Cloud SQL Schema (Drizzle PostgreSQL)",
    persona: "Devops Systems & SQL Expert",
    format: "Factual Raw Structured Markdown Report",
    reasoning: "Double-Pass / Multi-Step reasoning chain inside <thought> block",
    boundaries: ["strict_no_mock_data", "lazy_init_secret_keys", "lucide_icons_only"]
  }
];

function evaluatePromptEngineeringMetrics(promptText: string) {
  const text = (promptText || "").toLowerCase();

  // 1. Persona Contextualizer: "you are", "role", "persona", "expert", "as a", "specialist"
  const hasPersona = /you are|role|persona|expert|as a|specialist|architect|analyst|engineer/i.test(text);
  const personaScore = hasPersona ? 95 : 20;

  // 2. Chain-of-Thought (CoT): "think", "reason", "step", "thought", "explain", "why", "phase"
  const hasCoT = /think|reason|step|thought|explain|why|phase|archaeology|analysis|audit/i.test(text);
  const cotScore = hasCoT ? 100 : 25;

  // 3. Few-Shot Demonstration: "example", "e.g.", "reference", "input:", "output:", "spec:"
  const hasFewShot = /example|e\.g\.|reference|input:|output:|spec:|sample|template|preview/i.test(text);
  const fewShotScore = hasFewShot ? 90 : 30;

  // 4. Boundary Guarding & Safety: "avoid", "do not", "prevent", "limit", "restrict", "never", "only", "must not"
  const hasGuarding = /avoid|do not|prevent|limit|restrict|never|only|must not|forbidden|criteria|reject/i.test(text);
  const guardingScore = hasGuarding ? 95 : 35;

  // 5. Output Strictness: "json", "schema", "structure", "format", "markdown", "xml", "syntax"
  const hasOutput = /json|schema|structure|format|markdown|xml|syntax|envelope|output/i.test(text);
  const outputScore = hasOutput ? 95 : 40;

  const overall = Math.round((personaScore + cotScore + fewShotScore + guardingScore + outputScore) / 5);

  return {
    personaScore,
    cotScore,
    fewShotScore,
    guardingScore,
    outputScore,
    overall
  };
}

function evaluateInputQuality(
  prompt: string,
  survey: {
    persona: string;
    personaCustom: string;
    format: string;
    formatCustom: string;
    reasoning: string;
    boundaries: string[];
    dynamic: string;
    techStack: string;
    persistence: string;
  }
) {
  const text = prompt || "";
  const trimmed = text.trim();

  // 1. Specificity (0 to 100)
  let wordScore = 0;
  if (trimmed) {
    const wordCount = trimmed.split(/\s+/).length;
    if (wordCount > 60) wordScore = 25;
    else if (wordCount > 30) wordScore = 15;
    else if (wordCount > 12) wordScore = 10;
    else wordScore = 5;
  }

  let techScore = 0;
  if (trimmed) {
    const techRegex = /\b(react|typescript|python|node|db|database|postgre|sql|jwt|auth|api|service|ui|tailwind|css|html|express|route|vite|local|socket|canvas|chart|graph|d3|recharts|vector|obsidian|drive|firestore|firebase|google|duckdb|wasm)\b/gi;
    const techMatches = trimmed.match(techRegex) || [];
    const uniqueTech = new Set(techMatches.map(t => t.toLowerCase()));
    techScore = Math.min(uniqueTech.size * 8, 25);
  }

  // Tech stack weight: 25 points
  const techStackPt = survey.techStack ? 25 : 0;
  // Database persistence weight: 25 points
  const persistencePt = survey.persistence ? 25 : 0;

  const specificity = Math.min(wordScore + techScore + techStackPt + persistencePt, 100);

  // 2. Clarity (0 to 100)
  let clarityPoints = 0;
  if (trimmed) {
    const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length >= 4) clarityPoints += 15;
    else if (sentences.length >= 2) clarityPoints += 10;
    else clarityPoints += 5;

    const hasLists = /^\s*(\d+\.|-|\*)\s+/m.test(trimmed);
    if (hasLists) clarityPoints += 15;

    const hasStructureElements = /["'`[\](){}]/g.test(trimmed);
    if (hasStructureElements) clarityPoints += 10;
  }

  // Persona contributes 20 points
  const actualPersona = survey.persona === "Custom" ? survey.personaCustom : survey.persona;
  if (actualPersona && actualPersona.trim().length > 0) {
    clarityPoints += 20;
  }

  // Format contributes 20 points
  const actualFormat = survey.format === "Custom" ? survey.formatCustom : survey.format;
  if (actualFormat && actualFormat.trim().length > 0) {
    clarityPoints += 20;
  }

  // Reasoning contributes 20 points
  if (survey.reasoning && !survey.reasoning.includes("Direct")) {
    clarityPoints += 20;
  }

  const clarity = Math.min(clarityPoints, 100);

  // 3. Instruction Constraints (0 to 100)
  let constraintScore = 0;
  if (trimmed) {
    const negativeRegex = /\b(avoid|don't|do not|never|exclude|limit|restrict|no|without|prevent|strictly|forbidden|except)\b/gi;
    const negativeMatches = trimmed.match(negativeRegex) || [];
    constraintScore += Math.min(negativeMatches.length * 10, 20);

    const requirementRegex = /\b(must|should|required|needs to|have to|must not|ensure|enforce|rule|constraint|criteria|condition)\b/gi;
    const requirementMatches = trimmed.match(requirementRegex) || [];
    constraintScore += Math.min(requirementMatches.length * 8, 20);
  }

  // Dynamic context sets 20 points
  if (survey.dynamic && !survey.dynamic.includes("None") && !survey.dynamic.includes("static")) {
    constraintScore += 20;
  }

  // Active boundary boundaries count (each worth 15 points, max 40 points)
  const boundaryCountPt = Math.min(survey.boundaries.length * 15, 40);
  constraintScore += boundaryCountPt;

  const constraints = Math.min(constraintScore, 100);

  // 4. Aggregate Score
  const overall = Math.round((specificity + clarity + constraints) / 3);

  let status = "Fragmentary";
  let color = "text-[var(--color-muted)] bg-[var(--color-canvas-2)] border-[var(--color-hairline)]";
  if (overall >= 78) {
    status = "Highly Aligned";
    color = "text-[var(--color-sage)] bg-[var(--color-sage-soft)] border-[var(--color-sage)]/20";
  } else if (overall >= 52) {
    status = "Context Competent";
    color = "text-[var(--color-sage-glow)] bg-[var(--color-sage-soft)] border-[var(--color-sage)]/15";
  } else if (overall >= 28) {
    status = "Fuzzy Scaffold";
    color = "text-amber-600 bg-amber-50 border-amber-200";
  }

  const tips: string[] = [];
  if (specificity < 65) {
    tips.push("Specify exact technology platforms (e.g., React, Express) to maximize systemic alignment.");
  }
  if (clarity < 65) {
    tips.push("Organize specifications into distinct lines, lists or bracketed clauses to reduce semantic entropy.");
  }
  if (constraints < 65) {
    tips.push("Enforce negative bounds (e.g., select multiple Boundaries) to trim compile-loop branching.");
  }
  if (tips.length === 0) {
    tips.push("Your requirements are pristine! Ready for flawless context window compilation.");
  }

  return {
    specificity,
    clarity,
    constraints,
    overall,
    status,
    color,
    tips
  };
}

interface LlmOsPromptCompilerProps {
  thinkingMode: boolean;
  setThinkingMode: (val: boolean) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  setActiveTab?: (tab: "optimizer" | "chat" | "skillspector" | "academy" | "architecture" | "risks") => void;
}

export default function LlmOsPromptCompiler({
  thinkingMode,
  setThinkingMode,
  selectedModel,
  setSelectedModel,
  setActiveTab
}: LlmOsPromptCompilerProps) {
  const [searchParams] = useSearchParams();
  const [activeSloppyScenario, setActiveSloppyScenario] = useState<DemoPromptScenario | null>(null);
  const [inputPrompt, setInputPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("");
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<"architecture" | "prompt" | "skeleton" | "loop" | "memory" | "ssot_audit">("ssot_audit");
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);
  const [isSavedToMemory, setIsSavedToMemory] = useState(false);

  // --- MULTI-TURN CONVERSATIONAL CHAT SYSTEM ---
  const [chatMode, setChatMode] = useState<"chat" | "replyPrompts">("chat");
  const [chatInput, setChatInput] = useState("");
  const [sendingChat, setSendingChat] = useState(false);

  interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    copied?: boolean;
    metaCommentary?: string;
  }

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "turn-1-u",
      role: "user",
      content: "I need to build an offline task board, but the LLM keeps suggesting mock data instead of real localStorage.",
      metaCommentary: "[Intent Diagnostic: Operator possesses specific functional targets but lacks rigorous machine boundaries, triggering the LLM's general complacency heuristics.]"
    },
    {
      id: "turn-1-a",
      role: "assistant",
      content: `Ah, standard LLM corner-cutting behavior. To bypass this, we must build a strict data contract within the instruction set. Copy the prompt block below to force local storage persistence and state preservation:

\`\`\`markdown
# Offline Task Board - Persistent State Contract
Enforce the following absolute rule invariants:
- **Amnesia Restoration Time**: 'context_reconstruction_time_seconds <= 5.0'. Upon load, read serialized JSON from 'localStorage.getItem("task_board_state")'.
- **Anti-Mock Guard**: You are STRICTLY forbidden from creating hardcoded placeholder lists or simulated datastore setups.
- **Verification**: Output real operational React hooks for local storage serialization.
\`\`\`

Let's copy the code above and feed it to your model. What feature should we audit next?`,
      metaCommentary: "[Software Alignment: Clamping the target model's output entropy by embedding mathematical assertions around local state retrieval.]"
    },
    {
      id: "turn-2-u",
      role: "user",
      content: "That worked! Now how do I prompt it to add a calm visual Pomodoro tracker without flashing sensory alarms?",
      metaCommentary: "[Intent Diagnostic: Operator intends to incorporate micro-timing feedback cycles, emphasizing clinical low-arousal accessibility constraints.]"
    },
    {
      id: "turn-2-a",
      role: "assistant",
      content: `Excellent sensory discipline. Emulating Dunn's Low Arousal model matches the Barkley self-regulation theory beautifully. Use this prompt fragment to guide its visual layout:

\`\`\`markdown
## SENSORY-FRIENDLY VISUAL INSTRUCTIONS
- All borders must be solid 1px (#1e293b). Never use colored side-stripes or high-stimulus glow accents.
- Neutral substrate surfaces must use soft slate/charcoal tones tinted toward an active brand hue (chroma: 0.008). Avoid #000 or raw neutrals.
- Zero flashing states, alerts, or emotional adjectives. The Pomodoro timer must update silently and smoothly.
\`\`\`

All outputs from our co-designer service can be easily copied using the button near the text boxes. How did the worker model handle these styling rules?`,
      metaCommentary: "[Software Alignment: Neutralizing dopamine-triggering UI cues. We enforce tinted neutral chroma values directly into tailwind parameters.]"
    },
    {
      id: "turn-3-u",
      role: "user",
      content: "What if it refuses to bundle everything in a modular single container and starts writing separate layout files?",
      metaCommentary: "[Intent Diagnostic: Operator anticipates executive-function distraction and is requesting absolute spatial containment constraints.]"
    },
    {
      id: "turn-3-a",
      role: "assistant",
      content: `Let's pressure the model's architectural tree. We will declare a Single-Screen Board restriction. Add this to its current context thread:

\`\`\`markdown
- **Single-Screen Board Bound**: Place all interactive states inside a single modular board container 'src/App.tsx'. Do not scatter modules across folders or introduce secondary routing mechanisms.
- **Architectural Honesty**: Ensure the layout pass is pristine. Avoid nested cards and complex telemetry side-bars.
\`\`\`

Now we have a solid 3-turn baseline showing how we co-design!`,
      metaCommentary: "[Software Alignment: Forcing next-action entropy to absolute zero. This forces full layout alignment in a singular viewport.]"
    }
  ]);

  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || sendingChat) return;

    const userMsgText = chatInput.trim();
    setChatInput("");
    setSendingChat(true);

    let userCommentary = "[Intent Diagnostic: Operator is iterating on contextual bounds, optimizing the target workspace parameters.]";
    const cl = userMsgText.toLowerCase();
    if (cl.includes("refuse") || cl.includes("failed") || cl.includes("error") || cl.includes("bug")) {
      userCommentary = "[Intent Diagnostic: Operator reports divergence or compilation friction. Context alignment matrix is recalibrating.]";
    } else if (cl.includes("auth") || cl.includes("secure") || cl.includes("login")) {
      userCommentary = "[Intent Diagnostic: Operator demands secure transaction layers. Injecting cryptographic and token-safety criteria.]";
    } else if (cl.includes("ui") || cl.includes("style") || cl.includes("clean") || cl.includes("color")) {
      userCommentary = "[Intent Diagnostic: Operator is refining sensory interface hierarchy and seeking aesthetic discipline.]";
    }

    const newUserMsg: ChatMessage = {
      id: `chat-${Date.now()}-u`,
      role: "user",
      content: userMsgText,
      metaCommentary: userCommentary
    };

    const updatedMessages = [...chatMessages, newUserMsg];
    setChatMessages(updatedMessages);

    try {
      const response = await fetch("/api/conversational-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          mode: chatMode,
          model: selectedModel,
          thinkingMode
        })
      });

      if (!response.ok) {
        throw new Error("Failed to reach conversational service.");
      }

      const data = await response.json();
      if (data && data.reply) {
        let assistantCommentary = "[Software Alignment: Generated co-design instruction set ensures high-contrast action pathing.]";
        const rl = data.reply.toLowerCase();
        if (rl.includes("verifiable") || rl.includes("test") || rl.includes("compile")) {
          assistantCommentary = "[Software Alignment: Design Verifiable Environments: Asserting logical validation loops. Forcing runtime state check.]";
        } else if (rl.includes("spec.md") || rl.includes("claude.md") || rl.includes("documentation")) {
          assistantCommentary = "[Software Alignment: Agent-Native Documentation: Emitting SPEC.md blueprint boundaries to reduce worker hallucinations.]";
        } else if (rl.includes("context") || rl.includes("history") || rl.includes("assumption")) {
          assistantCommentary = "[Software Alignment: Enforcing Context Discipline: Bounding target's working window. Forcing models to declare structural invariants first.]";
        } else if (rl.includes("principles") || rl.includes("design") || rl.includes("under-engineer")) {
          assistantCommentary = "[Software Alignment: First-Principles Ethos: Dismantling cookie-cutter framework boilerplate in favor of pure, performant systems architecture.]";
        }

        const newAssistantMsg: ChatMessage = {
          id: `chat-${Date.now()}-a`,
          role: "assistant",
          content: data.reply,
          metaCommentary: assistantCommentary
        };

        setChatMessages(prev => [...prev, newAssistantMsg]);
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `chat-${Date.now()}-err`,
        role: "assistant",
        content: `Communication friction: ${err.message || "Unable to sync with Prompt Advocate."}\n\nPlease check your LLM_API_KEY environment variable.`,
        metaCommentary: "[System Alert: Physical layer connection degraded. Service failed to synthesize model response weights.]"
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setSendingChat(false);
    }
  };

  const renderMessageContent = (msg: ChatMessage) => {
    const parts = msg.content.split(/(```[\s\S]*?```)/g);
    return (
      <div className="space-y-2.5 font-[var(--font-sans)] text-xs sm:text-sm text-[var(--color-muted)] leading-relaxed whitespace-pre-wrap select-text">
        {parts.map((part, index) => {
          if (part.startsWith("```")) {
            const lines = part.split("\n");
            const firstLine = lines[0];
            const language = firstLine.replace(/`/g, "").trim() || "prompt";
            const codeText = lines.slice(1, lines.length - 1).join("\n");

            return (
              <div key={index} className="codeblock relative group my-3">
                <div className="flex items-center justify-between px-3.5 py-2 bg-[var(--color-ink)] border-b border-[var(--color-hairline-strong)] text-[11px] font-[var(--font-mono)] text-[var(--color-muted)] select-none rounded-t-xl">
                  <span className="text-[var(--color-muted)]">{language} block</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(codeText);
                      setChatMessages(prev => prev.map(m => m.id === msg.id ? { ...m, copied: true } : m));
                      setTimeout(() => {
                        setChatMessages(prev => prev.map(m => m.id === msg.id ? { ...m, copied: false } : m));
                      }, 2000);
                    }}
                    className="flex items-center space-x-1.5 text-[var(--color-sage)] hover:text-[var(--color-sage-glow)] transition-colors font-[var(--font-mono)] text-[11px] bg-[var(--color-ink-2)] px-2 py-1 rounded-lg border border-[var(--color-hairline)] cursor-pointer"
                  >
                    {msg.copied ? (
                      <>
                        <Check className="w-3 h-3 text-[var(--color-sage)]" />
                        <span className="text-[var(--color-sage)]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Code Block</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3.5 overflow-x-auto text-[11px] sm:text-xs text-[var(--color-sage-glow)] bg-[var(--color-ink)] leading-normal selection:bg-[var(--color-sage)]/20 rounded-b-xl">{codeText}</pre>
              </div>
            );
          } else {
            return <span key={index}>{part}</span>;
          }
        })}
      </div>
    );
  };

  // iPad friendly touch-scaffolding states for tech & system context engineering:
  const [surveyTechStack, setSurveyTechStack] = useState<string>("Full-Stack Express + Node (CJS Bundler)");
  const [surveyPersistence, setSurveyPersistence] = useState<string>("Relational Cloud SQL Schema (Drizzle PostgreSQL)");
  const [surveyPersona, setSurveyPersona] = useState<string>("TypeScript & React Software Architect");
  const [surveyPersonaCustom, setSurveyPersonaCustom] = useState<string>("");
  const [surveyFormat, setSurveyFormat] = useState<string>("Beautiful Markdown with Section Flags (e.g., ###)");
  const [surveyFormatCustom, setSurveyFormatCustom] = useState<string>("");
  const [surveyReasoning, setSurveyReasoning] = useState<string>("Double-Pass / Multi-Step reasoning chain inside <thought> block");
  const [surveyDynamic, setSurveyDynamic] = useState<string>("Inject live dynamic Date/Time strings");

  // Multi-select Best Practices Absolute Boundaries
  const [surveyBoundaries, setSurveyBoundaries] = useState<string[]>([
    "strict_no_mock_data",
    "lazy_init_secret_keys",
    "single_view_constraint",
    "lucide_icons_only"
  ]);

  // Scout copy states
  const [copiedScoutId, setCopiedScoutId] = useState<string | null>(null);

  // Collapsible informational panels for cleaner spacing
  const [showAcademy, setShowAcademy] = useState(false);
  const [showScout, setShowScout] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);

  // Tooltip explain state
  const [showExplainTooltip, setShowExplainTooltip] = useState(false);

  // Active result state
  const [result, setResult] = useState<OptimizedPromptResult | null>(null);
  const [currentModelUsed, setCurrentModelUsed] = useState("");
  const [speedMs, setSpeedMs] = useState(0);

  // History state
  const [history, setHistory] = useState<PromptHistoryItem[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);

  useEffect(() => {
    // Check API key and load local history
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        setIsApiKeyMissing(!data.hasApiKey);
      })
      .catch(() => {});

    try {
      const saved = localStorage.getItem("prompt_advocate_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        setHistory(parsed);
        if (parsed.length > 0) {
          setActiveHistoryId(parsed[0].id);
        }
      }
    } catch {}
  }, []);

  const saveToHistory = (item: PromptHistoryItem) => {
    const updated = [item, ...history].slice(0, 15); // keep 15
    setHistory(updated);
    setActiveHistoryId(item.id);
    try {
      localStorage.setItem("prompt_advocate_history", JSON.stringify(updated));
    } catch {}
  };

  const handleClearHistory = () => {
    if (confirm("Clear your session history?")) {
      setHistory([]);
      setActiveHistoryId(null);
      try {
        localStorage.removeItem("prompt_advocate_history");
      } catch {}
    }
  };

  const loadFromHistory = (item: PromptHistoryItem) => {
    setInputPrompt(item.inputPrompt);
    setResult(item.result);
    setCurrentModelUsed(item.modelUsed);
    setSpeedMs(item.speedMs);
    setIsSavedToMemory(!!item.savedOffline);
    setActiveHistoryId(item.id);
    setActiveWorkspaceTab("prompt");
  };

  const handleSaveToMemory = async () => {
    if (!result || isSavedToMemory) return;

    try {
      const payload = {
        title: inputPrompt.trim().substring(0, 48) + (inputPrompt.trim().length > 48 ? "..." : ""),
        originalInput: inputPrompt,
        advocatePrompt: result.advocatePrompt,
        promptScore: result.promptScore || 85,
        caliberStatus: result.caliberStatus || "exceptional",
        shouldSaveAdvisory: result.shouldSaveAdvisory || "Outstanding prompt formulation.",
        reusabilityTags: result.reusabilityTags || ["General"]
      };

      const res = await fetch("/api/memory/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsSavedToMemory(true);

        // Try syncing to Google Drive in real-time if connected
        const token = getAccessToken();
        if (token) {
          try {
            const folderId = await findOrCreateAppFolder(token);
            await uploadPromptFile(token, folderId, {
              id: `mem-${Math.random().toString(36).substring(2, 9)}`,
              title: payload.title,
              originalInput: payload.originalInput,
              advocatePrompt: payload.advocatePrompt,
              promptScore: payload.promptScore,
              caliberStatus: payload.caliberStatus,
              shouldSaveAdvisory: payload.shouldSaveAdvisory,
              reusabilityTags: payload.reusabilityTags,
              timestamp: new Date().toISOString()
            });
            console.log("Automatically synchronized new Obsidian file to Google Drive space.");
          } catch (driveErr) {
            console.warn("Failed to complete real-time background Google Drive sync:", driveErr);
          }
        }

        // Update item in history list
        setHistory(prev => {
          const updated = prev.map(item => {
            if (item.inputPrompt === inputPrompt) {
              return { ...item, savedOffline: true };
            }
            return item;
          });
          try {
            localStorage.setItem("prompt_advocate_history", JSON.stringify(updated));
          } catch {}
          return updated;
        });
      } else {
        alert("Failed to archive prompt template to Motherduck cluster.");
      }
    } catch (err) {
      console.error(err);
      alert("Offline network sync failure connecting to Motherduck connector.");
    }
  };

  const handleOptimize = async () => {
    if (!inputPrompt.trim() || loading) return;

    setLoading(true);
    setIsSavedToMemory(false);
    setStage("Executing Phase 1: Intent Archaeology...");

    const startTime = performance.now();

    const stages = [
      "Phase 1: Intent Archaeology (parsing desires)...",
      "Phase 2: Failure Mode Audit (identifying LLM blind spots)...",
      "Phase 3: Specification Synthesis (designing limits)...",
      "Phase 4: Formulating Executable Blueprint..."
    ];

    let stageIdx = 0;
    const interval = setInterval(() => {
      if (stageIdx < stages.length - 1) {
        stageIdx++;
        setStage(stages[stageIdx]);
      }
    }, 2200);

    const actualPersona = surveyPersona === "Custom" ? surveyPersonaCustom : surveyPersona;
    const actualFormat = surveyFormat === "Custom" ? surveyFormatCustom : surveyFormat;

    const translateBoundary = (key: string) => {
      switch (key) {
        case "strict_no_mock_data":
          return "Anti-Mock State Constraint: You are STRICTLY forbidden from creating fake mock databases or hardcoded placeholder state arrays. Every data layer must be fully structured and prepared for direct cloud/local database hydration.";
        case "lazy_init_secret_keys":
          return "Lazy SDK Client Instantiation: Do NOT initialize external service clients (like Stripe, Firebase Admin, or PostgreSQL Pools) at the top-level module load. Only initialize lazily inside API handlers or request triggers to avoid critical container boot crashes on missing environment variables.";
        case "postgres_schema_strict":
          return "Relational Drizzle Postgres Strict Type-Safety: All database interactions must bind dynamically to typed tables in scheme files; avoid any unmapped, anonymous, or loosely formatted JSON database mutations.";
        case "single_view_constraint":
          return "Single-Screen Board Boundaries: Confine full-system features within a single modular board container. Strictly target clean single-view UI without implementing multi-page layouts or routing drift unless explicitly asked.";
        case "lucide_icons_only":
          return "Standardized Visual Imports: Ban messy custom inline SVGs; strictly resolve and import visual assets and indicators from 'lucide-react' to ensure high standard design compile stability.";
        case "port_3000_ingress":
          return "Direct Port Binding Rules: Express/Hono custom servers MUST bind listener triggers explicitly on Host 0.0.0.0 and Port 3000 to enable reverse proxy routing.";
        default:
          return `- ${key}`;
      }
    };

    const cognitiveBlock = activeSloppyScenario
      ? `\n\n${buildCognitiveCompileContext(activeSloppyScenario)}\n`
      : "";

    const structuredPromptPayload = `
[CONTEXT ENGINEERING ARCHITECTURE SCHEMATIC]
- Target Tech Stack: ${surveyTechStack}
- Persistence & Integration Pattern: ${surveyPersistence}
- System Persona / Role: ${actualPersona || "Expert AI Architect"}
- System Syntax / Output Schema constraint: ${actualFormat || "Structured Markdown/JSON Specs"}
- Step-by-Step Thinking (CoT) Strategy: ${surveyReasoning}
- Real-time Clock Stamp (Current Time): ${surveyDynamic}

[ABSOLUTE SYSTEM BOUNDARIES]
${surveyBoundaries.map(translateBoundary).join("\n")}
${cognitiveBlock}
[LAYPERSON FUZZY INTENT INPUT]
${inputPrompt}
`.trim();

    try {
      const response = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: structuredPromptPayload,
          model: selectedModel,
          thinkingMode
        })
      });

      clearInterval(interval);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to compile spec");
      }

      const data = await response.json();
      const endTime = performance.now();
      const elapsed = Math.round(endTime - startTime);

      setResult(data.result);
      setCurrentModelUsed(data.modelUsed);
      setSpeedMs(elapsed);

      // Save to history
      saveToHistory({
        id: `h-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        inputPrompt,
        result: data.result,
        modelUsed: data.modelUsed,
        speedMs: elapsed
      });

      // Default active tab
      setActiveWorkspaceTab("prompt");
    } catch (err: any) {
      clearInterval(interval);
      console.error(err);
      alert(`Generation Failed: ${err.message || "An unexpected issue occurred while synthesizing the specification."}`);
    } finally {
      setLoading(false);
      setStage("");
    }
  };

  const handleCopyPrompt = () => {
    if (result) {
      navigator.clipboard.writeText(result.advocatePrompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  const samplePresets = [
    {
      text: "An offline-first task board with dynamic countdown timelines and an organic memory restoration list.",
      label: "Anti-Forgetfulness Planner",
      layperson: "Anti-Forgetfulness Planner",
      explain: "Stores exact task context and previous paths so you can resume focus instantly after a distraction."
    },
    {
      text: "A focused micro-journaling script that logs and checks consistency across markdown notes files.",
      label: "Gentle Low-Pressure Organizer",
      layperson: "Low-Pressure Organizer",
      explain: "Uses collaborative recommendations and optional structures rather than bossy commands to bypass task-anxiety."
    },
    {
      text: "An interactive slate-themed visual grid showing status charts with automated error guardrails.",
      label: "Calming Visual Dashboard",
      layperson: "Calming Visual Dashboard",
      explain: "Uses calming slate-gray themes and soothing layout cues to prevent visual overstimulation."
    }
  ];

  return (
    <div className="flex flex-col space-y-6">
      {/* PAGE HEADER & INTUITIVE WORKSPACE INTRODUCTION */}
      <div className="card-shell p-5 relative overflow-hidden" id="prompt-compiler-intro-header">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--color-sage-soft)] rounded-full blur-3xl pointer-events-none opacity-40" />
        <div className="space-y-4 relative z-10 text-left">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-lg md:text-xl font-bold text-[var(--color-ink)] tracking-tight flex items-center gap-2">
              <Target className="w-5 h-5 text-[var(--color-sage)]" />
              <span>Prompt Compiler</span>
            </h1>

            {/* 'Explain this' interactive trigger and tooltip */}
            <div className="relative inline-block" id="prompt-compiler-explanation-container">
              <button
                id="explain-compiler-btn"
                type="button"
                onClick={() => setShowExplainTooltip(!showExplainTooltip)}
                className="text-[11px] font-semibold text-[var(--color-sage)] hover:text-[var(--color-sage-glow)] flex items-center gap-1 cursor-pointer underline decoration-[var(--color-sage)]/30 underline-offset-4 transition-all"
                title="Click to understand the compilation and optimization science"
              >
                <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Explain this</span>
              </button>

              {/* Explanatory Popover Tooltip Box */}
              {showExplainTooltip && (
                <div
                  className="absolute left-0 sm:left-auto sm:right-0 md:left-0 lg:left-0 mt-2.5 w-80 sm:w-96 p-4 bg-[var(--color-surface-solid)] border border-[var(--color-hairline)] rounded-[var(--radius-shell)] shadow-[var(--shadow-card)] z-50 text-left text-xs text-[var(--color-muted)] leading-relaxed"
                  id="compiler-explain-tooltip"
                >
                  <div className="absolute -top-1.5 left-6 w-3 h-3 bg-[var(--color-surface-solid)] border-t border-l border-[var(--color-hairline)] transform rotate-45" />

                  <div className="flex items-center space-x-2 text-[var(--color-sage)] font-bold text-[10px] font-[var(--font-mono)] mb-2 border-b border-[var(--color-hairline)] pb-1.5">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>How context optimization works</span>
                  </div>

                  <p className="mb-2.5 text-[var(--color-muted)] leading-normal">
                    Plain text inputs like <em className="text-[var(--color-ink)] font-medium">&quot;make a todo list&quot;</em> lack the exact structural constraints, programmatic guardrails, and architectural boundaries that LLMs need to prevent hallucinations, state losses, or container-level crashes.
                  </p>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-start space-x-2 bg-[var(--color-canvas)] p-2.5 rounded-lg border border-[var(--color-hairline)]">
                      <Target className="w-4 h-4 text-[var(--color-sage)] shrink-0 mt-0.5" />
                      <p className="text-[11px] text-[var(--color-muted)] leading-relaxed">
                        <strong className="text-[var(--color-ink)]">Context Engineering:</strong> Replaces casual prompts with dense state specifications, precise technology scaffolds, and structured markdown expectations to align LLM behaviors.
                      </p>
                    </div>
                    <div className="flex items-start space-x-2 bg-[var(--color-sage-soft)] p-2.5 rounded-lg border border-[var(--color-sage)]/10">
                      <Shield className="w-4 h-4 text-[var(--color-sage)] shrink-0 mt-0.5" />
                      <p className="text-[11px] text-[var(--color-muted)] leading-relaxed">
                        <strong className="text-[var(--color-ink)]">Logic Bounds:</strong> Enforces critical design standards (such as no-mock data rules and lazy variable initializations) to prevent build failures.
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-[var(--color-sage)] italic flex items-center justify-between border-t border-[var(--color-hairline)] pt-2 font-semibold">
                    <span className="flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" />
                      Better context = reliable production code
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowExplainTooltip(false)}
                      className="text-[10px] font-bold text-[var(--color-muted)] hover:text-[var(--color-ink)] cursor-pointer ml-4"
                    >
                      Dismiss
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 space-y-4 w-full" id="workspace-action-stepper-panel">
            {/* Memory alert */}
            <div className="card-core p-3.5 flex items-start space-x-3 text-left">
              <Brain className="w-5 h-5 text-[var(--color-sage)] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[var(--color-ink)] flex items-center gap-1.5">
                  Your AI needs memory
                </h4>
                <p className="text-xs text-[var(--color-muted)] leading-relaxed mt-0.5 font-[var(--font-sans)]">
                  This compiler has built-in <strong className="text-[var(--color-ink)]">Local Storage &amp; Cloud-Sync Vaults</strong> to preserve full context state across sessions.
                </p>
              </div>
            </div>

            {/* Clear Next Step Flow Checklist */}
            <div className="border-t border-[var(--color-hairline)] pt-4 text-left">
              <h4 className="text-[11px] font-bold text-[var(--color-muted)] flex items-center gap-1.5 mb-3">
                <Activity className="w-3.5 h-3.5" />
                <span>Co-Design Workflow Pathway</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {/* Step 1 */}
                <div className={`p-3 rounded-xl border transition-all ${
                  inputPrompt.trim().length > 0
                    ? "bg-[var(--color-sage-soft)] border-[var(--color-sage)]/20"
                    : "bg-[var(--color-canvas)] border-[var(--color-hairline)]"
                }`}>
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-[var(--color-ink)]">1. Draft Goal</span>
                    <span className={inputPrompt.trim().length > 0 ? "text-[var(--color-sage)]" : "text-[var(--color-muted)]"}>
                      {inputPrompt.trim().length > 0 ? (
                        <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Complete</span>
                      ) : (
                        <span className="flex items-center gap-1"><Circle className="w-3 h-3" /> Active</span>
                      )}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--color-muted)] mt-1 font-[var(--font-sans)]">
                    Input your app idea in plain English below, or pick a Starter Scenario.
                  </p>
                </div>

                {/* Step 2 */}
                <div className={`p-3 rounded-xl border transition-all ${
                  surveyBoundaries.length > 0
                    ? "bg-[var(--color-sage-soft)] border-[var(--color-sage)]/20"
                    : "bg-[var(--color-canvas)] border-[var(--color-hairline)]"
                }`}>
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-[var(--color-ink)]">2. Set Scaffold</span>
                    <span className="text-[var(--color-sage)] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Bound
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--color-muted)] mt-1 font-[var(--font-sans)]">
                    Refine tech-stack variables and toggle structural rules.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-3 rounded-xl bg-[var(--color-sage-soft)]/50 border border-[var(--color-sage)]/15">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-[var(--color-ink)]">3. Audit TCO</span>
                    <span className="text-[var(--color-sage)] flex items-center gap-1">
                      <span className="pulse-dot" /> Live
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--color-muted)] mt-1 font-[var(--font-sans)]">
                    Review live cost, cache size, and complexity ratings in real-time.
                  </p>
                </div>

                {/* Step 4 */}
                <div className={`p-3 rounded-xl border transition-all ${
                  result !== null
                    ? "bg-[var(--color-sage-soft)] border-[var(--color-sage)]/20"
                    : "bg-[var(--color-canvas)] border-[var(--color-hairline)]"
                }`}>
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-[var(--color-ink)]">4. Compile Spec</span>
                    <span className={result !== null ? "text-[var(--color-sage)]" : "text-[var(--color-muted)]"}>
                      {result !== null ? (
                        <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Ready</span>
                      ) : (
                        <span className="flex items-center gap-1"><Circle className="w-3 h-3" /> Pending</span>
                      )}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--color-muted)] mt-1 font-[var(--font-sans)]">
                    Click <strong className="text-[var(--color-ink)]">&quot;Optimize Prompt Spec&quot;</strong>, copy output, and paste to coder.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <GravitasBoard currentInputPrompt={inputPrompt} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="prompt-optimizer-root">
        {/* Left panel: Input workspace */}
      <div className="col-span-1 lg:col-span-5 h-full flex flex-col space-y-5">
        <SloppyPromptTour
          variant="light"
          mode="live"
          layout="stacked"
          initialScenarioId={searchParams.get("scenario") ?? undefined}
          inputPrompt={inputPrompt}
          onPromptChange={(text) => {
            setInputPrompt(text);
            setChatInput(text);
          }}
          onScenarioChange={setActiveSloppyScenario}
        />

        {/* Dynamic Context Pipeline Progress Tracker */}
        {(() => {
          const isGoalMet = inputPrompt.trim().length >= 10;
          const isTechMet = !!surveyTechStack;
          const isPersistenceMet = !!surveyPersistence;
          const isBoundariesMet = surveyBoundaries.length > 0;

          const stepsCompleted = [isGoalMet, isTechMet, isPersistenceMet, isBoundariesMet].filter(Boolean).length;
          const progressPercent = Math.round((stepsCompleted / 4) * 100);

          return (
            <div className="card-shell p-4 space-y-2.5 relative overflow-hidden" id="pipeline-completeness-status">
              <div className="h-1 bg-[var(--color-sage-soft)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--color-sage)] transition-all duration-500 rounded-full" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[10px] font-bold text-[var(--color-sage)] flex items-center space-x-1.5 font-[var(--font-mono)]">
                  <span className="pulse-dot" />
                  <span>Scaffold Readiness Spec</span>
                </span>
                <span className="font-[var(--font-mono)] font-bold text-[var(--color-sage)] text-sm bg-[var(--color-sage-soft)] px-2 py-0.5 rounded-lg border border-[var(--color-sage)]/15">{progressPercent}%</span>
              </div>

              {/* Progressive Visual Steppers */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {/* Node 1 */}
                <div className="flex flex-col space-y-1">
                  <div className={`h-1.5 rounded-full ${isGoalMet ? "bg-[var(--color-sage)]" : "bg-[var(--color-canvas-2)]"} transition-colors`} />
                  <span className={`text-[10px] font-bold ${isGoalMet ? "text-[var(--color-sage)]" : "text-[var(--color-muted)]"} text-center truncate`}>
                    1. Goal {isGoalMet ? <CheckCircle2 className="w-3 h-3 inline" /> : <Circle className="w-3 h-3 inline" />}
                  </span>
                </div>
                {/* Node 2 */}
                <div className="flex flex-col space-y-1">
                  <div className={`h-1.5 rounded-full ${isTechMet && isPersistenceMet ? "bg-[var(--color-sage-glow)]" : "bg-[var(--color-canvas-2)]"} transition-colors`} />
                  <span className={`text-[10px] font-bold ${isTechMet && isPersistenceMet ? "text-[var(--color-sage-glow)]" : "text-[var(--color-muted)]"} text-center truncate`}>
                    2. Scaffold {isTechMet && isPersistenceMet ? <CheckCircle2 className="w-3 h-3 inline" /> : <Circle className="w-3 h-3 inline" />}
                  </span>
                </div>
                {/* Node 3 */}
                <div className="flex flex-col space-y-1">
                  <div className={`h-1.5 rounded-full ${isBoundariesMet ? "bg-[var(--color-sage)]" : "bg-[var(--color-canvas-2)]"} transition-colors`} />
                  <span className={`text-[10px] font-bold ${isBoundariesMet ? "text-[var(--color-sage)]" : "text-[var(--color-muted)]"} text-center truncate`}>
                    3. Guardrails {isBoundariesMet ? <CheckCircle2 className="w-3 h-3 inline" /> : <Circle className="w-3 h-3 inline" />}
                  </span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Input Card */}
        <div className="card-shell flex flex-col space-y-4 p-5" id="input-card">
          <div className="flex justify-between items-center" id="input-card-header">
            <h2 className="text-sm font-semibold text-[var(--color-ink)] flex items-center space-x-2">
              <span className="p-1 px-1.5 rounded bg-[var(--color-sage-soft)] border border-[var(--color-sage)]/15 text-[var(--color-sage)] font-[var(--font-mono)] text-xs">C</span>
              <span>Multi-Turn Co-Design Workspace</span>
            </h2>
            <span className="text-[10px] text-[var(--color-muted)] font-[var(--font-mono)] bg-[var(--color-canvas)] px-2 py-0.5 rounded-lg border border-[var(--color-hairline)]">
              Interactive Mode
            </span>
          </div>

          {/* Mode Selector Radio Toggle */}
          <div className="flex bg-[var(--color-canvas)] p-1 rounded-xl border border-[var(--color-hairline)] shrink-0 gap-1 text-[11px] font-medium">
            <button
              type="button"
              onClick={() => setChatMode("chat")}
              className={`flex-1 py-1.5 px-3 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                chatMode === "chat"
                  ? "bg-[var(--color-sage)] text-white font-semibold shadow-sm"
                  : "bg-transparent text-[var(--color-muted)] hover:bg-[var(--color-surface)]"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span>Co-Design Chat</span>
            </button>
            <button
              type="button"
              onClick={() => setChatMode("replyPrompts")}
              className={`flex-1 py-1.5 px-3 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                chatMode === "replyPrompts"
                  ? "bg-amber-600 text-white font-semibold shadow-sm"
                  : "bg-transparent text-[var(--color-muted)] hover:bg-[var(--color-surface)]"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>Reply Agent Auditor</span>
            </button>
          </div>

          {/* Preset Scenario Selector Dropdown */}
          <div className="space-y-1.5" id="scenario-selector-container">
            <label className="text-[11px] font-[var(--font-mono)] font-bold text-[var(--color-muted)] flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-[var(--color-sage)]" />
              <span>Bootstrap Input with Scenario Template</span>
            </label>
            <select
              id="prompt-starter-dropdown"
              onChange={(e) => {
                const idx = parseInt(e.target.value);
                if (isNaN(idx) || idx === 0) return;
                const scenario = STARTER_SCENARIOS[idx];

                // Set both states to synchronize typing audit
                setChatInput(scenario.intentText);
                setInputPrompt(scenario.intentText);

                setSurveyTechStack(scenario.techStack);
                setSurveyPersistence(scenario.persistence);
                setSurveyPersona(scenario.persona);
                setSurveyFormat(scenario.format);
                setSurveyReasoning(scenario.reasoning);
                setSurveyBoundaries(scenario.boundaries);
              }}
              className="w-full bg-[var(--color-surface-solid)] border border-[var(--color-hairline)] rounded-lg p-2.5 text-xs text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-sage)] transition-colors cursor-pointer"
            >
              {STARTER_SCENARIOS.map((s, idx) => (
                <option key={idx} value={idx}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          {/* Scrollable multi-turn messaging window inside text card */}
          <div className="h-80 overflow-y-auto card-core p-3.5 space-y-4 scrollbar-thin" id="chat-window-box">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="flex flex-col space-y-1.5">
                {/* Meta Header */}
                <div className={`flex items-center space-x-1.5 text-[10px] font-[var(--font-mono)] font-bold text-[var(--color-muted)] ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'user' ? (
                    <>
                      <span>Operator</span>
                      <User className="w-3 h-3 text-[var(--color-sage)] shrink-0" />
                    </>
                  ) : (
                    <>
                      <Bot className="w-3.5 h-3.5 text-[var(--color-sage)] shrink-0" />
                      <span className="text-[var(--color-sage)]">Advocate Service</span>
                    </>
                  )}
                </div>

                {/* Bubble Container */}
                <div className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3.5 rounded-[var(--radius-core)] w-full max-w-[94%] transition-all border ${
                    msg.role === 'user'
                      ? 'bg-[var(--color-sage-soft)] border-[var(--color-sage)]/15 text-[var(--color-ink)]'
                      : 'bg-[var(--color-surface-solid)] border-[var(--color-hairline)] text-[var(--color-muted)]'
                  }`}>
                    {renderMessageContent(msg)}
                  </div>
                </div>

                {/* Meta Commentary element (Next to both parties' texts) */}
                {msg.metaCommentary && (
                  <div className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[94%] text-[10px] font-[var(--font-mono)] border-l-2 p-2 rounded-r flex items-start gap-1 bg-[var(--color-canvas)] ${
                      msg.role === 'user'
                        ? 'border-[var(--color-sage)]/30 text-[var(--color-sage)]'
                        : 'border-[var(--color-sage-glow)]/30 text-[var(--color-sage-glow)]'
                    }`}>
                      <Activity className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-60" />
                      <div>{msg.metaCommentary}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Interactive Chat Input Area */}
          <div className="space-y-3 pt-1">
            <textarea
              id="prompt-raw-textarea"
              className="w-full h-24 bg-[var(--color-surface-solid)] border border-[var(--color-hairline)] rounded-xl p-3 text-sm text-[var(--color-ink)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-sage)] transition-colors resize-none"
              placeholder={
                chatMode === "replyPrompts"
                  ? "Paste another LLM's unsatisfactory response, error dump, or mock arrays here to compile an audited corrective reply prompt..."
                  : "Describe your goals, paste an LLM's prompt, or ask our service to craft a specific prompt..."
              }
              value={chatInput}
              onChange={(e) => {
                setChatInput(e.target.value);
                setInputPrompt(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendChatMessage();
                }
              }}
              disabled={sendingChat || loading}
            />

            {/* Clear and Submit Actions */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setChatMessages([]);
                  setChatInput("");
                  setInputPrompt("");
                }}
                className="btn-ghost text-[11px] font-[var(--font-mono)] font-bold"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={handleSendChatMessage}
                disabled={!chatInput.trim() || sendingChat || loading}
                className={`flex-1 py-2 px-4 font-semibold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5 border cursor-pointer ${
                  sendingChat
                    ? "bg-[var(--color-canvas)] border-[var(--color-hairline)] text-[var(--color-muted)] cursor-not-allowed"
                    : "btn-pill"
                }`}
              >
                {sendingChat ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--color-sage)]" />
                    <span className="font-[var(--font-mono)] text-xs">Advocate thinking...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to Service</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* PROMPT QUALITY SCORE VISUAL METER */}
          {(() => {
            const qualityState = evaluateInputQuality(inputPrompt, {
              persona: surveyPersona,
              personaCustom: surveyPersonaCustom,
              format: surveyFormat,
              formatCustom: surveyFormatCustom,
              reasoning: surveyReasoning,
              boundaries: surveyBoundaries,
              dynamic: surveyDynamic,
              techStack: surveyTechStack,
              persistence: surveyPersistence
            });
            return (
              <div className="card-core p-4 space-y-4" id="input-quality-meter">
                <div className="flex justify-between items-center pb-2 border-b border-[var(--color-hairline)]">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-[var(--color-sage)] font-[var(--font-mono)] font-bold flex items-center space-x-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>Workbench Audit</span>
                    </span>
                    <h3 className="text-xs font-bold text-[var(--color-ink)] font-[var(--font-sans)]">
                      Start Intent Score
                    </h3>
                  </div>
                  <div className={`px-2 py-0.5 rounded-lg text-[10px] font-[var(--font-mono)] font-bold border ${qualityState.color}`}>
                    {qualityState.status}
                  </div>
                </div>

                {/* Meter Split Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">

                  {/* Circular Dial / Progress Card */}
                  <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-lg">
                    <div className="relative w-16 h-16 rounded-full border-4 border-dashed border-[var(--color-sage)]/20 flex items-center justify-center bg-[var(--color-surface-solid)] shadow-sm">
                      <span className="text-xl font-[var(--font-mono)] font-bold text-[var(--color-sage)]">{qualityState.overall}%</span>
                      <span className="text-[8px] font-[var(--font-mono)] text-[var(--color-muted)] absolute bottom-2 uppercase tracking-wide">Intent</span>
                    </div>
                  </div>

                  {/* Individual Sliders */}
                  <div className="sm:col-span-8 space-y-2.5">

                    {/* Specificity */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[11px] font-medium text-[var(--color-muted)]">
                        <span>Specificity</span>
                        <span className="font-[var(--font-mono)] text-[var(--color-sage)] font-bold">{qualityState.specificity}%</span>
                      </div>
                      <div className="h-1 bg-[var(--color-canvas)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--color-sage)] rounded-full transition-all duration-300"
                          style={{ width: `${qualityState.specificity}%` }}
                        />
                      </div>
                    </div>

                    {/* Clarity */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[11px] font-medium text-[var(--color-muted)]">
                        <span>Clarity</span>
                        <span className="font-[var(--font-mono)] text-[var(--color-sage-glow)] font-bold">{qualityState.clarity}%</span>
                      </div>
                      <div className="h-1 bg-[var(--color-canvas)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--color-sage-glow)] rounded-full transition-all duration-300"
                          style={{ width: `${qualityState.clarity}%` }}
                        />
                      </div>
                    </div>

                    {/* Constraints */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[11px] font-medium text-[var(--color-muted)]">
                        <span>Constraints</span>
                        <span className="font-[var(--font-mono)] text-amber-600 font-bold">{qualityState.constraints}%</span>
                      </div>
                      <div className="h-1 bg-[var(--color-canvas)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-300"
                          style={{ width: `${qualityState.constraints}%` }}
                        />
                      </div>
                    </div>

                  </div>

                </div>

                {/* COLLAPSIBLE CONTEXT ENGINEERING ACADEMY LOGS */}
                <div className="border border-[var(--color-sage)]/15 rounded-xl overflow-hidden bg-[var(--color-sage-soft)]/30 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setShowAcademy(!showAcademy)}
                    className="w-full p-3.5 flex justify-between items-center text-left hover:bg-[var(--color-sage-soft)] transition-colors cursor-pointer"
                  >
                    <span className="text-[10.5px] font-bold text-[var(--color-sage)] font-[var(--font-mono)] flex items-center space-x-2">
                      <span className="px-1.5 py-0.5 rounded bg-[var(--color-sage-soft)] text-[var(--color-sage)] border border-[var(--color-sage)]/15 text-[9px]">ACADEMY</span>
                      <span>The Science of Context Engineering</span>
                    </span>
                    <span className="text-[var(--color-muted)] text-xs font-[var(--font-mono)]">{showAcademy ? "Collapse [-]" : "Expand [+]"}</span>
                  </button>

                  {showAcademy && (
                    <div className="p-4 border-t border-[var(--color-hairline)] space-y-3.5 text-xs text-[var(--color-muted)] leading-normal animate-fade-in text-left">
                      <p className="text-[var(--color-muted)] text-[11px] leading-relaxed">
                        People associate <span className="text-[var(--color-ink)] font-medium">&quot;prompts&quot;</span> with casual, short questions. But in production software, <span className="text-[var(--color-sage)] font-semibold decoration-[var(--color-sage)]/20 underline underline-offset-4">Context Engineering</span> is the delicate art and science of packing the context window with precise, task-relevant dimensions.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-[10.5px]">
                        <div className="p-2.5 bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-lg space-y-1">
                          <p className="font-bold text-[var(--color-ink)] flex items-center space-x-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-sage)]" />
                            <span>The Science: Packing &amp; Budgets</span>
                          </p>
                          <p className="text-[var(--color-muted)] text-[10px] leading-normal">
                            Coordinating quick examples (few-shots), folder trees, live clocks, and custom templates without swelling context size.
                          </p>
                        </div>

                        <div className="p-2.5 bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-lg space-y-1">
                          <p className="font-bold text-[var(--color-ink)] flex items-center space-x-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-sage-glow)]" />
                            <span>The Art: Psychology &amp; Control</span>
                          </p>
                          <p className="text-[var(--color-muted)] text-[10px] leading-normal">
                            Breaking complex problems down into modular logic guardrails, verification loops, and hard physical boundaries.
                          </p>
                        </div>
                      </div>

                      <div className="p-2 bg-[var(--color-sage-soft)] rounded-lg border border-[var(--color-sage)]/10 text-[10px] text-[var(--color-sage)] italic flex items-start space-x-2">
                        <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                        <span>&quot;Chat wrapper&quot; is tired and wrong. Context Engineering coordinates multiple models, eval checks, and prefetching into a robust operational software layer.</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* COLLAPSIBLE DEVELOPER PROJECT SCOUT TEMPLATES */}
                <div className="border border-[var(--color-hairline)] rounded-xl overflow-hidden bg-[var(--color-canvas)]/30">
                  <button
                    type="button"
                    onClick={() => setShowScout(!showScout)}
                    className="w-full p-3.5 flex justify-between items-center text-left hover:bg-[var(--color-canvas)] transition-colors cursor-pointer"
                  >
                    <span className="text-[10.5px] font-bold text-[var(--color-sage)] font-[var(--font-mono)] flex items-center space-x-2">
                      <Bot className="w-3.5 h-3.5 shrink-0" />
                      <span>Project Scout Prompts</span>
                      {!showScout && <span className="text-[8px] bg-[var(--color-sage-soft)] text-[var(--color-sage)] border border-[var(--color-sage)]/15 px-1 py-0.5 rounded font-[var(--font-mono)] ml-1.5">Needs Files</span>}
                    </span>
                    <span className="text-[var(--color-muted)] text-xs font-[var(--font-mono)]">{showScout ? "Collapse [-]" : "Expand [+]"}</span>
                  </button>

                  {showScout && (
                    <div className="p-4 border-t border-[var(--color-hairline)] space-y-3.5 animate-fade-in text-left">
                      <p className="text-[11px] text-[var(--color-muted)] leading-relaxed font-[var(--font-sans)]">
                        First time booting an application? Tap any of the scout prompts below to copy them to your clipboard. Paste it into your AI assistant chat to immediately harvest active paths and file structures, then paste those results back above into the main workspace.
                      </p>

                      <div className="grid grid-cols-1 gap-2.5 pt-1">
                        {[
                          {
                            id: "scout_paths",
                            title: "Catalog Folder Tree",
                            short: "Get filepaths & dependencies",
                            icon: Folder,
                            prompt: "Read the active workspace root files and folders. Provide a clean bulleted catalog of all components, active package.json dependencies, and nested paths so I can feed them directly into the context optimizer."
                          },
                          {
                            id: "scout_db",
                            title: "Audit Port & Schemas",
                            short: "Get routing & DB columns",
                            icon: Database,
                            prompt: "Read current backend server routing, listener ports, database schemas (e.g., Firestore blueprints, PostgreSQL files, or localStorage keys) so I have an exact specification."
                          },
                          {
                            id: "scout_stubs",
                            title: "Detect Stubs & Mocks",
                            short: "Find dummy fields to replace",
                            icon: AlertTriangle,
                            prompt: "Scan files and locate all mock state variables, hardcoded dummy lists, or simulated API endpoints so we can plan real live database alignment. Output them as a concise checklist."
                          }
                        ].map((scout) => {
                          const Icon = scout.icon;
                          const isCopied = copiedScoutId === scout.id;
                          return (
                            <button
                              key={scout.id}
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(scout.prompt);
                                setCopiedScoutId(scout.id);
                                setTimeout(() => setCopiedScoutId(null), 2000);
                              }}
                              className={`w-full text-left p-3.5 rounded-xl border transition-all relative flex flex-col justify-between items-start h-24 cursor-pointer ${
                                isCopied
                                  ? "bg-[var(--color-sage-soft)] border-[var(--color-sage)]/40 text-[var(--color-ink)] ring-1 ring-[var(--color-sage)]/20"
                                  : "bg-[var(--color-surface-solid)] border-[var(--color-hairline)] hover:border-[var(--color-hairline-strong)] text-[var(--color-muted)]"
                              }`}
                            >
                              <div className="space-y-1 w-full">
                                <div className="flex justify-between items-center w-full">
                                  <span className="text-[11px] font-bold tracking-tight text-[var(--color-ink)] flex items-center gap-1.5">
                                    <Icon className="w-3.5 h-3.5 text-[var(--color-sage)]" />
                                    {scout.title}
                                  </span>
                                  {isCopied ? (
                                    <Check className="w-3.5 h-3.5 text-[var(--color-sage)] shrink-0" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5 text-[var(--color-muted)] hover:text-[var(--color-ink)] shrink-0" />
                                  )}
                                </div>
                                <p className="text-[9.5px] text-[var(--color-muted)] leading-snug">{scout.short}</p>
                              </div>

                              <div className="w-full pt-1.5 border-t border-[var(--color-hairline)] text-[8.5px] font-[var(--font-mono)] text-[var(--color-muted)] truncate">
                                {isCopied ? "Prompt Copied to Clipboard" : scout.prompt}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

            {/* DOTTED CONNECTION PIPE GUIDING TO STEP 2 */}
            <div className="flex flex-col items-center py-1 mt-1 shrink-0" id="connector-pipeline-1-2">
              <div className="w-0.5 h-7 bg-[var(--color-sage)]/40" />
              <div className="text-[8.5px] font-bold text-[var(--color-sage)] font-[var(--font-mono)] select-none pt-1 flex items-center space-x-1 pointer-events-none">
                <ArrowDown className="w-3 h-3" />
                <span>CONTINUE TO STEP 2: Scaffolds &amp; Guardrails</span>
              </div>
            </div>

            {/* TACTILE INTERACTIVE SURVEY PANEL */}
            <div className="card-shell p-5 space-y-5 relative" id="survey-form">

                  {/* Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--color-hairline)]">
                    <div className="flex items-center space-x-2">
                       <span className="pulse-dot" />
                       <h4 className="text-xs font-bold text-[var(--color-sage)] font-[var(--font-mono)]">Context Builder &amp; Parameters</h4>
                    </div>
                    <span className="text-[10px] text-[var(--color-muted)] font-[var(--font-mono)]">iPad-Friendly Taps</span>
                  </div>

                  {/* Q1: Target Technology Stack (Required Forced Choice) */}
                  <div className="space-y-2">
                    <label className="block text-[10.5px] font-bold text-[var(--color-ink)] font-[var(--font-mono)]">
                      Select Target Tech Stack Scaffold
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                      {[
                        "Full-Stack Express + Node (CJS Bundler)",
                        "React + Vite Front-End (Tailwind CSS)",
                        "Standalone HTML Shell (Embedded Assets)",
                        "Python Backend Script (FastAPI)"
                      ].map((stackOpt) => (
                        <button
                          key={stackOpt}
                          type="button"
                          onClick={() => setSurveyTechStack(stackOpt)}
                          className={`flex items-center space-x-2.5 p-3.5 rounded-xl border text-left transition-all ${
                            surveyTechStack === stackOpt
                              ? "bg-[var(--color-sage-soft)] border-[var(--color-sage)] text-[var(--color-sage)] ring-1 ring-[var(--color-sage)]/20"
                              : "bg-[var(--color-surface-solid)] border-[var(--color-hairline)] hover:bg-[var(--color-canvas)] text-[var(--color-muted)]"
                          }`}
                        >
                          <span className={`w-3 h-3 rounded-full border flex items-center justify-center shrink-0 ${
                            surveyTechStack === stackOpt ? "border-[var(--color-sage)] bg-[var(--color-sage)]" : "border-[var(--color-hairline-strong)] bg-transparent"
                          }`}>
                            {surveyTechStack === stackOpt && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                          <span className="font-medium leading-tight">{stackOpt}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Q2: Data Persistence Integration Strategy */}
                  <div className="space-y-2">
                    <label className="block text-[10.5px] font-bold text-[var(--color-ink)] font-[var(--font-mono)]">
                      Define Database / Persistence Strategy
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                      {[
                        "Relational Cloud SQL Schema (Drizzle PostgreSQL)",
                        "Durable Firebase Firestore Client",
                        "Standard Key-Value Local Cache (localStorage)",
                        "No DB: Transient State (Clears on browser page reload)"
                      ].map((dbOpt) => (
                        <button
                          key={dbOpt}
                          type="button"
                          onClick={() => setSurveyPersistence(dbOpt)}
                          className={`flex items-center space-x-2.5 p-3.5 rounded-xl border text-left transition-all ${
                            surveyPersistence === dbOpt
                              ? "bg-[var(--color-sage-soft)] border-[var(--color-sage)] text-[var(--color-sage)] ring-1 ring-[var(--color-sage)]/20"
                              : "bg-[var(--color-surface-solid)] border-[var(--color-hairline)] hover:bg-[var(--color-canvas)] text-[var(--color-muted)]"
                          }`}
                        >
                          <span className={`w-3 h-3 rounded-full border flex items-center justify-center shrink-0 ${
                            surveyPersistence === dbOpt ? "border-[var(--color-sage)] bg-[var(--color-sage)]" : "border-[var(--color-hairline-strong)] bg-transparent"
                          }`}>
                            {surveyPersistence === dbOpt && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                          <span className="font-medium leading-tight">{dbOpt}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Grid for Q3 (Persona) & Q4 (Format) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Persona Selector */}
                    <div className="space-y-2">
                      <label className="block text-[10.5px] font-bold text-[var(--color-ink)] font-[var(--font-mono)]">
                        What Systemic Persona rules the model?
                      </label>
                      <select
                        value={surveyPersona}
                        onChange={(e) => setSurveyPersona(e.target.value)}
                        className="w-full bg-[var(--color-surface-solid)] border border-[var(--color-hairline)] hover:border-[var(--color-hairline-strong)] text-[var(--color-ink)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--color-sage)] font-[var(--font-sans)] h-11"
                      >
                        <option value="TypeScript & React Software Architect">TypeScript &amp; React Software Architect</option>
                        <option value="SQL Database Engineer">SQL Database Engineer</option>
                        <option value="Expert Research Planner">Expert Research Planner</option>
                        <option value="Custom">Custom Custom Roles</option>
                      </select>
                      {surveyPersona === "Custom" && (
                        <input
                          type="text"
                          placeholder="Type custom role (e.g., Audit Analyst)..."
                          value={surveyPersonaCustom}
                          onChange={(e) => setSurveyPersonaCustom(e.target.value)}
                          className="w-full bg-[var(--color-surface-solid)] border border-[var(--color-hairline)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-sage)] mt-1.5"
                        />
                      )}
                    </div>

                    {/* Output syntax Selector */}
                    <div className="space-y-2">
                      <label className="block text-[10.5px] font-bold text-[var(--color-ink)] font-[var(--font-mono)]">
                        What output syntax structure is enforced?
                      </label>
                      <select
                        value={surveyFormat}
                        onChange={(e) => setSurveyFormat(e.target.value)}
                        className="w-full bg-[var(--color-surface-solid)] border border-[var(--color-hairline)] hover:border-[var(--color-hairline-strong)] text-[var(--color-ink)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--color-sage)] font-[var(--font-sans)] h-11"
                      >
                        <option value="Beautiful Markdown with Section Flags (e.g., ###)">Markdown with Section Flags (###)</option>
                        <option value="Strict CJS/JSON Schema Mapping">Strict CJS/JSON Schema Mapping</option>
                        <option value="Custom">Custom Output Layout</option>
                      </select>
                      {surveyFormat === "Custom" && (
                        <input
                          type="text"
                          placeholder="Type required formatting rules..."
                          value={surveyFormatCustom}
                          onChange={(e) => setSurveyFormatCustom(e.target.value)}
                          className="w-full bg-[var(--color-surface-solid)] border border-[var(--color-hairline)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-sage)] mt-1.5"
                        />
                      )}
                    </div>
                  </div>

                  {/* Grid for Q5 (Reasoning) & Q6 (Dynamic parameters) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Reasoning depth selector */}
                    <div className="space-y-2">
                      <label className="block text-[10.5px] font-bold text-[var(--color-ink)] font-[var(--font-mono)] flex items-center justify-between">
                        <span>Enforce AI Thinking Block (Chain of Thought)?</span>
                        <span className="text-[9px] text-[var(--color-sage)] normal-case font-normal font-[var(--font-sans)]">
                          Forces the AI to plan first
                        </span>
                      </label>
                      <select
                        value={surveyReasoning}
                        onChange={(e) => setSurveyReasoning(e.target.value)}
                        className="w-full bg-[var(--color-surface-solid)] border border-[var(--color-hairline)] hover:border-[var(--color-hairline-strong)] text-[var(--color-ink)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--color-sage)] font-[var(--font-sans)] h-11"
                      >
                        <option value="Double-Pass / Multi-Step reasoning chain inside <thought> block">Yes: Force AI to explain its reasoning step-by-step</option>
                        <option value="Direct / Immediate formulation without prior thinking">No: Output code immediately without a thinking phase</option>
                      </select>
                      <p className="text-[10px] text-[var(--color-muted)] font-[var(--font-sans)] leading-normal">
                        <strong>CoT (Chain of Thought):</strong> Forcing the AI to map out steps inside an invisible <code className="text-[10px] bg-[var(--color-canvas)] px-1.5 py-0.5 rounded">&lt;thought&gt;</code> container before writing actual code. This drastically reduces random guess-work (hallucinations).
                      </p>
                    </div>

                    {/* Local Clock Date Parameter */}
                    <div className="space-y-2">
                      <label className="block text-[10.5px] font-bold text-[var(--color-ink)] font-[var(--font-mono)] flex items-center justify-between">
                        <span>Inject Live Clock (Current Date &amp; Time)?</span>
                        <span className="text-[9px] text-[var(--color-sage)] normal-case font-normal font-[var(--font-sans)]">
                          Anchors AI to current time
                        </span>
                      </label>
                      <select
                        value={surveyDynamic}
                        onChange={(e) => setSurveyDynamic(e.target.value)}
                        className="w-full bg-[var(--color-surface-solid)] border border-[var(--color-hairline)] hover:border-[var(--color-hairline-strong)] text-[var(--color-ink)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--color-sage)] font-[var(--font-sans)] h-11"
                      >
                        <option value="Inject live dynamic Date/Time strings">Yes: Inject today's exact date and local time</option>
                        <option value="Offline static instruction reference framework">No: Use standard timeless references</option>
                      </select>
                      <p className="text-[10px] text-[var(--color-muted)] font-[var(--font-sans)] leading-normal">
                        <strong>Live Clock Parameter:</strong> Providing the model with your active date and current system time in the compiler instructions. This prevents outdated package suggestions and matches your environment's state.
                      </p>
                    </div>
                  </div>

                  {/* Q7: BEST PRACTICES ABSOLUTE BOUNDARIES (Multi-Toggle Checkboxes) */}
                  <div className="space-y-3.5 pt-2 border-t border-[var(--color-hairline)]" id="boundaries-selector">
                    <div className="flex flex-col space-y-0.5">
                      <label className="block text-[10.5px] font-bold text-[var(--color-ink)] font-[var(--font-mono)]">
                        Enforce Best-Practice Boundaries
                      </label>
                      <span className="text-[10px] text-[var(--color-muted)] font-[var(--font-sans)]">
                        You can select multiple absolute boundaries. Selecting items pushes active context constraints into the prompt spec.
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {[
                        {
                          key: "strict_no_mock_data",
                          label: "Banish State Mocking",
                          desc: "No dummy states or simulated tables. Force real operational structures.",
                          icon: AlertTriangle
                        },
                        {
                          key: "lazy_init_secret_keys",
                          label: "Lazy Key Initialization",
                          desc: "Exclusively instantiate SDK client credentials inside handlers to avoid server crashes.",
                          icon: Lock
                        },
                        {
                          key: "postgres_schema_strict",
                          label: "Strict Drizzle PostgreSQL",
                          desc: "Limit DB mutations to mapped, typed columns inside valid schema files.",
                          icon: Database
                        },
                        {
                          key: "single_view_constraint",
                          label: "Single Screen Modular UI",
                          desc: "Do not create empty sub-pages. Confine full tools inside structured viewport cards.",
                          icon: Ruler
                        },
                        {
                          key: "lucide_icons_only",
                          label: "Standard Lucide Imports",
                          desc: "Ban messy inline inline SVGs which clutter models. Strictly import icons.",
                          icon: Puzzle
                        },
                        {
                          key: "port_3000_ingress",
                          label: "Host Port 3000 Ingress",
                          desc: "Explicitly bind custom servers to port 3000 and host 0.0.0.0.",
                          icon: Server
                        }
                      ].map((boundary) => {
                        const Icon = boundary.icon;
                        const isSelected = surveyBoundaries.includes(boundary.key);
                        return (
                          <button
                            key={boundary.key}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSurveyBoundaries(surveyBoundaries.filter(b => b !== boundary.key));
                              } else {
                                setSurveyBoundaries([...surveyBoundaries, boundary.key]);
                              }
                            }}
                            className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all h-[74px] justify-between cursor-pointer ${
                              isSelected
                                ? "bg-[var(--color-sage-soft)] border-[var(--color-sage)] text-[var(--color-ink)] ring-1 ring-[var(--color-sage)]/20"
                                : "bg-[var(--color-surface-solid)] border-[var(--color-hairline)] hover:bg-[var(--color-canvas)] text-[var(--color-muted)]"
                            }`}
                          >
                            <div className="flex items-center space-x-2 w-full">
                              <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 text-white font-[var(--font-mono)] text-[9px] ${
                                isSelected ? "bg-[var(--color-sage)] border-[var(--color-sage)]" : "border-[var(--color-hairline-strong)] bg-transparent"
                              }`}>
                                {isSelected && <Check className="w-3 h-3" />}
                              </span>
                              <span className="font-bold text-[10.5px] leading-tight text-[var(--color-ink)] flex items-center gap-1.5">
                                <Icon className="w-3 h-3 text-[var(--color-sage)]" />
                                {boundary.label}
                              </span>
                            </div>
                            <p className="text-[9.5px] text-[var(--color-muted)] leading-snug truncate w-full pl-[22px]">{boundary.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Glossary Hover */}
                  <div className="pt-2.5 mt-2 border-t border-[var(--color-hairline)] flex justify-between items-center text-[9px] font-[var(--font-mono)] text-[var(--color-muted)]">
                    <span className="italic">Asterisks correspond to telemetry metrics scorecard.</span>
                    <div className="group relative cursor-help flex items-center space-x-1 text-[var(--color-sage)] hover:text-[var(--color-sage-glow)]">
                      <span>View Advanced Glossary</span>
                      <div className="hidden group-hover:block absolute bottom-4 right-0 w-64 p-3 bg-[var(--color-surface-solid)] border border-[var(--color-hairline)] rounded-lg shadow-[var(--shadow-card)] text-[9.5px] text-[var(--color-muted)] font-[var(--font-sans)] leading-relaxed space-y-2 z-50">
                        <p className="font-bold text-[var(--color-ink)] border-b border-[var(--color-hairline)] pb-1 flex items-center justify-between font-[var(--font-mono)]">
                          <span>Compiler Telemetry</span>
                          <span className="text-[var(--color-sage)]">v1.2</span>
                        </p>
                        <p><strong className="text-[var(--color-ink)]">Systemic Alignment:</strong> Forces exact target context lock on downstream LLMs to minimize semantic drift.</p>
                        <p><strong className="text-[var(--color-ink)]">Semantic Entropy:</strong> Measures step organization and lists to ensure stable token compilation paths.</p>
                        <p><strong className="text-[var(--color-ink)]">Negative Bounds:</strong> Sets blocking rules to prevent execution loops and cut out hallucinations.</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })()}

          {/* Quick presets picker Area */}
          <div className="flex flex-col space-y-3" id="preset-picker-zone">
            <div className="flex flex-col space-y-1.5">
              <span className="text-[10px] text-[var(--color-sage)] font-[var(--font-sans)] font-bold flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" />
                Or select a standard system preset
              </span>
              <div className="flex flex-wrap gap-2">
                {samplePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    id={`recipe-${idx}`}
                    onClick={() => setInputPrompt(preset.text)}
                    className="text-[11px] bg-[var(--color-surface-solid)] border border-[var(--color-hairline)] hover:border-[var(--color-sage)]/40 text-[var(--color-muted)] hover:text-[var(--color-ink)] px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-[var(--font-sans)] font-medium flex items-center"
                    title={`${preset.label} — ${preset.layperson}: ${preset.explain}`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Neuro-adaptive Terminology Dictionary */}
            <div className="card-core p-3.5 space-y-2.5 text-left" id="layperson-explain-card">
              <div className="flex items-center space-x-1.5 border-b border-[var(--color-hairline)] pb-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-[var(--color-sage)]" />
                <span className="text-[10px] font-bold text-[var(--color-sage)] font-[var(--font-mono)]">
                  Explainer: What do these frameworks mean?
                </span>
              </div>
              <div className="space-y-3 text-[10.5px] leading-relaxed text-[var(--color-muted)]">
                <div className="space-y-0.5">
                  <div className="font-bold text-[var(--color-ink)] flex items-center gap-1">
                    <Brain className="w-3.5 h-3.5 text-[var(--color-sage)]" />
                    <span>Anti-Forgetfulness Planner</span>
                    <span className="text-[9px] font-medium bg-[var(--color-sage-soft)] text-[var(--color-sage)] px-1.5 py-0.5 rounded">Amnesia-Proof</span>
                  </div>
                  <p className="text-[var(--color-muted)]">
                    Saves and restores exact application context. Keeps lists, files, and state perfectly preserved so you can resume focus immediately without forgetting where you were.
                  </p>
                </div>
                <div className="space-y-0.5">
                  <div className="font-bold text-[var(--color-ink)] flex items-center gap-1">
                    <Folder className="w-3.5 h-3.5 text-amber-600" />
                    <span>Gentle Low-Pressure Organizer</span>
                    <span className="text-[9px] font-medium bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">PDA-Friendly</span>
                  </div>
                  <p className="text-[var(--color-muted)]">
                    Built around PDA (Pathological Demand Avoidance). Swaps rigid direct requirements (&quot;MUST DO&quot;) for gentle, collaborative suggested draft options to bypass cognitive task-paralysis.
                  </p>
                </div>
                <div className="space-y-0.5">
                  <div className="font-bold text-[var(--color-ink)] flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-[var(--color-sage)]" />
                    <span>Calming Visual Dashboard</span>
                    <span className="text-[9px] font-medium bg-[var(--color-sage-soft)] text-[var(--color-sage)] px-1.5 py-0.5 rounded">Low-Arousal</span>
                  </div>
                  <p className="text-[var(--color-muted)]">
                    Sensory-friendly workspace. Uses soft tones and peaceful helper text instead of high-stimulus telemetry screens, blinking indicators, or stressful alerts.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* API Warning Check */}
          {isApiKeyMissing && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-xs text-center" id="warning">
              <span className="flex items-center justify-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <strong>API Setup Warning</strong>: Your LLM_API_KEY isn&apos;t injected yet. Go to <strong>Settings &gt; Secrets</strong> to enter your API key for full capability.
              </span>
            </div>
          )}

          {/* Action Trigger */}
          <button
            id="optimizer-translate-btn"
            onClick={handleOptimize}
            disabled={!inputPrompt.trim() || loading}
            className={`w-full py-3.5 px-4 font-semibold text-sm rounded-xl transition-all flex items-center justify-center space-x-2 border cursor-pointer ${
              loading
                ? "bg-[var(--color-canvas)] border-[var(--color-hairline)] text-[var(--color-muted)] cursor-not-allowed"
                : "btn-pill"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[var(--color-sage)]" />
                <span className="font-[var(--font-mono)] text-xs">{stage || "Advocate thinking..."}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Optimize Prompt Spec</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </>
            )}
          </button>
        </div>

        {/* Local History Drawer Panel */}
        <div className="card-shell p-5 flex-1 flex flex-col space-y-3" id="history-panel">
          <div className="flex justify-between items-center" id="history-header">
            <h3 className="text-xs font-semibold text-[var(--color-muted)] flex items-center space-x-2">
              <History className="w-3.5 h-3.5" />
              <span>Session History ({history.length})</span>
            </h3>
            {history.length > 0 && (
              <button
                id="clear-history-btn"
                onClick={handleClearHistory}
                className="text-[10px] text-rose-500 hover:text-rose-400 cursor-pointer font-medium"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 max-h-[220px]" id="history-log">
            {history.length === 0 ? (
              <div className="h-full flex items-center justify-center border border-dashed border-[var(--color-hairline)] rounded-lg p-6">
                <p className="text-xs text-[var(--color-muted)] text-center font-medium">
                  Optimized specs will appear here.<br />Compare speed and inputs.
                </p>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => loadFromHistory(item)}
                  className="p-3 bg-[var(--color-surface-solid)] border border-[var(--color-hairline)] rounded-lg hover:border-[var(--color-hairline-strong)] transition-all cursor-pointer group flex justify-between items-center"
                >
                  <div className="space-y-1 overflow-hidden pr-3">
                    <p className="text-xs text-[var(--color-ink)] truncate">
                      {item.inputPrompt}
                    </p>
                    <div className="flex items-center space-x-2 text-[10px] text-[var(--color-muted)] font-[var(--font-mono)]">
                      <span>{item.timestamp}</span>
                      <span>•</span>
                      <span className="text-[var(--color-sage)]">{item.modelUsed.replace("models/", "")}</span>
                      <span>•</span>
                      <span className="text-[var(--color-sage)]">{(item.speedMs / 1000).toFixed(1)}s</span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--color-muted)] group-hover:text-[var(--color-sage)] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right panel: Output workbench */}
      <div className="col-span-1 lg:col-span-7 h-full flex flex-col">
        <div className="card-shell flex-1 flex flex-col overflow-hidden" id="workspace-report">
          {/* Workbench stats & headers */}
          <div className="px-5 py-3 border-b border-[var(--color-hairline)] flex flex-wrap gap-4 justify-between items-center bg-[var(--color-canvas)]" id="report-meta-header">
            <div className="flex items-center space-x-2">
              <span className="p-1 px-1.5 rounded bg-[var(--color-sage-soft)] border border-[var(--color-sage)]/15 text-[var(--color-sage)] font-[var(--font-mono)] text-xs">B</span>
              <span className="text-sm font-semibold text-[var(--color-ink)]">Advocate Specification &amp; Shield Workbench</span>
            </div>
            <div className="flex items-center space-x-3 text-[10px] font-[var(--font-mono)] text-[var(--color-muted)]">
              {result && (
                <button
                  id="header-copy-prompt-btn"
                  onClick={handleCopyPrompt}
                  className="flex items-center space-x-1.5 px-2.5 py-1 text-xs rounded-lg bg-[var(--color-sage)] hover:bg-[var(--color-sage-glow)] text-white font-[var(--font-sans)] font-bold shadow-sm transition-all cursor-pointer"
                  title="Copy the synthesized Advocate Prompt to your clipboard"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </button>
              )}
              <span className="bg-[var(--color-sage-soft)] text-[var(--color-sage)] px-2 py-0.5 border border-[var(--color-sage)]/15 rounded-lg">
                {result ? currentModelUsed : "Guidelines Active"}
              </span>
              <span className="bg-[var(--color-sage-soft)] text-[var(--color-sage)] px-2 py-0.5 border border-[var(--color-sage)]/15 rounded-lg">
                {result ? `${(speedMs / 1000).toFixed(2)}s` : "0.0s IDLE"}
              </span>
            </div>
          </div>

          {/* Workplace Tabs */}
          <div className="flex border-b border-[var(--color-hairline)] bg-[var(--color-canvas)]/50 overflow-x-auto" id="report-workplace-tabs-container">
            <button
              id="opt-tab-ssot-audit"
              onClick={() => setActiveWorkspaceTab("ssot_audit")}
              className={`flex-1 py-3 px-3 text-xs md:text-sm font-semibold transition-all border-b-2 text-center flex items-center justify-center space-x-2 shrink-0 cursor-pointer ${
                activeWorkspaceTab === "ssot_audit"
                  ? "border-[var(--color-sage)] text-[var(--color-ink)]"
                  : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[var(--color-sage)] opacity-90" />
              <span>Feature &amp; Idea Audit</span>
            </button>
            <button
              id="opt-tab-prompt"
              onClick={() => setActiveWorkspaceTab("prompt")}
              className={`flex-1 py-3 px-3 text-xs md:text-sm font-semibold transition-all border-b-2 text-center flex items-center justify-center space-x-2 shrink-0 cursor-pointer ${
                activeWorkspaceTab === "prompt"
                  ? "border-[var(--color-sage)] text-[var(--color-ink)]"
                  : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              }`}
            >
              <FileText className="w-4 h-4 opacity-70" />
              <span>Optimized Prompt</span>
            </button>
            <button
              id="opt-tab-architecture"
              onClick={() => setActiveWorkspaceTab("architecture")}
              className={`flex-1 py-3 px-3 text-xs md:text-sm font-semibold transition-all border-b-2 text-center flex items-center justify-center space-x-2 shrink-0 cursor-pointer ${
                activeWorkspaceTab === "architecture"
                  ? "border-[var(--color-sage)] text-[var(--color-ink)]"
                  : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              }`}
            >
              <ShieldAlert className="w-4 h-4 opacity-70" />
              <span>Risk &amp; Intent</span>
            </button>
            {(!result || result?.executionSkeleton) && (
              <button
                id="opt-tab-skeleton"
                onClick={() => setActiveWorkspaceTab("skeleton")}
                className={`flex-1 py-3 px-3 text-xs md:text-sm font-semibold transition-all border-b-2 text-center flex items-center justify-center space-x-2 shrink-0 cursor-pointer ${
                  activeWorkspaceTab === "skeleton"
                    ? "border-[var(--color-sage)] text-[var(--color-ink)]"
                    : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                }`}
              >
                <BadgeHelp className="w-4 h-4 opacity-70" />
                <span>Folder Skeleton</span>
              </button>
            )}
            <button
              id="opt-tab-loop"
              onClick={() => setActiveWorkspaceTab("loop")}
              className={`flex-1 py-3 px-3 text-xs md:text-sm font-semibold transition-all border-b-2 text-center flex items-center justify-center space-x-2 shrink-0 cursor-pointer ${
                activeWorkspaceTab === "loop"
                  ? "border-[var(--color-sage)] text-[var(--color-ink)]"
                  : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              }`}
            >
              <RefreshCw className="w-4 h-4 text-[var(--color-sage)] opacity-80" />
              <span>Feedback Loop</span>
            </button>
            <button
              id="opt-tab-memory"
              onClick={() => setActiveWorkspaceTab("memory")}
              className={`flex-1 py-3 px-3 text-xs md:text-sm font-semibold transition-all border-b-2 text-center flex items-center justify-center space-x-2 shrink-0 cursor-pointer ${
                activeWorkspaceTab === "memory"
                  ? "border-[var(--color-sage)] text-[var(--color-ink)]"
                  : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              }`}
            >
              <Database className="w-4 h-4 text-[var(--color-sage)] opacity-80" />
              <span>Local Storage Vault</span>
            </button>
          </div>

            {/* Workbench Workspace Content */}
            <div className="p-5 flex-1 overflow-y-auto space-y-5" id="report-tabs-content">
              {/* TAB 0: IMPULSIVITY SHIELD & SSOT */}
              {activeWorkspaceTab === "ssot_audit" && (
                <ImpulsivityShield currentInputPrompt={inputPrompt} />
              )}

              {/* UNIVERSAL EMPTY SPEC STATE */}
              {!result && ["prompt", "architecture", "skeleton", "loop"].includes(activeWorkspaceTab) && (
                <div className="border border-dashed border-[var(--color-hairline)] rounded-xl p-12 h-80 flex flex-col items-center justify-center text-center space-y-4 bg-[var(--color-canvas)]/30 shadow-inner" id="report-empty-panel">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--color-sage-soft)] border border-[var(--color-sage)]/10 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-[var(--color-sage)]" />
                  </div>
                  <div className="max-w-md space-y-1.5">
                    <h3 className="text-sm font-semibold text-[var(--color-ink)]">Waiting for Advocate Spec</h3>
                    <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                      Provide a raw, fuzzy intent description on the left-hand panel and select <b>Optimize Prompt Spec</b> to process and unlock this section.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 1: ADVOCATE PROMPT */}
              {activeWorkspaceTab === "prompt" && result && (
                <div className="space-y-4" id="advocate-prompt-view">

                  {/* Pipeline Hand-Holding Explainer Card */}
                  <div className="card-core p-4 space-y-3 text-xs leading-relaxed" id="prompt-copypaste-handholding">
                    <p className="text-[var(--color-sage)] font-semibold flex items-center space-x-1.5">
                      <HelpCircle className="w-4 h-4" />
                      <span>How to Use This Synthesized Prompt Spec (The Copy-Paste Workflow)</span>
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11px] text-[var(--color-muted)]">
                      <div className="p-3 bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-lg flex flex-col justify-start">
                        <span className="font-[var(--font-mono)] text-[var(--color-sage)] block mb-1 font-bold">1. Copy Compiled Prompt</span>
                        <p className="text-[var(--color-muted)] leading-relaxed">
                          Click <b className="text-[var(--color-ink)]">&quot;Copy Prompt&quot;</b> below to capture the structured, guardrailed markdown specification.
                        </p>
                      </div>
                      <div className="p-3 bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-lg flex flex-col justify-start">
                        <span className="font-[var(--font-mono)] text-[var(--color-sage)] block mb-1 font-bold">2. Run in External Agent</span>
                        <p className="text-[var(--color-muted)] leading-relaxed">
                          Open your developer chat agent (such as <b>Claude 3.5 Sonnet</b> or <b>GPT-4o</b>) and paste the exact instructions. Hit Enter.
                        </p>
                      </div>
                      <div className="p-3 bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-lg flex flex-col justify-start">
                        <span className="font-[var(--font-mono)] text-[var(--color-sage)] block mb-1 font-bold">3. Paste Back to Validate</span>
                        <p className="text-[var(--color-muted)] leading-relaxed">
                          Bring their code back here into the <b className="text-[var(--color-sage)] font-bold">Interactive Loop</b> tab. We will audit any corner cutting dynamically.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Session Version Stack Cycler */}
                  <div className="card-core p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3" id="session-version-stack-cycler">
                    <div className="space-y-1 text-left">
                      <span className="text-[9px] font-[var(--font-mono)] font-bold bg-[var(--color-sage-soft)] text-[var(--color-sage)] border border-[var(--color-sage)]/15 px-2.5 py-1.5 rounded-lg">
                        Prompt History Stack
                      </span>
                      <h4 className="text-xs font-bold text-[var(--color-ink)] flex items-center gap-1">
                        <span>Active Session Version Control</span>
                        <span className="text-[10px] text-[var(--color-muted)] font-normal">({history.length} versions tracked)</span>
                      </h4>
                      {(() => {
                        const idx = history.findIndex(item => item.id === activeHistoryId);
                        const item = history[idx];
                        if (!item) return null;
                        return (
                          <p className="text-[10px] text-[var(--color-muted)] truncate max-w-sm sm:max-w-md italic leading-normal">
                            Origin input: &quot;{item.inputPrompt}&quot;
                          </p>
                        );
                      })()}
                    </div>

                    <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                      {(() => {
                        const currentIndex = history.findIndex(item => item.id === activeHistoryId);
                        const hasPrev = currentIndex < history.length - 1;
                        const hasNext = currentIndex > 0;

                        return (
                          <>
                            {/* Undo / Older version */}
                            <button
                              id="version-stack-undo-btn"
                              disabled={!hasPrev}
                              onClick={() => {
                                if (hasPrev) {
                                  const prevItem = history[currentIndex + 1];
                                  loadFromHistory(prevItem);
                                }
                              }}
                              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-[10.5px] font-semibold bg-[var(--color-canvas)] border border-[var(--color-hairline)] hover:bg-[var(--color-canvas-2)] text-[var(--color-sage)] transition-all cursor-pointer disabled:opacity-20 disabled:pointer-events-none font-[var(--font-sans)]"
                              title="Undo last change / Load previous version"
                            >
                              <Undo className="w-3.5 h-3.5 shrink-0" />
                              <span>Undo / Older</span>
                            </button>

                            <div className="bg-[var(--color-canvas)] px-3 py-1.5 rounded-lg border border-[var(--color-hairline)] font-[var(--font-mono)] text-xs text-[var(--color-ink)] font-bold select-none text-center min-w-[55px]">
                              {currentIndex !== -1 ? history.length - currentIndex : "?"} / {history.length}
                            </div>

                            {/* Redo / Newer version */}
                            <button
                              id="version-stack-redo-btn"
                              disabled={!hasNext}
                              onClick={() => {
                                if (hasNext) {
                                  const nextItem = history[currentIndex - 1];
                                  loadFromHistory(nextItem);
                                }
                              }}
                              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-[10.5px] font-semibold bg-[var(--color-canvas)] border border-[var(--color-hairline)] hover:bg-[var(--color-canvas-2)] text-[var(--color-sage)] transition-all cursor-pointer disabled:opacity-20 disabled:pointer-events-none font-[var(--font-sans)]"
                              title="Redo next change / Load newer version"
                            >
                              <span>Newer / Redo</span>
                              <Redo className="w-3.5 h-3.5 shrink-0" />
                            </button>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="flex justify-between items-center" id="advocate-prompt-view-header">
                    <p className="text-xs text-[var(--color-sage)] font-[var(--font-mono)] flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5" />
                      COPY THIS PROMPT DIRECTLY INTO YOUR WORKER LLM
                    </p>
                    <button
                      id="copy-advocate-prompt-btn"
                      onClick={handleCopyPrompt}
                      className="flex items-center space-x-1.5 px-3 py-1.5 text-xs rounded-lg bg-[var(--color-canvas)] border border-[var(--color-hairline)] hover:bg-[var(--color-canvas-2)] text-[var(--color-ink)] transition-all cursor-pointer font-medium"
                    >
                      {copiedPrompt ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[var(--color-sage)]" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 bg-[var(--color-surface-solid)] border border-[var(--color-hairline)] rounded-xl max-h-[460px] overflow-y-auto relative text-sm text-[var(--color-ink)]" id="prompt-content-block">
                    <pre className="whitespace-pre-wrap text-xs md:text-sm leading-relaxed font-[var(--font-sans)]">
                      {result.advocatePrompt}
                    </pre>
                  </div>

                  {/* Inline GuidelineGuard Prompt Output Safety Verification */}
                  {(() => {
                    const scan = SkillSpectorEngine.scan({ "advocate_prompt.txt": result.advocatePrompt });
                    const isClean = scan.findings.length === 0;
                    return (
                      <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                        isClean
                          ? "bg-[var(--color-sage-soft)] border-[var(--color-sage)]/20 text-[var(--color-sage)]"
                          : "bg-amber-50 border-amber-200 text-amber-700"
                      }`} id="inline-prompt-safety-banner">
                        <div className="flex items-center space-x-2">
                          <ShieldCheck className="w-4 h-4 shrink-0" />
                          <div>
                            <span className="font-semibold block text-[11px]">GuidelineGuard Output Guard</span>
                            <span className="text-[10.5px] opacity-90">
                              {isClean
                                ? "Implicit safety audit passed. No hidden HTML comments, prompt-injections, or steganography resolved."
                                : `Warning: ${scan.findings.length} potential guidelines bypass anomalies flagged in compiled prompt.`
                              }
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-[var(--font-mono)] px-2 py-0.5 rounded bg-[var(--color-canvas)] border border-[var(--color-hairline)] shrink-0">
                          {isClean ? "100% SECURE" : "UNSAFE VECTOR"}
                        </span>
                      </div>
                    );
                  })()}

                  {/* PROMPT ENGINEERING AUDIT BOARD */}
                  {(() => {
                    const metrics = evaluatePromptEngineeringMetrics(result.advocatePrompt);

                    let rankBadge = "Prompt Initiate";
                    let rankColor = "text-[var(--color-muted)] bg-[var(--color-canvas)] border-[var(--color-hairline)]";
                    let rankDesc = "Your prompt possesses baseline syntax. Unlock advanced reasoning levels by requiring Chain-of-Thought paths.";

                    if (metrics.overall >= 90) {
                      rankBadge = "Elite Promptsmith";
                      rankColor = "text-[var(--color-sage)] bg-[var(--color-sage-soft)] border-[var(--color-sage)]/20";
                      rankDesc = "Structurally elite! Features full boundary guarding and chain-of-thought scaffolds, ensuring absolute compliance.";
                    } else if (metrics.overall >= 75) {
                      rankBadge = "Reasoning Adept";
                      rankColor = "text-[var(--color-sage-glow)] bg-[var(--color-sage-soft)] border-[var(--color-sage)]/15";
                      rankDesc = "Exceptional reasoning structure. Forcing the AI to think step-by-step prevents output hallucinations successfully.";
                    } else if (metrics.overall >= 55) {
                      rankBadge = "Zero-Shot Whisperer";
                      rankColor = "text-[var(--color-sage)] bg-[var(--color-sage-soft)] border-[var(--color-sage)]/20";
                      rankDesc = "Solid context framework. Adding few-shot templates or precise error boundaries will push it to legendary tiers.";
                    } else if (metrics.overall >= 35) {
                      rankBadge = "Context Apprentice";
                      rankColor = "text-amber-700 bg-amber-50 border-amber-200";
                      rankDesc = "Basic persona scaffolding detected. Add detailed output schemas or formatting guardrails to level up.";
                    }

                    return (
                      <div className="card-core space-y-5 shadow-inner" id="engineering-multiplier-console">

                        {/* Header showcasing Rank Level up */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--color-hairline)] pb-4">
                          <div className="space-y-1">
                            <span className="text-[10px] font-[var(--font-mono)] text-[var(--color-sage)] font-bold flex items-center space-x-1">
                              <Award className="w-4 h-4 mr-1" />
                              <span>Prompt Engineering Quotient Audit</span>
                            </span>
                            <h3 className="text-xs font-bold text-[var(--color-ink)] font-[var(--font-sans)]">
                              Universal Prompt Power Quotient
                            </h3>
                          </div>

                          {/* Gamified Merit Rank */}
                          <div className={`px-3 py-1.5 rounded-xl border font-[var(--font-mono)] text-[11px] font-bold flex items-center space-x-2 shrink-0 shadow-sm ${rankColor}`}>
                            <span>Rank:</span>
                            <span>{rankBadge}</span>
                          </div>
                        </div>

                        {/* Split Metric Display */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">

                          {/* Radial Metric / Meter Circle */}
                          <div className="md:col-span-4 flex flex-col items-center justify-center bg-[var(--color-canvas)]/30 p-4 border border-[var(--color-hairline)] rounded-xl space-y-3 text-center">
                            <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-[var(--color-surface-solid)] border-4 border-dashed border-[var(--color-sage)]/20 shadow-sm">
                              <span className="text-2xl font-[var(--font-mono)] font-bold text-[var(--color-sage)]">{metrics.overall}</span>
                              <span className="text-[9px] font-[var(--font-mono)] text-[var(--color-muted)] absolute bottom-3 uppercase tracking-wider">Index</span>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[11px] text-[var(--color-muted)] px-1">
                                &quot;{rankDesc}&quot;
                              </p>
                              <div className="text-[10px] font-[var(--font-mono)] text-[var(--color-muted)] mt-1 flex items-center justify-center space-x-1.5 opacity-75">
                                <Rocket className="w-3 h-3" />
                                <span>{metrics.overall * 12} XP gained</span>
                                <span>•</span>
                                <span>Level {Math.floor(metrics.overall / 20) + 1}</span>
                              </div>
                            </div>
                          </div>

                          {/* Individual Progress bars */}
                          <div className="md:col-span-8 space-y-3">

                            {/* 1. Persona Contextualizer */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] font-medium text-[var(--color-muted)]">
                                <span className="transition-colors flex items-center space-x-1 cursor-pointer hover:text-[var(--color-sage)]">
                                  <User className="w-3 h-3" />
                                  <span>1. Persona Contextualizer</span>
                                </span>
                                <span className="font-[var(--font-mono)] text-[var(--color-sage)] font-bold">{metrics.personaScore}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-[var(--color-canvas)] rounded-full overflow-hidden border border-[var(--color-hairline)]">
                                <div
                                  className="h-full bg-[var(--color-sage)] rounded-full transition-all duration-500"
                                  style={{ width: `${metrics.personaScore}%` }}
                                />
                              </div>
                            </div>

                            {/* 2. Step-by-Step Thinking (Chain of Thought) */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] font-medium text-[var(--color-muted)]">
                                <span className="transition-colors flex items-center space-x-1 cursor-pointer hover:text-[var(--color-sage)]">
                                  <Brain className="w-3 h-3" />
                                  <span>2. Step-by-Step Thinking (CoT)</span>
                                </span>
                                <span className="font-[var(--font-mono)] text-[var(--color-sage-glow)] font-bold">{metrics.cotScore}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-[var(--color-canvas)] rounded-full overflow-hidden border border-[var(--color-hairline)]">
                                <div
                                  className="h-full bg-[var(--color-sage-glow)] rounded-full transition-all duration-500"
                                  style={{ width: `${metrics.cotScore}%` }}
                                />
                              </div>
                            </div>

                            {/* 3. Few-Shot Exemplification */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] font-medium text-[var(--color-muted)]">
                                <span className="transition-colors flex items-center space-x-1 cursor-pointer hover:text-[var(--color-sage)]">
                                  <FileText className="w-3 h-3" />
                                  <span>3. Few-Shot Exemplification</span>
                                </span>
                                <span className="font-[var(--font-mono)] text-[var(--color-sage)] font-bold">{metrics.fewShotScore}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-[var(--color-canvas)] rounded-full overflow-hidden border border-[var(--color-hairline)]">
                                <div
                                  className="h-full bg-[var(--color-sage)] rounded-full transition-all duration-500"
                                  style={{ width: `${metrics.fewShotScore}%` }}
                                />
                              </div>
                            </div>

                            {/* 4. Boundary & Guard Limits */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] font-medium text-[var(--color-muted)]">
                                <span className="transition-colors flex items-center space-x-1 cursor-pointer hover:text-[var(--color-sage)]">
                                  <Shield className="w-3 h-3" />
                                  <span>4. Boundary &amp; Guard Limits</span>
                                </span>
                                <span className="font-[var(--font-mono)] text-amber-600 font-bold">{metrics.guardingScore}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-[var(--color-canvas)] rounded-full overflow-hidden border border-[var(--color-hairline)]">
                                <div
                                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                                  style={{ width: `${metrics.guardingScore}%` }}
                                />
                              </div>
                            </div>

                            {/* 5. Syntax & Output Strictness */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] font-medium text-[var(--color-muted)]">
                                <span className="transition-colors flex items-center space-x-1 cursor-pointer hover:text-[var(--color-sage)]">
                                  <Scroll className="w-3 h-3" />
                                  <span>5. Syntax &amp; Output Strictness</span>
                                </span>
                                <span className="font-[var(--font-mono)] text-[var(--color-sage)] font-bold">{metrics.outputScore}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-[var(--color-canvas)] rounded-full overflow-hidden border border-[var(--color-hairline)]">
                                <div
                                  className="h-full bg-[var(--color-sage)] rounded-full transition-all duration-500"
                                  style={{ width: `${metrics.outputScore}%` }}
                                />
                              </div>
                            </div>

                          </div>

                        </div>

                        {/* SYSTEM GLOSSARY & FEATURES PANEL */}
                        <div className="card-core space-y-2 text-xs">
                          <p className="text-[10.5px] font-[var(--font-mono)] text-[var(--color-sage)] font-bold flex items-center space-x-1.5">
                            <span className="pulse-dot" />
                            <span>System Glossary &amp; Reference Guide</span>
                          </p>
                          <p className="text-[10px] text-[var(--color-muted)] leading-normal">
                            Here is a plain-language handbook deciphering each of the optimized prompt dimensions:
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5 pt-2 text-[10px] text-[var(--color-muted)] leading-relaxed border-t border-[var(--color-hairline)]">
                            <div>
                              <p className="font-semibold text-[var(--color-ink)] font-[var(--font-mono)]">1. Persona Contextualizer</p>
                              <p className="block mb-1">Assigns a precise expert role (e.g. Architect, Specialist) to the AI to align its tone and level of detail.</p>
                            </div>
                            <div>
                              <p className="font-semibold text-[var(--color-sage-glow)] font-[var(--font-mono)]">2. Chain-of-Thought Scaffolding</p>
                              <p className="block mb-1">Forces step-by-step logic planning inside the thought block, reducing mistakes and code hallucinations.</p>
                            </div>
                            <div>
                              <p className="font-semibold text-[var(--color-sage)] font-[var(--font-mono)]">3. Few-Shot Exemplification</p>
                              <p className="block mb-1">Feeds exemplary inputs and expected output structures to guide precise formatting without guessing.</p>
                            </div>
                            <div>
                              <p className="font-semibold text-amber-600 font-[var(--font-mono)]">4. Boundary &amp; Guard Limits</p>
                              <p className="block mb-1">Explicitly defines what the AI should NOT do, preventing unrequested features or messy styling.</p>
                            </div>
                            <div>
                              <p className="font-semibold text-[var(--color-sage)] font-[var(--font-mono)]">5. Syntax &amp; Output Strictness</p>
                              <p className="block mb-1">Enforces specific output patterns (JSON or markdown structure) for seamless system parsing.</p>
                            </div>
                            <div>
                              <p className="font-semibold text-[var(--color-sage)] font-[var(--font-mono)]">6. Client SQL Sandbox</p>
                              <p className="block mb-1">Lets you query saved prompt templates using standard SQL queries, right inside the Database tab.</p>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })()}

                  {/* PROMPT CALIBER RATING & MEMORY ARCHIVER PANEL */}
                  <div className="card-core space-y-3" id="caliber-rating-panel">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[var(--color-sage-soft)] border border-[var(--color-sage)]/15 text-[var(--color-sage)] font-[var(--font-mono)] text-xs font-bold shrink-0">
                          {result.promptScore || 85}%
                        </div>
                        <div>
                          <p className="text-[10px] font-[var(--font-mono)] text-[var(--color-sage)] font-bold">
                            Prompt Formulation Caliber
                          </p>
                          <h4 className="text-xs font-bold text-[var(--color-ink)] mt-0.5 flex items-center space-x-1.5">
                            <span className={`w-2 h-2 rounded-full ${
                              (result.promptScore || 85) >= 90 ? 'bg-amber-400' : 'bg-[var(--color-sage)]'
                            }`} />
                            <span>{(result.caliberStatus || 'exceptional').toUpperCase()} PATTERN TYPE</span>
                          </h4>
                        </div>
                      </div>

                      {/* Sync button */}
                      <button
                        onClick={handleSaveToMemory}
                        disabled={isSavedToMemory}
                        className={`py-2 px-3.5 text-xs font-semibold rounded-lg flex items-center space-x-1.5 border transition-all ${
                          isSavedToMemory
                            ? "bg-[var(--color-sage-soft)] border-[var(--color-sage)]/30 text-[var(--color-sage)] cursor-default"
                            : "bg-[var(--color-surface-solid)] border-[var(--color-hairline)] hover:border-[var(--color-hairline-strong)] text-[var(--color-ink)] hover:bg-[var(--color-canvas)] cursor-pointer"
                        }`}
                      >
                        <Database className="w-3.5 h-3.5" />
                        <span>{isSavedToMemory ? "Synced & Saved" : "Save to Local Vault & Database"}</span>
                      </button>
                    </div>

                    <p className="text-xs text-[var(--color-muted)] italic leading-relaxed bg-[var(--color-canvas)]/40 p-2.5 rounded-lg border border-[var(--color-hairline)]">
                      <Lightbulb className="w-3.5 h-3.5 inline mr-1 text-[var(--color-sage)]" />
                      {result.shouldSaveAdvisory || "Outstanding pattern formulation with complete structural guarantees. Ready to be committed to your local RAG template workspace."}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: ARCHITECTURE (INTENT & RISK) */}
              {activeWorkspaceTab === "architecture" && result && (
                <div className="space-y-5" id="architecture-view">
                  {/* Intent Diagnosis */}
                  <div className="card-core p-4 space-y-2 bg-[var(--color-sage-soft)]/30 border-[var(--color-sage)]/15">
                    <div className="flex items-center space-x-2 text-[var(--color-sage)]">
                      <Sparkles className="w-4 h-4" />
                      <h4 className="text-xs font-semibold font-[var(--font-sans)]">
                        Latent Intent Extracted
                      </h4>
                    </div>
                    <p className="text-[var(--color-muted)] text-sm leading-relaxed">
                      {result.intentDiagnosis}
                    </p>
                  </div>

                  {/* Risks & Mitigations */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-[var(--color-muted)] flex items-center space-x-1.5 pl-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Mitigated Failure Modes</span>
                    </h4>
                    <div className="grid grid-cols-1 gap-2.5">
                      {result.llmRiskAnalysis.map((risk, index) => (
                        <div
                          key={index}
                          className="card-core p-3 text-xs flex items-start space-x-3"
                          id={`risk-item-${index}`}
                        >
                          <div className="p-1 px-1.5 rounded-md bg-[var(--color-sage-soft)] border border-[var(--color-sage)]/15 text-[var(--color-sage)] font-[var(--font-mono)] text-[10px] font-bold mt-0.5 shrink-0">
                            {String(index + 1).padStart(2, '0')}
                          </div>
                          <div className="space-y-1">
                            <span className="text-[var(--color-muted)] leading-relaxed">{risk}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Next Step Recommended Action Guide */}
                  <div className="card-core p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 bg-[var(--color-sage-soft)]/30 border-[var(--color-sage)]/15" id="prompt-compiler-next-action-card">
                    <div className="space-y-1.5 text-left max-w-xl">
                      <div className="flex items-center space-x-2">
                        <span className="pulse-dot" />
                        <span className="text-[10px] font-[var(--font-mono)] font-bold text-[var(--color-sage)]">Recommended Next Step</span>
                      </div>
                      <h4 className="text-sm font-bold text-[var(--color-ink)]">
                        Proceed to Stage 2: Sandbox Chat or Stage 4: Local File Scaffold
                      </h4>
                      <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                        You have successfully compiled your system specifications! Now, you should open the <strong>Sandbox Chat</strong> to co-design and compile your layout with your worker model, or go to the <strong>Root Layout Boot</strong> to boot your workspace folder structure.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto shrink-0">
                      <button
                        onClick={() => {
                          if (setActiveTab) {
                            setActiveTab("chat");
                          }
                        }}
                        className="btn-pill text-xs"
                      >
                        <MessageSquare className="w-4 h-4 shrink-0" />
                        <span>Go to Sandbox Chat</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (setActiveTab) {
                            setActiveTab("architecture");
                          }
                        }}
                        className="btn-ghost text-xs"
                      >
                        <FolderTree className="w-4 h-4 shrink-0" />
                        <span>Go to Layout Boot</span>
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: EXECUTION SKELETON */}
              {activeWorkspaceTab === "skeleton" && result && result.executionSkeleton && (
                <div className="space-y-3" id="skeleton-view">
                  <div className="pl-1">
                    <h4 className="text-xs font-semibold text-[var(--color-muted)]">
                      Synthesized System Workspace
                    </h4>
                    <p className="text-[11px] text-[var(--color-muted)]">
                      A structurally pristine architecture skeleton generated specifically for your LLM target workspace.
                    </p>
                  </div>

                  <SkeletonViewer rawSkeleton={result.executionSkeleton} />
                </div>
              )}

              {/* TAB 4: INTERACTIVE DEVELOPER-WORKER LOOP */}
              {activeWorkspaceTab === "loop" && result && (
                <RefinementLoop
                  originalPrompt={inputPrompt}
                  initialAdvocatePrompt={result.advocatePrompt}
                  thinkingMode={thinkingMode}
                  selectedModel={selectedModel}
                />
              )}

              {/* TAB 5: MOTHERDUCK & OBSIDIAN RAG WORKSPACE MEMORY VAULT */}
              {activeWorkspaceTab === "memory" && (
                <MemoryManager
                  history={history}
                  currentInputPrompt={inputPrompt}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
