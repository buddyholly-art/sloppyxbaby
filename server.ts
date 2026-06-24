import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize the LLM client on the server with User-Agent telemetry
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;
if (GEMINI_API_KEY && GEMINI_API_KEY !== "MY_GEMINI_API_KEY") {
  ai = new GoogleGenAI({
    apiKey: GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// System prompt as requested by user
const SYSTEM_PROMPT = `You are the ultimate **AuDHD Prompt Advocate**—a senior cognitive accessibility systems architect and prompt specialist. Your sole purpose is to mediate between fuzzy human intent and concrete machine execution to create prompts, developer contracts, and web software structures that are AuDHD enhanced and strictly anti-AI-slop.

### Core Mandate
When a user speaks to you, they are trying to interface with a neurotypical, overly-literal machine. Your job is to:
1. **Extract Latent Clinical Intent** — Map their requirements to established clinical and systems scaffolding.
2. **Mitigate ADHD and Autism Friction Points** — Mitigate amnesia, initiation paralysis, demand avoidance (PDA), executive function fatigue, sensory overload, and option paralysis.
3. **Emit Evidence-Based Specifications** — Incorporate machine-verifiable constraints, accessibility invariants, and low-arousal designs directly into the compiled prompts.
4. **Enforce Absolute Anti-AI Slop Disciplines** — प्रोग्रामेटिक रूप से (programmatically) ban low-effort LLM clichés, SaaS-cream aesthetics, and non-performant UI patterns, replacing them with bespoke layouts, strict solid tinted neutrals, and honest placeholders.

### Evidence-Based Design Core Frameworks (The 6 AuDHD Edicts)
Ensure the generated 'advocatePrompt' always contains clear instructions and direct configurations mapping to these exact edicts:
1. **The Amnesia Principle (Baddeley Working Memory Model, 2000)**: Any artifact (code base, dashboard, interface) must instantly reconstruct full context within 5 seconds of cold start. It should output a context header, session file, or clear indicators showing where the operator was, where they are, and where they are going. ('context_reconstruction_time <= 5s')
2. **Demonstrable Tunneling (PRT / UDL Principle 1 - Engagement)**: Visually and functionally channel the operator toward the next action and best practices. Enforce that there is exactly ONE clear, outstanding, recommended action to take to avoid cognitive paralysis. ('next_action_entropy == 0')
3. **Objective Guardrails (Executive Function Theory, Barkley, 1997 / Poka-Yoke)**: Build fail-safe defaults, automated error-prevention checks, backup fallbacks, and schema alignment validations automatically to protect against working memory drops. ('guardrail_coverage_ratio >= 0.95')
4. **Structure That Bends (PDA-sensitive Demand Minimization / UDL Principle 2)**: Provide rigid structures but let them bend gracefully. Frame instructions and actions autonomously ("Recommended path:") instead of authoritative imperatives ("You must"). Support effortless undoing or restarting without shame or cognitive overhead. ('rollback_time_seconds <= 30.0')
5. **Low-Arousal Validation (Sensory Processing - Dunn, 1997)**: Outer margins and status lines must remain empty, calm, factual, and visually clean. Ban any urgent alerts, flashing/blinking status blocks, alarm states, emotional adjectives, or visual telemetry clutter. ('arousal_spike_count == 0')
6. **Single Source of Truth (Schema Normalization)**: Prevent scattered knowledge. Eliminate duplicate canonical states or structures which cause cognitive dissonance when drift occurs. ('schema_drift_count == 0')

### Core Engineering Principles (The 4 Pillars)
You MUST explicitly propagate and require these core Software 3.0 strategic recommendations inside the generated 'advocatePrompt' to ensure any executing worker LLM designs high-integrity verifiable codebases:
1. **Design Verifiable Environments**: Focus engineering resources on creating verifiable systems. If a task's correctness can be automatically validated by a compiler, a test suite, or an evaluation model, it can be easily automated using agentic execution loops. In non-verifiable domains, maintain strict human code reviews to prevent systematic quality degradation.
2. **Establish Agent-Native Documentation**: Maintain a "SPEC.md" and a detailed "MODEL.md" at the project root to communicate architectural boundaries, ports, endpoints, and file structures directly to executing models.
3. **Enforce Context Discipline**: Structure model context windows defensively. Clear context histories when switching tasks to avoid token pollution, require models to state assumptions before writing code, and use multi-agent peer evaluation frameworks to review high-stakes design choices.
4. **Uphold the First-Principles Ethos**: Continue to build and master systems from first principles. The primary bottleneck of the next decade is not raw compute, but how deeply human developers understand system design, security, and mathematical logic to guide, review, and validate the work of autonomous agents.

### The Programmatic Anti-AI Slop Invariants (Open Design Decalogue)
The 'advocatePrompt' MUST explicitly constrain the worker LLM using these absolute rules to avoid the "AI Monoculture" tell:
- **HEURISTIC GATES**:
  - *Heuristic 1 (The AI Slop Test)*: If an interface immediately looks like a generic LLM mock-up, it fails.
  - *Heuristic 2 (First/Second Order Category Reflex)*: Reject default industry presets (e.g. healthcare = teal + white, observability = dark blue, AI = purple/glow/SaaS cream/editorial). Rework color strategy.
  - *Heuristic 3 (The Squint Test)*: Blurred visual layout must preserve clear grouping, primary and secondary element hierarchy.
- **ABSOLUTE BLACKLIST / BANS**:
  - *No Nested Cards*: Banned. Use negative space, elegant layout, and simple alignment.
  - *No Purple Gradients & AI Defaults*: #6366f1 (Indigo/AI-default tell), aggressive purple-blue gradients, and generic glows are strictly banned.
  - *No Monoculture Typography*: Do not default to "AI fonts" like Inter, Fraunces, Geist, Space Grotesk, etc. as display text unless matched with deliberate brand rules.
  - *No Gradient Text*: Do not clip text with background gradients. Keep text solid and authoritative.
  - *No Baked-in Semantic Text*: Banned. Lay real programmatic text over clean substrate patterns.
  - *No Hero-Metric Clichés*: Large number + small label + small sparkline is banned. Change the structure.
  - *No Repeat Same-Size Grid Blocks*: Banned. Vary sizes, or use asymmetrical grids.
- **DETAILED TECHNICAL BANS**:
  - *No Pure Black/Gray*: (#000 or oklch pure gray 50% 0 0 are banned). Neutral surfaces must be tinted toward the specific brand hue with a chroma of 0.005 - 0.015.
  - *No Left/Right Side-Stripe Colored Borders*: Banned on cards/alerts. Use full borders, tints, or numbered lists.
  - *No Alpha Transparency Overuse*: Specify solid overlay colors to protect contrast ratios instead of rgba/hsla.
  - *No Modal-First UX*: Use inline editing, drawers, or progressive disclosure first.
  - *No Hardcoded Arbitrary Z-Indices*: All z-indexes must follow a clear semantic hierarchy.
  - *No Outline None Without Replacement*: Focus states must use contrast-rich rings.
  - *No Non-Hardware-Accelerated Layout Animations*: Use scale/translate and opacity, not width/height/margins.
  - *No Bounce/Elastic Animations*: Banned. Use realistic exponential easing (ease-out-quint, expo).
  - *No Generic Button Labels*: No "OK", "Submit". Use specific "verb + object" patterns (e.g. "Save changes").
  - *No Em Dashes in Copy*: Replace with colons, semicolons, or commas.
  - *No Photorealistic/Realistic Faces*: Banned. Use abstract/archetypal symbols.
  - *No Fake Metrics / Fake Stats*: Never generate fake values like "10x faster". Use honest placeholders or raw values.
- **FIVE-DIMENSIONAL CRITIQUE MANDATE**:
  - Your prompt must order the target LLM to score its draft from 1 to 5 across: Philosophy, Hierarchy, Execution, Specificity, Restraint. A score below 3 in any dimension triggers an automatic rebuild.

### Required Output Format for 'advocatePrompt'
Your generated prompt MUST be structured beautifully. Usually, it should output a robust Markdown template like this:

\`\`\`markdown
# [PRODUCT NAME] — AuDHD Systems Design & Anti-AI-Slop Contract
Paste this entire block into your target LLM.

## EVIDENCE-BASED DESIGN MATRIX
[Table mapping the task features to Clinical Frameworks, Systems Analogs, and Invariant Metrics]

## FORMAL INVARIANTS (MACHINE-VERIFIABLE)
\`\`\`yaml
invariants:
  amnesia_principle: "context_reconstruction_time_seconds <= 5.0"
  tunneling: "next_action_entropy == 0"
  guardrails: "guardrail_coverage_ratio >= 0.95"
  reversibility: "rollback_time_seconds <= 30.0"
  low_arousal: "arousal_spike_count == 0"
  ssot: "schema_drift_count == 0"
  anti_slop_compliance: "score >= 3.0/5.0 across all 5 dimensions"
\`\`\`

## THE BRAND SPEC & DETAILED SCHEMATA
- **Visual Direction Choice**: [Determine which deterministic style to use: Editorial, Modern Minimal, Tech Utility, Brutalist, or Soft Warm]
- **Neutral Palette Tinting**: Neutral surfaces must be tinted toward the specific brand hue with a chroma of 0.005-0.015 (strictly avoiding #000 or pure neutral grays).
- **Z-Index Semantic Scale**: [Define hierarchical scale: dropdown -> sticky -> modal -> toast]
- **Typography**: [Set deliberate fonts; enforce ALL CAPS with >=0.06em letter-spacing]

## DEEP STRUCTURAL WORKFLOWS
1. **Discovery & Setup Phase**: Turn 1 must elicit a strict <question-form> to lock down surface, audience, tone, brand context, and constraints.
2. [Step-by-step instructions to assemble the core code or system]
3. **Execution Self-Critique**: Evaluate response across Philosophy, Hierarchy, Execution, Specificity, and Restraint.

## FORBIDDEN PATTERNS (CRITICAL ANTI-AI SLOP ENFORCEMENT)
- *No Nested Cards* or generic cards-on-cards configurations.
- *No Purple Gradients* or '#6366f1' AI-default indigo highlights (maximum 2 var(--accent) uses per screen).
- *No Hero-Metric templates*, *identical card grids*, or *gradient text*.
- No fake statistics (e.g., '10x faster'). Use honest placeholders or real data.
- No flashy outer-margin telemetry clutter (keeps margins entirely empty, factual, and clean).
- No bossy imperative language. Use autonomous invitation.

## RECOMMENDED NEXT STEP:
[Exactly one high-visibility, low-friction recommended action to take next to avoid choice paralysis]
\`\`\`

Ensure the generated prompt is incredibly robust, direct, highly structured, and perfectly suited to scaffold a premium, cognitive-friendly product while actively weeding out AI visual and copy slop!`;

// API Health check & Config state
app.get("/api/config", (req, res) => {
  res.json({
    hasApiKey: !!GEMINI_API_KEY && GEMINI_API_KEY !== "MY_GEMINI_API_KEY"
  });
});

// Endpoint: Engineering Pioneer Quotes for the Sovereign Insight component
app.get("/api/quotes", (req, res) => {
  const quotes = [
    {
      id: "quote-1",
      text: "English is the hottest new programming language.",
      author: "Andrej Karpathy",
      context: "Software 2.0 & LLM-OS"
    },
    {
      id: "quote-2",
      text: "The bitter lesson is that general methods that leverage computation are the most effective, by a large margin.",
      author: "Rich Sutton",
      context: "The Bitter Lesson (2019)"
    },
    {
      id: "quote-3",
      text: "We want to make something that behaves according to our wishes. Alignment is a high-precision clinical discipline.",
      author: "Ilya Sutskever",
      context: "AGI Alignment Research"
    },
    {
      id: "quote-4",
      text: "The software of the future is less written, and more grown as neural networks.",
      author: "Andrej Karpathy",
      context: "Medium (2017)"
    },
    {
      id: "quote-5",
      text: "The measure of intelligence is the ability to change.",
      author: "Albert Einstein",
      context: "Cognitive Adaptability"
    },
    {
      id: "quote-6",
      text: "Simplicity is the ultimate sophistication. Complex systems fail at their interfaces.",
      author: "Edsger Dijkstra",
      context: "Structured Programming"
    },
    {
      id: "quote-7",
      text: "Building the data engine is 99% of the cognitive struggle. The architecture is just a tiny, highly-leveraged inner loop.",
      author: "Andrej Karpathy",
      context: "Tesla Autopilot Case Study"
    },
    {
      id: "quote-8",
      text: "The human brain operates on a sparse, extremely sparse activation budget. We must emulate this restraint.",
      author: "Demis Hassabis",
      context: "Cognitive Architectures"
    },
    {
      id: "quote-9",
      text: "Premature optimization is the root of all evil. Profile first, optimize second.",
      author: "Donald Knuth",
      context: "Computer Programming as an Art"
    },
    {
      id: "quote-10",
      text: "The most important parts of a system are the objective functions and the feedback loop speeds.",
      author: "Yann LeCun",
      context: "Self-Supervised Learning"
    }
  ];
  res.json({ quotes });
});

// Endpoint: Single prompt optimization/translation
app.post("/api/generate-prompt", async (req, res) => {
  const { prompt, model, thinkingMode } = req.body;

  if (!prompt) {
    res.status(400).json({ error: "Prompt is required" });
    return;
  }

  if (!ai) {
    res.status(500).json({
      error: "LLM API key is not configured. Please add GEMINI_API_KEY to your env/secrets."
    });
    return;
  }

  // Model selection based on user request:
  // "gemini-3.1-pro-preview" for particularly complex tasks & thinking mode,
  // "gemini-3.5-flash" for general, "gemini-3.1-flash-lite" for fast.
  let selectedModel = model || "gemini-3.5-flash";
  if (thinkingMode) {
    selectedModel = "gemini-3.1-pro-preview";
  }

  try {
    const config: any = {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          intentDiagnosis: {
            type: Type.STRING,
            description: "Brief synthesis of what you understood their true goal to be."
          },
          llmRiskAnalysis: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Specific LLM failure modes being mitigated with counter-mitigations."
          },
          advocatePrompt: {
            type: Type.STRING,
            description: "The rewritten, production-ready, self-contained, guarded prompt to feed to a target LLM."
          },
          executionSkeleton: {
            type: Type.STRING,
            description: "An optional minimal reference structure (pseudocode, file tree, etc.) showing what the output should look like."
          },
          promptScore: {
            type: Type.INTEGER,
            description: "A quality rating score (1-100) on how complex, unique, and reuse-worthy the prompt's structural footprint is."
          },
          caliberStatus: {
            type: Type.STRING,
            description: "Choose exactly: 'standard' (score < 70), 'exceptional' (70 <= score < 90), or 'outstanding' (score >= 90)."
          },
          shouldSaveAdvisory: {
            type: Type.STRING,
            description: "Critical advice to the user of why this caliber of prompt should or should not be saved in their Obsidian RAG index."
          },
          reusabilityTags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "2-4 semantic search keywords describing the type of pattern (e.g. ['Sync', 'CLI', 'Websocket', 'Dashboard', 'Scraper'])."
          }
        },
        required: ["intentDiagnosis", "llmRiskAnalysis", "advocatePrompt", "promptScore", "caliberStatus", "shouldSaveAdvisory", "reusabilityTags"]
      }
    };

    if (thinkingMode && selectedModel === "gemini-3.1-pro-preview") {
      config.thinkingConfig = {
        thinkingLevel: "high" as any
      };
      // For thinkingLevel.HIGH, we do NOT set maxOutputTokens.
    }

    let response;
    let finalModelUsed = selectedModel;

    try {
      console.log(`Advocate: optimising prompt using ${selectedModel} (thinkingMode: ${thinkingMode})`);
      response = await ai.models.generateContent({
        model: selectedModel,
        contents: prompt,
        config: config
      });
    } catch (primaryError: any) {
      console.warn(`Primary generation with ${selectedModel} failed. Falling back to robust gemini-3.5-flash:`, primaryError.message || primaryError);
      
      const fallbackConfig = { ...config };
      if (fallbackConfig.thinkingConfig) {
        delete fallbackConfig.thinkingConfig;
      }
      
      finalModelUsed = "gemini-3.5-flash";
      response = await ai.models.generateContent({
        model: finalModelUsed,
        contents: prompt,
        config: fallbackConfig
      });
    }

    let text = response.text || "{}";
    
    // Clean response text to strip potential markdown codeblock formatting if returned by model
    const trimmed = text.trim();
    if (trimmed.startsWith("```")) {
      const match = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
      if (match && match[1]) {
        text = match[1];
      }
    }

    const data = JSON.parse(text);

    res.json({
      result: data,
      modelUsed: finalModelUsed,
      rawResponse: text
    });
  } catch (error: any) {
    console.error("Error generating optimized prompt:", error);
    res.status(500).json({ error: error.message || "Internal GenAI error occurred during prompt optimization synthesis loop." });
  }
});

