import { useState, useEffect } from "react";
import {
  SkillSpectorEngine,
  PRESEED_SKILLS,
  PreseedSkill,
  ScanResult,
  Finding,
  Severity
} from "../lib/skillSpectorEngine";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Code,
  Plus,
  Trash2,
  Play,
  CheckCircle,
  Terminal,
  FileCode,
  Download,
  HelpCircle,
  FileWarning,
  Eye,
  Settings,
  Scale,
  Brain,
  Lock,
  Search,
  Trophy,
  Lightbulb,
  BarChart3,
  Target,
  ChevronRight
} from "lucide-react";

export default function DataFlywheelGuard() {
  const [selectedSkillId, setSelectedSkillId] = useState<string>("exfiltrator");
  const [customFiles, setCustomFiles] = useState<{ [filename: string]: string }>({});
  const [isUsingCustom, setIsUsingCustom] = useState<boolean>(false);
  const [selectedFilename, setSelectedFilename] = useState<string>("SKILL.md");
  const [editorContent, setEditorContent] = useState<string>("");
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<"findings" | "remediation" | "sarif" | "summary">("findings");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  // File drag & drop attachment upload state
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Load a preseeded skill
  const loadPreseedSkill = (id: string) => {
    const skill = PRESEED_SKILLS.find((s) => s.id === id);
    if (skill) {
      const firstFile = Object.keys(skill.files)[0] || "SKILL.md";
      setCustomFiles({ ...skill.files });
      setSelectedFilename(firstFile);
      setEditorContent(skill.files[firstFile] || "");
      setIsUsingCustom(false);
      setSelectedSkillId(id);
    }
  };

  // Initialize with the first preseeded skill on mount
  useEffect(() => {
    loadPreseedSkill("exfiltrator");
  }, []);

  // Run the security scan on the current virtual workspace
  const handleRunScan = () => {
    const result = SkillSpectorEngine.scan(customFiles);
    setScanResult(result);
  };

  // Keep editor content synchronized in customFiles virtual index
  useEffect(() => {
    if (selectedFilename) {
      setCustomFiles((prev) => ({
        ...prev,
        [selectedFilename]: editorContent
      }));
    }
  }, [editorContent, selectedFilename]);

  // Run initial scan anytime customFiles index structure updates
  useEffect(() => {
    const keys = Object.keys(customFiles);
    if (keys.length > 0) {
      const result = SkillSpectorEngine.scan(customFiles);
      setScanResult(result);
    }
  }, [customFiles]);

  const handleFileChange = (filename: string) => {
    setSelectedFilename(filename);
    setEditorContent(customFiles[filename] || "");
  };

  const handleAddNewFile = () => {
    const name = prompt("Enter new filename with extension (e.g. tool.py, rules.json):");
    if (name && name.trim()) {
      const cleanName = name.trim();
      setCustomFiles((prev) => ({
        ...prev,
        [cleanName]: "# Virtual code repository block\n"
      }));
      setSelectedFilename(cleanName);
      setEditorContent("# Virtual code repository block\n");
      setIsUsingCustom(true);
    }
  };

  const handleDeleteFile = (filename: string) => {
    const keys = Object.keys(customFiles);
    if (keys.length <= 1) {
      alert("A workspace must contain at least one code or manifest file.");
      return;
    }
    const filtered = { ...customFiles };
    delete filtered[filename];
    setCustomFiles(filtered);

    const remainingKeys = Object.keys(filtered);
    const nextFile = remainingKeys[0] || "SKILL.md";
    setSelectedFilename(nextFile);
    setEditorContent(filtered[nextFile] || "");
    setIsUsingCustom(true);
  };

  // Drag and drop handler for local files
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          if (text) {
            setCustomFiles((prev) => ({
              ...prev,
              [file.name]: text
            }));
            setSelectedFilename(file.name);
            setEditorContent(text);
            setIsUsingCustom(true);
          }
        };
        reader.readAsText(file);
      });
    }
  };

  const handleFileImportInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          if (text) {
            setCustomFiles((prev) => ({
              ...prev,
              [file.name]: text
            }));
            setSelectedFilename(file.name);
            setEditorContent(text);
            setIsUsingCustom(true);
          }
        };
        reader.readAsText(file);
      });
    }
  };

  const exportSarifReport = () => {
    if (!scanResult) return;
    const sarif = getSarifSchema(scanResult);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sarif, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `skillspector-report-${scanResult.scanId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Color helper based on findings severity
  const getSeverityBadge = (severity: Severity) => {
    switch (severity) {
      case Severity.CRITICAL:
        return "text-rose-600 bg-rose-50 border border-rose-200";
      case Severity.HIGH:
        return "text-orange-600 bg-orange-50 border border-orange-200";
      case Severity.MEDIUM:
        return "text-amber-600 bg-amber-50 border border-amber-200";
      case Severity.LOW:
        return "text-sky-600 bg-sky-50 border border-sky-200";
    }
  };

  const getRiskMeterColor = (score: number) => {
    if (score === 0) return "bg-emerald-500 text-emerald-600";
    if (score < 15) return "bg-emerald-500/80 text-emerald-600";
    if (score < 45) return "bg-amber-500 text-amber-600";
    if (score < 70) return "bg-orange-500 text-orange-600";
    return "bg-rose-500 text-rose-600";
  };

  const getSarifSchema = (result: ScanResult) => {
    const rules = result.findings.map((f) => ({
      id: f.ruleId,
      name: f.category,
      shortDescription: { text: f.message },
      fullDescription: { text: f.explanation },
      help: { text: f.remediation }
    }));

    const results = result.findings.map((f) => ({
      ruleId: f.ruleId,
      level: f.severity.toLowerCase(),
      message: { text: f.message },
      locations: [
        {
          physicalLocation: {
            artifactLocation: { uri: f.location.file },
            region: {
              startLine: f.location.startLine,
              snippet: { text: f.location.snippet }
            }
          }
        }
      ]
    }));

    return {
      $schema: "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
      version: "2.1.0",
      runs: [
        {
          tool: {
            driver: {
              name: "GuidelineGuard Static & Behavioral Analyzer",
              version: "1.1.0",
              rules: rules
            }
          },
          results: results
        }
      ]
    };
  };

  return (
    <div className="flex flex-col space-y-8" id="skillspector-root">

      {/* Evidence & Clinical Statement Header */}
      <div className="card-shell rounded-[2rem] p-6 md:p-8 relative overflow-hidden reveal" id="skillspector-welcome">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--color-sage-soft)] rounded-full blur-3xl opacity-40"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="eyebrow">
                <span className="eyebrow-dot"></span>
                Implicit Trust Shield
              </span>
              <span className="text-xs text-[var(--color-muted)] font-[var(--font-sans)] tracking-wide font-medium">
                Section SC-4 & B.3
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-[var(--color-ink)] tracking-tight font-[var(--font-sans)] flex items-center gap-2">
              <Shield className="w-5 h-5 text-[var(--color-sage)]" />
              <span>GuidelineGuard Security Sandbox</span>
            </h2>
            <p className="text-xs text-[var(--color-muted)] font-[var(--font-sans)] leading-relaxed">
              <Lightbulb className="w-3.5 h-3.5 inline-block mr-1 text-[var(--color-sage)]" />
              <strong className="text-[var(--color-ink)]">What is this?</strong> A virtual security inspector. Paste, edit, or upload your custom rules or prompt files (like <code className="font-[var(--font-mono)] text-[11px] bg-[var(--color-canvas-2)] px-1 py-0.5 rounded">SKILL.md</code>) to scan for potential design flaws, insecure API key references, or memory issues before feeding them to AI models.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-[var(--color-surface-solid)] border border-[var(--color-hairline)] rounded-xl p-3.5 flex items-center gap-3">
              <div className="space-y-0.5 text-right">
                <p className="text-[10px] text-[var(--color-muted)] font-[var(--font-mono)] uppercase tracking-wider">Vulnerability Samples</p>
                <p className="text-xs font-semibold text-[var(--color-ink)]">Interactive Lab Active</p>
              </div>
              <div className="pulse-dot"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Code Workspace + Realtime Audit Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 reveal" id="skillspector-workspace-grid">

        {/* Left Section: Source Repo Code Editor (col-span-12 or col-span-5) */}
        <div className="col-span-1 lg:col-span-5 h-full flex flex-col space-y-6" id="virtual-repos-pane">

          {/* File Repo Tab Controls */}
          <div className="card-core rounded-[2rem] p-5 flex flex-col space-y-4" id="virtual-files">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold font-[var(--font-sans)] tracking-wide text-[var(--color-muted)] flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-[var(--color-sage)]" />
                <span>Virtual Skill Filesystem</span>
              </h3>

              <button
                id="add-custom-file-btn"
                onClick={handleAddNewFile}
                className="text-xs text-[var(--color-sage)] hover:text-[var(--color-sage-glow)] font-[var(--font-sans)] font-medium flex items-center gap-1 transition-all hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add File</span>
              </button>
            </div>

            {/* Select preseeded sample or switch to custom */}
            <div className="space-y-2">
              <label className="text-xs text-[var(--color-muted)] font-[var(--font-mono)] block uppercase tracking-wider">Select Demonstrational Vulnerable Spec:</label>
              <select
                id="preseeded-vulnerabilities-selector"
                value={isUsingCustom ? "custom" : selectedSkillId}
                onChange={(e) => {
                  if (e.target.value === "custom") {
                    setIsUsingCustom(true);
                  } else {
                    loadPreseedSkill(e.target.value);
                  }
                }}
                className="w-full bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-xl p-2.5 text-xs text-[var(--color-ink)] font-[var(--font-sans)] focus:outline-none focus:border-[var(--color-sage)] transition-all font-medium"
              >
                {PRESEED_SKILLS.map((skill) => (
                  <option key={skill.id} value={skill.id}>{skill.name}</option>
                ))}
                <option value="custom">[Custom Scratchpad Sandbox]</option>
              </select>
            </div>

            {/* Attached file browser row */}
            <div className="flex flex-wrap gap-1.5 pt-1.5" id="skill-files-list">
              {Object.keys(customFiles).map((filename) => (
                <div
                  key={filename}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-[var(--font-mono)] transition-all select-none ${
                    selectedFilename === filename
                      ? "bg-[var(--color-canvas-2)] border-[var(--color-hairline-strong)] text-[var(--color-ink)]"
                      : "bg-[var(--color-surface)] border-[var(--color-hairline)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:border-[var(--color-hairline-strong)]"
                  }`}
                >
                  <button
                    id={`select-file-${filename}`}
                    onClick={() => handleFileChange(filename)}
                    className="cursor-pointer text-left focus:outline-none"
                  >
                    {filename}
                  </button>
                  <button
                    id={`delete-file-${filename}`}
                    onClick={() => handleDeleteFile(filename)}
                    className="text-[var(--color-muted)] hover:text-rose-500 transition-colors"
                    title="Delete file element"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* In-Browser Drag-and-Drop Area */}
            <div
              id="file-drop-zone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-[var(--color-sage)] bg-[var(--color-sage-soft)] text-[var(--color-sage)]"
                  : "border-[var(--color-hairline)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-hairline-strong)]"
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <Download className="w-6 h-6 text-[var(--color-muted)]" />
                <p className="text-xs font-[var(--font-sans)]">
                  Drag and drop code files <span className="text-[var(--color-sage)] font-semibold">(.py, .md, .js)</span> here, or{" "}
                  <label className="text-[var(--color-sage)] font-semibold cursor-pointer underline">
                    browse local files
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileImportInput}
                    />
                  </label>
                </p>
                <span className="text-[10px] text-[var(--color-muted)] font-[var(--font-mono)] block">Scans locally in safe, private Web Workers</span>
              </div>
            </div>

          </div>

          {/* Core Code Source Code Editor */}
          <div className="card-core rounded-[2rem] p-5 flex-1 flex flex-col space-y-3" id="editor-console">
            <div className="flex items-center justify-between" id="editor-header">
              <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
                <Code className="w-4 h-4 text-[var(--color-sage)]" />
                <span>Sandbox Editor:</span>
                <span className="font-[var(--font-mono)] text-[var(--color-ink)]">{selectedFilename}</span>
              </div>
              <span className="text-[10px] text-[var(--color-muted)] font-[var(--font-mono)]">UTF-8 File Element</span>
            </div>

            <div className="flex-1 min-h-[300px] flex rounded-xl overflow-hidden border border-[var(--color-hairline)]" id="raw-editor-matrix">
              {/* Virtual Line Numbers Gutter */}
              <div className="bg-[var(--color-canvas-2)] text-[var(--color-muted)] font-[var(--font-mono)] text-xs text-right pr-2.5 pl-3 pt-3 select-none flex flex-col leading-relaxed gap-0.5 border-r border-[var(--color-hairline)]">
                {Array.from({ length: Math.max(1, editorContent.split("\n").length) }).map((_, i) => (
                  <span key={i} className="text-[11px] block">{i + 1}</span>
                ))}
              </div>

              {/* Editable area */}
              <textarea
                id="skill-code-textarea"
                value={editorContent}
                onChange={(e) => {
                  setEditorContent(e.target.value);
                  setIsUsingCustom(true);
                }}
                className="flex-1 bg-[var(--color-canvas)] text-[var(--color-ink)] font-[var(--font-mono)] text-xs p-3 focus:outline-none resize-none leading-relaxed overflow-y-auto"
                style={{ tabSize: 4 }}
                placeholder="Paste or modify code to run live static diagnostics..."
              />
            </div>
          </div>

        </div>

        {/* Right Section: Real-Time Diagnostic Audit Output (col-span-12 or col-span-7) */}
        <div className="col-span-1 lg:col-span-7 flex flex-col space-y-6" id="diagnostics-matrix-pane">

          {/* Risk Level Rating Indicator Card */}
          {scanResult && (
            <div className={`card-shell rounded-[2rem] p-6 relative overflow-hidden transition-all duration-500 ${
              scanResult.riskSeverity === "CRITICAL" ? "border-rose-200 bg-rose-50/30" :
              scanResult.riskSeverity === "HIGH" ? "border-orange-200 bg-orange-50/30" :
              scanResult.riskSeverity === "MEDIUM" ? "border-amber-200 bg-amber-50/30" :
              "border-emerald-200 bg-emerald-50/30"
            }`} id="overall-risk-scoreboard">

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">

                {/* Score Dial */}
                <div className="md:col-span-4 flex flex-col items-center justify-center p-3 text-center border-b md:border-b-0 md:border-r border-[var(--color-hairline)]">
                  <span className="text-[10px] font-[var(--font-mono)] uppercase text-[var(--color-muted)] tracking-wider">Overall Risk Score</span>

                  <div className="relative flex items-center justify-center w-26 h-26 mt-2 pt-0.5">
                    {/* Circle SVG */}
                    <svg className="absolute w-full h-full transform -rotate-90">
                      <circle cx="52" cy="52" r="44" className="stroke-[var(--color-canvas-2)] fill-transparent" strokeWidth="6" />
                      <circle
                        cx="52"
                        cy="52"
                        r="44"
                        className={`fill-transparent transition-all duration-500 ${
                          scanResult.riskSeverity === "CRITICAL" ? "stroke-rose-500" :
                          scanResult.riskSeverity === "HIGH" ? "stroke-orange-500" :
                          scanResult.riskSeverity === "MEDIUM" ? "stroke-amber-500" :
                          "stroke-emerald-500"
                        }`}
                        strokeWidth="7"
                        strokeDasharray={2 * Math.PI * 44}
                        strokeDashoffset={2 * Math.PI * 44 * (1 - scanResult.riskScore / 100)}
                      />
                    </svg>
                    <div className="text-center space-y-0.5 z-10">
                      <span className="text-2xl font-bold font-[var(--font-mono)] text-[var(--color-ink)]">{scanResult.riskScore}</span>
                      <span className="text-[10px] text-[var(--color-muted)] block font-[var(--font-mono)]">/100 Max</span>
                    </div>
                  </div>
                </div>

                {/* Score description & recommendation */}
                <div className="md:col-span-8 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-[var(--font-mono)] ${
                      scanResult.riskSeverity === "CRITICAL" || scanResult.riskSeverity === "HIGH" ? "bg-rose-100 text-rose-600" :
                      scanResult.riskSeverity === "MEDIUM" ? "bg-amber-100 text-amber-600" :
                      "bg-emerald-100 text-emerald-600"
                    }`}>
                      {scanResult.riskSeverity} Risk Level
                    </span>
                    <span className="text-xs text-[var(--color-muted)]">&middot;</span>
                    <span className="text-[11px] font-[var(--font-mono)] text-[var(--color-muted)]">Scan ID: {scanResult.scanId}</span>
                  </div>

                  <h4 className="text-sm font-bold text-[var(--color-ink)]">
                    {scanResult.riskRecommendation === "DO_NOT_INSTALL" && (
                      <span className="flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                        Action Advised: Do not authorize deployment!
                      </span>
                    )}
                    {scanResult.riskRecommendation === "CAUTION" && (
                      <span className="flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-amber-500" />
                        Warning: Exercise review before activation.
                      </span>
                    )}
                    {scanResult.riskRecommendation === "SAFE" && (
                      <span className="flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        Checked: Certified safe to declare clean.
                      </span>
                    )}
                  </h4>

                  <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                    {scanResult.riskRecommendation === "DO_NOT_INSTALL" &&
                      "Severe capability loopholes, un-sanitized dynamic compiles, or intentional credential extraction tunnels were flagged. Recommend enforcing explicit authorization checks immediately."
                    }
                    {scanResult.riskRecommendation === "CAUTION" &&
                      "Some minor discrepancies present, such as overdeclared workspace permissions or un-referenced capabilities. These present unnecessary danger surface if compromised."
                    }
                    {scanResult.riskRecommendation === "SAFE" &&
                      "This skill fully demonstrates appropriate least-privilege principles, declaring explicit schema constraints without any nested obfuscation vectors."
                    }
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-[var(--color-muted)] font-[var(--font-mono)]">
                    <span>Parsed: {scanResult.filesScanned} virtual files</span>
                    <span>Verified: {scanResult.findings.length} system anomalies</span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Audit Tabs */}
          <div className="card-core rounded-[2rem] flex flex-col overflow-hidden flex-1" id="audit-tabs-container">

            <div className="flex bg-[var(--color-canvas)] border-b border-[var(--color-hairline)] px-4" id="audit-tabs-navigation">
              <button
                id="audit-tab-findings-btn"
                onClick={() => setActiveAnalysisTab("findings")}
                className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeAnalysisTab === "findings"
                    ? "border-[var(--color-sage)] text-[var(--color-ink)]"
                    : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink-2)]"
                }`}
              >
                <FileWarning className="w-3.5 h-3.5" />
                <span>Static Anomalies ({scanResult?.findings.length || 0})</span>
              </button>

              <button
                id="audit-tab-remediation-btn"
                onClick={() => setActiveAnalysisTab("remediation")}
                className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeAnalysisTab === "remediation"
                    ? "border-[var(--color-sage)] text-[var(--color-ink)]"
                    : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink-2)]"
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Remediation Roadmap</span>
              </button>

              <button
                id="audit-tab-sarif-btn"
                onClick={() => setActiveAnalysisTab("sarif")}
                className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeAnalysisTab === "sarif"
                    ? "border-[var(--color-sage)] text-[var(--color-ink)]"
                    : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink-2)]"
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>SARIF Export</span>
              </button>
            </div>

            {/* TAB CONTENTS */}
            <div className="p-5 flex-1 overflow-y-auto max-h-[500px]" id="audit-tab-content">

              {/* Tab 1: Findings list */}
              {activeAnalysisTab === "findings" && (
                <div className="space-y-4" id="findings-viewport">
                  {(!scanResult || scanResult.findings.length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-[var(--color-muted)] gap-2">
                      <ShieldCheck className="w-12 h-12 text-emerald-300" />
                      <h4 className="font-semibold text-[var(--color-ink)] font-[var(--font-sans)] text-sm">Perfect Score! No anomalies found.</h4>
                      <p className="text-xs text-[var(--color-muted)] max-w-sm">No Least Privilege breaches or Tool Poisoning vectors detected inside code repositories.</p>
                    </div>
                  ) : (
                    scanResult.findings.map((f, i) => (
                      <div
                        key={i}
                        className="p-4 bg-[var(--color-surface)] border border-[var(--color-hairline)] rounded-xl space-y-3 shadow-[var(--shadow-card)] flex flex-col justify-between"
                        id={`finding-card-${f.ruleId}-${i}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap gap-y-1">
                              <span className={`text-[10px] font-[var(--font-mono)] px-2 py-0.5 rounded-full font-bold uppercase ${getSeverityBadge(f.severity)}`}>
                                {f.severity}
                              </span>
                              <span className="text-[10px] font-[var(--font-mono)] text-[var(--color-sage)] px-1.5 rounded-full bg-[var(--color-sage-soft)] border border-[var(--color-sage-dim)]">
                                {f.ruleId}
                              </span>
                              <span className="text-[11px] font-[var(--font-mono)] text-[var(--color-muted)] truncate">
                                {f.location.file}:{f.location.startLine}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-[var(--color-ink)] mt-1">{f.message}</h4>
                          </div>

                          <div className="text-right text-[10px] font-[var(--font-mono)] text-[var(--color-muted)] block shrink-0">
                            Confidence: {Math.round(f.confidence * 100)}%
                          </div>
                        </div>

                        <div className="p-3 bg-[var(--color-canvas)] rounded-xl border border-[var(--color-hairline)] text-[11px] leading-relaxed space-y-1.5">
                          <p className="text-[var(--color-muted)]"><strong className="text-[var(--color-ink)] block text-[10px] font-[var(--font-mono)] uppercase tracking-wider mb-0.5">Explanation:</strong> {f.explanation}</p>
                          {f.location.snippet && (
                            <div className="pt-1 border-t border-[var(--color-hairline)] flex flex-col gap-0.5">
                              <span className="text-[10px] font-[var(--font-mono)] text-[var(--color-muted)] uppercase tracking-wider">Violating Code Snippet:</span>
                              <span className="text-[var(--color-ink)] font-[var(--font-mono)] text-[10px] p-1.5 bg-[var(--color-canvas-2)] rounded-lg block overflow-x-auto select-all">{f.location.snippet}</span>
                            </div>
                          )}
                          <p className="text-[var(--color-sage)] pt-1 block"><strong className="text-[var(--color-sage-glow)] block text-[10px] font-[var(--font-mono)] uppercase tracking-wider mb-0.5">Actionable Remediation:</strong> {f.remediation}</p>
                        </div>

                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 2: Remediation Checklist */}
              {activeAnalysisTab === "remediation" && (
                <div className="space-y-4" id="remediation-viewport">
                  <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-hairline)] rounded-xl space-y-1.5">
                    <h4 className="text-xs font-bold text-[var(--color-ink)] flex items-center gap-1.5">
                      <Settings className="w-3.5 h-3.5 text-[var(--color-sage)]" />
                      <span>Machine-Generated Repair Guidance</span>
                    </h4>
                    <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                      Follow these high-friction Clinical Remediation steps sequentially to harden security schemas and achieve absolute sandbox compliance status.
                    </p>
                  </div>

                  {(!scanResult || scanResult.findings.length === 0) ? (
                    <div className="py-6 text-center text-[var(--color-muted)] text-xs">
                      No active remediations. Repo represents robust safe boundaries.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {scanResult.findings.map((f, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-[var(--color-surface)] rounded-xl border border-[var(--color-hairline)]" id={`remediaton-check-${i}`}>
                          <div className="p-1.5 rounded-lg bg-[var(--color-sage-soft)] border border-[var(--color-sage-dim)] text-[var(--color-sage)] font-[var(--font-mono)] text-[10px] shrink-0 translate-y-0.5 font-bold">
                            Step {i + 1}
                          </div>
                          <div className="space-y-1">
                            <h5 className="text-xs font-bold text-[var(--color-ink)]">{f.remediation}</h5>
                            <p className="text-[11px] text-[var(--color-muted)]">
                              Resolves rule <strong>{f.ruleId}</strong> anomaly tagged inside file <code className="text-[var(--color-sage)] font-[var(--font-mono)]">{f.location.file}</code> (Line {f.location.startLine}).
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Compliant SARIF Document View */}
              {activeAnalysisTab === "sarif" && (
                <div className="space-y-4" id="sarif-viewport">
                  <div className="flex justify-between items-center bg-[var(--color-surface)] p-4 border border-[var(--color-hairline)] rounded-xl">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-[var(--color-ink)]">SARIF 2.1.0 Standard Compliance File</h4>
                      <p className="text-[10px] text-[var(--color-muted)] font-[var(--font-mono)]">Compatible with GitHub Advanced Security & Snyk checks</p>
                    </div>
                    <button
                      id="export-sarif-json-btn"
                      onClick={exportSarifReport}
                      className="btn-pill text-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download JSON</span>
                    </button>
                  </div>

                  <div className="p-4 bg-[var(--color-canvas-2)] border border-[var(--color-hairline)] rounded-xl max-h-[350px] overflow-auto select-all">
                    <pre className="text-[10px] font-[var(--font-mono)] text-[var(--color-sage)] leading-relaxed">
                      {scanResult ? JSON.stringify(getSarifSchema(scanResult), null, 2) : "{}"}
                    </pre>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
