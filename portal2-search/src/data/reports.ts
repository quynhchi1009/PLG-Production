import type { CompareGroup, KybPlan } from '../types'

export const KYB_PLANS: KybPlan[] = [
  { id: 'lite', label: 'KYB LITE', description: 'Business Overview, Basic Information' },
  { id: 'basic', label: 'KYB BASIC', description: 'Lite Report + In-Depth Business Information' },
  {
    id: 'complete',
    label: 'KYB COMPLETE',
    description: 'Advanced + AML + UBO + Risk Assessment + Benchmarking',
  },
]

export const COMPARE_GROUPS: CompareGroup[] = [
  {
    title: 'Business Information',
    rows: [
      { label: 'Registration', plans: ['lite', 'basic', 'complete'] },
      { label: 'Directors & Officers', plans: ['basic', 'complete'] },
      { label: 'Shareholders', plans: ['basic', 'complete'] },
      { label: 'People Search', plans: ['complete'], hint: true },
    ],
  },
  {
    title: 'Alerts',
    rows: [
      { label: 'Operational Alerts', plans: ['complete'] },
      { label: 'Legal Alerts', plans: ['complete'] },
    ],
  },
  {
    title: 'Risk Evaluation',
    rows: [
      { label: 'Risk Overview', plans: ['complete'] },
      { label: 'Risk Assessment', plans: ['complete'] },
      { label: 'Industry Benchmark', plans: ['complete'] },
      { label: 'Compliance', plans: ['complete'], hint: true },
    ],
  },
]

export const AML_MATCH_TYPES = ['Exact Match', 'Non-Exact Match']

export const MONITOR_FREQUENCIES = [
  '30 (1 month)',
  '60 (2 months)',
  '90 (3 months)',
  '120 (4 months)',
  '150 (5 months)',
  '180 (6 months)',
]

export const UBO_THRESHOLDS = ['10%', '25%', '50%']
