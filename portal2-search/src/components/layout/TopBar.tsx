import { useEffect, useRef, useState } from 'react'
import { Bell, ShoppingCart, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { NotificationsPopover } from './NotificationsPopover'
import styles from './TopBar.module.css'

interface TopBarProps {
  title: string
  notificationCount?: number
  className?: string
}

export function TopBar({ title, notificationCount = 4, className }: TopBarProps) {
  const [panel, setPanel] = useState<'notifications' | 'help' | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!panel) return
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setPanel(null)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [panel])

  return (
    <header className={[styles.topbar, className].filter(Boolean).join(' ')}>
      <h1 className={styles.title}>{title}</h1>

      <div ref={rootRef} className={styles.actions}>
        <button
          type="button"
          className={styles.iconBtn}
          aria-label="Notifications"
          aria-expanded={panel === 'notifications'}
          onClick={() => setPanel((p) => (p === 'notifications' ? null : 'notifications'))}
        >
          <Bell size={26} />
          {notificationCount > 0 && <span className={styles.badge}>{notificationCount}</span>}
        </button>
        <button type="button" className={styles.iconBtn} aria-label="Cart">
          <ShoppingCart size={26} />
        </button>
        <Button variant="outline" size="sm" onClick={() => setPanel((p) => (p === 'help' ? null : 'help'))}>
          Get Help
        </Button>

        {panel === 'notifications' && <NotificationsPopover />}
        {panel === 'help' && (
          <div className={styles.popover} role="dialog" aria-label="Get help">
            <button
              type="button"
              className={styles.close}
              aria-label="Close"
              onClick={() => setPanel(null)}
            >
              <X size={16} />
            </button>
            <h2 className={styles.popTitle}>How can we help you today?</h2>
            <p className={styles.popSub}>Choose the option that best matches what you need:</p>
            <button type="button" className={styles.helpOption}>
              <strong>I need help with a report</strong>
              <span>Get support with viewing, accessing, or understanding your report.</span>
            </button>
            <button type="button" className={styles.helpOption}>
              <strong>Other inquiries</strong>
              <span>Contact our support team for other questions or concerns.</span>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
