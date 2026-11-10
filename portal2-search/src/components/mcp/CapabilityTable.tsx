import { CAPABILITY_HEADER, CAPABILITY_ROWS } from '../../data/mcp'
import styles from './CapabilityTable.module.css'

/** "What's included in the free MCP beta" — heading, intro line and a 3-column comparison. */
export function CapabilityTable() {
  return (
    <section className={styles.section} aria-labelledby="mcp-included-title">
      <h2 id="mcp-included-title" className={styles.heading}>
        What's included in the free MCP beta
      </h2>
      <p className={styles.sub}>Two tools - 14 jurisdictions - same registry data as our enterprise API.</p>
      <table className={styles.table}>
        <thead>
          <tr>
            {CAPABILITY_HEADER.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CAPABILITY_ROWS.map(([label, search, lite]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              <td data-label={CAPABILITY_HEADER[1]}>{search}</td>
              <td data-label={CAPABILITY_HEADER[2]}>{lite}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
