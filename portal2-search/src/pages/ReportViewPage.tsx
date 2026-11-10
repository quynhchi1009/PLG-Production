import { AppShell } from '../components/layout/AppShell'
import { CompanyHeader } from '../components/order/CompanyHeader'
import { ReportViewPanel } from '../components/reportview/ReportViewPanel'
import { JURISDICTIONS } from '../data/jurisdictions'
import { useReportViewer, type ReportViewerSeed } from '../hooks/useReportViewer'
import { viewerOrder } from '../data/reportView'
import type { ReportDocKind } from '../types/reportView'
import styles from './ReportViewPage.module.css'

interface ViewState {
  label: string
  order: string
  seed: ReportViewerSeed
}

/**
 * Pre-baked states for `#/report/view?state=<key>`: one per report type, each on an order whose
 * products produce it, plus the two no-report states (design/QA parity with the Figma frames).
 */
export const REPORT_VIEW_STATES: Record<string, ViewState> = {
  advance: { label: 'KYB Advance', order: 'order-5', seed: { page: 2 } },
  'advance-table': { label: 'KYB Advance · table', order: 'order-5', seed: { page: 8, recommendation: 'review' } },
  complete: { label: 'KYB Complete', order: 'order-1', seed: { page: 1 } },
  lite: { label: 'KYB Lite', order: 'order-8', seed: { page: 2 } },
  basic: { label: 'KYB Basic', order: 'order-13', seed: { page: 7 } },
  'basic-plus': { label: 'KYB Basic Plus', order: 'order-7', seed: { page: 2 } },
  ubo: { label: 'UBO', order: 'order-4', seed: { page: 3 } },
  legal: { label: 'Legal Documents', order: 'order-17', seed: { page: 2 } },
  aml: { label: 'AML', order: 'order-2', seed: { doc: 'aml', page: 2 } },
  monitoring: { label: 'Monitoring', order: 'order-7', seed: { doc: 'monitoring', page: 2 } },
  processing: { label: 'Processing', order: 'order-3', seed: {} },
  unavailable: { label: 'Unavailable', order: 'order-6', seed: {} },
}

interface ReportViewPageProps {
  params: URLSearchParams
}

export function ReportViewPage({ params }: ReportViewPageProps) {
  const preset = REPORT_VIEW_STATES[params.get('state') ?? '']
  const orderId = preset?.order ?? params.get('order') ?? 'order-5'
  const seed: ReportViewerSeed = preset?.seed ?? {
    doc: (params.get('doc') as ReportDocKind | null) ?? undefined,
    page: Number(params.get('page')) || undefined,
  }
  const v = useReportViewer(orderId, seed)
  const order = viewerOrder(orderId)?.order
  const jurisdiction = JURISDICTIONS.find((j) => j.id === order?.jurisdiction)

  return (
    <AppShell title="View report" activeNav="reports">
      <div className={styles.page}>
        {order && v.viewer ? (
          <>
            <CompanyHeader name={`${order.businessName} CO. LIMITED`} regNo={order.regNo} jurisdiction={jurisdiction} />
            <ReportViewPanel
              viewer={v.viewer}
              doc={v.doc}
              page={v.page}
              pageIndex={v.pageIndex}
              total={v.total}
              recommendation={v.recommendation}
              onSelectDoc={v.selectDoc}
              onGoTo={v.goTo}
              onRecommend={v.toggleRecommendation}
            />
          </>
        ) : (
          <p className={styles.missing}>We couldn’t find that report. Go back to <a href="#/report">your reports</a>.</p>
        )}
      </div>
    </AppShell>
  )
}
