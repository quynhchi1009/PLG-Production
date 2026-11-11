import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { Bot, Building2, Plug } from 'lucide-react'
import checkBadge from '../../assets/mcp/check-badge.svg'
import logo from '../../assets/mcp/logo-header.png'
import { MCP_BETA, MCP_URL, TERMINAL_LINES, USAGE_ACTIVE } from '../../data/mcp'
import { McpKeyField, McpStatusBadge, McpUrlField } from '../mcp/CredentialsCard'
import { UsageChart } from '../mcp/UsageChart'
import styles from './McpIntroVideo.module.css'

/** Design-space size of the clip: a 16:9 frame (it exports as exactly 3840×2160), scaled to the dialog's width. */
const SCENE_W = 1440
const SCENE_H = 810

/** A made-up key, only here so the clip has something to "generate". 7 + 32 characters: the CSS types it in 39 steps. */
const DEMO_KEY = 'av_mcp_3f9a1c7e52b04d86a1e7c9d03b5f28e4'

/** The exchange the clip plays out, taken from the MCP page's own demo so the two cannot drift: prompt, call, result, two hits. */
const EXCHANGE = [0, 1, 3, 4, 5].map((i) => TERMINAL_LINES[i])

const noop = () => undefined

/** The chart's Lite Report line is the brand green, which disappears on the dark frame: the clip draws it in the mint the rest of the frame uses. */
const CHART_SERIES = USAGE_ACTIVE.series.map((s) => (s.id === 'lite' ? { ...s, color: '#9af4e3' } : s))

interface McpIntroVideoProps {
  /** Change it to run the clip again from the start. */
  replayKey: number
}

/**
 * The introduction to MCP shown in the announcement (14s). A fixed frame: nothing zooms or pans, each scene just
 * replaces the last.
 *   A · what MCP is: "Give your AI agent access to Asian KYB data",
 *   B · how it works: an AI agent → MCP → AsiaVerify registry, and the agent's search playing out in a terminal,
 *   C · Activate MCP: the button is clicked and the page's real key and URL fields appear, the key typed into it,
 *   D · the page's real usage graph, with the two meters beside it filling,
 *   E · what you get: the free beta allowance and the Activate MCP button.
 * C and D use the MCP page's own field and graph components (McpKeyField, McpUrlField, McpStatusBadge, UsageChart), not
 * whole cards, so no white panel sits on the dark frame; each is enlarged so it stays legible in a small dialog. The
 * fields follow the page's narrow-window layout below 960px, like the page itself. Every figure and line of copy comes
 * from `data/mcp.ts` (or the dialog's own text), so it says what the page says.
 * Decorative and inert: the dialog's own text carries the message.
 */