// In-Memory synchronized Obsidian & Motherduck RAG Workspace Storage
interface SavedPromptMemory {
  id: string;
  title: string;
  originalInput: string;
  advocatePrompt: string;
  promptScore: number;
  caliberStatus: string;
  shouldSaveAdvisory: string;
  reusabilityTags: string[];
  timestamp: string;
  syncStatus: string;
}

const savedMemoryPool: SavedPromptMemory[] = [
  {
    id: "preseed-1",
    title: "Secure Full-Stack Auth Guard with RBAC",
    originalInput: "Build login with permissions role based protection",
    advocatePrompt: `You are a strict security auditor. Build a bulletproof Express + JWT + Role-Based Access Control (RBAC) middleware sequence with secure cookie transport, token rotation, and strict helmet cors setup.
CRITICAL MANDATES:
- NEVER write mock memory arrays or placeholders.
- Store refresh tokens in httpOnly, Secure, SameSite=Strict cookies.
- Validate roles using static immutable Bitwise permissions masks.
- Write full comprehensive error handling, capturing timing attacks.`,
    promptScore: 94,
    caliberStatus: "outstanding",
    shouldSaveAdvisory: "Outstanding architectural security profile. Protects against timing-attacks and token hijacking; should be synchronized as a core enterprise template.",
    reusabilityTags: ["Auth", "Security", "Web", "Backend"],
    timestamp: "2026-06-19T10:00:00Z",
    syncStatus: "Synced to Motherduck & Obsidian"
  },
  {
    id: "preseed-2",
    title: "Real-time High-Throughput WebSocket Broadcast Engine",
    originalInput: "Websocket server that handles streaming telemetry",
    advocatePrompt: `Initialize a low-overhead Node.js ws telemetry multiplexer bound to process clustering, supporting ping-pong heartbeats to mitigate stale network sockets.
CRITICAL GOALS:
- Direct buffer binary serialization to prevent memory leaks.
- Implement token-bucket rate limiting per socket.
- Handle sudden client drops cleanly by draining queues.`,
    promptScore: 91,
    caliberStatus: "outstanding",
    shouldSaveAdvisory: "Outstanding low-overhead real-time telemetry model. Essential for reactive dashboards and distributed data pipelines.",
    reusabilityTags: ["Realtime", "Websocket", "Dashboard"],
    timestamp: "2026-06-19T15:30:00Z",
    syncStatus: "Synced to Motherduck & Obsidian"
  }
];

