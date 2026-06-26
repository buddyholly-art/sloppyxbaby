import { useState } from "react";
import {
  Brain,
  RefreshCw,
  Compass,
  Search,
  Layers,
  ArrowRight,
  Check,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Copy,
  Sparkles,
  Hash,
  BarChart3
} from "lucide-react";

interface VectorMatch {
  id: string;
  title: string;
  similarity: number;
  tags: string[];
}

interface AdviceReport {
  report: {
    overallOverlapScore: number;
    architectReviewCommentary: string;
    matchingPriorFeatures: string[];
    diagnosedPastDefects: string[];
    predictedFutureBottlenecks: string[];
    concreteRecommendations: string[];
  };
  matchedItems?: VectorMatch[];
}

interface VectorAdvisorProps {
  advicePrompt: string;
  setAdvicePrompt: (val: string) => void;
  adviceReport: AdviceReport | null;
  adviceLoading: boolean;
  executeVectorScans: () => void;
}

// Mock memory chunks for visual demonstration
const MOCK_MEMORY_CHUNKS = [
  { id: "vec-a1f2", text: "Authentication middleware with JWT token rotation and RBAC permission gates. Uses refresh token sliding window with 15min expiry.", relevance: 0.94, source: "auth-system-prompt-v3" },
  { id: "vec-b3e8", text: "Database schema normalization for user profiles. Single source of truth pattern with foreign key constraints and cascade deletes.", relevance: 0.87, source: "db-schema-prompt-v1" },
  { id: "vec-c7d4", text: "WebSocket real-time notification service. Event-driven architecture with Redis pub/sub fallback for horizontal scaling.", relevance: 0.72, source: "websocket-prompt-v2" },
  { id: "vec-d2a9", text: "Dashboard layout with collapsible sidebar navigation. Responsive grid system using CSS container queries.", relevance: 0.61, source: "dashboard-prompt-v4" },
];

