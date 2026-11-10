import type { OrderStatus } from '../../types/reports'
import { StatusLabel } from '../reports/StatusLabel'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import type { ReportDoc, ReportDocKind, ReportPage, ViewerOrder } from '../../types/reportView'
import { DocTabs } from './DocTabs'
import { JumpNav } from './JumpNav'
import { PageContent } from './PageContent'
import { ViewerToolbar } from './ViewerToolbar'
import styles from './ReportViewPanel.module.css'

interface ReportViewPanelProps {
  viewer: ViewerOrder
  doc?: ReportDoc
  page?: ReportPage
  pageIndex: number
  total: number
  recommendation: string | null
  onSelectDoc: (kind: ReportDocKind) => void
  onGoTo: (index: number) => void
  onRecommend: (id: string) => void
}

const UNAVAILABLE: Partial<Record<OrderStatus, { title: string; text: string }>> = {
  unfulfilled: {
    title: 'This report could not be fulfilled',
    text: 'There is no report to view for this order.',
  },
  cancelled: {
    title: 'This order was cancelled',
    text: 'There is no report to view for this order.',
  },
  'not-found': {
    title: 'No matching business was found',
    text: 'The registry did not return a business for this registration number.',
  },
}

/** The report itself, or – when the order has none yet – the reason why. */
export function ReportViewPanel(props: ReportViewPanelProps) {
  const { viewer, doc, page } = props

  if (viewer.state !== 'ready' || !doc || !page) {
    const msg =
      viewer.state === 'processing'
        ? { title: 'Your report is being prepared', text: 'It will appear here as soon as it is ready.' }
        : UNAVAILABLE[viewer.order.status] ?? { title: 'No report available', text: 'There is no report to view for this order.' }
    return (
      <Card className={styles.message}>
        <StatusLabel status={viewer.order.status} />
        <h3 className={styles.messageTitle}>{msg.title}</h3>
        <p>{msg.text}</p>
        <Button variant="outline" onClick={() => (window.location.hash = '#/report')}>
          Back to reports
        </Button>
      </Card>
    )
  }

  return (
    <div className={styles.panel}>
      <DocTabs docs={viewer.docs} active={doc.kind} onSelect={props.onSelectDoc} />
      <Card className={styles.viewer}>
        <ViewerToolbar pageIndex={props.pageIndex} total={props.total} onGoTo={props.onGoTo} />
        <div className={styles.body}>
          <JumpNav
            doc={doc}
            pageIndex={props.pageIndex}
            recommendation={props.recommendation}
            onSelect={props.onGoTo}
            onRecommend={props.onRecommend}
          />
          <div className={styles.content}>
            <PageContent key={`${doc.kind}-${page.id}`} page={page} />
          </div>
        </div>
      </Card>
    </div>
  )
}
