import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, BookOpen, Key, Sparkles, X, Compass, Terminal, Cpu } from "lucide-react";

interface TermDefinition {
  term: string;
  simpleDef: string;
  metaphor: string;
  adhdInsight: string;
  nextStep: string;
}

export const TERMS_DATABASE: Record<string, TermDefinition> = {
  "terminal shell": {
    term: "Target Terminal Shell",
    simpleDef: "Your computer's text-only control room. Instead of clicking buttons, you type commands directly.",
    metaphor: "Think of it like texting your computer's OS directly instead of calling it on a video chat with hand gestures.",
    adhdInsight: "💡 Avoidance Cure: You don't need to remember commands! You just copy-paste the exact lines we give you and watch the computer build itself. It's safe.",
    nextStep: "Open Terminal (Mac) or PowerShell (Windows) to start command inputs."
  },
  "claude.md": {
    term: "CLAUDE.md & Rules",
    simpleDef: "An LLM instruction handbook stored in your code folder. Prevents AI amnesia.",
    metaphor: "Like putting a sticky note on your fridge explaining exact chore rules so roommates don't invent new rules every day.",
    adhdInsight: "💡 Executive Backup: A coding model has 0 memory when you open a new chat. This file instantly reminds the model of your setup.",
    nextStep: "Feed the CLAUDE.md prompt contract directly to your AI assistant."
  },
  "single source of truth": {
    term: "Single Source of Truth (SSOT)",
    simpleDef: "Storing all shared data specifications in exactly ONE location (like types.ts).",
    metaphor: "Like keeping a single master kitchen calendar rather than writing dates on sticky scraps of napkins in three different rooms.",
    adhdInsight: "💡 Clear Focus: It prevents your AI assistant from declaring conflicting states, eliminating 'which file has the real rule?' confusion.",
    nextStep: "Always check src/types.ts before starting any visual UI design."
  },
  "linter": {
    term: "Linter (eslint / ls-lint)",
    simpleDef: "An automatic static code auditor that flags structural mistakes in real-time.",
    metaphor: "Like a grammar or spelling checker that alerts you immediately when directories are misnamed, before the app builds.",
    adhdInsight: "💡 Stress Preventer: It catches naming casing slipups (like kebab-case vs PascalCase) so you don't face sudden, opaque runtime crashes.",
    nextStep: "Run 'npm run lint' to check your project for consistency."
  },
  "typescript": {
    term: "TypeScript (tsc)",
    simpleDef: "A strict version of JavaScript that validates data shapes before the app runs.",
    metaphor: "Like a child's shape sorter puzzle. It stops you from feeding a square peg into a round hole before the code compiles.",
    adhdInsight: "💡 Guardrail: It ensures the AI assistant respects existing code configurations, saving thousands of minor typo debug loops.",
    nextStep: "Look for any red squiggly underlines inside your code editor to spot shape mismatches."
  },
  "features folder": {
    term: "Feature-Sliced Design",
    simpleDef: "Grouping code by human feature names (e.g. /billing, /users) instead of technical layers.",
    metaphor: "Like packing separate complete outfit bags (socks, shirt, trousers colocated) rather than a separate giant drawer of just socks.",
    adhdInsight: "💡 Clean Deletion: If a feature is obsolete, you can safely wipe out that single feature folder without breaking adjacent systems.",
    nextStep: "Place folder-specific custom types right next to their corresponding smart components."
  },
  "git tracking": {
    term: "Git Version Control",
    simpleDef: "A camera that snaps savepoints of your files, allowing you to roll back time.",
    metaphor: "Like establishing standard quick-save checkpoints in a risky video game before venturing into a challenging boss battle.",
    adhdInsight: "💡 Fearless Coding: Never worry about breaking things. You can always run 'git checkout .' to wipe away mistakes and restart.",
    nextStep: "Initiate 'git init' inside your project root to activate the safety camera."
  },
  "bulletproof": {
    term: "Bulletproof Architecture",
    simpleDef: "An industrial design layout for client apps prioritizing separation of concerns and types.",
    metaphor: "Like having clear firewalls built between engine parts so a spark in the transmission doesn't ignite the cabin.",
    adhdInsight: "💡 Low Cognitive Overhead: Keeps files tiny, modular, and extremely easy to understand on model reload.",
    nextStep: "See Vibe Repo Architect tab for precise mapping coordinates!"
  },
  "persistence": {
    term: "Data Persistence (LocalStorage)",
    simpleDef: "A browser-contained cabinet where files remain intact even on tab reloads.",
    metaphor: "Like a real physical workspace drawer where papers stay exactly where you left them, versus a white-board that is wiped clean each hour.",
    adhdInsight: "💡 Low Frustration: Perfect for offline apps. Refreshes won't lose your work history, maintaining high executive focus.",
    nextStep: "We store user configurations in standard browser LocalStorage profiles."
  }
};

