import type { ReportDoc, ReportDocKind } from '../../types/reportView'
import styles from './DocTabs.module.css'

interface DocTabsProps {
  docs: ReportDoc[]
  active: ReportDocKind
  onSelect: (kind: ReportDocKind) => void
}

/** "View Report(s):" – one pill per document in the order (KYB, UBO, Legal Documents, AML, Monitoring). */
export function DocTabs({ docs, active, onSelect }: DocTabsProps) {
  return (
    <div className={styles.row}>
      <span id="view-reports-label" className={styles.label}>
        View Report(s):
      </span>
      <div role="tablist" aria-labelledby="view-reports-label" className={styles.tabs}>
        {docs.map((d) => (
          <button
            key={d.kind}
            type="button"
            role="tab"
            aria-selected={d.kind === active}
            className={[styles.tab, d.kind === active && styles.active].filter(Boolean).join(' ')}
            onClick={() => onSelect(d.kind)}
          >
            {d.label}
          </button>
        ))}
      </div>
    </div>
  )
}
