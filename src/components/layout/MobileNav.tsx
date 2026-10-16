import { ChevronDown, Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { mainNav } from '@/data/navigation';
import { siteConfig } from '@/config/site';
import { Drawer } from '@/components/ui/Drawer';
import { ButtonLink } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { Logo } from './Logo';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

/** Slide-in navigation for screens below xl. Groups expand inline (disclosure pattern). */
export function MobileNav({ open, onClose }: MobileNavProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn('block rounded-xl px-4 py-3 text-[0.9375rem] font-semibold transition', isActive ? 'bg-royal-50 text-royal-700' : 'text-navy-900 hover:bg-navy-50');

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Site navigation"
      header={<Logo />}
      footer={
        <div className="space-y-3">
          <ButtonLink to="/admissions/apply" variant="gold" size="lg" className="w-full" onClick={onClose}>
            Apply Now
          </ButtonLink>
          <div className="flex gap-2 text-sm">
            <a href={`tel:${siteConfig.contacts.admissions.phone.replace(/\s/g, '')}`} className="btn btn-md btn-secondary flex-1">
              <Phone className="h-4 w-4" aria-hidden /> Call
            </a>
            <a href={`mailto:${siteConfig.contacts.admissions.email}`} className="btn btn-md btn-secondary flex-1">
              <Mail className="h-4 w-4" aria-hidden /> Email
            </a>
          </div>
        </div>
      }
    >
      <nav aria-label="Mobile" className="p-3">
        <ul className="space-y-1">
          <li>
            <NavLink to="/" end className={linkClass} onClick={onClose}>
              Home
            </NavLink>
          </li>
          {mainNav.map((item) => {
            if (!item.children) {
              return (
                <li key={item.label}>
                  <NavLink to={item.to} className={linkClass} onClick={onClose}>
                    {item.label}
                  </NavLink>
                </li>
              );
            }
            const isOpen = expanded === item.label;
            const panelId = `mnav-${item.label.replace(/\W+/g, '-')}`;
            return (
              <li key={item.label}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-[0.9375rem] font-semibold text-navy-900 hover:bg-navy-50"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setExpanded(isOpen ? null : item.label)}
                >
                  {item.label}
                  <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} aria-hidden />
                </button>
                <ul id={panelId} hidden={!isOpen} className="mb-2 ml-4 border-l-2 border-royal-100 pl-2">
                  {item.children.map((child) => (
                    <li key={child.to + child.label}>
                      <NavLink to={child.to} end className={({ isActive }) => cn('block rounded-lg px-3 py-2.5 text-sm', isActive ? 'font-semibold text-royal-700' : 'text-ink-soft hover:bg-navy-50 hover:text-navy-900')} onClick={onClose}>
                        {child.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </nav>
    </Drawer>
  );
}
