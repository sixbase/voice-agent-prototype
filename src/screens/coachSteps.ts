import type { Step } from './variants/CoachMarks'

/* The walkthrough of the core screen. It lives here rather than inside either
   chapter because both mount the same <Review>: chapter 3 runs the tour over
   it, and chapter 4 shows the very same screen as layout A with no marks at
   all. One list, one place to edit the copy. */
export const CORE_STEPS: Step[] = [
  {
    sel: '.queue-list',
    title: 'Start here — the queue',
    body: 'Every call the AI could not finish on its own. Click any name to open it. Eight are loaded, and each one is a different situation.',
    place: 'right',
  },
  {
    sel: '[data-coach="fields"] .fieldrow[data-flag="true"]',
    title: 'How sure the AI is',
    body: 'Green means confident. Amber means glance. Red means look properly — and the label turns red too, so you find it without reading every row.',
    place: 'left',
  },
  {
    sel: '.turn-uncertain',
    title: 'Where it misheard',
    body: 'The dashed underline is the exact moment the AI got shaky. Tap or hover it to see how badly.',
    place: 'top',
  },
  {
    sel: '.proposal[data-gated="true"]',
    title: 'What it wants to do',
    body: 'This one moves money, so it is blocked. The rule that stopped it is named — refund_limit — not just "denied".',
    place: 'left',
  },
  {
    sel: '[data-coach="approve"]',
    title: 'Saying yes',
    body: 'Opens a panel over the call, so you can read the quote while you type the amount. The button says the amount, never "OK".',
    place: 'top',
  },
  {
    sel: '[data-coach="log"]',
    title: 'Everything is written down',
    body: 'Every rule the AI hit, every field you changed, every yes — with your name on it. The next chapter shows this same screen built three different ways.',
    place: 'left',
  },
]

/* Chapter 4 explains one thing only: the button that swaps the layouts. The
   screens themselves were already walked through in chapter 3, and repeating
   that here buried the comparison under its own instructions. */
export const FAB_STEP: Step[] = [
  {
    sel: '[data-coach="fab"]',
    title: 'Switch the layout here',
    body: 'Three takes on the same screen — a side inspector, one big decision, or a table you can clear in bulk. Click to swap, or press 1, 2, 3.',
    place: 'left',
  },
]
