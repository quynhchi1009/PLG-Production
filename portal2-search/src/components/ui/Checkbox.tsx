import { Check, Minus } from 'lucide-react'
import styles from './Checkbox.module.css'

interface CheckboxProps {
  /** Lets a separate `<label htmlFor>` toggle the box (the box's own label wraps only the input). */
  id?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  /** Some, not all, of a group is selected; shows a dash */
  indeterminate?: boolean
  'aria-label': string
}

export function Checkbox({ id, checked, onChange, disabled, indeterminate, 'aria-label': ariaLabel }: CheckboxProps) {
  return (
    <label className={[styles.box, disabled && styles.disabled].filter(Boolean).join(' ')}>
      <input
        id={id}
        type="checkbox"
        className={styles.native}
        checked={checked}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={[styles.inner, (checked || indeterminate) && styles.checked].filter(Boolean).join(' ')}>
        {indeterminate && !checked ? (
          <Minus size={14} strokeWidth={3} aria-hidden />
        ) : (
          checked && <Check size={14} strokeWidth={3} aria-hidden />
        )}
      </span>
    </label>
  )
}
