import styles from './SearchHeader.module.css'

interface SearchHeaderProps {
  /** Red inline validation text shown between the description and the form */
  error?: string
}

export function SearchHeader({ error }: SearchHeaderProps) {
  return (
    <div>
      <h2 className={styles.title}>Search for a business to verify</h2>
      <p className={styles.description}>
        Select a jurisdiction then enter the desired business name in either English/Original
        Language, or business registration number.
      </p>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
    </div>
  )
}
