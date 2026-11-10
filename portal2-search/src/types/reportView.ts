import type { ReportOrder } from './reports'

/**
 * One viewable document inside an order. KYB LITE, BASIC, BASIC PLUS and ADVANCE/COMPLETE are
 * different products with different sections, so each gets its own kind rather than a flag.
 */
export type ReportDocKind =
  | 'kyb-lite'
  | 'kyb-basic'
  | 'kyb-basic-plus'
  | 'kyb-advance'
  | 'ubo'
  | 'legal'
  | 'aml'
  | 'monitoring'

export type RiskLevel = 'low' | 'moderate' | 'high'

export type Block =
  | { t: 'subhead'; text: string }
  | { t: 'text'; text: string }
  | { t: 'stats'; items: { label: string; value: string }[] }
  | { t: 'risk'; overall: RiskLevel; axes: { label: string; level: RiskLevel }[] }
  | { t: 'kv'; rows: [string, string][] }
  | { t: 'table'; columns: string[]; rows: string[][]; action?: string }
  | { t: 'callout'; tone: 'positive' | 'neutral' | 'negative'; title: string; text: string }
  | { t: 'empty'; text: string }

export interface ReportPage {
  id: string
  groupId: string
  groupTitle: string
  title: string
  blocks: Block[]
}

export interface OutlineGroup {
  id: string
  title: string
  pages: { id: string; title: string; index: number }[]
}

export interface ReportDoc {
  kind: ReportDocKind
  /** Label on the "View Report(s)" button */
  label: string
  /** Name of the product, shown on the cover page */
  product: string
  pages: ReportPage[]
  outline: OutlineGroup[]
  /** Only the KYB ADVANCE / COMPLETE report ends in an onboarding recommendation */
  hasRecommendation: boolean
}

export type ViewerOrderState = 'ready' | 'processing' | 'unavailable'

export interface ViewerOrder {
  order: ReportOrder
  state: ViewerOrderState
  docs: ReportDoc[]
}
