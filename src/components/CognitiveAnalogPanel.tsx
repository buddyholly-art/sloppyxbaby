import type { DemoCognitiveAnalog } from '../lib/demoPromptScenarios';

type CognitiveAnalogPanelProps = {
  cognitive: DemoCognitiveAnalog;
  variant?: 'dark' | 'light';
};

export default function CognitiveAnalogPanel({ cognitive, variant = 'dark' }: CognitiveAnalogPanelProps) {
  const isDark = variant === 'dark';

  return (
    <div className={isDark ? 'cognitive-insight' : 'cognitive-insight cognitive-insight-light'}>
      <span className="cognitive-insight-label">{cognitive.label}</span>
      <div className="cognitive-parallel-grid mt-3">
        <div className={isDark ? 'cognitive-parallel-card' : 'cognitive-parallel-card cognitive-parallel-card-light'}>
          <p className="cognitive-parallel-heading">You (AuDHD)</p>
          <p className={isDark ? 'cognitive-parallel-body' : 'cognitive-parallel-body cognitive-parallel-body-light'}>
            {cognitive.humanParallel}
          </p>
        </div>
        <div className={isDark ? 'cognitive-parallel-card' : 'cognitive-parallel-card cognitive-parallel-card-light'}>
          <p className="cognitive-parallel-heading">The model (LLM)</p>
          <p className={isDark ? 'cognitive-parallel-body' : 'cognitive-parallel-body cognitive-parallel-body-light'}>
            {cognitive.llmParallel}
          </p>
        </div>
      </div>
      <p className={isDark ? 'cognitive-insight-bridge mt-3' : 'cognitive-insight-bridge cognitive-insight-bridge-light mt-3'}>
        {cognitive.insight}
      </p>
      <p className={isDark ? 'cognitive-insight-mitigation mt-2' : 'cognitive-insight-mitigation cognitive-insight-mitigation-light mt-2'}>
        <span className="text-[var(--color-sage)] font-semibold">Scaffold: </span>
        {cognitive.mitigation}
      </p>
      <p className="cognitive-insight-cite mt-2">{cognitive.cite}</p>
    </div>
  );
}