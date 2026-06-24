export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
  thinking?: string; // Captures reasoning/thinking steps if available
}

export interface OptimizedPromptResult {
  intentDiagnosis: string;
  llmRiskAnalysis: string[];
  advocatePrompt: string;
  executionSkeleton?: string;
  rawResponse: string;
  promptScore?: number; // Quality Score out of 100
  caliberStatus?: 'standard' | 'exceptional' | 'outstanding';
  shouldSaveAdvisory?: string; // Text advising the user on whether and why to save this
  reusabilityTags?: string[]; // Semantic tags for matching reusable prompts
}

export interface PromptHistoryItem {
  id: string;
  timestamp: string;
  inputPrompt: string;
  result: OptimizedPromptResult;
  modelUsed: string;
  speedMs: number;
  savedOffline?: boolean;
}

export interface RefinementTurn {
  turnNumber: number;
  workerResponse: string;
  evaluation: string;
  revisedPrompt: string;
  timestamp: string;
  workerMetaCommentary?: string;
  advocateMetaCommentary?: string;
}

export interface RefinementResult {
  evaluation: string;
  revisedPrompt: string;
  isTaskDone: boolean;
}

export interface RecurringIssueInsight {
  issuePattern: string;
  count: number;
  explanation: string;
  mitigationPrompt: string;
}

