import { useLayoutEffect, useRef, useState } from 'react'
import type { McpChartSeries } from '../../types/mcp'
import styles from './UsageChart.module.css'

interface UsageChartProps {
  days: string[]
  series: McpChartSeries[]
}

/* Geometry measured from the 400×300 chart widget in the design. */
const W = 400
const H = 300
const X0 = 60
const X1 = 360
const BASE = 252.5
const STEP_Y = 51
const GRID_LINES = 4
const FIRST_X = 81.43
const STEP_X = 42.857
const TICK_PX = 12

const px = (i: number) => FIRST_X + i * STEP_X

/** Smallest 1/2/5 × 10ⁿ step (min 1) that lets four gridline intervals cover `max`; the drawn 0–4 axis is the step-1 case. */
function niceStep(max: number) {
  const raw = Math.max(1, max / GRID_LINES)
  const pow = 10 ** Math.floor(Math.log10(raw))
  const m = raw / pow
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * pow
}

export function UsageChart({ days, series }: UsageChartProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  // The SVG scales with its container; counter-scale the tick text so it stays 12px on screen.
  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const update = () => setScale(Math.min(1, el.clientWidth / W) || 1)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const tickSize = TICK_PX / scale
  // One shared axis for both series, so a spent allowance (tens of calls a day) still fits the same four gridlines.
  const step = niceStep(Math.max(0, ...series.flatMap((s) => s.values)))
  const ticks = Array.from({ length: GRID_LINES + 1 }, (_, i) => i * step)
  const py = (v: number) => BASE - (v / step) * STEP_Y
  const summary = series.map((s) => `${s.label}: ${s.values.join(', ')}`).join('. ')
  return (
    <div ref={wrapRef} className={styles.wrap}>
      <ul className={styles.legend}>
        {series.map((s) => (
          <li key={s.id} className={styles.legendItem}>
            <span className={styles.swatch} style={{ background: s.color }} aria-hidden />
            {s.label}
          </li>
        ))}
      </ul>
      <svg className={styles.chart} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Calls per day, Monday to Sunday. ${summary}`}>
        {ticks.map((v) => (
          <g key={v}>
            <line x1={X0} x2={X1} y1={py(v)} y2={py(v)} className={v === 0 ? styles.axis : styles.grid} />
            <text x={X0 - 12} y={py(v) + tickSize / 3} textAnchor="end" className={styles.tick} fontSize={tickSize}>
              {v}
            </text>
          </g>
        ))}

        {days.map((d, i) => (
          <text key={d} x={px(i)} y={252.5 + 16 + tickSize / 4} textAnchor="middle" className={styles.tick} fontSize={tickSize}>
            {d}
          </text>
        ))}

        {series.map((s) => (
          <g key={s.id}>
            <polyline
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeLinejoin="round"
              points={s.values.map((v, i) => `${px(i)},${py(v)}`).join(' ')}
            />
            {s.values.map((v, i) => (
              <circle key={i} cx={px(i)} cy={py(v)} r={3} fill="#fff" stroke={s.color} strokeWidth={1.5} />
            ))}
          </g>
        ))}
      </svg>
    </div>
  )
}
