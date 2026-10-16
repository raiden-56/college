import { cn } from '@/utils/cn';

export type ButtonVariant = 'primary' | 'gold' | 'secondary' | 'ghost' | 'outline-light';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/** Class string for anything that should look like a button (e.g. a plain <a> or <label>). */
export const buttonClasses = ({ variant = 'primary', size = 'md', className }: ButtonStyleProps = {}) => cn('btn', `btn-${size}`, `btn-${variant}`, className);
