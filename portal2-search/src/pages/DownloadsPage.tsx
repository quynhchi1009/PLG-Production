import { useMemo, useState } from 'react'
import { DownloadStartedToast } from '../components/downloads/DownloadStartedToast'
import { DownloadsPanel, type DownloadRow } from '../components/downloads/DownloadsPanel'
import { AppShell } from '../components/layout/AppShell'
import { downloadStatus, loadDownloads, makeDownload, SEED_DOWNLOADS } from '../data/downloads'
import type { DownloadFilters, DownloadItem } from '../types/downloads'

/** Pre-baked states for `#/downloads?state=<key>`. */
export const DOWNLOADS_STATES: Record<string, { label: string }> = {
  results: { label: 'Results' },
  requested: { label: 'Download requested' },
}

const EMPTY: DownloadFilters = { status: [], type: [], jurisdiction: [] }

interface DownloadsPageProps {
  params: URLSearchParams
}

/**
 * Download Centre (`#/downloads`). The report viewer's Download sends users here with `?requested=<row id>`,
 * which shows the top-right notification and highlights the new row. Closing it drops the param, so a refresh only reloads the list.
 */
export function DownloadsPage({ params }: DownloadsPageProps) {
  const stateKey = params.get('state')
  // Read once per mount: status is derived from the load time, so "Processing" only flips on refresh, as the copy says.
  const [now] = useState(() => Date.now())
  const [items] = useState<DownloadItem[]>(() => {
    if (stateKey === 'requested') {
      const pending = makeDownload('order-1', now)
      return pending ? [pending, ...SEED_DOWNLOADS] : SEED_DOWNLOADS
    }
    if (stateKey === 'results') return SEED_DOWNLOADS
    return loadDownloads()
  })
  const requestedId = stateKey === 'requested' ? items[0]?.id : (params.get('requested') ?? undefined)
  const [toastOpen, setToastOpen] = useState(Boolean(requestedId))

  const [draft, setDraft] = useState<DownloadFilters>(EMPTY)
  const [applied, setApplied] = useState<DownloadFilters>(EMPTY)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filtered: DownloadRow[] = useMemo(
    () =>
      items
        .map((item) => ({ item, status: downloadStatus(item, now) }))
        .filter(
          ({ item, status }) =>
            (applied.status.length === 0 || applied.status.includes(status)) &&
            (applied.type.length === 0 || item.reportTypes.some((t) => applied.type.includes(t))) &&
            (applied.jurisdiction.length === 0 || applied.jurisdiction.includes(item.jurisdiction)),
        ),
    [items, applied, now],
  )

  const closeToast = () => {
    setToastOpen(false)
    if (params.has('requested')) window.history.replaceState(null, '', '#/downloads')
  }

  return (
    <AppShell title="Download Centre" activeNav="downloads">
      <DownloadsPanel
        rows={filtered.slice((page - 1) * pageSize, page * pageSize)}
        total={filtered.length}
        page={page}
        pageSize={pageSize}
        draft={draft}
        highlightId={requestedId}
        onDraftChange={(key, value) => setDraft((d) => ({ ...d, [key]: value }))}
        onApply={() => {
          setApplied(draft)
          setPage(1)
        }}
        onClear={() => {
          setDraft(EMPTY)
          setApplied(EMPTY)
          setPage(1)
        }}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
      />
      {toastOpen && <DownloadStartedToast onClose={closeToast} />}
    </AppShell>
  )
}
