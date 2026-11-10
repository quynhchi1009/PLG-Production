import type { Block, ReportPage } from '../../types/reportView'
import { Button } from '../ui/Button'
import { RiskGauge, RiskRadar } from './RiskCharts'
import styles from './PageContent.module.css'

/** One page of a report: a green section band, then its blocks. A group with one page shows the page title. */
export function PageContent({ page }: { page: ReportPage }) {
  return (
    <article className={styles.page} aria-labelledby="report-page-title">
      <h2 id="report-page-title" className={styles.band}>
        {page.groupTitle}
      </h2>
      {page.blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </article>
  )
}

function BlockView({ block }: { block: Block }) {
  switch (block.t) {
    case 'subhead':
      return <h3 className={styles.subhead}>{block.text}</h3>
    case 'text':
      return <p className={styles.text}>{block.text}</p>
    case 'stats':
      return (
        <dl className={styles.stats}>
          {block.items.map((s) => (
            <div key={s.label} className={styles.stat}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      )
    case 'risk':
      return (
        <div className={styles.risk}>
          <RiskGauge level={block.overall} />
          <RiskRadar axes={block.axes} />
        </div>
      )
    case 'kv':
      return (
        <dl className={styles.kv}>
          {block.rows.map(([k, v]) => (
            <div key={k} className={styles.kvRow}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      )
    case 'table':
      return (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {block.columns.map((c) => (
                  <th key={c}>{c}</th>
                ))}
                {block.action && <th className={styles.actionCell}>Action</th>}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                  {block.action && (
                    <td className={styles.actionCell}>
                      <Button variant="link" aria-label={`${block.action} ${r[0]}`}>
                        {block.action}
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'callout':
      return (
        <div className={[styles.callout, styles[block.tone]].join(' ')} role="note">
          <strong>{block.title}</strong>
          <span>{block.text}</span>
        </div>
      )
    case 'empty':
      return <p className={styles.empty}>{block.text}</p>
  }
}