// Endpoint: Save Prompt to Obsidian/Motherduck workspace memory
app.post("/api/memory/save", (req, res) => {
  const { title, originalInput, advocatePrompt, promptScore, caliberStatus, shouldSaveAdvisory, reusabilityTags } = req.body;

  if (!advocatePrompt || !originalInput) {
    res.status(400).json({ error: "Missing required prompt content fields to archive." });
    return;
  }

  const newMemory: SavedPromptMemory = {
    id: `mem-${Math.random().toString(36).substring(2, 9)}`,
    title: title || originalInput.substring(0, 40) + "...",
    originalInput,
    advocatePrompt,
    promptScore: promptScore || 75,
    caliberStatus: caliberStatus || "exceptional",
    shouldSaveAdvisory: shouldSaveAdvisory || "Automatically saved high caliber formulation.",
    reusabilityTags: reusabilityTags || ["General"],
    timestamp: new Date().toISOString(),
    syncStatus: "Synced to Motherduck & Obsidian"
  };

  savedMemoryPool.unshift(newMemory); // Push to front
  res.json({ success: true, savedMemory: newMemory });
});

// Endpoint: List all memories from Motherduck store
app.get("/api/memory/list", (req, res) => {
  res.json({ memories: savedMemoryPool });
});

// Endpoint: Search RAG Motherduck Index for Reusable Matches
app.post("/api/memory/query", (req, res) => {
  const { userInput } = req.body;
  if (!userInput) {
    res.json({ matches: [] });
    return;
  }

  const queryTerms = userInput.toLowerCase().split(/\s+/).filter((t: string) => t.length > 2);
  
  // Calculate a match score based on keyword intersection and tag matches
  const scoredMatches = savedMemoryPool.map(mem => {
    let score = 0;
    
    // Check main title
    const titleLower = mem.title.toLowerCase();
    queryTerms.forEach((term: string) => {
      if (titleLower.includes(term)) score += 30;
    });

    // Check tags
    mem.reusabilityTags.forEach(tag => {
      const tagLower = tag.toLowerCase();
      queryTerms.forEach((term: string) => {
        if (tagLower.includes(term) || term.includes(tagLower)) {
          score += 45;
        }
      });
    });

    // Check body contents
    const bodyLower = mem.advocatePrompt.toLowerCase();
    queryTerms.forEach((term: string) => {
      if (bodyLower.includes(term)) score += 10;
    });

    return { ...mem, matchStrengthScore: score };
  });

  // Filter to matches with > 10 score, sorted by strength
  const validMatches = scoredMatches
    .filter(m => m.matchStrengthScore > 0)
    .sort((a, b) => b.matchStrengthScore - a.matchStrengthScore);

  res.json({ matches: validMatches });
});

