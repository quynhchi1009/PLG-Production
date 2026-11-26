import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Download, X } from 'lucide-react'
import styles from './DownloadStartedToast.module.css'

/** Copy from the brief, split at the comma for hierarchy only: the sentence reads unchanged. */
const LEAD = 'Your report is being downloaded,'
const REST = 'please refresh the page after a few minutes.'

/** Long enough to read twice; paused while the pointer or focus is on it. */
const AUTO_DISMISS_MS = 10_000
/** Matches the exit transition in the stylesheet. */
const EXIT_MS = 200

interface DownloadStartedToastProps {
  onClose: () => void
}

/**
 * Top-right notification on the Download Centre, shown after Download is clicked in the report viewer.
 * Non-blocking: no scrim, no focus steal; announced politely to screen readers. Dismisses on its own,
 * from its close button, or with Escape.
 */
export function DownloadStartedToast({ onClose }: DownloadStartedToastProps) {
  const [leaving, setLeaving] = useState(false)
  const [paused, setPaused] = useState(false)
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  const dismiss = () => setLeaving(true)

  useEffect(() => {
    if (!leaving) return
    const t = window.setTimeout(() => onCloseRef.current(), EXIT_MS)
    return () => window.clearTimeout(t)
  }, [leaving])

  useEffect(() => {
    if (paused || leaving) return
    const t = window.setTimeout(() => setLeaving(true), AUTO_DISMISS_MS)
    return () => window.clearTimeout(t)
  }, [paused, leaving])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setLeaving(true)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return createPortal(
    <div
      className={[styles.toast, leaving && styles.leaving].filter(Boolean).join(' ')}
      role="status"
      aria-live="polite"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span className={styles.icon} aria-hidden>
        <Download size={18} strokeWidth={2.25} />
      </span>
      <p className={styles.text}>
        <strong className={styles.lead}>{LEAD}</strong> {REST}
      </p>
      <button type="button" className={styles.close} aria-label="Dismiss notification" onClick={dismiss}>
        <X size={18} aria-hidden />
      </button>
    </div>,
    document.body,
  )
}
