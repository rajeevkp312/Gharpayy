import { useEffect, useState } from 'react'
import { axiosClient } from '../api/axiosClient.js'
import Topbar from '../components/layout/Topbar.jsx'
import Button from '../components/ui/Button.jsx'

const TYPE_OPTIONS = ['', 'leads', 'bookings', 'visits']

export default function Historical({ openSidebar }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [type, setType] = useState('')
  const [agentId, setAgentId] = useState('')
  const [agents, setAgents] = useState([])

  async function load() {
    try {
      setLoading(true)
      setError('')
      const [dataRes, agentsRes] = await Promise.all([
        axiosClient.get('/api/historical', { params: { dateFrom, dateTo, type, agentId } }),
        axiosClient.get('/api/agents'),
      ])
      setRows(dataRes.data || [])
      setAgents(agentsRes.data || [])
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [dateFrom, dateTo, type, agentId])

  async function onExport() {
    try {
      const res = await axiosClient.get('/api/historical/export', {
        params: { dateFrom, dateTo, type },
        responseType: 'blob',
      })
      const blob = new Blob([res.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'historical-report.csv'
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (e) {
      setError('Export failed')
    }
  }

  return (
    <div>
      <Topbar
        title="Historical"
        subtitle="Review past performance"
        onMenuClick={openSidebar}
        action={{ label: 'Export CSV', onClick: onExport }}
      />

      <div className="px-4 py-4 sm:px-6 sm:py-5">
        {error ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mb-4 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-black/50">From</div>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
              />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-black/50">To</div>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
              />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-black/50">Type</div>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
              >
                {TYPE_OPTIONS.map((t) => (
                  <option key={t || 'all'} value={t}>
                    {t ? t.charAt(0).toUpperCase() + t.slice(1) : 'All Types'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-black/50">Agent</div>
              <select
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
              >
                <option value="">All Agents</option>
                {agents.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="ghost" onClick={() => { setDateFrom(''); setDateTo(''); setType(''); setAgentId('') }}>
                Reset
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/60 shadow-sm">
            Loading...
          </div>
        ) : rows.length ? (
          <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Type</th>
                  <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Date</th>
                  <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Title</th>
                  <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Details</th>
                  <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Agent</th>
                  <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="border-b px-3 py-2 text-sm">
                      <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${
                        r.type === 'Lead' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        r.type === 'Booking' ? 'bg-green-50 text-green-700 border-green-200' :
                        r.type === 'Visit' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        'bg-gray-50 text-gray-700 border-gray-200'
                      }`}>
                        {r.type}
                      </span>
                    </td>
                    <td className="border-b px-3 py-2 text-sm">{new Date(r.date).toLocaleDateString()}</td>
                    <td className="border-b px-3 py-2 text-sm font-medium">{r.title}</td>
                    <td className="border-b px-3 py-2 text-sm">{r.subtitle}</td>
                    <td className="border-b px-3 py-2 text-sm">{r.agent}</td>
                    <td className="border-b px-3 py-2 text-sm">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-black/10 bg-white p-6 text-center shadow-sm">
            <div className="text-sm text-black/60">No historical data found.</div>
            <div className="mt-2 text-xs text-black/50">Try adjusting your filters.</div>
          </div>
        )}
      </div>
    </div>
  )
}
