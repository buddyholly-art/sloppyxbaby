import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Quote, Play, Pause, ChevronLeft, ChevronRight, Copy, Check, RefreshCw, Sparkles } from "lucide-react";

interface QuoteType {
  id: string;
  text: string;
  author: string;
  context: string;
}

export default function SovereignInsight() {
  const [quotes, setQuotes] = useState<QuoteType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/quotes")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        if (data.quotes && data.quotes.length > 0) {
          setQuotes(data.quotes);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching quotes:", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!isPlaying || quotes.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 9000);

    return () => clearInterval(timer);
  }, [isPlaying, quotes]);

  const handleNext = () => {
    if (quotes.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
  };

  const handlePrev = () => {
    if (quotes.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  const handleCopy = () => {
    const activeQuotes = quotes.length > 0 ? quotes : backupQuotes;
    if (activeQuotes.length === 0) return;
    const current = activeQuotes[currentIndex];
    const textToCopy = `"${current.text}" — ${current.author} (${current.context})`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const backupQuotes = [
    {
      id: "backup-1",
      text: "English is the hottest new programming language.",
      author: "Andrej Karpathy",
      context: "Software 2.0 & LLM-OS"
    },
    {
      id: "backup-2",
      text: "Building the data engine is 99% of the cognitive struggle. The architecture is just a tiny, highly-leveraged inner loop.",
      author: "Andrej Karpathy",
      context: "Tesla Autopilot Case Study"
    },
    {
      id: "backup-3",
      text: "The bitter lesson is that general methods that leverage computation are the most effective, by a large margin.",
      author: "Rich Sutton",
      context: "The Bitter Lesson (2019)"
    }
  ];

  if (loading) {
    return (
      <div className="card-shell p-5 flex items-center justify-center gap-3 min-h-[90px]" id="insight-loader">
        <RefreshCw className="w-4 h-4 text-[var(--color-sage)] animate-spin" />
        <span className="text-xs font-[var(--font-mono)] text-[var(--color-muted)]">
          Retrieving learning dispatch resources...
        </span>
      </div>
    );
  }

  const activeQuotes = quotes.length > 0 ? quotes : backupQuotes;
  const currentQuote = activeQuotes[currentIndex] || activeQuotes[0];

  return (
    <div
      className="card-shell p-5 md:p-6 relative overflow-hidden group"
      id="sovereign-insight-pinnacle"
    >
      {/* Subtle warm accent glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--color-sage)]/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">

        {/* Left: Label and Quote */}
        <div className="space-y-3 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              <span>Expert Learning Dispatch</span>
            </div>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-[var(--color-canvas-2)] border border-[var(--color-hairline)] text-[10px] font-[var(--font-mono)] text-[var(--color-muted)]">
              {currentQuote.context}
            </span>
          </div>

          {/* Animated Quote */}
          <div className="min-h-[56px] flex items-start gap-3">
            <Quote className="w-5 h-5 text-[var(--color-sage)]/40 mt-0.5 shrink-0" />
            <div className="overflow-hidden w-full relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuote.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                  className="space-y-2"
                >
                  <p className="text-sm font-[var(--font-sans)] font-medium text-[var(--color-ink)] leading-relaxed italic text-left">
                    &ldquo;{currentQuote.text}&rdquo;
                  </p>
                  <p className="text-xs font-[var(--font-mono)] text-[var(--color-sage)] font-semibold text-left">
                    — {currentQuote.author}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right: Navigation & Controls */}
        <div className="flex items-center justify-between md:justify-end gap-4 border-t border-[var(--color-hairline)] md:border-none pt-3 md:pt-0 shrink-0">

          {/* Counter */}
          <span className="text-xs font-[var(--font-mono)] text-[var(--color-muted)] tabular-nums">
            {currentIndex + 1} / {activeQuotes.length}
          </span>

          {/* Control Group */}
          <div className="flex items-center gap-1 bg-[var(--color-canvas-2)] p-1 rounded-xl border border-[var(--color-hairline)]">
            <button
              onClick={handlePrev}
              type="button"
              className="btn-ghost p-1.5 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              title="Previous Quote"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              type="button"
              className={`p-1.5 rounded-lg border transition-all duration-300 cursor-pointer ${
                isPlaying
                  ? "bg-[var(--color-sage)]/10 border-[var(--color-sage)]/20 text-[var(--color-sage)]"
                  : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              }`}
              title={isPlaying ? "Pause Auto-rotation" : "Resume Auto-rotation"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={handleNext}
              type="button"
              className="btn-ghost p-1.5 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              title="Next Quote"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="w-px h-4 bg-[var(--color-hairline)] mx-1" />

            <button
              onClick={handleCopy}
              type="button"
              className={`p-1.5 rounded-lg border transition-all duration-300 cursor-pointer ${
                copied
                  ? "bg-[var(--color-sage)]/10 border-[var(--color-sage)]/20 text-[var(--color-sage)]"
                  : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              }`}
              title="Copy quote to clipboard"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
