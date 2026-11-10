import warning from '../../assets/mcp/alert-warning.svg'
import styles from './LimitAlert.module.css'

/** Allowance-spent banner. The "Client Success Rep" line lives here (the next step) rather than as a footnote under the chart. */
export function LimitAlert() {
  return (
    <div className={styles.alert} role="alert">
      <img src={warning} alt="" width={16} height={16} />
      <div className={styles.text}>
        <p className={styles.message}>
          Free allowance used up. You've used all your free searches and lite reports. Tool calls will return{' '}
          <code className={styles.code}>quota_exceeded</code> until we top you up.
        </p>
        <p className={styles.help}>Speak to your Client Success Rep for more access</p>
      </div>
    </div>
  )
}
