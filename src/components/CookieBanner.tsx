import { useEffect, useState } from 'react';

const CONSENT_KEY = 'sxb_cookie_consent';

type Consent = 'accepted' | 'declined' | null;

export default function CookieBanner() {
  const [consent, setConsent] = useState<Consent>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONSENT_KEY) as Consent;
      if (saved) {
        setConsent(saved);
      } else {
        setVisible(true);
      }
    } catch {
      // storage unavailable
      setVisible(false);
    }
  }, []);

  const save = (value: Consent) => {
    try {
      localStorage.setItem(CONSENT_KEY, value as string);
    } catch {
      // ignore
    }
    setConsent(value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-hairline)] bg-white/90 backdrop-blur-md"
    >
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
        <p className="text-sm text-[var(--color-muted)]">
          We use only essential cookies/localStorage to keep the workspace running. No ad trackers.{' '}
          <a href="/privacy" className="underline hover:text-[var(--color-ink)]">Privacy</a>{' '}
          · <a href="/cookies" className="underline hover:text-[var(--color-ink)]">Cookies</a>
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => save('accepted')}
            className="px-4 py-2 rounded-full bg-[var(--color-sage)] text-white text-sm font-semibold hover:bg-[var(--color-sage-glow)] transition-colors"
          >
            Got it
          </button>
          <button
            onClick={() => save('declined')}
            className="px-4 py-2 rounded-full bg-white/60 border border-[var(--color-hairline)] text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
