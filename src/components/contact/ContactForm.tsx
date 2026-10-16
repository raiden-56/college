import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { departments } from '@/data/departments';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { contactSchema, type ContactInput } from '@/utils/schemas';
import { Button } from '@/components/ui/Button';
import { Honeypot, SelectField, TextAreaField, TextField } from '@/components/forms/Field';
import { FormError, FormFootnote, FormSuccess } from '@/components/forms/FormFeedback';

/** Offices first, then academic departments (value = routing key for the backend). */
const contactRecipients = [
  {
    group: 'Offices',
    options: [
      { value: 'general', label: 'General enquiries' },
      { value: 'admissions', label: 'Admissions office' },
      { value: 'examinations', label: 'Examination section' },
      { value: 'placements', label: 'Training & placements' },
      { value: 'accounts', label: 'Accounts & fees' },
      { value: 'alumni', label: 'Alumni relations' },
      { value: 'grievance', label: 'Grievance redressal cell' },
    ],
  },
  { group: 'Departments', options: departments.map((d) => ({ value: d.slug, label: d.shortName })) },
];

/**
 * General contact form. BACKEND: POST /contact-messages → route to the selected office's inbox.
 * Spam protection: honeypot + minimum fill time (useFormSubmit) — add server-side rate limiting / CAPTCHA.
 */
export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { fullName: '', email: '', phone: '', department: '', subject: '', message: '' },
    mode: 'onTouched',
  });
  const { onSubmit, honeypotRef, status, result, error, reset, submitting } = useFormSubmit('contact-messages', { successTitle: 'Message received' });

  if (status === 'success' && result) {
    return (
      <FormSuccess
        result={result}
        title="Message received"
        nextSteps="The office you selected usually replies within two working days."
        onReset={() => {
          resetForm();
          reset();
        }}
        resetLabel="Send another message"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative space-y-5" aria-label="Contact form">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Full name" required autoComplete="name" error={errors.fullName} {...register('fullName')} />
        <TextField label="Email address" type="email" required autoComplete="email" error={errors.email} {...register('email')} />
        <TextField label="Mobile number" type="tel" autoComplete="tel" inputMode="tel" hint="So the office can call you back" error={errors.phone} {...register('phone')} />
        <SelectField label="Who is this for?" required placeholder="Choose an office or department" options={contactRecipients} error={errors.department} {...register('department')} />
      </div>
      <TextField label="Subject" required error={errors.subject} {...register('subject')} />
      <TextAreaField label="Message" required rows={5} placeholder="How can we help?" error={errors.message} {...register('message')} />
      <Honeypot ref={honeypotRef} name="website" />
      {error && <FormError message={error} />}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FormFootnote />
        <Button type="submit" size="lg" loading={submitting} loadingText="Sending…" iconRight={<Send className="h-4 w-4" aria-hidden />} className="shrink-0">
          Send message
        </Button>
      </div>
    </form>
  );
}
