import type { McpChartSeries, McpUsage, McpUsageMetric } from '../types/mcp'

export const MCP_URL = 'https://mcp.asiaverify.com'
export const MCP_KEY_MASK = '*************************'

export const MCP_BETA = { searches: 200, reports: 20, markets: 14 }

/** Copy of the pre-activation hero. Shared by the live page (McpIntro) and the announcement's preview video, so they cannot drift. */
export const MCP_INTRO = {
  heading: 'Give your Al agent access to Asian KYB data',
  body: 'The MCP is our new interface for Al agents. Connect Claude, Cursor, or any MCP-compatible client and let your agent call our Search + Lite tools directly. Activating generates a dedicated MCP key — one key per account, refreshable at any time.',
  cta: 'Activate MCP - Free Beta Access',
  toastLead: 'What happens next: ',
  toastText:
    'once you activate, your MCP key appears right here on this page. You stay in this view - non-MCP features remain locked until you upgrade your plan.',
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const SEARCH_COLOR = '#8a7cf2'
const LITE_COLOR = '#00735f'

function series(search: number[], lite: number[]): McpChartSeries[] {
  return [
    { id: 'search', label: 'Searches', color: SEARCH_COLOR, values: search },
    { id: 'lite', label: 'Lite Report', color: LITE_COLOR, values: lite },
  ]
}

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0)

function metric(id: 'lite' | 'search', label: string, used: number, total: number): McpUsageMetric {
  return { id, label, used, total, consumedPct: Math.min(100, Math.round((used / total) * 100)) }
}

/**
 * Single source of truth for the Usage card: the daily call counts. "used", "left" and "% consumed" are derived
 * from them, so the numbers and the chart cannot disagree. The beta allowance is one-time and the chart covers
 * the days since activation, so used = the sum of the series.
 *
 * The Figma frames drew Searches as "2 used · 198 left" with "28% consumed" and a chart that summed to 14;
 * those figures contradicted each other, so the values below are chosen to be self-consistent instead.
 */
function usageFromDaily(search: number[], lite: number[]): McpUsage {
  return {
    metrics: [
      metric('lite', 'Lite Report', sum(lite), MCP_BETA.reports),
      metric('search', 'Searches', sum(search), MCP_BETA.searches),
    ],
    days: DAYS,
    series: series(search, lite),
  }
}

/** "MCP post-activation": 2 searches and 2 lite reports so far (1% of searches, 10% of lite reports). */
export const USAGE_ACTIVE: McpUsage = usageFromDaily([0, 0, 0, 0, 1, 0, 1], [0, 0, 0, 0, 0, 1, 1])

/** "MCP limit reached": the whole allowance (200 searches, 20 lite reports) is spent, the last day is empty. */
export const USAGE_LIMIT: McpUsage = usageFromDaily([25, 40, 40, 35, 30, 30, 0], [2, 3, 4, 4, 3, 4, 0])

/** A key that was activated in this session has no calls yet. */
export const USAGE_FRESH: McpUsage = usageFromDaily([0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0])

export interface TerminalLine {
  text: string
  tone: 'prompt' | 'call' | 'query' | 'ok' | 'result'
  /** Prompt lines carry the left rule and are not dimmed. */
  marked?: boolean
}

export const TERMINAL_LINES: TerminalLine[] = [
  { text: 'Search for Grab Holdings in Singapore', tone: 'prompt', marked: true },
  { text: '⟳ calling asiaverify · search_company', tone: 'call' },
  { text: 'query: "Grab Holdings" country: SGP', tone: 'query' },
  { text: '✓ 3 candidates found (287ms)', tone: 'ok' },
  { text: 'Grab Holdings Pte. Ltd · UEN 2013161200Z', tone: 'result' },
  { text: 'Grab Inc. (Branch) · UEN 202030769H', tone: 'result' },
  { text: 'Grab Financial Group · UEN 201920392K', tone: 'result' },
  { text: 'Now pull the lite report for the first one', tone: 'prompt', marked: true },
]

export const CAPABILITY_HEADER = ['CAPABILITY', 'SEARCH COMPANY', 'LITE REPORT']

export const CAPABILITY_ROWS: [string, string, string][] = [
  ['Free beta allowance', '200 searches', '20 lite reports'],
  ['Coverage', 'All 14 markets', '11 markets (excl. IDN, MYS, PHL)'],
  ['Response type', 'Candidate list', 'Full KYB profile'],
  ['Data freshness', 'Real-time registry', 'Real-time registry'],
]
