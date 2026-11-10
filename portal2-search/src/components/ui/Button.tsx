import type { ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'outline' | 'link'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  /** Button 2.0.0 size; the page uses `sm` (36px) so controls stay below the navigation in weight */
  size?: 'lg' | 'sm'
  block?: boolean
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'sm',
  block,
  loading,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  const cls = [styles.button, styles[variant], styles[size], block && styles.block, className]
    .filter(Boolean)
    .join(' ')
  return (
    <button type="button" className={cls} disabled={disabled || loading} {...rest}>
      {loading && <Loader2 className={styles.spinner} size={size === 'lg' ? 20 : 16} aria-hidden />}
      {children}
    </button>
  )
}
