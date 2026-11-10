import { Check, HelpCircle } from 'lucide-react'
import { COMPARE_GROUPS, KYB_PLANS } from '../../data/reports'
import type { KybPlanId } from '../../types'
import styles from './CompareMatrix.module.css'

interface CompareMatrixProps {
  value: KybPlanId
  onChange: (id: KybPlanId) => void
}

/** Feature comparison table across KYB plans; the radio under each plan selects it */
export function CompareMatrix({ value, onChange }: CompareMatrixProps) {
  return (
    <div className={styles.matrix}>
      <div className={`${styles.row} ${styles.head}`} role="radiogroup" aria-label="KYB report">
        <span />
        {KYB_PLANS.map((plan) => (
          <label key={plan.id} className={styles.planCol}>
            <span className={styles.planLabel}>{plan.label}</span>
            <input
              type="radio"
              name="compare-plan"
              className={styles.native}
              checked={value === plan.id}
              onChange={() => onChange(plan.id)}
            />
            <span className={[styles.radio, value === plan.id && styles.on].filter(Boolean).join(' ')}>
              {value === plan.id && <span className={styles.dot} />}
            </span>
          </label>
        ))}
      </div>

      {COMPARE_GROUPS.map((group) => (
        <section key={group.title}>
          <h3 className={styles.group}>{group.title}</h3>
          {group.rows.map((row) => (
            <div key={row.label} className={styles.row}>
              <span className={styles.rowLabel}>
                {row.label}
                {row.hint && <HelpCircle size={14} className={styles.hint} aria-hidden />}
              </span>
              {KYB_PLANS.map((plan) => (
                <span key={plan.id} className={styles.cell}>
                  {row.plans.includes(plan.id) ? (
                    <Check size={20} strokeWidth={2.5} className={styles.check} aria-label="Included" />
                  ) : (
                    <span className={styles.srOnly}>Not included</span>
                  )}
                </span>
              ))}
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}
