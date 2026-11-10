import type { Jurisdiction } from '../../types'
import styles from './CompanyHeader.module.css'

interface CompanyHeaderProps {
  name: string
  regNo: string
  jurisdiction?: Jurisdiction
}

export function CompanyHeader({ name, regNo, jurisdiction }: CompanyHeaderProps) {
  return (
    <header className={styles.header}>
      <h2 className={styles.name}>
        <span>{name}</span>
        {jurisdiction && (
          <span
            className={`fi fi-${jurisdiction.code} ${styles.flag}`}
            role="img"
            aria-label={jurisdiction.name}
          />
        )}
      </h2>
      <p className={styles.reg}>
        <span>BUSINESS REGISTRATION NO.</span>
        <span>{regNo}</span>
      </p>
    </header>
  )
}
