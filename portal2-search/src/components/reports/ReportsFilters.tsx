import type { FormEvent } from 'react'
import { Calendar, Search } from 'lucide-react'
import { JURISDICTIONS } from '../../data/jurisdictions'
import { DATE_RANGES, ORDER_STATUSES, REPORT_TYPES } from '../../data/orders'
import type { ReportFilters as Filters } from '../../types/reports'
import { Button } from '../ui/Button'
import { TextField } from '../ui/TextField'
import { FilterChip } from './FilterChip'
import styles from './ReportsFilters.module.css'

const TYPE_OPTIONS = REPORT_TYPES.map((t) => ({ value: t, label: t }))
const JURISDICTION_OPTIONS = JURISDICTIONS.map((j) => ({ value: j.id, label: j.name, flag: j.code }))

interface ReportsFiltersProps {
  query: string
  filters: Filters
  from: string
  to: string
  /** Open one filter list on mount (state gallery only) */
  openFilter?: keyof Filters
  onQueryChange: (value: string) => void
  onSubmit: () => void
  onFilterChange: <K extends keyof Filters>(key: K, value: Filters[K]) => void
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
}

/** Search by name / number, then narrow the list by status, type, jurisdiction and date. */
export function ReportsFilters({
  query,
  filters,
  from,
  to,
  openFilter,
  onQueryChange,
  onSubmit,
  onFilterChange,
  onFromChange,
  onToChange,
}: ReportsFiltersProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <div className={styles.filters}>
      <form className={styles.search} onSubmit={handleSubmit} noValidate>
        <TextField
          className={styles.query}
          value={query}
          onChange={onQueryChange}
          placeholder="Business name, registration number or order number"
          aria-label="Search your reports"
          leading={<Search size={20} />}
          clearable
        />
        <Button type="submit">Search</Button>
      </form>

      <div className={styles.row} role="group" aria-label="Filter by">
        <span className={styles.label}>Filter by</span>
        <FilterChip
          label="Order status"
          options={ORDER_STATUSES}
          value={filters.status}
          onApply={(v) => onFilterChange('status', v)}
          defaultOpen={openFilter === 'status'}
        />
        <FilterChip
          label="Report type"
          options={TYPE_OPTIONS}
          value={filters.type}
          onApply={(v) => onFilterChange('type', v)}
          defaultOpen={openFilter === 'type'}
        />
        <FilterChip
          label="Jurisdiction"
          options={JURISDICTION_OPTIONS}
          value={filters.jurisdiction}
          onApply={(v) => onFilterChange('jurisdiction', v)}
          defaultOpen={openFilter === 'jurisdiction'}
        />
        <FilterChip
          single
          label="Date range"
          options={DATE_RANGES}
          value={filters.range ? [filters.range] : []}
          onApply={(v) => onFilterChange('range', v[0] ?? null)}
          defaultOpen={openFilter === 'range'}
        />

        <span className={styles.divider} aria-hidden />

        <div className={styles.dates}>
          <TextField
            className={styles.date}
            type="date"
            value={from}
            onChange={onFromChange}
            aria-label="From date"
            leading={<Calendar size={16} />}
          />
          <span className={styles.to}>to</span>
          <TextField
            className={styles.date}
            type="date"
            value={to}
            onChange={onToChange}
            aria-label="To date"
            leading={<Calendar size={16} />}
          />
        </div>
      </div>
    </div>
  )
}
