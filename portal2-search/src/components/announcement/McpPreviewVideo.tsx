import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { USAGE_ACTIVE } from '../../data/mcp'
import { CapabilityTable } from '../mcp/CapabilityTable'
import { CredentialsCard } from '../mcp/CredentialsCard'
import { McpHeading } from '../mcp/McpHeading'
import { McpIntro } from '../mcp/McpIntro'
import { UsageCard } from '../mcp/UsageCard'
import { Sidebar } from '../layout/Sidebar'
import { TopBar } from '../layout/TopBar'
import styles from './McpPreviewVideo.module.css'

/** Design-space size of the scene: a 1440px-wide desktop window. It is scaled to whatever width the dialog gives it. */
const SCENE_W = 1440
const SCENE_H = 860
/** How far the camera pushes in on the Activate button. */
const ZOOM_BUTTON = 2.8
const ZOOM_KEY = 2.1
const ZOOM_USAGE_MAX = 1.6
/** The fixed top bar (64px) plus 6px: the usage shot starts just under it. */
const TOP_BAR = 70

/** A made-up key, only here so the clip has something to "generate". 7 + 32 characters: the CSS types it in 39 steps. */
const DEMO_KEY = 'av_mcp_3f9a1c7e52b04d86a1e7c9d03b5f28e4'

interface McpPreviewVideoProps {
  /** Change it to run the clip again from the start. */
  replayKey: number
}

interface Box {
  x: number
  y: number
  w: number
  h: number
}

/** Position of `el` inside `root`, in root's own (unscaled) pixels. offset* ignore transforms, so it is safe mid-animation. */
function boxWithin(el: HTMLElement, root: HTMLElement): Box {
  let x = 0
  let y = 0
  let node: HTMLElement | null = el
  while (node && node !== root) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight }
}

interface Boxes {
  demo: Box
  button: Box
  key: Box
  usage: Box
  chart: Box
}

/** Where things sit at 1440px wide with the page's own fonts; measured values replace these as soon as the scene is laid out. */
const FALLBACK: Boxes = {
  demo: { x: 938, y: 181, w: 453, h: 388 },
  button: { x: 373, y: 379, w: 285, h: 46 },
  key: { x: 450, y: 300, w: 304, h: 20 },
  usage: { x: 336, y: 520, w: 1056, h: 480 },
  chart: { x: 962, y: 620, w: 404, h: 300 },
}

const SELECTORS: Record<keyof Boxes, string> = {
  demo: '[data-mcp-demo]',
  button: '[data-mcp-activate]',
  key: '[data-mcp-key]',
  usage: '[data-mcp-usage]',
  chart: '[data-mcp-chart]',
}

const noop = () => undefined
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

/**
 * Camera position that puts (cx, cy) in the middle of the frame at zoom z, never showing past the canvas edges.
 * `topInset` keeps the top `topInset` scene pixels (the fixed top bar) out of the frame.
 */
function focus(cx: number, cy: number, z: number, topInset = 0) {
  return {
    z,
    x: clamp(SCENE_W / 2 - cx * z, SCENE_W - SCENE_W * z, 0),
    y: clamp(SCENE_H / 2 - cy * z, SCENE_H - SCENE_H * z, -topInset * z),
  }
}

/** Largest zoom at which `b` (plus `pad`× breathing room) still fits the frame. */
const fitZoom = (b: Box, pad: number) => Math.min(SCENE_W / (b.w * pad), SCENE_H / (b.h * pad))

/**
 * The clip behind the MCP announcement (9.2s). One continuous camera over the real MCP screen:
 *   1. tight on the dark demo panel while the agent's search types itself out,
 *   2. zoom out to the whole pre-activation page, ring already round "Activate MCP - Free Beta Access",
 *   3. push in on the button with the rest dimmed, a cursor clicks it,
 *   4. the page becomes the activated one: pull back, the MCP key is generated, then the usage graph draws in,
 *   5. pull back out to the wide shot of the live page.
 * Every screen is the page's own components on a fixed 1440×860 canvas, moved by CSS keyframes, so it stays sharp at any
 * zoom and needs no video file. Decorative and inert: the dialog's own text says the same thing.
 */
