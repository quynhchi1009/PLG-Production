export type DownloadStatus = 'processing' | 'completed'

/** One row in the Download Centre: a report file the user asked to download. */
export interface DownloadItem {
  id: string
  /** Order the report belongs to (`ORDERS` id) */
  orderId: string
  /** Epoch ms when Download was clicked */
  requestedAt: number
  businessName: string
  orderNo: string
  /** Jurisdiction id from `JURISDICTIONS` */
  jurisdiction: string
  reportTypes: string[]
  language: string
  /** Fixed status for seeded rows; requested rows derive theirs from `requestedAt` */
  status?: DownloadStatus
}

export interface DownloadFilters {
  status: string[]
  type: string[]
  jurisdiction: string[]
}
