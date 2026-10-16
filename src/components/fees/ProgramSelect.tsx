import { useId } from 'react';
import { degreeLevelLabels, degreeLevels, programs } from '@/data/programs';

interface ProgramSelectProps {
  value: string;
  onChange: (slug: string) => void;
  label?: string;
  className?: string;
}

const groups = degreeLevels
  .map((level) => ({ level, items: programs.filter((p) => p.level === level) }))
  .filter((g) => g.items.length > 0);

/** Native program picker grouped by degree level (optgroups) — best mobile and screen-reader support. */
export function ProgramSelect({ value, onChange, label = 'Program', className }: ProgramSelectProps) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label text-xs uppercase tracking-wide text-ink-muted">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field-input cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2327458c%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:1.1rem] bg-[right_0.9rem_center] bg-no-repeat py-3 pr-10 text-base font-semibold"
      >
        {groups.map((g) => (
          <optgroup key={g.level} label={degreeLevelLabels[g.level]}>
            {g.items.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
