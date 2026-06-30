import { Link } from 'react-router-dom';
import CoachHypeLesson from './CoachHypeLesson';
import { COACH_HYPE_MISSION, COACH_HYPE_PAIN_POINTS, COACH_HYPE_TAGLINE } from '../lib/coachHype';

export default function CoachHypeMission() {
  return (
    <section id="mission" className="py-10 md:py-14">
      <div className="w-full max-w-[1160px] mx-auto px-6 relative z-[2]">
        <div className="reveal card-shell">
          <div className="card-core p-8 md:p-12">
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              Coach Hype teaches the cognitive analog
            </span>
            <h2 className="text-section mt-4">{COACH_HYPE_MISSION.headline}</h2>
            <p className="text-lede mt-3 max-w-[820px] font-semibold text-ink">{COACH_HYPE_MISSION.subline}</p>
            <p className="text-lede mt-3 max-w-[820px]">{COACH_HYPE_MISSION.body}</p>
            <p className="text-sm text-muted mt-2 font-[var(--font-mono)]">{COACH_HYPE_TAGLINE}</p>

            <CoachHypeLesson
              compact
              hook="You are not bad at coding. You are running two associative engines without scaffolding."
              pivot="LLM failure modes map onto AuDHD cognitive science with uncomfortable precision — same overflow, same drift, same confabulation."
              stat={COACH_HYPE_MISSION.stat}
              cite={COACH_HYPE_MISSION.cite}
            />

            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {COACH_HYPE_PAIN_POINTS.map((point) => (
                <div
                  key={point.label}
                  className="p-5 rounded-[var(--radius-core)] bg-white/55 border border-hairline"
                >
                  <h3 className="text-base font-bold">{point.label}</h3>
                  <p className="text-sm text-muted mt-2 leading-relaxed">{point.symptom}</p>
                  <p className="font-[var(--font-mono)] text-[11px] text-sage mt-3">{point.stat}</p>
                  <p className="text-[11px] text-muted mt-1">{point.cite}</p>
                </div>
              ))}
            </div>

            <blockquote className="mt-8 pl-5 border-l-2 border-gold text-[17px] leading-relaxed text-ink max-w-[780px]">
              &ldquo;The traits pathologized as clinical deficits — hyper-systemizing, explicit communication, monotropic focus —
              are the exact frameworks required to control modern LLMs.&rdquo;
            </blockquote>
            <p className="text-sm text-muted mt-2">AuDHD ↔ LLM Cognitive Analogs · architectural isomorphism thesis</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/the-code"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[var(--radius-pill)] text-sm font-bold text-white bg-sage hover:bg-sage-glow transition-colors no-underline active:scale-[0.98]"
              >
                Take the 12-concept audit
              </Link>
              <a
                href="#evidence"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[var(--radius-pill)] text-sm font-bold text-ink bg-surface hover:bg-surface-solid shadow-[inset_0_0_0_1px_var(--color-hairline-strong)] transition-colors no-underline active:scale-[0.98]"
              >
                Read the sources
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}