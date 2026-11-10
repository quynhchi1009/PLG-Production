import { McpAnnouncement } from '../components/announcement/McpAnnouncement'
import { AppShell } from '../components/layout/AppShell'
import { SearchPanel } from '../components/search/SearchPanel'
import { useAnnouncement } from '../hooks/useAnnouncement'
import { useCompanySearch, type SearchSeed } from '../hooks/useCompanySearch'
import type { Company } from '../types'

/** Pre-baked screen states, selectable with `#/search?state=<key>` for design/QA parity. */
export const SEARCH_STATES: Record<string, { label: string; seed: SearchSeed; open?: boolean; announce?: boolean }> = {
  empty: { label: 'Empty', seed: {} },
  dropdown: { label: 'Jurisdiction list open', seed: {}, open: true },
  filled: { label: 'Filled form', seed: { jurisdiction: 'sg', query: 'Tech' } },
  loading: { label: 'Searching', seed: { jurisdiction: 'sg', query: 'Tech', status: 'loading' } },
  results: { label: 'Results', seed: { jurisdiction: 'sg', query: 'Tech', status: 'results' } },
  'no-results': {
    label: 'No results',
    seed: { jurisdiction: 'sg', query: 'zzqxjwvk', status: 'no-results' },
  },
  'min-chars': { label: 'Query too short', seed: { status: 'min-chars' } },
  'jurisdiction-required': {
    label: 'Jurisdiction required',
    seed: { query: 'Tech', status: 'jurisdiction-required' },
  },
  announcement: { label: 'MCP announcement', seed: {}, announce: true },
}

interface SearchPageProps {
  stateKey?: string
}

export function SearchPage({ stateKey }: SearchPageProps) {
  const preset = stateKey ? SEARCH_STATES[stateKey] : undefined
  const search = useCompanySearch(preset?.seed)
  // Opens by itself on a plain visit to #/search until dismissed once; the "MCP announcement" state always opens it.
  const announcement = useAnnouncement({ auto: !stateKey, forced: !!preset?.announce })

  const openOrder = (company: Company) => {
    const params = new URLSearchParams({
      name: company.name,
      regNo: company.regNo,
      country: search.jurisdiction ?? 'sg',
    })
    window.location.hash = `#/search/order?${params.toString()}`
  }

  return (
    <AppShell title="Search for a business" activeNav="search">
      <SearchPanel
        status={search.status}
        jurisdiction={search.jurisdiction}
        query={search.query}
        submittedQuery={search.submittedQuery}
        pageRows={search.pageRows}
        total={search.results.length}
        page={search.page}
        pageSize={search.pageSize}
        jurisdictionOpen={preset?.open}
        onJurisdictionChange={search.setJurisdiction}
        onQueryChange={search.setQuery}
        onSubmit={search.submit}
        onView={openOrder}
        onPageChange={search.setPage}
      />
      {announcement.open && (
        <McpAnnouncement
          onDismiss={announcement.dismiss}
          onExplore={() => {
            announcement.dismiss()
            window.location.hash = '#/mcp'
          }}
        />
      )}
    </AppShell>
  )
}
