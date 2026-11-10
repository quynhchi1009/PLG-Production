import { useState } from 'react'
import { Bookmark, ChevronDown, ChevronUp } from 'lucide-react'
import type { ReportDoc } from '../../types/reportView'
import styles from './JumpNav.module.css'

/** Share recommendation choices, as on the advanced KYB report. */
const RECOMMENDATIONS = [
  { id: 'onboard', label: 'Onboard' },
  { id: 'review', label: 'Review Before Onboarding' },
]

interface JumpNavProps {
  doc: ReportDoc
  pageIndex: number
  recommendation: string | null
  onSelect: (index: number) => void
  onRecommend: (id: string) => void
}

/**
 * Jump-to-section outline built from the report's own pages, so each report type shows only the
 * sections it has. The group holding the current page stays open; others open on demand.
 */
export function JumpNav({ doc, pageIndex, recommendation, onSelect, onRecommend }: JumpNavProps) {
  const [opened, setOpened] = useState<Set<string>>(new Set())
  const toggle = (id: string) =>
    setOpened((s) => {
      const next = new Set(s)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <nav className={styles.nav} aria-label="Jump to section">
      <h3 className={styles.heading}>Jump to section</h3>
      <ul className={styles.list}>
        {doc.outline.map((g) => {
          const isLeaf = g.pages.length === 1 && g.pages[0].title === g.title
          const hasCurrent = g.pages.some((p) => p.index === pageIndex)
          if (isLeaf) {
            return (
              <li key={g.id}>
                <button
                  type="button"
                  className={[styles.row, hasCurrent && styles.current].filter(Boolean).join(' ')}
                  aria-current={hasCurrent ? 'location' : undefined}
                  onClick={() => onSelect(g.pages[0].index)}
                >
                  {g.title}
                </button>
              </li>
            )
          }
          const open = hasCurrent || opened.has(g.id)
          const Chevron = open ? ChevronUp : ChevronDown
          return (
            <li key={g.id}>
              <button
                type="button"
                className={[styles.row, styles.group, hasCurrent && styles.groupCurrent].filter(Boolean).join(' ')}
                aria-expanded={open}
                onClick={() => !hasCurrent && toggle(g.id)}
              >
                <span>{g.title}</span>
                <Chevron size={18} aria-hidden />
              </button>
              {open && (
                <ul className={styles.children}>
                  {g.pages.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        className={[styles.row, styles.child, p.index === pageIndex && styles.currentChild]
                          .filter(Boolean)
                          .join(' ')}
                        aria-current={p.index === pageIndex ? 'location' : undefined}
                        onClick={() => onSelect(p.index)}
                      >
                        {p.title}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>

      {doc.hasRecommendation && (
        <section className={styles.recommend} aria-label="Share recommendation">
          <h3 className={styles.heading}>Share recommendation</h3>
          {RECOMMENDATIONS.map((r) => (
            <button
              key={r.id}
              type="button"
              className={styles.recoRow}
              aria-pressed={recommendation === r.id}
              onClick={() => onRecommend(r.id)}
            >
              <Bookmark size={18} aria-hidden fill={recommendation === r.id ? 'currentColor' : 'none'} />
              {r.label}
            </button>
          ))}
        </section>
      )}
    </nav>
  )
}
