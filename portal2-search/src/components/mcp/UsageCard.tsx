import { MCP_BETA } from '../../data/mcp'
import type { McpUsage } from '../../types/mcp'
import { UsageChart } from './UsageChart'
import styles from './UsageCard.module.css'

interface UsageCardProps {
  usage: McpUsage
  /** `limit` paints the bars red. */
  exhausted: boolean
}

export function UsageCard({ usage, exhausted }: UsageCardProps) {
  return (
    <section className={styles.card} aria-labelledby="mcp-usage-title">
      <div className={styles.head}>
        <h2 id="mcp-usage-title" className={styles.title}>
          Usage
        </h2>
        <p className={styles.sub}>Your free beta allowance. One-time.</p>
      </div>

      <div className={styles.body}>
        <div className={styles.left}>
          <div className={styles.metrics}>
            {usage.metrics.map((m) => (
              <div key={m.id} className={styles.metric}>
                <div className={styles.metricHead}>
                  <p className={styles.metricTitle}>{m.label}</p>
                  <p className={styles.metricSub}>
                    {m.used} used · {m.total - m.used} left
                  </p>
                </div>
                <div className={styles.meter}>
                  <div
                    className={styles.bar}
                    role="progressbar"
                    aria-label={`${m.label} consumed`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={m.consumedPct}
                  >
                    <div
                      className={`${styles.fill} ${exhausted ? styles.fillFull : ''}`}
                      style={{ width: `${m.consumedPct}%` }}
                    />
                  </div>
                  <p className={styles.pct}>{m.consumedPct}% consumed</p>
                </div>
                {m.id === 'search' && <span className={styles.rule} aria-hidden />}
              </div>
            ))}
          </div>

          <div className={styles.chips}>
            <div className={`${styles.chip} ${styles.chipWide}`}>
              <p className={styles.chipLabel}>Markets covered</p>
              <p className={styles.chipValue}>{MCP_BETA.markets} jurisdictions</p>
            </div>
            <div className={styles.chip}>
              <p className={styles.chipLabel}>Tools available</p>
              <p className={styles.chipValue}>2 (search + report)</p>
            </div>
          </div>

          {/* While the allowance is spent this line moves into the limit alert, next to the problem it answers. */}
          {!exhausted && <p className={styles.note}>Speak to your Client Success Rep for more access</p>}
        </div>

        <div className={styles.chartWrap}>
          <UsageChart days={usage.days} series={usage.series} />
        </div>
      </div>
    </section>
  )
}
