import { useEffect, useMemo, useState } from 'react'
import {
  Badge, Button, Card, ConfidencePill, Divider, FieldRow, Icon, IconButton,
  Kbd, SectionLabel, Avatar, band,
} from '../ds'
import { ProductShell, PageHeader } from '../app/ProductShell'
import { transcript, extracted, queue, audit, type Field } from '../data/fixtures'

/* ---------- waveform ---------- */
const BARS = 148
const wave = Array.from({ length: BARS }, (_, i) => {
  const s = Math.sin(i * 0.7) * Math.cos(i * 0.19) * Math.sin(i * 0.041)
  return 0.22 + Math.abs(s) * 0.78
})

function Waveform({ progress, onSeek }: { progress: number; onSeek: (p: number) => void }) {
  return (
    <div
      className="wave"
      onClick={e => {
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
        onSeek((e.clientX - r.left) / r.width)
      }}
      style={{ cursor: 'pointer' }}
    >
      {wave.map((h, i) => (
        <i
          key={i}
          style={{ height: `${Math.round(h * 100)}%` }}
          data-played={i / BARS <= progress}
          data-flag={i > 78 && i < 86}
        />
      ))}
    </div>
  )
}

/* ---------- transcript ---------- */
function Transcript() {
  return (
    <div className="turns">
      {transcript.map((t, i) => {
        if (t.kind === 'tool') {
          return (
            <div className="turn" key={i}>
              <div className="turn-t">{t.t}</div>
              <div />
              <div className="turn-body">
                <div className="toolcall" data-status={t.status}>
                  <Icon name="layers" size={12} />
                  <b>{t.name}</b>
                  <span>({t.args})</span>
                  <Icon name="arrowRight" size={11} />
                  <span>{t.result}</span>
                  <span className="ms">{t.ms}ms{t.status === 'slow' && ' · slow'}</span>
                </div>
              </div>
            </div>
          )
        }
        if (t.kind === 'event') {
          return (
            <div className="turn" key={i}>
              <div className="turn-t">{t.t}</div>
              <div />
              <div className="turn-body">
                <div className="eventline" data-tone={t.tone}>
                  <Icon name={t.icon} size={13} />
                  <span>{t.text}</span>
                </div>
              </div>
            </div>
          )
        }
        const isAgent = t.who === 'agent'
        return (
          <div className="turn" key={i} data-who={t.who}>
            <div className="turn-t">{t.t}</div>
            <Avatar label="TR" kind={isAgent ? 'ai' : undefined} size="sm" />
            <div className="turn-body">
              <div className="row" style={{ gap: 'var(--space-4)', marginBottom: 2 }}>
                <span className="turn-who">{isAgent ? 'Relay agent' : 'Tanner Rowe'}</span>
                {isAgent && t.score !== undefined && t.score !== null && band(t.score) !== 'high' && (
                  <ConfidencePill score={t.score} />
                )}
              </div>
              <div className="turn-text">
                {t.note ? (
                  <span className="tip turn-uncertain" data-tip={`${t.note} · ASR 0.44`} style={{ display: 'inline' }}>
                    {t.text}
                  </span>
                ) : t.text}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ---------- approval drawer ---------- */
function ApproveDrawer({ onClose, onConfirm }: { onClose: () => void; onConfirm: (amt: string) => void }) {
  const [amount, setAmount] = useState('89.40')
  const [note, setNote] = useState('')
  const edited = amount !== '89.40'
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-label="Approve refund">
        <div className="overlay-header">
          <div className="col" style={{ gap: 2 }}>
            <div className="row" style={{ gap: 'var(--space-4)' }}>
              <span style={{ fontSize: 'var(--text-lg)', fontWeight: 600, letterSpacing: 'var(--tracking-tight)' }}>Approve refund</span>
              <Badge tone="warning" icon="shieldAlert">Human approval required</Badge>
            </div>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-tertiary)' }}>Call C-48219 · Tanner Rowe · order A-88421</span>
          </div>
          <IconButton icon="x" tip="Close · Esc" onClick={onClose} />
        </div>

        <div className="grow" style={{ overflowY: 'auto', padding: 'var(--space-7)', display: 'flex', flexDirection: 'column', gap: 'var(--space-7)' }}>
          <div>
            <SectionLabel style={{ marginBottom: 'var(--space-4)' }}>Agent proposal</SectionLabel>
            <Card>
              <div style={{ padding: 'var(--space-6)' }}>
                <div className="row" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
                  <Icon name="dollar" size={15} style={{ color: 'var(--fg-tertiary)' }} />
                  <span style={{ fontWeight: 600 }}>Refund 1 × CX-40 Filter Unit</span>
                  <span className="grow" />
                  <ConfidencePill score={0.88} />
                </div>
                <label className="section-label" style={{ display: 'block', marginBottom: 'var(--space-3)' }}>Amount</label>
                <div className="row" style={{ gap: 'var(--space-4)' }}>
                  <div className="row grow" style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 10, color: 'var(--fg-tertiary)' }}>$</span>
                    <input className="input" style={{ paddingLeft: 22, fontVariantNumeric: 'tabular-nums' }} value={amount} onChange={e => setAmount(e.target.value)} />
                  </div>
                  {edited && <Badge tone="info" icon="edit">Overridden</Badge>}
                </div>
                <div className="policyline"><Icon name="shield" size={11} />Max refundable for this line item: $89.40</div>
              </div>
            </Card>
          </div>

          <div>
            <SectionLabel style={{ marginBottom: 'var(--space-4)' }}>Why this needs you</SectionLabel>
            <div className="col" style={{ gap: 'var(--space-3)' }}>
              <div className="eventline" data-tone="danger"><Icon name="shieldAlert" size={13} /><span><b>refund_limit</b> — amount exceeds the $50 auto-approve ceiling for support agents.</span></div>
              <div className="eventline" data-tone="warning"><Icon name="alert" size={13} /><span><b>damage_type</b> extracted at 52% confidence. Caller described the damage as “cosmetic-ish”.</span></div>
            </div>
          </div>

          <div>
            <SectionLabel style={{ marginBottom: 'var(--space-4)' }}>Note to customer <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>(optional)</span></SectionLabel>
            <textarea className="input" rows={3} placeholder="Added to the SMS confirmation…" value={note} onChange={e => setNote(e.target.value)} />
          </div>

          <div>
            <SectionLabel style={{ marginBottom: 'var(--space-4)' }}>On approval</SectionLabel>
            <div className="col" style={{ gap: 'var(--space-3)', fontSize: 'var(--text-md)', color: 'var(--fg-secondary)' }}>
              {['Refund issued to card ••4429 (Stripe)', 'SMS confirmation sent to +1 (415) 555-0184', 'Ticket NW-3391 closed as “resolved by agent + human”', 'Decision logged to model feedback set'].map(x => (
                <div className="row" key={x} style={{ gap: 'var(--space-4)' }}><Icon name="check" size={13} style={{ color: 'var(--success-solid)' }} />{x}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="overlay-footer" style={{ borderRadius: 0 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="dangerSubtle" icon="x">Deny</Button>
          <Button variant="primary" icon="check" onClick={() => onConfirm(amount)}>Approve ${amount}</Button>
        </div>
      </aside>
    </>
  )
}

/* ---------- screen ---------- */
export function Review() {
  const [selected, setSelected] = useState('C-48219')
  const [progress, setProgress] = useState(0.42)
  const [playing, setPlaying] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [fields, setFields] = useState<Field[]>(extracted)
  const [editing, setEditing] = useState<string | null>(null)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setProgress(p => (p >= 1 ? (setPlaying(false), 1) : p + 0.006)), 60)
    return () => clearInterval(id)
  }, [playing])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 4200)
    return () => clearTimeout(id)
  }, [toast])

  const flagged = useMemo(() => fields.filter(f => f.score !== null && f.score < 0.6).length, [fields])

  return (
    <>
      <ProductShell
        header={
          <PageHeader
            crumbs={['Review queue', 'Voice']}
            title="Tanner Rowe"
            meta={
              <div className="row" style={{ gap: 'var(--space-3)' }}>
                <Badge tone="warning" icon="shieldAlert">Needs review</Badge>
                <Badge tone="ai" icon="bot">Concierge v4.2</Badge>
                <span className="mono" style={{ color: 'var(--fg-tertiary)' }}>C-48219</span>
              </div>
            }
            actions={
              <>
                <IconButton icon="undo" bordered tip="Reopen call" />
                <IconButton icon="more" bordered tip="More" />
                <Button icon="handoff">Assign to human</Button>
              </>
            }
          />
        }
      >
        {/* ---------- queue ---------- */}
        <div className="queue">
          <div className="queue-toolbar">
            <div className="segmented">
              <button aria-pressed>Needs review<span style={{ marginLeft: 5, opacity: .6 }}>12</span></button>
              <button>All</button>
            </div>
            <span className="grow" />
            <IconButton icon="filter" size="sm" tip="Filter" />
            <IconButton icon="refresh" size="sm" tip="Refresh" />
          </div>
          <div className="queue-list">
            {queue.map(q => (
              <button key={q.id} className="qitem" data-selected={q.id === selected} onClick={() => setSelected(q.id)}>
                <div className="qitem-top">
                  <Avatar label={q.initials} kind={q.initials === '?' ? undefined : 'human'} />
                  <span className="qitem-name">{q.name}</span>
                  <span className="qitem-meta">{q.ago}</span>
                </div>
                <div className="qitem-summary">{q.summary}</div>
                <div className="qitem-tags">
                  <Icon name={q.channel === 'voice' ? 'phone' : 'message'} size={11} style={{ color: 'var(--fg-disabled)' }} />
                  {q.status === 'processing'
                    ? <Badge tone="info" dot live>Transcribing</Badge>
                    : <ConfidencePill score={q.score} />}
                  {q.status === 'escalated' && <Badge tone="danger" icon="handoff">Escalated</Badge>}
                  {q.status === 'auto-resolved' && <Badge tone="success" icon="check">Auto-resolved</Badge>}
                  {q.flags > 0 && <Badge tone="neutral" icon="shieldAlert">{q.flags}</Badge>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ---------- stage ---------- */}
        <div className="stage">
          <div className="stage-scroll">
            <Card style={{ marginBottom: 'var(--space-8)' }}>
              <div className="callcard">
                <IconButton icon={playing ? 'pause' : 'play'} bordered tip={playing ? 'Pause' : 'Play recording'} onClick={() => setPlaying(p => !p)} />
                <span className="mono tnum" style={{ color: 'var(--fg-tertiary)', width: 34 }}>
                  {`${Math.floor(progress * 91 / 60)}:${String(Math.floor(progress * 91) % 60).padStart(2, '0')}`}
                </span>
                <Waveform progress={progress} onSeek={setProgress} />
                <span className="mono tnum" style={{ color: 'var(--fg-tertiary)' }}>1:31</span>
                <Divider style={{ width: 1, height: 28 }} />
                <div className="callstat"><span className="callstat-k">Outcome</span><span className="callstat-v">Refund requested</span></div>
                <div className="callstat"><span className="callstat-k">Containment</span><span className="callstat-v">Partial</span></div>
                <div className="callstat"><span className="callstat-k">Cost</span><span className="callstat-v">$0.14</span></div>
              </div>
            </Card>

            <div className="row" style={{ gap: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>
              <SectionLabel>Transcript</SectionLabel>
              <Divider className="grow" style={{ flex: 1 }} />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-tertiary)' }}>Diarised · PII redacted</span>
              <IconButton icon="eye" size="sm" tip="Show redacted values" />
            </div>

            <Transcript />
            <div style={{ height: 40 }} />
          </div>
        </div>

        {/* ---------- inspector ---------- */}
        <aside className="inspector">
          <div className="inspector-scroll">
            <div className="insp-section">
              <div className="insp-head">
                <Icon name="sparkle" size={14} style={{ color: 'var(--ai-fg)' }} />
                <span className="card-title grow">What the agent understood</span>
                {flagged > 0 && <Badge tone="danger">{flagged} low</Badge>}
              </div>
              <div>
                {fields.map(f => (
                  <FieldRow
                    key={f.label}
                    label={f.label}
                    flag={f.flag}
                    score={f.score}
                    cite={f.cite}
                    value={
                      editing === f.label ? (
                        <input
                          className="input"
                          autoFocus
                          defaultValue={f.value}
                          style={{ height: 26 }}
                          onBlur={e => {
                            setFields(fs => fs.map(x => x.label === f.label ? { ...x, value: e.target.value, score: 1, flag: undefined, cite: undefined } : x))
                            setEditing(null)
                          }}
                          onKeyDown={e => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                        />
                      ) : f.score === null ? (
                        <span style={{ color: 'var(--fg-disabled)', fontStyle: 'italic', fontWeight: 400 }}>{f.value}</span>
                      ) : f.score === 1 ? (
                        <span className="row" style={{ gap: 'var(--space-3)' }}>{f.value}<Badge tone="info" icon="edit">Edited by you</Badge></span>
                      ) : f.value
                    }
                    actions={<IconButton icon="edit" size="sm" tip="Override" onClick={() => setEditing(f.label)} />}
                  />
                ))}
              </div>
            </div>

            <div className="insp-section" style={{ paddingBottom: 'var(--space-2)' }}>
              <div className="insp-head">
                <Icon name="layers" size={14} style={{ color: 'var(--fg-tertiary)' }} />
                <span className="card-title grow">Proposed actions</span>
                <Badge tone="warning">1 gated</Badge>
              </div>

              <div className="proposal" data-gated="true">
                <div className="row" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                  <Icon name="dollar" size={15} style={{ color: 'var(--warning-fg)' }} />
                  <span className="proposal-title grow">Issue refund · $89.40</span>
                </div>
                <div className="proposal-meta">To card ••4429 · order A-88421 · 1 × CX-40</div>
                <div className="policyline">
                  <Icon name="lock" size={11} />
                  Blocked by <b style={{ fontWeight: 600 }}>refund_limit</b> — over $50 needs a human
                </div>
                <div className="row" style={{ gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
                  <Button variant="primary" size="sm" icon="check" onClick={() => setDrawer(true)}>Review &amp; approve</Button>
                  <Button variant="ghost" size="sm">Deny</Button>
                </div>
              </div>

              <div className="proposal">
                <div className="row" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                  <Icon name="message" size={15} style={{ color: 'var(--fg-tertiary)' }} />
                  <span className="proposal-title grow">Send SMS confirmation</span>
                  <Badge tone="success" icon="check">Auto-approved</Badge>
                </div>
                <div className="proposal-meta">Queued — sends after the refund is approved</div>
              </div>

              <div className="proposal">
                <div className="row" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                  <Icon name="handoff" size={15} style={{ color: 'var(--fg-tertiary)' }} />
                  <span className="proposal-title grow">Cancel auto-reorder</span>
                  <Badge tone="neutral" icon="lock">Out of scope</Badge>
                </div>
                <div className="proposal-meta">Agent has no permission on subscriptions · routed to Billing</div>
              </div>
            </div>

            <div className="insp-section">
              <div className="insp-head">
                <Icon name="clock" size={14} style={{ color: 'var(--fg-tertiary)' }} />
                <span className="card-title grow">Audit trail</span>
                <IconButton icon="external" size="sm" tip="Open full log" />
              </div>
              <div style={{ padding: '0 var(--space-6) var(--space-6)' }}>
                {audit.map(a => (
                  <div className="row" key={a.t} style={{ gap: 'var(--space-4)', padding: 'var(--space-2) 0', fontSize: 'var(--text-sm)' }}>
                    <span className="mono" style={{ color: 'var(--fg-disabled)' }}>{a.t}</span>
                    <span style={{ color: 'var(--fg-secondary)' }}>{a.what}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="actionbar">
            <Button variant="ghost" size="sm" icon="handoff">Escalate</Button>
            <span className="grow" />
            <Button variant="secondary" size="sm">Reject<Kbd>R</Kbd></Button>
            <Button variant="primary" size="sm" icon="check" onClick={() => setDrawer(true)}>Approve all<Kbd>⏎</Kbd></Button>
          </div>
        </aside>
      </ProductShell>

      {drawer && (
        <ApproveDrawer
          onClose={() => setDrawer(false)}
          onConfirm={amt => { setDrawer(false); setToast(`Refund of $${amt} approved · sent to Stripe`) }}
        />
      )}

      {toast && (
        <div className="toast-layer">
          <div className="toast">
            <Icon name="checkCircle" size={15} style={{ color: 'var(--conf-high-fg)' }} />
            {toast}
            <button onClick={() => setToast(null)}>Undo</button>
          </div>
        </div>
      )}
    </>
  )
}
