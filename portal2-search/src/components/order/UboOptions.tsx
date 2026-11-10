import { UBO_THRESHOLDS } from '../../data/reports'
import { SelectField } from '../ui/SelectField'
import { TextField } from '../ui/TextField'
import { FieldBlock } from './FieldBlock'
import { SectionTitle } from './SectionTitle'
import styles from './UboOptions.module.css'

const OPTIONS = UBO_THRESHOLDS.map((t) => ({ value: t, label: t }))

interface UboOptionsProps {
  threshold: string
  exploreLevel: string
  onThresholdChange: (value: string) => void
  onExploreLevelChange: (value: string) => void
}

export function UboOptions({
  threshold,
  exploreLevel,
  onThresholdChange,
  onExploreLevelChange,
}: UboOptionsProps) {
  return (
    <section>
      <SectionTitle>UBO Options</SectionTitle>
      <div className={styles.group}>
        <FieldBlock
          label="Shareholder Threshold"
          help="Select the minimum shareholder threshold you’d like to use as a filter. The UBO report will only show information on shareholders who hold least the selected % stake in the company."
        >
          <SelectField
            shape="field"
            options={OPTIONS}
            value={threshold}
            onChange={(v) => v && onThresholdChange(v)}
            placeholder="Select threshold"
          />
        </FieldBlock>
      </div>
      <div className={styles.group}>
        <FieldBlock label="Explore Level" help="Choose an explore level from 1 - 50.">
          <TextField
            className={styles.level}
            inputMode="numeric"
            value={exploreLevel}
            onChange={(v) => onExploreLevelChange(v.replace(/\D/g, '').slice(0, 2))}
            aria-label="Explore level"
          />
        </FieldBlock>
      </div>
    </section>
  )
}
