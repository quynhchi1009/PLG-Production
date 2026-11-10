import { KYB_PLANS } from '../../data/reports'
import type { ReportKind, ReportView } from '../../types'
import type { OrderConfig } from '../../types/order'
import { Card } from '../ui/Card'
import { TextTabs } from '../ui/TextTabs'
import { AddOnsSection } from './AddOnsSection'
import { CompareMatrix } from './CompareMatrix'
import { PlanCard } from './PlanCard'
import { PlanList } from './PlanList'
import { SampleReport } from './SampleReport'
import { UboOptions } from './UboOptions'
import type { useOrderConfig } from '../../hooks/useOrderConfig'
import styles from './ReportConfigurator.module.css'

type OrderApi = ReturnType<typeof useOrderConfig>

interface ReportConfiguratorProps {
  companyName: string
  config: OrderConfig
  api: OrderApi
}

const KYB_TABS: { value: ReportView; label: string }[] = [
  { value: 'configure', label: 'Configure' },
  { value: 'compare', label: 'Compare' },
]

export function sampleTitle(kind: ReportKind, planLabel: string) {
  return kind === 'UBO' ? 'UBO' : planLabel
}

/** Left-hand card on the order page: plan selection, add-ons and the sample preview */
export function ReportConfigurator({ companyName, config, api }: ReportConfiguratorProps) {
  const planLabel = KYB_PLANS.find((p) => p.id === config.plan)?.label ?? ''

  return (
    <Card className={styles.card}>
      <div className={styles.top}>
        <div className={styles.planHeader}>
          <h2 className={styles.heading}>{config.kind === 'KYB' ? 'Select a plan' : 'Report'}</h2>
          {config.kind === 'KYB' && (
            <TextTabs options={KYB_TABS} value={config.view} onChange={api.setView} />
          )}
        </div>

        {config.kind === 'KYB' && config.view === 'configure' && (
          <PlanList value={config.plan} onChange={api.setPlan} />
        )}
        {config.kind === 'KYB' && config.view === 'compare' && (
          <CompareMatrix value={config.plan} onChange={api.setPlan} />
        )}
        {config.kind === 'UBO' && (
          <PlanCard title="UBO" checked onSelect={() => undefined} />
        )}
      </div>

      <div className={styles.section}>
        {config.kind === 'KYB' && (
          <AddOnsSection
            companyName={companyName}
            config={config}
            onToggleAml={api.toggleAml}
            onAmlMatchTypeChange={api.setAmlMatchType}
            onToggleMonitoring={api.toggleMonitoring}
            onMonitoringChange={api.setMonitoring}
          />
        )}
        {config.kind === 'UBO' && (
          <UboOptions
            threshold={config.ubo.threshold}
            exploreLevel={config.ubo.exploreLevel}
            onThresholdChange={(threshold) => api.setUbo({ threshold })}
            onExploreLevelChange={(exploreLevel) => api.setUbo({ exploreLevel })}
          />
        )}
      </div>

      <div className={styles.section}>
        <SampleReport title={sampleTitle(config.kind, planLabel)} />
      </div>
    </Card>
  )
}
