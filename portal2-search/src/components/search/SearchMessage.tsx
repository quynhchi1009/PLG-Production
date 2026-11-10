import styles from './SearchMessage.module.css'

interface SearchMessageProps {
  variant: 'min-chars' | 'no-results'
  /** The query the user submitted; quoted back in the no-results headline */
  query?: string
}

const COPY = {
  'min-chars': {
    headline: 'Your search query must contain at least 3 characters. Please enter a longer business name or ID',
    suggestions: ['Check that you entered the right input', 'Enter specific business name or ID'],
  },
  'no-results': {
    headline: undefined,
    suggestions: [
      'Ensure that all words are spelled correctly.',
      'Try a different search term.',
      'Try more general search terms.',
      'Ensure that the jurisdiction filter is selected correctly.',
    ],
  },
} as const

/** Empty-result guidance shown under the search form (validation or zero hits) */
export function SearchMessage({ variant, query }: SearchMessageProps) {
  const copy = COPY[variant]
  const headline = copy.headline ?? `Sorry, there were no results found for for “${query}”.`
  return (
    <section className={[styles.message, styles[variant]].join(' ')} aria-live="polite">
      <p className={styles.headline}>{headline}</p>
      <div className={styles.suggestions}>
        <p className={styles.suggestionsTitle}>Suggestions:</p>
        <ul>
          {copy.suggestions.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
