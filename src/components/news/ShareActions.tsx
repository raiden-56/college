import { Link2, Mail, Share2 } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { useToast } from '@/components/ui/toast-context';
import { cn } from '@/utils/cn';

interface ShareActionsProps {
  title: string;
  /** Defaults to the current page URL */
  url?: string;
  className?: string;
}

const canNativeShare = () => typeof navigator !== 'undefined' && typeof navigator.share === 'function';

/** Copy-link (with toast), native share sheet when supported, and email share. */
export function ShareActions({ title, url, className }: ShareActionsProps) {
  const toast = useToast();
  const nativeShare = useSyncExternalStore(
    () => () => {},
    canNativeShare,
    () => false,
  );
  const shareUrl = () => url ?? window.location.href;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl());
      toast({ tone: 'success', title: 'Link copied', description: 'The page link is on your clipboard.' });
    } catch {
      toast({ tone: 'error', title: 'Could not copy the link', description: 'Please copy it from the address bar instead.' });
    }
  };

  const share = async () => {
    try {
      await navigator.share({ title, url: shareUrl() });
    } catch (e) {
      // AbortError = the user closed the share sheet; nothing to report.
      if (e instanceof DOMException && e.name === 'AbortError') return;
      toast({ tone: 'error', title: 'Sharing is not available', description: 'Use “Copy link” instead.' });
    }
  };

  const btn = 'inline-flex items-center gap-2 rounded-full border border-navy-200 bg-white px-4 py-2 text-sm font-semibold text-navy-900 transition hover:-translate-y-0.5 hover:border-royal-400 hover:text-royal-700';

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      <button type="button" onClick={copy} className={btn}>
        <Link2 className="h-4 w-4" aria-hidden />
        Copy link
      </button>
      {nativeShare && (
        <button type="button" onClick={share} className={btn}>
          <Share2 className="h-4 w-4" aria-hidden />
          Share…
        </button>
      )}
      <a href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url ?? (typeof window !== 'undefined' ? window.location.href : ''))}`} className={btn}>
        <Mail className="h-4 w-4" aria-hidden />
        Email
      </a>
    </div>
  );
}
