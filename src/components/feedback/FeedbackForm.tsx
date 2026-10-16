import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { feedbackCategories, feedbackSchema, type FeedbackInput } from '@/utils/schemas';
import { Button } from '@/components/ui/Button';
import { CheckboxField, Honeypot, RatingField, SelectField, TextAreaField, TextField } from '@/components/forms/Field';
import { FormError, FormFootnote, FormSuccess } from '@/components/forms/FormFeedback';

const respondentTypes: FeedbackInput['respondentType'][] = ['Student', 'Parent', 'Faculty', 'Alumni', 'Visitor'];

/**
 * Private institutional feedback. BACKEND: POST /feedback → IQAC feedback register.
 * Feedback is never published automatically; `allowPublic` only makes it eligible for moderation as a testimonial.
 */
export function FeedbackForm() {
  const {
    register,
    control,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<FeedbackInput>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { respondentType: undefined, category: undefined, rating: 0, comments: '', name: '', email: '', allowPublic: false },
    mode: 'onTouched',
  });
  const { onSubmit, honeypotRef, status, result, error, reset, submitting } = useFormSubmit('feedback', { successTitle: 'Feedback received' });

  if (status === 'success' && result) {
    return (
      <FormSuccess
        result={result}
        title="Thank you for your feedback"
        nextSteps="Feedback is reviewed by the IQAC every month. If you left contact details and asked a question, we will reply within ten working days."
        onReset={() => {
          resetForm();
          reset();
        }}
        resetLabel="Send more feedback"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative space-y-5" aria-label="Feedback form">
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField label="I am a" required placeholder="Select…" error={errors.respondentType} options={respondentTypes.map((r) => ({ value: r, label: r }))} {...register('respondentType')} />
        <SelectField label="Feedback about" required placeholder="Select a category…" error={errors.category} options={feedbackCategories.map((c) => ({ value: c, label: c }))} {...register('category')} />
      </div>
      <Controller
        control={control}
        name="rating"
        render={({ field, fieldState }) => <RatingField label="Overall rating" name={field.name} value={field.value} onChange={field.onChange} error={fieldState.error} />}
      />
      <TextAreaField label="Your comments" required rows={5} placeholder="What went well, and what could we do better?" hint="15–1500 characters" error={errors.comments} {...register('comments')} />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Name" autoComplete="name" hint="Leave blank to stay anonymous" error={errors.name} {...register('name')} />
        <TextField label="Email" type="email" autoComplete="email" hint="Only if you would like a reply" error={errors.email} {...register('email')} />
      </div>
      <CheckboxField
        label="Allow the college to publish my feedback as a testimonial, after moderation"
        description={
          <>
            Optional. Nothing is published without this consent; the communications team may contact you to confirm wording and how your name appears. See our{' '}
            <Link to="/privacy" className="link">
              privacy policy
            </Link>
            .
          </>
        }
        error={errors.allowPublic}
        {...register('allowPublic')}
      />
      <Honeypot ref={honeypotRef} name="website" />
      {error && <FormError message={error} />}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FormFootnote>Feedback is private and used to improve our services.</FormFootnote>
        <Button type="submit" variant="primary" size="lg" loading={submitting} loadingText="Sending…" iconRight={<Send className="h-4 w-4" aria-hidden />} className="shrink-0">
          Submit feedback
        </Button>
      </div>
    </form>
  );
}
