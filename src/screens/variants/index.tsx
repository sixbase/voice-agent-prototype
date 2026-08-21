import { useEffect, useState } from 'react'
import { Icon } from '../../ds'
import { Review } from '../Review'
import { DecisionFirst } from './DecisionFirst'
import { Triage } from './Triage'
import { Fab, type Prefs, type VariantId } from './Fab'
import { CoachMarks } from './CoachMarks'
import { FAB_STEP } from '../coachSteps'

/* Coach marks are anchored to live selectors, so they follow the layout
   when density, theme or variant changes. */

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


      <Fab prefs={{ ...prefs, theme }} set={set} attention={!touchedFab} />

      {/* One mark, pointing at the button that swaps the layouts. Chapter 3
          already walked through the screen itself; repeating that here buried
          the comparison under its own instructions. */}
      <CoachMarks
        steps={FAB_STEP}
        mode="pins"
        onExit={() => {}}
        onMode={() => {}}
      />


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
