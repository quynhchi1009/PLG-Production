import type { ReactNode } from 'react'
import { Checkbox } from '../ui/Checkbox'
import styles from './AddOnItem.module.css'

interface AddOnItemProps {
  title: string
  /** One-line explanation, always visible */
  description: ReactNode
  checked: boolean
  /** Locked add-ons are bundled by the selected plan */
  disabled?: boolean
  onChange: (checked: boolean) => void
  /** Configuration controls; only shown once the add-on is ticked */
  children?: ReactNode
}

/** One row in "Add-ons": checkbox, title and description; its fields appear only when ticked. */
export function AddOnItem({ title, description, checked, disabled, onChange, children }: AddOnItemProps) {
  return (
    <div className={[styles.item, disabled && styles.disabled].filter(Boolean).join(' ')}>
      <Checkbox checked={checked} disabled={disabled} onChange={onChange} aria-label={title} />
      <div className={styles.body}>
        <p className={styles.title}>{title}</p>
        <div className={styles.description}>{description}</div>
        {disabled && <p className={styles.note}>Included in KYB COMPLETE</p>}
        {checked && !disabled && children}
      </div>
    </div>
  )
}
