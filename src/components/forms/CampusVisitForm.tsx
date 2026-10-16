import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { departments } from '@/data/departments';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { campusVisitSchema, type CampusVisitInput } from '@/utils/schemas';
import { Button } from '@/components/ui/Button';
import { Honeypot, SelectField, TextField } from './Field';
import { FormError, FormFootnote, FormSuccess } from './FormFeedback';

const today = () => new Date().toISOString().slice(0, 10);

/**
 * Campus visit request. BACKEND: POST /campus-visits → admissions calendar; confirm slot by email.
 */
export function CampusVisitForm() {
  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<CampusVisitInput>({
    resolver: zodResolver(campusVisitSchema),
    defaultValues: { fullName: '', email: '', phone: '', visitDate: '', visitors: 1, interest: '' },
    mode: 'onTouched',
  });
  const { onSubmit, honeypotRef, status, result, error, reset, submitting } = useFormSubmit('campus-visits', { successTitle: 'Visit request received' });

  if (status === 'success' && result) {
    return (
      <FormSuccess
        result={result}
        title="Visit request received"
        nextSteps="We will confirm your visit slot by email. Visits run Monday–Saturday, 10 AM – 4 PM."
        onReset={() => {
          resetForm();
          reset();
        }}
        resetLabel="Request another visit"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative space-y-5" aria-label="Campus visit request form">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Full name" required autoComplete="name" error={errors.fullName} {...register('fullName')} />
        <TextField label="Email address" type="email" required autoComplete="email" error={errors.email} {...register('email')} />
        <TextField label="Mobile number" type="tel" required autoComplete="tel" inputMode="tel" error={errors.phone} {...register('phone')} />
        <TextField label="Preferred date" type="date" required min={today()} hint="Monday to Saturday" error={errors.visitDate} {...register('visitDate')} />
        <TextField label="Number of visitors" type="number" required min={1} max={10} error={errors.visitors} {...register('visitors')} />
        <SelectField label="Area of interest" placeholder="General campus tour" options={departments.map((d) => ({ value: d.slug, label: d.shortName }))} {...register('interest')} />
      </div>
      <Honeypot ref={honeypotRef} name="website" />
      {error && <FormError message={error} />}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FormFootnote />
        <Button type="submit" size="lg" loading={submitting} loadingText="Sending…" icon={<CalendarCheck className="h-4 w-4" aria-hidden />} className="shrink-0">
          Request visit
        </Button>
      </div>
    </form>
  );
}
