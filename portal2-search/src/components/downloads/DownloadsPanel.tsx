import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { DOWNLOAD_STATUSES, EXPIRY_MS, formatDownloadDate } from '../../data/downloads'
import { JURISDICTIONS } from '../../data/jurisdictions'
import { REPORT_TYPES } from '../../data/orders'
import type { DownloadFilters, DownloadItem, DownloadStatus } from '../../types/downloads'
import { Card } from '../ui/Card'
import { DownloadFilter } from './DownloadFilter'
import styles from './DownloadsPanel.module.css'

export interface DownloadRow {
  item: DownloadItem
  status: DownloadStatus
}

interface DownloadsPanelProps {
  rows: DownloadRow[]
  total: number
  page: number
  pageSize: number
  draft: DownloadFilters
  /** Row id to highlight (the report that was just requested) */
  highlightId?: string
  onDraftChange: (key: keyof DownloadFilters, value: string[]) => void
  onApply: () => void
  onClear: () => void
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

const PAGE_SIZES = [10, 20, 50]
const STATUS_LABEL = Object.fromEntries(DOWNLOAD_STATUSES.map((s) => [s.value, s.label]))

function DateCell({ ms }: { ms: number }) {
  const { date, time } = formatDownloadDate(ms)
  return (
    <span className={styles.date}>
      {date}
      <br />
      {time}
    </span>
  )
}

/** Live "Go to" page box. Keyed on the page by the parent, so it resets when paging by button. */
function GoTo({ page, pageCount, onGo }: { page: number; pageCount: number; onGo: (page: number) => void }) {
  const [value, setValue] = useState(String(page))
  const jump = () => {
    const n = Math.min(pageCount, Math.max(1, Number(value) || 1))
    setValue(String(n))
    if (n !== page) onGo(n)
  }
  return (
    <label className={styles.goTo}>
      Go to
      <input
        inputMode="numeric"
        value={value}
        onChange={(e) => setValue(e.target.value.replace(/\D/g, ''))}
        onKeyDown={(e) => e.key === 'Enter' && jump()}
        onBlur={jump}
        aria-label="Go to page"
      />
    </label>
  )
}

/** Download Centre card, laid out as the live page: heading, filters with APPLY / CLEAR, table, pagination. */
export function DownloadsPanel(props: DownloadsPanelProps) {
  const { rows, total, page, pageSize, draft } = props
  const pageCount = Math.max(1, Math.ceil(total / pageSize))

  return (
    <Card className={styles.card}>
      <h2 className={styles.title}>View your downloaded reports</h2>
      <p className={styles.subtitle}>Your downloaded reports appear here.</p>

      <div className={styles.filters}>
        <span className={styles.filterLabel}>Filter By:</span>
        <DownloadFilter
          label="Status"
          options={DOWNLOAD_STATUSES}
          value={draft.status}
          onChange={(v) => props.onDraftChange('status', v)}
        />
        <DownloadFilter
          label="Report Type"
          options={REPORT_TYPES.map((t) => ({ value: t, label: t }))}
          value={draft.type}
          onChange={(v) => props.onDraftChange('type', v)}
        />
        <DownloadFilter
          label="Jurisdiction"
          options={JURISDICTIONS.map((j) => ({ value: j.id, label: j.name }))}
          value={draft.jurisdiction}
          onChange={(v) => props.onDraftChange('jurisdiction', v)}
        />
        <span className={styles.spacer} />
        <button type="button" className={styles.textButton} onClick={props.onApply}>
          Apply
        </button>
        <button type="button" className={styles.textButton} onClick={props.onClear}>
          Clear
        </button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.colDate}>Date</th>
              <th>Report details</th>
              <th className={styles.colStatus}>Status</th>
              <th className={styles.colExpiry}>Expiry date</th>
            </tr>
          </thead>
          <tbody aria-live="polite">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className={styles.empty}>
                  No downloaded reports match these filters.
                </td>
              </tr>
            ) : (
              rows.map(({ item, status }) => {
                const jurisdiction = JURISDICTIONS.find((j) => j.id === item.jurisdiction)?.name ?? item.jurisdiction
                return (
                  <tr key={item.id} className={item.id === props.highlightId ? styles.highlight : undefined}>
                    <td>
                      <DateCell ms={item.requestedAt} />
                    </td>
                    <td>
                      <p className={styles.business}>{item.businessName}</p>
                      <p className={styles.orderNo}>Order No. {item.orderNo}</p>
                      <span className={styles.pill}>
                        {[jurisdiction, item.reportTypes.join(', '), item.language].join(' · ')}
                      </span>
                    </td>
                    <td>
                      <span className={status === 'processing' ? styles.processing : undefined}>
                        {STATUS_LABEL[status]}
                      </span>
                    </td>
                    <td>
                      <DateCell ms={item.requestedAt + EXPIRY_MS} />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <label className={styles.pageSize}>
          <span className={styles.srOnly}>Rows per page</span>
          <select value={pageSize} onChange={(e) => props.onPageSizeChange(Number(e.target.value))}>
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}/page
              </option>
            ))}
          </select>
          <ChevronDown size={14} aria-hidden />
        </label>
        <span>Total {total}</span>
        <button
          type="button"
          className={styles.pageArrow}
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => props.onPageChange(page - 1)}
        >
          <ChevronLeft size={14} />
        </button>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            className={[styles.pageNum, n === page && styles.pageActive].filter(Boolean).join(' ')}
            aria-current={n === page ? 'page' : undefined}
            onClick={() => props.onPageChange(n)}
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          className={styles.pageArrow}
          aria-label="Next page"
          disabled={page >= pageCount}
          onClick={() => props.onPageChange(page + 1)}
        >
          <ChevronRight size={14} />
        </button>
        <GoTo key={page} page={page} pageCount={pageCount} onGo={props.onPageChange} />
      </div>
    </Card>
  )
}