interface ExplainTermProps {
  termKey: keyof typeof TERMS_DATABASE;
  children?: React.ReactNode;
}

export function ExplainTerm({ termKey, children }: ExplainTermProps) {
  const [open, setOpen] = useState(false);
  const data = TERMS_DATABASE[termKey];
  const triggerRef = useRef<HTMLButtonElement>(null);

  if (!data) return <span className="underline decoration-dotted font-medium">{children}</span>;

  return (
    <span className="inline-block relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center space-x-1 underline decoration-dotted decoration-indigo-400 hover:decoration-indigo-300 hover:text-indigo-300 font-bold font-sans transition-colors cursor-help text-left focus:outline-none"
      >
        <span>{children || data.term}</span>
        <HelpCircle className="w-3 h-3 text-indigo-400/80 animate-pulse shrink-0" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Click-away backdrop overlay */}
            <div 
              className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px] cursor-default" 
              onClick={() => setOpen(false)}
            />
            
            <motion.div
              className="absolute z-50 left-0 mt-2 w-72 sm:w-80 p-4 bg-slate-905 border border-slate-800 rounded-2xl shadow-xl space-y-3.5 text-left"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.12 }}
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                <span className="text-[10px] font-mono uppercase bg-indigo-505/10 text-indigo-350 px-2 py-0.5 rounded border border-indigo-950">
                  Concept Decoded
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-slate-500 hover:text-slate-300 p-1 rounded-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Body Content */}
              <div className="space-y-2 text-xs">
                <h4 className="text-slate-100 font-black tracking-tight">{data.term}</h4>
                <p className="text-slate-300 leading-relaxed font-sans font-medium">
                  {data.simpleDef}
                </p>
                
                {/* Metaphor analogy */}
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-850 space-y-1 text-indigo-305">
                  <div className="flex items-center space-x-1.5 text-[10px] uppercase font-mono tracking-wider font-extrabold text-indigo-400">
                    <Compass className="w-3 h-3 text-indigo-400" />
                    <span>Simple Metaphor</span>
                  </div>
                  <p className="text-[11px] font-sans leading-relaxed text-slate-350">
                    {data.metaphor}
                  </p>
                </div>

                {/* ADHD insight */}
                <p className="text-[11px] text-amber-305 font-sans leading-relaxed font-medium bg-amber-955/10 p-2.5 rounded-xl border border-amber-950/25">
                  {data.adhdInsight}
                </p>
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-slate-850 text-[10px] font-mono text-slate-500 flex justify-between items-center">
                <span>Action: {data.nextStep}</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </span>
  );
}

