import checkBadge from '../../assets/mcp/check-badge.svg'
import info from '../../assets/mcp/info.svg'
import { MCP_INTRO } from '../../data/mcp'
import { McpDemo } from './McpDemo'
import styles from './McpIntro.module.css'

interface McpIntroProps {
  onActivate: () => void
}

/** Pre-activation hero: pitch + activate CTA on the left, dark terminal demo on the right. */
export function McpIntro({ onActivate }: McpIntroProps) {
  return (
    <section className={styles.hero} aria-labelledby="mcp-intro-title">
      <div className={styles.pitch}>
        <h2 id="mcp-intro-title" className={styles.heading}>
          {MCP_INTRO.heading}
        </h2>
        <p className={styles.body}>
          {MCP_INTRO.body}
        </p>
        <button type="button" className={styles.cta} data-mcp-activate onClick={onActivate}>
          {MCP_INTRO.cta}
          <img src={checkBadge} alt="" width={16} height={16} />
        </button>
        <div className={styles.toast} role="note">
          <span className={styles.toastBar} aria-hidden />
          <img src={info} alt="" width={20} height={20} className={styles.toastIcon} />
          <p className={styles.toastText}>
            <strong>{MCP_INTRO.toastLead}</strong>
            {MCP_INTRO.toastText}
          </p>
        </div>
      </div>

      <McpDemo />
    </section>
  )
}
