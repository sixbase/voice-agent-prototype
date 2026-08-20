import type { ReactNode } from 'react'
import { Badge, Button, Icon, SectionLabel, type IconName } from '../ds'

/* schematic mini-frames — deliberately abstract so the eye reads structure, not content */
const bar = (w: number | string, h = 6, c = 'var(--border-default)') => (
  <div style={{ width: w, height: h, borderRadius: 2, background: c }} />
)

function Frame({ children, dim }: { children: ReactNode; dim?: boolean }) {
  return (
    <div style={{
      height: 168, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)', overflow: 'hidden', display: 'flex', flexDirection: 'column',
      opacity: dim ? .72 : 1,
    }}>
      <div style={{ height: 16, borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 4, padding: '0 6px' }}>
        {bar(20, 4, 'var(--signal-500)')}{bar(28, 4)}<span style={{ flex: 1 }} />{bar(14, 4)}
      </div>
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>{children}</div>
    </div>
  )
}
const Rail = () => (
  <div style={{ width: 34, borderRight: '1px solid var(--border-subtle)', padding: 6, display: 'flex', flexDirection: 'column', gap: 5 }}>
    {[0, 1, 2, 3].map(i => <div key={i} style={{ display: 'flex', gap: 3, alignItems: 'center' }}>{bar(5, 5, i === 2 ? 'var(--signal-500)' : 'var(--border-default)')}{bar(15, 4)}</div>)}
  </div>
)

const STEPS: { id: string; icon: IconName; label: string; who: string; desc: string; core?: boolean; frame: ReactNode }[] = [
  {
    id: '01', icon: 'settings', label: 'Agent configured', who: 'Ops lead · once',
    desc: 'Scope, tone, tools and the policy ceilings that decide what will later need a human. Where the guardrails in step 4 are actually authored.',
    frame: <Frame dim><Rail /><div style={{ flex: 1, padding: 8, display: 'flex', flexDirection: 'column', gap: 7 }}>
      {bar(70, 7)}{bar('100%')}{bar('86%')}
      <div style={{ height: 1, background: 'var(--border-subtle)', margin: '2px 0' }} />
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>{bar(40, 12, 'var(--warning-bg)')}{bar(52, 5)}</div>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>{bar(40, 12, 'var(--warning-bg)')}{bar(36, 5)}</div>
    </div></Frame>,
  },
  {
    id: '02', icon: 'phone', label: 'Call handled', who: 'Agent · autonomous',
    desc: 'The agent answers, identifies the caller, calls tools, and either resolves or hits a boundary. 68% of calls end here and never enter the queue.',
    frame: <Frame dim><Rail /><div style={{ flex: 1, padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', gap: 5 }}>{bar(6, 6, 'var(--ai-solid)')}{bar('72%')}</div>
      <div style={{ display: 'flex', gap: 5, paddingLeft: 11 }}>{bar('54%')}</div>
      <div style={{ display: 'flex', gap: 5 }}>{bar(6, 6, 'var(--info-solid)')}{bar('62%')}</div>
      {bar('100%', 12, 'var(--bg-sunken)')}
      <div style={{ display: 'flex', gap: 5 }}>{bar(6, 6, 'var(--ai-solid)')}{bar('80%')}</div>
    </div></Frame>,
  },
  {
    id: '03', icon: 'shieldAlert', label: 'Review queue', who: 'Operator · triage',
    desc: 'Only calls that tripped a policy or a confidence floor surface here — sorted by money at risk, not by time. This is the screen before the core screen.',
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
    id: '04', icon: 'eye', label: 'Review & decide', who: 'Operator · the core screen', core: true,
    desc: 'Transcript, extraction, proposals and policy in one view. The operator corrects what is wrong, then approves, denies or escalates.',
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
    id: '05', icon: 'check', label: 'Approval drawer', who: 'Operator · commit',
    desc: 'The consequential moment gets its own surface: editable amount, the named policy that gated it, and an explicit list of what will happen on approve.',
    frame: <Frame><Rail /><div style={{ flex: 1, display: 'flex', minHeight: 0, position: 'relative' }}>
      <div style={{ flex: 1, padding: 8, display: 'flex', flexDirection: 'column', gap: 6, filter: 'blur(.6px)', opacity: .5 }}>{bar('100%', 14, 'var(--bg-sunken)')}{bar('74%')}{bar('58%')}</div>
      <div style={{ position: 'absolute', inset: '0 0 0 34%', background: 'var(--bg-surface)', borderLeft: '1px solid var(--border-default)', boxShadow: 'var(--shadow-3)', padding: 8, display: 'flex', flexDirection: 'column', gap: 7 }}>
        {bar('66%', 7)}{bar('100%', 20, 'var(--bg-inset)')}{bar('100%', 14, 'var(--danger-bg)')}<span style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>{bar(24, 12)}{bar(44, 12, 'var(--signal-600)')}</div>
      </div>
    </div></Frame>,
  },
  {
    id: '06', icon: 'chart', label: 'Loop closed', who: 'System · continuous',
    desc: 'Every override lands in the feedback set; every approval lands in the audit log. Ops watch which policies fire most and raise the ceilings that no longer earn their keep.',
    frame: <Frame dim><Rail /><div style={{ flex: 1, padding: 8, display: 'flex', alignItems: 'flex-end', gap: 5 }}>
      {[36, 52, 44, 68, 58, 74, 62, 84].map((h, i) => <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 2, background: i > 5 ? 'var(--signal-500)' : 'var(--border-default)' }} />)}
    </div></Frame>,
  },
]

