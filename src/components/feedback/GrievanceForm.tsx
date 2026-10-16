import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, ShieldAlert } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { grievanceSchema, type GrievanceInput } from '@/utils/schemas';
import { Button } from '@/components/ui/Button';
import { CheckboxField, Honeypot, SelectField, TextAreaField, TextField } from '@/components/forms/Field';
import { FormError, FormFootnote, FormSuccess } from '@/components/forms/FormFeedback';
import { grievanceOffices } from './grievanceOffices';

const roles: GrievanceInput['role'][] = ['Student', 'Parent', 'Staff', 'Other'];

/**
 * Grievance / complaint. BACKEND: POST /grievances → routed to the selected office's secure inbox,
 * acknowledged with a reference number. Must be stored with restricted access.
 */
export function GrievanceForm() {
  const {
    register,
    control,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<GrievanceInput>({
    resolver: zodResolver(grievanceSchema),
    defaultValues: { fullName: '', email: '', phone: '', role: undefined, office: undefined, description: '', confidential: true },
    mode: 'onTouched',
  });
  const office = useWatch({ control, name: 'office' });
  const route = grievanceOffices.find((o) => o.value === office);
  const { onSubmit, honeypotRef, status, result, error, reset, submitting } = useFormSubmit('grievances', { successTitle: 'Grievance registered' });

  if (status === 'success' && result) {
    return (
      <FormSuccess
        result={result}
        title="Grievance registered"
        nextSteps="You will receive an acknowledgement by email. The office concerned will respond within the timeline shown on this page. Quote your reference number in all correspondence."
        onReset={() => {
          resetForm();
          reset();
        }}
        resetLabel="Submit another grievance"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative space-y-5" aria-label="Grievance form">
      <div className="flex gap-3 rounded-xl border border-royal-100 bg-royal-50/60 p-4 text-sm text-ink-soft" role="note">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-royal-700" aria-hidden />
        <p>
          <strong className="text-navy-900">Confidential.</strong> Your grievance is seen only by members of the office you select and is never published. Retaliation against anyone who
          raises a grievance in good faith is prohibited. Your contact details are required so the office can follow up with you.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Full name" required autoComplete="name" error={errors.fullName} {...register('fullName')} />
        <SelectField label="I am a" required error={errors.role} options={roles.map((r) => ({ value: r, label: r }))} {...register('role')} />
        <TextField label="Email address" type="email" required autoComplete="email" error={errors.email} {...register('email')} />
        <TextField label="Mobile number" type="tel" required autoComplete="tel" inputMode="tel" error={errors.phone} {...register('phone')} />
        <SelectField
          label="Send this to"
          required
          placeholder="Select the office…"
          error={errors.office}
          hint={route ? `${route.handles} Target response: ${route.timeline}.` : 'Not sure? Choose the Grievance Redressal Cell and it will be forwarded.'}
          options={grievanceOffices.map((o) => ({ value: o.value, label: o.value }))}
          containerClassName="sm:col-span-2"
          {...register('office')}
        />
      </div>
      <TextAreaField
        label="Describe your grievance"
        required
        rows={6}
        placeholder="What happened, when and where, who was involved, and what outcome you are seeking."
        hint="30–3000 characters. Do not include passwords or bank details."
        error={errors.description}
        {...register('description')}
      />
      <CheckboxField
        label="Keep my identity confidential from the people named in this complaint, as far as the inquiry allows"
        description="Some statutory inquiries (for example, under the ICC or Anti-Ragging regulations) may require disclosure to the committee; you will be informed first."
        error={errors.confidential}
        {...register('confidential')}
      />
      {office === 'Anti-Ragging Committee' && (
        <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900" role="note">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p>If you are in immediate danger, call campus security or the national anti-ragging helpline now — do not wait for a reply to this form.</p>
        </div>
      )}
      <Honeypot ref={honeypotRef} name="website" />
      {error && <FormError message={error} />}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FormFootnote>Details are shared only with the office handling your grievance.</FormFootnote>
        <Button type="submit" variant="primary" size="lg" loading={submitting} loadingText="Submitting…" icon={<Lock className="h-4 w-4" aria-hidden />} className="shrink-0">
          Submit grievance
        </Button>
      </div>
    </form>
  );
}
