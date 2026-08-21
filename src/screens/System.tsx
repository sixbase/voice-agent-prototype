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

/* SIX of these ten steps move with the screen, so six of them state a range
   rather than a number they would only be telling the truth about at one width.
   The four display steps are clamp()ed between a phone value and the design
   value. The bottom two are not fluid — they JUMP: --text-xs and --text-2xs
   both step up to 12px on a phone (see the RESPONSIVE TOKEN LADDER in app.css),
   which is why "xs / 11" and "2xs / 10" were wrong on the device this case
   study gets opened on first. The specimen column renders at the live size, so
   the table can always be checked against the page it is printed on. */
const TYPE = [
  ['4xl / 28–40', 'text-4xl', 'lh-4xl', 600, 'Page title'],
  ['3xl / 24–30', 'text-3xl', 'lh-3xl', 600, 'Chapter title'],
  ['2xl / 20–23', 'text-2xl', 'lh-2xl', 600, 'Section'],
  ['xl / 17–19',  'text-xl',  'lh-xl',  600, 'Lede, page header'],
  ['lg / 16',  'text-lg',  'lh-lg',  600, 'Card title, prose'],
  ['base / 14','text-base','lh-base',400, 'Transcript, long text'],
  ['md / 13',  'text-md',  'lh-md',  400, 'UI default — body, controls'],
  ['sm / 12',  'text-sm',  'lh-sm',  400, 'Secondary, metadata'],
  ['xs / 11–12',  'text-xs',  'lh-xs',  500, 'Badges, timestamps'],
  ['2xs / 10–12', 'text-2xs', 'lh-2xs', 600, 'Overline labels'],
] as const

