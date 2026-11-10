import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '../ui/Button'
import { Checkbox } from '../ui/Checkbox'
import styles from './FilterChip.module.css'

export interface FilterOption {
  value: string
  label: string
  /** ISO country code; renders a flag after the label */
  flag?: string
}

interface FilterChipProps {
  label: string
  options: FilterOption[]
  /** Applied values; a single-choice chip holds at most one */
  value: string[]
  onApply: (value: string[]) => void
  /** Single-choice chips apply on click; multi-choice chips collect a draft and apply together */
  single?: boolean
  /** Keep the list open; used by the state gallery */
  defaultOpen?: boolean
}

/** Filter control: a pill that opens a list of options. Turns green once a filter is applied. */
export function FilterChip({ label, options, value, onApply, single, defaultOpen = false }: FilterChipProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [draft, setDraft] = useState(value)
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

  const active = value.length > 0
  const suffix = single
    ? options.find((o) => o.value === value[0])?.label
    : value.length > 0
      ? String(value.length)
      : undefined

  const toggle = () => {
    if (!open) setDraft(value)
    setOpen((o) => !o)
  }

  const toggleDraft = (v: string, on: boolean) =>
    setDraft((d) => (on ? [...d, v] : d.filter((x) => x !== v)))

  return (
    <div ref={rootRef} className={styles.root}>
      <button
        type="button"
        className={[styles.chip, active && styles.active, open && styles.open].filter(Boolean).join(' ')}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
      >
        <span>{label}</span>
        {suffix && <span className={styles.count}>{suffix}</span>}
        <ChevronDown size={16} className={open ? styles.caretUp : undefined} aria-hidden />
      </button>

      {open && (
        <div className={styles.popover} role="listbox" aria-label={label} aria-multiselectable={!single}>
          <ul className={styles.list}>
            {options.map((o) =>
              single ? (
                <li key={o.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={value[0] === o.value}
                    className={[styles.option, value[0] === o.value && styles.selected].filter(Boolean).join(' ')}
                    onClick={() => {
                      onApply(value[0] === o.value ? [] : [o.value])
                      setOpen(false)
                    }}
                  >
                    {o.label}
                  </button>
                </li>
              ) : (
                <li key={o.value} className={styles.option}>
                  <Checkbox
                    checked={draft.includes(o.value)}
                    onChange={(on) => toggleDraft(o.value, on)}
                    aria-label={o.label}
                  />
                  <span className={styles.optionLabel}>{o.label}</span>
                  {o.flag && <span className={`fi fi-${o.flag} ${styles.flag}`} aria-hidden />}
                </li>
              ),
            )}
          </ul>
          {!single && (
            <div className={styles.footer}>
              <Button
                variant="link"
                onClick={() => {
                  onApply(draft)
                  setOpen(false)
                }}
              >
                Apply
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
