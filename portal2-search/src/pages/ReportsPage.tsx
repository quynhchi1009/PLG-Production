import { AppShell } from '../components/layout/AppShell'
import { ReportsPanel } from '../components/reports/ReportsPanel'
import { useReports, type ReportsSeed } from '../hooks/useReports'
import type { ReportFilters } from '../types/reports'

/** Pre-baked screen states, selectable with `#/report?state=<key>` for design/QA parity. */
export const REPORTS_STATES: Record<
  string,
  { label: string; seed: ReportsSeed; openFilter?: keyof ReportFilters }
> = {
  results: { label: 'Results', seed: {} },
  'filter-open': { label: 'Report type filter open', seed: {}, openFilter: 'type' },
  filtered: {
    label: 'Filters applied',
    seed: { filters: { status: ['completed'], type: ['KYB BASIC', 'AML'], range: '30d' } },
  },
  selected: { label: 'Rows selected', seed: { selected: ['order-1', 'order-3', 'order-4'] } },
  loading: { label: 'Loading', seed: { status: 'loading' } },
  'no-matches': {
    label: 'No matches',
    seed: { query: 'zzqxjwvk', filters: { status: ['cancelled'] } },
  },
  'no-orders': { label: 'No reports yet', seed: { noOrders: true } },
}

interface ReportsPageProps {
  stateKey?: string
}

export function ReportsPage({ stateKey }: ReportsPageProps) {
  const preset = stateKey ? REPORTS_STATES[stateKey] : undefined
  const r = useReports(preset?.seed)

  return (
    <AppShell title="View reports" activeNav="reports">
      <ReportsPanel
        loading={preset?.seed.status === 'loading'}
        hasOrders={r.hasOrders}
        query={r.query}
        filters={r.filters}
        from={r.from}
        to={r.to}
        activeFilterCount={r.activeFilterCount}
        openFilter={preset?.openFilter}
        sort={r.sort}
        rows={r.pageRows}
        total={r.total}
        page={r.page}
        pageSize={r.pageSize}
        selected={r.selected}
        onQueryChange={r.setQuery}
        onSubmit={r.submit}
        onFilterChange={r.setFilter}
        onFromChange={r.setFrom}
        onToChange={r.setTo}
        onClearFilters={r.clearFilters}
        onSort={r.toggleSort}
        onToggleRow={r.toggleRow}
        onTogglePage={r.togglePage}
        onClearSelection={r.clearSelection}
        onPageChange={r.setPage}
        onView={(order) => (window.location.hash = `#/report/view?order=${order.id}`)}
        onAddAml={() => undefined}
      />
    </AppShell>
  )
}