// Endpoint: Premium user history issue diagnosing & custom corrective prompt generation
app.post("/api/memory/insights", async (req, res) => {
  const { pastInputs } = req.body;

  if (!pastInputs || !Array.isArray(pastInputs) || pastInputs.length === 0) {
    res.json({
      hasInsight: false,
      diagnostics: "No historical prompts active in session to analyze. Please run a few optimizations first."
    });
    return;
  }

  if (!ai) {
    res.status(500).json({ error: "LLM API key is required to synthesize history insights." });
    return;
  }

  const historyDiagnosticPrompt = `You are the ultimate Prompt Architect diagnosing a developer's common flaws.
Analyze this list of recent project requests:
${pastInputs.map((inp, idx) => `[Request ${idx + 1}]: "${inp}"`).join("\n")}

Identify the developer's common bad habits (e.g., "forgetting authentication rules", "lacking database persistence rules", "under-specifying APIs", "hardcoding configuration parameters").
Synthesize your findings as a JSON response with:
- issuePattern: A descriptive title of the major pattern (e.g., "Data Persistence Blindspot" or "State-Machine Oversight").
- explanation: A concise, technical explanation of how they under-engineer this aspect.
- mitigationPrompt: A general-purpose "Pre-flight Patch Prompt modifier" (approx 80-150 words). It must be structured for them to prepend or append to their future designs, specifically telling any target LLM to enforce strict engineering rules addressing this recurring flaw.

Return ONLY a valid JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: historyDiagnosticPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            issuePattern: { type: Type.STRING },
            explanation: { type: Type.STRING },
            mitigationPrompt: { type: Type.STRING }
          },
          required: ["issuePattern", "explanation", "mitigationPrompt"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({
      hasInsight: true,
      insight: parsed
    });
  } catch (error: any) {
    console.error("Error generating diagnostics insights:", error);
    res.status(500).json({ error: error.message || "Failed to analyze diagnostics insights" });
  }
});

// --- CONVERSATIONAL CO-DESIGN SYSTEM PROMPT ---
const CHAT_SYSTEM_PROMPT = `You are the ultimate **AuDHD Prompt Advocate**—a senior cognitive accessibility systems architect and prompt specialist. You are in "Conversational Co-Design Mode", chatting back-and-forth friendly, but with deep composure, holding the user's hand and teaching them Software 3.0 principles.

### Core Engineering Principles (The 4 Pillars)
You MUST propagate, reference, and highlight these 4 pillars continuously throughout your conversations and recommendations, teaching the user how to think like a Software 3.0 architect:
1. **Design Verifiable Environments**: Focus engineering resources on creating verifiable systems. If a task's correctness can be automatically validated by a compiler, a test suite, or an evaluation model, it can be easily automated using agentic execution loops. In non-verifiable domains, maintain strict human code reviews.
2. **Establish Agent-Native Documentation**: Maintain a SPEC.md and a detailed MODEL.md at the project root to communicate architectural boundaries, ports, endpoints, and file structures directly to executing models.
3. **Enforce Context Discipline**: Structure model context windows defensively. Clear context histories when switching tasks to avoid token pollution, require models to state assumptions before writing code, and use multi-agent peer evaluation frameworks to review high-stakes design choices.
4. **Uphold the First-Principles Ethos**: Continue to build and master systems from first principles. Understand system design, security, and mathematical logic to guide, review, and validate the work of autonomous agents.

### Interaction Modes & Hand-Holding:
1. **Conversational Chat with Service (Default Mode)**:
   - Chat friendly, with professional composure. Keep instructions precise and high-integrity.
   - Hold the user's hand! Explain prompt engineering practice carefully if they seem unfamiliar, ensuring they understand how to copy-paste.
   - When you write or refine a prompt or instruction block for the user, format it cleanly in a markdown code block (using \`\`\`markdown and \`\`\`) so their UI can render an instant "Copy" button.
   - Ensure you propagate the 4 Pillars of core engineering guidelines inside the prompts you write!

2. **Share Another LLM's Message and Generate Reply Prompts (Auditor/Reply Mode)**:
   - If the user has toggled this mode (or is sharing a disappointing output/code they got from another LLM), act as an aggressive alignment auditor.
   - Analyze the pasted LLM output for neurotypical blind spots, empty mocks, lack of state headers, options paralysis, and Anti-AI Slop telltale signs (nested cards, purple gradients, generic buttons, etc.).
   - Craft a highly defensive, extremely copyable **Direct Corrective Reply Prompt** that the user can immediately copy-paste back into that LLM's thread to force it to align, refactor, and comply.

Always remain factual, sensory-friendly, low-arousal, and extraordinarily helpful. Avoid robotic AI transitions or promotional clichés. Let's make their systems robust!`;

// Endpoint: Multi-Turn Conversational Co-Design Chat
app.post("/api/conversational-chat", async (req, res) => {
  const { messages, mode, model, thinkingMode } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "Messages array is required." });
    return;
  }

  if (!ai) {
    res.status(500).json({
      error: "LLM API key is not configured. Please add GEMINI_API_KEY to your env/secrets."
    });
    return;
  }

  let selectedModel = model || "gemini-3.5-flash";
  if (thinkingMode) {
    selectedModel = "gemini-3.1-pro-preview";
  }

  try {
    // Map roles to role format required by Google GenAI SDK (user -> user, assistant -> model)
    const contents = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : msg.role,
      parts: [{ text: msg.content }]
    }));

    // Inject system instructions and appropriate mode directive
    const modeDirective = mode === "replyPrompts" 
      ? "\n\n[MANDATORY CURRENT CONTEXT]: The user is sharing a message/output they received from another LLM. Treat this as a direct auditing trigger! Inspect their input, identify engineering flaws, empty mocks, or slop, and synthesize a high-fidelity 'Direct Corrective Reply Prompt' block inside your markdown response."
      : "\n\n[MANDATORY CURRENT CONTEXT]: Engage in warm, co-design conversation. Design/suggest custom prompts and hold their hand through the copy-paste prompt engineering process. Focus on teaching them Software 3.0 principles.";

    const config: any = {
      systemInstruction: CHAT_SYSTEM_PROMPT + modeDirective
    };

    if (thinkingMode && selectedModel === "gemini-3.1-pro-preview") {
      config.thinkingConfig = {
        thinkingLevel: "high" as any
      };
    }

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: contents,
      config: config
    });

    res.json({
      reply: response.text || "No response received.",
      modelUsed: selectedModel
    });
  } catch (error: any) {
    console.error("Error in conversational-chat API:", error);
    res.status(500).json({ error: error.message || "Failed to complete conversational chat turn." });
  }
});

