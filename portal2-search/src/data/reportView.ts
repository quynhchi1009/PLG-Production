import type {
  Block,
  OutlineGroup,
  ReportDoc,
  ReportDocKind,
  ReportPage,
  RiskLevel,
  ViewerOrder,
} from '../types/reportView'
import type { ReportOrder } from '../types/reports'
import { JURISDICTIONS } from './jurisdictions'
import { NOW, ORDERS } from './orders'

/**
 * Viewer content for an order. Everything here is fictional mock data: companies come from the
 * made-up order history, and people are placeholders ("Sample Director A"), so no registry or
 * personal data lives in the repo.
 *
 * Which report type has which sections follows the plan matrix in `data/reports.ts`:
 *   LITE   registration only            BASIC  + directors, shareholders, history
 *   BASIC PLUS  basic + risk overview   ADVANCE / COMPLETE  full risk, alerts, benchmark, UBO
 * UBO, Legal Documents, AML and Monitoring are separate products, each with its own outline.
 */

const CURRENCY: Record<string, string> = {
  cn: 'CNY', jp: 'JPY', tw: 'TWD', hk: 'HKD', sg: 'SGD', kr: 'KRW',
  nz: 'NZD', in: 'INR', vn: 'VND', th: 'THB', au: 'AUD',
}

