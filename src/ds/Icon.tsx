/* 16px grid · 1.4 stroke · round caps — one geometry rule for the whole set.
   Render at 12 / 14 / 16 / 20 only. Those are the four sizes the UI uses. */
import type { CSSProperties } from 'react'

const P: Record<string, string> = {
  inbox:      'M2 9.5h3.2l1.1 2.2h5.4l1.1-2.2H16M2 9.5 4.2 3.3A1.4 1.4 0 0 1 5.5 2.4h7A1.4 1.4 0 0 1 13.8 3.3L16 9.5v3.4a1.6 1.6 0 0 1-1.6 1.6H3.6A1.6 1.6 0 0 1 2 12.9Z',
  phone:      'M14.5 11.9v2a1.3 1.3 0 0 1-1.5 1.3 13 13 0 0 1-5.6-2 12.7 12.7 0 0 1-3.9-3.9 13 13 0 0 1-2-5.7A1.3 1.3 0 0 1 2.8 2h2a1.3 1.3 0 0 1 1.3 1.2c.1.8.3 1.6.5 2.3a1.3 1.3 0 0 1-.3 1.4l-.8.8a10.4 10.4 0 0 0 3.9 3.9l.8-.8a1.3 1.3 0 0 1 1.4-.3c.7.3 1.5.4 2.3.5a1.3 1.3 0 0 1 1.2 1.4Z',
  wave:       'M2 7v4M5 4.5v9M8 2v14M11 5.5v7M14 7.5v3',
  check:      'M3 8.6 6.4 12 13.4 4.6',
  checkCircle:'M14.6 7.4V8a6.6 6.6 0 1 1-3.9-6M14.6 3.3 8 10l-2-2',
  x:          'M12.4 3.6 3.6 12.4M3.6 3.6l8.8 8.8',
  xCircle:    'M8 14.6A6.6 6.6 0 1 0 8 1.4a6.6 6.6 0 0 0 0 13.2ZM10 6l-4 4M6 6l4 4',
  alert:      'M8 5.6v3M8 11.2h.01M6.9 2.3 1.5 11.4a1.3 1.3 0 0 0 1.1 2h10.8a1.3 1.3 0 0 0 1.1-2L9.1 2.3a1.3 1.3 0 0 0-2.2 0Z',
  info:       'M8 14.6A6.6 6.6 0 1 0 8 1.4a6.6 6.6 0 0 0 0 13.2ZM8 10.6V8M8 5.4h.01',
  shield:     'M8 14.6s5.3-2.7 5.3-6.6V3.7L8 1.7 2.7 3.7V8c0 3.9 5.3 6.6 5.3 6.6Z',
  shieldAlert:'M8 14.6s5.3-2.7 5.3-6.6V3.7L8 1.7 2.7 3.7V8c0 3.9 5.3 6.6 5.3 6.6ZM8 5.6v2.8M8 10.7h.01',
  user:       'M13.3 14v-1.3a2.7 2.7 0 0 0-2.6-2.7H5.3a2.7 2.7 0 0 0-2.6 2.7V14M8 7.3A2.7 2.7 0 1 0 8 2a2.7 2.7 0 0 0 0 5.3Z',
  users:      'M11.3 14v-1.3A2.7 2.7 0 0 0 8.7 10H4a2.7 2.7 0 0 0-2.7 2.7V14M6.3 7.3A2.7 2.7 0 1 0 6.3 2a2.7 2.7 0 0 0 0 5.3ZM14.7 14v-1.3a2.7 2.7 0 0 0-2-2.6M11.3 2.1a2.7 2.7 0 0 1 0 5.2',
  sparkle:    'M8 1.8 9.5 6l4.2 1.5L9.5 9 8 13.2 6.5 9 2.3 7.5 6.5 6ZM13.2 1.6v2.2M12.1 2.7h2.2',
  bot:        'M8 3.6V1.6M4.6 6h6.8a1.6 1.6 0 0 1 1.6 1.6v4.2a1.6 1.6 0 0 1-1.6 1.6H4.6A1.6 1.6 0 0 1 3 11.8V7.6A1.6 1.6 0 0 1 4.6 6ZM6.2 9.3v1.1M9.8 9.3v1.1M13 8.6h1.4M1.6 8.6H3',
  chart:      'M2 14V8.6M6.7 14V2M11.3 14V6M2 14h12.4',
  settings:   'M8 10.1a2.1 2.1 0 1 0 0-4.2 2.1 2.1 0 0 0 0 4.2Z M12.9 10.1a1.2 1.2 0 0 0 .2 1.3l.1.1a1.4 1.4 0 1 1-2 2l-.1-.1a1.2 1.2 0 0 0-2 .9v.2a1.4 1.4 0 1 1-2.9 0v-.1a1.2 1.2 0 0 0-2-.9l-.1.1a1.4 1.4 0 1 1-2-2l.1-.1a1.2 1.2 0 0 0-.9-2h-.2a1.4 1.4 0 1 1 0-2.9h.1a1.2 1.2 0 0 0 .9-2l-.1-.1a1.4 1.4 0 1 1 2-2l.1.1a1.2 1.2 0 0 0 1.4.2h.1a1.2 1.2 0 0 0 .7-1.1v-.2a1.4 1.4 0 1 1 2.9 0v.1a1.2 1.2 0 0 0 2 .9l.1-.1a1.4 1.4 0 1 1 2 2l-.1.1a1.2 1.2 0 0 0-.2 1.4v.1a1.2 1.2 0 0 0 1.1.7h.2a1.4 1.4 0 1 1 0 2.9h-.1a1.2 1.2 0 0 0-1.1.7Z',
  search:     'M7.5 13a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11ZM14 14l-2.6-2.6',
  chevronDown:'M4 6.3 8 10.3l4-4',
  chevronRight:'M6.3 4 10.3 8l-4 4',
  chevronLeft:'M9.7 4 5.7 8l4 4',
  arrowRight: 'M2.7 8h10.6M9 3.7 13.3 8 9 12.3',
  arrowUpRight:'M4.7 11.3 11.3 4.7M5.3 4.7h6v6',
  play:       'M4.3 2.6 13 8l-8.7 5.4Z',
  pause:      'M5.6 2.7h1.8v10.6H5.6zM8.6 2.7h1.8v10.6H8.6z',
  edit:       'M8 13.4H14M10.9 2.4a1.6 1.6 0 0 1 2.3 2.3L4.9 13 2 13.7l.7-2.9Z',
  more:       'M8 8.7a.7.7 0 1 0 0-1.4.7.7 0 0 0 0 1.4ZM12.9 8.7a.7.7 0 1 0 0-1.4.7.7 0 0 0 0 1.4ZM3.1 8.7a.7.7 0 1 0 0-1.4.7.7 0 0 0 0 1.4Z',
  clock:      'M8 14.6A6.6 6.6 0 1 0 8 1.4a6.6 6.6 0 0 0 0 13.2ZM8 4.4V8l2.4 1.2',
  refresh:    'M14 2.7v4h-4M2 13.3v-4h4M3.7 6a4.7 4.7 0 0 1 7.7-1.8L14 6.7M2 9.3l2.6 2.5A4.7 4.7 0 0 0 12.3 10',
  filter:     'M14.7 2H1.3l5.3 6.3v4.4l2.8 1.3V8.3Z',
  tag:        'M8.5 1.8H2.6a.8.8 0 0 0-.8.8v5.9c0 .2 0 .4.2.5l5.6 5.6a.8.8 0 0 0 1.1 0l5.4-5.4a.8.8 0 0 0 0-1.1L9.1 2a.8.8 0 0 0-.6-.2ZM5.2 5.2h.01',
  external:   'M6.7 3.3H3.6a1.6 1.6 0 0 0-1.6 1.6v7.5A1.6 1.6 0 0 0 3.6 14h7.5a1.6 1.6 0 0 0 1.6-1.6V9.3M9.3 2H14v4.7M7 9 14 2',
  lock:       'M12.4 7.3H3.6a1.3 1.3 0 0 0-1.3 1.3v4.1A1.3 1.3 0 0 0 3.6 14h8.8a1.3 1.3 0 0 0 1.3-1.3V8.6a1.3 1.3 0 0 0-1.3-1.3ZM4.9 7.3V4.7a3.1 3.1 0 0 1 6.2 0v2.6',
  handoff:    'M9.3 2.7h2.4a1.6 1.6 0 0 1 1.6 1.6v7.4a1.6 1.6 0 0 1-1.6 1.6H9.3M6.7 11.3 10 8 6.7 4.7M10 8H2.3',
  message:    'M14 10.3a1.3 1.3 0 0 1-1.3 1.4H4.7L2 14.4V3.6a1.3 1.3 0 0 1 1.3-1.3h9.4A1.3 1.3 0 0 1 14 3.6Z',
  layers:     'M8 1.6 1.7 4.8 8 8l6.3-3.2ZM1.7 11.2 8 14.4l6.3-3.2M1.7 8 8 11.2 14.3 8',
  hash:       'M2.7 6h10.6M2.7 10h10.6M6.7 2 5.3 14M10.7 2 9.3 14',
  /* Opens the product nav below lg, where it is off-canvas. Same 3.3 rhythm as
     `hash`, so the two read as one family when they sit in the same bar. */
  menu:       'M2.7 4.7h10.6M2.7 8h10.6M2.7 11.3h10.6',
  eye:        'M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5ZM8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  undo:       'M2 6h7.3a3.7 3.7 0 0 1 0 7.3H6M2 6l3-3M2 6l3 3',
  plus:       'M8 3.3v9.4M3.3 8h9.4',
  minus:      'M3.3 8h9.4',
  dollar:     'M8 1.3v13.4M11.1 3.8H6.4a2.1 2.1 0 0 0 0 4.3h3.2a2.1 2.1 0 0 1 0 4.3H4.3',
  calendar:   'M12.7 2.7H3.3a1.3 1.3 0 0 0-1.3 1.3v9.3A1.3 1.3 0 0 0 3.3 14h9.4a1.3 1.3 0 0 0 1.3-1.3V4a1.3 1.3 0 0 0-1.3-1.3ZM10.7 1.3V4M5.3 1.3V4M2 6.7h12',
  grid:       'M6.7 2H2v4.7h4.7ZM14 2H9.3v4.7H14ZM14 9.3H9.3V14H14ZM6.7 9.3H2V14h4.7Z',
  book:       'M2 11.7V3.3A1.3 1.3 0 0 1 3.3 2H13v12H3.3A1.3 1.3 0 0 1 2 12.7v-1h11',
  moon:       'M13.7 9.3A6 6 0 1 1 6.7 2.3a4.7 4.7 0 0 0 7 7Z',
  sun:        'M8 11.3a3.3 3.3 0 1 0 0-6.6 3.3 3.3 0 0 0 0 6.6ZM8 .9v1.4M8 13.7v1.4M2.9 2.9l1 1M12.1 12.1l1 1M.9 8h1.4M13.7 8h1.4M2.9 13.1l1-1M12.1 3.9l1-1',
}

const FILLED = new Set(['play', 'pause'])

export type IconName = keyof typeof P

export function Icon({ name, size = 16, style, className }: { name: IconName; size?: number; style?: CSSProperties; className?: string }) {
  const d = P[name]
  const filled = FILLED.has(name)
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={style} className={className}>
      <path
        d={d}
        stroke={filled ? 'none' : 'currentColor'}
        fill={filled ? 'currentColor' : 'none'}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export const ICON_NAMES = Object.keys(P) as IconName[]
