import { JURISDICTIONS } from '../../data/jurisdictions'
import type { Company, SearchStatus } from '../../types'
import { Card } from '../ui/Card'
import { ResultsTable } from './ResultsTable'
import { SearchForm } from './SearchForm'
import { SearchHeader } from './SearchHeader'
import { SearchMessage } from './SearchMessage'
import styles from './SearchPanel.module.css'

interface SearchPanelProps {
  status: SearchStatus
  jurisdiction: string | null
  query: string
  submittedQuery: string
  pageRows: Company[]
  total: number
  page: number
  pageSize: number
  jurisdictionOpen?: boolean
  onJurisdictionChange: (value: string | null) => void
  onQueryChange: (value: string) => void
  onSubmit: () => void
  onView: (company: Company) => void
  onPageChange: (page: number) => void
}

const JURISDICTION_ERROR = '*Please select a jurisdiction before entering the business name.'

/**
 * Two surfaces: the search criteria (header, form, input guidance) and, once a search
 * has run, a separate results surface with its own heading.
 */
export function SearchPanel({
  status,
  jurisdiction,
  query,
  submittedQuery,
  pageRows,
  total,
  page,
  pageSize,
  jurisdictionOpen,
  onJurisdictionChange,
  onQueryChange,
  onSubmit,
  onView,
  onPageChange,
}: SearchPanelProps) {
  const jurisdictionName = JURISDICTIONS.find((j) => j.id === jurisdiction)?.name

  return (
    <div className={styles.panel}>
      <Card className={styles.card}>
        <SearchHeader error={status === 'jurisdiction-required' ? JURISDICTION_ERROR : undefined} />
        <SearchForm
          jurisdiction={jurisdiction}
          query={query}
          loading={status === 'loading'}
          jurisdictionInvalid={status === 'jurisdiction-required'}
          jurisdictionOpen={jurisdictionOpen}
          onJurisdictionChange={onJurisdictionChange}
          onQueryChange={onQueryChange}
          onSubmit={onSubmit}
        />
        {status === 'min-chars' && <SearchMessage variant="min-chars" />}
      </Card>

      {status === 'no-results' && (
        <Card className={styles.card}>
          <SearchMessage variant="no-results" query={submittedQuery} />
        </Card>
      )}
      {status === 'results' && (
        <Card className={styles.card}>
          <ResultsTable
            heading={`${total} results for “${submittedQuery}”${jurisdictionName ? ` in ${jurisdictionName}` : ''}`}
            rows={pageRows}
            total={total}
            page={page}
            pageSize={pageSize}
            onView={onView}
            onPageChange={onPageChange}
          />
        </Card>
      )}
    </div>
  )
}
