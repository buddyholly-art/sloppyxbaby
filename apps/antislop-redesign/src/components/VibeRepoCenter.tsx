import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FolderTree, Play, Sparkles, BookOpen, Layers } from "lucide-react";
import VibeRepoArchitect from "./VibeRepoArchitect";
import VibeOnboardingScaffold from "./VibeOnboardingScaffold";
import { VibeDecoderPanel } from "./ExplainTerm";

type SubModule = "onboarding" | "architect";

export default function VibeRepoCenter() {
  const [subTab, setSubTab] = useState<SubModule>("onboarding");

  return (
    <div className="space-y-6" id="vibe-repo-center">
      {/* Header Overview */}
      <div className="card-shell p-5 md:p-6 relative overflow-hidden" id="repo-center-header">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <FolderTree className="w-40 h-40 text-[var(--color-sage)]" />
        </div>

        <div className="max-w-3xl space-y-3">
          <div className="eyebrow">
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-sage)]" />
            <span>Local Directory Scaffold</span>
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-ink)] tracking-tight">
            Repository File Setup Hub
          </h2>
          <p className="text-sm text-[var(--color-muted)] leading-relaxed">
            <strong>What is this?</strong> This repository planner helps organize your project file structure. Use Step 1 to view getting-started guides for folder layouts, or Step 2 to generate standard directory structures.
          </p>
        </div>

        {/* Master Selector */}
        <div className="flex bg-[var(--color-canvas-2)] p-1.5 rounded-[var(--radius-core)] border border-[var(--color-hairline)] max-w-lg mt-6 gap-2 text-xs font-medium">
          <button
            onClick={() => setSubTab("onboarding")}
            className={`flex-1 py-2.5 rounded-lg text-center transition-all duration-500 cursor-pointer flex items-center justify-center space-x-2 ${
              subTab === "onboarding"
                ? "bg-[var(--color-sage-soft)] text-[var(--color-ink)] border border-[var(--color-sage)]/30 font-semibold"
                : "text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)]"
            }`}
          >
            <Play className="w-3.5 h-3.5 text-[var(--color-sage)]" />
            <div className="text-left">
              <span className="block font-semibold leading-tight text-xs">Step 1: Local Launch Scaffold</span>
              <span className="block text-[11px] text-[var(--color-muted)] font-[var(--font-sans)] leading-none mt-0.5">Zero-to-One Onboarding Walks</span>
            </div>
          </button>

          <button
            onClick={() => setSubTab("architect")}
            className={`flex-1 py-2.5 rounded-lg text-center transition-all duration-500 cursor-pointer flex items-center justify-center space-x-2 ${
              subTab === "architect"
                ? "bg-[var(--color-sage-soft)] text-[var(--color-ink)] border border-[var(--color-sage)]/30 font-semibold"
                : "text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)]"
            }`}
          >
            <FolderTree className="w-3.5 h-3.5 text-[var(--color-sage)]" />
            <div className="text-left">
              <span className="block font-semibold leading-tight text-xs">Step 2: Directory Architect</span>
              <span className="block text-[11px] text-[var(--color-muted)] font-[var(--font-sans)] leading-none mt-0.5">Audits & Folder Structures</span>
            </div>
          </button>
        </div>
      </div>

      {/* Dynamic Pillar Views Render */}
      <AnimatePresence mode="wait">
        <motion.div
          key={subTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
        >
          {subTab === "onboarding" ? (
            <VibeOnboardingScaffold />
          ) : (
            <VibeRepoArchitect />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
