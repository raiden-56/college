import { AnimatePresence, motion } from 'framer-motion';
import { Cookie } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { COOKIE_PREFS_EVENT, COOKIE_STORAGE_KEY, type CookieConsentState } from './cookieEvents';

/**
 * Cookie / privacy preference banner. The site sets no analytics or marketing cookies today;
 * INTEGRATION: only load analytics scripts when `analytics === true` in the stored consent.
 */
export function CookieConsent() {
  const [consent, setConsent] = useLocalStorage<CookieConsentState>(COOKIE_STORAGE_KEY, { decided: false, analytics: false, marketing: false });
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [draft, setDraft] = useState(consent);

  useEffect(() => {
    const open = () => {
      setDraft(consent);
      setPrefsOpen(true);
    };
    window.addEventListener(COOKIE_PREFS_EVENT, open);
    return () => window.removeEventListener(COOKIE_PREFS_EVENT, open);
  }, [consent]);

  const save = (next: Omit<CookieConsentState, 'decided' | 'updatedAt'>) => {
    setConsent({ ...next, decided: true, updatedAt: new Date().toISOString() });
    setPrefsOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {!consent.decided && !prefsOpen && (
          <motion.section
            aria-label="Cookie preferences"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-3xl rounded-2xl border border-navy-100 bg-white p-5 shadow-lift sm:inset-x-6 sm:bottom-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <span className="hidden h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-50 text-gold-700 sm:grid">
                <Cookie className="h-5 w-5" aria-hidden />
              </span>
              <p className="flex-1 text-sm text-ink-soft">
                We use essential cookies to run this site. With your permission we’d also use analytics cookies to improve it.{' '}
                <Link to="/privacy" className="link">
                  Privacy policy
                </Link>
              </p>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Button size="sm" variant="ghost" onClick={() => setPrefsOpen(true)}>
                  Preferences
                </Button>
                <Button size="sm" variant="secondary" onClick={() => save({ analytics: false, marketing: false })}>
                  Essential only
                </Button>
                <Button size="sm" onClick={() => save({ analytics: true, marketing: true })}>
                  Accept all
                </Button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <Modal open={prefsOpen} onClose={() => setPrefsOpen(false)} title="Cookie preferences" description="Choose which optional cookies we may use. You can change this anytime from the footer." size="sm">
        <ul className="space-y-4">
          <li className="flex items-start justify-between gap-4 rounded-xl bg-surface-alt p-4">
            <div>
              <p className="font-semibold text-navy-950">Essential</p>
              <p className="text-sm text-ink-muted">Required for security and remembering your preferences.</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700">Always on</span>
          </li>
          {(['analytics', 'marketing'] as const).map((key) => (
            <li key={key} className="flex items-start justify-between gap-4 rounded-xl border border-navy-100 p-4">
              <label htmlFor={`cookie-${key}`} className="cursor-pointer">
                <span className="block font-semibold capitalize text-navy-950">{key}</span>
                <span className="block text-sm text-ink-muted">{key === 'analytics' ? 'Helps us understand which pages are useful (anonymous).' : 'Used to measure admission campaigns.'}</span>
              </label>
              <input
                id={`cookie-${key}`}
                type="checkbox"
                role="switch"
                checked={draft[key]}
                onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.checked }))}
                className="mt-1 h-5 w-5 cursor-pointer accent-royal-700"
              />
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => save({ analytics: false, marketing: false })}>
            Reject optional
          </Button>
          <Button onClick={() => save({ analytics: draft.analytics, marketing: draft.marketing })}>Save preferences</Button>
        </div>
      </Modal>
    </>
  );
}
