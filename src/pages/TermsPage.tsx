import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] font-[var(--font-sans)]">
      <div className="ambient-mesh" aria-hidden="true" />
      <nav className="relative z-10 max-w-[800px] mx-auto px-6 py-6">
        <Link to="/" className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors">
          ← Back home
        </Link>
      </nav>
      <main className="relative z-10 max-w-[800px] mx-auto px-6 pb-20">
        <h1 className="text-4xl font-bold tracking-tight mb-6">Terms of Service</h1>
        <p className="text-sm text-[var(--color-muted)] mb-8">Last updated: June 23, 2026</p>

        <section className="space-y-6 text-[var(--color-muted)] leading-relaxed">
          <div>
            <h2 className="font-semibold text-[var(--color-ink)] mb-2">Use of the service</h2>
            <p>SloppyXBaby provides prompt-engineering tools and AI generation interfaces. You agree to use the service lawfully and not to misuse, attack, or overload it.</p>
          </div>

          <div>
            <h2 className="font-semibold text-[var(--color-ink)] mb-2">Accounts & payments</h2>
            <p>Credit packs are non-refundable unless required by law. BYOK users are responsible for their own OpenAI account and billing. Free-tier usage is rate-limited.</p>
          </div>

          <div>
            <h2 className="font-semibold text-[var(--color-ink)] mb-2">Content & IP</h2>
            <p>You retain ownership of prompts and outputs you generate. We do not claim rights to your content. Do not use the service to generate illegal, harmful, or infringing material.</p>
          </div>

          <div>
            <h2 className="font-semibold text-[var(--color-ink)] mb-2">Disclaimer</h2>
            <p>SloppyXBaby is a tool, not professional advice. AI outputs may be incorrect. Review everything before relying on it. We provide the service “as is” without warranties.</p>
          </div>

          <div>
            <h2 className="font-semibold text-[var(--color-ink)] mb-2">Changes</h2>
            <p>We may update these terms from time to time. Continued use after changes means you accept the new terms.</p>
          </div>

          <div>
            <h2 className="font-semibold text-[var(--color-ink)] mb-2">Contact</h2>
            <p>For questions, email hello@sloppyxbaby.com.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
