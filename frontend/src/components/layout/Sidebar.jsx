import { NavLink } from 'react-router-dom'
import { useProfile } from '../../contexts/ProfileContext'

const topItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'grid' },
  { to: '/leads', label: 'Leads', icon: 'users' },
  { to: '/pipeline', label: 'Pipeline', icon: 'columns' },
  { to: '/visits', label: 'Visits', icon: 'calendar' },
  { to: '/messages', label: 'Messages', icon: 'chat' },
  { to: '/bookings', label: 'Bookings', icon: 'bookmark' },
  { to: '/analytics', label: 'Analytics', icon: 'chart' },
  { to: '/historical', label: 'Historical', icon: 'clock' },
]

const supplyItems = [
  { to: '/owners', label: 'Owners', icon: 'building' },
  { to: '/inventory', label: 'Inventory', icon: 'box' },
  { to: '/availability', label: 'Availability', icon: 'check' },
  { to: '/effort', label: 'Effort', icon: 'bolt' },
]

function Icon({ name }) {
  const cls = 'h-4 w-4'
  switch (name) {
    case 'grid':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none">
          <path d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z" fill="currentColor" opacity="0.9" />
        </svg>
      )
    case 'users':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none">
          <path d="M16 11c1.66 0 3-1.34 3-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3ZM8 11c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5C23 14.17 18.33 13 16 13Z" fill="currentColor" opacity="0.9" />
        </svg>
      )
    case 'columns':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none">
          <path d="M4 5h6v14H4V5Zm10 0h6v14h-6V5Z" fill="currentColor" opacity="0.9" />
        </svg>
      )
    case 'calendar':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none">
          <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1Zm14 9H3v8a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-8Z" fill="currentColor" opacity="0.9" />
        </svg>
      )
    case 'chat':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none">
          <path d="M4 4h16v11H7l-3 3V4Z" fill="currentColor" opacity="0.9" />
        </svg>
      )
    case 'bookmark':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none">
          <path d="M6 3h12v18l-6-3-6 3V3Z" fill="currentColor" opacity="0.9" />
        </svg>
      )
    case 'chart':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none">
          <path d="M4 19V5h2v14H4Zm6 0V9h2v10h-2Zm6 0V3h2v16h-2Z" fill="currentColor" opacity="0.9" />
        </svg>
      )
    case 'clock':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none">
          <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm1 11h5v-2h-4V6h-2v7Z" fill="currentColor" opacity="0.9" />
        </svg>
      )
    case 'building':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none">
          <path d="M4 21V3h10v18H4Zm12 0v-8h4v8h-4Z" fill="currentColor" opacity="0.9" />
        </svg>
      )
    case 'box':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none">
          <path d="M21 7 12 2 3 7v10l9 5 9-5V7Zm-9 13-7-3.89V9l7 3.89V20Zm1-7.11L6.24 8.6 12 5.4l5.76 3.2L13 12.89Z" fill="currentColor" opacity="0.9" />
        </svg>
      )
    case 'check':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none">
          <path d="m9 16.17-3.88-3.88L3.7 13.7 9 19l12-12-1.41-1.41L9 16.17Z" fill="currentColor" opacity="0.9" />
        </svg>
      )
    case 'bolt':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none">
          <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" fill="currentColor" opacity="0.9" />
        </svg>
      )
    case 'settings':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none">
          <path d="M19.14 12.94a7.96 7.96 0 0 0 .06-.94 7.96 7.96 0 0 0-.06-.94l2.03-1.58-1.92-3.32-2.39.96a7.97 7.97 0 0 0-1.63-.94l-.36-2.54h-3.84l-.36 2.54c-.58.23-1.12.54-1.63.94l-2.39-.96-1.92 3.32 2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94L2.6 14.52l1.92 3.32 2.39-.96c.51.4 1.05.71 1.63.94l.36 2.54h3.84l.36-2.54c.58-.23 1.12-.54 1.63-.94l2.39.96 1.92-3.32-2.03-1.58ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z" fill="currentColor" opacity="0.9" />
        </svg>
      )
    default:
      return null
  }
}

