import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowRight, Plug, RotateCcw, X } from 'lucide-react'
import { MCP_BETA } from '../../data/mcp'
import { trapTab } from '../../hooks/useFocusTrap'
import { Checkbox } from '../ui/Checkbox'
import { McpIntroVideo } from './McpIntroVideo'
import styles from './McpAnnouncement.module.css'

const DONT_SHOW_LABEL = "Don't show this again"

interface McpAnnouncementProps {
  /** Close without acting (Got it, the × button, Esc, a click on the backdrop); receives the "Don't show this again" box. */
  onDismiss: (dontShowAgain: boolean) => void
  /** Primary action: the parent closes the dialog and opens the MCP page; receives the "Don't show this again" box. */
  onExplore: (dontShowAgain: boolean) => void
}

/**
 * "MCP is Now Live!" launch announcement: product demo on top, headline, a pointer to where it lives, two actions.
 * Rendered in a portal with the app root made inert, like ConfirmDialog, so Tab and screen readers stay inside.
 * Focus starts on the dialog itself (so no button shows a ring until Tab is pressed) and returns to the opener on close.
 */
export function McpAnnouncement({ onDismiss, onExplore }: McpAnnouncementProps) {
  const titleId = useId()
  const bodyId = useId()
  const dontShowId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const [replayKey, setReplayKey] = useState(0)
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const dismiss = () => onDismiss(dontShowAgain)
  // The Esc listener is attached once, so it reads the latest dismiss (and box state) through a ref.
  const dismissRef = useRef(dismiss)
  dismissRef.current = dismiss

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const appRoot = document.getElementById('root')
    appRoot?.setAttribute('inert', '')
    dialogRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismissRef.current()
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
    <div className={styles.scrim} onMouseDown={(e) => e.target === e.currentTarget && dismiss()}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        tabIndex={-1}
      >
        <div className={styles.hero}>
          {/* The earlier zoom-tour clip (McpPreviewVideo) is kept; it can be previewed at #/announcement-video?clip=zoom. */}
          <McpIntroVideo replayKey={replayKey} />
          <button type="button" className={styles.replay} onClick={() => setReplayKey((n) => n + 1)}>
            <RotateCcw size={16} aria-hidden />
            Replay
          </button>
          <button type="button" className={styles.close} aria-label="Close" onClick={dismiss}>
            <X size={20} aria-hidden />
          </button>
        </div>

        <div className={styles.content}>
          <h2 id={titleId} className={styles.title}>
            MCP is Now Live!
          </h2>
          <p id={bodyId} className={styles.body}>
            Connect AsiaVerify to your AI agent. Link Claude &amp; ChatGPT and let them call our Search and Lite Report
            tools directly, on the same registry data you use here.
          </p>

          <div className={styles.note} role="note">
            <Plug size={20} className={styles.noteIcon} aria-hidden />
            <p>
              Find it under <strong>MCP</strong> in the sidebar: click <strong>Activate MCP</strong> to generate your
              key. It is free during the beta, with {MCP_BETA.searches} searches and {MCP_BETA.reports} lite reports.
            </p>
          </div>

          <div className={styles.actions}>
            <div className={styles.dontShow}>
              <Checkbox id={dontShowId} checked={dontShowAgain} onChange={setDontShowAgain} aria-label={DONT_SHOW_LABEL} />
              <label htmlFor={dontShowId} className={styles.dontShowLabel}>
                {DONT_SHOW_LABEL}
              </label>
            </div>
            <button type="button" className={styles.gotIt} onClick={dismiss}>
              Got it
            </button>
            <button type="button" className={styles.explore} onClick={() => onExplore(dontShowAgain)}>
              Explore MCP
              <ArrowRight size={20} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
