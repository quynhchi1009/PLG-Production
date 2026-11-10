import type { KybPlanId, ReportKind, ReportView } from './index'

export interface OrderConfig {
  kind: ReportKind
  view: ReportView
  plan: KybPlanId
  aml: { enabled: boolean; matchType: string | null }
  monitoring: { enabled: boolean; frequency: string | null; expiry: string }
  ubo: { threshold: string; exploreLevel: string }
}
