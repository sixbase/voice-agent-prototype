import type { ReactNode } from 'react'
import { Icon, Badge, Avatar, IconButton, SearchField, type IconName } from '../ds'

const NAV: { icon: IconName; label: string; count?: string; urgent?: boolean }[] = [
  { icon: 'inbox', label: 'Inbox' },
  { icon: 'phone', label: 'Live calls', count: '3' },
  { icon: 'shieldAlert', label: 'Review queue', count: '12', urgent: true },
  { icon: 'message', label: 'Messaging' },
]
const NAV2: { icon: IconName; label: string }[] = [
  { icon: 'bot', label: 'Agents' },
  { icon: 'book', label: 'Knowledge' },
  { icon: 'hash', label: 'Numbers' },
  { icon: 'chart', label: 'Analytics' },
]

export function ProductShell({ children, active = 'Review queue', header }: { children: ReactNode; active?: string; header: ReactNode }) {
  return (
    <div className="app" style={{ height: 'calc(100vh - 44px)' }}>
      <div className="topbar">
        <div className="brand">
          <div className="brand-mark"><Icon name="wave" size={13} /></div>
          <span className="brand-name">Relay</span>
        </div>
        <button className="workspace">
          Northwind Supply
          <Icon name="chevronDown" size={12} />
        </button>
        <div className="grow row" style={{ justifyContent: 'center' }}>
          <SearchField placeholder="Search calls, contacts, agents…" style={{ width: 340 }} />
        </div>
        <Badge tone="success" dot live>Agents healthy</Badge>
        <IconButton icon="settings" size="sm" tip="Settings" />
        <Avatar label="AT" />
      </div>

      <div className="body">
        <nav className="nav">
          {NAV.map(n => (
            <button key={n.label} className="nav-item" data-active={active === n.label}>
              <Icon name={n.icon} size={15} />
              {n.label}
              {n.count && <span className="nav-count" data-urgent={n.urgent}>{n.count}</span>}
            </button>
          ))}
          <div className="nav-group"><span className="section-label">Configure</span></div>
          {NAV2.map(n => (
            <button key={n.label} className="nav-item" data-active={active === n.label}>
              <Icon name={n.icon} size={15} />
              {n.label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button className="nav-item">
            <Icon name="users" size={15} />
            Team
          </button>
        </nav>

        <div className="main">
          {header}
          <div className="content">{children}</div>
        </div>
      </div>
    </div>
  )
}

export function PageHeader({ crumbs, title, meta, actions }: { crumbs: string[]; title: ReactNode; meta?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="pageheader">
      <div className="col grow" style={{ gap: 2, minWidth: 0 }}>
        <div className="crumbs">
          {crumbs.map((c, i) => (
            <span key={c} className="row" style={{ gap: 'var(--space-3)' }}>
              {i > 0 && <Icon name="chevronRight" size={11} style={{ color: 'var(--fg-disabled)' }} />}
              <a href="#core">{c}</a>
            </span>
          ))}
        </div>
        <div className="row" style={{ gap: 'var(--space-5)', minWidth: 0 }}>
          <span className="page-title truncate">{title}</span>
          {meta}
        </div>
      </div>
      {actions && <div className="row" style={{ gap: 'var(--space-3)' }}>{actions}</div>}
    </div>
  )
}
