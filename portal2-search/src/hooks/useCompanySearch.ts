import { useCallback, useRef, useState } from 'react'
import { searchCompanies } from '../data/companies'
import type { Company, SearchStatus } from '../types'

const MIN_QUERY_LENGTH = 3
/** The portal returns results after a short wait; keep a small delay so the loading state is visible. */
const SEARCH_DELAY_MS = 700

export interface SearchSeed {
  jurisdiction?: string | null
  query?: string
  status?: SearchStatus
}

export function useCompanySearch(seed: SearchSeed = {}) {
  const [jurisdiction, setJurisdiction] = useState<string | null>(seed.jurisdiction ?? null)
  const [query, setQuery] = useState(seed.query ?? '')
  const [status, setStatus] = useState<SearchStatus>(seed.status ?? 'idle')
  const [results, setResults] = useState<Company[]>(() =>
    seed.status === 'results' ? searchCompanies(seed.query ?? '') : [],
  )
  const [submittedQuery, setSubmittedQuery] = useState(seed.query ?? '')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const timer = useRef<number>(undefined)

  const submit = useCallback(() => {
    window.clearTimeout(timer.current)
    const q = query.trim()
    if (q.length < MIN_QUERY_LENGTH) {
      setStatus('min-chars')
      return
    }
    if (!jurisdiction) {
      setStatus('jurisdiction-required')
      return
    }
    setStatus('loading')
    setSubmittedQuery(q)
    setPage(1)
    timer.current = window.setTimeout(() => {
      const found = searchCompanies(q)
      setResults(found)
      setStatus(found.length ? 'results' : 'no-results')
    }, SEARCH_DELAY_MS)
  }, [jurisdiction, query])

  const changeJurisdiction = useCallback((value: string | null) => {
    setJurisdiction(value)
    setStatus((s) => (s === 'jurisdiction-required' ? 'idle' : s))
  }, [])

  const changePageSize = useCallback((size: number) => {
    setPageSize(size)
    setPage(1)
  }, [])

  const pageRows = results.slice((page - 1) * pageSize, page * pageSize)

  return {
    jurisdiction,
    query,
    status,
    results,
    pageRows,
    submittedQuery,
    page,
    pageSize,
    setQuery,
    setJurisdiction: changeJurisdiction,
    setPage,
    setPageSize: changePageSize,
    submit,
  }
}
