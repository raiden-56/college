import { motion } from 'framer-motion';
import { Check, Printer, RotateCcw } from 'lucide-react';
import { useId } from 'react';
import { requiredDocuments } from '@/data/admissions';
import { siteConfig } from '@/config/site';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

const STORAGE_KEY = 'admissions:document-checklist';

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);

/**
 * Interactive "documents to keep ready" checklist. Ticks are saved in this browser only (localStorage)
 * and can be printed as a simple one-page list.
 */
export function DocumentChecklist() {
  const [checked, setChecked] = useLocalStorage<string[]>(STORAGE_KEY, []);
  const baseId = useId();
  const valid = checked.filter((name) => requiredDocuments.some((d) => d.name === name));
  const total = requiredDocuments.length;
  const done = valid.length;
  const requiredTotal = requiredDocuments.filter((d) => d.required).length;
  const requiredDone = requiredDocuments.filter((d) => d.required && valid.includes(d.name)).length;
  const percent = Math.round((done / total) * 100);

  const toggle = (name: string) => setChecked(valid.includes(name) ? valid.filter((n) => n !== name) : [...valid, name]);

  const print = () => {
    const rows = requiredDocuments
      .map((d) => `<li><span class="box">${valid.includes(d.name) ? '&#9745;' : '&#9744;'}</span> ${escapeHtml(d.name)} <em>${d.required ? 'Required' : 'If applicable'}</em></li>`)
      .join('');
    const win = window.open('', '_blank', 'width=720,height=900');
    if (!win) {
      window.print();
      return;
    }
    win.document.write(
      `<!doctype html><html><head><meta charset="utf-8"><title>Admission documents checklist</title><style>body{font:15px/1.5 system-ui,sans-serif;color:#0f172a;margin:40px}h1{font-size:22px;margin:0 0 4px}p{color:#475569;margin:0 0 20px}ul{list-style:none;padding:0}li{padding:10px 0;border-bottom:1px solid #e2e8f0}.box{font-size:18px;margin-right:6px}em{color:#64748b;font-size:12px;margin-left:6px}</style></head><body><h1>Admission documents checklist</h1><p>${escapeHtml(siteConfig.name)} &middot; ${done} of ${total} ready</p><ul>${rows}</ul><p>Carry originals and two self-attested photocopies of each document for verification.</p></body></html>`,
    );
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-navy-100 bg-surface-alt p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-navy-900" aria-live="polite">
              {done} of {total} documents ready
              <span className="ml-2 font-normal text-ink-muted">
                ({requiredDone}/{requiredTotal} required)
              </span>
            </p>
            <p className="mt-0.5 text-xs text-ink-muted">Your ticks are saved on this device only.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={print} icon={<Printer className="h-4 w-4" aria-hidden />}>
              Print
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setChecked([])} disabled={done === 0} icon={<RotateCcw className="h-4 w-4" aria-hidden />}>
              Reset
            </Button>
          </div>
        </div>
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-navy-100" role="progressbar" aria-label="Checklist progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
          <motion.div className={cn('h-full rounded-full', requiredDone === requiredTotal ? 'bg-emerald-500' : 'bg-royal-600')} initial={false} animate={{ width: `${percent}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
        </div>
      </div>
      <ul className="grid divide-y divide-navy-100 md:grid-cols-2 md:divide-y-0">
        {requiredDocuments.map((doc, i) => {
          const id = `${baseId}-doc-${i}`;
          const isChecked = valid.includes(doc.name);
          return (
            <li key={doc.name} className="md:border-b md:border-navy-100 md:odd:border-r">
              <label htmlFor={id} className={cn('flex cursor-pointer items-start gap-3 p-4 transition hover:bg-royal-50/50 sm:px-6', isChecked && 'bg-emerald-50/40')}>
                <input id={id} type="checkbox" checked={isChecked} onChange={() => toggle(doc.name)} className="peer sr-only" />
                <span
                  className={cn(
                    'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition peer-focus-visible:ring-2 peer-focus-visible:ring-royal-500 peer-focus-visible:ring-offset-2',
                    isChecked ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-navy-300 bg-white',
                  )}
                  aria-hidden
                >
                  {isChecked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                </span>
                <span className="flex-1 text-sm">
                  <span className={cn('font-medium', isChecked ? 'text-ink-muted line-through decoration-emerald-600/60' : 'text-navy-900')}>{doc.name}</span>
                </span>
                <Badge tone={doc.required ? 'royal' : 'slate'} className="shrink-0">
                  {doc.required ? 'Required' : 'If applicable'}
                </Badge>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
