import { useCallback, useEffect, useRef, useState } from 'react'
import { USAGE_ACTIVE, USAGE_FRESH, USAGE_LIMIT } from '../data/mcp'
import type { McpDialog, McpStatus, McpUsage } from '../types/mcp'

export interface McpSeed {
  status?: McpStatus
  dialog?: McpDialog
}

/** Placeholder key. The real key is issued by the backend; this only exists so Show / Copy have something to act on. */
function makeKey(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return `av_mcp_${Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')}`
}

export function useMcp(seed: McpSeed = {}) {
  const [status, setStatus] = useState<McpStatus>(seed.status ?? 'inactive')
  const [dialog, setDialog] = useState<McpDialog>(seed.dialog ?? null)
  const [revealed, setRevealed] = useState(false)
  const [apiKey, setApiKey] = useState(makeKey)
  const [usage, setUsage] = useState<McpUsage>(() => (seed.status === 'limit' ? USAGE_LIMIT : USAGE_ACTIVE))
  const [copied, setCopied] = useState<'key' | 'url' | null>(null)
  // Spoken to assistive tech after Activate / Refresh, and a counter that tells the page to move focus to the credentials heading.
  const [notice, setNotice] = useState('')
  const [focusToken, setFocusToken] = useState(0)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const activate = useCallback(() => {
    setApiKey(makeKey())
    setUsage(USAGE_FRESH)
    setStatus('active')
    setDialog(null)
    setNotice('MCP key created')
    setFocusToken((n) => n + 1)
  }, [])

  const refreshKey = useCallback(() => {
    setApiKey(makeKey())
    setRevealed(false)
    setDialog(null)
    setNotice('MCP key refreshed')
    setFocusToken((n) => n + 1)
  }, [])

  const copy = useCallback(async (what: 'key' | 'url', value: string) => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // Clipboard can be unavailable (insecure context); still acknowledge the click.
    }
    setCopied(what)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(null), 1600)
  }, [])

  return {
    status,
    dialog,
    revealed,
    apiKey,
    usage,
    copied,
    notice,
    focusToken,
    openDialog: setDialog,
    closeDialog: () => setDialog(null),
    toggleReveal: () => setRevealed((v) => !v),
    activate,
    refreshKey,
    copy,
  }
}