export default function VectorAdvisor({
  advicePrompt,
  setAdvicePrompt,
  adviceReport,
  adviceLoading,
  executeVectorScans
}: VectorAdvisorProps) {
  const [activeChunks, setActiveChunks] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [contextMode, setContextMode] = useState<"assemble" | "review">("assemble");

  const toggleChunk = (id: string) => {
    setActiveChunks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const selectedChunkCount = activeChunks.size;
  const assembledContext = MOCK_MEMORY_CHUNKS
    .filter(c => activeChunks.has(c.id))
    .map(c => c.text)
    .join("\n\n---\n\n");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in" id="ai-vector-advisor">

      {/* Left Column: Search Input & Memory Chunks */}
      <div className="lg:col-span-5 space-y-5">

        {/* Entry Panel */}
        <div className="card-shell p-5 space-y-4">
          <div className="space-y-1">
            <div className="eyebrow">
              <Brain className="w-3 h-3 text-[var(--color-sage)] mr-1" />
              <span>RAG Vector Console</span>
            </div>
            <p className="text-xs text-[var(--color-muted)] leading-relaxed font-[var(--font-sans)] mt-1">
              Enter requirements for a semantic vector scan against past system templates stored in your local cache and cloud vault.
            </p>
          </div>

          {/* Input field */}
          <div className="space-y-2">
            <label className="text-xs text-[var(--color-muted)] font-[var(--font-mono)] font-bold uppercase block pl-1">
              Requirement Input:
            </label>
            <textarea
              value={advicePrompt}
              onChange={(e) => setAdvicePrompt(e.target.value)}
              rows={5}
              className="w-full card-core p-4 text-xs text-[var(--color-ink)] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]/20 transition-all font-[var(--font-sans)] resize-none"
              placeholder="e.g. Build JWT auth with permission gate and role checking..."
              id="vector-specs-textarea"
            />
          </div>

          <button
            onClick={executeVectorScans}
            disabled={adviceLoading}
            className="w-full btn-pill flex items-center justify-center gap-2 disabled:opacity-50"
            id="vector-run-audit-btn"
          >
            {adviceLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Checking Cosine Similarity Indexes...</span>
              </>
            ) : (
              <>
                <Compass className="w-3.5 h-3.5" />
                <span>Run Vector Audit Advisory</span>
              </>
            )}
          </button>

          <div className="card-core p-3 text-xs text-[var(--color-muted)] leading-relaxed bg-[var(--color-canvas)]">
            <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-[var(--color-sage)]" />
            <strong>Dynamic Gaps Diagnostic</strong>: Matches active specs with past duplicates to warn if security gaps, CORS errors, or scale-bottlenecks exist in your historical prompt footprint.
          </div>
        </div>

        {/* Memory Chunks — Context Assembly */}
        <div className="card-shell p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[var(--color-sage)]" />
              <h4 className="text-xs font-bold text-[var(--color-ink)] uppercase tracking-wide font-[var(--font-sans)]">
                Memory Chunk Assembly
              </h4>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setContextMode("assemble")}
                className={`text-xs px-2.5 py-1 rounded-md transition-all duration-300 font-[var(--font-mono)] ${
                  contextMode === "assemble"
                    ? "bg-[var(--color-sage)]/10 text-[var(--color-sage)] border border-[var(--color-sage)]/20"
                    : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                }`}
              >
                Assemble
              </button>
              <button
                onClick={() => setContextMode("review")}
                className={`text-xs px-2.5 py-1 rounded-md transition-all duration-300 font-[var(--font-mono)] ${
                  contextMode === "review"
                    ? "bg-[var(--color-sage)]/10 text-[var(--color-sage)] border border-[var(--color-sage)]/20"
                    : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                }`}
              >
                Review
              </button>
            </div>
          </div>

          {contextMode === "assemble" ? (
            <>
              <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                Select memory chunks to assemble into a composite context window. Chosen blocks will be concatenated in order of relevance.
              </p>

              <div className="space-y-2">
                {MOCK_MEMORY_CHUNKS.map((chunk) => {
                  const isActive = activeChunks.has(chunk.id);
                  return (
                    <button
                      key={chunk.id}
                      onClick={() => toggleChunk(chunk.id)}
                      className={`w-full text-left card-core p-3 transition-all duration-300 group ${
                        isActive
                          ? "border-[var(--color-sage)]/30 bg-[var(--color-sage)]/[0.03]"
                          : "hover:border-[var(--color-hairline-strong)]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Hash className={`w-3 h-3 ${isActive ? "text-[var(--color-sage)]" : "text-[var(--color-muted)]"}`} />
                          <span className="text-xs font-[var(--font-mono)] text-[var(--color-muted)] tabular-nums">
                            {chunk.id}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-[var(--font-mono)] font-bold tabular-nums ${
                            chunk.relevance >= 0.9 ? "text-[var(--color-sage)]" :
                            chunk.relevance >= 0.7 ? "text-amber-600" :
                            "text-[var(--color-muted)]"
                          }`}>
                            {(chunk.relevance * 100).toFixed(0)}%
                          </span>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                            isActive
                              ? "bg-[var(--color-sage)] border-[var(--color-sage)]"
                              : "border-[var(--color-hairline)] group-hover:border-[var(--color-sage)]/40"
                          }`}>
                            {isActive && <Check className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                      </div>
                      <p className={`text-xs leading-relaxed ${isActive ? "text-[var(--color-ink)]" : "text-[var(--color-muted)]"}`}>
                        {chunk.text}
                      </p>
                      <p className="text-xs text-[var(--color-muted)]/60 font-[var(--font-mono)] mt-1">
                        src: {chunk.source}
                      </p>
                    </button>
                  );
                })}
              </div>

              {selectedChunkCount > 0 && (
                <div className="card-core p-3 bg-[var(--color-sage)]/[0.03] border-[var(--color-sage)]/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-[var(--font-mono)] text-[var(--color-sage)] font-bold">
                      {selectedChunkCount} chunk{selectedChunkCount !== 1 ? "s" : ""} selected
                    </span>
                    <button
                      onClick={() => copyToClipboard(assembledContext, "assembled-context")}
                      className="btn-ghost flex items-center gap-1.5 text-xs py-1 px-2"
                    >
                      {copiedId === "assembled-context" ? (
                        <>
                          <Check className="w-3 h-3 text-[var(--color-sage)]" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Context</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                Assembled context preview from selected memory chunks:
              </p>
              {selectedChunkCount > 0 ? (
                <pre className="card-core p-4 text-xs font-[var(--font-mono)] text-[var(--color-ink)] whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                  {assembledContext}
                </pre>
              ) : (
                <div className="card-core p-8 text-center text-xs text-[var(--color-muted)]">
                  No chunks selected. Switch to <strong>Assemble</strong> mode and select memory blocks to build a composite context.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Architectural Report */}
      <div className="lg:col-span-7">
        {adviceLoading ? (
          <div className="card-shell h-full min-h-[360px] flex flex-col items-center justify-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[var(--color-sage)]/10 border border-[var(--color-sage)]/20 flex items-center justify-center">
              <Brain className="w-7 h-7 text-[var(--color-sage)] animate-spin" />
            </div>
            <div className="max-w-md space-y-1.5">
              <h5 className="text-xs font-bold text-[var(--color-sage)] uppercase tracking-wider font-[var(--font-mono)]">Running Semantic Scan</h5>
              <p className="text-xs text-[var(--color-muted)] font-[var(--font-sans)] leading-normal">
                Querying prompts table using vector similarity search. Fetching comparable system designs from your database vault to cross-check structural patterns...
              </p>
            </div>
          </div>
        ) : adviceReport ? (
          <div className="card-shell p-6 space-y-5" id="advisory-report-content">

            {/* Header */}
            <div className="border-b border-[var(--color-hairline)] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="space-y-0.5">
                <div className="eyebrow">
                  <Check className="w-3 h-3 text-[var(--color-sage)] mr-1" />
                  <span>Vector Audit Completed</span>
                </div>
                <h4 className="text-xs font-bold text-[var(--color-ink)] uppercase font-[var(--font-sans)]">
                  Personalized Architectural Assessment
                </h4>
              </div>
              <div className="flex card-core px-3 py-1.5 items-center gap-2 shrink-0">
                <BarChart3 className="w-3.5 h-3.5 text-[var(--color-sage)]" />
                <span className="text-xs font-[var(--font-mono)] text-[var(--color-muted)]">Vault Duplication Index:</span>
                <span className="text-xs font-[var(--font-mono)] font-bold text-[var(--color-sage)] tabular-nums">
                  {adviceReport.report.overallOverlapScore}%
                </span>
              </div>
            </div>

            {/* Commentary */}
            <p className="text-xs text-[var(--color-muted)] card-core p-4 italic font-[var(--font-sans)] leading-relaxed bg-[var(--color-canvas)]">
              &ldquo;{adviceReport.report.architectReviewCommentary}&rdquo;
            </p>

            {/* Matched Items */}
            {adviceReport.matchedItems && adviceReport.matchedItems.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-[var(--font-mono)] text-[var(--color-sage)] tracking-wider uppercase font-bold pl-0.5">
                  Matched Vault Specimens:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {adviceReport.matchedItems.map((item: VectorMatch, i: number) => (
                    <div key={item.id} className="card-core p-3 flex justify-between items-center text-xs font-[var(--font-mono)] font-semibold text-[var(--color-ink)]">
                      <span className="truncate mr-2">{i + 1}. {item.title}</span>
                      <span className="text-[var(--color-sage)] tabular-nums shrink-0">{(item.similarity * 100).toFixed(0)}% sim</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subsections */}
            <div className="space-y-3 pt-1 text-xs">

              {/* Reusable Components */}
              <div className="card-core p-4 space-y-2 bg-[var(--color-sage)]/[0.02] border-[var(--color-sage)]/[0.08]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--color-sage)]" />
                  <span className="text-xs uppercase font-[var(--font-mono)] text-[var(--color-sage)] font-bold tracking-wider block">
                    Reusable Specifications Found:
                  </span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-[var(--color-muted)] font-[var(--font-sans)] leading-normal text-xs">
                  {adviceReport.report.matchingPriorFeatures.map((feat: string, idx: number) => (
                    <li key={idx}>{feat}</li>
                  ))}
                </ul>
              </div>

              {/* Past Defects */}
              <div className="card-core p-4 space-y-2 bg-amber-500/[0.02] border-amber-500/[0.08]">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-xs uppercase font-[var(--font-mono)] text-amber-600 font-bold tracking-wider block">
                    Legacy Defects to Avoid:
                  </span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-[var(--color-muted)] font-[var(--font-sans)] leading-normal text-xs">
                  {adviceReport.report.diagnosedPastDefects.map((def: string, idx: number) => (
                    <li key={idx}>{def}</li>
                  ))}
                </ul>
              </div>

              {/* Predicted Bottlenecks */}
              <div className="card-core p-4 space-y-2 bg-rose-500/[0.02] border-rose-500/[0.08]">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-rose-500" />
                  <span className="text-xs uppercase font-[var(--font-mono)] text-rose-500 font-bold tracking-wider block">
                    Future Bottlenecks Forecasted:
                  </span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-[var(--color-muted)] font-[var(--font-sans)] leading-normal text-xs">
                  {adviceReport.report.predictedFutureBottlenecks.map((bot: string, idx: number) => (
                    <li key={idx}>{bot}</li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="card-core p-4 space-y-2 bg-[var(--color-sage)]/[0.02] border-[var(--color-sage)]/[0.08]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-sage)]" />
                  <span className="text-xs uppercase font-[var(--font-mono)] text-[var(--color-sage)] font-bold tracking-wider block">
                    Tactical Architecture Remediation:
                  </span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-[var(--color-muted)] font-[var(--font-sans)] leading-normal text-xs">
                  {adviceReport.report.concreteRecommendations.map((rec: string, idx: number) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>

            </div>

          </div>
        ) : (
          <div className="card-shell h-full min-h-[360px] flex flex-col items-center justify-center text-center p-6 gap-3 text-[var(--color-muted)]">
            <div className="w-16 h-16 rounded-full bg-[var(--color-canvas-2)] border border-[var(--color-hairline)] flex items-center justify-center">
              <Search className="w-7 h-7 text-[var(--color-muted)]" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h5 className="text-xs font-semibold text-[var(--color-ink)] font-[var(--font-sans)]">Architect Advisor Idle</h5>
              <p className="text-xs leading-relaxed font-[var(--font-sans)]">
                Click <strong>Run Vector Audit Advisory</strong> to execute an array similarity scan on your vault and compile personalized architectural reports.
              </p>
            </div>

            {/* Memory chunk preview (decorative) */}
            <div className="w-full max-w-sm mt-4 space-y-2">
              {MOCK_MEMORY_CHUNKS.slice(0, 2).map(chunk => (
                <div key={chunk.id} className="card-core p-3 opacity-50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-[var(--font-mono)] text-[var(--color-muted)]">{chunk.id}</span>
                    <span className="text-xs font-[var(--font-mono)] text-[var(--color-muted)]">{(chunk.relevance * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
