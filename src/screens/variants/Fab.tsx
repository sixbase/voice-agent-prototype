import { useEffect, useState } from 'react'
import { Badge, Button, Divider, Icon, IconButton, Kbd, SectionLabel, Switch } from '../../ds'

export type VariantId = 'a' | 'b' | 'c'
export type Prefs = {
  variant: VariantId
  density: 'comfortable' | 'compact'
  theme: 'light' | 'dark'
  coach: 'off' | 'pins' | 'tour'
}

export const VARIANTS: { id: VariantId; key: string; name: string; idea: string; best: string }[] = [
  { id: 'a', key: '1', name: 'Inspector', idea: 'Call on the left, AI output on the right.', best: 'Careful review — proof and answer side by side.' },
  { id: 'b', key: '2', name: 'Decision first', idea: 'One big decision. Proof only if you ask.', best: 'Speed — read one card, approve, next.' },
  { id: 'c', key: '3', name: 'Triage table', idea: 'All calls in a table. Rows open in place.', best: 'Volume — clear the easy ones in one pass.' },
]

export function Fab({ prefs, set, attention }: { prefs: Prefs; set: (p: Partial<Prefs>) => void; attention: boolean }) {
  const [open, setOpen] = useState(false)
  const active = VARIANTS.find(v => v.id === prefs.variant)!

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      const k = e.key.toLowerCase()
      if (k === '1') set({ variant: 'a' })
      if (k === '2') set({ variant: 'b' })
      if (k === '3') set({ variant: 'c' })
      if (k === 'v') {
        const i = VARIANTS.findIndex(v => v.id === prefs.variant)
        set({ variant: VARIANTS[(i + 1) % VARIANTS.length].id })
      }
      if (k === 'd') set({ density: prefs.density === 'compact' ? 'comfortable' : 'compact' })
      if (k === 't') set({ theme: prefs.theme === 'dark' ? 'light' : 'dark' })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prefs, set])

  const cycle = () => {
    const i = VARIANTS.findIndex(v => v.id === prefs.variant)
    set({ variant: VARIANTS[(i + 1) % VARIANTS.length].id })
  }

  return (
    <>
      {/* A phone has no Escape key and no pointer to move away, so the panel
          needs somewhere to be dismissed FROM. Sits under the FAB layer and
          over everything it covers. */}
      {open && <button className="fab-dismiss" aria-label="Close layout ideas" onClick={() => setOpen(false)} />}
      <div className="fab-layer">
      {open && (
        <div className="fab-panel">
          <div className="fab-sec">
            <div className="row" style={{ marginBottom: 'var(--space-5)' }}>
              <SectionLabel>Layout idea</SectionLabel>
              <span className="grow" />
              {/* Was a legend reading "V cycles" — true, and useless on a phone.
                  Every shortcut in this explorer (1 2 3 V D T H ?) now has a
                  tappable twin in this panel; this is V's. */}
              <Button size="sm" variant="ghost" icon="refresh" onClick={cycle}>Cycle<Kbd>V</Kbd></Button>
            </div>
            <div className="col" style={{ gap: 'var(--space-1)' }}>
              {VARIANTS.map(v => (
                <button key={v.id} className="fab-choice" data-active={v.id === prefs.variant} onClick={() => set({ variant: v.id })}>
                  <div className="grow">
                    <div style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--lh-md)', fontWeight: 'var(--weight-medium)' }}>{v.name}</div>
                    <div style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--lh-sm)', color: 'var(--fg-tertiary)', marginTop: 1 }}>{v.idea}</div>
                  </div>
                  <Kbd>{v.key}</Kbd>
                </button>
              ))}
            </div>
            <div style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--lh-sm)', color: 'var(--fg-secondary)', marginTop: 'var(--space-5)', paddingLeft: 'var(--space-5)' }}>
              <b style={{ fontWeight: 'var(--weight-semibold)' }}>Best for:</b> {active.best}
            </div>
          </div>

          <div className="fab-sec" style={{ padding: 'var(--space-4) var(--space-3)' }}>
            <SectionLabel style={{ padding: '0 var(--space-5) var(--space-3)' }}>Knobs</SectionLabel>
            {[
              { label: 'Tighter rows', k: 'D', on: prefs.density === 'compact', set: (v: boolean) => set({ density: v ? 'compact' : 'comfortable' }) },
              { label: 'Dark', k: 'T', on: prefs.theme === 'dark', set: (v: boolean) => set({ theme: v ? 'dark' : 'light' }) },
            ].map(row => (
              <div className="fab-row" key={row.label}>
                <span className="row" style={{ gap: 'var(--space-4)', fontSize: 'var(--text-md)', lineHeight: 'var(--lh-md)' }}>{row.label}<Kbd>{row.k}</Kbd></span>
                <Switch checked={row.on} onChange={row.set} />
              </div>
            ))}
          </div>

          <div className="fab-sec">
            <div className="row" style={{ gap: 'var(--space-3)' }}>
              <Badge tone="neutral">Relay DS</Badge>
              <span style={{ fontSize: 'var(--text-xs)', lineHeight: 'var(--lh-xs)', color: 'var(--fg-tertiary)' }}>same tokens &amp; components in all three</span>
            </div>
          </div>
        </div>
      )}

      <button
        className="fab"
        data-coach="fab"
        data-attention={attention && !open}
        style={{ position: 'relative' }}
        onClick={() => setOpen(o => !o)}
        aria-label="Layout ideas"
        aria-expanded={open}
      >
        <Icon name={open ? 'x' : 'layers'} size={20} />
      </button>
      </div>
    </>
  )
}