function Block({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 'var(--doc-gap-section)' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h2 style={{ margin: 0 }}>{title}</h2>
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
    <div className="doc doc--sub">
      <h1>Nothing here is a one-off.</h1>
      <p className="lede">
Every screen in this case study is made from the parts below. They come in two layers: raw colours underneath, and names on top like “danger” or “background”. Nothing ever reaches for a raw colour — it asks for the name. Which is why dark mode was one layer changing, not a redesign.
      </p>

      <Block title="The raw colours" sub="Fourteen greys. That sounds like a lot, but a busy screen needs three kinds of line and three kinds of background before you even get to the words.">
        <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
          {RAMPS.map(([name, steps]) => (
            <div key={name}>
              <div className="section-label" style={{ marginBottom: 'var(--space-3)' }}>{name}</div>
              <div className="specimens" style={{ display: 'flex', gap: 'var(--space-2)' }}>
                {steps.map(s => (
                  /* tabIndex is what makes this tip reachable at all without a
                     mouse: .tip shows on :hover or :focus-within, and a swatch
                     wraps a plain div with nothing focusable inside it — so on
                     a phone every token name on this page was unreadable.
                     -1 rather than 0 on purpose: a tap focuses it, but a
                     hundred specimen tiles do not become a hundred tab stops
                     between the reader and the rest of the chapter. */
                  <div key={s} className="tip" data-tip={`--${s}`} tabIndex={-1} role="note" aria-label={`--${s}`} style={{ flex: 1 }}>
                    {/* 48px demo tile — same height as the radius and shadow tiles below. */}
                    <div style={{ height: 'var(--space-12)', borderRadius: 'var(--radius-sm)', background: `var(--${s})`, border: '1px solid var(--border-subtle)', width: '100%' }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Block>

      <Block title="How sure is it?" sub="The most important set here. One colour for each step, and it means the same thing everywhere you see it.">
        <div className="doc-grid-4">
          {[['High', '≥ 0.85', 0.94, 'conf-high'], ['Medium', '0.60 – 0.84', 0.71, 'conf-medium'], ['Low', '< 0.60', 0.52, 'conf-low'], ['No signal', 'not attempted', null, 'conf-none']].map(([label, range, score, tok]) => (
            <Card key={label as string}>
              <div style={{ padding: 'var(--space-6)' }}>
                <div style={{ height: 'var(--space-2)', borderRadius: 'var(--radius-2xs)', background: `var(--${tok}-solid)`, marginBottom: 'var(--space-5)' }} />
                <div className="row" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                  <span style={{ fontSize: 'var(--text-base)', lineHeight: 'var(--lh-base)', fontWeight: 'var(--weight-semibold)' }}>{label as string}</span>
                  <span className="grow" />
                  <ConfidencePill className="tip-end" score={score as number | null} />
                </div>
                <div className="mono" style={{ color: 'var(--fg-tertiary)' }}>{range as string}</div>
              </div>
            </Card>
          ))}
        </div>
      </Block>

      {/* The sub-line gained its second sentence in the mobile-first rebuild:
          the four display steps became clamp()ed ranges and the bottom two step
          up on a phone, so a caption promising ten fixed numbers had stopped
          being true. The specimens render at the live size, so this table
          always agrees with the page you are reading it on. */}
      <Block title="Text sizes" sub="Inter. 13px for UI. Ten sizes, no more. Six of them move with the screen: the four display steps slide across the range shown, and xs and 2xs both jump to 12px on a phone — the floor — where they merge with sm. The specimens render at the live size, so this table always matches the screen you are reading it on.">
        <Card>
          {TYPE.map(([label, size, lh, weight, use], i) => (
            /* Three fixed columns are what makes a specimen table readable —
               the sizes have to line up to be compared. Below md there is no
               room for three, so the row stacks: name, specimen, use. */
            <div key={label} className="specrow" style={{ borderTop: i ? '1px solid var(--border-subtle)' : undefined }}>
              <span className="mono specrow-k">{label}</span>
              <span style={{ fontSize: `var(--${size})`, lineHeight: `var(--${lh})`, fontWeight: weight, letterSpacing: 'var(--tracking-snug)' }}>Pass this to a person</span>
              <span className="specrow-use">{use}</span>
            </div>
          ))}
        </Card>
      </Block>

      <Block title="Space & radius" sub="Gaps go up in steps of 4. Corners get rounder as things get bigger.">
        <div className="doc-grid-2">
          <Card>
            <CardHeader title="Space" />
            <div style={{ padding: 'var(--space-7)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(n => (
                <div key={n} className="row" style={{ gap: 'var(--space-6)' }}>
                  {/* 66px fixed: a specimen list needs one stable label column */}
                  <span className="mono ruler-k">space-{n}</span>
                  <div style={{ width: `var(--space-${n})`, height: 'var(--space-5)', background: 'var(--accent-bg)', borderRadius: 'var(--radius-2xs)' }} />
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHeader title="Radius & elevation" />
            <div style={{ padding: 'var(--space-7)', display: 'flex', flexDirection: 'column', gap: 'var(--space-7)' }}>
              <div className="row" style={{ gap: 'var(--space-5)' }}>
                {/* width:100% is not decoration — .tip is an inline-flex box, so a
                    tile with no width of its own is a flex item whose base size
                    is its (empty) content. These two specimen rows were drawing
                    at 2px and 0px wide at every viewport. */}
                {['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'].map(r => (
                  <div key={r} className="tip" data-tip={`--radius-${r}`} tabIndex={-1} role="note" aria-label={`--radius-${r}`} style={{ flex: 1 }}>
                    <div style={{ width: '100%', height: 'var(--space-12)', borderRadius: `var(--radius-${r})`, background: 'var(--bg-sunken)', border: '1px solid var(--border-default)' }} />
                  </div>
                ))}
              </div>
              <Divider />
              <div className="row" style={{ gap: 'var(--space-7)' }}>
                {[1, 2, 3, 4].map(s => (
                  <div key={s} className="tip" data-tip={`--shadow-${s}`} tabIndex={-1} role="note" aria-label={`--shadow-${s}`} style={{ flex: 1 }}>
                    <div style={{ width: '100%', height: 'var(--space-12)', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', boxShadow: `var(--shadow-${s})` }} />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </Block>

      <Block title="Components" sub="Every part of the real screen is made from these. Nothing is a one-off.">
        <div className="doc-grid-2">
          <Card>
            <CardHeader title="Button" sub="6 variants × 3 sizes" />
            <div style={{ padding: 'var(--space-7)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <div className="row" style={{ gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <Button variant="primary" icon="check">Approve</Button>
                <Button variant="secondary">Reject</Button>
                <Button variant="ghost" icon="handoff">Pass to a person</Button>
              </div>
              <div className="row" style={{ gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <Button variant="danger" icon="x">Delete</Button>
                <Button variant="dangerSubtle" icon="x">Deny</Button>
                <Button variant="successSubtle" icon="check">Accept</Button>
              </div>
              <div className="row" style={{ gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <Button size="sm" variant="primary">Small</Button>
                <Button size="md" variant="primary">Medium</Button>
                <Button size="lg" variant="primary">Large</Button>
              </div>
              <div className="row" style={{ gap: 'var(--space-4)', flexWrap: 'wrap' }}>
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
                <Badge tone="danger" icon="handoff">Passed on</Badge>
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
              <div className="row specimens" style={{ gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <ConfidencePill score={0.99} /><ConfidencePill score={0.71} /><ConfidencePill score={0.52} /><ConfidencePill score={null} />
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Field row" sub="The atom of the inspector" />
            <FieldRow label="Order" value="A-88421" score={0.99} actions={<IconButton icon="edit" size="sm" tip="Change it" />} />
            <FieldRow label="Mood" value="Mildly negative" score={0.71} flag="medium" actions={<IconButton icon="edit" size="sm" tip="Change it" />} />
            <FieldRow label="Damage type" value="Physical — unverified" score={0.52} flag="true" cite="it's cosmetic-ish? Hard to say" actions={<IconButton icon="edit" size="sm" tip="Change it" />} />
            <FieldRow label="Callback consent" value={<span style={{ color: 'var(--fg-disabled)', fontStyle: 'italic', fontWeight: 'var(--weight-regular)' }}>Not asked</span>} score={null} />
          </Card>

          <Card>
            <CardHeader title="Controls & feedback" />
            <div style={{ padding: 'var(--space-7)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              {/* Eight controls on one line is 341px of content in a 314px card
                  at 390 — the last avatar was simply cut off. */}
              <div className="row" style={{ gap: 'var(--space-5)', flexWrap: 'wrap' }}>
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
              <div className="eventline" data-tone="warning"><Icon name="alert" size={14} /><span>Extraction degraded — action proposals paused.</span></div>
            </div>
          </Card>
        </div>

        <div className="doc-grid-2" style={{ marginTop: 'var(--doc-gap-tight)' }}>
          <Card><CardHeader title="Empty state" /><EmptyState icon="checkCircle" title="Queue clear" body="47 calls handled by agents in the last hour, none needed you." action={<Button size="sm" variant="secondary" icon="chart">View agent activity</Button>} /></Card>
          <Card>
            <CardHeader title="Icons" sub={`${ICON_NAMES.length} · 16px grid, 1.4 stroke, round caps`} />
            <div style={{ padding: 'var(--space-7)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(var(--space-11), 1fr))', gap: 'var(--space-3)' }}>
              {ICON_NAMES.map(n => (
                <div key={n} className="tip" data-tip={n} tabIndex={-1} role="note" aria-label={n} style={{ display: 'grid', placeItems: 'center', height: 'var(--space-11)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', color: 'var(--fg-secondary)' }}>
                  <Icon name={n} size={16} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Block>

      {/* Last chapter, so the footer loops back instead of going forward — but
          it is the same sign-off every other chapter uses. */}
      <div className="doc-next">
        <SectionLabel>End</SectionLabel>
        <span className="grow" />
        <Button variant="secondary" icon="undo" onClick={() => (window.location.hash = 'context')}>Back to the start</Button>
      </div>
    </div>
  )
}
