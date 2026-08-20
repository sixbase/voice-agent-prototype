import { useEffect, useState } from 'react'
import { Icon, IconButton } from '../ds'
import { Context } from '../screens/Context'
import { Flow } from '../screens/Flow'
import { Review } from '../screens/Review'
import { States } from '../screens/States'
import { Tradeoffs } from '../screens/Tradeoffs'
import { System } from '../screens/System'

const CHAPTERS = [
  { id: 'context',   label: 'Context',        el: Context },
  { id: 'flow',      label: 'End-to-end flow', el: Flow },
  { id: 'core',      label: 'Core screen',    el: Review },
  { id: 'states',    label: 'States & edge cases', el: States },
  { id: 'tradeoffs', label: 'Trade-offs',     el: Tradeoffs },
  { id: 'system',    label: 'Design system',  el: System },
] as const

type ChapterId = typeof CHAPTERS[number]['id']

function useHash(): [ChapterId, (id: ChapterId) => void] {
  const read = (): ChapterId => {
    const h = window.location.hash.replace('#', '') as ChapterId
    return CHAPTERS.some(c => c.id === h) ? h : 'context'
  }
  const [id, setId] = useState<ChapterId>(read)
  useEffect(() => {
    const on = () => setId(read())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return [id, (next) => { window.location.hash = next }]
}

export function App() {
  const [chapter, go] = useHash()
  const [dark, setDark] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  }, [dark])

  useEffect(() => { window.scrollTo(0, 0) }, [chapter])

  const Screen = CHAPTERS.find(c => c.id === chapter)!.el
  const idx = CHAPTERS.findIndex(c => c.id === chapter)

  return (
    <div className="app">
      <header className="topbar" style={{ height: 44, paddingLeft: 'var(--space-7)' }}>
        <div className="brand">
          <div className="brand-mark"><Icon name="wave" size={13} /></div>
          <span className="brand-name">Relay</span>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-tertiary)' }}>AI voice &amp; messaging agents</span>
        </div>

        <nav className="row grow" style={{ gap: 2, marginLeft: 'var(--space-6)' }}>
          {CHAPTERS.map((c, i) => (
            <button
              key={c.id}
              onClick={() => go(c.id)}
              className="nav-item"
              data-active={chapter === c.id}
              style={{ width: 'auto', height: 26, fontSize: 'var(--text-sm)' }}
            >
              <span style={{ fontVariantNumeric: 'tabular-nums', color: chapter === c.id ? 'inherit' : 'var(--fg-disabled)', marginRight: 2 }}>{i + 1}</span>
              {c.label}
            </button>
          ))}
        </nav>

        <div className="row" style={{ gap: 'var(--space-3)' }}>
          <IconButton icon={dark ? 'sun' : 'moon'} size="sm" tip={dark ? 'Light' : 'Dark'} onClick={() => setDark(d => !d)} />
          <IconButton icon="chevronLeft" size="sm" tip="Previous" disabled={idx === 0} onClick={() => go(CHAPTERS[Math.max(0, idx - 1)].id)} />
          <IconButton icon="chevronRight" size="sm" tip="Next" disabled={idx === CHAPTERS.length - 1} onClick={() => go(CHAPTERS[Math.min(CHAPTERS.length - 1, idx + 1)].id)} />
        </div>
      </header>

      <div className="body" style={{ overflow: 'auto', display: 'block' }}>
        <Screen />
      </div>
    </div>
  )
}