export function McpPreviewVideo({ replayKey }: McpPreviewVideoProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)
  const [boxes, setBoxes] = useState<Boxes>(FALLBACK)

  // Fit the stage to the available width.
  useLayoutEffect(() => {
    const el = stageRef.current
    if (!el) return
    const fit = () => setScale(el.clientWidth / SCENE_W)
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Find the things the camera aims at on the canvas, so it lands on them whatever the copy or fonts do to the layout.
  useLayoutEffect(() => {
    const root = sceneRef.current
    if (!root) return
    const measure = () => {
      setBoxes((prev) => {
        const next = { ...prev }
        let changed = false
        for (const name of Object.keys(SELECTORS) as (keyof Boxes)[]) {
          const el = root.querySelector<HTMLElement>(SELECTORS[name])
          if (!el) continue
          const b = boxWithin(el, root)
          const p = prev[name]
          if (b.x !== p.x || b.y !== p.y || b.w !== p.w || b.h !== p.h) {
            next[name] = b
            changed = true
          }
        }
        return changed ? next : prev
      })
    }
    measure()
    // Web fonts load after the first paint and re-wrap the copy above the targets (`fonts.ready` can resolve before they
    // even start), and the window width flips the real components between layouts: so measure again whenever a screen's
    // size changes, and when more fonts arrive.
    const ro = new ResizeObserver(measure)
    // Every element, not only the layers: both screens share one grid cell, so re-wrapped copy in the shorter one moves
    // the targets without changing any layer's own size.
    root.querySelectorAll('main *').forEach((el) => ro.observe(el))
    document.fonts?.addEventListener('loadingdone', measure)
    void document.fonts?.ready.then(measure)
    return () => {
      ro.disconnect()
      document.fonts?.removeEventListener('loadingdone', measure)
    }
  }, [])

  const { demo, button, key, usage, chart } = boxes

  // Camera stops. The usage card sits below the fold, so the page scrolls until its top is just under the top bar
  // (TOP_BAR) and the credentials card above it has left the frame; then the camera goes there.
  const scroll = clamp(usage.y - TOP_BAR - 12, 0, 600)
  // The usage stop frames the meters and the graph together: from just inside the card's left edge to the chart's right edge.
  const usageLeft = usage.x + 8
  const usageRight = chart.x + chart.w + 14
  const stops = {
    p: focus(demo.x + demo.w / 2, demo.y + demo.h / 2, fitZoom(demo, 1.08)),
    b: focus(button.x + button.w / 2, button.y + button.h / 2, ZOOM_BUTTON),
    c: focus(key.x + key.w / 2 + 40, key.y + key.h / 2 + 30, ZOOM_KEY),
    u: focus(
      (usageLeft + usageRight) / 2,
      (usage.y + chart.y + chart.h) / 2 - scroll,
      Math.min(ZOOM_USAGE_MAX, SCENE_W / (usageRight - usageLeft)),
      TOP_BAR,
    ),
  }
  const vars: Record<string, string | number> = { '--k': scale, '--scroll': `${-scroll}px` }
  for (const [name, s] of Object.entries(stops)) {
    vars[`--${name}-x`] = `${s.x}px`
    vars[`--${name}-y`] = `${s.y}px`
    vars[`--${name}-z`] = s.z
  }

  return (
    <div
      ref={stageRef}
      className={styles.stage}
      style={{ ...(vars as CSSProperties), height: SCENE_H * scale }}
      aria-hidden
      inert
    >
      <div key={replayKey} className={styles.scaler}>
        <div className={styles.camera}>
          <div ref={sceneRef} className={styles.scene}>
            <Sidebar activeId="mcp" />
            <TopBar title="MCP" className={styles.topbar} />
            <main className={styles.content}>
              {/* Before: the intro the dialog advertises. */}
              <div className={`${styles.layer} ${styles.pre}`}>
                <McpHeading live={false} />
                <div className={styles.stack}>
                  <McpIntro onActivate={noop} />
                  <CapabilityTable />
                </div>
              </div>
              {/* After Activate: the credentials and the usage graph (the "MCP post-activation" frame). */}
              <div className={`${styles.layer} ${styles.post}`}>
                <div className={styles.scroll}>
                  <McpHeading live />
                  <div className={styles.stack}>
                    <CredentialsCard
                      status="active"
                      apiKey={DEMO_KEY}
                      revealed
                      copied={null}
                      onToggleReveal={noop}
                      onCopyKey={noop}
                      onCopyUrl={noop}
                      onRefresh={noop}
                    />
                    <UsageCard usage={USAGE_ACTIVE} exhausted={false} />
                  </div>
                </div>
              </div>
            </main>
            {/* Dims the page round the demo panel while the camera is tight on it. */}
            <span
              className={styles.panelSpot}
              style={{ left: demo.x, top: demo.y, width: demo.w, height: demo.h }}
            />
            <span
              className={styles.ring}
              style={{ left: button.x - 7, top: button.y - 7, width: button.w + 14, height: button.h + 14 }}
            />
            <span
              className={styles.ripple}
              style={{ left: button.x, top: button.y, width: button.w, height: button.h }}
            />
            {/* The arrow's tip (at about 5,3 of its 30px box) lands on the right half of the button. */}
            <span
              className={styles.cursor}
              style={{ left: button.x + button.w * 0.72 - 6, top: button.y + button.h * 0.5 - 4 }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24">
                <path
                  d="M5 3l14 8.2-6.2 1.6L9.6 19 5 3z"
                  fill="#fff"
                  stroke="#111"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
