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
 * Open-once state for the MCP launch announcement.
 * `auto` opens it on the first visit; `forced` (the dev "Announcement" state) opens it every time and never records a dismissal.
 */
export function useAnnouncement({ auto, forced }: { auto: boolean; forced: boolean }) {
  const [open, setOpen] = useState(() => forced || (auto && !wasSeen()))

  const dismiss = useCallback(() => {
    setOpen(false)
    if (!forced) markSeen()
  }, [forced])

  return { open, dismiss }
}
