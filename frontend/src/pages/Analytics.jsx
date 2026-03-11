import { useEffect, useState } from 'react'
import { axiosClient } from '../api/axiosClient.js'
import Topbar from '../components/layout/Topbar.jsx'
import Button from '../components/ui/Button.jsx'

export default function Analytics({ openSidebar }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  async function load() {
    try {
      setLoading(true)
      setError('')
      const res = await axiosClient.get('/api/analytics', { params: { dateFrom, dateTo } })
      setData(res.data)
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [dateFrom, dateTo])

  const kpiCards = data?.kpis
    ? [
        { label: 'Total Leads', value: data.kpis.totalLeads, color: 'bg-blue-50 text-blue-700 border-blue-200' },
        { label: 'Total Bookings', value: data.kpis.totalBookings, color: 'bg-green-50 text-green-700 border-green-200' },
        { label: 'Total Revenue', value: `₹${(data.kpis.totalRevenue || 0).toLocaleString()}`, color: 'bg-purple-50 text-purple-700 border-purple-200' },
        { label: 'Conversion Rate', value: `${data.kpis.conversionRate}%`, color: 'bg-orange-50 text-orange-700 border-orange-200' },
        { label: 'Visits Completed', value: data.kpis.visitsCompleted, color: 'bg-teal-50 text-teal-700 border-teal-200' },
      ]
    : []

  return (
    <div>
      <Topbar title="Analytics" subtitle="Track conversions & source performance" onMenuClick={openSidebar} />

      <div className="px-4 py-4 sm:px-6 sm:py-5">
        {error ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

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
        ) : data ? (
          <>
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {kpiCards.map((kpi) => (
                <div key={kpi.label} className={`rounded-2xl border p-4 shadow-sm ${kpi.color}`}>
                  <div className="text-xs opacity-80">{kpi.label}</div>
                  <div className="mt-1 text-2xl font-semibold">{kpi.value}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                <div className="text-sm font-semibold mb-3">Leads by Status</div>
                <div className="space-y-2">
                  {data.leadsByStatus?.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <span className="text-sm">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 rounded-full bg-[rgb(var(--gh-accent))]" style={{ width: `${Math.max(item.value * 2, 4)}px` }} />
                        <span className="text-sm font-semibold w-8 text-right">{item.value}</span>
                      </div>
                    </div>
                  ))}
                  {!data.leadsByStatus?.length && <div className="text-sm text-black/50">No data</div>}
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                <div className="text-sm font-semibold mb-3">Leads by Source</div>
                <div className="space-y-2">
                  {data.leadsBySource?.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <span className="text-sm">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 rounded-full bg-blue-500" style={{ width: `${Math.max(item.value * 2, 4)}px` }} />
                        <span className="text-sm font-semibold w-8 text-right">{item.value}</span>
                      </div>
                    </div>
                  ))}
                  {!data.leadsBySource?.length && <div className="text-sm text-black/50">No data</div>}
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                <div className="text-sm font-semibold mb-3">Bookings by Status</div>
                <div className="space-y-2">
                  {data.bookingsByStatus?.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <span className="text-sm">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-black/50">₹{(item.revenue || 0).toLocaleString()}</span>
                        <span className="text-sm font-semibold w-8 text-right">{item.count}</span>
                      </div>
                    </div>
                  ))}
                  {!data.bookingsByStatus?.length && <div className="text-sm text-black/50">No data</div>}
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                <div className="text-sm font-semibold mb-3">Visit Outcomes</div>
                <div className="space-y-2">
                  {data.visitOutcomes?.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <span className="text-sm">{item.name}</span>
                      <span className="text-sm font-semibold">{item.value}</span>
                    </div>
                  ))}
                  {!data.visitOutcomes?.length && <div className="text-sm text-black/50">No data</div>}
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm lg:col-span-2">
                <div className="text-sm font-semibold mb-3">Agent Performance (Leads Assigned)</div>
                <div className="space-y-2">
                  {data.agentPerformance?.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <span className="text-sm">{item.name}</span>
                      <div className="flex items-center gap-2 flex-1 mx-4">
                        <div className="h-2 rounded-full bg-green-500 flex-1" style={{ maxWidth: `${Math.min(item.leads * 10, 200)}px` }} />
                      </div>
                      <span className="text-sm font-semibold w-8 text-right">{item.leads}</span>
                    </div>
                  ))}
                  {!data.agentPerformance?.length && <div className="text-sm text-black/50">No data</div>}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
