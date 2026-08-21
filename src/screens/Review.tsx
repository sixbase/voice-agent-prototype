import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  Badge, Button, Card, ConfidencePill, Divider, FieldRow, Icon, IconButton,
  Kbd, SectionLabel, Segmented, Avatar, Skeleton, EmptyState, band, type Tone,
} from '../ds'
import { ProductShell, PageHeader, useMinWidth } from '../app/ProductShell'
import { CoachMarks } from './variants/CoachMarks'
import { CORE_STEPS } from './coachSteps'
import { queue, queueCounts, byId, type Field, type Turn, type Proposal, type Call } from '../data/fixtures'

/* ---------- waveform ----------
   The stick count is DERIVED from the measured width, not fixed. A fixed count
   is a bet that one number reads as a waveform at every size, and it loses at
   both ends: 42 sticks in a 1600px console are fat bricks, and in a 240px phone
   card they flex to nothing at all. STICK is the target pitch — bar plus its
   --space-1 gutter — so a stick stays 4–5px wide from a 320px phone to a 1600px
   desktop, which is both legible as a waveform and a reasonable scrub target.
   The count is clamped so the shape stays a waveform and not a bar chart. */
const STICK = 7
const MIN_BARS = 20
const MAX_BARS = 64
const barsFor = (w: number) => Math.max(MIN_BARS, Math.min(MAX_BARS, Math.round(w / STICK)))

/* Where the shaky stretch sits, as a fraction of the call. Fractions, not
   stick indices, so the marker keeps covering the same moment — and the same
   share of the width — whatever the count turns out to be. */
const FLAG_SPAN: [number, number] = [0.52, 0.59]
const waveFor = (seed: number, bars: number) =>
  Array.from({ length: bars }, (_, i) => {
    const s = Math.sin((i + seed) * 0.7) * Math.cos((i + seed) * 0.19) * Math.sin((i + seed) * 0.041)
    return 0.22 + Math.abs(s) * 0.78
  })

function Waveform({ progress, onSeek, seed, flagAt }: { progress: number; onSeek: (p: number) => void; seed: number; flagAt: [number, number] | null }) {
  const ref = useRef<HTMLDivElement>(null)
  const [bars, setBars] = useState(MIN_BARS)

  /* Observed rather than read once: this element changes width when the
     inspector opens, when the chapter chrome reflows, and on every rotation. */
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    /* A zero width is not a narrow waveform, it is a hidden one — the phone's
       transcript pane starts behind the queue, and measuring it there would
       lock in the 20-bar floor for a column that turns out to be 191px wide.
       Ignore it and keep the last real measurement. */
    const apply = () => {
      const w = el.getBoundingClientRect().width
      if (w > 0) setBars(barsFor(w))
    }
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const wave = useMemo(() => waveFor(seed, bars), [seed, bars])
  return (
    <div
      ref={ref}
      className="wave"
      style={{ cursor: 'pointer' }}
      onClick={e => {
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
        onSeek((e.clientX - r.left) / r.width)
      }}
    >
      {wave.map((h, i) => (
        <i
          key={i}
          style={{ height: `${Math.round(h * 100)}%` }}
          data-played={i / bars <= progress}
          data-flag={!!flagAt && i / bars >= flagAt[0] && i / bars <= flagAt[1]}
        />
      ))}
    </div>
  )
}

