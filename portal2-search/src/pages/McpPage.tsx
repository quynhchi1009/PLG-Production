import { useEffect } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { CapabilityTable } from '../components/mcp/CapabilityTable'
import { ConfirmDialog } from '../components/mcp/ConfirmDialog'
import { CredentialsCard } from '../components/mcp/CredentialsCard'
import { LimitAlert } from '../components/mcp/LimitAlert'
import { McpHeading } from '../components/mcp/McpHeading'
import { McpIntro } from '../components/mcp/McpIntro'
import { UsageCard } from '../components/mcp/UsageCard'
import { MCP_URL } from '../data/mcp'
import { useMcp, type McpSeed } from '../hooks/useMcp'
import styles from './McpPage.module.css'

/** Pre-baked screen states, selectable with `#/mcp?state=<key>`; each mirrors a frame in the Figma "Portal 2" section. */
export const MCP_STATES: Record<string, { label: string; seed: McpSeed }> = {
  preactivation: { label: 'Pre-activation', seed: {} },
  'activate-dialog': { label: 'Activate dialog', seed: { dialog: 'activate' } },
  'post-activation': { label: 'Post-activation', seed: { status: 'active' } },
  'refresh-dialog': { label: 'Refresh key dialog', seed: { status: 'active', dialog: 'refresh' } },
  'limit-reached': { label: 'Limit reached', seed: { status: 'limit' } },
}

interface McpPageProps {
  stateKey?: string
}

export function McpPage({ stateKey }: McpPageProps) {
  const preset = stateKey ? MCP_STATES[stateKey] : undefined
  const mcp = useMcp(preset?.seed)
  const live = mcp.status !== 'inactive'

  // After Activate or Refresh the dialog (and for Activate, its opener) is gone; land on the credentials card instead of <body>.
  useEffect(() => {
    if (mcp.focusToken > 0) document.getElementById('mcp-cred-title')?.focus()
  }, [mcp.focusToken])

  return (
    <AppShell title="MCP" activeNav="mcp">
      <div className={styles.srOnly} role="status" aria-live="polite">
        {mcp.notice}
      </div>
      <McpHeading live={live} />

      {live ? (
        <div className={styles.stack}>
          {mcp.status === 'limit' && <LimitAlert />}
          <CredentialsCard
            status={mcp.status}
            apiKey={mcp.apiKey}
            revealed={mcp.revealed}
            copied={mcp.copied}
            onToggleReveal={mcp.toggleReveal}
            onCopyKey={() => mcp.copy('key', mcp.apiKey)}
            onCopyUrl={() => mcp.copy('url', MCP_URL)}
            onRefresh={() => mcp.openDialog('refresh')}
          />
          <UsageCard usage={mcp.usage} exhausted={mcp.status === 'limit'} />
        </div>
      ) : (
        <div className={styles.stack}>
          <McpIntro onActivate={() => mcp.openDialog('activate')} />
          <CapabilityTable />
        </div>
      )}

      {mcp.dialog === 'activate' && (
        <ConfirmDialog
          title="Do you want to activate MCP?"
          body="This generates your dedicated MCP key with 200 free searches and 20 lite reports across 14 markets. You'll stay on this page, and your key will appear here once it's ready."
          confirmLabel="Activate MCP"
          tone="primary"
          onConfirm={mcp.activate}
          onCancel={mcp.closeDialog}
        />
      )}
      {mcp.dialog === 'refresh' && (
        <ConfirmDialog
          title="Refresh MCP key?"
          body="Your current key will be permanently deleted and immediately invalidated. Any integrations using this key will stop working until they are updated with the new key."
          confirmLabel="Refresh key"
          tone="danger"
          onConfirm={mcp.refreshKey}
          onCancel={mcp.closeDialog}
        />
      )}
    </AppShell>
  )
}
