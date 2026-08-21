import { useEffect, useState } from 'react'
import { Button, Icon, IconButton, Kbd } from '../../ds'
import { Review } from '../Review'
import { DecisionFirst } from './DecisionFirst'
import { Triage } from './Triage'
import { Fab, type Prefs, type VariantId } from './Fab'
import { CoachMarks, type Step } from './CoachMarks'

/* Coach marks are anchored to live selectors, so they follow the layout
   when density, theme or variant changes. */
const STEPS: Record<VariantId, Step[]> = {
  a: [
    { sel: '.queue-list', title: 'Start here — the queue', body: 'Every call the AI could not finish on its own. Click any name to open it. Eight are loaded, and each one is a different situation.', place: 'right' },
    { sel: '[data-coach="fields"] .fieldrow[data-flag="true"]', title: 'How sure the AI is', body: 'Green means it is confident. Amber means glance. Red means look properly — and the red line down the left edge is there so you find it without reading.', place: 'left' },
    { sel: '.turn-uncertain', title: 'Where it misheard', body: 'The dashed underline is the exact moment the AI got shaky. Tap or hover it to see how badly.', place: 'top' },
    { sel: '.proposal[data-gated="true"]', title: 'What it wants to do', body: 'This one moves money, so it is blocked. The rule that blocked it is named — refund_limit — not just "denied".', place: 'left' },
    { sel: '[data-coach="approve"]', title: 'Commit', body: 'Opens a panel over the transcript so you can read the quote while you type the amount. The button says the amount, never "OK".', place: 'top' },
    { sel: '[data-coach="fab"]', title: 'See other layouts', body: 'Click this button to switch between three different takes on this screen. Or press 1, 2, 3.', place: 'left' },
  ],
  b: [
    { sel: '[data-coach="rail"]', title: 'The queue shrinks', body: 'Just faces. You are meant to do one call and move on, not browse. A red dot means that one is shaky.', place: 'right' },
    { sel: '[data-coach="hero"]', title: 'One decision', body: 'Said in plain words, with the amount in the button. Everything else on the page is optional.', place: 'bottom' },
    { sel: '[data-coach="chips"]', title: 'What the AI heard', body: 'Chips instead of rows. Red ones are shaky. Click any chip to see the exact quote behind it.', place: 'top' },
    { sel: '[data-coach="disclosure"]', title: 'Proof on demand', body: 'The transcript stays folded away. Most calls never need it — that is the bet this layout makes.', place: 'top' },
    { sel: '[data-coach="fab"]', title: 'See other layouts', body: 'Press 1, 2, 3 or click here to compare this against the other two.', place: 'left' },
  ],
  c: [
    { sel: '[data-coach="bulk"]', title: 'Clear the easy ones', body: 'Bulk approve is on, but it refuses any call with money or a shaky answer. It clears the boring majority and nothing else.', place: 'bottom' },
    { sel: '[data-coach="row"]', title: 'Click a row', body: 'It opens inside the table. No page change, no lost place — reviewers work in long streaks.', place: 'bottom' },
    { sel: '[data-coach="expand"]', title: 'Proof and actions together', body: 'What the AI heard on the left, what it wants to do on the right. Same proposal card as the other two layouts.', place: 'top' },
    { sel: '[data-coach="fab"]', title: 'See other layouts', body: 'Press 1, 2, 3 or click here to compare.', place: 'left' },
  ],
}

/* The theme is NOT this chapter's to own — the sun/moon in the chapter bar and
   the T key here are two controls on one value, and holding a second copy of it
   is exactly what let the two drift apart. So this reads the live value off the
   document and writes by ANNOUNCING; App is the only writer (see its theme-set
   listener). MutationObserver rather than a prop chain because the case study
   renders its chapters generically and does not know this one wants a say. */
function useDocTheme(): Prefs['theme'] {
  const read = () => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')
  const [theme, setTheme] = useState<Prefs['theme']>(read)
  useEffect(() => {
    const o = new MutationObserver(() => setTheme(read()))
    o.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    setTheme(read())
    return () => o.disconnect()
  }, [])
  return theme
}

export function Variants() {
  const [prefs, setPrefs] = useState<Omit<Prefs, 'theme'>>(() => ({
    variant: 'a', density: 'comfortable', coach: 'pins',
  }))
  const theme = useDocTheme()
  const [toast, setToast] = useState<string | null>(null)
  const [invite, setInvite] = useState(true)
  const [touchedFab, setTouchedFab] = useState(false)

  const set = (p: Partial<Prefs>) => {
    if (p.theme) window.dispatchEvent(new CustomEvent('theme-set', { detail: { dark: p.theme === 'dark' } }))
    const { theme: _t, ...rest } = p
    if (Object.keys(rest).length) setPrefs(s => ({ ...s, ...rest }))
    if (p.variant) setTouchedFab(true)
  }

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 3800)
    return () => clearTimeout(id)
  }, [toast])

  const Screen = prefs.variant === 'a' ? Review : prefs.variant === 'b' ? DecisionFirst : Triage

  return (
    <div className="explorer" data-density={prefs.density}>
      {prefs.variant === 'a'
        ? <Review />
        : <Screen onApprove={(m: string) => setToast(m)} />}

      {invite && prefs.coach !== 'tour' && (
        <div className="explorer-float tour-invite">
          <Icon name="sparkle" size={14} />
          <span className="tour-invite-copy">First time here? Take the 30-second tour.</span>
          <Button size="sm" variant="primary" onClick={() => { setPrefs(s => ({ ...s, coach: 'tour' })); setInvite(false) }}>
            Show me around
          </Button>
          {/* IconButton, not a bare glyph: .iconbtn is what carries the 44px
              hit area on a coarse pointer, and this was a 22px target. */}
          <IconButton icon="x" size="sm" aria-label="Dismiss" onClick={() => setInvite(false)} />
        </div>
      )}

      <Fab prefs={{ ...prefs, theme }} set={set} attention={!touchedFab} />

      <CoachMarks
        steps={STEPS[prefs.variant]}
        mode={prefs.coach}
        onExit={() => setPrefs(s => ({ ...s, coach: 'pins' }))}
        onMode={m => setPrefs(s => ({ ...s, coach: m }))}
      />

      {/* Same bottom offset as the FAB: both clear the action bar (and the
          nav's last item), and sitting on one line reads as deliberate. Every
          word of it is about keys, so it is desktop-only — see .pins-hint. */}
      {prefs.coach === 'pins' && (
        <div className="explorer-float pins-hint">
          <span className="coach-mark" style={{ position: 'static', transform: 'none', width: 'var(--control-h-2xs)', height: 'var(--control-h-2xs)', boxShadow: 'none' }}>1</span>
          Click a numbered dot, or <Kbd>?</Kbd> for the tour · <Kbd>H</Kbd> hides these
        </div>
      )}

      {toast && (
        <div className="toast-layer">
          <div className="toast">
            <Icon name="checkCircle" size={16} style={{ color: 'var(--fg-success-inverse)' }} />
            {toast}
            <button onClick={() => setToast(null)}>Undo</button>
          </div>
        </div>
      )}
    </div>
  )
}
