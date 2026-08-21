import type { IconName } from '../ds/Icon'

/* ─────────────────────────────────────────────────────────
   One record per call. Every screen state in this prototype
   is driven from here — nothing is hard-coded in the view.
   ───────────────────────────────────────────────────────── */

export type Turn =
  | { kind: 'speech'; who: 'customer' | 'agent'; t: string; text: string; score?: number | null; note?: string }
  | { kind: 'tool'; t: string; name: string; args: string; result: string; ms: number; status: 'ok' | 'slow' | 'fail' }
  | { kind: 'event'; t: string; icon: 'shieldAlert' | 'handoff' | 'alert' | 'lock' | 'sparkle' | 'clock'; tone: 'warning' | 'danger' | 'info' | 'ai'; text: string }

export type Field = { label: string; value: string; score: number | null; cite?: string; flag?: 'true' | 'medium'; pending?: boolean }

export type Proposal = {
  icon: IconName
  title: string
  meta: string
  status: 'gated' | 'auto' | 'blocked' | 'done' | 'failed'
  policy?: string
  note?: string
}

export type Call = {
  id: string
  name: string
  initials: string
  summary: string
  channel: 'voice' | 'sms'
  duration: string
  ago: string
  score: number | null
  status: 'needs-review' | 'auto-resolved' | 'escalated' | 'processing'
  value?: string
  flags: number
  /* detail */
  outcome: string
  containment: 'Full' | 'Partial' | 'None' | '—'
  cost: string
  agent: string
  banner?: { tone: 'warning' | 'danger' | 'info' | 'success'; icon: IconName; title: string; body: string }
  turns: Turn[]
  fields: Field[]
  proposals: Proposal[]
  audit: { t: string; what: string }[]
}

