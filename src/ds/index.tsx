import type { ReactNode, CSSProperties, ButtonHTMLAttributes } from 'react'
import { Icon, type IconName } from './Icon'
export { Icon, ICON_NAMES } from './Icon'
export type { IconName } from './Icon'

/* ---------------- Button ---------------- */
type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'dangerSubtle' | 'successSubtle'
export function Button({
  children, variant = 'secondary', size = 'md', icon, iconEnd, loading, ...rest
}: { children?: ReactNode; variant?: Variant; size?: 'sm' | 'md' | 'lg'; icon?: IconName; iconEnd?: IconName; loading?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="btn" data-variant={variant} data-size={size} data-loading={loading} {...rest}>
      {loading ? <Icon name="refresh" size={size === 'sm' ? 12 : 14} className="spin" /> : icon && <Icon name={icon} size={size === 'sm' ? 12 : 14} />}
      {children}
      {iconEnd && <Icon name={iconEnd} size={size === 'sm' ? 12 : 14} />}
    </button>
  )
}

export function IconButton({ icon, size = 'md', active, bordered, tip, ...rest }: { icon: IconName; size?: 'sm' | 'md'; active?: boolean; bordered?: boolean; tip?: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const btn = (
    <button className="iconbtn" data-size={size} data-active={active} data-bordered={bordered} aria-label={tip} {...rest}>
      <Icon name={icon} size={size === 'sm' ? 13 : 15} />
    </button>
  )
  return tip ? <span className="tip" data-tip={tip}>{btn}</span> : btn
}

/* ---------------- Badge ---------------- */
export type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'ai'
export function Badge({ children, tone = 'neutral', icon, dot, solid, size, live }: { children: ReactNode; tone?: Tone; icon?: IconName; dot?: boolean; solid?: boolean; size?: 'lg'; live?: boolean }) {
  return (
    <span className="badge" data-tone={tone} data-solid={solid} data-size={size}>
      {dot && <span className="dot" data-live={live} style={{ background: 'currentColor' }} />}
      {icon && <Icon name={icon} size={11} />}
      {children}
    </span>
  )
}

/* ---------------- Confidence ---------------- */
export type Band = 'high' | 'medium' | 'low' | 'none'
export const band = (score: number | null): Band =>
  score === null ? 'none' : score >= 0.85 ? 'high' : score >= 0.6 ? 'medium' : 'low'

export function ConfidencePill({ score, label }: { score: number | null; label?: string }) {
  const b = band(score)
  const text = score === null ? 'no signal' : `${Math.round(score * 100)}%`
  return (
    <span className="tip" data-tip={label ?? `Model confidence · ${b}`}>
      <span className="conf-pill" data-band={b}>
        <ConfidenceMeter score={score} />
        {text}
      </span>
    </span>
  )
}

export function ConfidenceMeter({ score }: { score: number | null }) {
  const b = band(score)
  const bars = score === null ? 0 : Math.max(1, Math.ceil(score * 3))
  return (
    <span className="conf-meter" data-band={b} aria-hidden>
      {[0, 1, 2].map(i => <i key={i} className={i < bars ? 'on' : ''} />)}
    </span>
  )
}

/* ---------------- Surfaces ---------------- */
export function Card({ children, style, className = '' }: { children: ReactNode; style?: CSSProperties; className?: string }) {
  return <div className={`card ${className}`} style={style}>{children}</div>
}
export function CardHeader({ title, sub, actions, icon }: { title: ReactNode; sub?: ReactNode; actions?: ReactNode; icon?: IconName }) {
  return (
    <div className="card-header">
      <div className="row" style={{ gap: 'var(--space-4)', minWidth: 0 }}>
        {icon && <Icon name={icon} size={14} style={{ color: 'var(--fg-tertiary)' }} />}
        <div style={{ minWidth: 0 }}>
          <div className="card-title truncate">{title}</div>
          {sub && <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-tertiary)', marginTop: 1 }}>{sub}</div>}
        </div>
      </div>
      {actions && <div className="row" style={{ gap: 'var(--space-2)' }}>{actions}</div>}
    </div>
  )
}
export function SectionLabel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div className="section-label" style={style}>{children}</div>
}
export const Divider = ({ style }: { style?: CSSProperties }) => <div className="divider" style={style} />

/* ---------------- Field row ---------------- */
export function FieldRow({ label, value, score, cite, actions, flag }: {
  label: string; value: ReactNode; score?: number | null; cite?: string; actions?: ReactNode; flag?: 'true' | 'medium'
}) {
  return (
    <div className="fieldrow" data-flag={flag}>
      <div className="fieldrow-label">{label}</div>
      <div className="fieldrow-value">
        {value}
        {cite && (
          <div className="fieldrow-cite">
            <Icon name="message" size={11} />
            <span className="truncate" style={{ fontStyle: 'italic' }}>“{cite}”</span>
          </div>
        )}
      </div>
      <div className="row" style={{ gap: 'var(--space-3)', paddingTop: 1 }}>
        {score !== undefined && <ConfidencePill score={score} />}
        {actions && <div className="fieldrow-actions">{actions}</div>}
      </div>
    </div>
  )
}

/* ---------------- Inputs ---------------- */
export function SearchField({ placeholder = 'Search', style }: { placeholder?: string; style?: CSSProperties }) {
  return (
    <div className="searchfield" style={style}>
      <Icon name="search" size={13} />
      <input className="input" placeholder={placeholder} />
    </div>
  )
}
export function Segmented<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <div className="segmented" role="group">
      {options.map(o => (
        <button key={o.value} aria-pressed={value === o.value} onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  )
}
export function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return <button role="switch" aria-checked={checked} className="switch" onClick={() => onChange(!checked)} />
}

/* ---------------- Feedback ---------------- */
export const Kbd = ({ children }: { children: ReactNode }) => <span className="kbd">{children}</span>
export const Skeleton = ({ w = '100%', h = 12, r }: { w?: number | string; h?: number; r?: number }) =>
  <div className="skel" style={{ width: w, height: h, borderRadius: r }} />

export function EmptyState({ icon = 'inbox', title, body, action }: { icon?: IconName; title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="empty">
      <div className="empty-glyph"><Icon name={icon} size={18} /></div>
      <div className="empty-title">{title}</div>
      {body && <div className="empty-body">{body}</div>}
      {action && <div style={{ marginTop: 'var(--space-2)' }}>{action}</div>}
    </div>
  )
}

export function Avatar({ label, kind, size }: { label: string; kind?: 'ai' | 'human'; size?: 'sm' | 'lg' }) {
  return <div className="avatar" data-kind={kind} data-size={size}>{kind === 'ai' ? <Icon name="bot" size={size === 'lg' ? 16 : 12} /> : label}</div>
}
