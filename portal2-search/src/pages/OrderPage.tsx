import { AppShell } from '../components/layout/AppShell'
import { CompanyHeader } from '../components/order/CompanyHeader'
import { ReportConfigurator } from '../components/order/ReportConfigurator'
import { ReportSummary } from '../components/order/ReportSummary'
import { RadioPillGroup } from '../components/ui/RadioPill'
import { JURISDICTIONS } from '../data/jurisdictions'
import { useOrderConfig } from '../hooks/useOrderConfig'
import type { ReportKind } from '../types'
import type { OrderConfig } from '../types/order'
import styles from './OrderPage.module.css'

const KIND_OPTIONS: { value: ReportKind; label: string }[] = [
  { value: 'KYB', label: 'KYB' },
  { value: 'UBO', label: 'UBO' },
]

/** Pre-baked states for `#/search/order?state=<key>` (design/QA parity). */
export const ORDER_STATES: Record<string, { label: string; seed: Partial<OrderConfig> }> = {
  'kyb-lite': { label: 'KYB Lite', seed: {} },
  'kyb-compare': { label: 'Compare plans', seed: { view: 'compare' } },
  'kyb-addons': {
    label: 'Add-ons on',
    seed: {
      aml: { enabled: true, matchType: 'Exact Match' },
      monitoring: { enabled: true, frequency: '30 (1 month)', expiry: '2027-01-31' },
    },
  },
  'kyb-complete': { label: 'KYB Complete (add-ons locked)', seed: { plan: 'complete' } },
  ubo: { label: 'UBO', seed: { kind: 'UBO' } },
}

interface OrderPageProps {
  params: URLSearchParams
}

export function OrderPage({ params }: OrderPageProps) {
  const name = params.get('name') ?? 'SAMPLE HOLDINGS PTE. LTD.'
  const regNo = params.get('regNo') ?? '202400000A'
  const jurisdiction = JURISDICTIONS.find((j) => j.id === params.get('country'))
  const stateKey = params.get('state')
  const api = useOrderConfig(stateKey ? ORDER_STATES[stateKey]?.seed : undefined)

  return (
    <AppShell title="Choose a report" activeNav="search">
      <div className={styles.page}>
        <header className={styles.header}>
          <CompanyHeader name={name} regNo={regNo} jurisdiction={jurisdiction} />
          <RadioPillGroup
            aria-label="Report type"
            options={KIND_OPTIONS}
            value={api.config.kind}
            onChange={api.setKind}
          />
        </header>
        <div className={styles.columns}>
          <ReportConfigurator companyName={name} config={api.config} api={api} />
          <ReportSummary config={api.config} onGenerate={() => undefined} onAddToCart={() => undefined} />
        </div>
      </div>
    </AppShell>
  )
}
