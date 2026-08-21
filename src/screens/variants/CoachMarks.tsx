import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Button, IconButton } from '../../ds'
import { useMinWidth } from '../../app/ProductShell'

export type Step = {
  sel: string
  title: string
  body: string
  place?: 'right' | 'left' | 'top' | 'bottom'
}

type Rect = { top: number; left: number; width: number; height: number }

/* The pin hangs on the leading edge of the region it marks, like a margin
   note: --space-3 outside it horizontally, and one mark-height down from its
   top (or half way down, whichever is less, for short targets). The pin is
   positioned from JS, so these mirror the tokens rather than read them. */
const PIN_OFF = 6
const PIN_DROP = 22
const PIN_RADIUS = 11  /* half of --mark-sz */

/* Where the pin for a given target goes. See the call site for why the two
   axes are decided together rather than one each. */
const pinPos = (r: Rect) => {
  const clamped = r.left - PIN_OFF < PIN_RADIUS + 2
  return {
    top: clamped ? r.top : r.top + Math.min(PIN_DROP, r.height / 2),
    left: clamped ? PIN_RADIUS + 2 : r.left - PIN_OFF,
  }
}

const rectOf = (sel: string): Rect | null => {
  const el = document.querySelector(sel)
  if (!el) return null
  const r = el.getBoundingClientRect()
  if (!r.width && !r.height) return null
  return { top: r.top, left: r.left, width: r.width, height: r.height }
}

