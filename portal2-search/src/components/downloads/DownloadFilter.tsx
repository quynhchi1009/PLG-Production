import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Checkbox } from '../ui/Checkbox'
import styles from './DownloadFilter.module.css'

export interface DownloadFilterOption {
  value: string
  label: string
}

interface DownloadFilterProps {
  label: string
  options: DownloadFilterOption[]
  /** Draft selection; the row's APPLY button applies all filters together (live behaviour) */
  value: string[]
  onChange: (value: string[]) => void
}

/** Dark "Filter Button" from the live Download Centre: opens a checkbox list. */
export function DownloadFilter({ label, options, value, onChange }: DownloadFilterProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const toggle = (v: string, on: boolean) => onChange(on ? [...value, v] : value.filter((x) => x !== v))

  return (
    <div ref={rootRef} className={styles.root}>
      <button
        type="button"
        className={styles.button}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={styles.label}>
          {label}
          {value.length > 0 && <span className={styles.count}> ({value.length})</span>}
        </span>
        <ChevronDown size={14} className={open ? styles.caretUp : undefined} aria-hidden />
      </button>
      {open && (
        <ul className={styles.popover} role="listbox" aria-label={label} aria-multiselectable>
          {options.map((o) => (
            <li key={o.value} className={styles.option}>
              <Checkbox checked={value.includes(o.value)} onChange={(on) => toggle(o.value, on)} aria-label={o.label} />
              <span>{o.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
