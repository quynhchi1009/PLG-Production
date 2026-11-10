import type { OrderStatus, ReportOrder } from '../types/reports'

/**
 * Fictional order history. The live portal lists a customer's real orders; this set is made
 * up so no customer, company or registry data lives in the repo.
 */

/** The mock "today": keeps the quick date ranges deterministic. */
export const NOW = new Date('2026-10-28T12:00:00')

export const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'active', label: 'Active' },
  { value: 'not-found', label: 'Not found' },
  { value: 'unfulfilled', label: 'Unfulfilled' },
  { value: 'cancelled', label: 'Cancelled' },
]

export const REPORT_TYPES = [
  'KYB LITE',
  'KYB BASIC',
  'KYB ADVANCE',
  'UBO',
  'Legal Documents',
  'AML',
  'MONITORING',
  'KYB COMPLETE',
  'KYB BASIC PLUS',
]

export const DATE_RANGES = [
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'week', label: 'This week' },
  { value: 'month', label: 'This month' },
  { value: 'year', label: 'This year' },
]

type Row = [string, string, string, string[], OrderStatus]

// placedAt, business name, jurisdiction id, report types, status
const ROWS: Row[] = [
  ['2026-10-28T10:10', 'NORTHGATE TECH', 'hk', ['KYB COMPLETE'], 'completed'],
  ['2026-10-26T14:12', 'BLUEFIN MARINE', 'cn', ['AML', 'KYB BASIC'], 'completed'],
  ['2026-10-26T09:41', 'ORCHID TECH', 'sg', ['KYB LITE'], 'processing'],
  ['2026-10-23T16:05', 'KESTREL MARINE', 'jp', ['UBO'], 'completed'],
  ['2026-10-21T11:30', 'LUMEN TECH', 'tw', ['KYB ADVANCE'], 'completed'],
  ['2026-10-19T08:55', 'HARBOUR MARINE', 'kr', ['Legal Documents'], 'unfulfilled'],
  ['2026-10-15T17:20', 'PIONEER TECH', 'sg', ['KYB BASIC PLUS', 'MONITORING'], 'active'],
  ['2026-10-12T13:02', 'SUMMIT MARINE', 'in', ['KYB LITE'], 'completed'],
  ['2026-10-09T10:48', 'CEDAR TECH', 'vn', ['KYB BASIC'], 'not-found'],
  ['2026-10-05T15:37', 'VERTEX MARINE', 'au', ['KYB COMPLETE', 'MONITORING'], 'active'],
  ['2026-09-30T09:15', 'MERLION TECH', 'sg', ['AML'], 'completed'],
  ['2026-09-24T12:44', 'AURORA MARINE', 'th', ['KYB LITE'], 'cancelled'],
  ['2026-09-18T16:59', 'BAMBOO TECH', 'nz', ['KYB BASIC'], 'completed'],
  ['2026-09-11T11:21', 'COBALT MARINE', 'hk', ['UBO', 'KYB BASIC'], 'completed'],
  ['2026-08-29T14:08', 'DELTA TECH', 'cn', ['KYB ADVANCE'], 'completed'],
  ['2026-08-14T10:26', 'EMBER MARINE', 'jp', ['KYB LITE'], 'completed'],
  ['2026-07-22T09:03', 'FALCON TECH', 'tw', ['Legal Documents'], 'completed'],
  ['2026-06-17T15:51', 'GLACIER MARINE', 'kr', ['KYB COMPLETE'], 'completed'],
  ['2026-05-08T13:34', 'HORIZON TECH', 'in', ['KYB BASIC PLUS'], 'completed'],
  ['2026-03-02T10:12', 'IVORY MARINE', 'au', ['KYB LITE'], 'completed'],
]

export const ORDERS: ReportOrder[] = ROWS.map(([placedAt, businessName, jurisdiction, reportTypes, status], i) => ({
  id: `order-${i + 1}`,
  orderNo: `${placedAt.replace(/\D/g, '')}${String(10 + i * 7).padStart(2, '0')}`,
  placedAt,
  businessName,
  regNo: `2024${String(10000 + i * 211).padStart(5, '0')}${'ABCDEFGHJK'[i % 10]}`,
  jurisdiction,
  reportTypes,
  status,
}))

/** KYB orders that do not already include AML can have it added afterwards. */
export function canAddAml(order: ReportOrder): boolean {
  const { reportTypes: types, status } = order
  return (
    status === 'completed' &&
    types.some((t) => t.startsWith('KYB')) &&
    !types.includes('AML') &&
    !types.includes('KYB COMPLETE')
  )
}

export function inQuickRange(placedAt: string, range: string): boolean {
  const d = new Date(placedAt)
  const startOfDay = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate())
  switch (range) {
    case 'today':
      return d >= startOfDay
    case '7d':
      return d >= new Date(startOfDay.getTime() - 6 * 864e5)
    case '30d':
      return d >= new Date(startOfDay.getTime() - 29 * 864e5)
    case 'week':
      return d >= new Date(startOfDay.getTime() - startOfDay.getDay() * 864e5)
    case 'month':
      return d >= new Date(NOW.getFullYear(), NOW.getMonth(), 1)
    case 'year':
      return d >= new Date(NOW.getFullYear(), 0, 1)
    default:
      return true
  }
}