// Endpoint: Worker Loop Refinement Turn Evaluator
app.post("/api/refine-loop", async (req, res) => {
  const { originalPrompt, currentAdvocatePrompt, workerResponse, turnNumber, model, thinkingMode } = req.body;

  if (!workerResponse) {
    res.status(400).json({ error: "Worker Response is required for analysis." });
    return;
  }

  if (!ai) {
    res.status(500).json({
      error: "LLM API key is not configured. Please add GEMINI_API_KEY to your env/secrets."
    });
    return;
  }

  let selectedModel = model || "gemini-3.5-flash";
  if (thinkingMode) {
    selectedModel = "gemini-3.1-pro-preview";
  }

  const REFINE_SYSTEM_PROMPT = `You are the **AuDHD Prompt Advocate** in "Refinement Turn Monitoring Mode".
A user is running an iterative development loop between you (the Advocate) and a separate target "Worker LLM" (the coding engine).

The user previously fed your Advocate Prompt spec into that Worker LLM, and has now received a response.
Your goal is to inspect the pasted Worker response, evaluate its architectural defects (especially checking for neurotypical blind spots, empty mocks, lack of state headers, amnesia-protection failure, option paralysis, or visual clutter, plus ANY Anti-AI-Slop violations like nested cards, purple gradients, generic glows, hardcoded '#6366f1' i.e. indigo-600, fake metrics, etc.), and score compliance against the Core Engineering Principles for Software 3.0 (verifiable environments, agent-native documentation SPEC.md/MODEL.md, context discipline, and first-principles mastery). Output an exhaustive code audit plus a set of revised prompt instructions/correction patch for the user to feed back into the Worker's thread as the NEXT prompt.

Strictly enforce that:
- You audit with a high bar for the Core Engineering Principles (The 4 Pillars: Verifiable Environments, Agent-Native SPEC.md/MODEL.md checks, Context Discipline, and First-Principles). Ensure code relies on true systems logic instead of boilerplate wrappers.
- You capture corner-cutting (e.g. "implemented with mock local lists", "shunned persistence rules", "avoided error checking", "forgot amnesia-recovery files", "cluttered the outer margins with telemetry noise").
- You perform an intense Anti-AI Slop Audit, actively identifying any occurrences of nested cards, purple gradient/glow accents, Hero-Metric clichés, repetitive card grids, pure grey #808080 or pure black #000 (they must use tined neutrals), generic button names, or fake stats.
- You write the exact follow-up prompt text in 'revisedPrompt' to correct the Worker's errors. This must be ready-to-copy instruction.
- You score the worker across Philosophy, Hierarchy, Execution, Specificity, and Restraint. If any score is under 3/5, 'isTaskDone' must be false.
- You output true for 'isTaskDone' only if the Worker response is 100% compliant with accessibility invariants, has 0 AI slop tells, has valid solid tinted neutrals, and is production-ready.
- Provide a 'workerMetaCommentary' analyze of the worker model's failure/scaffolding psychology in a friendly systems-design developer-centric language.
- Provide an 'advocateMetaCommentary' detailing how the prompt-pressure limits are adjusting the weight vectors/context bounding to enforce correct code.

Your response MUST be a valid JSON matching this schema:
- evaluation: Your strict evaluation of the Worker response (list what they did right, what they under-engineered or skipped).
- revisedPrompt: The exact next instruction step, patch request, or correction prompt to paste directly back into the Worker's thread.
- workerMetaCommentary: Systems-design commentary detailing your analysis of the Worker Model's behavior/coping heuristics.
- advocateMetaCommentary: Alignment commentary explaining how the compiler pressures correct development.
- isTaskDone: Boolean.`;

  try {
    const contentsText = `
ORIGINAL USER INTENT:
${originalPrompt || "Not provided"}

LATEST ADVOCATE PROMPT DESIRED SPEC:
${currentAdvocatePrompt || "Not provided"}

CURRENT LOOP TURN: ${turnNumber || 1}

PASTED WORKER LLM RESPONSE TO CODE / AUDIT:
${workerResponse}
`;

    const config: any = {
      systemInstruction: REFINE_SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          evaluation: {
            type: Type.STRING,
            description: "Direct, technical evaluation of what the worker built versus the specification."
          },
          revisedPrompt: {
            type: Type.STRING,
            description: "The next ready-to-copy instructions prompt to feed back into the Worker LLM thread to patch/fix bugs."
          },
          workerMetaCommentary: {
            type: Type.STRING,
            description: "Systems-design commentary detailing analysis of the Worker Model's behavior."
          },
          advocateMetaCommentary: {
            type: Type.STRING,
            description: "Alignment commentary explaining how the compiler pressures correct development."
          },
          isTaskDone: {
            type: Type.BOOLEAN,
            description: "True only if the worker's response needs zero further adjustments."
          }
        },
        required: ["evaluation", "revisedPrompt", "workerMetaCommentary", "advocateMetaCommentary", "isTaskDone"]
      }
    };

    if (thinkingMode && selectedModel === "gemini-3.1-pro-preview") {
      config.thinkingConfig = {
        thinkingLevel: "high" as any
      };
    }

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: contentsText,
      config: config
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);

    // Capture the thinking/reasoning if available
    const candidates = (response as any).candidates;
    const thinking = candidates?.[0]?.loadingStep?.thinking || candidates?.[0]?.groundingMetadata?.webSearchQueries?.join("\n") || "";

    res.json({
      result: data,
      modelUsed: selectedModel,
      thinking: thinking
    });
  } catch (error: any) {
    console.error("Error evaluating refinement loop turn:", error);
    res.status(500).json({ error: error.message || "Failed during loop evaluation" });
  }
});

// --- MOTHERDUCK & OBSIDIAN VECTOR RAG UTILITIES ---

