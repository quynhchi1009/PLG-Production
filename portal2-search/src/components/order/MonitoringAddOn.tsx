import { Calendar } from 'lucide-react'
import { MONITOR_FREQUENCIES } from '../../data/reports'
import { SelectField } from '../ui/SelectField'
import { TextField } from '../ui/TextField'
import { AddOnItem } from './AddOnItem'
import { FieldBlock } from './FieldBlock'
import styles from './MonitoringAddOn.module.css'

const OPTIONS = MONITOR_FREQUENCIES.map((f) => ({ value: f, label: f }))

interface MonitoringAddOnProps {
  companyName: string
  enabled: boolean
  frequency: string | null
  expiry: string
  locked: boolean
  onToggle: (enabled: boolean) => void
  onFrequencyChange: (value: string | null) => void
  onExpiryChange: (value: string) => void
}

export function MonitoringAddOn({
  companyName,
  enabled,
  frequency,
  expiry,
  locked,
  onToggle,
  onFrequencyChange,
  onExpiryChange,
}: MonitoringAddOnProps) {
  return (
    <AddOnItem
      title="MONITORING"
      description={<>Set a frequent monitor to track changes in &ldquo;{companyName}&rdquo;</>}
      checked={enabled}
      disabled={locked}
      onChange={onToggle}
    >
      <div className={styles.fields}>
        <FieldBlock
          label="Frequency"
          required
          help="Enter the number of days for how frequently the monitor should run"
        >
          <SelectField
            shape="field"
            options={OPTIONS}
            value={frequency}
            onChange={onFrequencyChange}
            placeholder="Select Frequency"
          />
        </FieldBlock>
        <FieldBlock
          label="Expiry Date"
          required
          help="Set an expiration date for the monitor (up to a maximum of 1 year)"
        >
          <TextField
            className={styles.date}
            type="date"
            value={expiry}
            onChange={onExpiryChange}
            placeholder="DD/MM/YYYY"
            aria-label="Expiry date"
            leading={<Calendar size={16} />}
          />
        </FieldBlock>
      </div>
    </AddOnItem>
  )
}
