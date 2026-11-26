import type { DownloadItem, DownloadStatus } from '../types/downloads'
import { ORDERS } from './orders'

/**
 * Download Centre data. Live behaviour (from the captured Download Centre screen): each row shows the request
 * date, the report, its status and an expiry date 3 days after the request.
 *
 * Mock behaviour: a requested report stays "Processing" until READY_AFTER_MS has passed, then shows "Completed"
 * the next time the page loads (the confirmation tells the user to refresh). Live takes "a few minutes";
 * the demo uses one minute so the flow can be tried end to end.
 */
export const READY_AFTER_MS = 60_000
export const EXPIRY_MS = 3 * 864e5

export const DOWNLOAD_STATUSES: { value: DownloadStatus; label: string }[] = [
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
]

const STORAGE_KEY = 'av-downloads-v1'

/** Builds a Download Centre row for an order. Business name matches how the report viewer titles it. */
export function makeDownload(orderId: string, requestedAt: number, status?: DownloadStatus): DownloadItem | undefined {
  const order = ORDERS.find((o) => o.id === orderId)
  if (!order) return undefined
  return {
    id: `dl-${orderId}-${requestedAt}`,
    orderId,
    requestedAt,
    businessName: `${order.businessName} CO. LIMITED`,
    orderNo: order.orderNo,
    jurisdiction: order.jurisdiction,
    reportTypes: order.reportTypes,
    language: 'EN',
    status,
  }
}

/** Fictional history so the page is not empty before the first download. */
export const SEED_DOWNLOADS: DownloadItem[] = [
  makeDownload('order-1', new Date('2026-10-28T13:08').getTime(), 'completed'),
  makeDownload('order-4', new Date('2026-10-24T09:12').getTime(), 'completed'),
].filter((d): d is DownloadItem => Boolean(d))

function readRequested(): DownloadItem[] {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as DownloadItem[]) : []
  } catch {
    return []
  }
}

/** Requested downloads (newest first) followed by the seeded history. */
export function loadDownloads(): DownloadItem[] {
  return [...readRequested(), ...SEED_DOWNLOADS]
}

/** Records a download request for an order and returns its row id. */
export function requestDownload(orderId: string): string | undefined {
  const item = makeDownload(orderId, Date.now())
  if (!item) return undefined
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify([item, ...readRequested()]))
  } catch {
    // Storage unavailable (private mode): the redirect and confirmation still work, the row just won't persist.
  }
  return item.id
}

export function downloadStatus(item: DownloadItem, now: number): DownloadStatus {
  return item.status ?? (now - item.requestedAt >= READY_AFTER_MS ? 'completed' : 'processing')
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Live format: "29/Oct/2026" over "1:08PM". */
export function formatDownloadDate(ms: number): { date: string; time: string } {
  const d = new Date(ms)
  const h = d.getHours()
  const time = `${h % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')}${h < 12 ? 'AM' : 'PM'}`
  return {
    date: `${String(d.getDate()).padStart(2, '0')}/${MONTHS[d.getMonth()]}/${d.getFullYear()}`,
    time,
  }
}
