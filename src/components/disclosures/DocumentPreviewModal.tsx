import { Download, ExternalLink } from 'lucide-react';
import type { DisclosureDocument } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { buttonClasses } from '@/components/ui/buttonClasses';
import { formatDate, formatFileSize } from '@/utils/format';

interface DocumentPreviewModalProps {
  doc: DisclosureDocument | null;
  onClose: () => void;
}

/** Inline PDF preview in an accessible dialog, with "open in new tab" and download fallbacks. */
export function DocumentPreviewModal({ doc, onClose }: DocumentPreviewModalProps) {
  return (
    <Modal
      open={!!doc}
      onClose={onClose}
      size="xl"
      title={doc?.title ?? 'Document preview'}
      description={doc ? `${doc.category} · ${doc.academicYear} · Updated ${formatDate(doc.updatedOn)}` : undefined}
    >
      {doc && (
        <div>
          <div className="overflow-hidden rounded-2xl border border-navy-100 bg-surface-sunken">
            <iframe src={`${doc.url}#view=FitH`} title={`Preview of ${doc.title}`} className="h-[60vh] w-full" loading="lazy" />
          </div>
          <p className="mt-3 text-xs text-ink-muted">If the preview does not load on your device, open the file in a new tab or download it.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={doc.url} target="_blank" rel="noopener noreferrer" className={buttonClasses({ variant: 'secondary' })}>
              <ExternalLink className="h-4 w-4" aria-hidden />
              Open in new tab<span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a href={doc.url} download className={buttonClasses({ variant: 'primary' })}>
              <Download className="h-4 w-4" aria-hidden />
              Download {doc.fileType ?? 'PDF'}
              {doc.sizeKb ? ` (${formatFileSize(doc.sizeKb)})` : ''}
            </a>
          </div>
        </div>
      )}
    </Modal>
  );
}
