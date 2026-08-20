import type { ReactNode } from 'react'
import { Badge, Button, ConfidencePill, EmptyState, FieldRow, Icon, IconButton, Skeleton, SectionLabel, Avatar } from '../ds'

function Cell({ name, tone, note, children }: { name: string; tone?: 'neutral' | 'warning' | 'danger' | 'success' | 'info' | 'ai'; note: string; children: ReactNode }) {
  return (
    <div className="cell">
      <div className="cell-head">
        <span className="cell-name">{name}</span>
        {tone && <span className="dot" style={{ background: `var(--${tone === 'neutral' ? 'conf-none-solid' : tone === 'ai' ? 'ai-solid' : tone + '-solid'})` }} />}
      </div>
      <div className="cell-canvas">{children}</div>
      <div className="cell-note">{note}</div>
    </div>
  )
}

function Row({ n, title, body, children }: { n: string; title: string; body: string; children: ReactNode }) {
  return (
    <section>
      <div className="matrix-row-label">
        <span className="mono" style={{ color: 'var(--fg-brand)' }}>{n}</span>
        <h2 style={{ margin: 0, fontSize: 'var(--text-xl)' }}>{title}</h2>
      </div>
      <p style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--lh-md)', marginBottom: 'var(--space-7)' }}>{body}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)' }}>{children}</div>
    </section>
  )
}

const stub = (label: string, value: string, score: number | null, flag?: 'true' | 'medium', cite?: string) => (
  <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
    <FieldRow label={label} value={value} score={score} flag={flag} cite={cite} />
  </div>
)