export function McpIntroVideo({ replayKey }: McpIntroVideoProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)

  useLayoutEffect(() => {
    const el = stageRef.current
    if (!el) return
    const fit = () => setScale(el.clientWidth / SCENE_W)
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={stageRef}
      className={styles.stage}
      style={{ '--k': scale, height: SCENE_H * scale } as CSSProperties}
      aria-hidden
      inert
    >
      <div key={replayKey} className={styles.frame}>
        <header className={styles.brand}>
          <span className={styles.logo}>
            <img src={logo} alt="" />
          </span>
          <span className={styles.sep}>·</span>
          <span className={styles.brandName}>MCP</span>
        </header>

        {/* A · What it is */}
        <section className={`${styles.scene} ${styles.sceneA}`}>
          <p className={styles.eyebrow} data-a="eyebrow">
            MCP is Now Live
          </p>
          <h2 className={styles.headline} data-a="headline">
            Give your AI agent access to Asian KYB data
          </h2>
          <p className={styles.lede} data-a="lede">
            Connect Claude, Cursor, or any MCP-compatible client.
          </p>
        </section>

        {/* B · How it works */}
        <section className={`${styles.scene} ${styles.sceneB}`}>
          <div className={styles.flow}>
            <div className={styles.card} data-b="agent">
              <span className={styles.cardIcon}>
                <Bot size={40} strokeWidth={1.75} />
              </span>
              <span>
                <span className={styles.cardTitle}>Your AI agent</span>
                <span className={styles.cardSub}>Claude · Cursor</span>
              </span>
            </div>

            <div className={styles.link}>
              <span className={styles.wire} data-b="wire" />
              <span className={styles.packet} data-b="packetOut" />
              <span className={`${styles.packet} ${styles.packetBack}`} data-b="packetBack" />
              <span className={styles.pill} data-b="pill">
                <Plug size={30} strokeWidth={2} />
                MCP
              </span>
              <span className={styles.url} data-b="url">
                {MCP_URL.replace('https://', '')}
              </span>
            </div>

            <div className={styles.card} data-b="registry">
              <span className={styles.cardIcon}>
                <Building2 size={40} strokeWidth={1.75} />
              </span>
              <span>
                <span className={styles.cardTitle}>AsiaVerify</span>
                <span className={styles.cardSub}>{MCP_BETA.markets} markets</span>
              </span>
            </div>
          </div>

          <div className={styles.terminal} data-b="terminal">
            <div className={styles.termBar}>
              <span className={styles.light} style={{ background: '#ff5f57' }} />
              <span className={styles.light} style={{ background: '#febc2e' }} />
              <span className={styles.light} style={{ background: '#28c840' }} />
              <span className={styles.termTitle}>Claude · AsiaVerify MCP</span>
            </div>
            <div className={styles.termBody}>
              {EXCHANGE.map((line, i) => {
                const glyph = line.text.startsWith('⟳') ? 'spin' : null
                return (
                  <p
                    key={line.text}
                    data-t={i}
                    className={[styles.line, styles[line.tone], line.marked && styles.marked].filter(Boolean).join(' ')}
                  >
                    {glyph ? (
                      <>
                        <span data-glyph={glyph}>{line.text[0]}</span>
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
        </section>

        {/* C · Activate MCP, then the credentials */}
        <section className={`${styles.scene} ${styles.sceneC}`}>
          <h2 className={`${styles.heading} ${styles.headingC}`} data-cc="title">
            Click Activate MCP to generate your key
          </h2>
          <div className={styles.press} data-cc="press">
            <div className={styles.cta} data-cc="cta">
              Activate MCP - Free Beta Access
              <img src={checkBadge} alt="" width={36} height={36} />
            </div>
            <span className={styles.ripple} data-cc="ripple" />
            <span className={styles.cursor} data-cc="cursor">
              <svg width="64" height="64" viewBox="0 0 24 24">
                <path
                  d="M5 3l14 8.2-6.2 1.6L9.6 19 5 3z"
                  fill="#fff"
                  stroke="#111"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
          <div className={styles.ui} data-cc="card">
            <div className={styles.uiInner}>
              <div className={styles.badgeRow}>
                <McpStatusBadge inactive={false} />
              </div>
              <div className={styles.fields}>
                <McpKeyField
                  inactive={false}
                  apiKey={DEMO_KEY}
                  revealed
                  copied={false}
                  onToggleReveal={noop}
                  onCopy={noop}
                />
                <McpUrlField copied={false} onCopy={noop} />
              </div>
            </div>
          </div>
        </section>

        {/* D · The usage card */}
        <section className={`${styles.scene} ${styles.sceneD}`}>
          <h2 className={`${styles.heading} ${styles.headingD}`} data-d="title">
            Track every call
          </h2>
          <div className={styles.panel} data-d="card">
            <div className={styles.meters}>
              {USAGE_ACTIVE.metrics.map((m) => (
                <div key={m.id} className={styles.meter}>
                  <p className={styles.meterTitle}>{m.label}</p>
                  <p className={styles.meterSub}>
                    {m.used} used · {m.total - m.used} left
                  </p>
                  <div className={styles.track}>
                    <div className={styles.fill} data-mcp-fill style={{ width: `${m.consumedPct}%` }} />
                  </div>
                  <p className={styles.meterPct}>{m.consumedPct}% consumed</p>
                </div>
              ))}
            </div>
            <div className={styles.chart}>
              <div className={styles.chartInner}>
                <UsageChart days={USAGE_ACTIVE.days} series={CHART_SERIES} />
              </div>
            </div>
          </div>
        </section>

        {/* E · What you get */}
        <section className={`${styles.scene} ${styles.sceneE}`}>
          <h2 className={styles.freeTitle} data-e="title">
            Free during the beta
          </h2>
          <div className={styles.stats}>
            <p className={styles.stat} data-e="stat0">
              <span className={styles.statValue}>{MCP_BETA.searches}</span>
              <span className={styles.statLabel}>searches</span>
            </p>
            <p className={styles.stat} data-e="stat1">
              <span className={styles.statValue}>{MCP_BETA.reports}</span>
              <span className={styles.statLabel}>lite reports</span>
            </p>
            <p className={styles.stat} data-e="stat2">
              <span className={styles.statValue}>{MCP_BETA.markets}</span>
              <span className={styles.statLabel}>markets</span>
            </p>
          </div>
          <div className={`${styles.cta} ${styles.ctaPulse}`} data-e="cta">
            Activate MCP - Free Beta Access
            <img src={checkBadge} alt="" width={36} height={36} />
          </div>
          <p className={styles.caption} data-e="caption">
            Find it under <strong>MCP</strong> in the sidebar
          </p>
        </section>
      </div>
    </div>
  )
}
