import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

export default function ThanksPage() {
  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] font-[var(--font-sans)] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-[var(--color-sage)] text-white inline-flex items-center justify-center">
          <Check className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">Thanks for your order</h1>
        <p className="text-[var(--color-muted)] mb-8">Your credits will be available in the workspace shortly. Head there to start generating premium prompts.</p>
        <Link to="/app" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-sage)] text-white text-sm font-semibold hover:bg-[var(--color-sage-glow)] transition-colors">
          Open workspace
        </Link>
      </div>
    </div>
  );
}
