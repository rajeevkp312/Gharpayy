import { useEffect, useState } from 'react'
import { axiosClient } from '../api/axiosClient.js'
import Topbar from '../components/layout/Topbar.jsx'
import Button from '../components/ui/Button.jsx'

export default function Effort({ openSidebar }) {
  const [agents, setAgents] = useState([])
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [callsMade, setCallsMade] = useState('')
  const [messagesSent, setMessagesSent] = useState('')
  const [visitsScheduled, setVisitsScheduled] = useState('')
  const [visitsCompleted, setVisitsCompleted] = useState('')
  const [leadsAssigned, setLeadsAssigned] = useState('')
  const [leadsContacted, setLeadsContacted] = useState('')
  const [notes, setNotes] = useState('')

  async function loadData() {
    try {
      setLoading(true)
      setError('')
      const [agentsRes, effortsRes] = await Promise.all([
        axiosClient.get('/api/agents'),
        axiosClient.get('/api/efforts', { params: { dateFrom, dateTo } }),
      ])
      setAgents(agentsRes.data || [])
      setRows(effortsRes.data || [])
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [dateFrom, dateTo])

  async function onSubmit(e) {
    e.preventDefault()
    try {
      setError('')
      await axiosClient.post('/api/efforts', {
        agentId: selectedAgent,
        date: selectedDate,
        callsMade: Number(callsMade || 0),
        messagesSent: Number(messagesSent || 0),
        visitsScheduled: Number(visitsScheduled || 0),
        visitsCompleted: Number(visitsCompleted || 0),
        leadsAssigned: Number(leadsAssigned || 0),
        leadsContacted: Number(leadsContacted || 0),
        notes,
      })
      setShowForm(false)
      await loadData()
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
    }
  }

  const totals = rows.reduce(
    (acc, r) => ({
      calls: acc.calls + (r.callsMade || 0),
      messages: acc.messages + (r.messagesSent || 0),
      visitsScheduled: acc.visitsScheduled + (r.visitsScheduled || 0),
      visitsCompleted: acc.visitsCompleted + (r.visitsCompleted || 0),
      leadsAssigned: acc.leadsAssigned + (r.leadsAssigned || 0),
      leadsContacted: acc.leadsContacted + (r.leadsContacted || 0),
    }),
    { calls: 0, messages: 0, visitsScheduled: 0, visitsCompleted: 0, leadsAssigned: 0, leadsContacted: 0 },
  )

  return (
    <div>
      <Topbar
        title="Effort"
        subtitle="Agent activity & effort tracking"
        onMenuClick={openSidebar}
        action={{
          label: 'Log Effort',
          onClick: () => {
            setShowForm(true)
            setSelectedAgent(agents[0]?._id || '')
          },
        }}
      />

      <div className="px-4 py-4 sm:px-6 sm:py-5">
        {error ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="text-xs text-black/50">Calls Made</div>
            <div className="mt-1 text-2xl font-semibold">{totals.calls}</div>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="text-xs text-black/50">Messages</div>
            <div className="mt-1 text-2xl font-semibold">{totals.messages}</div>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="text-xs text-black/50">Visits Scheduled</div>
            <div className="mt-1 text-2xl font-semibold">{totals.visitsScheduled}</div>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="text-xs text-black/50">Visits Completed</div>
            <div className="mt-1 text-2xl font-semibold">{totals.visitsCompleted}</div>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="text-xs text-black/50">Leads Assigned</div>
            <div className="mt-1 text-2xl font-semibold">{totals.leadsAssigned}</div>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="text-xs text-black/50">Leads Contacted</div>
            <div className="mt-1 text-2xl font-semibold">{totals.leadsContacted}</div>
          </div>
        </div>

        <div className="mb-4 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
            <div className="flex items-end">
              <Button variant="ghost" onClick={() => { setDateFrom(''); setDateTo('') }}>
                Reset Dates
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
                  <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Date</th>
                  <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Agent</th>
                  <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Calls</th>
                  <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Msgs</th>
                  <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Visits (S/C)</th>
                  <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Leads (A/C)</th>
                  <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Notes</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50">
                    <td className="border-b px-3 py-2 text-sm">{r.date}</td>
                    <td className="border-b px-3 py-2 text-sm font-medium">{r.agent?.name || '-'}</td>
                    <td className="border-b px-3 py-2 text-sm">{r.callsMade || 0}</td>
                    <td className="border-b px-3 py-2 text-sm">{r.messagesSent || 0}</td>
                    <td className="border-b px-3 py-2 text-sm">{r.visitsScheduled || 0} / {r.visitsCompleted || 0}</td>
                    <td className="border-b px-3 py-2 text-sm">{r.leadsAssigned || 0} / {r.leadsContacted || 0}</td>
                    <td className="border-b px-3 py-2 text-sm max-w-xs truncate">{r.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-black/10 bg-white p-6 text-center shadow-sm">
            <div className="text-sm text-black/60">No effort data yet.</div>
            <Button className="mt-2" variant="gold" size="sm" onClick={() => setShowForm(true)}>
              Log First Entry
            </Button>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-3 sm:items-center">
            <div className="w-full max-w-2xl rounded-2xl border border-black/10 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
                <div className="text-sm font-semibold">Log Effort</div>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-black/10 px-2 py-1 text-sm text-black/70"
                >
                  Close
                </button>
              </div>
              <form onSubmit={onSubmit} className="p-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <div className="text-xs font-semibold text-black/60">Agent</div>
                    <select
                      value={selectedAgent}
                      onChange={(e) => setSelectedAgent(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                    >
                      {agents.map((a) => (
                        <option key={a._id} value={a._id}>{a.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-black/60">Date</div>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-black/60">Calls Made</div>
                    <input
                      type="number"
                      value={callsMade}
                      onChange={(e) => setCallsMade(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-black/60">Messages Sent</div>
                    <input
                      type="number"
                      value={messagesSent}
                      onChange={(e) => setMessagesSent(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-black/60">Visits Scheduled</div>
                    <input
                      type="number"
                      value={visitsScheduled}
                      onChange={(e) => setVisitsScheduled(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-black/60">Visits Completed</div>
                    <input
                      type="number"
                      value={visitsCompleted}
                      onChange={(e) => setVisitsCompleted(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-black/60">Leads Assigned</div>
                    <input
                      type="number"
                      value={leadsAssigned}
                      onChange={(e) => setLeadsAssigned(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-black/60">Leads Contacted</div>
                    <input
                      type="number"
                      value={leadsContacted}
                      onChange={(e) => setLeadsContacted(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <div className="text-xs font-semibold text-black/60">Notes</div>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      className="mt-1 w-full resize-none rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="gold">
                    Save
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