export function Flow() {
  return (
    <div className="doc" style={{ maxWidth: 1240 }}>
      <h1 style={{ fontSize: 'var(--text-3xl)', lineHeight: 'var(--lh-3xl)' }}>End-to-end flow</h1>
      <p className="lede" style={{ marginTop: 'var(--space-5)' }}>
        Six steps, two actors. The agent owns steps 2; the operator owns 3–5. Everything I designed sits on
        the seam between them — which is where trust is either built or lost.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-8)', marginTop: 'var(--space-10)' }}>
        {STEPS.map(s => (
          <div key={s.id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div className="row" style={{ gap: 'var(--space-4)' }}>
              <span className="mono" style={{ color: s.core ? 'var(--fg-brand)' : 'var(--fg-disabled)' }}>{s.id}</span>
              <Icon name={s.icon} size={14} style={{ color: s.core ? 'var(--fg-brand)' : 'var(--fg-tertiary)' }} />
              <span style={{ fontSize: 'var(--text-base)', fontWeight: 600, letterSpacing: 'var(--tracking-snug)' }}>{s.label}</span>
              {s.core && <Badge tone="accent">Core screen</Badge>}
            </div>
            {s.frame}
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>{s.who}</div>
              <p style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--lh-md)' }}>{s.desc}</p>
            </div>
            {s.core && <Button variant="secondary" size="sm" iconEnd="arrowRight" onClick={() => (window.location.hash = 'core')}>Open the live screen</Button>}
          </div>
        ))}
      </div>

      <h2>Where the design work actually was</h2>
      <div style={{ marginTop: 'var(--space-6)' }}>
        {[
          ['2 → 3  ·  What earns a human?', 'Routing everything to review defeats the product; routing nothing is unsafe. The queue is populated by two independent triggers — a policy ceiling (deterministic) or a confidence floor (probabilistic) — and the UI always names which one fired.'],
          ['3 → 4  ·  Preserving the operator’s place', 'The list stays mounted beside the detail. Reviewers work in streaks of 20+; a full-page transition per call broke rhythm and lost scroll position in testing.'],
          ['4 → 5  ·  Escalating the surface, not the noise', 'Ordinary corrections stay inline. Only the irreversible act — money leaving the account — earns a dedicated surface with its own footer and its own commit language.'],
          ['5 → 6  ·  Making the correction worth something', 'Every override writes to the feedback set. Operators were far more willing to fix a field once they were told the fix trained the model rather than just patching one ticket.'],
        ].map(([t, b]) => (
          <div key={t} style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 'var(--space-8)', padding: 'var(--space-6) 0', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>{t}</div>
            <div style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--lh-md)', color: 'var(--fg-secondary)' }}>{b}</div>
          </div>
        ))}
      </div>

      <div className="row" style={{ gap: 'var(--space-5)', marginTop: 'var(--space-10)' }}>
        <SectionLabel>Next</SectionLabel>
        <span className="grow" />
        <Button variant="primary" iconEnd="arrowRight" onClick={() => (window.location.hash = 'core')}>The core screen</Button>
      </div>
    </div>
  )
}
