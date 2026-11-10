import styles from './McpHeading.module.css'

/** Page title block of the MCP screen: "MCP" plus one line that changes once a key exists. */
export function McpHeading({ live }: { live: boolean }) {
  return (
    <header className={styles.title}>
      <h2>MCP</h2>
      <p>
        {live
          ? 'Manage your MCP key, monitor usage, and review your tool-call log.'
          : 'Connect AsiaVerify to your Al agent. Free during beta - 200 searches + 20 lite reports.'}
      </p>
    </header>
  )
}
