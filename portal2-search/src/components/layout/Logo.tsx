/**
 * Approximation of the AsiaVerify logo (check-in-ring mark + wordmark) so the
 * repo carries no downloaded brand assets. Swap for the official SVG when available.
 */
export function Logo() {
  return (
    <svg width="136" height="40" viewBox="0 0 136 40" role="img" aria-label="AsiaVerify">
      <circle cx="19" cy="21" r="14" fill="none" stroke="#00c09e" strokeWidth="3" />
      <path
        d="M10 21l7 7L32 9"
        fill="none"
        stroke="#fcfcfc"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text x="40" y="27" fontFamily="Roboto, sans-serif" fontSize="20" fill="#00c09e" fontWeight="500">
        Asia
      </text>
      <text x="76" y="27" fontFamily="Roboto, sans-serif" fontSize="20" fill="#fcfcfc" fontWeight="700">
        Verify
      </text>
    </svg>
  )
}
