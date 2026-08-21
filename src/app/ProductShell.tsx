import { useEffect, useState, type ReactNode } from 'react'
import { Icon, Badge, Avatar, IconButton, SearchField, type IconName } from '../ds'
import { queueCounts } from '../data/fixtures'

/* Both counts are READ OFF THE FIXTURES (see queueCounts). The review badge is
   the number of rows the queue actually holds, so the nav, the page header and
   the queue toolbar can never print three different sizes for one list again. */
const NAV: { icon: IconName; label: string; count?: string; urgent?: boolean }[] = [
  { icon: 'inbox', label: 'Inbox' },
  { icon: 'phone', label: 'Live calls', count: String(queueCounts.live) },
  { icon: 'shieldAlert', label: 'Review queue', count: String(queueCounts.waiting), urgent: true },
  { icon: 'message', label: 'Messaging' },
]
const NAV2: { icon: IconName; label: string }[] = [
  { icon: 'bot', label: 'Agents' },
  { icon: 'book', label: 'Knowledge' },
  { icon: 'hash', label: 'Numbers' },
  { icon: 'chart', label: 'Analytics' },
]

/* CSS handles every LOOK in this rebuild. This hook exists for the one thing
   CSS cannot do: choose different CONTENT. On a phone the console's page header
   describes the queue while you are in the queue and the call once you have
   opened one — two different sets of words, not two arrangements of the same
   ones — and no amount of media query will write the second heading.
   Expressed as min-width and negated at the call site so the whole codebase
   keeps one direction of thinking. */
export function useMinWidth(px: number) {
  const query = `(min-width: ${px}px)`
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatches(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return matches
}

export function ProductShell({ children, active = 'Review queue', header, view, pane }: {
  children: ReactNode
  active?: string
  header: ReactNode
  /* The console's two-state phone navigation. Only Review sets these; their
     presence is also what switches .content into the three-shape console grid,
     so variants B and C keep the plain flex box they need. */
  view?: 'list' | 'detail'
  pane?: 'transcript' | 'inspector'
}) {
  /* Below lg the product nav is off-canvas. It is the only part of the console
     that is about somewhere else, so it is the first thing to leave the layout
     — and it leaves as a drawer rather than vanishing, because a console with
     no visible product areas stops reading as a product. */
  const [navOpen, setNavOpen] = useState(false)
  useEffect(() => {
    if (!navOpen) return
    const h = (e: KeyboardEvent) => e.key === 'Escape' && setNavOpen(false)
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [navOpen])

  return (
    <div className="app shell">
      <div className="topbar">
        <IconButton className="navbtn tip-start" icon="menu" size="sm" tip="Menu" aria-expanded={navOpen} onClick={() => setNavOpen(true)} />
        <div className="brand">
          <div className="brand-mark"><Icon name="wave" size={14} /></div>
          <span className="brand-name">Relay</span>
        </div>
        <button className="workspace">
          Northwind Supply
          <Icon name="chevronDown" size={12} />
        </button>
        {/* Search is the widest thing in this bar and the least useful in a case
            study, so it is the last to arrive and the first to go. */}
        <div className="grow row shell-search" style={{ justifyContent: 'center' }}>
          <SearchField placeholder="Search calls, contacts, agents…" style={{ width: 'var(--search-w)' }} />
        </div>
        <span className="shell-spacer" />
        <span className="shell-health"><Badge tone="success" dot live>Agents healthy</Badge></span>
        <IconButton className="shell-settings" icon="settings" size="sm" tip="Settings" />
        <Avatar label="AT" />
      </div>

      <div className="body">
        {navOpen && <button className="nav-scrim" aria-label="Close menu" onClick={() => setNavOpen(false)} />}
        <nav className="nav" data-open={navOpen}>
          {NAV.map(n => (
            <button key={n.label} className="nav-item" data-active={active === n.label} onClick={() => setNavOpen(false)}>
              <Icon name={n.icon} size={16} />
              {n.label}
              {n.count && <span className="nav-count" data-urgent={n.urgent}>{n.count}</span>}
            </button>
          ))}
          <div className="nav-group"><span className="section-label">Configure</span></div>
          {NAV2.map(n => (
            <button key={n.label} className="nav-item" data-active={active === n.label} onClick={() => setNavOpen(false)}>
              <Icon name={n.icon} size={16} />
              {n.label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button className="nav-item">
            <Icon name="users" size={16} />
            Team
          </button>
        </nav>

        <div className="main">
          {header}
          <div className="content" data-view={view} data-pane={pane}>{children}</div>
        </div>
      </div>
    </div>
  )
}

export function PageHeader({ crumbs, title, meta, actions, back, panes, phoneActions }: {
  crumbs: string[]
  title: ReactNode
  meta?: ReactNode
  actions?: ReactNode
  /* Phone only: the way out of the detail view, back to the queue. */
  back?: () => void
  /* Below xl the inspector is not a column, so the control that summons it
     lives here, beside the thing it inspects. */
  panes?: ReactNode
  /* Header actions are secondary everywhere except variant B, where Skip and
     Next ARE the navigation. Opt in rather than out, so no screen keeps a row
     of chrome on a phone by accident. */
  phoneActions?: boolean
}) {
  return (
    <div className="pageheader">
      {back && <IconButton className="pageheader-back tip-start" icon="chevronLeft" bordered tip="Back to the queue" onClick={back} />}
      <div className="col grow" style={{ gap: 'var(--space-1)', minWidth: 0 }}>
        <div className="crumbs">
          {crumbs.map((c, i) => (
            <span key={c} className="row" style={{ gap: 'var(--space-3)' }}>
              {i > 0 && <Icon name="chevronRight" size={12} style={{ color: 'var(--fg-disabled)' }} />}
              <a href="#core">{c}</a>
            </span>
          ))}
        </div>
        <div className="page-meta">
          <span className="page-title truncate">{title}</span>
          {meta}
        </div>
      </div>
      {panes}
      {actions && <div className="row pageheader-actions" data-phone={phoneActions ? 'true' : undefined} style={{ gap: 'var(--space-3)' }}>{actions}</div>}
    </div>
  )
}
