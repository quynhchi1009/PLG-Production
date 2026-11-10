import type { ReactNode } from 'react'
import styles from './FieldBlock.module.css'

interface FieldBlockProps {
  label: string
  help?: string
  required?: boolean
  children: ReactNode
}

/** Bold label + helper line + control, used by the add-ons and UBO options */
export function FieldBlock({ label, help, required, children }: FieldBlockProps) {
  return (
    <div className={styles.block}>
      <p className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </p>
      {help && <p className={styles.help}>{help}</p>}
      {children}
    </div>
  )
}
