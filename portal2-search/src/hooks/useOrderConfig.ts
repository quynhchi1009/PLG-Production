import { useCallback, useState } from 'react'
import { AML_MATCH_TYPES } from '../data/reports'
import type { KybPlanId, ReportKind, ReportView } from '../types'
import type { OrderConfig } from '../types/order'

export const DEFAULT_ORDER: OrderConfig = {
  kind: 'KYB',
  view: 'configure',
  plan: 'lite',
  aml: { enabled: false, matchType: null },
  monitoring: { enabled: false, frequency: null, expiry: '' },
  ubo: { threshold: '25%', exploreLevel: '10' },
}

export function useOrderConfig(seed: Partial<OrderConfig> = {}) {
  const [config, setConfig] = useState<OrderConfig>({ ...DEFAULT_ORDER, ...seed })

  const setKind = useCallback((kind: ReportKind) => setConfig((c) => ({ ...c, kind, view: 'configure' })), [])
  const setView = useCallback((view: ReportView) => setConfig((c) => ({ ...c, view })), [])

  // KYB COMPLETE already bundles AML and monitoring, so the add-ons are cleared and locked.
  const setPlan = useCallback(
    (plan: KybPlanId) =>
      setConfig((c) => ({
        ...c,
        plan,
        aml: plan === 'complete' ? { enabled: false, matchType: null } : c.aml,
        monitoring:
          plan === 'complete' ? { enabled: false, frequency: null, expiry: '' } : c.monitoring,
      })),
    [],
  )

  const toggleAml = useCallback(
    (enabled: boolean) =>
      setConfig((c) => ({
        ...c,
        aml: { enabled, matchType: enabled ? AML_MATCH_TYPES[0] : null },
      })),
    [],
  )
  const setAmlMatchType = useCallback(
    (matchType: string | null) => setConfig((c) => ({ ...c, aml: { ...c.aml, matchType } })),
    [],
  )

  const toggleMonitoring = useCallback(
    (enabled: boolean) =>
      setConfig((c) => ({
        ...c,
        monitoring: enabled ? { ...c.monitoring, enabled } : { enabled, frequency: null, expiry: '' },
      })),
    [],
  )
  const setMonitoring = useCallback(
    (patch: Partial<OrderConfig['monitoring']>) =>
      setConfig((c) => ({ ...c, monitoring: { ...c.monitoring, ...patch } })),
    [],
  )

  const setUbo = useCallback(
    (patch: Partial<OrderConfig['ubo']>) => setConfig((c) => ({ ...c, ubo: { ...c.ubo, ...patch } })),
    [],
  )

  return {
    config,
    setKind,
    setView,
    setPlan,
    toggleAml,
    setAmlMatchType,
    toggleMonitoring,
    setMonitoring,
    setUbo,
  }
}
