import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { JURISDICTIONS } from '../../data/jurisdictions'
import { canAddAml } from '../../data/orders'
import type { ReportOrder, SortDir, SortKey } from '../../types/reports'
import { Button } from '../ui/Button'
import { Checkbox } from '../ui/Checkbox'
import { StatusLabel } from './StatusLabel'
import styles from './ReportsTable.module.css'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatDate(iso: string) {
  const d = new Date(iso)
  const h = d.getHours()
  const time = `${String(h % 12 || 12).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}${h < 12 ? 'AM' : 'PM'}`
  return {
    day: `${String(d.getDate()).padStart(2, '0')}/${MONTHS[d.getMonth()]}/${d.getFullYear()}`,
    time,
  }
}

interface ReportsTableProps {
  rows: ReportOrder[]
  loading?: boolean
  sort: { key: SortKey; dir: SortDir }
  selected: Set<string>
  onSort: (key: SortKey) => void
  onToggleRow: (id: string) => void
  onTogglePage: (check: boolean) => void
  onView: (order: ReportOrder) => void
  onAddAml: (order: ReportOrder) => void
}

export function ReportsTable({
  rows,
  loading,
  sort,
  selected,
  onSort,
  onToggleRow,
  onTogglePage,
  onView,
  onAddAml,
}: ReportsTableProps) {
  const selectedOnPage = rows.filter((r) => selected.has(r.id)).length
  const allSelected = rows.length > 0 && selectedOnPage === rows.length

  const sortable = (key: SortKey, label: string) => {
    const active = sort.key === key
    const Icon = !active ? ArrowUpDown : sort.dir === 'asc' ? ArrowUp : ArrowDown
    return (
      <button type="button" className={styles.sort} onClick={() => onSort(key)}>
        {label}
        <Icon size={14} aria-hidden />
      </button>
    )
  }
  const ariaSort = (key: SortKey) =>
    sort.key === key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'

  return (
    <div className={styles.wrap}>
      <table className={styles.table} aria-busy={loading || undefined}>
        <colgroup>
          <col className={styles.cCheck} />
          <col className={styles.cDate} />
          <col className={styles.cOrder} />
          <col />
          <col className={styles.cJur} />
          <col className={styles.cType} />
          <col className={styles.cStatus} />
          <col className={styles.cAction} />
        </colgroup>
        <thead>
          <tr>
            <th className={styles.check}>
              <Checkbox
                checked={allSelected}
                indeterminate={selectedOnPage > 0 && !allSelected}
                disabled={loading || rows.length === 0}
                onChange={onTogglePage}
                aria-label="Select all reports on this page"
              />
            </th>
            <th aria-sort={ariaSort('date')}>{sortable('date', 'Date')}</th>
            <th>Order no.</th>
            <th aria-sort={ariaSort('name')}>{sortable('name', 'Business')}</th>
            <th>Jurisdiction</th>
            <th>Report type</th>
            <th>Status</th>
            <th className={styles.actionHead}>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 6 }, (_, i) => (
                <tr key={i} className={styles.skeletonRow} aria-hidden>
                  {Array.from({ length: 8 }, (_, c) => (
                    <td key={c}>{c > 0 && <span className={styles.bar} />}</td>
                  ))}
                </tr>
              ))
            : rows.map((o) => {
                const jur = JURISDICTIONS.find((j) => j.id === o.jurisdiction)
                const { day, time } = formatDate(o.placedAt)
                const isSelected = selected.has(o.id)
                return (
                  <tr key={o.id} className={isSelected ? styles.selectedRow : undefined}>
                    <td className={styles.check}>
                      <Checkbox
                        checked={isSelected}
                        onChange={() => onToggleRow(o.id)}
                        aria-label={`Select order ${o.orderNo}`}
                      />
                    </td>
                    <td>
                      <span className={styles.strong}>{day}</span>
                      <span className={styles.sub}>{time}</span>
                    </td>
                    <td className={styles.mono}>{o.orderNo}</td>
                    <td>
                      <span className={styles.strong}>{o.businessName}</span>
                      <span className={styles.sub}>{o.regNo}</span>
                    </td>
                    <td>
                      <span className={styles.jur}>
                        {jur && <span className={`fi fi-${jur.code} ${styles.flag}`} aria-hidden />}
                        {jur?.name}
                      </span>
                    </td>
                    <td>{o.reportTypes.join(', ')}</td>
                    <td>
                      <StatusLabel status={o.status} />
                    </td>
                    <td className={styles.actions}>
                      {canAddAml(o) && (
                        <Button variant="link" onClick={() => onAddAml(o)}>
                          Add AML
                        </Button>
                      )}
                      <Button variant="link" onClick={() => onView(o)}>
                        View
                      </Button>
                    </td>
                  </tr>
                )
              })}
        </tbody>
      </table>
    </div>
  )
}
