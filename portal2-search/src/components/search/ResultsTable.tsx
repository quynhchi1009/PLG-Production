import type { Company } from '../../types'
import { Button } from '../ui/Button'
import { Pagination } from '../ui/Pagination'
import styles from './ResultsTable.module.css'

interface ResultsTableProps {
  heading: string
  rows: Company[]
  total: number
  page: number
  pageSize: number
  onView: (company: Company) => void
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
}

export function ResultsTable({
  heading,
  rows,
  total,
  page,
  pageSize,
  onView,
  onPageChange,
}: ResultsTableProps) {
  return (
    <section className={styles.section} aria-label="Search results">
      <h2 className={styles.heading}>{heading}</h2>
      <div className={styles.table}>
        <table>
          <thead>
            <tr>
              <th>Business Name</th>
              <th>Registration No.</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.regNo}>
                <td>{c.name}</td>
                <td>{c.regNo}</td>
                <td>
                  <Button variant="link" size="sm" onClick={() => onView(c)}>
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </section>
  )
}
