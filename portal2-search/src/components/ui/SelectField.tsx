import { useEffect, useId, useRef, useState } from 'react'
import { CheckCircle2, ChevronDown, XCircle } from 'lucide-react'
import styles from './SelectField.module.css'

export interface SelectOption {
  value: string
  label: string
  /** ISO country code; renders a flag on the right of the option */
  flag?: string
}

interface SelectFieldProps {
  options: SelectOption[]
  value: string | null
  onChange: (value: string | null) => void
  placeholder: string
  invalid?: boolean
  disabled?: boolean
  clearable?: boolean
  /** Show the green "filled" tick the portal renders on completed fields */
  showFilledTick?: boolean
  /** `form` = 4px radius (search bar), `field` = 8px radius (order page) */
  shape?: 'form' | 'field'
  /** Keep the list open; used by the state gallery */
  defaultOpen?: boolean
  className?: string
}

export function SelectField({
  options,
  value,
  onChange,
  placeholder,
  invalid,
  disabled,
  clearable,
  showFilledTick,
  shape = 'form',
  defaultOpen = false,
  className,
}: SelectFieldProps) {
  const [open, setOpen] = useState(defaultOpen)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const selected = options.find((o) => o.value === value)

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

  const cls = [
    styles.trigger,
    shape === 'field' && styles.field,
    open && styles.open,
    invalid && styles.invalid,
    disabled && styles.disabled,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={rootRef} className={[styles.root, className].filter(Boolean).join(' ')}>
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        className={cls}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={selected ? styles.value : styles.placeholder}>
          {selected ? selected.label : placeholder}
        </span>
        <span className={styles.suffix}>
          <ChevronDown size={16} className={open ? styles.caretUp : undefined} aria-hidden />
          {clearable && selected && !disabled && (
            <span
              role="button"
              tabIndex={0}
              aria-label="Clear selection"
              className={styles.clear}
              onClick={(e) => {
                e.stopPropagation()
                onChange(null)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.stopPropagation()
                  onChange(null)
                }
              }}
            >
              <XCircle size={16} />
            </span>
          )}
          {invalid && !selected && <XCircle size={16} className={styles.invalidIcon} aria-hidden />}
          {showFilledTick && selected && <CheckCircle2 size={16} className={styles.tick} aria-hidden />}
        </span>
      </button>

      {open && (
        <ul id={listId} role="listbox" className={styles.list}>
          {options.map((o) => (
            <li
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              className={[styles.option, o.value === value && styles.selected]
                .filter(Boolean)
                .join(' ')}
              onClick={() => {
                onChange(o.value)
                setOpen(false)
              }}
            >
              <span>{o.label}</span>
              {o.flag && <span className={`fi fi-${o.flag} ${styles.flag}`} aria-hidden />}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
