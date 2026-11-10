# Portal 2 – Search screens

Vite + React + TypeScript recreation of the **Search** flow of the AsiaVerify Portal 2
(`/search` and `/search/order`), measured from the live site. All company, notification and
sample-report data is fictional mock data.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Screen states

A dev-only "States" strip (bottom of the page) jumps between pre-baked states, which mirror the frames in
the Figma file *Portal-2-PLG* (pages **Search screens**, **Order screens**, **View reports screens** and **Report viewer**).

| Route | States |
| --- | --- |
| `#/search?state=…` | `empty`, `dropdown`, `filled`, `loading`, `results`, `no-results`, `min-chars`, `jurisdiction-required` |
| `#/search/order?state=…` | `kyb-lite`, `kyb-compare`, `kyb-addons`, `kyb-complete`, `ubo` |
| `#/report?state=…` | `results`, `filter-open`, `filtered`, `selected`, `loading`, `no-matches`, `no-orders` |
| `#/report/view?order=<id>&doc=<kind>&page=<n>` or `?state=…` | `advance`, `advance-table`, `complete`, `lite`, `basic`, `basic-plus`, `ubo`, `legal`, `aml`, `monitoring`, `processing`, `unavailable` |
| `#/mcp?state=…` | `preactivation`, `activate-dialog` (trial chrome), `post-activation`, `refresh-dialog`, `limit-reached`, `paying` |

Without `state` the screens are fully interactive: the search validates (3+ characters, jurisdiction
required), filters the mock registry, paginates, and **View** opens the order step.
Generate Report / Add to Cart are intentionally not wired.
On `#/report` the list searches, filters (status, report type, jurisdiction, quick or custom date range),
sorts (date, business), paginates and selects rows; **View** opens the report viewer; **Add AML** and **Download** are not wired.

### Report viewer (`#/report/view`)

Opens one order. Each product is a different report with its own section outline (`src/data/reportView.ts`):

| Order product | Opens as | Sections |
| --- | --- | --- |
| KYB LITE | KYB Report | Cover, Business Overview, Company Information, Data Source |
| KYB BASIC | KYB Report | + company-information pages, Directors & Officers, Shareholders, Historical Changes |
| KYB BASIC PLUS | KYB Report | Basic + Risk Overview (Executive Summary, Risk Overview Summary) |
| KYB ADVANCE | KYB Report | Full: Risk Overview, Risk Assessment (alerts, benchmark, compliance), UBO, plus Share recommendation |
| KYB COMPLETE | KYB + UBO + AML Report tabs | Advance report with its UBO and AML reports |
| UBO | UBO Report | Ownership Structure, Beneficial Owners, Threshold & Method |
| Legal Documents | Legal Documents | Registry Documents (download per document) |
| AML | AML Report | Screening Summary, Sanctions, PEP & Relatives, Adverse Media |
| MONITORING | Monitoring | Monitoring Status, Change Alerts |

An order with several products shows one tab per report ("View Report(s)"). Processing orders show a
"being prepared" message; unfulfilled, cancelled and not-found orders show why there is no report.
Share, Download, Download (documents) and the Share recommendation choice are not wired to a backend.

## Structure (components by section)

```
src/
  styles/        tokens.css (design tokens), flags.css, global.css
  data/          jurisdictions, mock companies, report plans + compare matrix, mock order history
  hooks/         useCompanySearch, useOrderConfig, useReports, useReportViewer
  components/
    ui/          Button, Card, TextField, SelectField, RadioPill, TextTabs, Checkbox, Pagination
    layout/      AppShell, Sidebar, TopBar, NotificationsPopover, Logo, StateSwitcher
    search/      SearchPanel > SearchHeader, SearchForm, ResultsTable, SearchMessage
    order/       CompanyHeader, ReportConfigurator > PlanList/PlanCard, CompareMatrix,
                 AddOnsSection > AmlAddOn/MonitoringAddOn, UboOptions, SampleReport; ReportSummary
    reports/     ReportsPanel > ReportsFilters > FilterChip, ReportsTable > StatusLabel
    reportview/  ReportViewPanel > DocTabs, ViewerToolbar, JumpNav, PageContent > RiskGauge / RiskRadar
  pages/         SearchPage, OrderPage, ReportsPage, ReportViewPage
```

## Design-system alignment (LG, 1440px)

Tokens in `src/styles/tokens.css` mirror the team library (*AsiaVerify's design system*) at its **LG** mode:
fill styles, radius variables, text styles (Roboto Bold titles `title/h4–h6`, Open Sans body) and the
`size=lg` control dimensions. Layout uses the system's LG gutter (48px) for page padding, a 288px sidebar,
a 72px top bar and a 336px summary column. The Figma screens use the same library styles and LG variable mode.

## Known approximations

- View reports: the live page shows registration number as its own column and puts Apply / Clear beside the
  filters; here the registration number sits under the business name (to fit 1440px without wrapping), each filter
  applies from its own list, and **Clear filters** appears once a filter is active. Order history is fictional.
- Report viewer: sections per product are inferred from the plan matrix (Basic Plus = Basic + Risk Overview;
  Complete = Advance + UBO + AML tabs); only the Advance/Complete screen was measured from the live site.
  The gauge and radar plot lower risk further out (the live gauge shape was only seen at Low Risk), the
  moderate-risk amber (`--av-warning`) approximates the library's yellow, and only the two recommendation
  choices visible on the live page are included.
- Order status uses a dot plus label; the Figma file uses the library *Status shape* (extra shapes/colours the
  token set has no equivalent for). The report-type list in the Figma open state is the library's own sample list.
- Logo is an SVG approximation; flags use `flag-icons` (the Figma file uses the Icon Library flags).
- The report sample preview and notifications are illustrative mock content.
- The live site shows no loading indicator while searching; the button spinner is an addition.
- UBO threshold options (10/25/50 %) are assumed; only the default (25 %) was observed.
