import { Link } from 'react-router-dom';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] font-[var(--font-sans)]">
      <div className="ambient-mesh" aria-hidden="true" />
      <nav className="relative z-10 max-w-[800px] mx-auto px-6 py-6">
        <Link to="/" className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors">
          ← Back home
        </Link>
      </nav>
      <main className="relative z-10 max-w-[800px] mx-auto px-6 pb-20">
        <h1 className="text-4xl font-bold tracking-tight mb-6">Cookie Policy</h1>
        <p className="text-sm text-[var(--color-muted)] mb-8">Last updated: June 23, 2026</p>

        <section className="space-y-6 text-[var(--color-muted)] leading-relaxed">
          <div>
            <h2 className="font-semibold text-[var(--color-ink)] mb-2">What we use</h2>
            <p>SloppyXBaby uses only essential browser technologies:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>localStorage</strong> — to remember your cookie preference and workspace session state.</li>
              <li><strong>Cloudflare</strong> — essential hosting/security cookies required to serve and protect the site.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-[var(--color-ink)] mb-2">What we do NOT use</h2>
            <p>We do not use advertising cookies, social-media trackers, or third-party analytics scripts.</p>
          </div>

          <div>
            <h2 className="font-semibold text-[var(--color-ink)] mb-2">Managing cookies</h2>
            <p>You can clear localStorage and cookies through your browser settings. If you disable essential storage, some workspace features may not work correctly.</p>
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
