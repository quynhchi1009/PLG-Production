import type { InputHTMLAttributes, ReactNode } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import styles from './TextField.module.css'

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string
  onChange: (value: string) => void
  leading?: ReactNode
  clearable?: boolean
  invalid?: boolean
  /** Show the green "filled" tick the portal renders on completed fields */
  showFilledTick?: boolean
}

export function TextField({
  value,
  onChange,
  leading,
  clearable,
  invalid,
  showFilledTick,
  disabled,
  className,
  ...rest
}: TextFieldProps) {
  const filled = value.length > 0
  const cls = [styles.wrapper, invalid && styles.invalid, disabled && styles.disabled, className]
    .filter(Boolean)
    .join(' ')
  return (
    <div className={cls}>
      {leading && <span className={styles.prefix}>{leading}</span>}
      <input
        className={styles.input}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
      {clearable && filled && !disabled && (
        <button
          type="button"
          className={styles.iconBtn}
          aria-label="Clear"
          onClick={() => onChange('')}
        >
          <XCircle size={16} />
        </button>
      )}
      {showFilledTick && filled && <CheckCircle2 size={16} className={styles.tick} aria-hidden />}
    </div>
  )
}
