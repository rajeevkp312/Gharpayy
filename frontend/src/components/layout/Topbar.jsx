import Button from '../ui/Button.jsx'

export default function Topbar({ title, subtitle = 'Real-time overview of your sales pipeline', action, onMenuClick }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[rgb(var(--gh-border))] bg-white">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-white text-black/80 shadow-sm transition hover:bg-black/[0.02] md:hidden"
            onClick={onMenuClick}
            aria-label="Menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
              />
            </svg>
          </button>
          <div>
            <div className="text-sm font-semibold text-[rgb(var(--gh-black))]">{title}</div>
            <div className="hidden mt-1 text-xs text-black/50 sm:block">{subtitle}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            className="hidden h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-white text-black/70 shadow-sm transition hover:bg-black/[0.02] md:flex"
            aria-label="Notifications"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <path
                d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 1 0-14 0v5l-2 2v1h18v-1l-2-2Z"
                fill="currentColor"
                opacity="0.85"
              />
            </svg>
          </button>

          <div className="hidden items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-1.5 shadow-sm md:flex">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
              <path
                d="M10.5 3a7.5 7.5 0 1 0 4.6 13.4l4.25 4.25 1.4-1.4-4.25-4.25A7.5 7.5 0 0 0 10.5 3Zm0 2a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z"
                fill="currentColor"
                opacity="0.7"
              />
            </svg>
            <input
              placeholder="Search"
              className="w-32 bg-transparent text-sm outline-none placeholder:text-black/40 sm:w-44"
            />
            <div className="rounded-md border border-black/10 px-1.5 py-0.5 text-[10px] text-black/50">
              ⌘K
            </div>
          </div>

          {action ? (
            <Button variant="gold" size="md" onClick={action.onClick} className="hidden md:inline-flex">
              {action.label}
            </Button>
          ) : null}

          <div className="hidden items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-1.5 shadow-sm md:flex">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/5 text-xs font-semibold text-black/70">
              A
            </div>
            <div className="text-xs text-black/60">Admin</div>
          </div>
        </div>
      </div>
    </header>
  )
}
