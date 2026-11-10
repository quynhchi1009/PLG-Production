import type { OrderConfig } from '../../types/order'
import { AmlAddOn } from './AmlAddOn'
import { MonitoringAddOn } from './MonitoringAddOn'
import { SectionTitle } from './SectionTitle'

interface AddOnsSectionProps {
  companyName: string
  config: OrderConfig
  onToggleAml: (enabled: boolean) => void
  onAmlMatchTypeChange: (value: string | null) => void
  onToggleMonitoring: (enabled: boolean) => void
  onMonitoringChange: (patch: Partial<OrderConfig['monitoring']>) => void
}

/** "Add-ons" block shown under the KYB plans. Locked when KYB COMPLETE already includes them. */
export function AddOnsSection({
  companyName,
  config,
  onToggleAml,
  onAmlMatchTypeChange,
  onToggleMonitoring,
  onMonitoringChange,
}: AddOnsSectionProps) {
  const locked = config.plan === 'complete'
  return (
    <section>
      <SectionTitle>Add-ons</SectionTitle>
      <AmlAddOn
        companyName={companyName}
        enabled={config.aml.enabled}
        matchType={config.aml.matchType}
        locked={locked}
        onToggle={onToggleAml}
        onMatchTypeChange={onAmlMatchTypeChange}
      />
      <MonitoringAddOn
        companyName={companyName}
        enabled={config.monitoring.enabled}
        frequency={config.monitoring.frequency}
        expiry={config.monitoring.expiry}
        locked={locked}
        onToggle={onToggleMonitoring}
        onFrequencyChange={(frequency) => onMonitoringChange({ frequency })}
        onExpiryChange={(expiry) => onMonitoringChange({ expiry })}
      />
    </section>
  )
}
