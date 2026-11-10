import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import close from '../../assets/mcp/close.svg'
import { trapTab } from '../../hooks/useFocusTrap'
import styles from './ConfirmDialog.module.css'

interface ConfirmDialogProps {
  title: string
  body: string
  confirmLabel: string
  tone: 'primary' | 'danger'
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Modal used for "Do you want to activate MCP?" and "Refresh MCP key?".
 * Rendered in a portal so the app root can be made inert while it is open: Tab cannot leave the dialog,
 * and screen readers only see the dialog. Focus starts on Cancel and returns to the opener on close.
 */
export function ConfirmDialog({ title, body, confirmLabel, tone, onConfirm, onCancel }: ConfirmDialogProps) {
  const titleId = useId()
  const bodyId = useId()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  // Keep the latest handler without re-running the focus effect on every parent render.
  const onCancelRef = useRef(onCancel)
  onCancelRef.current = onCancel

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const appRoot = document.getElementById('root')
    appRoot?.setAttribute('inert', '')
    cancelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancelRef.current()
      else trapTab(e, dialogRef.current)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      appRoot?.removeAttribute('inert')
      previous?.focus?.()
    }
  }, [])

  return createPortal(
    <div className={styles.scrim} onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
      >
        <div className={styles.top}>
          <h2 id={titleId} className={`${styles.title} ${tone === 'danger' ? styles.titleBold : ''}`}>
            {title}
          </h2>
          <button type="button" className={styles.close} aria-label="Close" onClick={onCancel}>
            <img src={close} alt="" width={24} height={24} />
          </button>
        </div>
        <p id={bodyId} className={styles.body}>
          {body}
        </p>
        <div className={styles.actions}>
          <button ref={cancelRef} type="button" className={styles.cancel} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className={`${styles.confirm} ${tone === 'danger' ? styles.danger : styles.primary}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
