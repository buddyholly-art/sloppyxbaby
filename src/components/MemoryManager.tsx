import { useState, useEffect } from "react";
import MotherduckConsole from "./MotherduckConsole";
import VectorAdvisor from "./VectorAdvisor";
import {
  Database,
  Search,
  Compass,
  Brain,
  Check,
  Copy,
  ShieldAlert,
  RefreshCw,
  Bookmark,
  Award,
  TrendingDown,
  Wand2,
  CloudCheck,
  FolderOpen,
  CloudLightning,
  Trash2,
  UserCheck,
  Lock
} from "lucide-react";
import { PromptHistoryItem, RecurringIssueInsight } from "../lib/types";
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
  findOrCreateAppFolder,
  uploadPromptFile,
  downloadAllVaultFiles,
  deleteVaultFile
} from "../lib/googleDrive";

interface MemoryManagerProps {
  history: PromptHistoryItem[];
  currentInputPrompt: string;
}

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
  driveFileId?: string;
}

export default function MemoryManager({ history, currentInputPrompt }: MemoryManagerProps) {
  const [memories, setMemories] = useState<SavedPromptMemory[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [copiedMemoryId, setCopiedMemoryId] = useState<string | null>(null);

  // Sub-Tab controls
  const [activeTab, setActiveTab2] = useState<"vault" | "motherduck" | "advisor">("vault");

  // Motherduck SQL states
  const [sqlQuery, setSqlQuery] = useState<string>(
    "SELECT title, promptScore, caliberStatus, reusabilityTags FROM prompts ORDER BY promptScore DESC;"
  );
  const [sqlResult, setSqlResult] = useState<{ columns: string[]; rows: any[][] } | null>(null);
  const [sqlError, setSqlError] = useState<string | null>(null);
  const [sqlLoading, setSqlLoading] = useState<boolean>(false);

  // Vector Advice states
  const [advicePrompt, setAdvicePrompt] = useState<string>(currentInputPrompt || "");
  const [adviceReport, setAdviceReport] = useState<any>(null);
  const [adviceLoading, setAdviceLoading] = useState<boolean>(false);

  // Google Drive states
  const [user, setUser] = useState<any>(null);
  const [syncStatus, setSyncStatus] = useState<string>("Disconnected from Google Drive");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [gdriveFolderId, setGdriveFolderId] = useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState(currentInputPrompt || "");
  const [ragMatches, setRagMatches] = useState<SavedPromptMemory[]>([]);
  const [searchingRag, setSearchingRag] = useState(false);

  // Diagnostic states
  const [diagnosticsLoading, setDiagnosticsLoading] = useState(false);
  const [insight, setInsight] = useState<RecurringIssueInsight | null>(null);
  const [insightError, setInsightError] = useState<string | null>(null);

  // Run SQL Console query
  const executeSqlQuery = async (queryToRun: string = sqlQuery) => {
    setSqlLoading(true);
    setSqlError(null);
    setSqlResult(null);
    try {
      const res = await fetch("/api/memory/sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql: queryToRun })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed SQL statement execution.");
      }
      const data = await res.json();
      setSqlResult(data);
    } catch (err: any) {
      setSqlError(err.message || "Database Query halted.");
    } finally {
      setSqlLoading(false);
    }
  };

  // Run Vector Architectural Advice Scan
  const executeVectorScans = async () => {
    if (!advicePrompt.trim()) {
      alert("Please supply design requirements or an active prompt spec to scan!");
      return;
    }
    setAdviceLoading(true);
    setAdviceReport(null);
    try {
      const res = await fetch("/api/memory/vector-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: advicePrompt })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to compile semantic advice report.");
      }
      const data = await res.json();
      setAdviceReport(data);
    } catch (err: any) {
      console.error(err);
      alert(`Recommendation analysis failed: ${err.message || "Ensure your LLM API key is configured in Settings > Secrets"}`);
    } finally {
      setAdviceLoading(false);
    }
  };

  // Sync state with incoming prompt
  useEffect(() => {
    if (currentInputPrompt) {
      setAdvicePrompt(currentInputPrompt);
    }
  }, [currentInputPrompt]);

  // Load local memories from Server
  const fetchMemories = async () => {
    setLoadingList(true);
    try {
      const res = await fetch("/api/memory/list");
      if (res.ok) {
        const data = await res.json();
        setMemories(data.memories || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingList(false);
    }
  };

  // Sync bidirectional between local memory pool and Google Drive Markdown files
  const syncWithGoogleDrive = async (activeUser = user, currentToken = getAccessToken()) => {
    if (!activeUser || !currentToken) {
      setSyncStatus("Sign in with Google to enable Drive synchronization.");
      return;
    }

    setIsSyncing(true);
    setSyncStatus("Connecting to Google Drive...");
    try {
      const folderId = await findOrCreateAppFolder(currentToken);
      setGdriveFolderId(folderId);
      setSyncStatus("Scanning vault...");

      const serverRes = await fetch("/api/memory/list");
      let activeMemoriesList = [...memories];
      if (serverRes.ok) {
        const data = await serverRes.json();
        activeMemoriesList = data.memories || [];
      }

      for (const item of activeMemoriesList) {
        try {
          await uploadPromptFile(currentToken, folderId, item);
        } catch (uploadErr) {
          console.error(`Failed to upload prompt ${item.title} to Google Drive:`, uploadErr);
        }
      }

      const driveFiles = await downloadAllVaultFiles(currentToken, folderId);

      const mergedList = [...activeMemoriesList];
      driveFiles.forEach((fileItem) => {
        const exists = mergedList.some(item => item.id === fileItem.id || item.title === fileItem.title);
        if (!exists) {
          mergedList.push(fileItem);
        } else {
          const index = mergedList.findIndex(item => item.id === fileItem.id || item.title === fileItem.title);
          if (index !== -1) {
            mergedList[index] = {
              ...mergedList[index],
              driveFileId: fileItem.driveFileId,
              syncStatus: "Cloud Synchronized (Google Drive)"
            };
          }
        }
      });

      setMemories(mergedList);
      setSyncStatus("Fully synchronized with Google Drive Vault");
    } catch (err: any) {
      console.error("Google Drive Sync failed:", err);
      setSyncStatus(`Sync Failed: ${err.message || "Unknown error"}`);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchMemories();

    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        syncWithGoogleDrive(currentUser, token);
      },
      () => {
        setUser(null);
        setSyncStatus("Disconnected from Google Drive");
      }
    );

    return () => unsubscribe();
  }, []);

  // Google Sign-In trigger
  const handleGoogleSignIn = async () => {
    try {
      setSyncStatus("Authorizing Google account...");
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        await syncWithGoogleDrive(result.user, result.accessToken);
      }
    } catch (error: any) {
      console.error("Authorization Error:", error);
      setSyncStatus(`Authentication Failed: ${error.message || "Pop up cancelled"}`);
    }
  };

  // Google Log-Out trigger
  const handleSignOut = async () => {
    if (confirm("Disconnect and sign out of your Google Drive Workspace connection?")) {
      try {
        await logout();
        setUser(null);
        setGdriveFolderId(null);
        setSyncStatus("Disconnected from Google Drive");
        fetchMemories();
      } catch (err) {
        console.error("Logout Err:", err);
      }
    }
  };

  // Run dynamic semantic search (RAG)
  const runRagSearch = async (val: string) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setRagMatches([]);
      return;
    }
    setSearchingRag(true);
    try {
      const res = await fetch("/api/memory/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: val })
      });
      if (res.ok) {
        const data = await res.json();
        setRagMatches(data.matches || []);
      }
    } catch (err) {
      console.error("RAG search err:", err);
    } finally {
      setSearchingRag(false);
    }
  };

  useEffect(() => {
    if (currentInputPrompt) {
      runRagSearch(currentInputPrompt);
    }
  }, [currentInputPrompt]);

  // Execute habit diagnosis
  const generateHabitAnalysis = async () => {
    setDiagnosticsLoading(true);
    setInsightError(null);
    setInsight(null);

    const pastInputs = history.map(h => h.inputPrompt);
    if (pastInputs.length === 0 && currentInputPrompt) {
      pastInputs.push(currentInputPrompt);
    }

    if (pastInputs.length === 0) {
      setInsightError("Please run at least one core prompt optimization first to give the diagnostic engine telemetry data.");
      setDiagnosticsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/memory/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pastInputs })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to analyze trends.");
      }

      const data = await res.json();
      if (data.hasInsight) {
        setInsight(data.insight);
      } else {
        setInsightError("Insufficient logs database. Try executing several prompt formulations first.");
      }
    } catch (err: any) {
      setInsightError(err.message || "Endpoint error during dynamic habits computation.");
    } finally {
      setDiagnosticsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMemoryId(id);
    setTimeout(() => setCopiedMemoryId(null), 2000);
  };

  // Delete memory record with confirmation
  const handleDeleteMemory = async (memoryItem: SavedPromptMemory) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete "${memoryItem.title}"? This will permanently delete the Markdown specification file from Google Drive.`
    );
    if (!isConfirmed) return;

    try {
      const token = getAccessToken();
      if (token && memoryItem.driveFileId) {
        setSyncStatus(`Deleting "${memoryItem.title}" from Drive...`);
        await deleteVaultFile(token, memoryItem.driveFileId);
      }

      setMemories(prev => prev.filter(m => m.id !== memoryItem.id));
      setSyncStatus("Item deleted successfully");
    } catch (err: any) {
      console.error(err);
      alert(`Failed to delete memory: ${err.message || "Unknown error"}`);
    }
  };

  return (
    <div className="space-y-8 font-[var(--font-sans)] text-[var(--color-ink)]" id="memory-manager-root">

      {/* Hero Banner */}
      <div className="card-shell p-6 relative overflow-hidden" id="value-peacock-hero">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[var(--color-sage)]/[0.03] rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              <span>Zero-Cost Persistent Intelligence</span>
            </span>
            <span className="eyebrow">
              <Lock className="w-3 h-3 text-[var(--color-sage)] mr-1" />
              <span>Fully Sovereign &amp; Self-Hosted</span>
            </span>
          </div>
          <div className="space-y-2 max-w-4xl">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-ink)] tracking-tight leading-tight">
              Your AI Needs Memory
              <span className="block text-base md:text-lg font-normal text-[var(--color-muted)] tracking-normal mt-1">
                And you should not have to pay for it, or go to some backroom repository to get it.
              </span>
            </h2>
            <p className="text-xs text-[var(--color-muted)] leading-relaxed">
              Most LLM systems have a severe <strong>cognitive amnesia</strong> loop. Every page refresh wipes their context, resulting in costly code duplication and broken architectural assumptions. Commercial vector databases charge hundreds of dollars per month, and self-hosted scripts require hunting down complex, unvetted codebases.
            </p>
            <p className="text-xs text-[var(--color-muted)] leading-relaxed">
              Our <strong>Local Storage Vault</strong> gives your co-designer a permanent, structural memory layer. It works instantly inside your browser using fast client-side SQL and semantic index matching. Total ownership, absolute privacy, zero infrastructure cost.
            </p>
          </div>
        </div>
      </div>

      {/* Cloud Sync Status Panel */}
      <div className="card-shell p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4" id="database-sync-header">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl border ${
            user
              ? "bg-[var(--color-sage)]/10 border-[var(--color-sage)]/20 text-[var(--color-sage)]"
              : "bg-[var(--color-canvas-2)] border-[var(--color-hairline)] text-[var(--color-muted)]"
          }`}>
            <Database className={`w-6 h-6 ${isSyncing ? "animate-spin" : ""}`} />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-[var(--color-ink)] flex items-center gap-2 font-[var(--font-sans)] uppercase tracking-wide">
              <span>Google Drive Vault</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-[var(--font-sans)] uppercase font-bold ${
                user ? "bg-[var(--color-sage)]/10 text-[var(--color-sage)] border border-[var(--color-sage)]/20" : "bg-[var(--color-canvas-2)] text-[var(--color-muted)] border border-[var(--color-hairline)]"
              }`}>
                {user ? "Cloud Synced Active" : "Local Mode Only"}
              </span>
            </h3>
            <p className="text-xs text-[var(--color-muted)] max-w-xl">
              {syncStatus}
            </p>
            {user && (
              <div className="flex items-center gap-2 text-xs text-[var(--color-muted)] font-[var(--font-mono)] pt-1">
                <UserCheck className="w-3.5 h-3.5 text-[var(--color-sage)]" />
                <span>{user.email}</span>
                {gdriveFolderId && (
                  <>
                    <span className="text-[var(--color-hairline)]">·</span>
                    <FolderOpen className="w-3.5 h-3.5 text-[var(--color-sage)]" />
                    <span>Vault: {gdriveFolderId.substring(0, 10)}...</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => syncWithGoogleDrive()}
                disabled={isSyncing}
                className="btn-ghost flex items-center gap-2 text-xs py-2 px-4"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[var(--color-sage)] ${isSyncing ? "animate-spin" : ""}`} />
                <span>Sync Vault Files</span>
              </button>
              <button
                onClick={handleSignOut}
                className="py-2 px-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-600 transition-colors cursor-pointer"
                title="Disconnect Google Account"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center gap-2.5 bg-[var(--color-ink)] hover:bg-[var(--color-ink-2)] text-white px-4 py-2.5 rounded-xl text-xs font-semibold select-none cursor-pointer transition-all"
            >
              <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
              </div>
              <span>Sign in with Google</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex border-b border-[var(--color-hairline)] bg-[var(--color-canvas-2)]/40 p-1 rounded-xl" id="rag-tabs-list">
        <button
          onClick={() => setActiveTab2("vault")}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "vault"
              ? "bg-[var(--color-sage)] text-white shadow-sm"
              : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          <span>Markdown Vault</span>
        </button>
        <button
          onClick={() => setActiveTab2("motherduck")}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "motherduck"
              ? "bg-[var(--color-sage)] text-white shadow-sm"
              : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Client SQL Sandbox</span>
          <span className="text-xs bg-[var(--color-sage)]/20 text-[var(--color-sage)] font-[var(--font-mono)] px-1 rounded-sm uppercase font-bold">Wasm</span>
        </button>
        <button
          onClick={() => setActiveTab2("advisor")}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "advisor"
              ? "bg-[var(--color-sage)] text-white shadow-sm"
              : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Vector Advisor</span>
          <span className="text-xs bg-[var(--color-sage)]/20 text-[var(--color-sage)] font-[var(--font-mono)] px-1 rounded-sm uppercase font-bold">Audit</span>
        </button>
      </div>

      {activeTab === "vault" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT: SEARCH & VAULT LIST */}
          <div className="lg:col-span-7 space-y-6" id="rag-column">

            {/* Semantic Search */}
            <div className="card-shell p-5 space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-[var(--color-ink)] flex items-center gap-2 uppercase tracking-wide font-[var(--font-sans)]">
                  <Compass className="w-4 h-4 text-[var(--color-sage)]" />
                  <span>Semantic Prompt Matching (RAG)</span>
                </h4>
                <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                  Enter structural intents or let the system dynamically suggest reusable templates matching your active workspace request instantly.
                </p>
              </div>

              {/* Input query field */}
              <div className="relative">
                <input
                  type="text"
                  className="w-full card-core pl-10 pr-4 py-2.5 text-xs text-[var(--color-ink)] placeholder:text-[var(--color-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]/20 transition-all font-[var(--font-sans)]"
                  placeholder="Type themes (e.g. 'Auth', 'Websocket', 'Dashboard', 'Scraper')..."
                  value={searchQuery}
                  onChange={(e) => runRagSearch(e.target.value)}
                />
                <Search className="w-4 h-4 text-[var(--color-muted)] absolute left-3.5 top-3" />
              </div>

              {/* Matching Results */}
              <div className="space-y-3" id="rag-matching-results">
                {searchingRag ? (
                  <div className="flex items-center justify-center py-6 text-[var(--color-muted)] text-xs">
                    <RefreshCw className="w-4 h-4 animate-spin text-[var(--color-sage)] mr-2" />
                    <span>Searching vector indexes...</span>
                  </div>
                ) : searchQuery && ragMatches.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-[var(--color-hairline)] rounded-xl text-[var(--color-muted)] text-xs card-core">
                    No matching templates found for &ldquo;{searchQuery}&rdquo;. Try broader technical terminology.
                  </div>
                ) : searchQuery ? (
                  <div className="space-y-3">
                    <p className="text-xs uppercase font-[var(--font-mono)] tracking-wide font-bold text-[var(--color-sage)] pl-1">
                      Matching Templates ({ragMatches.length})
                    </p>
                    {ragMatches.map((match) => (
                      <div
                        key={match.id}
                        className="card-core p-4 hover:border-[var(--color-sage)]/20 transition-all duration-300"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="space-y-0.5">
                            <h5 className="text-xs font-bold font-[var(--font-sans)] text-[var(--color-ink)] flex items-center gap-2">
                              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
                              <span>{match.title}</span>
                            </h5>
                            <p className="text-xs text-[var(--color-muted)] italic">&ldquo;{match.originalInput}&rdquo;</p>
                          </div>
                          <span className="text-xs bg-[var(--color-canvas-2)] border border-[var(--color-hairline)] text-[var(--color-muted)] px-2 py-0.5 rounded-md font-[var(--font-mono)] tabular-nums">
                            Score: {match.promptScore}%
                          </span>
                        </div>

                        <pre className="p-3 my-2 card-core text-xs font-[var(--font-mono)] text-[var(--color-muted)] whitespace-pre-wrap max-h-24 overflow-y-auto">
                          {match.advocatePrompt}
                        </pre>

                        <div className="flex justify-between items-center pt-2">
                          <div className="flex flex-wrap gap-1">
                            {match.reusabilityTags.map((t, idx) => (
                              <span key={idx} className="text-xs uppercase bg-[var(--color-sage)]/10 text-[var(--color-sage)] px-2 py-0.5 rounded-md border border-[var(--color-sage)]/[0.08] font-[var(--font-mono)]">
                                #{t}
                              </span>
                            ))}
                          </div>
                          <button
                            onClick={() => copyToClipboard(match.advocatePrompt, match.id)}
                            className="btn-ghost flex items-center gap-1.5 text-xs py-1 px-2"
                          >
                            {copiedMemoryId === match.id ? (
                              <>
                                <Check className="w-3 h-3 text-[var(--color-sage)]" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Use Template</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-[var(--color-muted)] rounded-xl text-center text-xs border border-dashed border-[var(--color-hairline)] card-core">
                    Ready for query evaluation. Enter search criteria or let active optimized specs trigger recommendations here automatically.
                  </div>
                )}
              </div>
            </div>

            {/* SAVED VAULT LIST */}
            <div className="card-shell p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-semibold text-[var(--color-ink)] flex items-center gap-2 uppercase tracking-wide font-[var(--font-sans)]">
                  <Award className="w-4 h-4 text-[var(--color-sage)]" />
                  <span>Vault ({memories.length})</span>
                </h4>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${
                  user
                    ? "bg-[var(--color-sage)]/10 text-[var(--color-sage)] border border-[var(--color-sage)]/[0.08]"
                    : "bg-[var(--color-sage)]/10 text-[var(--color-sage)] border border-[var(--color-sage)]/20"
                }`}>
                  {user ? "Cloud Synced (.md Vault)" : "Persisted Locally"}
                </span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1" id="saved-memories-scroll">
                {loadingList || isSyncing ? (
                  <div className="text-center py-8 text-[var(--color-muted)] text-xs">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[var(--color-sage)] mb-2" />
                    <span>Synchronizing markdown vault...</span>
                  </div>
                ) : memories.length === 0 ? (
                  <div className="text-center py-8 text-[var(--color-muted)] text-xs italic border border-dashed border-[var(--color-hairline)] rounded-2xl card-core">
                    No prompts archived in your vault yet. Optimise a prompt then save it.
                  </div>
                ) : (
                  memories.map((mem) => (
                    <div
                      key={mem.id}
                      className="card-core p-4 space-y-3 text-xs hover:border-[var(--color-sage)]/[0.12] transition-all duration-300 group"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-bold text-[var(--color-ink)] text-xs font-[var(--font-sans)] flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${mem.promptScore >= 90 ? 'bg-amber-500' : 'bg-[var(--color-sage)]'}`} />
                            <span>{mem.title}</span>
                          </h5>
                          <p className="text-xs text-[var(--color-muted)] mt-0.5 max-w-[280px] line-clamp-1">
                            {mem.originalInput}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="inline-block px-2 py-0.5 bg-[var(--color-canvas-2)] border border-[var(--color-hairline)] text-xs font-bold rounded-md text-[var(--color-sage)] font-[var(--font-mono)] tabular-nums">
                            {mem.promptScore}/100
                          </div>
                          <p className={`text-xs font-[var(--font-mono)] mt-1 font-semibold flex items-center justify-end gap-1 ${
                            mem.driveFileId ? "text-[var(--color-sage)]" : "text-[var(--color-sage)]"
                          }`}>
                            {mem.driveFileId ? <CloudCheck className="w-3.5 h-3.5 inline text-[var(--color-sage)]" /> : null}
                            <span>{mem.syncStatus || "Persisted State"}</span>
                          </p>
                        </div>
                      </div>

                      <pre className="p-3 card-core text-xs font-[var(--font-mono)] text-[var(--color-muted)] whitespace-pre-wrap max-h-24 overflow-y-auto">
                        {mem.advocatePrompt}
                      </pre>

                      {/* Advisory */}
                      <div className="card-core p-3 text-xs text-[var(--color-muted)] leading-relaxed italic bg-[var(--color-canvas)]">
                        <span className="text-[var(--color-sage)] mr-1">Tip:</span>
                        {mem.shouldSaveAdvisory}
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-[var(--color-hairline)]">
                        <div className="flex flex-wrap gap-1">
                          {mem.reusabilityTags.map((tag, i) => (
                            <span key={i} className="text-xs uppercase bg-[var(--color-canvas-2)] border border-[var(--color-hairline)] text-[var(--color-muted)] px-2 py-0.5 rounded-md font-[var(--font-mono)]">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteMemory(mem)}
                            className="btn-ghost p-1.5 text-[var(--color-muted)] hover:text-rose-500 transition-colors cursor-pointer"
                            title="Delete Spec File"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => copyToClipboard(mem.advocatePrompt, mem.id)}
                            className="btn-ghost flex items-center gap-1.5 text-xs py-1 px-2.5"
                          >
                            {copiedMemoryId === mem.id ? (
                              <>
                                <Check className="w-3 h-3 text-[var(--color-sage)]" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Prompt</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: HABITS DIAGNOSTIC PANEL */}
          <div className="lg:col-span-5 space-y-6" id="insights-column">
            <div className="card-shell p-5 space-y-4 relative overflow-hidden">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[var(--color-sage)]">
                  <Brain className="w-5 h-5" />
                  <h4 className="font-bold text-xs font-[var(--font-sans)] uppercase tracking-wider text-[var(--color-ink)]">
                    Habit Quality Diagnostics
                  </h4>
                </div>
                <p className="text-xs text-[var(--color-muted)] leading-relaxed mt-1">
                  Deep analysis engine maps common defects or cargo-cutting patterns in your recent optimization queries, generating an automated corrective pre-pass modifier to inject into future specs.
                </p>
              </div>

              <button
                onClick={generateHabitAnalysis}
                disabled={diagnosticsLoading}
                className="w-full btn-pill flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {diagnosticsLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing recurring patterns...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Execute Trend Diagnosis</span>
                  </>
                )}
              </button>

              {/* Diagnostics Report */}
              <div className="pt-2" id="diagnostics-log-box">
                {insightError && (
                  <div className="card-core p-4 text-rose-600 text-xs flex items-start gap-2 leading-relaxed bg-rose-50">
                    <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{insightError}</span>
                  </div>
                )}

                {insight && (
                  <div className="space-y-4" id="insight-success-box">
                    <div className="card-core p-4 space-y-2 bg-[var(--color-canvas)]">
                      <div className="flex items-center gap-2 text-rose-500 font-[var(--font-mono)] text-xs uppercase font-bold">
                        <TrendingDown className="w-4 h-4 text-rose-500" />
                        <span>Diagnosed Loop Weakness:</span>
                      </div>
                      <h5 className="text-xs font-bold font-[var(--font-sans)] text-[var(--color-ink)] uppercase tracking-wide">
                        {insight.issuePattern}
                      </h5>
                      <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                        {insight.explanation}
                      </p>
                    </div>

                    {/* Pre-flight patch */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center pl-1">
                        <span className="text-xs font-[var(--font-mono)] text-[var(--color-sage)] font-bold uppercase tracking-wide">
                          Generated Pre-Flight Patch:
                        </span>
                        <button
                          onClick={() => copyToClipboard(insight.mitigationPrompt, "insight-copy")}
                          className="btn-ghost flex items-center gap-1.5 text-xs py-1 px-2"
                        >
                          {copiedMemoryId === "insight-copy" ? (
                            <>
                              <Check className="w-3 h-3 text-[var(--color-sage)]" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Modifier</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-3 card-core font-[var(--font-mono)] text-xs text-[var(--color-sage)] whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                        {insight.mitigationPrompt}
                      </pre>
                      <p className="text-xs text-[var(--color-muted)] leading-normal pl-0.5">
                        Prepend or append this block of safeguards to your next prompts to teach any target LLM to stop making this exact mistake.
                      </p>
                    </div>
                  </div>
                )}

                {!insight && !insightError && !diagnosticsLoading && (
                  <div className="p-4 text-center text-xs text-[var(--color-muted)] border border-dashed border-[var(--color-hairline)] rounded-xl card-core">
                    Tap &ldquo;Execute Trend Diagnosis&rdquo; to analyze session inputs and compile custom corrections.
                  </div>
                )}
              </div>

              {/* Note */}
              <div className="card-core px-3 py-2.5 text-xs text-[var(--color-muted)] leading-relaxed flex items-start gap-2 bg-[var(--color-canvas)]">
                <CloudLightning className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Obsidian &amp; Drive Sync</strong>: Files save directly inside your Google Drive as standard markdown, compatible with Obsidian&apos;s structural indexing setup.
                </span>
              </div>

            </div>
          </div>
        </div>
      )}

      {activeTab === "motherduck" && (
        <MotherduckConsole
          sqlQuery={sqlQuery}
          setSqlQuery={setSqlQuery}
          sqlResult={sqlResult}
          sqlError={sqlError}
          sqlLoading={sqlLoading}
          executeSqlQuery={executeSqlQuery}
        />
      )}

      {activeTab === "advisor" && (
        <VectorAdvisor
          advicePrompt={advicePrompt}
          setAdvicePrompt={setAdvicePrompt}
          adviceReport={adviceReport}
          adviceLoading={adviceLoading}
          executeVectorScans={executeVectorScans}
        />
      )}

    </div>
  );
}
