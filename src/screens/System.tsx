import { useState } from 'react'
import {
  Badge, Button, Card, CardHeader, ConfidencePill, Divider, EmptyState, FieldRow,
  Icon, IconButton, Kbd, Segmented, SectionLabel, Skeleton, Switch, Avatar, ICON_NAMES,
} from '../ds'

const RAMPS = [
  ['Ink (neutral)', ['ink-0', 'ink-25', 'ink-50', 'ink-100', 'ink-150', 'ink-200', 'ink-300', 'ink-400', 'ink-500', 'ink-600', 'ink-700', 'ink-800', 'ink-900', 'ink-950']],
  ['Signal (brand)', ['signal-50', 'signal-100', 'signal-200', 'signal-300', 'signal-400', 'signal-500', 'signal-600', 'signal-700', 'signal-800', 'signal-900']],
  ['Green', ['green-50', 'green-100', 'green-500', 'green-600', 'green-700']],
  ['Amber', ['amber-50', 'amber-100', 'amber-500', 'amber-600', 'amber-700']],
  ['Red', ['red-50', 'red-100', 'red-500', 'red-600', 'red-700']],
  ['Blue', ['blue-50', 'blue-100', 'blue-500', 'blue-600', 'blue-700']],
  ['Violet (AI)', ['violet-50', 'violet-100', 'violet-500', 'violet-600']],
] as const

const TYPE = [
  ['4xl / 40', 'text-4xl', 'lh-4xl', 600, 'Page title'],
  ['3xl / 30', 'text-3xl', 'lh-3xl', 600, 'Chapter title'],
  ['2xl / 23', 'text-2xl', 'lh-2xl', 600, 'Section'],
  ['xl / 19',  'text-xl',  'lh-xl',  600, 'Lede, page header'],
  ['lg / 16',  'text-lg',  'lh-lg',  600, 'Card title, prose'],
  ['base / 14','text-base','lh-base',400, 'Transcript, long text'],
  ['md / 13',  'text-md',  'lh-md',  400, 'UI default — body, controls'],
  ['sm / 12',  'text-sm',  'lh-sm',  400, 'Secondary, metadata'],
  ['xs / 11',  'text-xs',  'lh-xs',  500, 'Badges, timestamps'],
  ['2xs / 10', 'text-2xs', 'lh-2xs', 600, 'Overline labels'],
] as const

function Block({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 'var(--space-12)' }}>
      <div style={{ marginBottom: 'var(--space-7)' }}>
        <h2 style={{ marginTop: 0, fontSize: 'var(--text-xl)' }}>{title}</h2>
        {sub && <p style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--lh-md)', marginTop: 'var(--space-3)' }}>{sub}</p>}
      </div>
      {children}
    </section>
  )
}

