export interface Jurisdiction {
  id: string
  name: string
  /** ISO 3166-1 alpha-2 code, used by flag-icons */
  code: string
}

export interface Company {
  name: string
  regNo: string
}

export type SearchStatus =
  | 'idle'
  | 'loading'
  | 'results'
  | 'no-results'
  | 'min-chars'
  | 'jurisdiction-required'

export type ReportKind = 'KYB' | 'UBO'
export type ReportView = 'configure' | 'compare'
export type KybPlanId = 'lite' | 'basic' | 'complete'

export interface KybPlan {
  id: KybPlanId
  label: string
  description: string
}

export interface CompareRow {
  label: string
  /** Which plans include this feature */
  plans: KybPlanId[]
  hint?: boolean
}

export interface CompareGroup {
  title: string
  rows: CompareRow[]
}