export default function Sidebar({ open, onClose }) {
  const { profile } = useProfile()
  return (
    <>
      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[rgb(var(--gh-sidebar))] md:hidden md:static md:inset-auto md:z-auto transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-screen flex-col overflow-hidden">
          <div className="flex items-center justify-between px-5 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white">
                <span className="text-sm font-semibold">G</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Gharpayy</div>
                <div className="text-xs text-white/50">Booking OS</div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white md:hidden"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto scrollbar-hide pb-6">
            <div className="space-y-1 px-3">
              {topItems.map((it) => (
                <NavLink
                  key={it.to}
                  to={it.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                      isActive
                        ? 'bg-[rgb(var(--gh-accent))] text-white shadow-[0_10px_25px_rgba(249,115,22,0.35)]'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <span className="text-white/80">
                    <Icon name={it.icon} />
                  </span>
                  <span className="font-medium">{it.label}</span>
                </NavLink>
              ))}
            </div>

            <div className="mt-6 px-3">
              <div className="px-2 text-[11px] font-semibold tracking-[0.18em] text-white/40">
                SUPPLY
              </div>
              <div className="mt-2 space-y-1">
                {supplyItems.map((it) => (
                  <NavLink
                    key={it.to}
                    to={it.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                        isActive
                          ? 'bg-[rgb(var(--gh-accent))] text-white shadow-[0_10px_25px_rgba(249,115,22,0.35)]'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    <span className="text-white/80">
                      <Icon name={it.icon} />
                    </span>
                    <span className="font-medium">{it.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="mt-6 px-3">
              <NavLink
                to="/settings"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                    isActive
                      ? 'bg-[rgb(var(--gh-accent))] text-white shadow-[0_10px_25px_rgba(249,115,22,0.35)]'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <span className="text-white/80">
                  <Icon name="settings" />
                </span>
                <span className="font-medium">Settings</span>
              </NavLink>
            </div>
          </nav>

          <div className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgb(var(--gh-accent))] text-sm font-semibold text-white">
                A
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-white">Admin</div>
                <div className="truncate text-xs text-white/50">admin@gharpayy.com</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden h-screen w-72 shrink-0 border-r border-white/10 bg-[rgb(var(--gh-sidebar))] md:flex md:flex-col overflow-hidden">
        <div className="px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white">
              <span className="text-sm font-semibold">G</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Gharpayy</div>
              <div className="text-xs text-white/50">Booking OS</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-hide pb-6">
          <div className="space-y-1 px-3">
            {topItems.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                    isActive
                      ? 'bg-[rgb(var(--gh-accent))] text-white shadow-[0_10px_25px_rgba(249,115,22,0.35)]'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <span className="text-white/80">
                  <Icon name={it.icon} />
                </span>
                <span className="font-medium">{it.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="mt-6 px-3">
            <div className="px-2 text-[11px] font-semibold tracking-[0.18em] text-white/40">
              SUPPLY
            </div>
            <div className="mt-2 space-y-1">
              {supplyItems.map((it) => (
                <NavLink
                  key={it.to}
                  to={it.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                      isActive
                        ? 'bg-[rgb(var(--gh-accent))] text-white shadow-[0_10px_25px_rgba(249,115,22,0.35)]'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <span className="text-white/80">
                    <Icon name={it.icon} />
                  </span>
                  <span className="font-medium">{it.label}</span>
                </NavLink>
              ))}
            </div>
          </div>

          <div className="mt-6 px-3">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                  isActive
                    ? 'bg-[rgb(var(--gh-accent))] text-white shadow-[0_10px_25px_rgba(249,115,22,0.35)]'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span className="text-white/80">
                <Icon name="settings" />
              </span>
              <span className="font-medium">Settings</span>
            </NavLink>
          </div>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgb(var(--gh-accent))] text-sm font-semibold text-white">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-white">{profile.name}</div>
              <div className="truncate text-xs text-white/50">{profile.email}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
