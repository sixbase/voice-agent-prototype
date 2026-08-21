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
        <h2 style={{ margin: 0 }}>{title}</h2>
      </div>
      <p style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--lh-md)', marginBottom: 'var(--space-6)' }}>{body}</p>
      <div className="doc-grid-3">{children}</div>
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
    <div className="doc doc--sub">
      <h1>Anyone can design the happy path.</h1>
      <p className="lede">
These eighteen states are the ones that decide whether anybody trusts it. Same parts as the real screen — how sure the AI is, what it is busy doing, and what happens when it stops.
      </p>

      <div className="matrix">

        <Row
          n="A"
          title="How sure is it?"
          body="One scale. Four steps: sure, fairly sure, shaky, and did not even try."
        >
          <Cell name="Very sure" tone="success" note="No mark at all. Nothing for you to do. Getting it right earns quiet.">
            {stub('Order', 'A-88421', 0.99)}
          </Cell>
          <Cell name="Fairly sure" tone="warning" note="A small nudge, not a stop sign. Have a look, then carry on.">
            {stub('Mood', 'Mildly negative → resolved', 0.71, 'medium')}
          </Cell>
          <Cell name="Not sure" tone="danger" note="Red, and it shows you exactly what it heard. You cannot bulk-approve until you deal with it.">
            {stub('Damage type', 'Physical — severity unverified', 0.52, 'true', "it's cosmetic-ish? Hard to say")}
          </Cell>

          <Cell name="Never asked" tone="neutral" note="The AI never even tried. Grey and slanted, so it can never look like a bad score.">
            {stub('OK to call back?', 'Not asked', null)}
          </Cell>
          <Cell name="Two answers, no winner" tone="warning" note="Two answers, no winner. You choose. Guessing here is the expensive mistake.">
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--warning-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)' }}>
              <div className="row" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <Icon name="alert" size={14} style={{ color: 'var(--warning-fg)' }} />
                <span style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--lh-sm)', fontWeight: 'var(--weight-semibold)' }}>Two delivery dates mentioned</span>
              </div>
              <div className="col" style={{ gap: 'var(--space-3)' }}>
                <div className="row" style={{ gap: 'var(--space-3)' }}><Button size="sm" variant="secondary">Thu 22 Aug</Button><ConfidencePill score={0.61} /></div>
                <div className="row" style={{ gap: 'var(--space-3)' }}><Button size="sm" variant="secondary">Fri 23 Aug</Button><ConfidencePill score={0.58} /></div>
              </div>
            </div>
          </Cell>
          <Cell name="It asked instead of guessing" tone="ai" note="It was too unsure, so it asked instead of guessing. Good behaviour should be seen.">
            <div className="eventline" data-tone="ai">
              <Icon name="sparkle" size={14} />
              <span>Only 52% sure what the <b>damage</b> was — so it asked, instead of guessing</span>
            </div>
          </Cell>
        </Row>

        <Row
          n="B"
          title="What is it busy doing?"
          body="Answers turn up one at a time, and sometimes not at all. The screen has to look right the whole way through."
        >
          <Cell name="Answers still arriving" tone="info" note="Grey bars sit exactly where the real words will land. Nothing jumps about.">
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)' }}>
              <div className="col" style={{ gap: 'var(--space-6)' }}>
                {[[92, 140], [72, 96], [104, 120]].map(([a, b], i) => (
                  <div className="row" key={i} style={{ gap: 'var(--space-6)' }}>
                    <Skeleton w={a} h={10} /><Skeleton w={b} h={10} /><span className="grow" /><Skeleton w={44} h={18} r="var(--radius-full)" />
                  </div>
                ))}
              </div>
            </div>
          </Cell>
          <Cell name="Some answers in, some not" tone="warning" note="Use what has arrived. Whatever has not says so, and shows a little timer.">
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <FieldRow label="What they wanted" value="Refund — damaged" score={0.94} />
              <div className="fieldrow">
                <div className="fieldrow-label">Refund amount</div>
                <div className="fieldrow-value row" style={{ gap: 'var(--space-3)', color: 'var(--fg-tertiary)', fontWeight: 'var(--weight-regular)' }}>
                  <Icon name="refresh" size={12} className="spin" />Computing…
                </div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-disabled)' }}>~3s</span>
              </div>
            </div>
          </Cell>
          <Cell name="Nothing to check" tone="success" note="An empty list is a good thing. So it should look like a good thing.">
            <EmptyState
              icon="checkCircle"
              title="Queue clear"
              body="47 calls sorted this hour. Not one of them needed you."
              action={<Button size="sm" variant="secondary" icon="chart">View agent activity</Button>}
            />
          </Cell>

          <Cell name="The AI is struggling" tone="warning" note="Calls still work. The AI just stops suggesting things. Say that in words, not an error code.">
            <div className="eventline" data-tone="warning">
              <Icon name="alert" size={14} />
              <span><b>AI is slow right now.</b> Calls still work. Nothing will happen on its own.</span>
            </div>
          </Cell>
          <Cell name="Still on the call" tone="info" note="They are still talking. You can listen in. Nothing to say yes to yet, so there are no buttons.">
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)' }}>
              <div className="row" style={{ gap: 'var(--space-4)' }}>
                <Avatar label="?" />
                <div className="col grow" style={{ gap: 'var(--space-1)' }}>
                  <span style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--lh-md)', fontWeight: 'var(--weight-semibold)' }}>Unknown caller</span>
                  <span style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--lh-sm)', color: 'var(--fg-tertiary)' }}>0:48 · transcribing</span>
                </div>
                <Badge tone="info" dot live>Live</Badge>
              </div>
              <div className="row" style={{ gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
                <Button size="sm" variant="secondary" icon="eye">Listen in</Button>
                <Button size="sm" variant="secondary" icon="handoff">Take over</Button>
              </div>
            </div>
          </Cell>
          <Cell name="Out of date" tone="neutral" note="They rang back. This one is out of date, so the screen says so before anything else.">
            <div className="eventline" data-tone="warning">
              <Icon name="clock" size={14} />
              <span>Out of date — they called again 4 min ago. <b>Open the newer call first.</b></span>
            </div>
          </Cell>
        </Row>

        <Row
          n="C"
          title="What happens when it stops?"
          body="The AI has limits. Every limit shows itself the moment you hit it."
        >
          <Cell name="Needs a person" tone="warning" note="The big one. It names the rule and the limit out loud.">
            <div className="proposal" data-gated="true" style={{ margin: 0 }}>
              <div className="row" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                <Icon name="dollar" size={16} style={{ color: 'var(--warning-fg)' }} />
                <span className="proposal-title grow">Issue refund · $89.40</span>
              </div>
              <div className="policyline"><Icon name="lock" size={12} />Blocked by <b style={{ fontWeight: 'var(--weight-semibold)' }}>refund_limit</b> — over $50 needs a human</div>
              <div className="row" style={{ gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
                <Button variant="primary" size="sm" icon="check">Review &amp; approve</Button>
                <Button variant="ghost" size="sm">Deny</Button>
              </div>
            </div>
          </Cell>
          <Cell name="Not allowed to" tone="neutral" note="Not allowed is not the same as broken. It says so on the call and hands it to someone who can.">
            <div className="proposal" style={{ margin: 0 }}>
              <div className="row" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                <Icon name="handoff" size={16} style={{ color: 'var(--fg-tertiary)' }} />
                <span className="proposal-title grow">Cancel auto-reorder</span>
                <Badge tone="neutral" icon="lock">Out of scope</Badge>
              </div>
              <div className="proposal-meta">No permission on subscriptions · routed to Billing</div>
            </div>
          </Cell>
          <Cell name="You changed it" tone="info" note="Your fix is kept, with your name on it, and it teaches the AI. The old answer stays where you can see it.">
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <FieldRow
                label="Damage type"
                /* Wraps: the value and a 106px badge are 210px of nowrap content
                   in a tile that is 183px wide at 320, and .cell clips. */
                value={<span className="row" style={{ gap: 'var(--space-3)', flexWrap: 'wrap' }}>Cracked housing<Badge tone="info" icon="edit">Edited by you</Badge></span>}
                score={1}
              />
              <div style={{ padding: 'var(--space-3) var(--space-7) var(--space-5)', fontSize: 'var(--text-xs)', lineHeight: 'var(--lh-xs)', color: 'var(--fg-tertiary)' }}>
                was “Physical — severity unverified” (52%) · <a href="#states" style={{ color: 'var(--fg-link)' }}>revert</a>
              </div>
            </div>
          </Cell>

          <Cell name="Handed to a person" tone="danger" note="A person joins with everything already in front of them. The caller never has to say it twice.">
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--danger-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)' }}>
              <div className="row" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <Icon name="handoff" size={14} style={{ color: 'var(--danger-fg)' }} />
                <span style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--lh-sm)', fontWeight: 'var(--weight-semibold)' }}>Escalating — retention risk</span>
                <span className="grow" />
                <Badge tone="danger" dot live>0:07</Badge>
              </div>
              <div style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--lh-sm)', color: 'var(--fg-secondary)', marginBottom: 'var(--space-5)' }}>
                They said “cancel our contract”. Nobody is on hold.
              </div>
              <Button size="sm" variant="primary" icon="phone">Join call</Button>
            </div>
          </Cell>
          <Cell name="The bank said no" tone="danger" note="You said yes. The bank said no. Your yes is kept, and you can try again.">
            <div className="eventline" data-tone="danger">
              <Icon name="xCircle" size={14} />
              <span><b>Refund failed at Stripe</b> — card expired. Your yes is saved. Retry or use store credit.</span>
            </div>
          </Cell>
          <Cell name="Time to change your mind" tone="success" note="Ten seconds to take it back. Kinder than asking “are you sure?” one more time.">
            <div className="toast" style={{ position: 'static', animation: 'none' }}>
              <Icon name="checkCircle" size={16} style={{ color: 'var(--fg-success-inverse)' }} />
              <span className="grow">Refund of $89.40 approved</span>
              <button>Undo</button>
            </div>
          </Cell>
        </Row>
      </div>

      <div className="doc-next">
        <SectionLabel>Next</SectionLabel>
        <span className="grow" />
        <Button variant="primary" iconEnd="arrowRight" onClick={() => (window.location.hash = 'tradeoffs')}>Trade-offs</Button>
      </div>
    </div>
  )
}
