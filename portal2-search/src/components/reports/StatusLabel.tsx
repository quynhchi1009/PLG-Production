import { ORDER_STATUSES } from '../../data/orders'
import type { OrderStatus } from '../../types/reports'
import styles from './StatusLabel.module.css'

const TONE: Record<OrderStatus, string> = {
  completed: styles.positive,
  active: styles.positive,
  processing: styles.neutral,
  'not-found': styles.muted,
  unfulfilled: styles.negative,
  cancelled: styles.negative,
}

/** Status as a dot plus words: the colour supports the text, never replaces it. */
export function StatusLabel({ status }: { status: OrderStatus }) {
  const label = ORDER_STATUSES.find((s) => s.value === status)?.label ?? status
  return (
    <span className={styles.status}>
      <span className={[styles.dot, TONE[status]].join(' ')} aria-hidden />
      {label}
    </span>
  )
}
