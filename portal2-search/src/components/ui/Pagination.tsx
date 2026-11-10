import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import styles from './Pagination.module.css'

interface PaginationProps {
  total: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
}

/** Library "Pagination": range text plus first / previous / next / last controls */
export function Pagination({ total, page, pageSize, onPageChange }: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(total, page * pageSize)
  const controls = [
    { label: 'First page', icon: <ChevronsLeft size={16} />, to: 1, disabled: page <= 1 },
    { label: 'Previous page', icon: <ChevronLeft size={16} />, to: page - 1, disabled: page <= 1 },
    { label: 'Next page', icon: <ChevronRight size={16} />, to: page + 1, disabled: page >= pageCount },
    { label: 'Last page', icon: <ChevronsRight size={16} />, to: pageCount, disabled: page >= pageCount },
  ]
  return (
    <div className={styles.pagination}>
      <span className={styles.range}>
        {start} - {end} of {total}
      </span>
      <div className={styles.controls}>
        {controls.map((c) => (
          <button
            key={c.label}
            type="button"
            className={styles.control}
            aria-label={c.label}
            disabled={c.disabled}
            onClick={() => onPageChange(c.to)}
          >
            {c.icon}
          </button>
        ))}
      </div>
    </div>
  )
}
