import type { ReactNode } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download, Share2 } from 'lucide-react'
import styles from './ViewerToolbar.module.css'

interface ViewerToolbarProps {
  /** 0-based */
  pageIndex: number
  total: number
  onGoTo: (index: number) => void
}

function IconButton({ label, disabled, onClick, children }: { label: string; disabled?: boolean; onClick?: () => void; children: ReactNode }) {
  return (
    <button type="button" className={styles.btn} aria-label={label} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}

/** Page indicator and paging for the open report, then share and download for the whole report. */
export function ViewerToolbar({ pageIndex, total, onGoTo }: ViewerToolbarProps) {
  const first = pageIndex <= 0
  const last = pageIndex >= total - 1
  return (
    <div className={styles.toolbar}>
      <p className={styles.indicator} aria-live="polite">
        Page {pageIndex + 1} of {total}
      </p>
      <div className={styles.group} role="group" aria-label="Page navigation">
        <IconButton label="First page" disabled={first} onClick={() => onGoTo(0)}>
          <ChevronsLeft size={18} />
        </IconButton>
        <IconButton label="Previous page" disabled={first} onClick={() => onGoTo(pageIndex - 1)}>
          <ChevronLeft size={18} />
        </IconButton>
        <IconButton label="Next page" disabled={last} onClick={() => onGoTo(pageIndex + 1)}>
          <ChevronRight size={18} />
        </IconButton>
        <IconButton label="Last page" disabled={last} onClick={() => onGoTo(total - 1)}>
          <ChevronsRight size={18} />
        </IconButton>
      </div>
      <span className={styles.rule} aria-hidden />
      <div className={styles.group}>
        <IconButton label="Share report">
          <Share2 size={22} />
        </IconButton>
        <IconButton label="Download report">
          <Download size={22} />
        </IconButton>
      </div>
    </div>
  )
}
