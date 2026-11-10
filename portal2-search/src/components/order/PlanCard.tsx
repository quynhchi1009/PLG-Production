import type { ReactNode } from 'react'
import styles from './PlanCard.module.css'

interface PlanCardProps {
  title: string
  description?: string
  icon?: ReactNode
  checked: boolean
  onSelect: () => void
  onPreview?: () => void
}

/** Selectable report option (radio card) with an optional "Preview" link */
export function PlanCard({ title, description, icon, checked, onSelect, onPreview }: PlanCardProps) {
  return (
    <div
      role="radio"
      aria-checked={checked}
      tabIndex={0}
      className={[styles.card, checked && styles.checked].filter(Boolean).join(' ')}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          onSelect()
        }
      }}
    >
      <span className={styles.radio} aria-hidden>
        {checked && <span className={styles.dot} />}
      </span>
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        {description && (
          <p className={styles.description}>
            {icon}
            <span>{description}</span>
          </p>
        )}
      </div>
      <button
        type="button"
        className={styles.preview}
        onClick={(e) => {
          e.stopPropagation()
          onPreview?.()
        }}
      >
        Preview
      </button>
    </div>
  )
}
