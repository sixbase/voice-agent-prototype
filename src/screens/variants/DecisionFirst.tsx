/* B · Decision first — one decision at a time. Evidence on demand. */
import { useState } from 'react'
import { Badge, Button, ConfidencePill, Divider, Icon, IconButton, Kbd, SectionLabel, Avatar, band } from '../../ds'
import { ProductShell, PageHeader } from '../../app/ProductShell'
import { queue, byId } from '../../data/fixtures'

export function DecisionFirst({ onApprove }: { onApprove: (msg: string) => void }) {
  const [selected, setSelected] = useState('C-48219')
  const [openChip, setOpenChip] = useState<string | null>('Damage type')
  const call = byId(selected)
  const chip = call.fields.find(f => f.label === openChip)
  const gated = call.proposals.find(p => p.status === 'gated')
  const low = call.fields.filter(f => f.score !== null && f.score < 0.6)
  const idx = queue.findIndex(q => q.id === selected)

  return (
    <ProductShell
      header={
        <PageHeader
          crumbs={['Review queue', `${queue.length} waiting`]}
          phoneActions
          title={`Decision ${idx + 1} of ${queue.length}`}
          meta={<Badge tone="ai" icon="bot">{call.agent}</Badge>}
          actions={
            <>
              <Button variant="ghost" onClick={() => setSelected(queue[(idx + 1) % queue.length].id)}>Skip</Button>
              <Button iconEnd="arrowRight" onClick={() => setSelected(queue[(idx + 1) % queue.length].id)}>Next</Button>
            </>
          }
        />
      }
    >
      <div className="rail" data-coach="rail">
        {queue.map(q => (
          <span className="tip" data-tip={`${q.name} — ${q.summary}`} key={q.id}>
            <button
              className="rail-item"
              data-selected={q.id === selected}
              data-flag={q.score !== null && q.score < 0.6}
              onClick={() => { setSelected(q.id); setOpenChip(null) }}
            >
              <Avatar label={q.initials} kind={q.initials === '?' ? undefined : 'human'} />
            </button>
          </span>
        ))}
      </div>

      <div className="decision-wrap">
        <div className="decision" key={call.id}>
          <div className="hero" data-coach="hero">
            <div className="row" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
              {gated
                ? <Badge tone="warning" icon="shieldAlert" size="lg">Needs a person</Badge>
                : <Badge tone="success" icon="check" size="lg">Nothing to approve</Badge>}
              <span className="grow" />
              <span className="mono" style={{ color: 'var(--fg-tertiary)' }}>{call.id} · {call.duration} · {call.ago}</span>
            </div>

            <div className="hero-amount">{gated ? gated.title.replace(' · ', ' ') : call.outcome}</div>
            <div style={{ fontSize: 'var(--text-lg)', lineHeight: 'var(--lh-lg)', color: 'var(--fg-secondary)', marginTop: 'var(--space-4)' }}>
              {call.name} · {gated ? gated.meta : call.summary}
            </div>

            <div className="hero-actions" style={{ marginTop: 'var(--space-7)' }}>
              {gated ? (
                <>
                  <Button variant="primary" size="lg" icon="check" onClick={() => onApprove(`${gated.title} approved on ${call.id}`)}>
                    Approve
                  </Button>
                  <Button variant="secondary" size="lg">Change amount</Button>
                  <Button variant="ghost" size="lg">Deny</Button>
                </>
              ) : (
                <Button variant="secondary" size="lg" icon="check" onClick={() => onApprove(`${call.id} spot-checked`)}>Looks right</Button>
              )}
              <span className="grow" />
              {/* A keyboard legend on a device with no keyboard is decoration
                  that reads as an instruction. It leaves below md. */}
              <span className="row hero-keys" style={{ gap: 'var(--space-3)', fontSize: 'var(--text-sm)', lineHeight: 'var(--lh-sm)', color: 'var(--fg-tertiary)' }}>
                <Kbd>⏎</Kbd> approve <Kbd>D</Kbd> deny
              </span>
            </div>
          </div>

          {(gated || low.length > 0) && (
            <div className="col" style={{ gap: 'var(--space-3)' }}>
              {gated?.policy && (
                <div className="eventline" data-tone="danger">
                  <Icon name="shieldAlert" size={14} />
                  <span><b>{gated.policy.split(' — ')[0]}</b> — {gated.policy.split(' — ')[1]}</span>
                </div>
              )}
              {low.map(f => (
                <div className="eventline" data-tone="warning" key={f.label}>
                  <Icon name="alert" size={14} />
                  <span>The AI is only {Math.round((f.score ?? 0) * 100)}% sure about <b>{f.label.toLowerCase()}</b>.</span>
                </div>
              ))}
            </div>
          )}

          <div className="col" style={{ gap: 'var(--space-4)' }}>
            <div className="row" style={{ gap: 'var(--space-4)' }}>
              <SectionLabel>What the AI heard</SectionLabel>
              <span className="grow" />
              <span style={{ fontSize: 'var(--text-xs)', lineHeight: 'var(--lh-xs)', color: 'var(--fg-tertiary)' }}>Click a chip for the quote</span>
            </div>
            <div className="chips" data-coach="chips">
              {call.fields.map(f => (
                <button
                  key={f.label}
                  className="chip"
                  data-band={band(f.score)}
                  data-open={openChip === f.label}
                  onClick={() => setOpenChip(openChip === f.label ? null : f.label)}
                >
                  {f.label}
                  <b>{f.value || 'pending'}</b>
                  {f.score !== null && <span className="mono tnum chip-pct">{Math.round(f.score * 100)}%</span>}
                </button>
              ))}
            </div>

            {chip && (
              <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)', padding: 'var(--space-7)' }}>
                <div className="row" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                  <span style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--lh-md)', fontWeight: 'var(--weight-semibold)' }}>{chip.label}</span>
                  <ConfidencePill score={chip.score} />
                  <span className="grow" />
                  <Button size="sm" variant="secondary" icon="edit">Change it</Button>
                </div>
                <div style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--lh-md)', color: 'var(--fg-secondary)' }}>
                  {chip.cite ? <>Heard: “{chip.cite}”</> : 'No quote — the AI took this from the order record, not the call.'}
                </div>
              </div>
            )}
          </div>

          <details className="disclosure" data-coach="disclosure">
            <summary>
              <Icon name="message" size={14} />
              Read the {call.channel === 'voice' ? 'call' : 'messages'} ({call.duration})
              <span className="grow" />
              <Icon name="chevronDown" size={14} />
            </summary>
            <div className="disclosure-body">
              {call.turns.map((t, i) =>
                t.kind === 'speech' ? (
                  <div key={i} style={{ padding: 'var(--space-3) 0' }}>
                    <span className="turn-who">{t.who === 'agent' ? 'Relay agent' : call.name}</span>
                    <div className="turn-text">{t.text}</div>
                  </div>
                ) : null,
              )}
            </div>
          </details>

          <details className="disclosure">
            <summary>
              <Icon name="layers" size={14} />
              Everything else the AI did ({Math.max(0, call.proposals.length - (gated ? 1 : 0))})
              <span className="grow" />
              <Icon name="chevronDown" size={14} />
            </summary>
            <div className="disclosure-body col" style={{ gap: 'var(--space-4)' }}>
              {call.proposals.filter(p => p.status !== 'gated').map(p => (
                <div className="row" key={p.title} style={{ gap: 'var(--space-4)' }}>
                  <Icon name={p.icon} size={14} style={{ color: 'var(--fg-tertiary)' }} />
                  <div className="grow">
                    <div style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--lh-md)', fontWeight: 'var(--weight-medium)' }}>{p.title}</div>
                    <div style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--lh-sm)', color: 'var(--fg-tertiary)' }}>{p.meta}</div>
                  </div>
                  {p.status === 'blocked'
                    ? <Badge tone="neutral" icon="lock">Not allowed</Badge>
                    : <Badge tone="success" icon="check">{p.status === 'done' ? 'Done' : 'Auto'}</Badge>}
                </div>
              ))}
            </div>
          </details>

          <Divider />
          <span style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--lh-sm)', color: 'var(--fg-tertiary)' }}>
            Approving logs your name, runs the action, and texts the customer.
          </span>
        </div>
      </div>
    </ProductShell>
  )
}
