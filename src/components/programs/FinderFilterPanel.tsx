import { FilterSelect, SearchInput } from '@/components/ui/Filters';
import { degreeLevelLabels, degreeLevels, programs } from '@/data/programs';
import { disciplineOptions, durationOptions, eligibilityOptions, matchesFilters, studyModes, type FinderFilters, type FinderKey } from './finder';

interface FinderFilterPanelProps {
  values: FinderFilters;
  onChange: (key: FinderKey, value: string) => void;
  /** Show the degree-level select (the page also offers level chips above the results) */
  showLevel?: boolean;
}

/** Search + facet selects for the course finder. Option labels include live result counts. */
export function FinderFilterPanel({ values, onChange, showLevel = true }: FinderFilterPanelProps) {
  const count = (key: FinderKey, value: string) => programs.filter((p) => matchesFilters(p, { ...values, [key]: value })).length;
  const withCount = (key: FinderKey, options: { value: string; label: string }[]) =>
    options.map((o) => ({ value: o.value, label: `${o.label} (${count(key, o.value)})` }));

  return (
    <div className="space-y-5">
      <SearchInput label="Search programs" showLabel value={values.q} onChange={(v) => onChange('q', v)} placeholder="e.g. data science, law, MBA" />
      {showLevel && (
        <FilterSelect
          label="Degree level"
          value={values.level}
          onChange={(v) => onChange('level', v)}
          allLabel="All levels"
          options={withCount(
            'level',
            degreeLevels.map((l) => ({ value: l, label: degreeLevelLabels[l] })),
          )}
        />
      )}
      <FilterSelect label="Department / discipline" value={values.discipline} onChange={(v) => onChange('discipline', v)} allLabel="All disciplines" options={withCount('discipline', disciplineOptions)} />
      <FilterSelect
        label="Duration"
        value={values.duration}
        onChange={(v) => onChange('duration', v)}
        allLabel="Any duration"
        options={withCount(
          'duration',
          durationOptions.map((o) => ({ value: o.value, label: o.label })),
        )}
      />
      <FilterSelect
        label="Eligibility"
        value={values.eligibility}
        onChange={(v) => onChange('eligibility', v)}
        allLabel="Any qualification"
        options={withCount(
          'eligibility',
          eligibilityOptions.map((e) => ({ value: e, label: e })),
        )}
      />
      <FilterSelect
        label="Study mode"
        value={values.mode}
        onChange={(v) => onChange('mode', v)}
        allLabel="Any mode"
        options={withCount(
          'mode',
          studyModes.map((m) => ({ value: m, label: m })),
        )}
      />
    </div>
  );
}
