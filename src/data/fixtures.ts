export type Turn =
  | { kind: 'speech'; who: 'customer' | 'agent'; t: string; text: string; score?: number | null; note?: string }
  | { kind: 'tool'; t: string; name: string; args: string; result: string; ms: number; status: 'ok' | 'slow' | 'fail' }
  | { kind: 'event'; t: string; icon: 'shieldAlert' | 'handoff' | 'alert' | 'lock' | 'sparkle'; tone: 'warning' | 'danger' | 'info' | 'ai'; text: string }

export const transcript: Turn[] = [
  { kind: 'speech', who: 'agent', t: '0:00', text: "Thanks for calling Northwind Supply, this is Relay — I can help with orders, returns and delivery. What's going on today?", score: 0.98 },
  { kind: 'speech', who: 'customer', t: '0:07', text: "Yeah hi, uh, I got my order this morning and the — the box was completely crushed. One of the units is cracked." },
  { kind: 'tool', t: '0:14', name: 'identify_caller', args: 'phone: +1 (415) 555-0184', result: 'contact_id: 8841 · Tanner Rowe · Tier: Business', ms: 240, status: 'ok' },
  { kind: 'speech', who: 'agent', t: '0:16', text: "I'm sorry about that, Tanner. I can see order A-88421 delivered this morning — three CX-40 filter units. Is that the one?", score: 0.96 },
  { kind: 'speech', who: 'customer', t: '0:24', text: "That's it. The middle one's cracked right down the seam. I don't need a replacement, we already sourced one locally — I just want the money back for that unit." },
  { kind: 'tool', t: '0:33', name: 'lookup_order', args: 'order_id: A-88421', result: '3 line items · $268.20 · delivered 08:41', ms: 180, status: 'ok' },
  { kind: 'tool', t: '0:35', name: 'get_refund_policy', args: 'reason: damage, tier: business', result: 'eligible · window 30d · proof_required: false', ms: 1840, status: 'slow' },
  { kind: 'speech', who: 'agent', t: '0:41', text: "Got it — refund rather than replacement for one CX-40 unit. That's $89.40 back to the card ending 4429. Can you confirm the damage — is it a crack in the housing, or is the unit not powering on?", score: 0.91 },
  { kind: 'speech', who: 'customer', t: '0:52', text: "It's — I mean the case is split but honestly it might be fine electrically, I haven't plugged it in. It's cosmetic-ish? Hard to say.", score: 0.44, note: 'Ambiguous damage classification' },
  { kind: 'event', t: '0:58', icon: 'sparkle', tone: 'ai', text: 'Low confidence on damage_type (0.52) — agent asked one clarifying question instead of guessing' },
  { kind: 'speech', who: 'agent', t: '0:59', text: "No problem — I'll log it as physical damage, unverified severity, and note that it wasn't powered on. That doesn't change your refund.", score: 0.88 },
  { kind: 'speech', who: 'customer', t: '1:08', text: "Great. And can you also cancel the auto-reorder on that item? I don't want another one shipping next month." },
  { kind: 'event', t: '1:12', icon: 'lock', tone: 'warning', text: 'Subscription changes are outside this agent’s permission scope — deferred, not attempted' },
  { kind: 'speech', who: 'agent', t: '1:14', text: "I can't change subscriptions myself, but I've flagged it for the team and you'll get a confirmation by text within the hour. Anything else?", score: 0.93 },
  { kind: 'speech', who: 'customer', t: '1:22', text: "No that's it. Thanks." },
  { kind: 'event', t: '1:26', icon: 'shieldAlert', tone: 'danger', text: 'Guardrail: refund $89.40 exceeds $50 auto-approve limit → queued for human review' },
]

export type Field = { label: string; value: string; score: number | null; cite?: string; flag?: 'true' | 'medium' }

export const extracted: Field[] = [
  { label: 'Intent', value: 'Refund — damaged on arrival', score: 0.94, cite: 'the box was completely crushed' },
  { label: 'Order', value: 'A-88421', score: 0.99 },
  { label: 'Line item', value: 'CX-40 Filter Unit × 1', score: 0.96 },
  { label: 'Refund amount', value: '$89.40', score: 0.88 },
  { label: 'Damage type', value: 'Physical — severity unverified', score: 0.52, cite: "it's cosmetic-ish? Hard to say", flag: 'true' },
  { label: 'Sentiment', value: 'Mildly negative → resolved', score: 0.71, flag: 'medium' },
  { label: 'Follow-up', value: 'Cancel auto-reorder (out of scope)', score: 0.9 },
  { label: 'Callback consent', value: 'Not asked', score: null },
]

export type QueueItem = {
  id: string; name: string; initials: string; summary: string; channel: 'voice' | 'sms'
  duration: string; ago: string; score: number | null; status: 'needs-review' | 'auto-resolved' | 'escalated' | 'processing'
  value?: string; flags: number
}

export const queue: QueueItem[] = [
  { id: 'C-48219', name: 'Tanner Rowe', initials: 'TR', summary: 'Refund — damaged on arrival · $89.40', channel: 'voice', duration: '1:31', ago: '2m', score: 0.52, status: 'needs-review', value: '$89.40', flags: 2 },
  { id: 'C-48218', name: 'Priya Nandakumar', initials: 'PN', summary: 'Reschedule delivery to Thursday', channel: 'sms', duration: '—', ago: '6m', score: 0.93, status: 'auto-resolved', flags: 0 },
  { id: 'C-48217', name: 'Marcus Hale', initials: 'MH', summary: 'Wants to cancel contract — retention flag', channel: 'voice', duration: '4:02', ago: '11m', score: 0.41, status: 'escalated', value: '$14,400 ARR', flags: 3 },
  { id: 'C-48216', name: 'Unknown caller', initials: '?', summary: 'Transcribing…', channel: 'voice', duration: '0:48', ago: 'live', score: null, status: 'processing', flags: 0 },
  { id: 'C-48215', name: 'Dana Whitfield', initials: 'DW', summary: 'Invoice copy for Aug — sent', channel: 'sms', duration: '—', ago: '18m', score: 0.97, status: 'auto-resolved', flags: 0 },
  { id: 'C-48214', name: 'Ivan Petrov', initials: 'IP', summary: 'Refund — wrong item shipped · $412.00', channel: 'voice', duration: '2:55', ago: '24m', score: 0.79, status: 'needs-review', value: '$412.00', flags: 1 },
  { id: 'C-48213', name: 'Sofia Marchetti', initials: 'SM', summary: 'Address change on order A-88109', channel: 'voice', duration: '1:12', ago: '31m', score: 0.91, status: 'auto-resolved', flags: 0 },
  { id: 'C-48212', name: 'Ray Okonkwo', initials: 'RO', summary: 'Repeated caller — 3rd attempt today', channel: 'voice', duration: '3:40', ago: '38m', score: 0.63, status: 'needs-review', flags: 2 },
]

export const audit = [
  { t: '09:14:02', who: 'Relay agent v4.2', what: 'Call answered · policy set “support-inbound-us”' },
  { t: '09:14:16', who: 'Relay agent v4.2', what: 'Caller identified · contact 8841' },
  { t: '09:15:28', who: 'System', what: 'Guardrail refund_limit triggered · queued for review' },
  { t: '09:15:31', who: 'System', what: 'PII redacted · card ••4429 masked in transcript' },
]
