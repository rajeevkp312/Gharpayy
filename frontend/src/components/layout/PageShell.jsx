import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import FloatingActionButton from './FloatingActionButton.jsx'

export default function PageShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[rgb(var(--gh-bg))]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="min-w-0 flex-1 overflow-y-auto scrollbar-hide">
          {typeof children === 'function'
            ? children({ openSidebar: () => setSidebarOpen(true) })
            : children}
        </div>
      </div>

      <FloatingActionButton
        onClick={() => {
          navigate('/leads/new')
        }}
      />
    </div>
  )
}
