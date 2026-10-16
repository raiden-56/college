import { BadgeCheck, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { siteConfig } from '@/config/site';
import { Marquee } from '@/components/motion/Marquee';
import { Badge } from '@/components/ui/Badge';

/**
 * Accreditation & recognition strip. Items with verified: false are clearly labelled
 * "pending verification" so placeholders are never presented as confirmed credentials.
 */
export function AccreditationStrip() {
  const items = siteConfig.accreditations;
  const pendingCount = items.filter((a) => !a.verified).length;

  return (
    <section id="recognition" aria-labelledby="recognition-heading" className="relative scroll-mt-24 border-b border-navy-100 bg-white py-10 sm:py-12">
      <div className="container">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pr-24">
          <h2 id="recognition-heading" className="text-sm font-bold uppercase tracking-[0.16em] text-navy-900">
            Accreditation &amp; recognition
          </h2>
          {pendingCount > 0 && (
            <Badge tone="gold" icon={<Clock3 className="h-3.5 w-3.5" aria-hidden />}>
              {pendingCount === items.length ? 'All items pending verification' : `${pendingCount} pending verification`}
            </Badge>
          )}
        </div>

        <Marquee label="Accreditation and recognition" className="mt-6" speedSeconds={50}>
          {items.map((a) => (
            <div key={a.short} className="flex w-[19rem] shrink-0 items-center gap-3 rounded-2xl border border-navy-100 bg-surface-alt px-4 py-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-navy-900 font-display text-[0.7rem] font-extrabold tracking-wide text-gold-300">
                {a.short}
              </span>
              <span className="min-w-0 text-sm leading-snug">
                <span className="block font-semibold text-navy-900">{a.label}</span>
                {a.verified ? (
                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                    <BadgeCheck className="h-3.5 w-3.5" aria-hidden /> Verified
                  </span>
                ) : (
                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-gold-800">
                    <Clock3 className="h-3.5 w-3.5" aria-hidden /> Pending verification
                  </span>
                )}
              </span>
            </div>
          ))}
        </Marquee>

        <p className="mt-5 text-xs leading-relaxed text-ink-muted sm:text-sm">
          Approval and accreditation details are shown as placeholders until confirmed against official records. Supporting documents will be published under{' '}
          <Link to="/disclosures" className="link">
            Mandatory Disclosures
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
