import type { ReactNode } from 'react'
import { FileCheck2, FileSearch, FileText } from 'lucide-react'
import { KYB_PLANS } from '../../data/reports'
import type { KybPlanId } from '../../types'
import { PlanCard } from './PlanCard'
import styles from './PlanList.module.css'

const PLAN_ICONS: Record<KybPlanId, ReactNode> = {
  lite: <FileText size={24} />,
  basic: <FileSearch size={24} />,
  complete: <FileCheck2 size={24} />,
}

interface PlanListProps {
  value: KybPlanId
  onChange: (id: KybPlanId) => void
}

export function PlanList({ value, onChange }: PlanListProps) {
  return (
    <div role="radiogroup" aria-label="KYB report" className={styles.list}>
      {KYB_PLANS.map((plan) => (
        <PlanCard
          key={plan.id}
          title={plan.label}
          description={plan.description}
          icon={PLAN_ICONS[plan.id]}
          checked={value === plan.id}
          onSelect={() => onChange(plan.id)}
        />
      ))}
    </div>
  )
}
