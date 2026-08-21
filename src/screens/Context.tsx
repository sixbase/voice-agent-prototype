import { Badge, Button, Card, Icon, SectionLabel } from '../ds'

/* Two bands, not one column.
   The pitch was running down a 58ch measure with half the viewport empty
   beside it, and the note that says who this is for had been pushed BELOW the
   "Next" button — the one place a reader has already left. So the aside now
   rides alongside the pitch: who I am, how to reach me, and who this was made
   for, all visible without scrolling. */

const RULES = [
  { n: '01', t: 'If it is guessing, make it look like guessing', b: 'Not sure goes red — the same red, every time, everywhere.' },
  { n: '02', t: 'Never just go quiet', b: 'If it cannot do a thing, it says so, says why, and hands it to a person.' },
  { n: '03', t: 'Let people fix it, not just refuse it', b: 'Change any answer where it sits. Your fix teaches the AI.' },
]

export function Context() {
  return (
    <div className="doc">
      <div className="row" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-7)', flexWrap: 'wrap' }}>
        <Badge tone="ai" icon="sparkle" size="lg">AI voice agent</Badge>
        <Badge tone="neutral" size="lg">B2B SaaS</Badge>
        <Badge tone="neutral" size="lg">Human in the loop</Badge>
        <Badge tone="info" icon="info" size="lg">Concept</Badge>
      </div>

      <div className="pitch">
        <div className="pitch-main">
          <h1 style={{ maxWidth: '20ch' }}>
            The hard part isn't the 93 calls it gets <em style={{ fontStyle: 'normal', color: 'var(--fg-brand)' }}>right</em>.
          </h1>

          <p className="lede" style={{ maxWidth: '46ch' }}>
            It's the 7 it doesn't — and the AI can't tell you which.
          </p>

          <p className="doc-block" style={{ maxWidth: '54ch' }}>
            Relay's AI answers support calls on its own. Before it moves money or changes an order,
            a person has to say yes. That screen is this project, and it has one real job: make
            doubt visible. Miss it and you either wave everything through, or listen to every call
            yourself. One is risky. The other means the AI saved you nothing.
          </p>
        </div>

        <aside className="pitch-aside">
          <div className="contact">
            <div className="contact-who">
              {/* Hides itself if the file is missing, so a broken-image icon can
                  never be the first thing on the landing page. */}
              <img
                className="contact-photo"
                /* BASE_URL, not a leading slash. This deploys to a project
                   page at /voice-agent-prototype/, where "/alvin.jpg" resolves
                   against the DOMAIN root and 404s — and the onError below then
                   hid it silently, so it worked locally and vanished live. */
                src={`${import.meta.env.BASE_URL}alvin.jpg`}
                alt="Alvin Thong"
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
              <div>
                <div className="contact-name">Alvin Thong</div>
                <div className="contact-role">Product designer. I design AI and enterprise interfaces, and I build them.</div>
              </div>
            </div>
            <div className="contact-links">
              <a className="contact-link" href="https://www.upwork.com/freelancers/alvinsixbase" target="_blank" rel="noreferrer">
                <Icon name="external" size={14} />Upwork
              </a>
              <a className="contact-link" href="mailto:alvin@sixbase.com">
                <Icon name="message" size={14} />alvin@sixbase.com
              </a>
              <a className="contact-link" href="https://github.com/sixbase" target="_blank" rel="noreferrer">
                <Icon name="layers" size={14} />github.com/sixbase
              </a>
            </div>
          </div>

          <p className="doc-note">
            <Icon name="info" size={13} />
            <span>
              <b style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--fg-secondary)' }}>
                Hi Tanvi — I built this for your Senior Product Designer (AI Conversational/Voice
                Agent) posting.
              </b>{' '}
              Fair warning: it's all invented. No client, no real users, nothing shipped, so there
              are no numbers to brag about. The problem, the rules, every screen and the code are mine.
            </span>
          </p>
        </aside>
      </div>

      <h2 className="h2-loud">What I made</h2>
      <p>Three rules. Every screen in here obeys all three.</p>
      <div className="doc-cols" style={{ marginTop: 'var(--doc-gap-tight)' }}>
        {RULES.map(r => (
          <Card key={r.n} style={{ flex: 1 }}>
            <div style={{ padding: 'var(--space-7)' }}>
              <div className="mono" style={{ color: 'var(--fg-brand)', marginBottom: 'var(--space-4)' }}>{r.n}</div>
              <h3 style={{ marginBottom: 'var(--space-3)' }}>{r.t}</h3>
              <p style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--lh-md)' }}>{r.b}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="doc-next">
        <SectionLabel>Next</SectionLabel>
        <span className="grow" />
        <Button variant="primary" iconEnd="arrowRight" onClick={() => (window.location.hash = 'flow')}>The flow</Button>
      </div>
    </div>
  )
}
