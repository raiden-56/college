import { Download, Eye, FileText } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatFileSize } from '@/utils/format';

interface DownloadLinkProps {
  title: string;
  url: string;
  sizeKb?: number;
  fileType?: string;
  meta?: string;
  className?: string;
  /** Show a separate "Preview" action that opens the PDF in a new tab */
  showPreview?: boolean;
}

/** File row with type, size and download (and optional preview) actions. */
export function DownloadLink({ title, url, sizeKb, fileType = 'PDF', meta, className, showPreview }: DownloadLinkProps) {
  const details = [fileType, formatFileSize(sizeKb), meta].filter(Boolean).join(' · ');
  return (
    <div className={cn('group flex items-center gap-4 rounded-xl border border-navy-100 bg-white p-4 transition hover:border-royal-200 hover:shadow-card', className)}>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-red-50 text-red-700">
        <FileText className="h-5 w-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold leading-snug text-navy-950">{title}</p>
        {details && <p className="mt-0.5 text-xs text-ink-muted">{details}</p>}
      </div>
      <div className="flex shrink-0 gap-1">
        {showPreview && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 place-items-center rounded-full text-navy-700 transition hover:bg-navy-50" aria-label={`Preview ${title} (opens in a new tab)`}>
            <Eye className="h-4 w-4" aria-hidden />
          </a>
        )}
        <a href={url} download className="grid h-10 w-10 place-items-center rounded-full bg-navy-900 text-white transition hover:bg-royal-700" aria-label={`Download ${title}${details ? ` (${details})` : ''}`}>
          <Download className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </div>
  );
}
