import styles from './TextTabs.module.css'

interface TextTabOption<T extends string> {
  value: T
  label: string
}

interface TextTabsProps<T extends string> {
  options: TextTabOption<T>[]
  value: T
  onChange: (value: T) => void
}

/** Large bold text tabs separated by a vertical rule (Configure | Compare) */
export function TextTabs<T extends string>({ options, value, onChange }: TextTabsProps<T>) {
  return (
    <div role="tablist" className={styles.tabs}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={o.value === value}
          className={[styles.tab, o.value === value && styles.active].filter(Boolean).join(' ')}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
