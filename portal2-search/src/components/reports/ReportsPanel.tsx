import { Download } from 'lucide-react'
import type { ReportFilters, ReportOrder, SortDir, SortKey } from '../../types/reports'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Pagination } from '../ui/Pagination'
import { ReportsFilters } from './ReportsFilters'
import { ReportsTable } from './ReportsTable'
import styles from './ReportsPanel.module.css'

interface ReportsPanelProps {
  loading: boolean
  hasOrders: boolean
  query: string
  filters: ReportFilters
  from: string
  to: string
  activeFilterCount: number
  openFilter?: keyof ReportFilters
  sort: { key: SortKey; dir: SortDir }
  rows: ReportOrder[]
  total: number
  page: number
  pageSize: number
  selected: Set<string>
  onQueryChange: (value: string) => void
  onSubmit: () => void
  onFilterChange: <K extends keyof ReportFilters>(key: K, value: ReportFilters[K]) => void
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
  onClearFilters: () => void
  onSort: (key: SortKey) => void
  onToggleRow: (id: string) => void
  onTogglePage: (check: boolean) => void
  onClearSelection: () => void
  onPageChange: (page: number) => void
  onView: (order: ReportOrder) => void
  onAddAml: (order: ReportOrder) => void
}

/**
 * Two surfaces, as on Search: the criteria (heading, search, filters) and the list of
 * orders with its own toolbar, so the list can be read and acted on apart from the controls.
 */
export function ReportsPanel(props: ReportsPanelProps) {
  const { loading, hasOrders, rows, total, selected } = props
  const showEmpty = !loading && rows.length === 0

  return (
    <div className={styles.panel}>
      <Card className={styles.criteria}>
        <div className={styles.heading}>
          <h2 className={styles.title}>Your reports</h2>
          {props.activeFilterCount > 0 && (
            <Button variant="link" onClick={props.onClearFilters}>
              Clear filters
            </Button>
          )}
        </div>
        <ReportsFilters
          query={props.query}
          filters={props.filters}
          from={props.from}
          to={props.to}
          openFilter={props.openFilter}
          onQueryChange={props.onQueryChange}
          onSubmit={props.onSubmit}
          onFilterChange={props.onFilterChange}
          onFromChange={props.onFromChange}
          onToChange={props.onToChange}
        />
      </Card>

      <Card className={styles.results}>
        <div className={styles.toolbar} aria-live="polite">
          <p className={styles.count}>
            {selected.size > 0 ? (
              <>
                <strong>{selected.size}</strong> selected
                <Button variant="link" onClick={props.onClearSelection}>
                  Clear
                </Button>
              </>
            ) : loading ? (
              'Loading reports…'
            ) : (
              `${total} ${total === 1 ? 'report' : 'reports'}`
            )}
          </p>
          <Button variant="outline" disabled={selected.size === 0} aria-label="Download selected reports">
            <Download size={16} aria-hidden />
            Download
          </Button>
        </div>

        {showEmpty ? (
          <div className={styles.empty}>
            {hasOrders ? (
              <>
                <h3 className={styles.emptyTitle}>No reports match</h3>
                <p>Try a different name or number, or remove some filters.</p>
                <Button variant="outline" onClick={props.onClearFilters}>
                  Clear filters
                </Button>
              </>
            ) : (
              <>
                <h3 className={styles.emptyTitle}>No reports yet</h3>
                <p>Reports you order will appear here.</p>
                <Button onClick={() => (window.location.hash = '#/search')}>Search for a business</Button>
              </>
            )}
          </div>
        ) : (
          <ReportsTable
            rows={rows}
            loading={loading}
            sort={props.sort}
            selected={selected}
            onSort={props.onSort}
            onToggleRow={props.onToggleRow}
            onTogglePage={props.onTogglePage}
            onView={props.onView}
            onAddAml={props.onAddAml}
          />
        )}

        {!showEmpty && !loading && (
          <div className={styles.footer}>
            <Pagination
              total={total}
              page={props.page}
              pageSize={props.pageSize}
              onPageChange={props.onPageChange}
            />
          </div>
        )}
      </Card>
    </div>
  )
}
