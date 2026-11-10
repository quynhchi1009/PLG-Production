import { FileText } from 'lucide-react'
import { KYB_PLANS } from '../../data/reports'
import type { OrderConfig } from '../../types/order'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import styles from './ReportSummary.module.css'

interface ReportSummaryProps {
  config: OrderConfig
  language?: string
  onGenerate: () => void
  onAddToCart: () => void
}

function describeAddOns(config: OrderConfig): string[] {
  const lines: string[] = []
  if (config.aml.enabled && config.aml.matchType) lines.push(`AML (${config.aml.matchType})`)
  if (config.monitoring.enabled) {
    lines.push(
      config.monitoring.frequency
        ? `Monitoring (${config.monitoring.frequency})`
        : 'Monitoring',
    )
  }
  return lines
}

/** Sticky "Your Report" card: what will be ordered, plus the two order actions */
export function ReportSummary({
  config,
  language = 'ENGLISH',
  onGenerate,
  onAddToCart,
}: ReportSummaryProps) {
  const reportType =
    config.kind === 'UBO' ? 'UBO' : (KYB_PLANS.find((p) => p.id === config.plan)?.label ?? '')
  const addOns = config.kind === 'KYB' ? describeAddOns(config) : []

  return (
    <Card className={styles.card}>
      <div className={styles.head}>
        <div>
          <h3 className={styles.title}>Your Report</h3>
          <p className={styles.sub}>View your selected reports below.</p>
        </div>
        <FileText size={40} strokeWidth={1.5} aria-hidden />
      </div>

      <dl className={styles.list}>
        <div className={styles.item}>
          <dt>Report Type:</dt>
          <dd>{reportType}</dd>
        </div>
        <div className={styles.item}>
          <dt>Language:</dt>
          <dd>{language}</dd>
        </div>
        {addOns.length > 0 && (
          <div className={`${styles.item} ${styles.addOns}`}>
            <dt>Add-Ons:</dt>
            <dd>
              {addOns.map((a) => (
                <span key={a}>{a}</span>
              ))}
            </dd>
          </div>
        )}
      </dl>

      <div className={styles.actions}>
        <Button block onClick={onGenerate}>
          GENERATE REPORT
        </Button>
        <Button block variant="secondary" onClick={onAddToCart}>
          ADD TO CART
        </Button>
      </div>
    </Card>
  )
}
