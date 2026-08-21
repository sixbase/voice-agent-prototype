/* C · Triage table — clear many calls in one pass. Rows open in place. */
import { Fragment, useState } from 'react'
import { Badge, Button, ConfidencePill, Divider, Icon, IconButton, SectionLabel, Avatar } from '../../ds'
import { ProductShell, PageHeader } from '../../app/ProductShell'
import { queue } from '../../data/fixtures'

const WANTS: Record<string, string> = {
  'C-48219': 'Refund $89.40', 'C-48218': 'Move delivery to Thu', 'C-48217': 'Hand to a person',
  'C-48216': '—', 'C-48215': 'Send invoice', 'C-48214': 'Refund $412.00',
  'C-48213': 'Change address', 'C-48212': 'Credit $25.00',
}

export function Triage({ onApprove }: { onApprove: (msg: string) => void }) {
  const [open, setOpen] = useState<string | null>('C-48219')
  const safeIds = queue.filter(q => q.status === 'auto-resolved').map(q => q.id)
  const [picked, setPicked] = useState<string[]>(safeIds)
  const toggle = (id: string) => setPicked(p => (p.includes(id) ? p.filter(x => x !== id) : [...p, id]))
  /* A yearly contract value is not money at risk today — only refundable
     amounts count toward the total. */
  const atRisk = queue.reduce((n, q) => {
    const v = q.value ?? ''
    if (!v.startsWith('$') || v.includes('a year')) return n
    return n + Number(v.replace(/[^\d.]/g, '') || 0)
  }, 0)

  return (
    <ProductShell
      header={
        <PageHeader
          crumbs={['Review queue']}
          title={`${queue.length} calls waiting`}
          meta={<Badge tone="neutral" icon="dollar">${atRisk.toLocaleString('en-US', { minimumFractionDigits: 2 })} at risk</Badge>}
          actions={<><IconButton icon="filter" bordered tip="Filter" /><Button icon="external">Export</Button></>}
        />
      }
    >
      <div className="triage">
        <div className="bulkbar" data-coach="bulk">
          <span style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--lh-md)', fontWeight: 'var(--weight-medium)' }}>{picked.length} picked</span>
          <span className="bulkbar-note">
            Only calls with no money and no shaky answers can be cleared in bulk
          </span>
          <span className="grow" />
          <Button size="sm" variant="ghost" onClick={() => setPicked([])}>Clear</Button>
          <Button size="sm" variant="primary" icon="check" disabled={!picked.length}
            onClick={() => onApprove(`${picked.length} calls cleared`)}>
            Approve {picked.length} safe
          </Button>
        </div>

        <div className="triage-scroll">
          <table className="ttable">
            <thead>
              <tr>
                {/* checkbox gutter: the control itself + the cell's own --space-8 padding */}
                <th style={{ width: 'calc(var(--checkbox-sz) + var(--space-8))' }} />
                <th>Caller</th>
                <th>What the AI heard</th>
                <th>Sure?</th>
                <th>Wants to do</th>
                <th>Money</th>
                <th>Age</th>
              </tr>
            </thead>
            <tbody>
              {queue.map(q => {
                const canBulk = q.status === 'auto-resolved'
                const gated = q.proposals.find(p => p.status === 'gated')
                return (
                  <Fragment key={q.id}>
                    <tr className="trow" data-open={open === q.id} data-coach={q.id === 'C-48219' ? 'row' : undefined}
                        onClick={() => setOpen(open === q.id ? null : q.id)}>
                      <td data-label="Pick" onClick={e => e.stopPropagation()}>
                        <button
                          className="checkbox"
                          role="checkbox"
                          aria-checked={picked.includes(q.id)}
                          disabled={!canBulk}
                          onClick={() => canBulk && toggle(q.id)}
                          aria-label={`Pick ${q.name}`}
                        >
                          <Icon name="check" size={12} />
                        </button>
                      </td>
                      <td data-label="Caller">
                        <div className="row" style={{ gap: 'var(--space-4)' }}>
                          <Avatar label={q.initials} kind={q.initials === '?' ? undefined : 'human'} size="sm" />
                          <span style={{ fontWeight: 'var(--weight-medium)' }}>{q.name}</span>
                          <Icon name={q.channel === 'voice' ? 'phone' : 'message'} size={12} style={{ color: 'var(--fg-disabled)' }} />
                        </div>
                      </td>
                      <td data-label="Heard" style={{ color: 'var(--fg-secondary)' }}>
                        {/* A live call's summary is still being written, so the
                            words say so themselves rather than needing a spinner. */}
                        {q.status === 'processing' ? <span className="shimmer">{q.summary}</span> : q.summary}
                      </td>
                      <td data-label="Sure?">
                        {q.status === 'processing'
                          ? <Badge tone="info" dot live>Working</Badge>
                          : <ConfidencePill score={q.score} />}
                      </td>
                      <td data-label="Wants to do">{WANTS[q.id]}</td>
                      <td data-label="Money" className="mono tnum" style={{ color: q.value ? 'var(--fg-primary)' : 'var(--fg-disabled)' }}>{q.value ?? '—'}</td>
                      <td data-label="Age" style={{ color: 'var(--fg-tertiary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--lh-sm)' }}>{q.ago}</td>
                    </tr>

                    {open === q.id && (
                      <tr className="texpand">
                        <td colSpan={7}>
                          <div className="texpand-inner" data-coach={q.id === 'C-48219' ? 'expand' : undefined}>
                            <div className="col" style={{ gap: 'var(--space-5)' }}>
                              <SectionLabel>What the AI heard</SectionLabel>
                              {q.fields.slice(0, 6).map(f => (
                                <div className="row" key={f.label} style={{ gap: 'var(--space-5)' }}>
                                  <span style={{ width: 'var(--fieldrow-label-w)', fontSize: 'var(--text-sm)', lineHeight: 'var(--lh-sm)', color: 'var(--fg-tertiary)', flex: 'none' }}>{f.label}</span>
                                  <span style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--lh-md)' }}>{f.value || '—'}</span>
                                  <span className="grow" />
                                  <ConfidencePill score={f.score} />
                                </div>
                              ))}
                              <Divider />
                              <details className="disclosure">
                                <summary>Read the {q.channel === 'voice' ? 'call' : 'messages'}<span className="grow" /><Icon name="chevronDown" size={14} /></summary>
                                <div className="disclosure-body">
                                  {q.turns.filter(t => t.kind === 'speech').map((t, i) => (
                                    <div key={i} style={{ padding: 'var(--space-3) 0' }}>
                                      <span className="turn-who">{t.kind === 'speech' && t.who === 'agent' ? 'Relay agent' : q.name}</span>
                                      <div className="turn-text">{t.kind === 'speech' ? t.text : ''}</div>
                                    </div>
                                  ))}
                                </div>
                              </details>
                            </div>

                            <div className="col" style={{ gap: 'var(--space-5)' }}>
                              <SectionLabel>What it wants to do</SectionLabel>
                              {q.proposals.length === 0 && (
                                <span style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--lh-md)', color: 'var(--fg-tertiary)' }}>Still on the call — nothing proposed yet.</span>
                              )}
                              {q.proposals.map(p => (
                                <div className="proposal" data-gated={p.status === 'gated' ? 'true' : undefined} key={p.title} style={{ margin: 0 }}>
                                  <div className="row" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                                    <Icon name={p.icon} size={16} />
                                    <span className="proposal-title grow">{p.title}</span>
                                    {p.status === 'blocked' && <Badge tone="neutral" icon="lock">Not allowed</Badge>}
                                    {p.status === 'auto' && <Badge tone="success" icon="check">Auto</Badge>}
                                    {p.status === 'done' && <Badge tone="success" icon="check">Done</Badge>}
                                  </div>
                                  <div className="proposal-meta">{p.meta}</div>
                                  {p.policy && (
                                    <div className="policyline"><Icon name="lock" size={12} />{p.policy}</div>
                                  )}
                                  {p.status === 'gated' && (
                                    <div className="row" style={{ gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
                                      <Button size="sm" variant="primary" icon="check" onClick={() => onApprove(`${p.title} approved on ${q.id}`)}>Approve</Button>
                                      <Button size="sm" variant="ghost">Deny</Button>
                                    </div>
                                  )}
                                </div>
                              ))}
                              {gated && (
                                <span style={{ fontSize: 'var(--text-xs)', lineHeight: 'var(--lh-xs)', color: 'var(--fg-tertiary)' }}>
                                  This row cannot be bulk-approved — money is involved.
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="actionbar">
          <span style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--lh-sm)', color: 'var(--fg-tertiary)' }}>
            {safeIds.length} of {queue.length} can be cleared without reading them
          </span>
          <span className="grow" />
          {/* Hidden on a coarse pointer — see .triage-keys. Same call as
              .hero-keys and the action bar's key caps. */}
          <Button size="sm" variant="ghost" className="triage-keys">Keyboard shortcuts</Button>
        </div>
      </div>
    </ProductShell>
  )
}
