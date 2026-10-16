import { Loader2 } from 'lucide-react';
import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { buttonClasses, type ButtonStyleProps as StyleProps } from './buttonClasses';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, StyleProps {
  loading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
  iconRight?: ReactNode;
}

/** Action button. Use <ButtonLink> for navigation. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, className, loading, loadingText, icon, iconRight, children, disabled, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={buttonClasses({ variant, size, className })} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : icon}
      {loading && loadingText ? loadingText : children}
      {!loading && iconRight}
    </button>
  );
});

interface ButtonLinkProps extends Omit<LinkProps, 'className'>, StyleProps {
  icon?: ReactNode;
  iconRight?: ReactNode;
}

/** Internal navigation styled as a button. */
export function ButtonLink({ variant, size, className, icon, iconRight, children, ...rest }: ButtonLinkProps) {
  return (
    <Link className={buttonClasses({ variant, size, className })} {...rest}>
      {icon}
      {children}
      {iconRight}
    </Link>
  );
}

interface ExternalButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement>, StyleProps {
  icon?: ReactNode;
  iconRight?: ReactNode;
}

/** External link / download styled as a button. Opens off-site links in a new tab with a screen-reader hint. */
export function ExternalButtonLink({ variant, size, className, icon, iconRight, children, href, ...rest }: ExternalButtonLinkProps) {
  const isExternal = !!href && /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      className={buttonClasses({ variant, size, className })}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {icon}
      {children}
      {iconRight}
      {isExternal && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
