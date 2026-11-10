import type { ReactNode } from 'react'
import styles from './SectionTitle.module.css'

/** 20px bold section heading used inside the configurator card */
export function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className={styles.title}>{children}</h3>
}
