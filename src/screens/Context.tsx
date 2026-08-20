import { Badge, Button, Card, Divider, Icon, SectionLabel } from '../ds'

const META = [
  { k: 'Role', v: 'Product designer — sole designer, partnered with 1 PM, 4 engineers, 1 applied-AI eng.' },
  { k: 'Duration', v: '9 weeks · discovery → shipped beta' },
  { k: 'Surface', v: 'Desktop web console, 1440–1920px. Operators live in it 6+ hrs/day.' },
  { k: 'My scope', v: 'Research synthesis, IA, interaction model, visual system, edge-case spec, hand-off.' },
]

const OUTCOMES = [
  { v: '31%', k: 'fewer calls escalated to a human', note: 'agents were being over-escalated because reviewers could not tell good output from bad' },
  { v: '2:10 → 0:38', k: 'median review time per call', note: 'the inspector puts extraction, action and policy in one column' },
  { v: '0', k: 'unreviewed money movements', note: 'gated actions cannot execute without an explicit human decision' },
  { v: '+14pts', k: 'operator trust score (internal survey)', note: 'n=22, "I understand why the agent did that" 4.1 → 5.5 / 7' },
]

export function Context() {
  return (
    <div className="doc">
      <div className="row" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-7)' }}>
        <Badge tone="ai" icon="sparkle" size="lg">AI voice agent · human-in-the-loop</Badge>
        <Badge tone="neutral" size="lg">B2B SaaS</Badge>
        <Badge tone="neutral" size="lg">Enterprise console</Badge>
      </div>

      <h1 style={{ maxWidth: '20ch' }}>Teaching operators when <em style={{ fontStyle: 'normal', color: 'var(--fg-brand)' }}>not</em> to trust the AI.</h1>

      <p className="lede" style={{ marginTop: 'var(--space-7)' }}>
        Relay is an AI voice &amp; messaging agent platform for support teams. The agent answers the call,
        understands the request, and proposes actions — refunds, reschedules, ticket updates. A human
        approves anything consequential. This case study is about the screen where that approval happens.
      </p>

      <div className="metagrid" style={{ marginTop: 'var(--space-11)' }}>
        {META.map(m => (
          <div className="metacell" key={m.k}>
            <div className="k">{m.k}</div>
            <div className="v">{m.v}</div>
          </div>
        ))}
      </div>

      <h2>The problem</h2>
      <p style={{ marginTop: 'var(--space-5)' }}>
        Northwind's support team turned on voice agents and immediately hit the trust ceiling. The agent
        handled 68% of inbound calls end-to-end — but the review console showed operators a transcript and a
        row of green checkmarks. Everything looked equally confident, so operators did one of two things:
        rubber-stamp every call, or re-listen to all of them.
      </p>

      <div className="row" style={{ gap: 'var(--space-6)', marginTop: 'var(--space-7)', alignItems: 'stretch' }}>
        {[
          { icon: 'eye', t: 'No confidence signal', b: 'A 52%-confidence damage classification rendered identically to a 99%-confidence order ID.' },
          { icon: 'lock', t: 'No policy visibility', b: 'Operators could not see why an action was held, so they assumed the agent had failed.' },
          { icon: 'undo', t: 'No cheap correction', b: 'Fixing one wrong field meant rejecting the whole call and re-doing it by hand.' },
        ].map(x => (
          <Card key={x.t} style={{ flex: 1 }}>
            <div style={{ padding: 'var(--space-7)' }}>
              <Icon name={x.icon as 'eye'} size={17} style={{ color: 'var(--fg-tertiary)', marginBottom: 'var(--space-5)' }} />
              <h3>{x.t}</h3>
              <p style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--lh-md)', marginTop: 'var(--space-3)' }}>{x.b}</p>
            </div>
          </Card>
        ))}
      </div>

      <h2>Constraints I designed against</h2>
      <div style={{ marginTop: 'var(--space-6)' }}>
        {[
          ['Latency is a design material', 'Extraction lands 1–4s after the call ends, sometimes partially. The screen has to be useful before it is complete.'],
          ['The model is wrong ~7% of the time', 'And it cannot tell you which 7%. Confidence is a hint, not a verdict — the UI must never present it as one.'],
          ['Money movement is regulated', 'Refunds over $50 legally require a named human approver and an immutable audit record.'],
          ['Operators are not ML people', 'No probabilities-as-decimals, no “embedding drift”. Bands, colour, and plain sentences.'],
          ['Volume is the point', 'A reviewer clears 80–120 calls a shift. Every interaction is keyboard-first and one screen deep.'],
        ].map(([t, b]) => (
          <div key={t} style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 'var(--space-8)', padding: 'var(--space-6) 0', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>{t}</div>
            <div style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--lh-md)', color: 'var(--fg-secondary)' }}>{b}</div>
          </div>
        ))}
      </div>

      <h2>The idea</h2>
      <p style={{ marginTop: 'var(--space-5)' }}>
        Stop showing the operator a transcript to read. Show them a <strong style={{ color: 'var(--fg-primary)', fontWeight: 600 }}>decision</strong> to make —
        with the model's evidence, its uncertainty, and the policy that gated it, all resolvable without leaving the row.
        Three rules carried the whole system:
      </p>

      <div className="row" style={{ gap: 'var(--space-6)', marginTop: 'var(--space-7)' }}>
        {[
          ['01', 'Uncertainty is a first-class visual property', 'One confidence scale, one hue per band, applied identically to fields, transcript spans, and queue rows. If it is uncertain anywhere, it looks uncertain everywhere.'],
          ['02', 'Never block — defer and disclose', 'The agent that cannot do something says so, names the boundary, and routes it. Silence reads as failure.'],
          ['03', 'Correction is cheaper than rejection', 'Every AI output is editable in place. An override is training data, not an error report.'],
        ].map(([n, t, b]) => (
          <Card key={n} style={{ flex: 1 }}>
            <div style={{ padding: 'var(--space-7)' }}>
              <div className="mono" style={{ color: 'var(--fg-brand)', marginBottom: 'var(--space-4)' }}>{n}</div>
              <h3 style={{ marginBottom: 'var(--space-3)' }}>{t}</h3>
              <p style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--lh-md)' }}>{b}</p>
            </div>
          </Card>
        ))}
      </div>

      <h2>Outcome</h2>
      <div className="metagrid" style={{ marginTop: 'var(--space-6)' }}>
        {OUTCOMES.map(o => (
          <div className="metacell" key={o.k}>
            <div style={{ fontSize: 'var(--text-3xl)', lineHeight: 'var(--lh-3xl)', fontWeight: 600, letterSpacing: 'var(--tracking-tight)' }}>{o.v}</div>
            <div style={{ fontSize: 'var(--text-md)', fontWeight: 500, margin: '4px 0 6px' }}>{o.k}</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-tertiary)', lineHeight: 'var(--lh-sm)' }}>{o.note}</div>
          </div>
        ))}
      </div>

      <Divider style={{ margin: 'var(--space-12) 0 var(--space-8)' }} />
      <div className="row" style={{ gap: 'var(--space-5)' }}>
        <SectionLabel>Next</SectionLabel>
        <span className="grow" />
        <Button variant="primary" iconEnd="arrowRight" onClick={() => (window.location.hash = 'flow')}>The end-to-end flow</Button>
      </div>
    </div>
  )
}
