import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { CapabilityTable } from '../mcp/CapabilityTable'
import { McpHeading } from '../mcp/McpHeading'
import { McpIntro } from '../mcp/McpIntro'
import { Sidebar } from '../layout/Sidebar'
import { TopBar } from '../layout/TopBar'
import styles from './McpPreviewVideo.module.css'

/** Design-space size of the scene: a 1440px-wide desktop window. It is scaled to whatever width the dialog gives it. */
const SCENE_W = 1440
const SCENE_H = 860
/** How far the camera pushes in on the button. */
const ZOOM = 2.8

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

const noop = () => undefined

/**
 * The clip behind the MCP announcement. Same camera move as the Perpetual KYB announcement it is modelled on:
 * a wide shot of the whole pre-activation MCP screen with a ring already around "Activate MCP - Free Beta Access",
 * a push-in on the button with the rest of the screen dimmed, a hold in which a cursor clicks the button, then a pull
 * back out to the wide shot.
 * The screen is the real page (its own components on a fixed 1440×860 canvas), moved by CSS keyframes, so it stays sharp
 * at any zoom and needs no video file. Decorative and inert: the dialog's own text says the same thing.
 */
export function McpPreviewVideo({ replayKey }: McpPreviewVideoProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)
  const [button, setButton] = useState<Box>({ x: 370, y: 353, w: 282, h: 46 })

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

  // Find the Activate button on the canvas, so the ring and the camera land on it whatever the copy or fonts do to the layout.
  useLayoutEffect(() => {
    const measure = () => {
      const root = sceneRef.current
      const btn = root?.querySelector<HTMLElement>('[data-mcp-activate]')
      if (root && btn) setButton(boxWithin(btn, root))
    }
    measure()
    // Web fonts can re-wrap the paragraph above the button, so measure again once they are in.
    void document.fonts?.ready.then(measure)
  }, [])

  // Camera end position: the button centred in the frame, clamped so the camera never shows past the canvas edges.
  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
  const tx = clamp(SCENE_W / 2 - (button.x + button.w / 2) * ZOOM, SCENE_W - SCENE_W * ZOOM, 0)
  const ty = clamp(SCENE_H / 2 - (button.y + button.h / 2) * ZOOM, SCENE_H - SCENE_H * ZOOM, 0)

  const vars = { '--k': scale, '--zoom': ZOOM, '--tx': `${tx}px`, '--ty': `${ty}px` } as CSSProperties

  return (
    <div ref={stageRef} className={styles.stage} style={{ ...vars, height: SCENE_H * scale }} aria-hidden inert>
      <div key={replayKey} className={styles.scaler}>
        <div className={styles.camera}>
          <div ref={sceneRef} className={styles.scene}>
            <Sidebar activeId="mcp" />
            <TopBar title="MCP" className={styles.topbar} />
            <main className={styles.content}>
              <McpHeading live={false} />
              <div className={styles.stack}>
                <McpIntro onActivate={noop} />
                <CapabilityTable />
              </div>
            </main>
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