export function States() {
  return (
    <div className="doc" style={{ maxWidth: 1240 }}>
      <h1 style={{ fontSize: 'var(--text-3xl)', lineHeight: 'var(--lh-3xl)' }}>System states &amp; edge cases</h1>
      <p className="lede" style={{ marginTop: 'var(--space-5)' }}>
        Every state below is rendered from the same components and tokens as the core screen — this is the
        spec engineering built from. Three axes: what the model knows, what the system is doing, and what
        happens when either goes wrong.
      </p>

      <div className="matrix" style={{ marginTop: 'var(--space-9)' }}>

        <Row
          n="A"
          title="AI confidence"
          body="One scale, four bands: high ≥85%, medium 60–84%, low <60%, no signal. The band drives colour, the left rail marker, and whether the row is pre-selected for the operator's attention."
        >
          <Cell name="High confidence" tone="success" note="No marker, no interruption. Agent acted; operator scans and moves on. Silence is the reward for being right.">
            {stub('Order', 'A-88421', 0.99)}
          </Cell>
          <Cell name="Medium confidence" tone="warning" note="Amber rail + pill. Not blocking — a nudge to glance at the citation before approving in bulk.">
            {stub('Sentiment', 'Mildly negative → resolved', 0.71, 'medium')}
          </Cell>
          <Cell name="Low confidence" tone="danger" note="Red rail, citation auto-expanded, and the row is counted in the header badge. Bulk-approve is disabled while any low field is unresolved.">
            {stub('Damage type', 'Physical — severity unverified', 0.52, 'true', "it's cosmetic-ish? Hard to say")}
          </Cell>

          <Cell name="No signal" tone="neutral" note="The model did not attempt this field. Shown as absence, not as zero — a grey italic 'Not asked' never reads as a low score.">
            {stub('Callback consent', 'Not asked', null)}
          </Cell>
          <Cell name="Conflicting evidence" tone="warning" note="Two candidate values with citations. The agent picks neither; the operator resolves with one click. Guessing here would be the expensive failure.">
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--warning-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)' }}>
              <div className="row" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <Icon name="alert" size={13} style={{ color: 'var(--warning-fg)' }} />
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Two delivery dates mentioned</span>
              </div>
              <div className="col" style={{ gap: 'var(--space-3)' }}>
                <div className="row" style={{ gap: 'var(--space-3)' }}><Button size="sm" variant="secondary">Thu 22 Aug</Button><ConfidencePill score={0.61} /></div>
                <div className="row" style={{ gap: 'var(--space-3)' }}><Button size="sm" variant="secondary">Fri 23 Aug</Button><ConfidencePill score={0.58} /></div>
              </div>
            </div>
          </Cell>
          <Cell name="Fallback behaviour" tone="ai" note="Below threshold, the agent asks one clarifying question rather than guessing — and the console shows that it chose to. Restraint is a feature you have to make visible.">
            <div className="eventline" data-tone="ai">
              <Icon name="sparkle" size={13} />
              <span>Low confidence on <b>damage_type</b> (0.52) — agent asked a clarifying question instead of guessing</span>
            </div>
          </Cell>
        </Row>

        <Row
          n="B"
          title="Operational states"
          body="Extraction is streamed and can arrive incomplete. The screen is designed to be read at every point along that timeline, not only at the end."
        >
          <Cell name="Streaming / loading" tone="info" note="Skeletons match the real row geometry so nothing reflows on arrival. Fields fill top-down in extraction order.">
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)' }}>
              <div className="col" style={{ gap: 'var(--space-6)' }}>
                {[[92, 140], [72, 96], [104, 120]].map(([a, b], i) => (
                  <div className="row" key={i} style={{ gap: 'var(--space-6)' }}>
                    <Skeleton w={a} h={9} /><Skeleton w={b} h={9} /><span className="grow" /><Skeleton w={44} h={14} r={999} />
                  </div>
                ))}
              </div>
            </div>
          </Cell>
          <Cell name="Partial results" tone="warning" note="What is ready is actionable. What is not says so, with a live timer — never an indefinite spinner over the whole panel.">
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <FieldRow label="Intent" value="Refund — damaged" score={0.94} />
              <div className="fieldrow">
                <div className="fieldrow-label">Refund amount</div>
                <div className="fieldrow-value row" style={{ gap: 'var(--space-3)', color: 'var(--fg-tertiary)', fontWeight: 400 }}>
                  <Icon name="refresh" size={12} className="spin" />Computing…
                </div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-disabled)' }}>~3s</span>
              </div>
            </div>
          </Cell>
          <Cell name="Empty queue" tone="success" note="Zero state doubles as a status report. An empty review queue is a good outcome, so it is framed as one and shows what the agent handled unaided.">
            <EmptyState
              icon="checkCircle"
              title="Queue clear"
              body="47 calls handled by agents in the last hour, none needed you."
              action={<Button size="sm" variant="secondary" icon="chart">View agent activity</Button>}
            />
          </Cell>

          <Cell name="Degraded model" tone="warning" note="When the extraction service is slow, agents keep talking but stop proposing actions. The banner states the behaviour change, not the incident id.">
            <div className="eventline" data-tone="warning">
              <Icon name="alert" size={13} />
              <span><b>Extraction degraded.</b> Calls are still being answered and recorded. Action proposals are paused — nothing will execute unattended.</span>
            </div>
          </Cell>
          <Cell name="Live / in progress" tone="info" note="A call still in flight is visible but not reviewable. Listen-in is offered; approval controls are absent rather than disabled — there is nothing to approve yet.">
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)' }}>
              <div className="row" style={{ gap: 'var(--space-4)' }}>
                <Avatar label="?" />
                <div className="col grow" style={{ gap: 2 }}>
                  <span style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>Unknown caller</span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-tertiary)' }}>0:48 · transcribing</span>
                </div>
                <Badge tone="info" dot live>Live</Badge>
              </div>
              <div className="row" style={{ gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
                <Button size="sm" variant="secondary" icon="eye">Listen in</Button>
                <Button size="sm" variant="secondary" icon="handoff">Take over</Button>
              </div>
            </div>
          </Cell>
          <Cell name="Stale review" tone="neutral" note="Reviews expire. If the customer already called back, approving the old proposal would be wrong — so the screen invalidates itself rather than trusting the operator to notice.">
            <div className="eventline" data-tone="warning">
              <Icon name="clock" size={13} />
              <span>Superseded — this customer called again 4 min ago. <b>Review the newer call (C-48231)</b> before acting.</span>
            </div>
          </Cell>
        </Row>

        <Row
          n="C"
          title="Guardrails, recovery &amp; human-in-the-loop"
          body="The agent's authority is bounded by policy. Every boundary is legible in the moment it binds — the operator should never have to ask why nothing happened."
        >
          <Cell name="Gated action" tone="warning" note="The default HITL state. Amber surface, the named policy, and the exact ceiling. Approve opens a drawer; deny is one click and requires a reason.">
            <div className="proposal" data-gated="true" style={{ margin: 0 }}>
              <div className="row" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                <Icon name="dollar" size={15} style={{ color: 'var(--warning-fg)' }} />
                <span className="proposal-title grow">Issue refund · $89.40</span>
              </div>
              <div className="policyline"><Icon name="lock" size={11} />Blocked by <b style={{ fontWeight: 600 }}>refund_limit</b> — over $50 needs a human</div>
              <div className="row" style={{ gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
                <Button variant="primary" size="sm" icon="check">Review &amp; approve</Button>
                <Button variant="ghost" size="sm">Deny</Button>
              </div>
            </div>
          </Cell>
          <Cell name="Permission denied" tone="neutral" note="Out of scope ≠ failed. The agent names the boundary to the customer on the call and routes the request, so the human inherits context instead of a dead end.">
            <div className="proposal" style={{ margin: 0 }}>
              <div className="row" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                <Icon name="handoff" size={15} style={{ color: 'var(--fg-tertiary)' }} />
                <span className="proposal-title grow">Cancel auto-reorder</span>
                <Badge tone="neutral" icon="lock">Out of scope</Badge>
              </div>
              <div className="proposal-meta">No permission on subscriptions · routed to Billing</div>
            </div>
          </Cell>
          <Cell name="Operator override" tone="info" note="An edit is never destructive: the model's original value stays inspectable, the change is attributed, and it goes to the feedback set that retrains the extractor.">
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <FieldRow
                label="Damage type"
                value={<span className="row" style={{ gap: 'var(--space-3)' }}>Cracked housing<Badge tone="info" icon="edit">Edited by you</Badge></span>}
                score={1}
              />
              <div style={{ padding: 'var(--space-3) var(--space-6) var(--space-5)', fontSize: 'var(--text-xs)', color: 'var(--fg-tertiary)' }}>
                was “Physical — severity unverified” (52%) · <a href="#states" style={{ color: 'var(--fg-link)' }}>revert</a>
              </div>
            </div>
          </Cell>

          <Cell name="Escalation to human" tone="danger" note="Mid-call handoff. The human joins with the transcript, extraction and the reason already loaded — the customer never repeats themselves.">
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--danger-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)' }}>
              <div className="row" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <Icon name="handoff" size={14} style={{ color: 'var(--danger-fg)' }} />
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Escalating — retention risk</span>
                <span className="grow" />
                <Badge tone="danger" dot live>0:07</Badge>
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-secondary)', marginBottom: 'var(--space-5)' }}>
                Caller said “cancel our contract”. Agent is holding with context; the customer has not been put on hold.
              </div>
              <Button size="sm" variant="primary" icon="phone">Join call</Button>
            </div>
          </Cell>
          <Cell name="Downstream failure" tone="danger" note="The approval succeeded; the payment provider did not. The distinction matters — the operator's decision is preserved and retried, never silently dropped.">
            <div className="eventline" data-tone="danger">
              <Icon name="xCircle" size={13} />
              <span><b>Refund failed at Stripe</b> — card_expired. Your approval is saved. Retry, or refund to store credit instead.</span>
            </div>
          </Cell>
          <Cell name="Undo window" tone="success" note="Irreversible actions get a 10-second hold before they leave the building. Cheaper than a confirmation dialog, and it does not train operators to click through warnings.">
            <div className="toast" style={{ position: 'static', animation: 'none' }}>
              <Icon name="checkCircle" size={15} style={{ color: 'var(--conf-high-fg)' }} />
              <span className="grow">Refund of $89.40 approved</span>
              <button>Undo</button>
            </div>
          </Cell>
        </Row>
      </div>

      <div className="row" style={{ gap: 'var(--space-5)', marginTop: 'var(--space-12)', paddingTop: 'var(--space-8)', borderTop: '1px solid var(--border-subtle)' }}>
        <SectionLabel>Next</SectionLabel>
        <span className="grow" />
        <Button variant="primary" iconEnd="arrowRight" onClick={() => (window.location.hash = 'tradeoffs')}>Trade-offs &amp; rejected concepts</Button>
      </div>
    </div>
  )
}