/* ---------- transcript ---------- */
function Transcript({ turns, customer, channel }: { turns: Turn[]; customer: string; channel: 'voice' | 'sms' }) {
  const initials = customer.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className="turns">
      {turns.map((t, i) => {
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
                  <Icon name="arrowRight" size={12} />
                  <span>{t.result}</span>
                  <span className="ms">{t.ms}ms{t.status === 'slow' && ' · slow'}{t.status === 'fail' && ' · failed'}</span>
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
                  <Icon name={t.icon} size={14} />
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
            <Avatar label={initials} kind={isAgent ? 'ai' : undefined} size="sm" />
            <div className="turn-body">
              <div className="row" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-1)' }}>
                <span className="turn-who">{isAgent ? 'Relay agent' : customer}</span>
                {isAgent && t.score != null && band(t.score) !== 'high' && <ConfidencePill score={t.score} />}
              </div>
              <div className="turn-text">
                {t.note
                  /* tabIndex is the touch affordance: this tip wraps text, not
                     a button, so :focus-within has nothing to fire on until the
                     span itself can be tapped into focus. Without it, "where it
                     misheard" is knowledge only a mouse can reach. */
                  ? <span className="tip turn-uncertain" tabIndex={0} role="note" data-tip={`${t.note} · heard at ${Math.round((t.score ?? 0) * 100)}%`} style={{ display: 'inline' }}>{t.text}</span>
                  : t.text}
              </div>
            </div>
          </div>
        )
      })}
      {channel === 'sms' && (
        <div style={{ paddingTop: 'var(--space-6)' }}>
          <div className="eventline" data-tone="info">
            <Icon name="message" size={14} />
            <span>SMS thread · no recording. Timestamps are message times, not call offsets.</span>
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- proposal ---------- */
const PROPOSAL_BADGE: Record<Proposal['status'], { tone: Tone; label: string; icon: 'check' | 'lock' | 'shieldAlert' | 'xCircle' } | null> = {
  gated: null,
  auto: { tone: 'success', label: 'Done on its own', icon: 'check' },
  blocked: { tone: 'neutral', label: 'Out of scope', icon: 'lock' },
  done: { tone: 'success', label: 'Done', icon: 'check' },
  failed: { tone: 'danger', label: 'Failed', icon: 'xCircle' },
}

function ProposalCard({ p, onApprove }: { p: Proposal; onApprove: () => void }) {
  const badge = PROPOSAL_BADGE[p.status]
  return (
    <div className="proposal" data-gated={p.status === 'gated' ? 'true' : undefined}>
      <div className="row" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
        <Icon name={p.icon} size={16} style={{ color: p.status === 'gated' ? 'var(--warning-fg)' : 'var(--fg-tertiary)' }} />
        <span className="proposal-title grow">{p.title}</span>
        {badge && <Badge tone={badge.tone} icon={badge.icon}>{badge.label}</Badge>}
      </div>
      <div className="proposal-meta">{p.meta}</div>
      {p.policy && (
        <div className="policyline">
          <Icon name="lock" size={12} />
          Blocked by <b style={{ fontWeight: 'var(--weight-semibold)' }}>{p.policy.split(' — ')[0]}</b>
          {p.policy.includes(' — ') && ` — ${p.policy.split(' — ')[1]}`}
        </div>
      )}
      {p.note && <div className="policyline"><Icon name="shield" size={12} />{p.note}</div>}
      {p.status === 'gated' && (
        <div className="row" style={{ gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
          <Button variant="primary" size="sm" icon="check" onClick={onApprove}>Review &amp; approve</Button>
          <Button variant="ghost" size="sm">Deny</Button>
        </div>
      )}
    </div>
  )
}

/* ---------- approval drawer ---------- */
function ApproveDrawer({ call, gated, onClose, onConfirm }: { call: Call; gated: Proposal; onClose: () => void; onConfirm: (amt: string) => void }) {
  const raw = gated.title.match(/\$([\d,.]+)/)?.[1] ?? ''
  const [amount, setAmount] = useState(raw)
  const [note, setNote] = useState('')
  const edited = amount !== raw
  const low = call.fields.filter(f => f.score !== null && f.score < 0.6)

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-label={gated.title}>
        <div className="overlay-header">
          <div className="col" style={{ gap: 'var(--space-1)' }}>
            <div className="row" style={{ gap: 'var(--space-4)' }}>
              <span style={{ fontSize: 'var(--text-lg)', lineHeight: 'var(--lh-lg)', fontWeight: 'var(--weight-semibold)', letterSpacing: 'var(--tracking-tight)' }}>{gated.title.split(' · ')[0]}</span>
              <Badge tone="warning" icon="shieldAlert">Needs a person</Badge>
            </div>
            <span style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--lh-sm)', color: 'var(--fg-tertiary)' }}>{call.id} · {call.name} · {gated.meta}</span>
          </div>
          <IconButton icon="x" tip="Close · Esc" onClick={onClose} />
        </div>

        <div className="grow" style={{ overflowY: 'auto', padding: 'var(--space-7)', display: 'flex', flexDirection: 'column', gap: 'var(--space-7)' }}>
          {raw && (
            <div>
              <SectionLabel style={{ marginBottom: 'var(--space-4)' }}>What the agent proposed</SectionLabel>
              <Card>
                <div style={{ padding: 'var(--space-7)' }}>
                  <label className="section-label" style={{ display: 'block', marginBottom: 'var(--space-3)' }}>Amount</label>
                  <div className="row" style={{ gap: 'var(--space-4)' }}>
                    <div className="row grow" style={{ position: 'relative' }}>
                      {/* currency prefix sits on the input's own --space-5 inset */}
                      <span style={{ position: 'absolute', left: 'var(--space-5)', color: 'var(--fg-tertiary)' }}>$</span>
                      <input className="input" style={{ paddingLeft: 'calc(var(--space-5) + var(--space-6))', fontVariantNumeric: 'tabular-nums' }} value={amount} onChange={e => setAmount(e.target.value)} />
                    </div>
                    {edited && <Badge tone="info" icon="edit">Changed</Badge>}
                  </div>
                  <div className="policyline"><Icon name="shield" size={12} />Most it can be: ${raw}</div>
                </div>
              </Card>
            </div>
          )}

          <div>
            <SectionLabel style={{ marginBottom: 'var(--space-4)' }}>Why this needs you</SectionLabel>
            <div className="col" style={{ gap: 'var(--space-3)' }}>
              {gated.policy && (
                <div className="eventline" data-tone="danger">
                  <Icon name="shieldAlert" size={14} />
                  <span><b>{gated.policy.split(' — ')[0]}</b> — {gated.policy.split(' — ')[1] ?? 'policy limit'}</span>
                </div>
              )}
              {low.map(f => (
                <div className="eventline" data-tone="warning" key={f.label}>
                  <Icon name="alert" size={14} />
                  <span><b>{f.label}</b> is only {Math.round((f.score ?? 0) * 100)}% sure{f.cite ? ` — they said “${f.cite}”` : ''}.</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel style={{ marginBottom: 'var(--space-4)' }}>Note to customer <span style={{ textTransform: 'none', letterSpacing: 'var(--tracking-normal)', fontWeight: 'var(--weight-regular)' }}>(optional)</span></SectionLabel>
            <textarea className="input" rows={3} placeholder="Added to the text message…" value={note} onChange={e => setNote(e.target.value)} />
          </div>

          <div>
            <SectionLabel style={{ marginBottom: 'var(--space-4)' }}>If you approve</SectionLabel>
            <div className="col" style={{ gap: 'var(--space-3)', fontSize: 'var(--text-md)', color: 'var(--fg-secondary)' }}>
              {[
                raw ? `Money leaves: $${amount}` : 'The action runs',
                'The customer gets a text',
                `${call.id} closes as “agent + person”`,
                'Your decision goes to the training set',
              ].map(x => (
                <div className="row" key={x} style={{ gap: 'var(--space-4)' }}><Icon name="check" size={14} style={{ color: 'var(--success-solid)' }} />{x}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="overlay-footer" style={{ borderRadius: 0 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="dangerSubtle" icon="x">Deny</Button>
          <Button variant="primary" icon="check" onClick={() => onConfirm(amount)}>
            {raw ? `Approve $${amount}` : 'Approve'}
          </Button>
        </div>
      </aside>
    </>
  )
}

/* ---------- screen ---------- */
/* `coach` is set only by chapter 3. Chapter 4 mounts this very same screen as
   layout A and wants no marks on it — the comparison is the point there, and
   the walkthrough already happened a chapter earlier. */
export function Review({ coach = false }: { coach?: boolean } = {}) {
  const [selected, setSelected] = useState('C-48219')
  const [coachMode, setCoachMode] = useState<'off' | 'pins' | 'tour'>('pins')
  const [invite, setInvite] = useState(true)
  const call = byId(selected)

  const [progress, setProgress] = useState(0.42)
  const [playing, setPlaying] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [edits, setEdits] = useState<Record<string, Record<string, string>>>({})
  const [editing, setEditing] = useState<string | null>(null)

  /* ---------- responsive navigation state ----------
     Two pieces of state that only the small layouts read, but that live here
     unconditionally so there is no width-dependent branch in the render and no
     stale value waiting behind a resize.

     `view`  — phone only. Which half of list-then-detail you are looking at.
     `pane`  — phone AND tablet. Which of the two panes of the detail is up.
               Below md they swap; at md–lg the inspector slides over the
               transcript; from xl it is a column and this is ignored. */
  const [view, setView] = useState<'list' | 'detail'>('list')
  const [pane, setPane] = useState<'transcript' | 'inspector'>('transcript')
  /* The only place this screen asks how wide the window is: the page header has
     to say different WORDS in the queue than in a call, and only below md is
     there a moment when the queue is all you can see. */
  const onQueueScreen = !useMinWidth(768) && view === 'list'

  /* The coach tour spotlights elements that, below md, may be sitting in a pane
     that is not on screen — the queue when you are in a call, or the inspector
     when you are on the transcript tab. The tour announces the selector it is
     about to point at and this screen brings the owning pane forward. Reading
     `closest` off the live DOM is what keeps the two decoupled: the panes are
     hidden with display:none, never unmounted, so the element is always there
     to be asked which pane it belongs to.
     Harmless from md up, where every pane is on screen anyway. */
  useEffect(() => {
    const on = (e: Event) => {
      const sel = (e as CustomEvent<{ sel: string }>).detail?.sel
      const el = sel ? document.querySelector(sel) : null
      if (!el) return
      if (el.closest('.queue')) { setView('list') }
      else if (el.closest('.inspector')) { setView('detail'); setPane('inspector') }
      else if (el.closest('.stage')) { setView('detail'); setPane('transcript') }
    }
    window.addEventListener('coach-reveal', on)
    return () => window.removeEventListener('coach-reveal', on)
  }, [])

  /* new call → reset the transport, keep any edits already made */
  useEffect(() => { setProgress(call.status === 'processing' ? 1 : 0.42); setPlaying(false); setEditing(null) }, [selected])

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

  const fields: Field[] = call.fields.map(f => {
    const edited = edits[call.id]?.[f.label]
    return edited ? { ...f, value: edited, score: 1, flag: undefined, cite: undefined, pending: false } : f
  })
  const lowCount = fields.filter(f => f.score !== null && f.score < 0.6).length
  const gated = call.proposals.find(p => p.status === 'gated')
  const blocked = call.proposals.filter(p => p.status === 'blocked').length
  const isLive = call.status === 'processing'
  const done = call.status === 'auto-resolved'

  const seconds = (() => {
    const [m, s] = call.duration.split(':').map(Number)
    return call.duration === '—' ? 0 : m * 60 + s
  })()
  const at = Math.floor(progress * seconds)

  /* Same two keys the explorer used, now that the tour lives here. */
  useEffect(() => {
    if (!coach) return
    const h = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === '?') { setCoachMode('tour'); setInvite(false) }
      if (e.key.toLowerCase() === 'h') setCoachMode(m => (m === 'off' ? 'pins' : 'off'))
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [coach])

  const approve = (amt?: string) => {
    setDrawer(false)
    setToast(amt ? `Approved $${amt} on ${call.id} — sent to Stripe` : `${call.id} approved`)
  }

  return (
    <>
      <ProductShell
        view={view}
        pane={pane}
        header={onQueueScreen ? (
          /* Phone, queue screen. The header describes the QUEUE, because the
             queue is the whole page — a call's name and a back button here
             would both be pointing at something that is not on screen. */
          <PageHeader
            crumbs={['Review queue']}
            title="Review queue"
            meta={
              <div className="row" style={{ gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                <Badge tone="warning" icon="shieldAlert">{queue.length} waiting</Badge>
                <span style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--lh-sm)', color: 'var(--fg-tertiary)' }}>Newest first</span>
              </div>
            }
          />
        ) : (
          <PageHeader
            crumbs={['Review queue', call.channel === 'voice' ? 'Voice' : 'Messaging']}
            title={call.name}
            back={() => { setView('list'); setPane('transcript') }}
            panes={
              <div className="pane-toggle">
                <Segmented
                  value={pane}
                  onChange={setPane}
                  options={[
                    { value: 'transcript', label: call.channel === 'voice' ? 'Call' : 'Messages' },
                    { value: 'inspector', label: lowCount > 0 ? `AI · ${lowCount}` : 'AI' },
                  ]}
                />
              </div>
            }
            meta={
              /* Wraps: at 320 the status badge, the agent badge and the call id
                 are 270px of nowrap content in a 246px column, and the id ran
                 off the screen. .page-meta already wrapped — this inner row,
                 which holds all three, did not. */
              <div className="row" style={{ gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                {call.status === 'needs-review' && <Badge tone="warning" icon="shieldAlert">Needs review</Badge>}
                {call.status === 'auto-resolved' && <Badge tone="success" icon="check">Done by the AI</Badge>}
                {call.status === 'escalated' && <Badge tone="danger" icon="handoff">Passed on</Badge>}
                {isLive && <Badge tone="info" dot live>Live now</Badge>}
                <Badge tone="ai" icon="bot">{call.agent}</Badge>
                <span className="mono" style={{ color: 'var(--fg-tertiary)' }}>{call.id}</span>
              </div>
            }
            actions={
              <>
                <IconButton icon="undo" bordered tip="Reopen call" />
                <IconButton icon="more" bordered tip="More" />
                <Button icon="handoff">{isLive ? 'Take over' : 'Assign to a person'}</Button>
              </>
            }
          />
        )}
      >
        {/* ---------- queue ---------- */}
        <div className="queue">
          <div className="queue-toolbar">
            <div className="segmented">
              {/* Same source as the nav badge and the phone page header — see
                  queueCounts. This tab is the filter that is on, so its count
                  is the length of the list directly underneath it. */}
              <button aria-pressed>Needs review<span style={{ marginLeft: 'var(--space-2)', color: 'var(--fg-tertiary)' }}>{queueCounts.waiting}</span></button>
              <button>All</button>
            </div>
            <span className="grow" />
            <IconButton icon="filter" size="sm" tip="Filter" />
            <IconButton icon="refresh" size="sm" tip="Refresh" />
          </div>
          <div className="queue-list">
            {queue.map(q => (
              <button key={q.id} className="qitem" data-selected={q.id === selected} onClick={() => { setSelected(q.id); setView('detail'); setPane('transcript') }}>
                <div className="qitem-top">
                  <Avatar label={q.initials} kind={q.initials === '?' ? undefined : 'human'} />
                  <span className="qitem-name">{q.name}</span>
                  <span className="qitem-meta">{q.ago}</span>
                </div>
                <div className="qitem-summary">
                  {q.status === 'processing' ? <span className="shimmer">{q.summary}</span> : q.summary}
                </div>
                <div className="qitem-tags">
                  <Icon name={q.channel === 'voice' ? 'phone' : 'message'} size={12} style={{ color: 'var(--fg-disabled)' }} />
                  {q.status === 'processing'
                    ? <Badge tone="info" dot live>Transcribing</Badge>
                    : <ConfidencePill score={q.score} />}
                  {q.status === 'escalated' && <Badge tone="danger" icon="handoff">Passed on</Badge>}
                  {q.status === 'auto-resolved' && <Badge tone="success" icon="check">Done by AI</Badge>}
                  {q.flags > 0 && <Badge tone="neutral" icon="shieldAlert">{q.flags}</Badge>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ---------- stage ---------- */}
        <div className="stage">
          <div className="stage-scroll" key={call.id}>
            {call.banner && (
              <div className="eventline" data-tone={call.banner.tone === 'success' ? 'info' : call.banner.tone} style={{ marginBottom: 'var(--space-7)', padding: 'var(--space-5) var(--space-6)' }}>
                <Icon name={call.banner.icon} size={14} />
                <span>
                  <b style={{ fontWeight: 'var(--weight-semibold)' }}>{call.banner.title}.</b> {call.banner.body}
                </span>
              </div>
            )}

            <Card style={{ marginBottom: 'var(--space-8)' }}>
              <div className="callcard">
                {call.channel === 'voice' ? (
                  <div className="transport">
                    <IconButton icon={playing ? 'pause' : 'play'} bordered tip={playing ? 'Pause' : 'Play recording'} disabled={isLive} onClick={() => setPlaying(p => !p)} />
                    {/* fixed 34px so the waveform never shifts as the clock ticks */}
                    <span className="mono tnum" style={{ color: 'var(--fg-tertiary)', width: 34 }}>
                      {`${Math.floor(at / 60)}:${String(at % 60).padStart(2, '0')}`}
                    </span>
                    <Waveform
                      progress={progress}
                      onSeek={setProgress}
                      seed={call.id.charCodeAt(5) * 3}
                      flagAt={lowCount > 0 ? FLAG_SPAN : null}
                    />
                    <span className="mono tnum" style={{ color: 'var(--fg-tertiary)' }}>{call.duration}</span>
                  </div>
                ) : (
                  <div className="transport" style={{ gap: 'var(--space-4)' }}>
                    <Icon name="message" size={16} style={{ color: 'var(--fg-tertiary)' }} />
                    <span style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--lh-md)', color: 'var(--fg-secondary)' }}>SMS thread · {call.turns.length} messages</span>
                  </div>
                )}
                <div className="callstats">
                  <div className="callstat"><span className="callstat-k">Outcome</span><span className="callstat-v">{call.outcome}</span></div>
                  <div className="callstat"><span className="callstat-k">Handled</span><span className="callstat-v">{call.containment}</span></div>
                  <div className="callstat"><span className="callstat-k">Cost</span><span className="callstat-v">{call.cost}</span></div>
                </div>
              </div>
            </Card>

            <div className="row" style={{ gap: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>
              <SectionLabel>{call.channel === 'voice' ? 'Transcript' : 'Messages'}</SectionLabel>
              <Divider className="grow" style={{ flex: 1 }} />
              <span style={{ fontSize: 'var(--text-xs)', lineHeight: 'var(--lh-xs)', color: 'var(--fg-tertiary)' }}>Card + phone numbers hidden</span>
              <IconButton className="tip-end" icon="eye" size="sm" tip="Show hidden values" />
            </div>

            <Transcript turns={call.turns} customer={call.name} channel={call.channel} />

            {isLive && (
              <div className="turn" style={{ paddingTop: 'var(--space-6)' }}>
                <div className="turn-t" />
                <Avatar label="?" size="sm" />
                <div className="turn-body col" style={{ gap: 'var(--space-3)' }}>
                  <Skeleton w="72%" h={10} />
                  <Skeleton w="48%" h={10} />
                </div>
              </div>
            )}
            <div style={{ height: 'var(--space-11)' }} />
          </div>
        </div>

        {/* Only paints at md–lg, where the inspector is a sheet over the
            transcript. Below that it is a full pane with nothing behind it; at
            xl it is a column and there is nothing to dismiss. */}
        {pane === 'inspector' && (
          <button className="insp-scrim" aria-label="Close the AI panel" onClick={() => setPane('transcript')} />
        )}

        {/* ---------- inspector ---------- */}
        <aside className="inspector">
          <div className="inspector-scroll">
            <div className="insp-section">
              <div className="insp-head">
                <Icon name="sparkle" size={16} style={{ color: 'var(--ai-fg)' }} />
                <span className="card-title grow">What the AI heard</span>
                {lowCount > 0 && <Badge tone="danger">{lowCount} shaky</Badge>}
                {done && lowCount === 0 && <Badge tone="success" icon="check">All clear</Badge>}
              </div>
              <div data-coach="fields">
                {fields.map(f => (
                  f.pending ? (
                    <div className="fieldrow" key={f.label}>
                      <div className="fieldrow-label">{f.label}</div>
                      <div className="fieldrow-value row" style={{ gap: 'var(--space-3)', color: 'var(--fg-tertiary)', fontWeight: 'var(--weight-regular)' }}>
                        <Icon name="refresh" size={12} className="spin" />Still listening…
                      </div>
                      <span style={{ fontSize: 'var(--text-xs)', lineHeight: 'var(--lh-xs)', color: 'var(--fg-disabled)' }}>—</span>
                    </div>
                  ) : (
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
                            style={{ height: 'var(--control-h-sm)' }}
                            onBlur={e => {
                              setEdits(s => ({ ...s, [call.id]: { ...(s[call.id] ?? {}), [f.label]: e.target.value } }))
                              setEditing(null)
                            }}
                            onKeyDown={e => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                          />
                        ) : f.score === null ? (
                          <span style={{ color: 'var(--fg-disabled)', fontStyle: 'italic', fontWeight: 'var(--weight-regular)' }}>{f.value || 'Not asked'}</span>
                        ) : f.score === 1 ? (
                          <span className="row" style={{ gap: 'var(--space-3)' }}>{f.value}<Badge tone="info" icon="edit">You changed this</Badge></span>
                        ) : f.value
                      }
                      actions={<IconButton icon="edit" size="sm" tip="Change it" onClick={() => setEditing(f.label)} />}
                    />
                  )
                ))}
              </div>
            </div>

            <div className="insp-section" style={{ paddingBottom: 'var(--space-2)' }}>
              <div className="insp-head">
                <Icon name="layers" size={16} style={{ color: 'var(--fg-tertiary)' }} />
                <span className="card-title grow">What it wants to do</span>
                {gated && <Badge tone="warning">Needs you</Badge>}
                {blocked > 0 && <Badge tone="neutral" icon="lock">{blocked} not allowed</Badge>}
                {!gated && blocked === 0 && call.proposals.length > 0 && <Badge tone="success" icon="check">All done</Badge>}
              </div>

              {call.proposals.length === 0 ? (
                <EmptyState
                  icon="clock"
                  title="Nothing proposed yet"
                  body="The agent is still on the call. Actions appear here the moment it commits to one."
                />
              ) : (
                call.proposals.map(p => <ProposalCard key={p.title} p={p} onApprove={() => setDrawer(true)} />)
              )}
            </div>

            <div className="insp-section">
              <div className="insp-head" data-coach="log">
                <Icon name="clock" size={16} style={{ color: 'var(--fg-tertiary)' }} />
                <span className="card-title grow">Log</span>
                <IconButton className="tip-end" icon="external" size="sm" tip="Open full log" />
              </div>
              <div style={{ padding: '0 var(--space-7) var(--space-6)' }}>
                {call.audit.map(a => (
                  <div className="row" key={a.t} style={{ gap: 'var(--space-4)', padding: 'var(--space-2) 0', fontSize: 'var(--text-sm)', lineHeight: 'var(--lh-sm)' }}>
                    <span className="mono" style={{ color: 'var(--fg-disabled)' }}>{a.t}</span>
                    <span style={{ color: 'var(--fg-secondary)' }}>{a.what}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="actionbar">
            {isLive ? (
              <>
                <Button variant="ghost" size="sm" icon="eye">Listen in</Button>
                <span className="grow" />
                <Button variant="primary" size="sm" icon="handoff">Take over</Button>
              </>
            ) : done ? (
              <>
                <Button variant="ghost" size="sm" icon="alert">Flag this</Button>
                <span className="grow" />
                <Button variant="secondary" size="sm" icon="check" onClick={() => setToast(`${call.id} marked as spot-checked`)}>Looks right<Kbd>⏎</Kbd></Button>
              </>
            ) : call.status === 'escalated' ? (
              <>
                <Button variant="ghost" size="sm">Reject</Button>
                <span className="grow" />
                <Button variant="primary" size="sm" icon="handoff">Open handover</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" icon="handoff">Pass to a person</Button>
                <span className="grow" />
                <Button variant="secondary" size="sm">Reject<Kbd>R</Kbd></Button>
                <Button variant="primary" size="sm" icon="check" data-coach="approve" disabled={!gated} onClick={() => setDrawer(true)}>Approve all<Kbd>⏎</Kbd></Button>
              </>
            )}
          </div>
        </aside>
      </ProductShell>

      {drawer && gated && (
        <ApproveDrawer call={call} gated={gated} onClose={() => setDrawer(false)} onConfirm={amt => approve(amt)} />
      )}

      {coach && invite && coachMode !== 'tour' && (
        <div className="explorer-float tour-invite">
          <Icon name="sparkle" size={14} />
          <span className="tour-invite-copy">First time here? Take the 30-second tour.</span>
          <Button size="sm" variant="primary" onClick={() => { setCoachMode('tour'); setInvite(false) }}>
            Show me around
          </Button>
          <IconButton icon="x" size="sm" aria-label="Dismiss" onClick={() => setInvite(false)} />
        </div>
      )}

      {coach && (
        <CoachMarks
          steps={CORE_STEPS}
          mode={coachMode}
          onExit={() => setCoachMode('pins')}
          onMode={setCoachMode}
        />
      )}

      {coach && coachMode === 'pins' && (
        <div className="explorer-float pins-hint">
          <span className="coach-mark" style={{ position: 'static', transform: 'none', width: 'var(--control-h-2xs)', height: 'var(--control-h-2xs)', boxShadow: 'none' }}>1</span>
          Click a numbered dot, or <Kbd>?</Kbd> for the tour · <Kbd>H</Kbd> hides these
        </div>
      )}

      {toast && (
        <div className="toast-layer">
          <div className="toast">
            <Icon name="checkCircle" size={16} style={{ color: 'var(--fg-success-inverse)' }} />
            {toast}
            <button onClick={() => setToast(null)}>Undo</button>
          </div>
        </div>
      )}
    </>
  )
}