// Global Vibe Decoder Glossary panel with Search/Filter support
export function VibeDecoderPanel() {
  const [filterStr, setFilterStr] = useState("");
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

  const entriesArr = Object.entries(TERMS_DATABASE);
  const filteredEntries = entriesArr.filter(([key, value]) => {
    return (
      value.term.toLowerCase().includes(filterStr.toLowerCase()) ||
      value.simpleDef.toLowerCase().includes(filterStr.toLowerCase()) ||
      value.metaphor.toLowerCase().includes(filterStr.toLowerCase())
    );
  });

  return (
    <div className="bg-[#0b101d] border border-slate-855 rounded-2xl p-5 space-y-4" id="vibe-decoder-glossary">
      <div className="flex justify-between items-center border-b border-slate-850 pb-2.5">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-indigo-455 animate-pulse" />
          <h3 className="text-xs font-mono font-black uppercase text-slate-200">
            AuDHD Tech Decoder & glossary
          </h3>
        </div>
        <span className="text-[9px] font-mono text-slate-505 bg-slate-950 px-2 py-0.5 rounded border border-slate-850 font-bold uppercase tracking-widest">
          No-Jargon Mode Enabled
        </span>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
        Feeling overwhelmed by dense programming jargon? Hover or click terms across our panels, or search the translator matrix below for humorous, visual analogies.
      </p>

      {/* Filter search bar */}
      <div className="relative">
        <input
          type="text"
          value={filterStr}
          onChange={e => {
            setFilterStr(e.target.value);
            setSelectedTerm(null);
          }}
          placeholder="🔎 Query a technical phrase (e.g. linter, single source of truth, typescript)..."
          className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-850 hover:border-slate-750 text-slate-205 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500 select-text"
        />
        {filterStr && (
          <button
            onClick={() => {
              setFilterStr("");
              setSelectedTerm(null);
            }}
            className="absolute top-2.5 right-3 text-slate-500 hover:text-slate-300 text-xs font-mono"
          >
            Clear
          </button>
        )}
      </div>

      {/* Term chips list */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {filteredEntries.map(([key, value]) => (
          <button
            key={key}
            type="button"
            onClick={() => setSelectedTerm(key === selectedTerm ? null : key)}
            className={`py-1.5 px-3 rounded-lg border text-xs font-sans tracking-tight transition-all cursor-pointer ${
              selectedTerm === key
                ? "bg-indigo-600/20 border-indigo-500/45 text-indigo-300 font-extrabold"
                : "bg-slate-950/60 border-slate-850 text-slate-400 hover:text-slate-200"
            }`}
          >
            {value.term}
          </button>
        ))}
      </div>

      {/* Active Selection breakdown box */}
      <AnimatePresence mode="wait">
        {selectedTerm && TERMS_DATABASE[selectedTerm] ? (
          <motion.div
            key={selectedTerm}
            className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-3"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex justify-between items-start">
              <h4 className="text-xs font-bold text-indigo-300 font-mono">
                {TERMS_DATABASE[selectedTerm].term}
              </h4>
              <span className="text-[10px] font-mono text-slate-600">Analogical Model</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed select-text font-medium">
              {TERMS_DATABASE[selectedTerm].simpleDef}
            </p>

            {/* Metaphor block */}
            <div className="p-3 bg-slate-905 border border-slate-850/60 rounded-lg space-y-1">
              <span className="text-[9px] font-mono uppercase bg-slate-950 border border-slate-850 text-indigo-350 px-1.5 py-0.5 rounded font-extrabold tracking-widest inline-block">
                Visual Analogy
              </span>
              <p className="text-xs text-slate-400 leading-relaxed select-text italic">
                {TERMS_DATABASE[selectedTerm].metaphor}
              </p>
            </div>

            {/* ADHD check */}
            <p className="text-[11px] text-amber-305 leading-relaxed bg-amber-955/10 p-2.5 rounded-lg border border-amber-950/20 select-text font-medium">
              {TERMS_DATABASE[selectedTerm].adhdInsight}
            </p>
          </motion.div>
        ) : (
          <div className="py-2.5 text-center text-[10px] text-slate-500 font-mono italic">
            Select an engineering concept above to translate it into plain human English.
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
