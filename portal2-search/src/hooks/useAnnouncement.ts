import { useCallback, useState } from 'react'

/** Bump the suffix to show the announcement again to people who dismissed an earlier one. */
const STORAGE_KEY = 'av-announcement-mcp-launch-v2'

function wasSeen(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function markSeen() {
  try {
    window.localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // Storage can be blocked (private window); the announcement then simply shows again next visit.
  }
}

/**
 * Open state for the MCP launch announcement.
 * `auto` opens it on every visit until the "Don't show this again" box was ticked on a dismissal; `forced` (the dev
 * "Announcement" state) opens it every time and never records anything.
 */
export function useAnnouncement({ auto, forced }: { auto: boolean; forced: boolean }) {
  const [open, setOpen] = useState(() => forced || (auto && !wasSeen()))

  /** Closes the dialog; the choice is only remembered when "Don't show this again" is ticked. */
  const dismiss = useCallback(
    (dontShowAgain: boolean) => {
      setOpen(false)
      if (!forced && dontShowAgain) markSeen()
    },
    [forced],
  )

  return { open, dismiss }
}
