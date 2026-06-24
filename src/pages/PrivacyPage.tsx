import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] font-[var(--font-sans)]">
      <div className="ambient-mesh" aria-hidden="true" />
      <nav className="relative z-10 max-w-[800px] mx-auto px-6 py-6">
        <Link to="/" className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors">
          ← Back home
        </Link>
      </nav>
      <main className="relative z-10 max-w-[800px] mx-auto px-6 pb-20">
        <h1 className="text-4xl font-bold tracking-tight mb-6">Privacy Policy</h1>
        <p className="text-sm text-[var(--color-muted)] mb-8">Last updated: June 23, 2026</p>

        <section className="space-y-6 text-[var(--color-muted)] leading-relaxed">
          <div>
            <h2 className="font-semibold text-[var(--color-ink)] mb-2">What we collect</h2>
            <p>We only collect information you voluntarily provide (e.g. your email address for the cheatsheet). Payments are handled by Stripe; we do not store your card details.</p>
          </div>

          <div>
            <h2 className="font-semibold text-[var(--color-ink)] mb-2">How we use it</h2>
            <p>Email addresses are used to send the requested cheatsheet and occasional product updates. You can unsubscribe at any time. We do not sell or rent your data.</p>
          </div>

          <div>
            <h2 className="font-semibold text-[var(--color-ink)] mb-2">Cookies & storage</h2>
            <p>We use only essential browser storage to keep your workspace session and cookie preference working. We do not use advertising or third-party analytics cookies.</p>
          </div>

          <div>
            <h2 className="font-semibold text-[var(--color-ink)] mb-2">Third parties</h2>
            <p>Stripe processes payments. Cloudflare hosts the site. OpenAI and OpenRouter process AI generations depending on your selected tier. Each is governed by their own privacy policies.</p>
          </div>

          <div>
            <h2 className="font-semibold text-[var(--color-ink)] mb-2">Contact</h2>
            <p>For privacy questions, email hello@sloppyxbaby.com.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
