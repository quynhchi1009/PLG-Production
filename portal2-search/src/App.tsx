import { useEffect, useState } from 'react'
import { StateSwitcher } from './components/layout/StateSwitcher'
import { AnnouncementVideoPage } from './pages/AnnouncementVideoPage'
import { MCP_STATES, McpPage } from './pages/McpPage'
import { ORDER_STATES, OrderPage } from './pages/OrderPage'
import { REPORTS_STATES, ReportsPage } from './pages/ReportsPage'
import { REPORT_VIEW_STATES, ReportViewPage } from './pages/ReportViewPage'
import { SEARCH_STATES, SearchPage } from './pages/SearchPage'

interface Route {
  path: string
  params: URLSearchParams
}

/** Tiny hash router: `#/search`, `#/search/order?name=...`, `#/report` and `#/report/view?order=...` (no router dependency needed yet). */
function parseHash(): Route {
  const raw = window.location.hash.replace(/^#/, '') || '/search'
  const [path, query = ''] = raw.split('?')
  return { path, params: new URLSearchParams(query) }
}

export default function App() {
  const [route, setRoute] = useState<Route>(parseHash)

  useEffect(() => {
    const onChange = () => setRoute(parseHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const stateKey = route.params.get('state')
  const isOrder = route.path === '/search/order'
  const isReports = route.path === '/report'
  const isReportView = route.path === '/report/view'
  const isMcp = route.path === '/mcp'
  const isVideo = import.meta.env.DEV && route.path === '/announcement-video'
  // Re-key on the full hash so switching states remounts the page with its new seed.
  const pageKey = window.location.hash

  if (isVideo) return <AnnouncementVideoPage />

  return (
    <>
      {isMcp ? (
        <McpPage key={pageKey} stateKey={stateKey ?? undefined} />
      ) : isOrder ? (
        <OrderPage key={pageKey} params={route.params} />
      ) : isReportView ? (
        <ReportViewPage key={pageKey} params={route.params} />
      ) : isReports ? (
        <ReportsPage key={pageKey} stateKey={stateKey ?? undefined} />
      ) : (
        <SearchPage key={pageKey} stateKey={stateKey ?? undefined} />
      )}
      {import.meta.env.DEV && (
        <StateSwitcher
          base={
            isMcp
              ? '#/mcp'
              : isOrder
              ? `#/search/order?${stripState(route.params)}`
              : isReportView
                ? '#/report/view'
                : isReports
                  ? '#/report'
                  : '#/search'
          }
          states={
            isMcp ? MCP_STATES : isOrder ? ORDER_STATES : isReportView ? REPORT_VIEW_STATES : isReports ? REPORTS_STATES : SEARCH_STATES
          }
          current={stateKey}
        />
      )}
    </>
  )
}

function stripState(params: URLSearchParams) {
  const next = new URLSearchParams(params)
  next.delete('state')
  return next.toString()
}
