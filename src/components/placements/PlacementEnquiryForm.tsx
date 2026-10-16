import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { Button } from '@/components/ui/Button';
import { Honeypot, TextAreaField, TextField } from '@/components/forms/Field';
import { FormError, FormFootnote, FormSuccess } from '@/components/forms/FormFeedback';

/** Placement / recruiter enquiry. BACKEND: POST /placement-enquiries → Training & Placement Cell inbox. */
const placementEnquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter your full name.')
    .max(80, 'Name is too long.')
    .regex(/^[\p{L} .'-]+$/u, 'Name can contain letters, spaces, dots, apostrophes and hyphens only.'),
  email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address, e.g. name@example.com.'),
  organisation: z.string().trim().min(2, 'Please enter your organisation’s name.').max(120, 'Please keep it under 120 characters.'),
  message: z.string().trim().min(20, 'Please write at least 20 characters.').max(1500, 'Please keep it under 1500 characters.'),
});
type PlacementEnquiryInput = z.input<typeof placementEnquirySchema>;

export function PlacementEnquiryForm() {
  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<PlacementEnquiryInput>({
    resolver: zodResolver(placementEnquirySchema),
    defaultValues: { name: '', email: '', organisation: '', message: '' },
    mode: 'onTouched',
  });
  const { onSubmit, honeypotRef, status, result, error, reset, submitting } = useFormSubmit('placement-enquiries', { successTitle: 'Enquiry received' });

  if (status === 'success' && result) {
    return (
      <FormSuccess
        result={result}
        title="Enquiry received"
        nextSteps="The Training & Placement Cell will respond within three working days."
        onReset={() => {
          resetForm();
          reset();
        }}
        resetLabel="Send another enquiry"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative space-y-5" aria-label="Placement enquiry form">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Full name" required autoComplete="name" error={errors.name} {...register('name')} />
        <TextField label="Work email" type="email" required autoComplete="email" error={errors.email} {...register('email')} />
        <TextField
          label="Organisation"
          required
          autoComplete="organization"
          hint="Company, institution or agency you represent"
          containerClassName="sm:col-span-2"
          error={errors.organisation}
          {...register('organisation')}
        />
      </div>
      <TextAreaField
        label="How can we help?"
        required
        rows={5}
        placeholder="Campus recruitment, internships, live projects, guest lectures, MoU proposals…"
        error={errors.message}
        {...register('message')}
      />
      <Honeypot ref={honeypotRef} name="website" />
      {error && <FormError message={error} />}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FormFootnote />
        <Button type="submit" variant="primary" size="lg" loading={submitting} loadingText="Sending…" iconRight={<Send className="h-4 w-4" aria-hidden />} className="shrink-0">
          Send enquiry
        </Button>
      </div>
    </form>
  );
}
