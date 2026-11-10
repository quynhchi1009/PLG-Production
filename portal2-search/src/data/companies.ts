import type { Company } from '../types'

/**
 * Fictional sample registry entries. The live portal returns real registry
 * records; this mock set is intentionally made up so no customer or registry
 * data lives in the repo.
 */
const NAMES = [
  'NORTHGATE TECH',
  'BLUEFIN TECH',
  'ORCHID TECH',
  'KESTREL TECH',
  'LUMEN TECH',
  'HARBOUR TECH',
  'PIONEER TECH',
  'SUMMIT TECH',
  'CEDAR TECH',
  'VERTEX TECH',
  'MERLION TECH',
  'AURORA TECH',
  'BAMBOO TECH',
  'COBALT TECH',
  'DELTA TECH',
  'EMBER TECH',
  'FALCON TECH',
  'GLACIER TECH',
  'HORIZON TECH',
  'IVORY TECH',
  'NORTHGATE MARINE',
  'BLUEFIN MARINE',
  'ORCHID MARINE',
  'KESTREL MARINE',
  'LUMEN MARINE',
  'HARBOUR MARINE',
  'PIONEER MARINE',
  'SUMMIT MARINE',
  'CEDAR MARINE',
  'VERTEX MARINE',
  'MERLION MARINE',
  'AURORA MARINE',
  'BAMBOO MARINE',
  'COBALT MARINE',
  'DELTA MARINE',
  'EMBER MARINE',
  'FALCON MARINE',
  'GLACIER MARINE',
  'HORIZON MARINE',
  'IVORY MARINE',
]

export const COMPANIES: Company[] = NAMES.map((name, i) => ({
  name,
  regNo: `2024${String(10000 + i * 137).padStart(5, '0')}${'ABCDEFGHJK'[i % 10]}`,
}))

/** Mock registry lookup: case-insensitive match on name or registration number. */
export function searchCompanies(query: string): Company[] {
  const q = query.trim().toLowerCase()
  return COMPANIES.filter(
    (c) => c.name.toLowerCase().includes(q) || c.regNo.toLowerCase().includes(q),
  )
}
