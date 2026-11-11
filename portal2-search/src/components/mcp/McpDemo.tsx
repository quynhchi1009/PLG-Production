import logo from '../../assets/mcp/logo-header.png'
import { MCP_BETA, TERMINAL_LINES } from '../../data/mcp'
import styles from './McpDemo.module.css'

/** Dark "agent calls AsiaVerify" demo panel. Right-hand half of the MCP intro hero. */
export function McpDemo() {
  return (
    <div className={styles.demo} data-mcp-demo>
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
            <span className={styles.status} data-demo-status>
              <span className={styles.statusDot} />
              connected
            </span>
          </div>
          <div className={styles.termBody}>
            {TERMINAL_LINES.map((line, i) => {
              // The leading ⟳ / ✓ is wrapped so the announcement clip can spin the first and leave the second still.
              const glyph = line.text.startsWith('⟳') ? 'spin' : line.text.startsWith('✓') ? 'check' : null
              return (
                <p
                  key={line.text}
                  data-demo-line={i}
                  className={[styles.line, styles[line.tone], line.marked && styles.marked].filter(Boolean).join(' ')}
                >
                  {glyph ? (
                    <>
                      <span data-demo-glyph={glyph}>{line.text[0]}</span>
                      {line.text.slice(1)}
                    </>
                  ) : (
                    line.text
                  )}
                </p>
              )
            })}
          </div>
        </div>
      </div>

      <div className={styles.chips} aria-hidden>
        <span className={styles.chip} data-demo-chip={0}>
          {MCP_BETA.markets} markets
        </span>
        <span className={styles.chip} data-demo-chip={1}>
          {'< 5s latency'}
        </span>
      </div>
    </div>
  )
}
