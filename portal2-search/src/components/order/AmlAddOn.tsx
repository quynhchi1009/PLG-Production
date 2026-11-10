import { HelpCircle } from 'lucide-react'
import { AML_MATCH_TYPES } from '../../data/reports'
import { SelectField } from '../ui/SelectField'
import { AddOnItem } from './AddOnItem'
import styles from './AmlAddOn.module.css'

const OPTIONS = AML_MATCH_TYPES.map((t) => ({ value: t, label: t }))

interface AmlAddOnProps {
  companyName: string
  enabled: boolean
  matchType: string | null
  locked: boolean
  onToggle: (enabled: boolean) => void
  onMatchTypeChange: (value: string | null) => void
}

export function AmlAddOn({
  companyName,
  enabled,
  matchType,
  locked,
  onToggle,
  onMatchTypeChange,
}: AmlAddOnProps) {
  return (
    <AddOnItem
      title="AML (Company)"
      description={
        <p className={styles.sub}>
          Matching based on &quot;{companyName}&quot;
          <HelpCircle size={14} aria-label="About name matching" />
        </p>
      }
      checked={enabled}
      disabled={locked}
      onChange={onToggle}
    >
      <div className={styles.field}>
        <SelectField
          shape="field"
          options={OPTIONS}
          value={matchType}
          onChange={onMatchTypeChange}
          placeholder="Select Match Type"
        />
      </div>
    </AddOnItem>
  )
}
