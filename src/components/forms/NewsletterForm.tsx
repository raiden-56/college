import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useId } from 'react';
import { useForm } from 'react-hook-form';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { newsletterSchema, type NewsletterInput } from '@/utils/schemas';
import { Honeypot } from './Field';

/** Footer newsletter sign-up. BACKEND: POST /newsletter → mailing list provider (double opt-in). */
export function NewsletterForm() {
  const id = useId();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewsletterInput>({ resolver: zodResolver(newsletterSchema), defaultValues: { email: '' } });
  const { onSubmit, honeypotRef, status, result, submitting } = useFormSubmit('newsletter', { successTitle: 'Subscribed' });

  if (status === 'success' && result) {
    return (
      <p role="status" className="flex items-start gap-2 rounded-xl bg-white/10 p-3 text-sm text-navy-100">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" aria-hidden />
        {result.mode === 'mock' ? 'Demo mode: email validated, but no subscription was created.' : 'Please check your inbox to confirm your subscription.'}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative" aria-label="Newsletter sign-up">
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <div className="flex rounded-full border border-white/20 bg-white/10 p-1 focus-within:border-gold-300">
        <input
          id={id}
          type="email"
          autoComplete="email"
          placeholder="Your email address"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? `${id}-err` : undefined}
          className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white placeholder:text-navy-200 focus:outline-none"
          {...register('email')}
        />
        <button type="submit" disabled={submitting} className="btn btn-sm btn-gold shrink-0" aria-label="Subscribe to newsletter">
          {submitting ? '…' : <ArrowRight className="h-4 w-4" aria-hidden />}
        </button>
      </div>
      <Honeypot ref={honeypotRef} name="website" />
      {errors.email && (
        <p id={`${id}-err`} role="alert" className="mt-2 flex items-center gap-1 text-xs text-red-200">
          <AlertCircle className="h-3.5 w-3.5" aria-hidden />
          {errors.email.message}
        </p>
      )}
    </form>
  );
}
