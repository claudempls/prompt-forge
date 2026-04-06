import type { NavTab } from '../App'

interface Props {
  active: NavTab
  onChange: (tab: NavTab) => void
}

const NAV: { id: NavTab; label: string; icon: JSX.Element }[] = [
  {
    id: 'forge',
    label: 'Forge',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 15L8 5L13 10L16.5 6L18 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="16.5" cy="4.5" r="1.8" fill="currentColor" opacity="0.7"/>
      </svg>
    )
  },
  {
    id: 'history',
    label: 'History',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M9 5v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: 'personalization',
    label: 'Me',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="6.5" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2.5 16c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <line x1="2" y1="5" x2="16" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="2" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="6" cy="5" r="1.8" fill="var(--forge-bg,#070710)" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="12" cy="9" r="1.8" fill="var(--forge-bg,#070710)" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="7" cy="13" r="1.8" fill="var(--forge-bg,#070710)" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    )
  }
]

export default function Sidebar({ active, onChange }: Props) {
  return (
    <aside className="flex flex-col w-[64px] flex-shrink-0 border-r border-forge-border bg-forge-surface/40 h-full">
      {/* macOS traffic lights spacer */}
      <div className="drag-region h-10 flex-shrink-0" />

      {/* Nav icons */}
      <nav className="flex-1 flex flex-col items-center gap-1 px-2 pt-2">
        {NAV.map(({ id, label, icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              title={label}
              className={`no-drag group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-forge-accent/15 text-forge-accent'
                  : 'text-forge-muted hover:text-forge-text hover:bg-forge-surface'
              }`}
            >
              {icon}
              {/* Active dot */}
              {isActive && (
                <span className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full bg-forge-accent" />
              )}
              {/* Tooltip */}
              <span className="absolute left-full ml-2 px-2 py-1 rounded-lg bg-forge-surface border border-forge-border text-forge-text text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                {label}
              </span>
            </button>
          )
        })}
      </nav>

      {/* Quick mode hint at bottom */}
      <div className="px-2 pb-4 flex flex-col items-center gap-1">
        <div
          className="w-10 flex flex-col items-center gap-0.5 opacity-30 hover:opacity-60 transition-opacity cursor-default"
          title="Quick Mode: Option+Space"
        >
          <kbd className="text-[8px] text-forge-muted font-mono leading-none">⌥</kbd>
          <kbd className="text-[8px] text-forge-muted font-mono leading-none">SPC</kbd>
        </div>
      </div>
    </aside>
  )
}