export const calls: Call[] = [
  /* ── 1 ─ the core scenario ─────────────────────────── */
  {
    id: 'C-48219', name: 'Tanner Rowe', initials: 'TR',
    summary: 'Refund — damaged on arrival · $89.40',
    channel: 'voice', duration: '1:31', ago: '2m', score: 0.52,
    status: 'needs-review', value: '$89.40', flags: 2,
    outcome: 'Refund requested', containment: 'Partial', cost: '$0.14', agent: 'Concierge v4.2',
    turns: [
      { kind: 'speech', who: 'agent', t: '0:00', text: "Thanks for calling Northwind Supply, this is Relay — I can help with orders, returns and delivery. What's going on today?", score: 0.98 },
      { kind: 'speech', who: 'customer', t: '0:07', text: "Yeah hi, uh, I got my order this morning and the — the box was completely crushed. One of the units is cracked." },
      { kind: 'tool', t: '0:14', name: 'identify_caller', args: 'phone: +1 (415) 555-0184', result: 'contact 8841 · Tanner Rowe · Business', ms: 240, status: 'ok' },
      { kind: 'speech', who: 'agent', t: '0:16', text: "I'm sorry about that, Tanner. I can see order A-88421 delivered this morning — three CX-40 filter units. Is that the one?", score: 0.96 },
      { kind: 'speech', who: 'customer', t: '0:24', text: "That's it. The middle one's cracked right down the seam. I don't need a replacement, we already sourced one locally — I just want the money back for that unit." },
      { kind: 'tool', t: '0:33', name: 'lookup_order', args: 'order_id: A-88421', result: '3 line items · $268.20 · delivered 08:41', ms: 180, status: 'ok' },
      { kind: 'tool', t: '0:35', name: 'get_refund_policy', args: 'reason: damage, tier: business', result: 'eligible · window 30d', ms: 1840, status: 'slow' },
      { kind: 'speech', who: 'agent', t: '0:41', text: "Got it — refund rather than replacement for one CX-40 unit. That's $89.40 back to the card ending 4429. Can you confirm the damage — is it a crack in the housing, or is the unit not powering on?", score: 0.91 },
      { kind: 'speech', who: 'customer', t: '0:52', text: "It's — I mean the case is split but honestly it might be fine electrically, I haven't plugged it in. It's cosmetic-ish? Hard to say.", score: 0.44, note: 'Ambiguous damage classification' },
      { kind: 'event', t: '0:58', icon: 'sparkle', tone: 'ai', text: 'Only 52% sure what the damage was — so the AI asked one more question instead of guessing' },
      { kind: 'speech', who: 'agent', t: '0:59', text: "No problem — I'll log it as physical damage, unverified severity, and note that it wasn't powered on. That doesn't change your refund.", score: 0.88 },
      { kind: 'speech', who: 'customer', t: '1:08', text: "Great. And can you also cancel the auto-reorder on that item? I don't want another one shipping next month." },
      { kind: 'event', t: '1:12', icon: 'lock', tone: 'warning', text: 'Subscription changes are outside this agent’s permission scope — deferred, not attempted' },
      { kind: 'speech', who: 'agent', t: '1:14', text: "I can't change subscriptions myself, but I've flagged it for the team and you'll get a confirmation by text within the hour. Anything else?", score: 0.93 },
      { kind: 'speech', who: 'customer', t: '1:22', text: "No that's it. Thanks." },
      { kind: 'event', t: '1:26', icon: 'shieldAlert', tone: 'danger', text: 'Rule hit: $89.40 is over the $50 the AI can refund on its own → sent for a person to check' },
    ],
    fields: [
      { label: 'What they wanted', value: 'Refund — damaged on arrival', score: 0.94, cite: 'the box was completely crushed' },
      { label: 'Order', value: 'A-88421', score: 0.99 },
      { label: 'Item', value: 'CX-40 Filter Unit × 1', score: 0.96 },
      { label: 'Refund amount', value: '$89.40', score: 0.88 },
      { label: 'Damage type', value: 'Physical — severity unverified', score: 0.52, cite: "it's cosmetic-ish? Hard to say", flag: 'true' },
      { label: 'Mood', value: 'Mildly negative → resolved', score: 0.71, flag: 'medium' },
      { label: 'Follow-up', value: 'Cancel auto-reorder (out of scope)', score: 0.9 },
      { label: 'OK to call back?', value: 'Not asked', score: null },
    ],
    proposals: [
      { icon: 'dollar', title: 'Issue refund · $89.40', meta: 'To card ••4429 · order A-88421 · 1 × CX-40', status: 'gated', policy: 'refund_limit — over $50 needs a human' },
      { icon: 'message', title: 'Send SMS confirmation', meta: 'Queued — sends after the refund is approved', status: 'auto' },
      { icon: 'handoff', title: 'Cancel auto-reorder', meta: 'No permission on subscriptions · routed to Billing', status: 'blocked' },
    ],
    audit: [
      { t: '09:14:02', what: 'Call answered · policy “support-inbound-us”' },
      { t: '09:14:16', what: 'Caller identified · contact 8841' },
      { t: '09:15:28', what: 'Rule refund_limit hit · sent for a person to check' },
      { t: '09:15:31', what: 'Card number hidden · ••4429' },
    ],
  },

  /* ── 2 ─ clean auto-resolve, SMS ───────────────────── */
  {
    id: 'C-48218', name: 'Priya Nandakumar', initials: 'PN',
    summary: 'Reschedule delivery to Thursday',
    channel: 'sms', duration: '—', ago: '6m', score: 0.93,
    status: 'auto-resolved', flags: 0,
    outcome: 'Rescheduled', containment: 'Full', cost: '$0.02', agent: 'Concierge v4.2',
    banner: { tone: 'success', icon: 'checkCircle', title: 'Handled end to end', body: 'Nothing needed a person. This is here so you can spot-check, not so you can approve it.' },
    turns: [
      { kind: 'speech', who: 'customer', t: '08:41', text: "hi — nobody will be here tomorrow for the delivery, can we move it to thursday?" },
      { kind: 'tool', t: '08:41', name: 'identify_caller', args: 'phone: +1 (206) 555-0119', result: 'contact 4412 · Priya Nandakumar', ms: 190, status: 'ok' },
      { kind: 'tool', t: '08:41', name: 'lookup_shipment', args: 'contact: 4412', result: 'SHP-77120 · out for delivery Wed · reschedulable', ms: 220, status: 'ok' },
      { kind: 'speech', who: 'agent', t: '08:42', text: "No problem. I can move SHP-77120 to Thursday 22 Aug, 9am–1pm. Want me to lock that in?", score: 0.97 },
      { kind: 'speech', who: 'customer', t: '08:44', text: "yes please" },
      { kind: 'tool', t: '08:44', name: 'reschedule_shipment', args: 'id: SHP-77120, date: 2026-08-22', result: 'confirmed · window 09:00–13:00', ms: 410, status: 'ok' },
      { kind: 'speech', who: 'agent', t: '08:44', text: "Done — Thursday 22 Aug, 9am to 1pm. You'll get a text the morning of. Anything else?", score: 0.96 },
      { kind: 'speech', who: 'customer', t: '08:46', text: "nope thanks!" },
    ],
    fields: [
      { label: 'What they wanted', value: 'Reschedule delivery', score: 0.97, cite: 'can we move it to thursday' },
      { label: 'Shipment', value: 'SHP-77120', score: 0.99 },
      { label: 'New date', value: 'Thu 22 Aug · 09:00–13:00', score: 0.93 },
      { label: 'Reason', value: 'Nobody home', score: 0.89 },
      { label: 'Mood', value: 'Neutral', score: 0.95 },
      { label: 'OK to call back?', value: 'Not asked', score: null },
    ],
    proposals: [
      { icon: 'calendar', title: 'Reschedule to Thu 22 Aug', meta: 'SHP-77120 · window 09:00–13:00', status: 'done', note: 'Under the no-cost-change ceiling — allowed without a human' },
      { icon: 'message', title: 'Send SMS confirmation', meta: 'Delivered 08:44', status: 'done' },
    ],
    audit: [
      { t: '08:41:09', what: 'Inbound SMS · thread opened' },
      { t: '08:44:31', what: 'reschedule_shipment succeeded · no policy triggered' },
      { t: '08:44:33', what: 'Closed as resolved by agent' },
    ],
  },

  /* ── 3 ─ escalation, human-in-the-loop ─────────────── */
  {
    id: 'C-48217', name: 'Marcus Hale', initials: 'MH',
    summary: 'Wants to cancel — worth trying to keep',
    channel: 'voice', duration: '4:02', ago: '11m', score: 0.41,
    status: 'escalated', value: '$14,400 a year', flags: 3,
    outcome: 'Handed to the save team', containment: 'None', cost: '$0.31', agent: 'Concierge v4.2',
    banner: { tone: 'danger', icon: 'handoff', title: 'Handed to a person mid-call', body: 'Dana W. joined at 2:14 with the transcript already loaded. Marcus never repeated himself and was never put on hold.' },
    turns: [
      { kind: 'speech', who: 'customer', t: '0:00', text: "I need to cancel our account. We're done." },
      { kind: 'tool', t: '0:04', name: 'identify_caller', args: 'phone: +1 (312) 555-0177', result: 'contact 2210 · Marcus Hale · Acme Logistics · $14,400 a year', ms: 260, status: 'ok' },
      { kind: 'event', t: '0:06', icon: 'shieldAlert', tone: 'danger', text: 'Rule hit: they want to cancel, and they spend over $10k a year → hand to the save team' },
      { kind: 'speech', who: 'agent', t: '0:07', text: "I'm sorry to hear that, Marcus. Before I do anything — can you tell me what's driven this?", score: 0.94 },
      { kind: 'speech', who: 'customer', t: '0:14', text: "It's the — look, it's a few things. The invoicing thing from July, and honestly your, uh, the portal is just slower than what we moved from.", score: 0.38, note: 'Multiple overlapping reasons, heavy crosstalk' },
      { kind: 'event', t: '0:26', icon: 'sparkle', tone: 'ai', text: 'cancel_reason confidence 0.41 — below the 0.60 floor. Agent stopped classifying and started listening.' },
      { kind: 'speech', who: 'agent', t: '0:28', text: "That's useful, thank you. I'm not going to try to talk you out of it on this call — I'd rather get you to someone who can actually fix the invoicing issue. Can I bring in our retention lead now, on this same call?", score: 0.91 },
      { kind: 'speech', who: 'customer', t: '0:44', text: "Fine, yeah. As long as I'm not on hold for ten minutes." },
      { kind: 'event', t: '2:14', icon: 'handoff', tone: 'info', text: 'Dana Whitfield joined · transcript, account and extraction handed over' },
      { kind: 'speech', who: 'agent', t: '2:16', text: "Dana's on the line now and has everything in front of her. I'll drop off — good luck, Marcus.", score: 0.95 },
    ],
    fields: [
      { label: 'What they wanted', value: 'Cancel contract', score: 0.96, cite: "I need to cancel our account" },
      { label: 'Account', value: 'Acme Logistics · $14,400 a year', score: 0.99 },
      { label: 'Why they are leaving', value: 'Unclear — billing and/or performance', score: 0.41, cite: "it's a few things", flag: 'true' },
      { label: 'Mood', value: 'Frustrated, not hostile', score: 0.68, flag: 'medium' },
      { label: 'Can we offer them something?', value: 'Yes — up to 2 months credit', score: 0.9 },
      { label: 'Who is looking after them', value: 'Dana Whitfield', score: 0.99 },
    ],
    proposals: [
      { icon: 'handoff', title: 'Escalate to retention', meta: 'Dana Whitfield joined at 2:14 · warm transfer', status: 'done' },
      { icon: 'dollar', title: 'Offer 2 months credit · $2,400', meta: 'Save offer within Marcus’ tier', status: 'blocked', policy: 'save_offer — only a retention lead may offer credit' },
      { icon: 'xCircle', title: 'Cancel the contract', meta: 'Not attempted', status: 'blocked', policy: 'contract_termination — never automated, any value' },
    ],
    audit: [
      { t: '09:05:12', what: 'Call answered' },
      { t: '09:05:18', what: 'Rule high_value_cancellation hit' },
      { t: '09:05:38', what: 'cancel_reason below confidence floor · classification abandoned' },
      { t: '09:07:26', what: 'Warm transfer to Dana Whitfield · context passed' },
    ],
  },

  /* ── 4 ─ live, still processing ────────────────────── */
  {
    id: 'C-48216', name: 'Unknown caller', initials: '?',
    summary: 'Transcribing…',
    channel: 'voice', duration: '0:48', ago: 'live', score: null,
    status: 'processing', flags: 0,
    outcome: '—', containment: '—', cost: '$0.04', agent: 'Concierge v4.2',
    banner: { tone: 'info', icon: 'phone', title: 'Call in progress', body: 'You can listen in or take over. There is nothing to approve yet — the agent has not proposed anything.' },
    turns: [
      { kind: 'speech', who: 'agent', t: '0:00', text: "Thanks for calling Northwind Supply, this is Relay. What can I help with?", score: 0.98 },
      { kind: 'speech', who: 'customer', t: '0:06', text: "Hi — I'm calling about an order, I think the number is 8, 8, 4… hang on, let me find the email." },
      { kind: 'tool', t: '0:12', name: 'identify_caller', args: 'phone: +1 (503) 555-0142', result: 'no match · number not on file', ms: 310, status: 'fail' },
      { kind: 'speech', who: 'agent', t: '0:14', text: "No rush. While you look — is this the number on the order, or a different one?", score: 0.9 },
      { kind: 'event', t: '0:31', icon: 'clock', tone: 'info', text: 'Silence 14s — agent held the line rather than re-prompting' },
    ],
    fields: [
      { label: 'What they wanted', value: 'Order enquiry', score: 0.72, flag: 'medium' },
      { label: 'Caller', value: 'Not identified', score: null },
      { label: 'Order', value: '', score: null, pending: true },
      { label: 'Mood', value: '', score: null, pending: true },
      { label: 'Refund amount', value: '', score: null, pending: true },
    ],
    proposals: [],
    audit: [
      { t: '09:16:44', what: 'Call answered' },
      { t: '09:16:56', what: 'identify_caller failed · number not on file' },
    ],
  },

  /* ── 5 ─ trivial auto-resolve ──────────────────────── */
  {
    id: 'C-48215', name: 'Dana Whitfield', initials: 'DW',
    summary: 'Invoice copy for Aug — sent',
    channel: 'sms', duration: '—', ago: '18m', score: 0.97,
    status: 'auto-resolved', flags: 0,
    outcome: 'Document sent', containment: 'Full', cost: '$0.01', agent: 'Concierge v4.2',
    banner: { tone: 'success', icon: 'checkCircle', title: 'Handled end to end', body: 'Sending a document the account already owns needs no approval. 61% of the queue used to look like this.' },
    turns: [
      { kind: 'speech', who: 'customer', t: '08:29', text: "can you resend the august invoice? finance can't find it" },
      { kind: 'tool', t: '08:29', name: 'lookup_invoices', args: 'contact: 5510, period: 2026-08', result: 'INV-20841 · $3,120.00 · issued 01 Aug', ms: 160, status: 'ok' },
      { kind: 'speech', who: 'agent', t: '08:29', text: "Sure — that's INV-20841 for $3,120.00. Sending it to the billing address on file now.", score: 0.98 },
      { kind: 'tool', t: '08:30', name: 'send_document', args: 'doc: INV-20841, to: billing@…', result: 'delivered', ms: 520, status: 'ok' },
      { kind: 'speech', who: 'customer', t: '08:31', text: "got it, thank you" },
    ],
    fields: [
      { label: 'What they wanted', value: 'Resend invoice', score: 0.98, cite: 'can you resend the august invoice' },
      { label: 'Document', value: 'INV-20841 · $3,120.00', score: 0.99 },
      { label: 'Period', value: 'August 2026', score: 0.97 },
      { label: 'Sent to', value: 'Billing address on file', score: 0.99 },
      { label: 'Mood', value: 'Neutral', score: 0.96 },
    ],
    proposals: [
      { icon: 'external', title: 'Send INV-20841', meta: 'To the billing address on file · delivered 08:30', status: 'done', note: 'Read-only document to a verified contact — no approval needed' },
    ],
    audit: [
      { t: '08:29:03', what: 'Inbound SMS · thread opened' },
      { t: '08:30:11', what: 'send_document succeeded' },
      { t: '08:31:40', what: 'Closed as resolved by agent' },
    ],
  },

  /* ── 6 ─ second gated refund, permission ceiling ───── */
  {
    id: 'C-48214', name: 'Ivan Petrov', initials: 'IP',
    summary: 'Refund — wrong item shipped · $412.00',
    channel: 'voice', duration: '2:55', ago: '24m', score: 0.79,
    status: 'needs-review', value: '$412.00', flags: 1,
    outcome: 'Refund requested', containment: 'Partial', cost: '$0.22', agent: 'Concierge v4.2',
    banner: { tone: 'warning', icon: 'lock', title: 'Above your ceiling', body: 'You can review and recommend this refund, but $412.00 needs a manager to release it. Approving here sends it to Priya N.' },
    turns: [
      { kind: 'speech', who: 'customer', t: '0:00', text: "You've sent me the wrong thing. I ordered the 60-series manifold and I've got a box of 40s." },
      { kind: 'tool', t: '0:08', name: 'identify_caller', args: 'phone: +1 (646) 555-0163', result: 'contact 6621 · Ivan Petrov · Business', ms: 200, status: 'ok' },
      { kind: 'tool', t: '0:10', name: 'lookup_order', args: 'order_id: A-88109', result: '1 line item · MF-40 × 4 · $412.00 · delivered 19 Aug', ms: 210, status: 'ok' },
      { kind: 'speech', who: 'agent', t: '0:13', text: "You're right — the order shows MF-40, four units. Your previous three orders were all MF-60. That looks like a picking error on our side, not yours.", score: 0.93 },
      { kind: 'speech', who: 'customer', t: '0:29', text: "Right. So I need the 60s, and I need this lot gone, I've got no room for them." },
      { kind: 'speech', who: 'agent', t: '0:36', text: "I'll arrange collection and refund the $412.00 rather than doing an exchange, so you can reorder at the current price. Does that work?", score: 0.87 },
      { kind: 'speech', who: 'customer', t: '0:48', text: "Yeah that's fine. When do I get the money?" },
      { kind: 'speech', who: 'agent', t: '0:53', text: "Once a supervisor releases it — refunds this size need a second pair of eyes. You'll have confirmation today and the money in 3–5 working days.", score: 0.92 },
      { kind: 'event', t: '1:02', icon: 'shieldAlert', tone: 'danger', text: 'Rule hit: $412.00 is over the $250 you are allowed to release → needs a manager' },
    ],
    fields: [
      { label: 'What they wanted', value: 'Refund — wrong item shipped', score: 0.95, cite: "You've sent me the wrong thing" },
      { label: 'Order', value: 'A-88109', score: 0.99 },
      { label: 'Item', value: 'MF-40 Manifold × 4', score: 0.97 },
      { label: 'Refund amount', value: '$412.00', score: 0.94 },
      { label: 'Whose mistake', value: 'Northwind — picking error', score: 0.79, cite: 'previous three orders were all MF-60', flag: 'medium' },
      { label: 'Do we collect it?', value: 'Yes — 4 units', score: 0.91 },
      { label: 'Mood', value: 'Irritated → satisfied', score: 0.83 },
    ],
    proposals: [
      { icon: 'dollar', title: 'Issue refund · $412.00', meta: 'To card ••8802 · order A-88109', status: 'gated', policy: 'refund_ceiling — over $250 needs a manager, not you' },
      { icon: 'calendar', title: 'Book collection', meta: 'Fri 21 Aug · 4 units · courier assigned', status: 'auto' },
      { icon: 'message', title: 'Send SMS confirmation', meta: 'Queued — sends after the refund is released', status: 'auto' },
    ],
    audit: [
      { t: '08:52:40', what: 'Call answered' },
      { t: '08:53:42', what: 'Rule refund_ceiling hit · needs a manager' },
      { t: '08:53:44', what: 'Routed to Priya N. (manager on shift)' },
    ],
  },

  /* ── 7 ─ quiet success ─────────────────────────────── */
  {
    id: 'C-48213', name: 'Sofia Marchetti', initials: 'SM',
    summary: 'Address change on order A-88109',
    channel: 'voice', duration: '1:12', ago: '31m', score: 0.91,
    status: 'auto-resolved', flags: 0,
    outcome: 'Address updated', containment: 'Full', cost: '$0.09', agent: 'Concierge v4.2',
    banner: { tone: 'success', icon: 'checkCircle', title: 'Handled end to end', body: 'Address changes before dispatch are inside the agent’s scope. After dispatch they are not — the ceiling moves with the risk.' },
    turns: [
      { kind: 'speech', who: 'customer', t: '0:00', text: "Hi, I need to change the delivery address on an order — we've moved warehouse." },
      { kind: 'tool', t: '0:06', name: 'identify_caller', args: 'phone: +1 (917) 555-0198', result: 'contact 7734 · Sofia Marchetti', ms: 180, status: 'ok' },
      { kind: 'tool', t: '0:08', name: 'lookup_order', args: 'contact: 7734, status: open', result: 'A-88109 · not yet dispatched', ms: 200, status: 'ok' },
      { kind: 'speech', who: 'agent', t: '0:11', text: "A-88109 hasn't shipped yet, so I can change it. What's the new address?", score: 0.95 },
      { kind: 'speech', who: 'customer', t: '0:19', text: "Unit 6, Halston Industrial Park, Newark, oh-seven-one-oh-two." },
      { kind: 'tool', t: '0:34', name: 'validate_address', args: 'Unit 6 Halston Industrial Park, Newark NJ 07102', result: 'valid · commercial · matches USPS', ms: 640, status: 'ok' },
      { kind: 'speech', who: 'agent', t: '0:37', text: "Got it — Unit 6, Halston Industrial Park, Newark, New Jersey 07102. Updated. Delivery is still Friday.", score: 0.94 },
      { kind: 'speech', who: 'customer', t: '0:52', text: "Perfect, thanks very much." },
    ],
    fields: [
      { label: 'What they wanted', value: 'Change delivery address', score: 0.96 },
      { label: 'Order', value: 'A-88109', score: 0.99 },
      { label: 'New address', value: 'Unit 6, Halston Industrial Park, Newark NJ 07102', score: 0.91, cite: 'Unit 6, Halston Industrial Park' },
      { label: 'Address checked', value: 'Yes — USPS commercial match', score: 0.98 },
      { label: 'Has it shipped?', value: 'Not yet dispatched', score: 0.99 },
      { label: 'Mood', value: 'Positive', score: 0.93 },
    ],
    proposals: [
      { icon: 'edit', title: 'Update delivery address', meta: 'A-88109 · applied 09:02', status: 'done', note: 'Pre-dispatch address change — inside scope' },
      { icon: 'message', title: 'Send SMS confirmation', meta: 'Delivered 09:02', status: 'done' },
    ],
    audit: [
      { t: '09:01:15', what: 'Call answered' },
      { t: '09:02:04', what: 'validate_address succeeded' },
      { t: '09:02:09', what: 'Address updated · no policy triggered' },
    ],
  },

  /* ── 8 ─ repeat caller, stale review ───────────────── */
  {
    id: 'C-48212', name: 'Ray Okonkwo', initials: 'RO',
    summary: 'Repeated caller — 3rd attempt today',
    channel: 'voice', duration: '3:40', ago: '38m', score: 0.63,
    status: 'needs-review', flags: 2,
    outcome: 'Still not fixed — 3rd try', containment: 'None', cost: '$0.28', agent: 'Concierge v4.2',
    banner: { tone: 'warning', icon: 'clock', title: 'Third call today', body: 'The agent has now failed this customer twice. Repeat contact is the strongest signal we have that automation is not working — the goodwill credit is the apology, not the fix.' },
    turns: [
      { kind: 'speech', who: 'customer', t: '0:00', text: "This is the third time I've called about this today. Third." },
      { kind: 'tool', t: '0:05', name: 'identify_caller', args: 'phone: +1 (773) 555-0155', result: 'contact 9902 · Ray Okonkwo · 2 prior calls today', ms: 230, status: 'ok' },
      { kind: 'event', t: '0:07', icon: 'alert', tone: 'warning', text: 'Repeat contact detected — 3rd interaction in 6 hours on the same order' },
      { kind: 'speech', who: 'agent', t: '0:08', text: "I can see you've called twice already today about order A-87940, and I'm sorry we haven't fixed it. Let me read what happened rather than make you explain it again.", score: 0.92 },
      { kind: 'tool', t: '0:16', name: 'get_case_history', args: 'contact: 9902, window: 24h', result: '2 calls · both closed “resolved” · no action taken', ms: 480, status: 'ok' },
      { kind: 'event', t: '0:22', icon: 'sparkle', tone: 'ai', text: 'Prior calls were auto-closed as resolved but no downstream action exists — likely a false resolution' },
      { kind: 'speech', who: 'customer', t: '0:29', text: "Both times it said it was sorted and both times nothing happened. I'm not doing this a fourth time.", score: 0.58, note: 'Raised voice, partial clipping' },
      { kind: 'speech', who: 'agent', t: '0:38', text: "Understood. I'm not going to close this one — I'm putting it in front of a person with everything from all three calls attached, and adding a credit for the trouble.", score: 0.89 },
    ],
    fields: [
      { label: 'What they wanted', value: 'Chase unresolved issue', score: 0.93, cite: "third time I've called about this today" },
      { label: 'Order', value: 'A-87940', score: 0.97 },
      { label: 'Calls before this one', value: '2 today · both auto-closed', score: 0.99 },
      { label: 'What actually went wrong', value: 'Unknown — no downstream action found', score: 0.63, flag: 'medium' },
      { label: 'Mood', value: 'Angry', score: 0.58, cite: "I'm not doing this a fourth time", flag: 'true' },
      { label: 'Might they leave?', value: 'Elevated', score: 0.74, flag: 'medium' },
    ],
    proposals: [
      { icon: 'dollar', title: 'Goodwill credit · $25.00', meta: 'Applied to the account, not refunded', status: 'gated', policy: 'goodwill_credit — every credit needs a human, any amount' },
      { icon: 'handoff', title: 'Assign to a named person', meta: 'Do not auto-close · all 3 transcripts attached', status: 'auto' },
      { icon: 'alert', title: 'Flag prior auto-closures', meta: 'Two calls closed “resolved” with no action · sent to quality', status: 'auto' },
    ],
    audit: [
      { t: '08:38:20', what: 'Call answered · they have rung before today' },
      { t: '08:38:36', what: 'get_case_history · 2 prior closures found' },
      { t: '08:38:58', what: 'Auto-close suppressed for this call' },
      { t: '08:39:04', what: 'Rule goodwill_credit hit · sent for a person to check' },
    ],
  },
]

export const byId = (id: string) => calls.find(c => c.id === id) ?? calls[0]

/* The queue list is a projection of the same records. */
export const queue = calls

/* ---------- the counts every screen quotes ----------
   DERIVED, never typed. The console prints the size of this queue in three
   places at once — the nav badge, the queue toolbar's filter and the phone
   page header — and they used to be a hard-coded 12, a hard-coded 12 and
   `queue.length`. On a phone the last two are eight pixels apart, so the
   screen said "8 waiting" directly above "Needs review 12" above a list of
   eight rows. Reading them off the records is the only way three numbers on
   one screen can never disagree again; add a ninth call and all three move. */
export const queueCounts = {
  /* Every call sitting in the review queue — the rows you can actually see. */
  waiting: calls.length,
  /* Still on the phone right now: the live-calls nav badge, not this queue. */
  live: calls.filter(c => c.status === 'processing').length,
}

/* Back-compat aliases used by earlier chapters. */
export const transcript = calls[0].turns
export const extracted = calls[0].fields
export const audit = calls[0].audit.map(a => ({ ...a, who: 'Relay agent v4.2' }))
