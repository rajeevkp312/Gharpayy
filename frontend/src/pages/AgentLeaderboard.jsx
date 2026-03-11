import { useEffect, useState } from 'react'
import { axiosClient } from '../api/axiosClient.js'
import Topbar from '../components/layout/Topbar.jsx'

export default function AgentLeaderboard({ openSidebar }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        setLoading(true)
        setError('')
        const res = await axiosClient.get('/api/agents/performance')
        if (mounted) setRows(res.data)
      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || e.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div>
      <Topbar title="Agent Leaderboard" onMenuClick={openSidebar} />

      <div className="px-4 py-4 sm:px-6 sm:py-5">
        {loading ? <p className="mt-4">Loading...</p> : null}
        {error ? <p className="mt-4 text-red-600">{error}</p> : null}

        {!loading && !error ? (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-black/10 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="border-b px-3 py-2 text-left text-sm">Agent</th>
                <th className="border-b px-3 py-2 text-left text-sm">Leads Assigned</th>
                <th className="border-b px-3 py-2 text-left text-sm">Leads Contacted</th>
                <th className="border-b px-3 py-2 text-left text-sm">Visits Scheduled</th>
                <th className="border-b px-3 py-2 text-left text-sm">Bookings</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.agentId} className="hover:bg-gray-50">
                  <td className="border-b px-3 py-2 text-sm">{r.agentName}</td>
                  <td className="border-b px-3 py-2 text-sm">{r.totalLeads}</td>
                  <td className="border-b px-3 py-2 text-sm">{r.leadsContacted}</td>
                  <td className="border-b px-3 py-2 text-sm">{r.visitsScheduled}</td>
                  <td className="border-b px-3 py-2 text-sm font-semibold">{r.bookings}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        ) : null}
      </div>
    </div>
  )
}
