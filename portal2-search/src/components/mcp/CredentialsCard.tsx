import copyIcon from '../../assets/mcp/copy.svg'
import eye from '../../assets/mcp/eye.svg'
import refresh from '../../assets/mcp/refresh.svg'
import { MCP_KEY_MASK, MCP_URL } from '../../data/mcp'
import type { McpStatus } from '../../types/mcp'
import styles from './CredentialsCard.module.css'

interface CredentialsCardProps {
  status: McpStatus
  apiKey: string
  revealed: boolean
  copied: 'key' | 'url' | null
  onToggleReveal: () => void
  onCopyKey: () => void
  onCopyUrl: () => void
  onRefresh: () => void
}

export function CredentialsCard({
  status,
  apiKey,
  revealed,
  copied,
  onToggleReveal,
  onCopyKey,
  onCopyUrl,
  onRefresh,
}: CredentialsCardProps) {
  const inactive = status === 'limit'
  return (
    <section className={styles.card} aria-labelledby="mcp-cred-title">
      <div className={styles.head}>
        <h2 id="mcp-cred-title" className={styles.title} tabIndex={-1}>
          MCP credentials
        </h2>
        <span className={[styles.badge, inactive ? styles.badgeInactive : styles.badgeActive].join(' ')}>
          {inactive ? 'Inactive' : 'Active'}
        </span>
      </div>
      <p className={styles.desc}>
        Your MCP key links to your account credentials in the backend. Paste into your MCP client config. Refreshing
        immediately invalidates the previous key.
      </p>

      <div className={styles.fields}>
        <div className={`${styles.field} ${styles.fieldKey} ${inactive ? styles.fieldKeyInactive : ''}`}>
          <div className={styles.fieldMain}>
            <span className={styles.keyLabel}>MCP KEY</span>
            <span className={styles.value} data-testid="mcp-key">
              {revealed ? apiKey : MCP_KEY_MASK}
            </span>
            <button
              type="button"
              className={styles.iconBtn}
              aria-label={revealed ? 'Hide MCP key' : 'Show MCP key'}
              aria-pressed={revealed}
              onClick={onToggleReveal}
            >
              <img src={eye} alt="" width={16} height={16} />
            </button>
          </div>
          <button type="button" className={styles.textBtn} onClick={onCopyKey}>
            <img src={copyIcon} alt="" width={16} height={16} />
            {copied === 'key' ? 'Copied' : 'Copy'}
          </button>
        </div>

        <div className={`${styles.field} ${styles.fieldUrl}`}>
          <span className={styles.urlLabel}>MCP URL</span>
          <span className={`${styles.value} ${styles.urlValue}`}>{MCP_URL}</span>
          <button type="button" className={styles.textBtn} onClick={onCopyUrl}>
            <img src={copyIcon} alt="" width={16} height={16} />
            {copied === 'url' ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Announces the copy confirmation to screen readers; the visible label swap alone is silent. */}
      <span className={styles.srOnly} role="status" aria-live="polite">
        {copied === 'key' ? 'MCP key copied' : copied === 'url' ? 'MCP URL copied' : ''}
      </span>

      <div className={styles.actions}>
        <button type="button" className={styles.refreshBtn} onClick={onRefresh}>
          <img src={refresh} alt="" width={16} height={16} />
          Refresh key
        </button>
        <button type="button" className={styles.textBtn}>
          Read integration docs
        </button>
      </div>
    </section>
  )
}
