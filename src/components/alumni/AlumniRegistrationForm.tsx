import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { degreeLevelLabels, degreeLevels, programs } from '@/data/programs';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { alumniRegistrationSchema, type AlumniRegistrationInput } from '@/utils/schemas';
import { Button } from '@/components/ui/Button';
import { CheckboxField, Honeypot, SelectField, TextField } from '@/components/forms/Field';
import { FormError, FormFootnote, FormSuccess } from '@/components/forms/FormFeedback';

const programOptions = [
  ...degreeLevels
    .map((level) => ({
      group: degreeLevelLabels[level],
      options: programs.filter((p) => p.level === level).map((p) => ({ value: p.slug, label: p.name })),
    }))
    .filter((g) => g.options.length > 0),
  { value: 'other', label: 'Other / discontinued program' },
];

/**
 * Alumni network registration. BACKEND: POST /alumni-registrations → alumni office CRM.
 * Directory listing happens only when `directoryConsent` is true and the alumni office has verified the record.
 */
export function AlumniRegistrationForm() {
  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<AlumniRegistrationInput>({
    resolver: zodResolver(alumniRegistrationSchema),
    defaultValues: { fullName: '', email: '', phone: '', batch: '', program: '', organization: '', role: '', mentor: false, directoryConsent: false },
    mode: 'onTouched',
  });
  const { onSubmit, honeypotRef, status, result, error, reset, submitting } = useFormSubmit('alumni-registrations', { successTitle: 'Registration received' });

  if (status === 'success' && result) {
    return (
      <FormSuccess
        result={result}
        title="Registration received"
        nextSteps="The alumni office will verify your details against college records and email you within five working days."
        onReset={() => {
          resetForm();
          reset();
        }}
        resetLabel="Register another graduate"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative space-y-5" aria-label="Alumni registration form">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Full name" required autoComplete="name" hint="As on your degree certificate" error={errors.fullName} {...register('fullName')} />
        <TextField label="Email address" type="email" required autoComplete="email" error={errors.email} {...register('email')} />
        <TextField label="Mobile number" type="tel" required autoComplete="tel" inputMode="tel" hint="10-digit Indian mobile number" error={errors.phone} {...register('phone')} />
        <TextField label="Graduation year" type="number" required inputMode="numeric" min={1987} max={new Date().getFullYear()} placeholder="e.g. 2018" error={errors.batch} {...register('batch')} />
        <SelectField label="Program studied" required error={errors.program} options={programOptions} containerClassName="sm:col-span-2" {...register('program')} />
        <TextField label="Current organisation" autoComplete="organization" error={errors.organization} {...register('organization')} />
        <TextField label="Current role" autoComplete="organization-title" error={errors.role} {...register('role')} />
      </div>
      <fieldset className="space-y-4 rounded-2xl bg-surface-sunken p-4 sm:p-5">
        <legend className="sr-only">Participation and privacy choices</legend>
        <CheckboxField label="I’d like to mentor current students" description="We’ll match you by department and industry. You can opt out at any time." error={errors.mentor} {...register('mentor')} />
        <CheckboxField
          label="List me in the public alumni directory"
          description={
            <>
              Optional. Only your name, graduation year, department, industry, role and organisation are shown — never your phone or email. You can withdraw consent any time by emailing
              the alumni office. See our{' '}
              <Link to="/privacy" className="link">
                privacy policy
              </Link>
              .
            </>
          }
          error={errors.directoryConsent}
          {...register('directoryConsent')}
        />
      </fieldset>
      <Honeypot ref={honeypotRef} name="website" />
      {error && <FormError message={error} />}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FormFootnote>Your details are used only by the alumni office to verify and contact you.</FormFootnote>
        <Button type="submit" variant="primary" size="lg" loading={submitting} loadingText="Registering…" icon={<UserPlus className="h-4 w-4" aria-hidden />} className="shrink-0">
          Register
        </Button>
      </div>
    </form>
  );
}
