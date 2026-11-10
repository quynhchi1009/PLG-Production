import type { ReactNode } from 'react'
import {
  BarChart3,
  ChevronDown,
  ChevronLeft,
  Download,
  Gem,
  List,
  LogOut,
  Plug,
  Search,
  Settings,
  Share2,
  Tag,
} from 'lucide-react'
import { Logo } from './Logo'
import styles from './Sidebar.module.css'

interface NavItem {
  id: string
  label: string
  href: string
  icon: ReactNode
  badge?: string
  expandable?: boolean
}

const ICON = 20

const NAV_ITEMS: NavItem[] = [
  { id: 'search', label: 'Search', href: '#/search', icon: <Search size={ICON} /> },
  { id: 'reports', label: 'View Reports', href: '#/report', icon: <List size={ICON} /> },
  {
    id: 'downloads',
    label: 'Download Centre',
    href: '#/downloads',
    icon: <Download size={ICON} />,
    badge: 'New',
  },
  { id: 'shared', label: 'Shared Reports', href: '#/shared-reports', icon: <Share2 size={ICON} /> },
  { id: 'dashboard', label: 'Dashboard', href: '#/dashboard', icon: <BarChart3 size={ICON} /> },
  { id: 'billing', label: 'Billing', href: '#/billing', icon: <Gem size={ICON} /> },
  {
    id: 'plan',
    label: 'My Plan',
    href: '#/plan',
    icon: <Gem size={ICON} />,
    expandable: true,
  },
  { id: 'mcp', label: 'MCP', href: '#/mcp', icon: <Plug size={ICON} />, badge: 'New' },
  { id: 'pricing', label: 'Products & Pricing', href: '#/product-pricing', icon: <Tag size={ICON} /> },
  { id: 'settings', label: 'Account Settings', href: '#/setting', icon: <Settings size={ICON} /> },
]

interface SidebarProps {
  activeId: string
}

export function Sidebar({ activeId }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <a href="#/search" className={styles.logo} aria-label="AsiaVerify home">
        <Logo />
      </a>

      <nav className={styles.nav} aria-label="Primary">
        <button type="button" className={styles.menuToggle}>
          <span className={styles.icon}>
            <ChevronLeft size={ICON} />
          </span>
          <span>Menu</span>
        </button>

        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={item.href}
            aria-current={item.id === activeId ? 'page' : undefined}
            className={[styles.item, item.id === activeId && styles.active].filter(Boolean).join(' ')}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
            {item.badge && <span className={styles.badge}>{item.badge}</span>}
            {item.expandable && <ChevronDown size={16} className={styles.chevron} />}
          </a>
        ))}
      </nav>

      <button type="button" className={styles.logout}>
        <span className={styles.icon}>
          <LogOut size={ICON} />
        </span>
        <span>Logout</span>
      </button>
    </aside>
  )
}