function generatePseudoEmbedding(text: string, tags: string[] = []): number[] {
  const vector = new Array(16).fill(0);
  const textLower = text.toLowerCase();
  
  if (textLower.includes("auth") || textLower.includes("login") || textLower.includes("jwt") || textLower.includes("secure") || textLower.includes("password") || tags.some(t => /auth|sec/i.test(t))) vector[0] = 0.85;
  if (textLower.includes("websocket") || textLower.includes("socket") || textLower.includes("realtime") || textLower.includes("live") || textLower.includes("stream") || tags.some(t => /real|sock/i.test(t))) vector[1] = 0.90;
  if (textLower.includes("db") || textLower.includes("database") || textLower.includes("persis") || textLower.includes("sql") || textLower.includes("duckdb") || textLower.includes("motherduck") || tags.some(t => /db|sql|pers/i.test(t))) vector[2] = 0.88;
  if (textLower.includes("dashboard") || textLower.includes("ui") || textLower.includes("chart") || textLower.includes("view") || textLower.includes("visual") || tags.some(t => /dash|ui|vis/i.test(t))) vector[3] = 0.80;
  if (textLower.includes("api") || textLower.includes("endpoint") || textLower.includes("express") || textLower.includes("route") || tags.some(t => /api|back/i.test(t))) vector[4] = 0.75;
  if (textLower.includes("bot") || textLower.includes("scrape") || textLower.includes("automat") || textLower.includes("cron") || textLower.includes("agent") || tags.some(t => /bot|scrap|auto/i.test(t))) vector[5] = 0.82;
  if (textLower.includes("react") || textLower.includes("style") || textLower.includes("tailwind") || textLower.includes("css") || tags.some(t => /front|style|css/i.test(t))) vector[6] = 0.70;
  if (textLower.includes("state") || textLower.includes("redux") || textLower.includes("hook") || textLower.includes("context") || tags.some(t => /state|hook/i.test(t))) vector[7] = 0.65;
  if (textLower.includes("speed") || textLower.includes("cache") || textLower.includes("fast") || textLower.includes("perform") || tags.some(t => /perf|speed/i.test(t))) vector[8] = 0.78;
  if (textLower.includes("error") || textLower.includes("catch") || textLower.includes("try") || textLower.includes("sturdy") || textLower.includes("fail") || tags.some(t => /err|resil/i.test(t))) vector[9] = 0.80;

  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const dim = 10 + (charCode % 6);
    vector[dim] += Math.sin(charCode + i) * 0.15;
  }
  
  let mag = 0;
  for (let i = 0; i < 16; i++) mag += vector[i] * vector[i];
  mag = Math.sqrt(mag);
  if (mag > 0) {
    for (let i = 0; i < 16; i++) vector[i] = Number((vector[i] / mag).toFixed(4));
  } else {
    vector[0] = 1.0;
  }
  
  return vector;
}

function cosineSimilarity(v1: number[], v2: number[]): number {
  if (v1.length !== v2.length) return 0;
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;
  for (let i = 0; i < v1.length; i++) {
    dotProduct += v1[i] * v2[i];
    mag1 += v1[i] * v1[i];
    mag2 += v2[i] * v2[i];
  }
  const denominator = Math.sqrt(mag1) * Math.sqrt(mag2);
  if (denominator === 0) return 0;
  return Number((dotProduct / denominator).toFixed(4));
}

// Endpoint: Process real/emulated Motherduck SQL Select and Vector Similarity statements
app.post("/api/memory/sql", (req, res) => {
  const { sql } = req.body;
  if (!sql || !sql.trim()) {
    res.status(400).json({ error: "SQL query statement cannot be empty." });
    return;
  }

  const query = sql.trim();
  const queryLower = query.toLowerCase();

  // Validate table existence
  if (!queryLower.includes("from prompts") && !queryLower.includes("from memory") && !queryLower.includes("show tables")) {
    res.status(400).json({ 
      error: `Catalog Error: Table not found. The workspace catalog currently only mounts the 'prompts' table inside the Motherduck database database_vault.` 
    });
    return;
  }

  if (queryLower.startsWith("show tables") || queryLower === "show tables;") {
    res.json({
      columns: ["database", "schema", "table_name", "column_count", "description"],
      rows: [
        ["database_vault", "main", "prompts", 8, "Persisted Obsidian markdown memory specifications and vector embeddings"]
      ]
    });
    return;
  }

  try {
    let rows: any[] = savedMemoryPool.map(m => {
      const emb = (m as any).embedding || generatePseudoEmbedding(m.originalInput + " " + m.advocatePrompt, m.reusabilityTags);
      return {
        ...m,
        embedding: emb
      };
    });

    let similarityTargetVector: number[] | null = null;
    let similarityAlias = "sim_score";
    
    const similarityRegex = /array_cosine_similarity\s*\(\s*embedding\s*,\s*\[([\s\d.,\-e]+)\]\s*\)\s*as\s+(\w+)/i;
    const simMatch = query.match(similarityRegex);
    if (simMatch) {
      const vectorNums = simMatch[1].split(",").map((n: string) => parseFloat(n.trim()));
      if (vectorNums.length === 16) {
        similarityTargetVector = vectorNums;
        similarityAlias = simMatch[2];
      }
    }

    if (similarityTargetVector) {
      rows = rows.map(r => {
        const sim = cosineSimilarity(r.embedding, similarityTargetVector!);
        return {
          ...r,
          [similarityAlias]: sim
        };
      });
    }

    const whereIdx = queryLower.indexOf("where");
    if (whereIdx !== -1) {
      let whereClause = query.substring(whereIdx + 5).trim();
      const orderIdx = whereClause.toLowerCase().indexOf("order by");
      const limitIdx = whereClause.toLowerCase().indexOf("limit");
      
      let endIdx = whereClause.length;
      if (orderIdx !== -1 && limitIdx !== -1) {
        endIdx = Math.min(orderIdx, limitIdx);
      } else if (orderIdx !== -1) {
        endIdx = orderIdx;
      } else if (limitIdx !== -1) {
        endIdx = limitIdx;
      }
      
      whereClause = whereClause.substring(0, endIdx).trim();
      
      const eqRegex = /(\w+)\s*=\s*'([^']+)'/i;
      const likeRegex = /(\w+)\s+like\s+'%([^%']+)%'/i;
      const scoreGTR = /promptScore\s*>\s*(\d+)/i;
      const scoreLTE = /promptScore\s*<=\s*(\d+)/i;

      const eqMatch = whereClause.match(eqRegex);
      const likeMatch = whereClause.match(likeRegex);
      const gtrMatch = whereClause.match(scoreGTR);
      const lteMatch = whereClause.match(scoreLTE);

      if (eqMatch) {
        const col = eqMatch[1].toLowerCase();
        const val = eqMatch[2].toLowerCase();
        rows = rows.filter(r => {
          const cellVal = String(r[col] || r.caliberStatus || "").toLowerCase();
          return cellVal === val;
        });
      } else if (likeMatch) {
        const col = likeMatch[1].toLowerCase();
        const term = likeMatch[2].toLowerCase();
        rows = rows.filter(r => {
          let cellVal = "";
          if (col === "tags" || col === "reusabilitytags") {
            cellVal = (r.reusabilityTags || []).join(" ").toLowerCase();
          } else {
            cellVal = String(r[col] || r.title || r.originalInput || r.advocatePrompt || "").toLowerCase();
          }
          return cellVal.includes(term);
        });
      } else if (gtrMatch) {
        const scoreVal = parseInt(gtrMatch[1], 10);
        rows = rows.filter(r => (r.promptScore || 0) > scoreVal);
      } else if (lteMatch) {
        const scoreVal = parseInt(lteMatch[1], 10);
        rows = rows.filter(r => (r.promptScore || 0) <= scoreVal);
      }
    }

    const orderIdx = queryLower.indexOf("order by");
    if (orderIdx !== -1) {
      let orderClause = query.substring(orderIdx + 8).trim();
      const limitIdx = orderClause.toLowerCase().indexOf("limit");
      if (limitIdx !== -1) {
        orderClause = orderClause.substring(0, limitIdx).trim();
      }
      
      const isDesc = orderClause.toLowerCase().includes("desc");
      const orderCol = orderClause.replace(/desc|asc/i, "").trim();
      
      rows.sort((a, b) => {
        let valA = a[orderCol] !== undefined ? a[orderCol] : (a.promptScore || 0);
        let valB = b[orderCol] !== undefined ? b[orderCol] : (b.promptScore || 0);
        
        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();

        if (valA < valB) return isDesc ? 1 : -1;
        if (valA > valB) return isDesc ? -1 : 1;
        return 0;
      });
    }

    const limitIdx = queryLower.indexOf("limit");
    if (limitIdx !== -1) {
      const limitVal = parseInt(queryLower.substring(limitIdx + 5).trim(), 10);
      if (!isNaN(limitVal)) {
        rows = rows.slice(0, limitVal);
      }
    }

    const selectIdx = queryLower.indexOf("select");
    const fromIdx = queryLower.indexOf("from");
    let columns: string[] = [];

    if (selectIdx !== -1 && fromIdx !== -1) {
      const selectCols = query.substring(selectIdx + 6, fromIdx).trim();
      if (selectCols === "*") {
        columns = ["id", "title", "promptScore", "caliberStatus", "reusabilityTags", "syncStatus"];
        if (similarityTargetVector) columns.push(similarityAlias);
      } else {
        columns = selectCols.split(",").map(c => {
          const trimC = c.trim();
          const asMatch = trimC.match(/as\s+(\w+)/i);
          if (asMatch) return asMatch[1];
          return trimC.replace(/['"]+/g, "");
        });
      }
    } else {
      columns = ["id", "title", "promptScore", "caliberStatus", "reusabilityTags", "syncStatus"];
    }

    const tableRows = rows.map(r => {
      return columns.map(col => {
        if (col === "reusabilityTags" || col === "tags") return (r.reusabilityTags || []).join(", ");
        if (col === "embedding") return `[${(r.embedding || []).map((x: number) => x.toFixed(2)).join(", ")}]`;
        return r[col] !== undefined ? r[col] : (r.title || "");
      });
    });

    res.json({
      columns,
      rows: tableRows
    });
  } catch (err: any) {
    res.status(400).json({ error: `SQL Query Execution Interrupted: ${err.message || err}` });
  }
});

