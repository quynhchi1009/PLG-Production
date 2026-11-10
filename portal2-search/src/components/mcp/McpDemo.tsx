import logo from '../../assets/mcp/logo-header.png'
import { MCP_BETA, TERMINAL_LINES } from '../../data/mcp'
import styles from './McpDemo.module.css'

/** Dark "agent calls AsiaVerify" demo panel. Right-hand half of the MCP intro hero. */
export function McpDemo() {
  return (
    <div className={styles.demo}>
      <div className={styles.visual} aria-hidden>
        <div className={styles.demoHeader}>
          <div className={styles.brand}>
            <span className={styles.demoLogo}>
              <img src={logo} alt="" />
            </span>
            <span className={styles.dot}>·</span>
            <span className={styles.brandName}>MCP</span>
          </div>
          <div className={styles.counts}>
            <div className={styles.count}>
              <span className={styles.countValue}>{MCP_BETA.searches}</span>
              <span className={styles.countLabel}>searches</span>
            </div>
            <div className={styles.count}>
              <span className={styles.countValue}>{MCP_BETA.reports}</span>
              <span className={styles.countLabel}>reports</span>
            </div>
          </div>
        </div>

        <div className={styles.terminal}>
          <div className={styles.termBar}>
            <span className={styles.light} style={{ background: '#ff5f57' }} />
            <span className={styles.light} style={{ background: '#febc2e' }} />
            <span className={styles.light} style={{ background: '#28c840' }} />
            <span className={styles.termTitle}>Claude · AsiaVerify MCP</span>
            <span className={styles.status}>
              <span className={styles.statusDot} />
              connected
            </span>
          </div>
          <div className={styles.termBody}>
            {TERMINAL_LINES.map((line) => (
              <p
                key={line.text}
                className={[styles.line, styles[line.tone], line.marked && styles.marked].filter(Boolean).join(' ')}
              >
                {line.text}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.chips} aria-hidden>
        <span className={styles.chip}>{MCP_BETA.markets} markets</span>
        <span className={styles.chip}>{'< 5s latency'}</span>
      </div>
    </div>
  )
}
