type CoachHypeLessonProps = {
  hook: string;
  tangent?: string;
  pivot: string;
  stat?: string;
  cite: string;
  compact?: boolean;
};

export default function CoachHypeLesson({ hook, tangent, pivot, stat, cite, compact }: CoachHypeLessonProps) {
  return (
    <aside
      className={`rounded-2xl border border-hairline bg-canvas-warm/80 ${
        compact ? 'mt-4 p-4' : 'mt-5 p-5 md:p-6'
      }`}
      aria-label="Coach Hype lesson"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-soft text-ink font-extrabold text-xs">
          CH
        </span>
        <div>
          <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-gold">Coach Hype</p>
          <p className="text-[11px] text-muted">Setup → tangent → cited pivot</p>
        </div>
      </div>
      <p className="text-sm text-muted leading-relaxed">{hook}</p>
      {tangent && <p className="text-sm text-muted leading-relaxed mt-2 italic">{tangent}</p>}
      <p className={`text-ink font-medium leading-relaxed ${compact ? 'text-sm mt-3' : 'text-[15px] mt-4'}`}>{pivot}</p>
      <div className="mt-3 pt-3 border-t border-hairline">
        {stat && (
          <p className="font-[var(--font-mono)] text-[11px] text-sage leading-relaxed mb-1">{stat}</p>
        )}
        <p className="text-xs text-muted">{cite}</p>
      </div>
    </aside>
  );
}