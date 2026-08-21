import { useEffect, useRef, useState } from 'react'
import { Icon, IconButton } from '../ds'
import { Context } from '../screens/Context'
import { Flow } from '../screens/Flow'
import { Review } from '../screens/Review'
import { Variants } from '../screens/variants'
import { States } from '../screens/States'
import { Tradeoffs } from '../screens/Tradeoffs'
import { System } from '../screens/System'

/* `blurb` is what the bar and the contents sheet say about each chapter — one
   line, present tense, describing what you are looking at rather than selling
   it. Seven numbered pills in a row said the same thing in less space and told
   you nothing about any of them. */
const CHAPTERS = [
  { id: 'context',   label: 'Context',            blurb: 'The pitch in thirty seconds, and the three rules behind it.', el: Context },
  { id: 'flow',      label: 'End-to-end flow',    blurb: 'Six steps, and the four handoffs that were the hard part.',  el: Flow },
  { id: 'core',      label: 'Core screen',        blurb: 'The real screen, full size. Take the tour or click around.', el: () => <Review coach /> },
  { id: 'variants',  label: 'Variants',           blurb: 'Three ways to build the same screen. Swap them bottom right.', el: Variants },
  { id: 'states',    label: 'Every way it can go', blurb: 'Eighteen states. Not sure, still loading, not allowed, broken.', el: States },
  { id: 'tradeoffs', label: 'Trade-offs',         blurb: 'Three ways to ask permission, and why I kept the third.',           el: Tradeoffs },
  { id: 'system',    label: 'The building blocks', blurb: 'The parts every screen here is made from. Nothing is a one-off.', el: System },
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
  const [toc, setToc] = useState(false)
  const scroller = useRef<HTMLDivElement>(null)

  /* THE ONE OWNER OF THE THEME. Nothing else in the app writes this attribute.
     The Variants chapter has its own way in — the T key, and a Dark switch in
     the FAB panel — but those ANNOUNCE rather than set (see the theme-set
     listener below), the same announce-and-listen shape the coach tour uses to
     bring a pane forward. A second copy of the value is what made the two
     disagree: the explorer wrote the attribute directly, so pressing T left the
     page light while this bar's sun/moon still showed the opposite, and the
     next tap of it did nothing visible because the state it toggles already
     matched. One value, two controls, always in step. */
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  }, [dark])
  useEffect(() => {
    const on = (e: Event) => setDark(!!(e as CustomEvent<{ dark: boolean }>).detail?.dark)
    window.addEventListener('theme-set', on)
    return () => window.removeEventListener('theme-set', on)
  }, [])

  /* The chapters scroll inside `.body`, not the window — on a phone that is the
     difference between landing on a new chapter's title and landing two screens
     into it. */
  useEffect(() => { scroller.current?.scrollTo(0, 0) }, [chapter])

  /* Esc closes the contents sheet; ← → walk the deck. A case study gets read
     like a deck, so it should drive like one. Inputs are exempt so the
     console's own fields still take arrow keys. */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'Escape') setToc(false)
      if (e.metaKey || e.ctrlKey || e.altKey) return
      /* The coach tour and the approval drawer both own the arrow keys while
         they are open. Walking the deck out from under them would step the tour
         and change chapter on the same press. */
      if (document.querySelector('.coach-card, .drawer, .contents')) return
      const at = CHAPTERS.findIndex(c => c.id === chapter)
      if (e.key === 'ArrowRight' && at < CHAPTERS.length - 1) go(CHAPTERS[at + 1].id)
      if (e.key === 'ArrowLeft' && at > 0) go(CHAPTERS[at - 1].id)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [chapter, go])

  const Screen = CHAPTERS.find(c => c.id === chapter)!.el
  const idx = CHAPTERS.findIndex(c => c.id === chapter)

  return (
    <div className="app">
      {/* Presentation chrome: where you are, what it is, how far through. The
          chapter list moved into a sheet — seven pills competing for a phone's
          width is a menu, and this is a document. */}
      <header className="casebar">
        <div className="casebar-main">
          <button className="brand" onClick={() => go('context')} aria-label="Back to the start">
            <div className="brand-mark"><Icon name="wave" size={14} /></div>
            <span className="brand-name">Relay</span>
          </button>

          <button className="chapter-id" onClick={() => setToc(true)} aria-expanded={toc} aria-haspopup="dialog">
            <span className="chapter-n">{String(idx + 1).padStart(2, '0')}</span>
            <span className="chapter-titles">
              <span className="chapter-title">{CHAPTERS[idx].label}</span>
              <span className="chapter-blurb">{CHAPTERS[idx].blurb}</span>
            </span>
            <Icon name="chevronDown" size={13} className="chapter-caret" />
          </button>

          <span className="grow" />
          <div className="row" style={{ gap: 'var(--space-3)' }}>
            <span className="chapter-count">{idx + 1}<span>/{CHAPTERS.length}</span></span>
            <IconButton icon={dark ? 'sun' : 'moon'} size="sm" tip={dark ? 'Light' : 'Dark'} onClick={() => setDark(d => !d)} />
            <IconButton icon="chevronLeft" size="sm" tip="Previous" disabled={idx === 0} onClick={() => go(CHAPTERS[Math.max(0, idx - 1)].id)} />
            <IconButton icon="chevronRight" size="sm" tip="Next" disabled={idx === CHAPTERS.length - 1} onClick={() => go(CHAPTERS[Math.min(CHAPTERS.length - 1, idx + 1)].id)} />
          </div>
        </div>

        {/* Progress reads at a glance and costs one pixel of height. */}
        <div className="progress-rule" aria-hidden>
          {CHAPTERS.map((c, i) => <i key={c.id} data-done={i <= idx} />)}
        </div>
      </header>

      {toc && (
        <>
          <div className="scrim" onClick={() => setToc(false)} />
          <div className="contents" role="dialog" aria-label="Contents">
            <div className="contents-head">
              <span className="section-label">Contents</span>
              <span className="grow" />
              <IconButton icon="x" size="sm" tip="Close · Esc" onClick={() => setToc(false)} />
            </div>
            {CHAPTERS.map((c, i) => (
              <button
                key={c.id}
                className="contents-item"
                data-active={i === idx}
                onClick={() => { go(c.id); setToc(false) }}
              >
                <span className="contents-n">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <span className="contents-title">{c.label}</span>
                  <span className="contents-blurb">{c.blurb}</span>
                </span>
                {i === idx && <Icon name="check" size={14} className="contents-here" />}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="body" ref={scroller} style={{ overflow: 'auto', display: 'block' }}>
        <Screen />
      </div>
    </div>
  )
}
