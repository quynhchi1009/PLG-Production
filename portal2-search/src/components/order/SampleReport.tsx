import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import styles from './SampleReport.module.css'

const ROWS: [string, string][] = [
  ['Company Name', 'SAMPLE HOLDINGS PTE. LTD.'],
  ['Registration No.', '202400000A'],
  ['Incorporation Date', '01/01/2020'],
  ['Company Status', 'Live'],
  ['Registered Address', '1 Example Street, Singapore'],
]

/**
 * Reference material, not part of the decision path: collapsed by default so it
 * does not outweigh the plan and add-on choices above it.
 */
export function SampleReport({ title }: { title: string }) {
  const [open, setOpen] = useState(false)
  return (
    <section>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={styles.title}>{`Sample (${title})`}</span>
        <ChevronDown size={20} className={open ? styles.up : undefined} aria-hidden />
      </button>
      {open && (
        <div className={styles.stage}>
          <div className={styles.page} aria-label={`${title} sample preview`}>
            <p className={styles.bar}>Company Information</p>
            <table>
              <tbody>
                {ROWS.map(([label, value]) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}
