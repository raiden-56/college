import { useCallback, useRef, useState } from 'react';
import { submitForm, SubmissionError, type FormEndpoint, type SubmitResult } from '@/services/api';
import { useToast } from '@/components/ui/toast-context';

/**
 * Wraps a form's submit handler with spam guards, loading/success/error state and toasts.
 *
 *   const { onSubmit, honeypotRef, status, result, error, reset } = useFormSubmit('admission-enquiries');
 *   <form onSubmit={handleSubmit(onSubmit)}> … <Honeypot ref={honeypotRef} /> …
 */
export function useFormSubmit<T extends object>(endpoint: FormEndpoint, options: { successTitle?: string } = {}) {
  const startedAt = useRef(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const { successTitle = 'Thank you!' } = options;

  const onSubmit = useCallback(
    async (values: T) => {
      setStatus('submitting');
      setError(null);
      try {
        const res = await submitForm(endpoint, values, { honeypot: honeypotRef.current?.value, startedAt: startedAt.current });
        setResult(res);
        setStatus('success');
        toast({
          tone: 'success',
          title: successTitle,
          description: res.mode === 'mock' ? 'Demo mode: your details were validated but not sent to the college.' : `Reference: ${res.reference}`,
        });
      } catch (e) {
        const message = e instanceof SubmissionError ? e.message : 'Something went wrong. Please try again.';
        setError(message);
        setStatus('error');
        toast({ tone: 'error', title: 'Submission failed', description: message });
      }
    },
    [endpoint, toast, successTitle],
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setError(null);
    startedAt.current = Date.now();
  }, []);

  return { onSubmit, honeypotRef, status, result, error, reset, submitting: status === 'submitting' };
}
