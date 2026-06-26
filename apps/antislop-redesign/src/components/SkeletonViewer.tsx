import { useState } from "react";
import { Folder, FolderOpen, FileCode, FileText, File, Terminal, Copy, Check } from "lucide-react";

interface SkeletonViewerProps {
  rawSkeleton: string;
}

interface parsedItem {
  id: string;
  name: string;
  type: "folder" | "file";
  depth: number;
  rawLine: string;
}

export default function SkeletonViewer({ rawSkeleton }: SkeletonViewerProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"visual" | "raw">("visual");

  const handleCopy = () => {
    navigator.clipboard.writeText(rawSkeleton);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Naive but robust parser for ASCII file trees containing tree-drawing characters
  const parseTree = (text: string): parsedItem[] => {
    const lines = text.split("\n");
    const items: parsedItem[] = [];

    lines.forEach((line, index) => {
      // Clean up whitespace & skip empty lines
      if (!line.trim()) return;

      // Detect depth based on character columns
      const treeChars = /[|├──└──|+-]/g;
      let depth = 0;
      const match = line.match(treeChars);
      if (match) {
        depth = line.indexOf(match[0]);
      } else {
        const spaces = line.match(/^\s*/);
        depth = spaces ? Math.floor(spaces[0].length / 2) : 0;
      }

      // Extract raw name which comes after symbols and spaces
      let cleanName = line
        .replace(/[|├──└──\s\-+|]/g, " ")
        .trim();

      if (!cleanName) return;

      // Determine if folder or file
      let type: "folder" | "file" = "file";
      if (cleanName.endsWith("/") || !cleanName.includes(".")) {
        type = "folder";
      }

      // Strip trailing slash if any
      cleanName = cleanName.replace(/\/$/, "");

      items.push({
        id: `node-${index}`,
        name: cleanName,
        type,
        depth: Math.floor(depth / 2),
        rawLine: line,
      });
    });

    return items;
  };

  const parsedItems = parseTree(rawSkeleton);
  const isProbablyTree = parsedItems.some(i => i.rawLine.includes("├──") || i.rawLine.includes("└──") || i.rawLine.includes("│"));

  const getFileIcon = (name: string, type: "folder" | "file") => {
    if (type === "folder") {
      return <FolderOpen className="w-4 h-4 text-amber-500/80" />;
    }
    const ext = name.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "json":
        return <FileCode className="w-4 h-4 text-[var(--color-sage)]" />;
      case "ts":
      case "tsx":
      case "js":
      case "jsx":
        return <FileCode className="w-4 h-4 text-sky-600" />;
      case "py":
        return <FileCode className="w-4 h-4 text-indigo-500" />;
      case "sh":
      case "bash":
        return <Terminal className="w-4 h-4 text-teal-600" />;
      case "md":
        return <FileText className="w-4 h-4 text-rose-400" />;
      default:
        return <File className="w-4 h-4 text-[var(--color-muted)]" />;
    }
  };

  return (
    <div className="card-shell overflow-hidden font-[var(--font-mono)] text-sm leading-relaxed" id="skeleton-container">
      {/* Header Bar */}
      <div className="flex justify-between items-center px-5 py-3 bg-[var(--color-canvas)] border-b border-[var(--color-hairline)]" id="skeleton-header">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-sage)]" />
          <span className="text-xs text-[var(--color-muted)] font-[var(--font-sans)] font-medium pl-2">System Blueprint Workspace</span>
        </div>
        <div className="flex items-center gap-2">
          {isProbablyTree && (
            <div className="flex p-0.5 rounded-lg bg-[var(--color-canvas-2)] border border-[var(--color-hairline)] font-[var(--font-sans)] text-xs">
              <button
                id="tab-visual"
                onClick={() => setActiveTab("visual")}
                className={`px-3 py-1 rounded-md transition-all duration-300 ${
                  activeTab === "visual" ? "bg-[var(--color-sage)] text-white" : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                }`}
              >
                Visual
              </button>
              <button
                id="tab-raw"
                onClick={() => setActiveTab("raw")}
                className={`px-3 py-1 rounded-md transition-all duration-300 ${
                  activeTab === "raw" ? "bg-[var(--color-sage)] text-white" : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                }`}
              >
                Raw Spec
              </button>
            </div>
          )}
          <button
            id="skeleton-copy-btn"
            onClick={handleCopy}
            className="btn-ghost flex items-center gap-1.5 text-xs py-1.5 px-3"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[var(--color-sage)]" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Spec</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Workspace Display */}
      <div className="p-5 overflow-x-auto max-h-[500px] bg-[var(--color-surface-solid)]" id="skeleton-workspace">
        {activeTab === "visual" && isProbablyTree ? (
          <div className="flex flex-col gap-0.5">
            {parsedItems.map((item) => (
              <div
                key={item.id}
                style={{ paddingLeft: `${Math.max(item.depth * 20, 4)}px` }}
                className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-[var(--color-canvas-2)]/50 group transition-all duration-200"
              >
                <span className="flex-shrink-0">{getFileIcon(item.name, item.type)}</span>
                <span className={`font-[var(--font-mono)] text-xs ${item.type === "folder" ? "text-amber-700/80 font-medium" : "text-[var(--color-ink)]"}`}>
                  {item.name}
                </span>
                {item.type === "folder" && (
                  <span className="text-xs bg-[var(--color-canvas-2)] border border-[var(--color-hairline)] text-[var(--color-muted)] rounded-md px-1.5 font-[var(--font-sans)] opacity-0 group-hover:opacity-100 transition-opacity">
                    directory
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <pre className="text-xs text-[var(--color-sage)] whitespace-pre font-[var(--font-mono)] p-1 leading-relaxed">
            {rawSkeleton}
          </pre>
        )}
      </div>
    </div>
  );
}
