/** `inactive` = pre-activation, `active` = key issued, `limit` = free allowance used up. */
export type McpStatus = 'inactive' | 'active' | 'limit'

export type McpDialog = 'activate' | 'refresh' | null

export interface McpUsageMetric {
  id: 'lite' | 'search'
  label: string
  used: number
  total: number
  /** Percentage shown under the bar: round(used / total), derived in `data/mcp.ts` from the daily series. */
  consumedPct: number
}

export interface McpChartSeries {
  id: 'search' | 'lite'
  label: string
  color: string
  values: number[]
}

export interface McpUsage {
  metrics: McpUsageMetric[]
  days: string[]
  series: McpChartSeries[]
}
