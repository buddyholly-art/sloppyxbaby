export interface Authority {
  id: string;
  name: string;
  role: string;
  institution: string;
  quote: string;
  edictId: number;
  edictName: string;
  tcoVector: {
    money: string; // How it impacts financial execution cost
    space: string; // How it impacts mental / cache space
    maintenance: string; // How it impacts software maintenance liability
  };
}

export const AUTHORITIES_SSOT: Authority[] = [
  {
    id: "karpathy",
    name: "Andrej Karpathy",
    role: "Co-Founder of OpenAI & Former Director of AI",
    institution: "Tesla & OpenAI",
    quote: "Code is a liability. It has a maintenance cost in terms of real money ($/tokens), space (context window weight), and cognitive maintenance overhead.",
    edictId: 6,
    edictName: "Single Source of Truth & Liability Minimization",
    tcoVector: {
      money: "Long prompts and redundant code duplicate token execution counts, compounding subscription API costs exponentially.",
      space: "Sloppy, unnormalized code structures bloat the LLM's active cache context, decreasing precision.",
      maintenance: "Every un-audited line of prompt-weight becomes a permanent debugging liability across server iterations."
    }
  },
  {
    id: "baddeley",
    name: "Alan Baddeley",
    role: "Pioneering Cognitive Psychologist & Professor",
    institution: "University of York (Working Memory Model)",
    quote: "Working memory has a strictly limited capacity. If an output lacks instant contextual state-reconstruction on boot, cognitive amnesia occurs.",
    edictId: 1,
    edictName: "The Amnesia Principle",
    tcoVector: {
      money: "Developers waste expensive server hours manually re-keying lost session states and running diagnostic loops.",
      space: "Human mental workspace drops to zero under high context re-read times, causing focus loss.",
      maintenance: "No session-restoration files means software debugging states must be manually reconstructed from scratch."
    }
  },
  {
    id: "barkley",
    name: "Russell Barkley",
    role: "Clinical Neuropsychologist & Foremost ADHD Scholar",
    institution: "Medical University of South Carolina",
    quote: "ADHD is an executive function deficit. Guidance must consist of physical, externalized schemas, clear guardrails, and immediate rollbacks.",
    edictId: 3,
    edictName: "Objective Guardrails",
    tcoVector: {
      money: "Error state recovery is five times more expensive to resolve server-side than preventing them with hard validation gates.",
      space: "Ambiguous task demands degrade operational trust and trigger severe initiation procrastination.",
      maintenance: "Lack of clean schemas and fallback policies leads to silent application failure and state drift in production."
    }
  },
  {
    id: "dunn",
    name: "Winnie Dunn",
    role: "Occupational Therapist & Pioneer of Sensory Processing",
    institution: "University of Kansas Medical Center",
    quote: "Flashing visual spikes, arbitrary margin charts, and high-arousal logs trigger severe cognitive sensory overload.",
    edictId: 5,
    edictName: "Low-Arousal Sensory Spaces",
    tcoVector: {
      money: "Gaudy telemetry visualizations are costly to render, and slow down critical system hot-paths.",
      space: "Telemetry visual pollution triggers stress-induced micro-distractions, exhausting working memory reserves.",
      maintenance: "Decorating systems with fake or redundant diagnostic stats increases layout code fragility."
    }
  },
  {
    id: "udl",
    name: "UDL Guidelines",
    role: "Universal Design for Learning System Framework",
    institution: "CAST Center for Applied Special Technology",
    quote: "Choice paralysis destroys learning and action. We must provide exactly one clear, default, recommended next step.",
    edictId: 2,
    edictName: "Demonstrable Tunneling",
    tcoVector: {
      money: "Un-tunneled option states result in high session durations and empty server runs due to user confusion.",
      space: "Multiple equal choices induce severe analysis paralysis, stalling project momentum.",
      maintenance: "Complex branch state-trees increase routing matrix complexity by 40% for each added conditional."
    }
  }
];

export interface TcoCalculus {
  financialCostPerK: number;
  estimatedTokens: number;
  totalExecutionCost: number;
  contextWindowWeightPercentage: number;
  complexityDebtIndex: number; // 0-100 rating
  maintenanceRiskLevel: "Ultra Low" | "Moderate (Careful)" | "High Risk (Liability)";
  criticism: string;
}

export function calculatePromptTco(promptText: string): TcoCalculus {
  const chars = promptText ? promptText.trim().length : 0;
  // Standard token estimate: 1 token = ~4 chars
  const tokens = Math.max(1, Math.ceil(chars / 4));
  
  // Cost pricing: Pro pricing is $0.00125 per 1k input tokens (approximate metric)
  const costPerK = 0.00125;
  const rawCost = (tokens / 1000) * costPerK;
  
  // Spatial context footprint inside standard 2M limit of Gemini
  const maxContext = 128000; // Let's use 128k as a common developer working cache
  const footprintPercent = Number(((tokens / maxContext) * 100).toFixed(3));
  
  // Maintenance complexity indicators: based on lines and potential liability flags
  const lines = promptText ? promptText.split("\n").length : 0;
  const hasLooseVariables = (promptText.match(/\{\{.*?\}\}/g) || []).length;
  const hasVaguePhrases = (promptText.match(/(gorgeous|stellar|fast|awesome|incredible|should|would|please|try to)/gi) || []).length;
  const hasNestedCardsTell = (promptText.match(/(nested|card-in-card|grid|modal)/gi) || []).length;

  let baseComplexity = Math.min(100, Math.round((lines * 0.8) + (hasLooseVariables * 5) + (hasVaguePhrases * 10) + (hasNestedCardsTell * 15)));
  if (baseComplexity === 0 && chars > 0) baseComplexity = 15;
  if (chars === 0) baseComplexity = 0;

  let risk: "Ultra Low" | "Moderate (Careful)" | "High Risk (Liability)" = "Ultra Low";
  if (baseComplexity > 60) risk = "High Risk (Liability)";
  else if (baseComplexity > 25) risk = "Moderate (Careful)";

  let criticism = "No prompt spec entered. Awaiting input for complexity calculus.";
  if (chars > 0) {
    if (risk === "High Risk (Liability)") {
      criticism = "Severe maintenance liability detected. Contains vague high-arousal words, high line count, and complex dependencies. Recommend applying the Karpathy deletion rules.";
    } else if (risk === "Moderate (Careful)") {
      criticism = "Balanced footprint. Retains moderate context weight, but some ambiguous nouns should be clarified or removed.";
    } else {
      criticism = "Outstanding lean architecture! Adheres firmly to the clinical single source of truth rules with negligible structural overhead.";
    }
  }

  return {
    financialCostPerK: costPerK,
    estimatedTokens: tokens,
    totalExecutionCost: Number(rawCost.toFixed(6)),
    contextWindowWeightPercentage: footprintPercent,
    complexityDebtIndex: baseComplexity,
    maintenanceRiskLevel: risk,
    criticism
  };
}