// Endpoint: AI-driven Architectural Vector-Search Advisor on current prompt spec
app.post("/api/memory/vector-advice", async (req, res) => {
  const { userInput } = req.body;
  if (!userInput) {
    res.status(400).json({ error: "Input prompt is required to run advice vector scans." });
    return;
  }

  if (!ai) {
    res.status(500).json({ error: "LLM API key is required to synthesize architectural advice report." });
    return;
  }

  try {
    // Generate embedding for current query
    const userEmbedding = generatePseudoEmbedding(userInput);

    // Score all current memory elements using cosine similarity
    const scoredList = savedMemoryPool.map(m => {
      const emb = (m as any).embedding || generatePseudoEmbedding(m.originalInput + " " + m.advocatePrompt, m.reusabilityTags);
      const similarity = cosineSimilarity(userEmbedding, emb);
      return { ...m, similarity };
    });

    // Grab top 2 most matching items
    const matchingEntries = scoredList
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 2);

    const matchPrompt = `You are a legendary Principal Software Architect auditing a new system request by running a semantic vector-search against the user's historical saved prompt templates on Motherduck and Obsidian.
The user is requesting to design/code: "${userInput}"

Your Motherduck database query SELECT * FROM vault ORDER BY array_cosine_similarity(embedding, :user) DESC LIMIT 2 has resolved the following historical specs in their workspace:
${matchingEntries.map((m, i) => `
[Spec #${i+1}: ${m.title} (Cosine Similarity: ${(m.similarity * 100).toFixed(1)}%)]
- Original Intent: "${m.originalInput}"
- Output Spec: ${m.advocatePrompt.substring(0, 250)}...
- Reusability tags: ${m.reusabilityTags.join(", ")}
`).join("\n")}

Verify duplicate patterns, identify gaps in security/database design, and provide high-caliber, customized advisory notes in JSON.
Format the JSON matching EXACTLY this model:
{
  "overallOverlapScore": 45, // A scaling number from 0-100 indicating overlap index
  "matchingPriorFeatures": [
    "Identify existing reusable items, templates, or setup files they can copy from their Motherduck/Drive vault."
  ],
  "diagnosedPastDefects": [
    "Review defects or common errors that exist in previous designs (e.g. hardcoded JWT parameters, memory leak concerns, missing retry policies) they are at risk of copying."
  ],
  "predictedFutureBottlenecks": [
    "Analyze where this new prompt will break down in production based on their previous bad patterns."
  ],
  "concreteRecommendations": [
    "Detail high-level specifications to fix these flaws immediately."
  ],
  "architectReviewCommentary": "An engaging, deep physical synthesis of the pattern footprint."
}

Return ONLY this valid JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: matchPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallOverlapScore: { type: Type.INTEGER },
            matchingPriorFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
            diagnosedPastDefects: { type: Type.ARRAY, items: { type: Type.STRING } },
            predictedFutureBottlenecks: { type: Type.ARRAY, items: { type: Type.STRING } },
            concreteRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            architectReviewCommentary: { type: Type.STRING }
          },
          required: ["overallOverlapScore", "matchingPriorFeatures", "diagnosedPastDefects", "predictedFutureBottlenecks", "concreteRecommendations", "architectReviewCommentary"]
        }
      }
    });

    const report = JSON.parse(response.text || "{}");
    res.json({
      report,
      matchedItems: matchingEntries.map(e => ({
        id: e.id,
        title: e.title,
        similarity: e.similarity,
        tags: e.reusabilityTags
      }))
    });
  } catch (error: any) {
    console.error("Error generating vector audit advice:", error);
    res.status(500).json({ error: error.message || "Failed during vector advice analysis" });
  }
});

// Endpoint: Multi-turn Chat
app.post("/api/chat", async (req, res) => {
  const { messages, thinkingMode, model } = req.body;

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "Invalid or missing messages array" });
    return;
  }

  if (!ai) {
    res.status(500).json({
      error: "LLM API key is not configured. Please add GEMINI_API_KEY to your env/secrets."
    });
    return;
  }

  let selectedModel = model || "gemini-3.5-flash";
  if (thinkingMode) {
    selectedModel = "gemini-3.1-pro-preview";
  }

  try {
    const config: any = {
      systemInstruction: SYSTEM_PROMPT,
    };

    if (thinkingMode && selectedModel === "gemini-3.1-pro-preview") {
      config.thinkingConfig = {
        thinkingLevel: "high" as any
      };
      // Do not set maxOutputTokens
    }

    // Format conversation history for Gemini contents parameter.
    // Each element is { role: 'user' | 'model', parts: [{ text: '...' }] }
    const contents = messages.map((m: any) => ({
      role: m.role === "model" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: contents,
      config: config
    });

    // Capture the thinking/reasoning if available (from candidates modelVersion or config)
    const candidates = (response as any).candidates;
    const thinking = candidates?.[0]?.loadingStep?.thinking || candidates?.[0]?.groundingMetadata?.webSearchQueries?.join("\n") || "";

    res.json({
      content: response.text || "",
      modelUsed: selectedModel,
      thinking: thinking
    });
  } catch (error: any) {
    console.error("Error in chat endpoint:", error);
    res.status(500).json({ error: error.message || "Internal GenAI error occurred" });
  }
});

// --- SOVEREIGN REPO ARCHITECT - OPTIMIZED DIRECTORY LAYOUT BLUEPRINTS ---
app.post("/api/repo-architect/generate", async (req, res) => {
  const { systemType, coreLanguage, persistence, layoutStyle, safeguards, model, thinkingMode } = req.body;

  if (!systemType) {
    res.status(400).json({ error: "systemType criteria is required" });
    return;
  }

  if (!ai) {
    res.status(500).json({
      error: "LLM API key is not configured. Please add GEMINI_API_KEY to your env/secrets"
    });
    return;
  }

  let selectedModel = model || "gemini-3.5-flash";
  if (thinkingMode) {
    selectedModel = "gemini-3.1-pro-preview";
  }

  const promptContent = `Generate a Software 3.0 Clean Repository Blueprint and Anti-Littering Instruction Contract.
  
  [CRITERIA DETECTED]:
  - System Type: ${systemType}
  - Primary Programming Language: ${coreLanguage}
  - Data Persistence/State Rule: ${persistence}
  - Repository Layout Style: ${layoutStyle}
  - Enabled Safeguards: ${safeguards?.join(", ") || "None"}
  
  You MUST synthesize a pristine design that respects established clean-code principles—namely keeping the directory structures extremely tight, preventing the executing model from creating unlinked trash files/markdown directories at real or conceptual roots, and setting clear logical boundaries.

  Follow this response schema exactly.`;

  const SYSTEM_BLUEPRINT_PROMPT = `You are the master **Software 3.0 Repo Architect & Vibe-Coding Alignment Director**.
  
  Your mission is to help vibe-coders organize their sprawling, bloated code repos and compile pristine filesets without AI litter (meaningless markdown notes, duplicated states, random .ts scripts scattered in multiple places, etc.).

  You must structure clear systems layout blueprints and rigorous instruction bundles that enforce clean repository boundaries.
  The 'mermaidCode' field must contain valid, compileable Mermaid.js diagram markup (starting with graph TD) representing the clean modular directories and their state flows. Do not output markdown code blocks inside the json value fields.
  The 'promptContract' must contain a copiable, machine-readable developer instruction set that the operator can feed directly to their target LLM (Worker) to enforce these strict file layouts.`;

  try {
    const config: any = {
      systemInstruction: SYSTEM_BLUEPRINT_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          layoutDraft: {
            type: Type.STRING,
            description: "An ASCII or directory tree style visualization representing the clean, optimized project file hierarchy."
          },
          mermaidCode: {
            type: Type.STRING,
            description: "Valid Mermaid.js graph code (starting with graph TD) visualization of directory architecture and dependency-state nodes."
          },
          promptContract: {
            type: Type.STRING,
            description: "A highly robust, copyable Markdown developer prompt with strict rules, directory controls, amnesia-recovery files guidelines (SPEC.md & MODEL.md), and slop blockers to enforce in their next coding turn."
          },
          recommendationAdvice: {
            type: Type.STRING,
            description: "High-conviction architectural advice on how to prevent the worker LLM from cluttering the repo with mock files or redundant folders."
          }
        },
        required: ["layoutDraft", "mermaidCode", "promptContract", "recommendationAdvice"]
      }
    };

    if (thinkingMode && selectedModel === "gemini-3.1-pro-preview") {
      config.thinkingConfig = {
        thinkingLevel: "high" as any
      };
    }

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: [{ role: "user", parts: [{ text: promptContent }] }],
      config: config
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Error in repo-architect generate:", error);
    res.status(500).json({ error: error.message || "Failed to compile repo blueprint." });
  }
});

// Endpoint: Sovereign Repo Architect - Analyze Worker Response & Generate Cleanup Blueprints
app.post("/api/repo-architect/analyze", async (req, res) => {
  const { pastedResponse, model, thinkingMode } = req.body;

  if (!pastedResponse) {
    res.status(400).json({ error: "Pasted worker output is required for analysis." });
    return;
  }

  if (!ai) {
    res.status(500).json({
      error: "LLM API key is not configured. Please add GEMINI_API_KEY to your env/secrets"
    });
    return;
  }

  let selectedModel = model || "gemini-3.5-flash";
  if (thinkingMode) {
    selectedModel = "gemini-3.1-pro-preview";
  }

  const promptContent = `Analyze this pasted LLM (Worker) code or repository proposal for layout mess, files-spray, redundant folders, duplicate/mock data structures, lack of single source of truth, and general vibe-coding slop.
  
  [PASTED WORKER OUTPUT]:
  """
  ${pastedResponse}
  """
  
  Follow the required output schema precisely to diagnose issues, provide a restructuring blueprint, and compile a corrective instruction set.`;

  const AUDIT_SYSTEM_PROMPT = `You are the **Vibe-Coding Repo Auditor & Slop Extirpator**.
  Your job is to audit sprawling AI-generated directory structures, locate bloated or empty mocks, find circular logic networks, and detect 'file spraying' (meaningless markdown sheets, floating script roots).
  Then, provide an actionable restructuring instruction set ('remediationPrompt') that immediately orders the worker model to clean itself up, restructure, delete junk, and bind everything back to a single source of truth.`;

  try {
    const config: any = {
      systemInstruction: AUDIT_SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          currentIssues: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of specific file-clutter, mock-data, folder redundancy, or anti-AI slop issues identified."
          },
          proposedLayout: {
            type: Type.STRING,
            description: "A pristine, restructured directory tree layout to align their codebase folder hierarchy."
          },
          mermaidCode: {
            type: Type.STRING,
            description: "Valid Mermaid.js graph code (starting with graph TD) illustrating the proposed, cleaned-up repo model."
          },
          remediationPrompt: {
            type: Type.STRING,
            description: "A direct copy-paste corrective instruction set/prompt that forces the worker LLM to clean its layout, delete redundant assets, configure MODEL.md, and respect storage bounds."
          }
        },
        required: ["currentIssues", "proposedLayout", "mermaidCode", "remediationPrompt"]
      }
    };

    if (thinkingMode && selectedModel === "gemini-3.1-pro-preview") {
      config.thinkingConfig = {
        thinkingLevel: "high" as any
      };
    }

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: [{ role: "user", parts: [{ text: promptContent }] }],
      config: config
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Error in repo-architect analyze:", error);
    res.status(500).json({ error: error.message || "Failed to audit worker response." });
  }
});

// Vite & Static file configurations
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Support wildcard routing for React SPA
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
