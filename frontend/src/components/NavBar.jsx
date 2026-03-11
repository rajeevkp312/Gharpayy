import { NavLink } from 'react-router-dom'

const baseLinkClass =
  'text-sm font-medium px-3 py-2 rounded hover:bg-gray-100 transition'

export default function NavBar() {
  return (
    <header className="border-b border-gray-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="text-base font-semibold">Gharpayy CRM</div>
        <nav className="flex items-center gap-2">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `${baseLinkClass} ${isActive ? 'bg-gray-100' : ''}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/leads"
            className={({ isActive }) =>
              `${baseLinkClass} ${isActive ? 'bg-gray-100' : ''}`
            }
          >
            Leads
          </NavLink>
          <NavLink
            to="/visits"
            className={({ isActive }) =>
              `${baseLinkClass} ${isActive ? 'bg-gray-100' : ''}`
            }
          >
            Visits
          </NavLink>
          <NavLink
            to="/pipeline"
            className={({ isActive }) =>
              `${baseLinkClass} ${isActive ? 'bg-gray-100' : ''}`
            }
          >
            Pipeline
          </NavLink>
          <NavLink
            to="/followups"
            className={({ isActive }) =>
              `${baseLinkClass} ${isActive ? 'bg-gray-100' : ''}`
            }
          >
            Follow-ups
          </NavLink>
          <NavLink
            to="/leaderboard"
            className={({ isActive }) =>
              `${baseLinkClass} ${isActive ? 'bg-gray-100' : ''}`
            }
          >
            Leaderboard
          </NavLink>
          <NavLink
            to="/leads/new"
            className={({ isActive }) =>
              `${baseLinkClass} ${isActive ? 'bg-gray-100' : ''}`
            }
          >
            Create Lead
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
