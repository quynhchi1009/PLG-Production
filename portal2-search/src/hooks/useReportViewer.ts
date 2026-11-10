import { useMemo, useState } from 'react'
import { viewerOrder } from '../data/reportView'
import type { ReportDocKind } from '../types/reportView'

export interface ReportViewerSeed {
  doc?: ReportDocKind
  /** 1-based, as shown in "Page 2 of 17" */
  page?: number
  recommendation?: string | null
}

/** Which report of the order is open, which page of it, and the onboarding recommendation. */
export function useReportViewer(orderId: string, seed: ReportViewerSeed = {}) {
  const viewer = useMemo(() => viewerOrder(orderId), [orderId])
  const [docKind, setDocKind] = useState<ReportDocKind | undefined>(seed.doc)
  const [pageIndex, setPageIndex] = useState((seed.page ?? 1) - 1)
  const [recommendation, setRecommendation] = useState<string | null>(seed.recommendation ?? null)

  const doc = viewer?.docs.find((d) => d.kind === docKind) ?? viewer?.docs[0]
  const total = doc?.pages.length ?? 0
  const index = Math.min(Math.max(pageIndex, 0), Math.max(total - 1, 0))

  return {
    viewer,
    doc,
    page: doc?.pages[index],
    pageIndex: index,
    total,
    recommendation,
    selectDoc: (kind: ReportDocKind) => {
      setDocKind(kind)
      setPageIndex(0)
    },
    goTo: (i: number) => setPageIndex(Math.min(Math.max(i, 0), Math.max(total - 1, 0))),
    toggleRecommendation: (id: string) => setRecommendation((r) => (r === id ? null : id)),
  }
}
