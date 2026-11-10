import styles from './RadioPill.module.css'

interface RadioPillOption<T extends string> {
  value: T
  label: string
}

interface RadioPillGroupProps<T extends string> {
  options: RadioPillOption<T>[]
  value: T
  onChange: (value: T) => void
  'aria-label': string
}

/** Rounded pill toggle (KYB / UBO) */
export function RadioPillGroup<T extends string>({
  options,
  value,
  onChange,
  'aria-label': ariaLabel,
}: RadioPillGroupProps<T>) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className={styles.group}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          className={[styles.pill, o.value === value && styles.active].filter(Boolean).join(' ')}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
