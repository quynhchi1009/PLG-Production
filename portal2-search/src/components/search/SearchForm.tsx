import type { FormEvent } from 'react'
import { Search } from 'lucide-react'
import { JURISDICTIONS } from '../../data/jurisdictions'
import { Button } from '../ui/Button'
import { SelectField } from '../ui/SelectField'
import { TextField } from '../ui/TextField'
import styles from './SearchForm.module.css'

const JURISDICTION_OPTIONS = JURISDICTIONS.map((j) => ({
  value: j.id,
  label: j.name,
  flag: j.code,
}))

interface SearchFormProps {
  jurisdiction: string | null
  query: string
  loading: boolean
  jurisdictionInvalid: boolean
  /** Open the jurisdiction list on mount (state gallery only) */
  jurisdictionOpen?: boolean
  onJurisdictionChange: (value: string | null) => void
  onQueryChange: (value: string) => void
  onSubmit: () => void
}

export function SearchForm({
  jurisdiction,
  query,
  loading,
  jurisdictionInvalid,
  jurisdictionOpen,
  onJurisdictionChange,
  onQueryChange,
  onSubmit,
}: SearchFormProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <SelectField
        className={styles.jurisdiction}
        options={JURISDICTION_OPTIONS}
        value={jurisdiction}
        onChange={onJurisdictionChange}
        placeholder="Jurisdiction"
        invalid={jurisdictionInvalid}
        clearable
        defaultOpen={jurisdictionOpen}
      />
      <TextField
        className={styles.query}
        value={query}
        onChange={onQueryChange}
        placeholder="Business Name (EN/Original Language) or Registration Number"
        aria-label="Business name or registration number"
        leading={<Search size={20} />}
        clearable
      />
      <Button type="submit" className={styles.submit} loading={loading}>
        Search
      </Button>
    </form>
  )
}