export const RISK_LABEL: Record<RiskLevel, string> = {
  low: 'Low Risk',
  moderate: 'Moderate Risk',
  high: 'High Risk',
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const day = (d: Date) => `${String(d.getDate()).padStart(2, '0')}/${MONTHS[d.getMonth()]}/${d.getFullYear()}`
const REPORT_DATE = day(NOW)

interface Facts {
  name: string
  trading: string
  regNo: string
  country: string
  currency: string
  incorporated: number
  years: number
}

function factsFor(order: ReportOrder): Facts {
  const n = Number(order.id.replace(/\D/g, ''))
  const incorporated = 1984 + ((n * 7) % 33)
  return {
    name: `${order.businessName} CO. LIMITED`,
    trading: order.businessName,
    regNo: order.regNo,
    country: JURISDICTIONS.find((j) => j.id === order.jurisdiction)?.name ?? '',
    currency: CURRENCY[order.jurisdiction] ?? 'USD',
    incorporated,
    years: NOW.getFullYear() - incorporated,
  }
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, '-')

function page(spec: { id: string; group: string }, title: string, blocks: Block[]): ReportPage {
  return { id: spec.id, groupId: slug(spec.group), groupTitle: spec.group, title, blocks }
}

/* ---------- shared pages ---------- */

const cover = (f: Facts, product: string, order: ReportOrder): ReportPage =>
  page({ id: 'cover', group: 'Cover Page' }, 'Cover Page', [
    { t: 'subhead', text: f.name },
    {
      t: 'kv',
      rows: [
        ['Report type', product],
        ['Business registration no.', f.regNo],
        ['Jurisdiction', f.country],
        ['Order no.', order.orderNo],
        ['Report date', REPORT_DATE],
        ['Language', 'English'],
      ],
    },
  ])

const dataSource = (): ReportPage =>
  page({ id: 'data', group: 'Data Source & Disclaimers' }, 'Data Source & Disclaimers', [
    {
      t: 'text',
      text: 'Information in this report is retrieved from the official company registry and other public sources on the report date. It reflects what those sources hold at that time.',
    },
    {
      t: 'text',
      text: 'The report is provided for due-diligence purposes only and is not legal or investment advice. Where a registry does not publish a field, it is marked as not available.',
    },
  ])

const overview = (f: Facts, withCounts: boolean): ReportPage =>
  page({ id: 'ov', group: 'Business Overview' }, 'Business Overview', [
    { t: 'subhead', text: f.name },
    {
      t: 'text',
      text: `${f.name} is a company incorporated in ${f.country}. It provides industrial services and products that support efficiency and productivity.`,
    },
    {
      t: 'stats',
      items: [
        { label: 'Longevity', value: `${f.years} years` },
        { label: 'Status', value: 'Live' },
        ...(withCounts
          ? [
              { label: 'Shareholders', value: '2' },
              { label: 'Directors & Officers', value: '2' },
            ]
          : []),
        { label: 'Branches', value: '0' },
      ],
    },
  ])

const infoLeaf = (f: Facts): ReportPage =>
  page({ id: 'info', group: 'Company Information' }, 'Company Information', [
    { t: 'subhead', text: 'Registration Details' },
    registrationKv(f),
  ])

function registrationKv(f: Facts): Block {
  return {
    t: 'kv',
    rows: [
      ['Company name', f.name],
      ['Business registration no.', f.regNo],
      ['Legal form', 'Private company limited by shares'],
      ['Status', 'Live'],
      ['Date of incorporation', `01/Jan/${f.incorporated}`],
      ['Registered office', `Registered address on file, ${f.country}`],
    ],
  }
}

const companyInfo = (f: Facts): ReportPage[] => [
  page({ id: 'ci-reg', group: 'Company Information' }, 'Registration Details', [
    { t: 'subhead', text: 'Registration Details' },
    registrationKv(f),
  ]),
  page({ id: 'ci-act', group: 'Company Information' }, 'Business Activities', [
    { t: 'subhead', text: 'Business Activities' },
    {
      t: 'table',
      columns: ['Activity', 'Code', 'Type'],
      rows: [['Industrial services and products', '2599', 'Primary']],
    },
  ]),
  page({ id: 'ci-cap', group: 'Company Information' }, 'Share Capital', [
    { t: 'subhead', text: 'Share Capital' },
    {
      t: 'kv',
      rows: [
        ['Issued capital', `${f.currency} 10,000`],
        ['Share class', 'Ordinary'],
        ['Number of shares', '10,000'],
      ],
    },
  ]),
  page({ id: 'ci-br', group: 'Company Information' }, 'Branches', [
    { t: 'subhead', text: 'Branches' },
    { t: 'empty', text: 'No branches are registered for this company.' },
  ]),
]

const directors = (): ReportPage =>
  page({ id: 'dir', group: 'Directors & Officers' }, 'Directors & Officers', [
    { t: 'subhead', text: 'Directors & Officers' },
    {
      t: 'table',
      columns: ['Name', 'Position', 'Appointed', 'Status'],
      rows: [
        ['Sample Director A', 'Director', '01/Jan/2015', 'Current'],
        ['Sample Director B', 'Company secretary', '01/Jan/2015', 'Current'],
      ],
    },
  ])

const shareholders = (): ReportPage =>
  page({ id: 'sh', group: 'Shareholders' }, 'Shareholders', [
    { t: 'subhead', text: 'Shareholders' },
    {
      t: 'table',
      columns: ['Shareholder', 'Shares held', 'Ownership', 'Type'],
      rows: [
        ['Sample Holder A', '6,000', '60%', 'Individual'],
        ['Sample Holder B', '4,000', '40%', 'Individual'],
      ],
    },
  ])

const history = (f: Facts): ReportPage =>
  page({ id: 'hist', group: 'Historical Changes' }, 'Historical Changes', [
    { t: 'subhead', text: 'Historical Changes' },
    {
      t: 'table',
      columns: ['Date', 'Change', 'Detail'],
      rows: [
        ['01/Jan/2015', 'Director appointed', 'Sample Director A'],
        [`01/Jan/${f.incorporated}`, 'Incorporation', 'Company registered'],
      ],
    },
  ])

const AXES: { label: string; level: RiskLevel }[] = [
  { label: 'Jurisdiction', level: 'moderate' },
  { label: 'Sanctions', level: 'low' },
  { label: 'Sector', level: 'low' },
  { label: 'Transparency', level: 'low' },
  { label: 'Reputation', level: 'low' },
  { label: 'Longevity', level: 'low' },
]

const riskOverview = (f: Facts): ReportPage[] => [
  page({ id: 'ro-exec', group: 'Risk Overview' }, 'Executive Summary', [
    { t: 'subhead', text: `${f.name} (${f.trading})` },
    {
      t: 'text',
      text: `${f.name} is a company, headquartered in ${f.country}. The company contributes to its sector by providing industrial services and products that enhance efficiency and productivity.`,
    },
    {
      t: 'stats',
      items: [
        { label: 'Longevity', value: `${f.years} years` },
        { label: 'Shareholders', value: '2' },
        { label: 'Directors & Officers', value: '2' },
        { label: 'Branches', value: '0' },
      ],
    },
    { t: 'risk', overall: 'low', axes: AXES },
  ]),
  page({ id: 'ro-summary', group: 'Risk Overview' }, 'Risk Overview Summary', [
    { t: 'subhead', text: 'Risk Overview Summary' },
    {
      t: 'table',
      columns: ['Risk factor', 'Level', 'Basis'],
      rows: AXES.map((a) => [a.label, RISK_LABEL[a.level], BASIS[a.label]]),
    },
  ]),
]

const BASIS: Record<string, string> = {
  Jurisdiction: 'Registry jurisdiction carries elevated country-level risk',
  Sanctions: 'No sanctions matches on the company or its officers',
  Sector: 'Sector is not classed as high risk',
  Transparency: 'Directors and shareholders are disclosed',
  Reputation: 'No adverse items found',
  Longevity: 'Established, long-running company',
}

const riskAssessment = (): ReportPage[] => [
  page({ id: 'ra-ops', group: 'Risk Assessment' }, 'Operational Alerts', [
    { t: 'subhead', text: 'Operational Alerts' },
    { t: 'callout', tone: 'positive', title: 'No operational alerts', text: 'No dormancy, late filing or strike-off notices were found.' },
  ]),
  page({ id: 'ra-legal', group: 'Risk Assessment' }, 'Legal Alerts', [
    { t: 'subhead', text: 'Legal Alerts' },
    { t: 'callout', tone: 'positive', title: 'No legal alerts', text: 'No litigation, insolvency or enforcement records were found.' },
  ]),
  page({ id: 'ra-bench', group: 'Risk Assessment' }, 'Industry Benchmark', [
    { t: 'subhead', text: 'Industry Benchmark' },
    {
      t: 'table',
      columns: ['Measure', 'This company', 'Sector median'],
      rows: [
        ['Longevity', 'Above median', '—'],
        ['Officers disclosed', '2', '3'],
        ['Registered branches', '0', '1'],
      ],
    },
  ]),
  page({ id: 'ra-comp', group: 'Risk Assessment' }, 'Compliance', [
    { t: 'subhead', text: 'Compliance' },
    {
      t: 'table',
      columns: ['Check', 'Result'],
      rows: [
        ['Sanctions screening', 'No match'],
        ['Politically exposed persons', 'No match'],
        ['Adverse media', 'No match'],
      ],
    },
  ]),
]

const UBO_GROUP = 'UBO (Ultimate Beneficial Owner)'

const uboPages = (f: Facts, threshold: string, standalone: boolean): ReportPage[] => [
  page({ id: 'ubo-struct', group: standalone ? 'Ownership Structure' : UBO_GROUP }, 'Ownership Structure', [
    { t: 'subhead', text: 'Ownership Structure' },
    {
      t: 'table',
      columns: ['Layer', 'Entity', 'Holding', 'Type'],
      rows: [
        ['1', f.name, '—', 'Subject company'],
        ['2', 'Sample Holder A', '60%', 'Individual'],
        ['2', 'Sample Holder B', '40%', 'Individual'],
      ],
    },
  ]),
  page({ id: 'ubo-owners', group: standalone ? 'Beneficial Owners' : UBO_GROUP }, 'Beneficial Owners', [
    { t: 'subhead', text: `Beneficial owners at or above ${threshold}` },
    {
      t: 'table',
      columns: ['Beneficial owner', 'Effective holding', 'Basis'],
      rows: [
        ['Sample Owner A', '60%', 'Direct shareholding'],
        ['Sample Owner B', '40%', 'Direct shareholding'],
      ],
    },
  ]),
]

/* ---------- documents ---------- */

type Build = (f: Facts, order: ReportOrder, product: string) => ReportPage[]

const BUILDERS: Record<ReportDocKind, { label: string; build: Build; recommendation?: boolean }> = {
  'kyb-lite': {
    label: 'KYB Report [EN]',
    build: (f, o, p) => [cover(f, p, o), overview(f, false), infoLeaf(f), dataSource()],
  },
  'kyb-basic': {
    label: 'KYB Report [EN]',
    build: (f, o, p) => [
      cover(f, p, o), overview(f, true), ...companyInfo(f),
      directors(), shareholders(), history(f), dataSource(),
    ],
  },
  'kyb-basic-plus': {
    label: 'KYB Report [EN]',
    build: (f, o, p) => [
      cover(f, p, o), ...riskOverview(f), ...companyInfo(f),
      directors(), shareholders(), history(f), dataSource(),
    ],
  },
  'kyb-advance': {
    label: 'KYB Report [EN]',
    recommendation: true,
    build: (f, o, p) => [
      cover(f, p, o), ...riskOverview(f), ...companyInfo(f), directors(), shareholders(),
      ...riskAssessment(), ...uboPages(f, '25%', false), history(f), dataSource(),
    ],
  },
  ubo: {
    label: 'UBO Report [EN]',
    build: (f, o, p) => [
      cover(f, p, o),
      ...uboPages(f, '25%', true),
      page({ id: 'umethod', group: 'Threshold & Method' }, 'Threshold & Method', [
        { t: 'subhead', text: 'Threshold & Method' },
        {
          t: 'kv',
          rows: [
            ['Ownership threshold', '25%'],
            ['Layers explored', 'All available layers'],
            ['Beneficial owners found', '2'],
          ],
        },
      ]),
      dataSource(),
    ],
  },
  legal: {
    label: 'Legal Documents',
    build: (f, o, p) => [
      cover(f, p, o),
      page({ id: 'docs', group: 'Registry Documents' }, 'Registry Documents', [
        { t: 'subhead', text: 'Registry Documents' },
        {
          t: 'table',
          columns: ['Document', 'Filed', 'Pages', 'Format'],
          action: 'Download',
          rows: [
            ['Certificate of Incorporation', `01/Jan/${f.incorporated}`, '1', 'PDF'],
            ['Articles of Association', `01/Jan/${f.incorporated}`, '24', 'PDF'],
            ['Annual Return', '15/Mar/2026', '6', 'PDF'],
            ['Notice of Change of Directors', '01/Jan/2015', '2', 'PDF'],
          ],
        },
      ]),
      dataSource(),
    ],
  },
  aml: {
    label: 'AML Report [EN]',
    build: (f, o, p) => [
      cover(f, p, o),
      page({ id: 'asum', group: 'Screening Summary' }, 'Screening Summary', [
        { t: 'subhead', text: 'Screening Summary' },
        {
          t: 'stats',
          items: [
            { label: 'Sanctions', value: '0' },
            { label: 'PEP', value: '0' },
            { label: 'Adverse media', value: '1' },
            { label: 'Match type', value: 'Exact' },
          ],
        },
      ]),
      page({ id: 'ares-sanc', group: 'Screening Results' }, 'Sanctions', [
        { t: 'subhead', text: 'Sanctions' },
        { t: 'callout', tone: 'positive', title: 'No matches', text: 'The company and its officers were screened against global sanctions lists.' },
      ]),
      page({ id: 'ares-pep', group: 'Screening Results' }, 'PEP & Relatives', [
        { t: 'subhead', text: 'PEP & Relatives' },
        { t: 'callout', tone: 'positive', title: 'No matches', text: 'No politically exposed persons or relatives were identified.' },
      ]),
      page({ id: 'ares-media', group: 'Screening Results' }, 'Adverse Media', [
        { t: 'subhead', text: 'Adverse Media' },
        {
          t: 'table',
          columns: ['Date', 'Source', 'Headline', 'Relevance'],
          rows: [['12/Aug/2026', 'Trade press (sample)', 'Routine regulatory filing mentioned', 'Low']],
        },
      ]),
      dataSource(),
    ],
  },
  monitoring: {
    label: 'Monitoring',
    build: (f, o, p) => [
      cover(f, p, o),
      page({ id: 'mstatus', group: 'Monitoring Status' }, 'Monitoring Status', [
        { t: 'subhead', text: 'Monitoring Status' },
        {
          t: 'kv',
          rows: [
            ['Status', 'Active'],
            ['Check frequency', '30 days (1 month)'],
            ['Started', day(new Date(o.placedAt))],
            ['Expires', '31/Jan/2027'],
            ['Next check', '14/Nov/2026'],
          ],
        },
      ]),
      page({ id: 'malerts', group: 'Change Alerts' }, 'Change Alerts', [
        { t: 'subhead', text: 'Change Alerts' },
        { t: 'empty', text: 'No changes have been detected since monitoring started.' },
      ]),
      dataSource(),
    ],
  },
}

const DOC_ORDER: ReportDocKind[] = [
  'kyb-lite', 'kyb-basic', 'kyb-basic-plus', 'kyb-advance', 'ubo', 'legal', 'aml', 'monitoring',
]

/** What each order product opens as. COMPLETE is the advanced report plus its AML and UBO reports. */
const PRODUCT_DOCS: Record<string, ReportDocKind[]> = {
  'KYB LITE': ['kyb-lite'],
  'KYB BASIC': ['kyb-basic'],
  'KYB BASIC PLUS': ['kyb-basic-plus'],
  'KYB ADVANCE': ['kyb-advance'],
  'KYB COMPLETE': ['kyb-advance', 'ubo', 'aml'],
  UBO: ['ubo'],
  'Legal Documents': ['legal'],
  AML: ['aml'],
  MONITORING: ['monitoring'],
}

const PRODUCT_NAME: Record<ReportDocKind, string> = {
  'kyb-lite': 'KYB LITE',
  'kyb-basic': 'KYB BASIC',
  'kyb-basic-plus': 'KYB BASIC PLUS',
  'kyb-advance': 'KYB ADVANCE',
  ubo: 'UBO',
  legal: 'Legal Documents',
  aml: 'AML',
  monitoring: 'MONITORING',
}

function outlineOf(pages: ReportPage[]): OutlineGroup[] {
  const groups: OutlineGroup[] = []
  pages.forEach((p, index) => {
    let g = groups.find((x) => x.title === p.groupTitle)
    if (!g) {
      g = { id: p.groupId, title: p.groupTitle, pages: [] }
      groups.push(g)
    }
    g.pages.push({ id: p.id, title: p.title, index })
  })
  return groups
}

export function docsForOrder(order: ReportOrder): ReportDoc[] {
  const f = factsFor(order)
  const kinds = new Set<ReportDocKind>()
  order.reportTypes.forEach((t) => PRODUCT_DOCS[t]?.forEach((k) => kinds.add(k)))
  return DOC_ORDER.filter((k) => kinds.has(k)).map((kind) => {
    const b = BUILDERS[kind]
    const product =
      kind === 'kyb-advance' && order.reportTypes.includes('KYB COMPLETE') ? 'KYB COMPLETE' : PRODUCT_NAME[kind]
    const pages = b.build(f, order, product)
    return {
      kind,
      label: b.label,
      product,
      pages,
      outline: outlineOf(pages),
      hasRecommendation: !!b.recommendation,
    }
  })
}

export function viewerOrder(orderId: string): ViewerOrder | undefined {
  const order = ORDERS.find((o) => o.id === orderId)
  if (!order) return undefined
  const state =
    order.status === 'completed' || order.status === 'active'
      ? 'ready'
      : order.status === 'processing'
        ? 'processing'
        : 'unavailable'
  return { order, state, docs: state === 'ready' ? docsForOrder(order) : [] }
}

export const DOC_KIND_LABEL: Record<ReportDocKind, string> = {
  'kyb-lite': 'KYB Lite',
  'kyb-basic': 'KYB Basic',
  'kyb-basic-plus': 'KYB Basic Plus',
  'kyb-advance': 'KYB Advance',
  ubo: 'UBO',
  legal: 'Legal Documents',
  aml: 'AML',
  monitoring: 'Monitoring',
}
