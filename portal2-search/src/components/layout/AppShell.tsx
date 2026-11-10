import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import styles from './AppShell.module.css'

interface AppShellProps {
  title: string
  activeNav: string
  children: ReactNode
}

export function AppShell({ title, activeNav, children }: AppShellProps) {
  return (
    <div className={styles.shell}>
      <Sidebar activeId={activeNav} />
      <TopBar title={title} />
      <main className={styles.content}>{children}</main>
    </div>
  )
}
