import { FileText } from 'lucide-react'
import styles from './NotificationsPopover.module.css'

interface Notification {
  title: string
  company: string
  message: string
  time: string
}

/** Fictional sample notifications; the real portal lists the user's own report activity. */
const SAMPLE: Notification[] = [
  {
    title: 'COMPLETE Report (#20260000000000000001) - COMPLETED',
    company: 'ORCHID TECH PTE. LTD.',
    message: 'Report is done processing. Click here to view your generated report.',
    time: '28/Oct/2026 10:13AM',
  },
  {
    title: 'COMPLETE Report (#20260000000000000001) - PROCESSING',
    company: 'ORCHID TECH PTE. LTD.',
    message: 'Your report is processing.',
    time: '28/Oct/2026 10:10AM',
  },
  {
    title: 'AML Report (#20260000000000000002) - COMPLETED',
    company: 'HARBOUR MARINE PTE. LTD.',
    message: 'Report is done processing. Click here to view your generated report.',
    time: '26/Oct/2026 2:27PM',
  },
]

export function NotificationsPopover() {
  return (
    <div className={styles.popover} role="dialog" aria-label="Notifications">
      <header className={styles.header}>
        <strong>Notifications</strong>
        <div className={styles.actions}>
          <button type="button">Refresh</button>
          <button type="button">Clear All</button>
        </div>
      </header>
      <ul className={styles.list}>
        {SAMPLE.map((n) => (
          <li key={n.title} className={styles.item}>
            <FileText size={20} className={styles.icon} />
            <div>
              <p className={styles.itemTitle}>{n.title}</p>
              <p className={styles.company}>{n.company}</p>
              <p className={styles.message}>{n.message}</p>
              <p className={styles.time}>{n.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
