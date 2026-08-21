import type { ReactNode } from 'react'
import { Badge, Button, ConfidencePill, Icon, SectionLabel } from '../ds'

/* Same illustration primitive as Flow.tsx: raw px here are wireframe geometry
   drawn at ~1/4 scale, not product chrome. Colour + radius come from tokens. */
const bar = (w: number | string, h = 6, c = 'var(--border-default)') => (
  <div style={{ width: w, height: h, borderRadius: 'var(--radius-2xs)', background: c }} />
)

function Wire({ children, verdict }: { children: ReactNode; verdict: 'rejected' | 'shipped' }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        height: 190, background: 'var(--bg-surface)',
        border: `1px solid ${verdict === 'shipped' ? 'var(--accent-border)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-md)', overflow: 'hidden', display: 'flex',
        boxShadow: verdict === 'shipped' ? 'var(--ring-accent)' : 'var(--shadow-1)',
      }}>{children}</div>
      <div style={{ position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)' }}>
        {verdict === 'shipped'
          ? <Badge tone="accent" icon="check" solid>Chosen</Badge>
          : <Badge tone="neutral" icon="x">Rejected</Badge>}
      </div>
    </div>
  )
}

const OPTIONS = [
  {
    name: 'A · A whole new page',
    verdict: 'rejected' as const,
    claim: 'Send it to its own page. Loads of room.',
    why: 'You lose your place. Come back and you have to work out which call you were even on. That is how you say yes to the wrong one.',
    keep: 'I kept the order it put things in: what, why it stopped, what happens next.',
    wire: <Wire verdict="rejected">
      <div style={{ flex: 1, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {bar(60, 5)}{bar('50%', 10)}
        <div style={{ height: 1, background: 'var(--border-subtle)' }} />
        {bar('100%', 26, 'var(--bg-inset)')}{bar('92%')}{bar('78%')}
        <span style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>{bar(30, 14)}{bar(54, 14, 'var(--accent-bg)')}</div>
      </div>
    </Wire>,
  },
  {
    name: 'B · A box in the middle',
    verdict: 'rejected' as const,
    claim: 'A pop-up in the middle. Everyone knows how these work.',
    why: 'It sits on top of the call — and the call is your proof. You would shut it to re-read one line, and lose everything you had typed.',
    keep: 'I kept pop-ups for plain yes-or-no questions, where there is nothing to read.',
    wire: <Wire verdict="rejected">
      <div style={{ flex: 1, padding: 12, display: 'flex', flexDirection: 'column', gap: 8, filter: 'blur(1.2px)', opacity: .45 }}>
        {bar('72%')}{bar('58%')}{bar('80%')}{bar('64%')}{bar('76%')}
      </div>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '72%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-3)', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {bar('56%', 7)}{bar('100%')}{bar('84%')}
        <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end', marginTop: 4 }}>{bar(26, 12)}{bar(44, 12, 'var(--accent-bg)')}</div>
      </div>
    </Wire>,
  },
  {
    name: 'C · Slides in from the side',
    verdict: 'shipped' as const,
    claim: 'Slides in from the right. You can still see the call.',
    why: 'You can read what they said while you type the amount. And the button says the actual money — “Approve $89.40”, never just “OK”. The catch: it eats a lot of width, so this needs a big screen.',
    keep: null,
    wire: <Wire verdict="shipped">
      <div style={{ flex: 1, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {bar('72%')}{bar('58%')}{bar('80%')}{bar('64%')}{bar('76%')}{bar('52%')}
      </div>
      <div style={{ width: '46%', borderLeft: '1px solid var(--border-default)', background: 'var(--bg-surface)', boxShadow: 'var(--shadow-3)', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {bar('64%', 7)}{bar('100%', 22, 'var(--bg-inset)')}{bar('100%', 16, 'var(--danger-bg)')}
        <span style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>{bar(24, 12)}{bar(52, 12, 'var(--accent-bg)')}</div>
      </div>
    </Wire>,
  },
]

/* A specimen strip: the actual control, drawn at real size, above the sentence
   explaining it. Reading "a colour beats a number" is an assertion; seeing
   0.52 next to the pill settles it in about a second. */
const Demo = ({ children }: { children: ReactNode }) => (
  <div className="diff-demo">{children}</div>
)

const line = (w: string, c = 'var(--border-default)') => (
  <div style={{ width: w, height: 6, borderRadius: 'var(--radius-2xs)', background: c }} />
)

const OTHERS = [
  {
    t: 'Showing the plain number, 0.52',
    badVis: <Demo><span className="mono" style={{ color: 'var(--fg-secondary)' }}>damage type&nbsp;&nbsp;0.52</span></Demo>,
    goodVis: <Demo><span className="mono" style={{ color: 'var(--fg-secondary)' }}>damage type</span><ConfidencePill score={0.52} /></Demo>,
    rejected: 'A number starts an argument. “0.52 is about half, that is fine.” A colour does not.',
    chosen: 'Colour first, number second. You see the colour, then check the number.',
  },
  {
    t: 'Picking the higher score when two answers disagree',
    badVis: <Demo>
      <Button size="sm" variant="primary" icon="check">Thu 22 Aug</Button>
      <span style={{ fontSize: 'var(--text-xs)', lineHeight: 'var(--lh-xs)', color: 'var(--fg-disabled)' }}>Fri 23 Aug</span>
    </Demo>,
    goodVis: <Demo>
      <Button size="sm" variant="secondary">Thu 22 Aug</Button>
      <ConfidencePill score={0.61} />
      <Button size="sm" variant="secondary">Fri 23 Aug</Button>
      <ConfidencePill score={0.58} />
    </Demo>,
    rejected: '61% against 58% is a tie, not a winner. Picking one for you hides that it was close.',
    chosen: 'Show both, choose neither. The one place an extra click is the right answer.',
  },
  {
    t: 'One button that says yes to everything',
    badVis: <Demo><Button size="sm" variant="primary" icon="check">Approve all 12</Button></Demo>,
    goodVis: <Demo>
      <Button size="sm" variant="primary" icon="check">Approve 8 safe</Button>
      <Badge tone="warning">4 need you</Badge>
    </Demo>,
    rejected: 'Everyone asks for it. It brings straight back the not-really-looking that this screen exists to stop.',
    chosen: 'It clears the easy ones. It flatly refuses the shaky ones.',
  },
  {
    t: 'Colouring the whole call by how sure it is',
    badVis: <Demo>
      <div className="col" style={{ gap: 'var(--space-3)', width: '100%' }}>
        <div style={{ background: 'var(--conf-high-bg)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-xs)' }}>{line('86%', 'var(--conf-high-solid)')}</div>
        <div style={{ background: 'var(--conf-medium-bg)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-xs)' }}>{line('64%', 'var(--conf-medium-solid)')}</div>
        <div style={{ background: 'var(--conf-low-bg)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-xs)' }}>{line('74%', 'var(--conf-low-solid)')}</div>
      </div>
    </Demo>,
    goodVis: <Demo>
      <div className="col" style={{ gap: 'var(--space-4)', width: '100%', padding: 'var(--space-2) var(--space-3)' }}>
        {line('86%')}
        {/* The dash needs air under the bar or it reads as part of it. */}
        <span className="turn-uncertain" style={{ display: 'block', width: '64%', paddingBottom: 'var(--space-2)' }}>{line('100%')}</span>
        {line('74%')}
      </div>
    </Demo>,
    rejected: 'It turns into a rainbow. Colour everything and nothing stands out.',
    chosen: 'Only the shaky bits get a dotted underline. About one per call.',
  },
]

export function Tradeoffs() {
  return (
    <div className="doc doc--sub">
      <h1>Three ways to ask permission. I kept one.</h1>
      <p className="lede">
The two I threw away are the part worth reading.
      </p>

      <div className="doc-grid-3 doc-block">
        {OPTIONS.map(o => (
          <div key={o.name} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div style={{ fontSize: 'var(--text-base)', lineHeight: 'var(--lh-base)', fontWeight: 'var(--weight-semibold)', letterSpacing: 'var(--tracking-snug)' }}>{o.name}</div>
            {o.wire}
            <p style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--lh-md)', color: 'var(--fg-primary)' }}>{o.claim}</p>
            <div>
              <div className="section-label" style={{ marginBottom: 'var(--space-3)' }}>{o.verdict === 'shipped' ? 'Why it won' : 'Why it lost'}</div>
              <p style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--lh-md)' }}>{o.why}</p>
            </div>
            {o.keep && (
              <div className="eventline" data-tone="info">
                <Icon name="undo" size={14} />
                <span>{o.keep}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <h2>Four smaller choices</h2>
      <p>Same idea, smaller. What I tried, and what I did instead.</p>
      <div className="doc-stack">
        {OTHERS.map(o => (
          <div key={o.t} style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)', overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-6) var(--space-7)', borderBottom: '1px solid var(--border-subtle)', fontSize: 'var(--text-base)', lineHeight: 'var(--lh-base)', fontWeight: 'var(--weight-semibold)' }}>{o.t}</div>
            <div className="pairgrid">
              <div className="pairgrid-cell">
                <div className="row" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}><Icon name="xCircle" size={14} style={{ color: 'var(--danger-fg)' }} /><span className="section-label">Rejected</span></div>
                {o.badVis}
                <p style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--lh-md)' }}>{o.rejected}</p>
              </div>
              <div className="pairgrid-cell">
                <div className="row" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}><Icon name="checkCircle" size={14} style={{ color: 'var(--success-solid)' }} /><span className="section-label">Chosen</span></div>
                {o.goodVis}
                <p style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--lh-md)' }}>{o.chosen}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="doc-next">
        <SectionLabel>Next</SectionLabel>
        <span className="grow" />
        <Button variant="primary" iconEnd="arrowRight" onClick={() => (window.location.hash = 'system')}>The design system</Button>
      </div>
    </div>
  )
}