export function System() {
  const [seg, setSeg] = useState<'a' | 'b'>('a')
  const [on, setOn] = useState(true)

  return (
    <div className="doc" style={{ maxWidth: 1240 }}>
      <h1 style={{ fontSize: 'var(--text-3xl)', lineHeight: 'var(--lh-3xl)' }}>Design system</h1>
      <p className="lede" style={{ marginTop: 'var(--space-5)' }}>
        Two tiers. Primitives hold raw values and are never used in a component; semantic aliases are the
        only thing components consume. Dark mode redefines the alias tier and nothing else — flip the theme
        in the top-right and every screen in this file follows.
      </p>

      <Block title="Colour primitives" sub="Fourteen-step neutral because dense data UI needs three usable borders and three usable surfaces before you reach text.">
        <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
          {RAMPS.map(([name, steps]) => (
            <div key={name}>
              <div className="section-label" style={{ marginBottom: 'var(--space-3)' }}>{name}</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {steps.map(s => (
                  <div key={s} className="tip" data-tip={`--${s}`} style={{ flex: 1 }}>
                    <div style={{ height: 44, borderRadius: 'var(--radius-sm)', background: `var(--${s})`, border: '1px solid var(--border-subtle)', width: '100%' }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Confidence scale" sub="The load-bearing token group. One hue per band, applied identically wherever uncertainty appears — field rows, transcript spans, queue items, proposals.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-6)' }}>
          {[['High', '≥ 0.85', 0.94, 'conf-high'], ['Medium', '0.60 – 0.84', 0.71, 'conf-medium'], ['Low', '< 0.60', 0.52, 'conf-low'], ['No signal', 'not attempted', null, 'conf-none']].map(([label, range, score, tok]) => (
            <Card key={label as string}>
              <div style={{ padding: 'var(--space-6)' }}>
                <div style={{ height: 4, borderRadius: 2, background: `var(--${tok}-solid)`, marginBottom: 'var(--space-5)' }} />
                <div className="row" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                  <span style={{ fontSize: 'var(--text-base)', fontWeight: 600 }}>{label as string}</span>
                  <span className="grow" />
                  <ConfidencePill score={score as number | null} />
                </div>
                <div className="mono" style={{ color: 'var(--fg-tertiary)' }}>{range as string}</div>
              </div>
            </Card>
          ))}
        </div>
      </Block>

      <Block title="Type scale" sub="Inter, 13px UI default. Ten steps — anything denser than 10px is a legibility bug, anything sparser is a marketing site.">
        <Card>
          {TYPE.map(([label, size, lh, weight, use], i) => (
            <div key={label} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 190px', gap: 'var(--space-8)', alignItems: 'baseline', padding: 'var(--space-5) var(--space-7)', borderTop: i ? '1px solid var(--border-subtle)' : undefined }}>
              <span className="mono" style={{ color: 'var(--fg-tertiary)' }}>{label}</span>
              <span style={{ fontSize: `var(--${size})`, lineHeight: `var(--${lh})`, fontWeight: weight, letterSpacing: 'var(--tracking-snug)' }}>Escalate to a human</span>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-tertiary)', textAlign: 'right' }}>{use}</span>
            </div>
          ))}
        </Card>
      </Block>

      <Block title="Space & radius" sub="4pt base with 2/6/10 half-steps for control interiors. Radius climbs with surface size so a 20px badge never shares a corner with a 460px drawer.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
          <Card>
            <CardHeader title="Space" />
            <div style={{ padding: 'var(--space-7)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(n => (
                <div key={n} className="row" style={{ gap: 'var(--space-6)' }}>
                  <span className="mono" style={{ width: 66, color: 'var(--fg-tertiary)' }}>space-{n}</span>
                  <div style={{ width: `var(--space-${n})`, height: 10, background: 'var(--signal-400)', borderRadius: 2 }} />
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHeader title="Radius & elevation" />
            <div style={{ padding: 'var(--space-7)', display: 'flex', flexDirection: 'column', gap: 'var(--space-7)' }}>
              <div className="row" style={{ gap: 'var(--space-5)' }}>
                {['xs', 'sm', 'md', 'lg', 'xl', '2xl'].map(r => (
                  <div key={r} className="tip" data-tip={`--radius-${r}`} style={{ flex: 1 }}>
                    <div style={{ height: 48, borderRadius: `var(--radius-${r})`, background: 'var(--bg-sunken)', border: '1px solid var(--border-default)' }} />
                  </div>
                ))}
              </div>
              <Divider />
              <div className="row" style={{ gap: 'var(--space-7)' }}>
                {[1, 2, 3, 4].map(s => (
                  <div key={s} className="tip" data-tip={`--shadow-${s}`} style={{ flex: 1 }}>
                    <div style={{ height: 48, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', boxShadow: `var(--shadow-${s})` }} />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </Block>

      <Block title="Components" sub="Every element on the core screen comes from here. Nothing on that screen is a one-off.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
          <Card>
            <CardHeader title="Button" sub="6 variants × 3 sizes" />
            <div style={{ padding: 'var(--space-7)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <div className="row" style={{ gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <Button variant="primary" icon="check">Approve</Button>
                <Button variant="secondary">Reject</Button>
                <Button variant="ghost" icon="handoff">Escalate</Button>
              </div>
              <div className="row" style={{ gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <Button variant="danger" icon="x">Delete</Button>
                <Button variant="dangerSubtle" icon="x">Deny</Button>
                <Button variant="successSubtle" icon="check">Accept</Button>
              </div>
              <div className="row" style={{ gap: 'var(--space-4)' }}>
                <Button size="sm" variant="primary">Small</Button>
                <Button size="md" variant="primary">Medium</Button>
                <Button size="lg" variant="primary">Large</Button>
              </div>
              <div className="row" style={{ gap: 'var(--space-4)' }}>
                <Button variant="primary" loading>Approving</Button>
                <Button variant="secondary" disabled>Disabled</Button>
                <Button variant="secondary">Reject<Kbd>R</Kbd></Button>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Badge & status" sub="7 tones, subtle + solid" />
            <div style={{ padding: 'var(--space-7)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <div className="row" style={{ gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                <Badge tone="neutral">Neutral</Badge>
                <Badge tone="accent">Accent</Badge>
                <Badge tone="success" icon="check">Auto-resolved</Badge>
                <Badge tone="warning" icon="shieldAlert">Needs review</Badge>
                <Badge tone="danger" icon="handoff">Escalated</Badge>
                <Badge tone="info" icon="edit">Edited</Badge>
                <Badge tone="ai" icon="bot">Concierge v4.2</Badge>
              </div>
              <div className="row" style={{ gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                <Badge tone="success" dot live>Agents healthy</Badge>
                <Badge tone="info" dot live>Live</Badge>
                <Badge tone="danger" solid>3</Badge>
                <Badge tone="accent" solid icon="check">Shipped</Badge>
              </div>
              <Divider />
              <div className="row" style={{ gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <ConfidencePill score={0.99} /><ConfidencePill score={0.71} /><ConfidencePill score={0.52} /><ConfidencePill score={null} />
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Field row" sub="The atom of the inspector" />
            <FieldRow label="Order" value="A-88421" score={0.99} actions={<IconButton icon="edit" size="sm" tip="Override" />} />
            <FieldRow label="Sentiment" value="Mildly negative" score={0.71} flag="medium" actions={<IconButton icon="edit" size="sm" tip="Override" />} />
            <FieldRow label="Damage type" value="Physical — unverified" score={0.52} flag="true" cite="it's cosmetic-ish? Hard to say" actions={<IconButton icon="edit" size="sm" tip="Override" />} />
            <FieldRow label="Callback consent" value={<span style={{ color: 'var(--fg-disabled)', fontStyle: 'italic', fontWeight: 400 }}>Not asked</span>} score={null} />
          </Card>

          <Card>
            <CardHeader title="Controls & feedback" />
            <div style={{ padding: 'var(--space-7)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <div className="row" style={{ gap: 'var(--space-5)' }}>
                <Segmented value={seg} onChange={setSeg} options={[{ value: 'a', label: 'Needs review' }, { value: 'b', label: 'All' }]} />
                <Switch checked={on} onChange={setOn} />
                <IconButton icon="filter" bordered tip="Filter" />
                <IconButton icon="play" bordered tip="Play" />
                <Avatar label="AT" /><Avatar label="" kind="ai" /><Avatar label="TR" kind="human" />
              </div>
              <input className="input" placeholder="Search calls, contacts, agents…" />
              <div className="col" style={{ gap: 'var(--space-4)' }}>
                <Skeleton w="72%" h={10} /><Skeleton w="54%" h={10} />
              </div>
              <div className="eventline" data-tone="warning"><Icon name="alert" size={13} /><span>Extraction degraded — action proposals paused.</span></div>
            </div>
          </Card>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
          <Card><CardHeader title="Empty state" /><EmptyState icon="checkCircle" title="Queue clear" body="47 calls handled by agents in the last hour, none needed you." action={<Button size="sm" variant="secondary" icon="chart">View agent activity</Button>} /></Card>
          <Card>
            <CardHeader title="Icons" sub={`${ICON_NAMES.length} · 16px grid, 1.4 stroke, round caps`} />
            <div style={{ padding: 'var(--space-7)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(34px, 1fr))', gap: 'var(--space-3)' }}>
              {ICON_NAMES.map(n => (
                <div key={n} className="tip" data-tip={n} style={{ display: 'grid', placeItems: 'center', height: 34, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', color: 'var(--fg-secondary)' }}>
                  <Icon name={n} size={16} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Block>

      <Block title="Rules the system enforces">
        <div>
          {[
            ['Confidence never appears without a band', 'A raw number alone is ambiguous. The pill always carries the meter, the colour and the digit together.'],
            ['Gated ≠ disabled', 'A blocked action keeps a live primary button that opens the approval. Disabling it would tell the operator to give up.'],
            ['Absence is styled', 'Fields the model did not attempt use grey italic prose, never 0% or an empty cell — both read as failure.'],
            ['Destructive gets a footer, not a dialog', 'Commit language names the thing: “Approve $89.40”, never “OK”.'],
            ['One accent', 'Signal indigo is reserved for the primary path and selection. Everything else earns colour only by carrying meaning.'],
          ].map(([t, b]) => (
            <div key={t} style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 'var(--space-8)', padding: 'var(--space-6) 0', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>{t}</div>
              <div style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--lh-md)', color: 'var(--fg-secondary)' }}>{b}</div>
            </div>
          ))}
        </div>
      </Block>

      <div style={{ height: 'var(--space-13)' }} />
    </div>
  )
}
