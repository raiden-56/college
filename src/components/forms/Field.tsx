import { AlertCircle, Star } from 'lucide-react';
import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
/** Accepts react-hook-form FieldError or any object with a message. */
export type FieldErrorLike = { message?: string } | undefined;
import { cn } from '@/utils/cn';

interface FieldShellProps {
  id: string;
  label: ReactNode;
  error?: FieldErrorLike;
  hint?: ReactNode;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

/** Label + control + hint + error, wired with aria-describedby by the field components below. */
function FieldShell({ id, label, error, hint, required, className, children }: FieldShellProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
        {required ? (
          <span className="ml-0.5 text-red-600" aria-hidden>
            *
          </span>
        ) : (
          <span className="ml-1.5 text-xs font-normal text-ink-muted">(optional)</span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      )}
      {error?.message && (
        <p id={`${id}-error`} className="field-error" role="alert">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
          {error.message}
        </p>
      )}
    </div>
  );
}

const describedBy = (id: string, error?: unknown, hint?: unknown) => [error ? `${id}-error` : null, hint && !error ? `${id}-hint` : null].filter(Boolean).join(' ') || undefined;

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  error?: FieldErrorLike;
  hint?: ReactNode;
  containerClassName?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField({ label, error, hint, required, containerClassName, className, id: idProp, ...rest }, ref) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required} className={containerClassName}>
      <input ref={ref} id={id} aria-invalid={!!error} aria-required={required} aria-describedby={describedBy(id, error, hint)} className={cn('field-input', className)} {...rest} />
    </FieldShell>
  );
});

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: ReactNode;
  error?: FieldErrorLike;
  hint?: ReactNode;
  containerClassName?: string;
}

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(function TextAreaField({ label, error, hint, required, containerClassName, className, id: idProp, rows = 4, ...rest }, ref) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required} className={containerClassName}>
      <textarea ref={ref} id={id} rows={rows} aria-invalid={!!error} aria-required={required} aria-describedby={describedBy(id, error, hint)} className={cn('field-input resize-y', className)} {...rest} />
    </FieldShell>
  );
});

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: ReactNode;
  error?: FieldErrorLike;
  hint?: ReactNode;
  placeholder?: string;
  options: ({ value: string; label: string } | { group: string; options: { value: string; label: string }[] })[];
  containerClassName?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { label, error, hint, required, placeholder = 'Select…', options, containerClassName, className, id: idProp, ...rest },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required} className={containerClassName}>
      <select ref={ref} id={id} aria-invalid={!!error} aria-required={required} aria-describedby={describedBy(id, error, hint)} className={cn('field-input cursor-pointer', className)} {...rest}>
        <option value="">{placeholder}</option>
        {options.map((o) =>
          'group' in o ? (
            <optgroup key={o.group} label={o.group}>
              {o.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </optgroup>
          ) : (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ),
        )}
      </select>
    </FieldShell>
  );
});

interface CheckboxFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  error?: FieldErrorLike;
  description?: ReactNode;
}

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(function CheckboxField({ label, error, description, className, id: idProp, ...rest }, ref) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          aria-invalid={!!error}
          aria-describedby={[error ? `${id}-error` : null, description ? `${id}-desc` : null].filter(Boolean).join(' ') || undefined}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-navy-300 accent-royal-700"
          {...rest}
        />
        <div className="text-sm">
          <label htmlFor={id} className="cursor-pointer font-medium text-navy-900">
            {label}
          </label>
          {description && (
            <p id={`${id}-desc`} className="mt-0.5 text-ink-muted">
              {description}
            </p>
          )}
        </div>
      </div>
      {error?.message && (
        <p id={`${id}-error`} className="field-error" role="alert">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
          {error.message}
        </p>
      )}
    </div>
  );
});

interface RatingFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  error?: FieldErrorLike;
  name: string;
}

const ratingLabels = ['Very poor', 'Poor', 'Average', 'Good', 'Excellent'];

/** Star rating built on native radio inputs: arrow keys work and each star is labelled. */
export function RatingField({ label, value, onChange, error, name }: RatingFieldProps) {
  const id = useId();
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <fieldset aria-describedby={error ? `${id}-error` : undefined}>
      <legend className="field-label">
        {label}
        <span className="ml-0.5 text-red-600" aria-hidden>
          *
        </span>
      </legend>
      <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
        {ratingLabels.map((text, i) => {
          const n = i + 1;
          return (
            <label key={n} className="cursor-pointer rounded-lg p-1 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-royal-500" onMouseEnter={() => setHover(n)}>
              <input type="radio" name={name} value={n} checked={value === n} onChange={() => onChange(n)} className="sr-only" />
              <Star className={cn('h-8 w-8 transition', n <= shown ? 'fill-gold-400 text-gold-400' : 'text-navy-200')} aria-hidden />
              <span className="sr-only">
                {n} star{n > 1 ? 's' : ''} — {text}
              </span>
            </label>
          );
        })}
        <span className="ml-2 text-sm font-medium text-ink-muted" aria-hidden>
          {shown ? ratingLabels[shown - 1] : 'Select a rating'}
        </span>
      </div>
      {error?.message && (
        <p id={`${id}-error`} className="field-error" role="alert">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
          {error.message}
        </p>
      )}
    </fieldset>
  );
}

/**
 * Hidden honeypot input. Real users never see or fill it; naive bots do.
 * Pair with useFormSubmit, which rejects submissions where it has a value.
 */
export const Honeypot = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Honeypot(props, ref) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Leave this field empty
        <input ref={ref} type="text" tabIndex={-1} autoComplete="off" {...props} />
      </label>
    </div>
  );
});
