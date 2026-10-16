import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { programs, degreeLevelLabels, degreeLevels } from '@/data/programs';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { admissionEnquirySchema, qualificationOptions, type AdmissionEnquiryInput } from '@/utils/schemas';
import { Button } from '@/components/ui/Button';
import { CheckboxField, Honeypot, SelectField, TextAreaField, TextField } from './Field';
import { FormError, FormFootnote, FormSuccess } from './FormFeedback';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

const programOptions = degreeLevels
  .map((level) => ({
    group: degreeLevelLabels[level],
    options: programs.filter((p) => p.level === level).map((p) => ({ value: p.slug, label: p.name })),
  }))
  .filter((g) => g.options.length > 0);

interface AdmissionEnquiryFormProps {
  /** Pre-select a program (e.g. from a program page) */
  defaultProgram?: string;
  /** Compact two-column layout for sidebars */
  compact?: boolean;
  className?: string;
}

/**
 * Admission enquiry (NOT an official application). Validated with Zod; submitted via services/api.
 * BACKEND: POST /admission-enquiries → CRM / admissions inbox.
 */
export function AdmissionEnquiryForm({ defaultProgram = '', compact, className }: AdmissionEnquiryFormProps) {
  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<AdmissionEnquiryInput>({
    resolver: zodResolver(admissionEnquirySchema),
    defaultValues: { fullName: '', email: '', phone: '', program: defaultProgram, qualification: undefined, message: '', consent: false },
    mode: 'onTouched',
  });
  const { onSubmit, honeypotRef, status, result, error, reset, submitting } = useFormSubmit('admission-enquiries', { successTitle: 'Enquiry received' });

  if (status === 'success' && result) {
    return (
      <FormSuccess
        result={result}
        title="Enquiry received"
        nextSteps="An admissions counsellor will contact you within two working days."
        onReset={() => {
          resetForm();
          reset();
        }}
        resetLabel="Send another enquiry"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={cn('relative space-y-5', className)} aria-label="Admission enquiry form">
      <div className={cn('grid gap-5', !compact && 'sm:grid-cols-2')}>
        <TextField label="Full name" required autoComplete="name" error={errors.fullName} {...register('fullName')} />
        <TextField label="Email address" type="email" required autoComplete="email" error={errors.email} {...register('email')} />
        <TextField label="Mobile number" type="tel" required autoComplete="tel" inputMode="tel" hint="10-digit Indian mobile number" error={errors.phone} {...register('phone')} />
        <SelectField
          label="Highest qualification"
          required
          error={errors.qualification}
          options={qualificationOptions.map((q) => ({ value: q, label: q }))}
          {...register('qualification')}
        />
        <SelectField label="Preferred course" required error={errors.program} options={programOptions} containerClassName={cn(!compact && 'sm:col-span-2')} {...register('program')} />
      </div>
      <TextAreaField label="Your question or message" rows={compact ? 3 : 4} placeholder="Tell us what you would like to know — eligibility, fees, hostel, scholarships…" error={errors.message} {...register('message')} />
      <CheckboxField
        label="I agree to be contacted about my enquiry by phone, email or WhatsApp."
        description={
          <>
            See our{' '}
            <Link to="/privacy" className="link">
              privacy policy
            </Link>
            .
          </>
        }
        error={errors.consent}
        {...register('consent')}
      />
      <Honeypot ref={honeypotRef} name="website" />
      {error && <FormError message={error} />}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FormFootnote>This is an enquiry, not an application.</FormFootnote>
        <Button type="submit" variant="primary" size="lg" loading={submitting} loadingText="Sending…" iconRight={<Send className="h-4 w-4" aria-hidden />} className="shrink-0">
          Send enquiry
        </Button>
      </div>
    </form>
  );
}
