import type { ReactNode } from 'react'
import { Badge, Button, Icon, SectionLabel } from '../ds'

const bar = (w: number | string, h = 6, c = 'var(--border-default)') => (
  <div style={{ width: w, height: h, borderRadius: 2, background: c }} />
)

function Wire({ children, verdict }: { children: ReactNode; verdict: 'rejected' | 'shipped' }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        height: 190, background: 'var(--bg-surface)',
        border: `1px solid ${verdict === 'shipped' ? 'var(--accent-border)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-md)', overflow: 'hidden', display: 'flex',
        boxShadow: verdict === 'shipped' ? '0 0 0 3px var(--accent-bg-subtle)' : 'var(--shadow-1)',
      }}>{children}</div>
      <div style={{ position: 'absolute', top: 8, right: 8 }}>
        {verdict === 'shipped'
          ? <Badge tone="accent" icon="check" solid>Shipped</Badge>
          : <Badge tone="neutral" icon="x">Rejected</Badge>}
      </div>
    </div>
  )
}

const OPTIONS = [
  {
    name: 'A · Full-page approval',
    verdict: 'rejected' as const,
    claim: 'Give the approval its own route. Maximum room for evidence and policy detail.',
    why: 'Killed it after the first usability pass. Reviewers work in streaks of 20+ calls; a route change per approval lost the queue, lost scroll position, and added a back-navigation to every decision. Two of five testers approved the wrong call after returning to a re-sorted list.',
    keep: 'The evidence hierarchy — proposal, then policy, then consequences — survived intact into the drawer.',
    wire: <Wire verdict="rejected">
      <div style={{ flex: 1, padding: 12, display: 'flex', flexDirection: 'column', gap: 9 }}>
        {bar(60, 5)}{bar('50%', 10)}
        <div style={{ height: 1, background: 'var(--border-subtle)' }} />
        {bar('100%', 26, 'var(--bg-inset)')}{bar('92%')}{bar('78%')}
        <span style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>{bar(30, 14)}{bar(54, 14, 'var(--signal-600)')}</div>
      </div>
    </Wire>,
  },
  {
    name: 'B · Centre modal',
    verdict: 'rejected' as const,
    claim: 'Classic confirm dialog. Cheap to build, familiar, keeps the operator in place.',
    why: 'The modal has to cover the transcript to be readable at this density — and the transcript is the evidence. Operators kept dismissing it to re-check a quote, then re-opening it, losing the amount they had typed. A confirm dialog is the right shape for a decision you have already made; this is a decision being made.',
    keep: 'Reserved the modal for genuinely evidence-free confirmations: bulk-approve, and discarding an edited draft.',
    wire: <Wire verdict="rejected">
      <div style={{ flex: 1, padding: 12, display: 'flex', flexDirection: 'column', gap: 8, filter: 'blur(1.2px)', opacity: .45 }}>
        {bar('72%')}{bar('58%')}{bar('80%')}{bar('64%')}{bar('76%')}
      </div>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '72%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, boxShadow: 'var(--shadow-3)', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {bar('56%', 7)}{bar('100%')}{bar('84%')}
        <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end', marginTop: 4 }}>{bar(26, 12)}{bar(44, 12, 'var(--signal-600)')}</div>
      </div>
    </Wire>,
  },
  {
    name: 'C · Right drawer',
    verdict: 'shipped' as const,
    claim: 'Slide over the inspector, leave the transcript visible. Commit controls pinned to a footer.',
    why: 'The only option where the operator can read the quote that justifies the refund while typing the refund amount. It also gave the approval a real footer — “Approve $89.40” instead of “OK” — which testers read aloud before clicking. Cost: 468px of width, so the transcript column has a hard 520px minimum and the app declares a 1280px floor.',
    keep: null,
    wire: <Wire verdict="shipped">
      <div style={{ flex: 1, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {bar('72%')}{bar('58%')}{bar('80%')}{bar('64%')}{bar('76%')}{bar('52%')}
      </div>
      <div style={{ width: '46%', borderLeft: '1px solid var(--border-default)', background: 'var(--bg-surface)', boxShadow: '-8px 0 24px -12px rgba(0,0,0,.3)', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {bar('64%', 7)}{bar('100%', 22, 'var(--bg-inset)')}{bar('100%', 16, 'var(--danger-bg)')}
        <span style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>{bar(24, 12)}{bar(52, 12, 'var(--signal-600)')}</div>
      </div>
    </Wire>,
  },
]

const OTHERS = [
  {
    t: 'Showing raw probabilities (0.52) instead of bands',
    rejected: 'Operators anchored on the number and started negotiating with it — “0.52 is basically half, that’s fine”. Two decimals implied a precision the extractor does not have.',
    shipped: 'Three bands with one hue each, plus the number as secondary text inside the pill. Read the colour, confirm with the digit.',
  },
  {
    t: 'Auto-selecting the highest-confidence value on conflict',
    rejected: 'Tested with a 0.61 vs 0.58 conflict. Every tester approved the pre-selected answer without reading the alternative. A near-tie is not a winner.',
    shipped: 'Present both with citations and no default. The one moment where adding a click is the correct call.',
  },
  {
    t: 'A single “Approve all” for the whole queue',
    rejected: 'It is what operators asked for, and it recreated exactly the rubber-stamping the project existed to fix.',
    shipped: 'Bulk approve exists but excludes any call with a low-confidence field or a gated money action. It clears the boring 70% and refuses to clear the rest.',
  },
  {
    t: 'Confidence colour on the transcript text itself',
    rejected: 'Colouring every agent turn by ASR confidence turned the transcript into a heat map. Nothing stood out because everything was tinted.',
    shipped: 'Only spans below the floor get the dashed underline. Roughly one per call — which is what makes it worth looking at.',
  },
]

export function Tradeoffs() {
  return (
    <div className="doc" style={{ maxWidth: 1240 }}>
      <h1 style={{ fontSize: 'var(--text-3xl)', lineHeight: 'var(--lh-3xl)' }}>Trade-offs &amp; rejected concepts</h1>
      <p className="lede" style={{ marginTop: 'var(--space-5)' }}>
        The approval surface was the contested decision. Three options went into testing with five support
        operators; here is what each cost and why the drawer won.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-8)', marginTop: 'var(--space-10)' }}>
        {OPTIONS.map(o => (
          <div key={o.name} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, letterSpacing: 'var(--tracking-snug)' }}>{o.name}</div>
            {o.wire}
            <p style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--lh-md)', color: 'var(--fg-primary)' }}>{o.claim}</p>
            <div>
              <div className="section-label" style={{ marginBottom: 'var(--space-3)' }}>{o.verdict === 'shipped' ? 'Why it won' : 'Why it lost'}</div>
              <p style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--lh-md)' }}>{o.why}</p>
            </div>
            {o.keep && (
              <div className="eventline" data-tone="info">
                <Icon name="undo" size={13} />
                <span>{o.keep}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <h2>Four smaller calls I had to defend</h2>
      <div style={{ marginTop: 'var(--space-7)', display: 'grid', gap: 'var(--space-6)' }}>
        {OTHERS.map(o => (
          <div key={o.t} style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)', overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-6) var(--space-7)', borderBottom: '1px solid var(--border-subtle)', fontSize: 'var(--text-base)', fontWeight: 600 }}>{o.t}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <div style={{ padding: 'var(--space-6) var(--space-7)', borderRight: '1px solid var(--border-subtle)' }}>
                <div className="row" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}><Icon name="xCircle" size={13} style={{ color: 'var(--danger-fg)' }} /><span className="section-label">Rejected</span></div>
                <p style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--lh-md)' }}>{o.rejected}</p>
              </div>
              <div style={{ padding: 'var(--space-6) var(--space-7)' }}>
                <div className="row" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}><Icon name="checkCircle" size={13} style={{ color: 'var(--success-solid)' }} /><span className="section-label">Shipped</span></div>
                <p style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--lh-md)' }}>{o.shipped}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2>What I would do next</h2>
      <p style={{ marginTop: 'var(--space-5)' }}>
        The drawer is right for one gated action. Three or more in a single call — which happens on ~4% of
        traffic — makes it a queue inside a queue, and the footer stops being honest about what “Approve”
        commits to. The next iteration batches gated actions into one reviewable set with a single commit,
        and I would want the confidence bands re-calibrated per policy rather than shared globally.
      </p>

      <div className="row" style={{ gap: 'var(--space-5)', marginTop: 'var(--space-10)' }}>
        <SectionLabel>Next</SectionLabel>
        <span className="grow" />
        <Button variant="primary" iconEnd="arrowRight" onClick={() => (window.location.hash = 'system')}>The design system</Button>
      </div>
    </div>
  )
}
