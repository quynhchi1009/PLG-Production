import { useMemo, useState } from 'react'
import { ORDERS, inQuickRange } from '../data/orders'
import type { ReportFilters, ReportOrder, ReportsViewStatus, SortDir, SortKey } from '../types/reports'

export const NO_FILTERS: ReportFilters = { status: [], type: [], jurisdiction: [], range: null }

export interface ReportsSeed {
  query?: string
  filters?: Partial<ReportFilters>
  from?: string
  to?: string
  selected?: string[]
  status?: ReportsViewStatus
  /** Simulate an account with no orders at all */
  noOrders?: boolean
}

const PAGE_SIZE = 10

/** Client-side filter / sort / paginate / select over the mock order history. */
export function useReports(seed: ReportsSeed = {}) {
  const [query, setQuery] = useState(seed.query ?? '')
  const [submittedQuery, setSubmittedQuery] = useState(seed.query ?? '')
  const [filters, setFilters] = useState<ReportFilters>({ ...NO_FILTERS, ...seed.filters })
  const [from, setFromRaw] = useState(seed.from ?? '')
  const [to, setToRaw] = useState(seed.to ?? '')
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'date', dir: 'desc' })
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set(seed.selected))

  const all = seed.noOrders ? [] : ORDERS

  const filtered = useMemo(() => {
    const q = submittedQuery.trim().toLowerCase()
    const rows = all.filter((o) => {
      if (q && ![o.businessName, o.regNo, o.orderNo].some((v) => v.toLowerCase().includes(q))) return false
      if (filters.status.length && !filters.status.includes(o.status)) return false
      if (filters.jurisdiction.length && !filters.jurisdiction.includes(o.jurisdiction)) return false
      if (filters.type.length && !o.reportTypes.some((t) => filters.type.includes(t))) return false
      if (filters.range && !inQuickRange(o.placedAt, filters.range)) return false
      const day = o.placedAt.slice(0, 10)
      if (from && day < from) return false
      if (to && day > to) return false
      return true
    })
    const dir = sort.dir === 'asc' ? 1 : -1
    return [...rows].sort((a, b) =>
      sort.key === 'date'
        ? dir * a.placedAt.localeCompare(b.placedAt)
        : dir * a.businessName.localeCompare(b.businessName),
    )
  }, [all, submittedQuery, filters, from, to, sort])

  const pageRows: ReportOrder[] = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const activeFilterCount =
    filters.status.length + filters.type.length + filters.jurisdiction.length +
    (filters.range ? 1 : 0) + (from || to ? 1 : 0)

  const reset = <T,>(set: (v: T) => void) => (v: T) => {
    set(v)
    setPage(1)
  }

  return {
    query,
    setQuery,
    submit: () => {
      setSubmittedQuery(query)
      setPage(1)
    },
    filters,
    setFilter: <K extends keyof ReportFilters>(key: K, value: ReportFilters[K]) => {
      setFilters((f) => ({ ...f, [key]: value }))
      setPage(1)
    },
    from,
    to,
    setFrom: reset(setFromRaw),
    setTo: reset(setToRaw),
    clearFilters: () => {
      setFilters(NO_FILTERS)
      setFromRaw('')
      setToRaw('')
      setPage(1)
    },
    activeFilterCount,
    sort,
    toggleSort: (key: SortKey) =>
      setSort((s) => ({ key, dir: s.key === key && s.dir === 'desc' ? 'asc' : 'desc' })),
    page,
    setPage,
    pageSize: PAGE_SIZE,
    total: filtered.length,
    hasOrders: all.length > 0,
    pageRows,
    selected,
    toggleRow: (id: string) =>
      setSelected((s) => {
        const next = new Set(s)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      }),
    togglePage: (check: boolean) =>
      setSelected((s) => {
        const next = new Set(s)
        pageRows.forEach((r) => (check ? next.add(r.id) : next.delete(r.id)))
        return next
      }),
    clearSelection: () => setSelected(new Set()),
  }
}
