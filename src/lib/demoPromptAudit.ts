import type { DemoAuditResult, DemoPromptScenario } from './demoPromptScenarios';

export type PromptScanResult = {
  score: number;
  impulsivityScore: number;
  bloatScore: number;
  confabScore: number;
  flags: string[];
  summary: string;
  barExecutive: string;
  barWmOverflow: string;
  barConfab: string;
};

export function scanFromScenario(scenario: DemoPromptScenario): PromptScanResult {
  const { impulsivityScore, bloatScore, flags, summary } = scenario.audit;
  const score = Math.round((impulsivityScore + bloatScore) / 2);
  const confabScore = Math.round((impulsivityScore + bloatScore) / 2);

  return {
    score,
    impulsivityScore,
    bloatScore,
    confabScore,
    flags: flags.slice(0, 4),
    summary,
    barExecutive: `${impulsivityScore}%`,
    barWmOverflow: `${bloatScore}%`,
    barConfab: `${confabScore}%`,
  };
}

const FLAG_POOL = [
  'nested context loops',
  'vague constraints',
  'fake metrics risk',
  'role ambiguity',
  'output format missing',
  'dopamine-heavy phrasing',
  'no guardrails',
];

export function scanFromHeuristic(text: string): PromptScanResult {
  const trimmed = text.trim();
  const score = Math.min(92, Math.max(34, Math.floor(trimmed.length / 8) + 28));
  const flags: string[] = [];

  if (trimmed.length < 80) flags.push('vague constraints');
  if (!/role|task|output|constraint/i.test(trimmed)) flags.push('role ambiguity');
  if (/features?|testimonials?|premium|approachable/i.test(trimmed)) flags.push('fake metrics risk');
  if (!/avoid|don't|never/i.test(trimmed)) flags.push('no guardrails');

  while (flags.length < 3) {
    const extra = FLAG_POOL[Math.floor(Math.random() * FLAG_POOL.length)];
    if (!flags.includes(extra)) flags.push(extra);
  }

  const impulsivityScore = Math.min(92, Math.round(score * 0.75));
  const bloatScore = Math.min(88, Math.round(score * 0.55));
  const confabScore = Math.round((impulsivityScore + bloatScore) / 2);

  return {
    score,
    impulsivityScore,
    bloatScore,
    confabScore,
    flags: flags.slice(0, 4),
    summary: `Combined heuristic risk ${score}%. Pick a demo scenario for the full AuDHD ↔ LLM cognitive analog tour, or continue to live compile below.`,
    barExecutive: `${impulsivityScore}%`,
    barWmOverflow: `${bloatScore}%`,
    barConfab: `${confabScore}%`,
  };
}

export function buildCognitiveCompileContext(scenario: DemoPromptScenario): string {
  const { cognitive, audit } = scenario;
  return `
[COGNITIVE ANALOG CONTEXT — AuDHD ↔ LLM]
Failure mode: ${cognitive.label}
Human (AuDHD): ${cognitive.humanParallel}
Model (LLM): ${cognitive.llmParallel}
Bridge insight: ${cognitive.insight}
Mitigation: ${cognitive.mitigation}
Citation: ${cognitive.cite}
Scaffolds to enforce: ${cognitive.scaffolds.join(' · ')}
Audit flags: ${audit.flags.join('; ')}
`.trim();
}