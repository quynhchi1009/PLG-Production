export type OrderStatus =
  | 'processing'
  | 'completed'
  | 'active'
  | 'not-found'
  | 'unfulfilled'
  | 'cancelled'

export interface ReportOrder {
  id: string
  orderNo: string
  /** Local ISO timestamp, `YYYY-MM-DDTHH:mm` */
  placedAt: string
  businessName: string
  regNo: string
  /** Jurisdiction id from `JURISDICTIONS` */
  jurisdiction: string
  reportTypes: string[]
  status: OrderStatus
}

export interface ReportFilters {
  status: string[]
  type: string[]
  jurisdiction: string[]
  /** Quick range id from `DATE_RANGES` */
  range: string | null
}

export type ReportsViewStatus = 'idle' | 'loading'
export type SortKey = 'date' | 'name'
export type SortDir = 'asc' | 'desc'
