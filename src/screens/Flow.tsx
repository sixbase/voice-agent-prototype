import type { ReactNode } from 'react'
import { Badge, Button, Icon, SectionLabel, type IconName } from '../ds'

/* Schematic mini-frames — deliberately abstract so the eye reads structure, not
   content. The raw px below are ILLUSTRATION geometry (a UI drawn at ~1/4 scale),
   not product chrome, so they sit under the 4pt scale on purpose. Colours and
   radii still come from tokens so the drawings follow the theme. */
const bar = (w: number | string, h = 6, c = 'var(--border-default)') => (
  <div style={{ width: w, height: h, borderRadius: 'var(--radius-2xs)', background: c }} />
)

function Frame({ children, dim }: { children: ReactNode; dim?: boolean }) {
  return (
    <div style={{
      height: 168, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)', overflow: 'hidden', display: 'flex', flexDirection: 'column',
      opacity: dim ? .72 : 1,
    }}>
      <div style={{ height: 16, borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 4, padding: '0 6px' }}>
        {bar(20, 4, 'var(--accent-bg)')}{bar(28, 4)}<span style={{ flex: 1 }} />{bar(14, 4)}
      </div>
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>{children}</div>
    </div>
  )
}
const Rail = () => (
  <div style={{ width: 34, borderRight: '1px solid var(--border-subtle)', padding: 6, display: 'flex', flexDirection: 'column', gap: 5 }}>
    {[0, 1, 2, 3].map(i => <div key={i} style={{ display: 'flex', gap: 3, alignItems: 'center' }}>{bar(5, 5, i === 2 ? 'var(--accent-bg)' : 'var(--border-default)')}{bar(15, 4)}</div>)}
  </div>
)

