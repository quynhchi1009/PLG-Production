import type { RiskLevel } from '../../types/reportView'
import { RISK_LABEL } from '../../data/reportView'
import styles from './RiskCharts.module.css'

/** Lower risk plots further out on the radar and fills more of the gauge. */
const SCORE: Record<RiskLevel, number> = { low: 1, moderate: 0.75, high: 0.5 }
const TONE: Record<RiskLevel, string> = {
  low: 'var(--av-positive)',
  moderate: 'var(--av-warning)',
  high: 'var(--av-negative)',
}

const polar = (cx: number, cy: number, r: number, deg: number) => {
  const a = (deg * Math.PI) / 180
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

/** 270° ring open at the bottom; the filled part is the share of the ring that is "safe". */
export function RiskGauge({ level }: { level: RiskLevel }) {
  const size = 240
  const c = size / 2
  const r = 100
  const start = 135
  const sweep = 270
  const fill = sweep * (level === 'low' ? 0.7 : level === 'moderate' ? 0.5 : 0.3)
  const arc = (from: number, to: number) => {
    const a = polar(c, c, r, from)
    const b = polar(c, c, r, to)
    return `M ${a.x} ${a.y} A ${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${b.x} ${b.y}`
  }
  return (
    <figure className={styles.gauge}>
      <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Overall risk: ${RISK_LABEL[level]}`}>
        <path d={arc(start, start + sweep)} className={styles.track} />
        <path d={arc(start, start + fill)} stroke={TONE[level]} className={styles.value} />
        <text x={c} y={c + 6} textAnchor="middle" className={styles.gaugeLabel} fill={TONE[level]}>
          {RISK_LABEL[level]}
        </text>
      </svg>
    </figure>
  )
}

interface RadarProps {
  axes: { label: string; level: RiskLevel }[]
}

/** One spoke per risk factor, clockwise from the top. */
export function RiskRadar({ axes }: RadarProps) {
  const w = 460
  const h = 360
  const cx = w / 2
  const cy = 180
  const R = 120
  const angle = (i: number) => -90 + (360 / axes.length) * i
  const ring = (k: number) =>
    axes.map((_, i) => polar(cx, cy, R * k, angle(i))).map((p) => `${p.x},${p.y}`).join(' ')
  const shape = axes
    .map((a, i) => polar(cx, cy, R * SCORE[a.level], angle(i)))
    .map((p) => `${p.x},${p.y}`)
    .join(' ')

  return (
    <figure className={styles.radar}>
      <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Risk factors">
        {[1, 2 / 3, 1 / 3].map((k) => (
          <polygon key={k} points={ring(k)} className={styles.ring} />
        ))}
        {axes.map((_, i) => {
          const p = polar(cx, cy, R, angle(i))
          return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} className={styles.spoke} />
        })}
        <polygon points={shape} className={styles.shape} />
        {axes.map((a, i) => {
          const dot = polar(cx, cy, R * SCORE[a.level], angle(i))
          const lab = polar(cx, cy, R + 22, angle(i))
          const side = Math.abs(lab.x - cx) < 4 ? 'middle' : lab.x > cx ? 'start' : 'end'
          const dy = Math.abs(lab.y - cy) > R + 10 ? (lab.y < cy ? -2 : 12) : 4
          return (
            <g key={a.label}>
              <circle cx={dot.x} cy={dot.y} r={6} stroke={TONE[a.level]} className={styles.dot} />
              <text x={lab.x + (side === 'start' ? 6 : side === 'end' ? -6 : 0)} y={lab.y + dy} textAnchor={side} className={styles.axisLabel}>
                {a.label}
              </text>
            </g>
          )
        })}
      </svg>
      <figcaption className={styles.legend}>
        {(['high', 'moderate', 'low'] as RiskLevel[]).map((l) => (
          <span key={l} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ borderColor: TONE[l] }} aria-hidden />
            {RISK_LABEL[l]}
          </span>
        ))}
      </figcaption>
    </figure>
  )
}