export function CoachMarks({
  steps, mode, onExit, onMode,
}: {
  steps: Step[]
  mode: 'off' | 'pins' | 'tour'
  onExit: () => void
  onMode: (m: 'off' | 'pins' | 'tour') => void
}) {
  const [rawI, setI] = useState(0)
  const [rects, setRects] = useState<(Rect | null)[]>([])
  /* Below md a 296px card cannot sit beside anything, so it docks to an edge
     instead. See `cardPos` for which edge and why. */
  const roomBeside = useMinWidth(768)
  /* The card is 141–181px tall depending on how long the body copy is, so its
     height has to be measured, not assumed — a fixed guess put the 'top'
     placement on top of the very control it was pointing at. */
  const cardRef = useRef<HTMLDivElement>(null)
  const [cardH, setCardH] = useState(160)
  /* Which way the reader is travelling. The words slide in from the side they
     are coming FROM, so Next and Back feel like two different moves rather
     than the same fade played twice. */
  const dir = useRef<1 | -1>(1)
  /* The card is 141–181px depending on how long the body copy is, so its height
     changes between steps. Measured off the inner box (which owns the padding)
     so the card can animate to an exact number instead of jumping. */
  const innerRef = useRef<HTMLDivElement>(null)
  const [innerH, setInnerH] = useState<number | null>(null)
  useLayoutEffect(() => {
    const h = innerRef.current?.offsetHeight
    if (h && h !== innerH) setInnerH(h)
  })
  useLayoutEffect(() => {
    const h = cardRef.current?.offsetHeight
    if (h) setCardH(h)
  })

  /* Switching variant mid-tour swaps `steps` a full render before the reset
     effect and the re-measure land, so `rawI` can point past the new array
     (6 steps → 5) while `rects` still holds the old ones. Clamp here, before
     anything reads either, or the card renders against an undefined step. */
  const i = Math.max(0, Math.min(rawI, steps.length - 1))

  /* Anchor to live DOM so marks survive layout, density and variant changes. */
  useLayoutEffect(() => {
    const measure = () => setRects(steps.map(s => rectOf(s.sel)))
    measure()
    const t = setTimeout(measure, 60)
    window.addEventListener('resize', measure)
    const int = setInterval(measure, 500)
    return () => { clearTimeout(t); clearInterval(int); window.removeEventListener('resize', measure) }
  }, [steps, mode])

  /* Layout phase, not effect phase: a post-paint reset would flash the old
     step number for one frame every time the variant changes. */
  useLayoutEffect(() => { setI(0) }, [steps])

  /* ---------- starting the tour starts it at the START ----------
     `steps` is a stable module-level array, so the reset above only fires when
     the VARIANT changes. Entering the tour does not touch it — which meant the
     tour reopened wherever you last left it: walk to step 6, close, press `?`
     or use the FAB's Take the tour, and you were dropped back on step 6 of 6
     with a Done button and no way to know what the first five said.

     A pin is the one entry point where resuming mid-tour is the whole point —
     the pin IS the step — so it raises a flag on its way through and this
     effect stands down for that one transition. Everything else (the invite,
     the key, the panel) means "from the top", and now gets it. */
  const fromPin = useRef(false)
  const wasTour = useRef(mode === 'tour')
  useLayoutEffect(() => {
    if (mode === 'tour' && !wasTour.current && !fromPin.current) setI(0)
    fromPin.current = false
    wasTour.current = mode === 'tour'
  }, [mode])

  /* Bring the target into view — several steps sit below the fold in a
     scrolling column, and a spotlight you cannot see is worse than none.

     On a phone "below the fold" is not the only way a target can be out of
     sight: four of layout A's six steps point INSIDE the inspector, which below
     md is a tab you have to be on. Scrolling cannot fix that. So the step first
     ANNOUNCES the selector it is about to spotlight, and whichever screen owns
     that element brings it forward (see the coach-reveal listener in Review) —
     then we scroll, then we measure. Announce-and-listen rather than a prop
     chain: the tour does not know which layout is mounted, and the layouts do
     not know a tour exists. */
  useEffect(() => {
    if (mode !== 'tour') return
    const sel = steps[i]?.sel
    if (!sel) return
    window.dispatchEvent(new CustomEvent('coach-reveal', { detail: { sel } }))
    /* Two frames, then a beat: frame one lets the reveal's state land, frame
       two lets the layout settle, and the timeout catches a pane that animates
       in rather than appearing. */
    const measure = () => {
      document.querySelector(sel)?.scrollIntoView({ block: 'center' })
      setRects(steps.map(x => rectOf(x.sel)))
    }
    const raf = requestAnimationFrame(() => requestAnimationFrame(measure))
    const t = setTimeout(measure, 280)
    return () => { cancelAnimationFrame(raf); clearTimeout(t) }
  }, [i, mode, steps])

  useEffect(() => {
    if (mode !== 'tour') return
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onExit()
      if (e.key === 'ArrowRight') { dir.current = 1; setI(v => Math.min(steps.length - 1, v + 1)) }
      if (e.key === 'ArrowLeft') { dir.current = -1; setI(v => Math.max(0, v - 1)) }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [mode, steps.length, onExit])

  if (mode === 'off') return null

  const step = steps[i]
  if (!step) return null
  const active = rects[i] ?? null

  /* ---------- card placement ----------
     Desktop: beside the target, flipping to stay on screen.

     Phone: DOCKED to an edge, and specifically to the edge the target is NOT
     near. A 296px card beside a target is impossible at 390, and a card that
     always docks to the bottom covers any target in the lower half — including
     the FAB, which is one of the tour's own steps. Comparing the target's
     centre against the middle of the viewport is a rule that cannot fail: the
     card takes the half the target is not in, so it can never cover the thing
     it is pointing at, at any width or any scroll position. */
  const dock: 'top' | 'bottom' | null = !roomBeside
    ? (active && active.top + active.height / 2 > window.innerHeight / 2 ? 'top' : 'bottom')
    : null

  const cardPos = (() => {
    if (dock) return undefined
    if (!active) return { top: 120, left: 120 }
    const place = step.place ?? 'right'
    const W = 296, GAP = 16 /* mirrors --coach-card-w and --space-7 */
    let top = active.top + active.height / 2 - cardH / 2
    let left = place === 'left' ? active.left - W - GAP : active.left + active.width + GAP
    if (place === 'top') { top = active.top - cardH - GAP; left = active.left + active.width / 2 - W / 2 }
    if (place === 'bottom') { top = active.top + active.height + GAP; left = active.left + active.width / 2 - W / 2 }
    left = Math.max(GAP, Math.min(left, window.innerWidth - W - GAP))
    top = Math.max(GAP, Math.min(top, window.innerHeight - cardH - GAP))
    return { top, left }
  })()

  return (
    <div className="coach-layer">
      {mode === 'tour' && active && (
        <div
          className="coach-ring"
          style={{ top: active.top - 5, left: active.left - 5, width: active.width + 10, height: active.height + 10 }}
        />
      )}

      {/* rects can lag one render behind `steps` when the variant changes,
          so index into `steps` defensively. */}
      {/* Centred on the target's top edge, the pin sat on live text — it ate the
          label of the Approve button it was pointing at, and an order number in
          variant B. On the leading edge it lands in the gutter, the card's
          border radius or a row's flag bar instead, in every layout. */}
      {rects.map((r, n) =>
        r && steps[n] && (mode === 'pins' || n === i) ? (
          <button
            key={n}
            className="coach-mark"
            data-active={mode === 'tour' && n === i}
            /* The pin is centred on this point, so a target flush against the
               left edge — the queue, a triage card, variant B's rail — used to
               put half of it off screen on a phone. Clamped to its own radius
               plus a hair, it tucks against the edge instead of over it.

               And when it IS clamped there is no gutter left to hang in, so
               dropping it a mark-height into the target put it squarely on the
               first thing that target draws: the queue's first avatar, a triage
               row's checkbox, and — worst — the bulk bar's count, where it
               covered the digit and turned "3 picked" into "1 picked". Clamped
               horizontally, it sits on the target's TOP EDGE instead and
               straddles the border, which is the one line of any panel that is
               guaranteed to carry nothing. */
            /* --i staggers the pulse; six pins in lockstep read as an alarm. */
            style={{ ...pinPos(r), ['--i' as string]: n }}
            onClick={() => { fromPin.current = true; dir.current = n >= i ? 1 : -1; setI(n); onMode('tour') }}
            title={steps[n].title}
          >
            {n + 1}
          </button>
        ) : null,
      )}

      {mode === 'tour' && (
        <div
          className="coach-card"
          ref={cardRef}
          data-dock={dock ?? undefined}
          data-dir={dir.current === 1 ? 'fwd' : 'back'}
          style={{ ...cardPos, height: innerH ?? undefined }}
        >
         <div className="coach-inner" ref={innerRef}>
          <div className="row" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <span className="section-label">Step {i + 1} of {steps.length}</span>
            <span className="grow" />
            {/* An IconButton rather than a bare 14px glyph: this is the only
                way out of the tour on a phone, and .iconbtn is what carries the
                44px hit area on a coarse pointer. */}
            <IconButton icon="x" size="sm" aria-label="Close tour" onClick={onExit} />
          </div>
          {/* Keyed on the step so React remounts it: the words cross-fade
              while the card itself glides to the next target. */}
          <div className="coach-body" key={i}>
            <h4>{step.title}</h4>
            <p>{step.body}</p>
          </div>
          <div className="row" style={{ gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
            <div className="coach-dots">
              {steps.map((_, n) => <i key={n} data-on={n === i} />)}
            </div>
            <span className="grow" />
            <Button size="sm" variant="ghost" disabled={i === 0} onClick={() => { dir.current = -1; setI(i - 1) }}>Back</Button>
            {i === steps.length - 1
              ? <Button size="sm" variant="primary" onClick={onExit}>Done</Button>
              : <Button size="sm" variant="primary" iconEnd="arrowRight" onClick={() => { dir.current = 1; setI(i + 1) }}>Next</Button>}
          </div>
         </div>
        </div>
      )}
    </div>
  )
}
