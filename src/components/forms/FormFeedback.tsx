import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import type { ReactNode } from 'react';
import type { SubmitResult } from '@/services/api';
import { Button } from '@/components/ui/Button';

interface FormSuccessProps {
  result: SubmitResult;
  title: string;
  /** What happens next when a real backend received the submission */
  nextSteps?: ReactNode;
  onReset?: () => void;
  resetLabel?: string;
}

/**
 * Post-submit panel. It never claims an official submission unless the backend confirmed it
 * (`result.mode === 'server'`); in mock mode it states clearly that nothing was sent.
 */
export function FormSuccess({ result, title, nextSteps, onReset, resetLabel = 'Submit another response' }: FormSuccessProps) {
  const isMock = result.mode === 'mock';
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} role="status" aria-live="polite" className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 text-center sm:p-8">
      <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" aria-hidden />
      <h3 className="mt-4 text-xl font-bold">{isMock ? 'Details validated (demo mode)' : title}</h3>
      {isMock ? (
        <div className="mx-auto mt-3 flex max-w-md gap-2 rounded-xl bg-white/80 p-3 text-left text-sm text-ink-soft">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-royal-600" aria-hidden />
          <p>
            This website is not yet connected to the college’s systems, so <strong>your information was not sent</strong>. Please contact the office directly by phone or email. (Demo reference: {result.reference})
          </p>
        </div>
      ) : (
        <>
          <p className="mt-2 text-sm text-ink-soft">
            Your reference number is <strong className="font-mono">{result.reference}</strong>. Please keep it for future correspondence.
          </p>
          {nextSteps && <div className="mt-3 text-sm text-ink-soft">{nextSteps}</div>}
        </>
      )}
      {onReset && (
        <Button variant="secondary" size="sm" className="mt-6" onClick={onReset}>
          {resetLabel}
        </Button>
      )}
    </motion.div>
  );
}

export function FormError({ message }: { message: string }) {
  return (
    <div role="alert" className="flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <p>{message}</p>
    </div>
  );
}

/** Explains privacy + required fields above a form submit button. */
export function FormFootnote({ children }: { children?: ReactNode }) {
  return (
    <p className="text-xs text-ink-muted">
      Fields marked <span className="text-red-600">*</span> are required. {children ?? 'We use your details only to respond to this request, as described in our privacy policy.'}
    </p>
  );
}