const STEPS: { id: string; icon: IconName; label: string; who: string; desc: string; core?: boolean; frame: ReactNode }[] = [
  {
    id: '01', icon: 'settings', label: 'Set the rules', who: 'The boss · once, up front',
    desc: 'Decide what the AI may do on its own, and where it has to stop and ask.',
    frame: <Frame dim><Rail /><div style={{ flex: 1, padding: 8, display: 'flex', flexDirection: 'column', gap: 7 }}>
      {bar(70, 7)}{bar('100%')}{bar('86%')}
      <div style={{ height: 1, background: 'var(--border-subtle)', margin: '2px 0' }} />
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>{bar(40, 12, 'var(--warning-bg)')}{bar(52, 5)}</div>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>{bar(40, 12, 'var(--warning-bg)')}{bar(36, 5)}</div>
    </div></Frame>,
  },
  {
    id: '02', icon: 'phone', label: 'The AI takes the call', who: 'The AI · nobody watching',
    desc: 'It answers, looks things up, and sorts it out. Most calls stop right here.',
    frame: <Frame dim><Rail /><div style={{ flex: 1, padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', gap: 5 }}>{bar(6, 6, 'var(--ai-solid)')}{bar('72%')}</div>
      <div style={{ display: 'flex', gap: 5, paddingLeft: 11 }}>{bar('54%')}</div>
      <div style={{ display: 'flex', gap: 5 }}>{bar(6, 6, 'var(--info-solid)')}{bar('62%')}</div>
      {bar('100%', 12, 'var(--bg-sunken)')}
      <div style={{ display: 'flex', gap: 5 }}>{bar(6, 6, 'var(--ai-solid)')}{bar('80%')}</div>
    </div></Frame>,
  },
  {
    id: '03', icon: 'shieldAlert', label: 'Some calls get flagged', who: 'A person · picking what to do first',
    desc: 'Only two kinds land here: the AI broke a rule, or the AI was not sure. Biggest money first.',
    frame: <Frame><Rail /><div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
      <div style={{ width: 90, borderRight: '1px solid var(--border-subtle)', padding: 6, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[0, 1, 2, 3].map(i => <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 3, background: i === 0 ? 'var(--bg-selected)' : undefined, margin: -2, padding: 2, borderRadius: 3 }}>
          {bar('76%', 5)}{bar('92%', 4)}<div style={{ display: 'flex', gap: 3 }}>{bar(18, 6, i === 0 ? 'var(--conf-low-solid)' : 'var(--conf-high-solid)')}</div>
        </div>)}
      </div>
      <div style={{ flex: 1, padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>{bar('60%', 7)}{bar('100%')}{bar('88%')}{bar('94%')}</div>
    </div></Frame>,
  },
  {
    id: '04', icon: 'eye', label: 'Look, then decide', who: 'A person · the main screen', core: true,
    desc: 'One screen, three things: what was said, what the AI heard, what it wants to do next.',
    frame: <Frame><Rail /><div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
      <div style={{ flex: 1, padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {bar('100%', 14, 'var(--bg-sunken)')}
        <div style={{ display: 'flex', gap: 5 }}>{bar(6, 6, 'var(--ai-solid)')}{bar('74%')}</div>
        <div style={{ display: 'flex', gap: 5 }}>{bar(6, 6, 'var(--info-solid)')}{bar('58%')}</div>
        <div style={{ display: 'flex', gap: 5 }}>{bar(6, 6, 'var(--ai-solid)')}{bar('82%')}</div>
      </div>
      <div style={{ width: 78, borderLeft: '1px solid var(--border-subtle)', padding: 6, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[0.99, 0.94, 0.52, 0.71].map((s, i) => <div key={i} style={{ display: 'flex', gap: 3, alignItems: 'center' }}>{bar('54%', 4)}<span style={{ flex: 1 }} />{bar(10, 6, s < 0.6 ? 'var(--conf-low-solid)' : s < 0.85 ? 'var(--conf-medium-solid)' : 'var(--conf-high-solid)')}</div>)}
        {bar('100%', 22, 'var(--warning-bg)')}
      </div>
    </div></Frame>,
  },
  {
    id: '05', icon: 'check', label: 'Say yes to the money', who: 'A person · the big moment',
    desc: 'Money gets its own panel. Change the amount. See exactly what happens before you agree.',
    frame: <Frame><Rail /><div style={{ flex: 1, display: 'flex', minHeight: 0, position: 'relative' }}>
      <div style={{ flex: 1, padding: 8, display: 'flex', flexDirection: 'column', gap: 6, filter: 'blur(.6px)', opacity: .5 }}>{bar('100%', 14, 'var(--bg-sunken)')}{bar('74%')}{bar('58%')}</div>
      <div style={{ position: 'absolute', inset: '0 0 0 34%', background: 'var(--bg-surface)', borderLeft: '1px solid var(--border-default)', boxShadow: 'var(--shadow-3)', padding: 8, display: 'flex', flexDirection: 'column', gap: 7 }}>
        {bar('66%', 7)}{bar('100%', 20, 'var(--bg-inset)')}{bar('100%', 14, 'var(--danger-bg)')}<span style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>{bar(24, 12)}{bar(44, 12, 'var(--accent-bg)')}</div>
      </div>
    </div></Frame>,
  },
  {
    id: '06', icon: 'chart', label: 'The AI learns', who: 'The system · every single time',
    desc: 'Every fix teaches the AI. Every yes is written down with your name on it.',
    frame: <Frame dim><Rail /><div style={{ flex: 1, padding: 8, display: 'flex', alignItems: 'flex-end', gap: 5 }}>
      {[36, 52, 44, 68, 58, 74, 62, 84].map((h, i) => <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 'var(--radius-2xs)', background: i > 5 ? 'var(--accent-bg)' : 'var(--border-default)' }} />)}
    </div></Frame>,
  },
]

export function Flow() {
  return (
    <div className="doc doc--sub">
      <h1>The AI does one step. A person does three.</h1>
      <p className="lede">
Six steps from ring to done — and everything I designed lives in the handoffs.
      </p>

      <div className="doc-grid-3 doc-block">
        {STEPS.map(s => (
          <div key={s.id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div className="row" style={{ gap: 'var(--space-4)' }}>
              <span className="mono" style={{ color: s.core ? 'var(--fg-brand)' : 'var(--fg-disabled)' }}>{s.id}</span>
              <Icon name={s.icon} size={14} style={{ color: s.core ? 'var(--fg-brand)' : 'var(--fg-tertiary)' }} />
              <span style={{ fontSize: 'var(--text-base)', lineHeight: 'var(--lh-base)', fontWeight: 'var(--weight-semibold)', letterSpacing: 'var(--tracking-snug)' }}>{s.label}</span>
              {s.core && <Badge tone="accent">Core screen</Badge>}
            </div>
            {s.frame}
            <div>
              <div className="section-label" style={{ marginBottom: 'var(--space-3)' }}>{s.who}</div>
              <p style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--lh-md)' }}>{s.desc}</p>
            </div>
            {s.core && <Button variant="secondary" size="sm" iconEnd="arrowRight" onClick={() => (window.location.hash = 'core')}>See this one for real</Button>}
          </div>
        ))}
      </div>

      <h2>The four hard bits</h2>
      <p>Each one sits between two steps. That is where the thinking went.</p>
      <div>
        {[
          ['2 → 3  ·  When should it stop and ask?', 'Only two reasons. It broke a rule, or it was not sure. The screen always says which one.'],
          ['3 → 4  ·  Do not lose your place', 'The list stays right beside the call. People do about 20 in a row without stopping.'],
          ['4 → 5  ·  Only money gets a big moment', 'Little fixes happen right where they sit. Money gets a panel of its own.'],
          ['5 → 6  ·  Make fixing feel worth it', 'Every fix teaches the AI. People fix far more once they know that.'],
        ].map(([t, b]) => (
          <div key={t} className="defrow">
            <div className="defrow-t">{t}</div>
            <div className="defrow-b">{b}</div>
          </div>
        ))}
      </div>

      <div className="doc-next">
        <SectionLabel>Next</SectionLabel>
        <span className="grow" />
        <Button variant="primary" iconEnd="arrowRight" onClick={() => (window.location.hash = 'core')}>The core screen</Button>
      </div>
    </div>
  )
}
