import styles from './StateSwitcher.module.css'

interface StateSwitcherProps {
  base: string
  states: Record<string, { label: string }>
  current?: string | null
}

/** Dev-only strip for jumping between pre-baked screen states (mirrors the Figma frames). */
export function StateSwitcher({ base, states, current }: StateSwitcherProps) {
  return (
    <nav className={styles.switcher} aria-label="Screen states">
      <span className={styles.label}>States</span>
      {Object.entries(states).map(([key, { label }]) => (
        <a
          key={key}
          href={`${base}${base.includes('?') ? '&' : '?'}state=${key}`}
          className={[styles.link, current === key && styles.active].filter(Boolean).join(' ')}
        >
          {label}
        </a>
      ))}
    </nav>
  )
}
