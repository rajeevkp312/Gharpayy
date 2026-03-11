import { useEffect, useState } from 'react'
import { axiosClient } from '../api/axiosClient.js'
import VisitModal from '../components/VisitModal.jsx'
import LeadTimeline from '../components/LeadTimeline.jsx'
import Topbar from '../components/layout/Topbar.jsx'
import Button from '../components/ui/Button.jsx'

export default function Leads({ openSidebar }) {
  const [leads, setLeads] = useState([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [visitOpen, setVisitOpen] = useState(false)
  const [visitLeadId, setVisitLeadId] = useState('')
  const [timelineLeadId, setTimelineLeadId] = useState('')

  function formatDate(value) {
    if (!value) return ''
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return ''
    return d.toLocaleString()
  }

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        setLoading(true)
        const res = await axiosClient.get('/api/leads')
        if (mounted) setLeads(res.data)
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
      <Topbar
        title="Leads"
        onMenuClick={openSidebar}
        action={{
          label: 'Add Lead',
          onClick: () => {
            window.location.href = '/leads/new'
          },
        }}
      />

      <div className="px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="text-xs uppercase tracking-[0.18em] text-black/50">Search</div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or phone"
                className="mt-2 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-black/20"
              />
            </div>

            <div className="w-full md:w-64">
              <div className="text-xs uppercase tracking-[0.18em] text-black/50">Status</div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-2 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-black/20"
              >
                <option value="">All</option>
                <option value="New Lead">New Lead</option>
                <option value="Contacted">Contacted</option>
                <option value="Requirement Collected">Requirement Collected</option>
                <option value="Property Suggested">Property Suggested</option>
                <option value="Visit Scheduled">Visit Scheduled</option>
                <option value="Visit Completed">Visit Completed</option>
                <option value="Booked">Booked</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setQuery('')
                setStatus('')
              }}
            >
              Reset
            </Button>
          </div>
        </div>

        {loading ? <p className="mt-6 text-sm text-black/60">Loading...</p> : null}
        {error ? <p className="mt-6 text-sm text-red-600">{error}</p> : null}

        {!loading && !error ? (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-black/10 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <table className="min-w-full">
              <thead className="bg-black/[0.02]">
              <tr>
                <th className="border-b border-black/10 px-4 py-3 text-left text-xs uppercase tracking-[0.18em] text-black/50">
                  Name
                </th>
                <th className="border-b border-black/10 px-4 py-3 text-left text-xs uppercase tracking-[0.18em] text-black/50">
                  Phone
                </th>
                <th className="border-b border-black/10 px-4 py-3 text-left text-xs uppercase tracking-[0.18em] text-black/50">
                  Source
                </th>
                <th className="border-b border-black/10 px-4 py-3 text-left text-xs uppercase tracking-[0.18em] text-black/50">
                  Assigned
                </th>
                <th className="border-b border-black/10 px-4 py-3 text-left text-xs uppercase tracking-[0.18em] text-black/50">
                  Status
                </th>
                <th className="border-b border-black/10 px-4 py-3 text-left text-xs uppercase tracking-[0.18em] text-black/50">
                  Created
                </th>
                <th className="border-b border-black/10 px-4 py-3 text-left text-xs uppercase tracking-[0.18em] text-black/50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {leads
                .filter((lead) => {
                  if (status && lead.status !== status) return false
                  if (!query) return true
                  const q = query.toLowerCase()
                  return (
                    lead.name?.toLowerCase().includes(q) ||
                    lead.phone?.toLowerCase().includes(q)
                  )
                })
                .map((lead) => (
                  <tr key={lead._id} className="transition hover:bg-black/[0.02]">
                    <td className="border-b border-black/10 px-4 py-3 text-sm font-medium">
                      {lead.name}
                    </td>
                    <td className="border-b border-black/10 px-4 py-3 text-sm text-black/70">
                      {lead.phone}
                    </td>
                    <td className="border-b border-black/10 px-4 py-3 text-sm text-black/70">
                      <span className="rounded-full border border-black/10 bg-black/5 px-2 py-1 text-xs">
                        {lead.source}
                      </span>
                    </td>
                    <td className="border-b border-black/10 px-4 py-3 text-sm text-black/70">
                      {lead.assignedAgent?.name || '-'}
                    </td>
                    <td className="border-b border-black/10 px-4 py-3 text-sm">
                      <span className="rounded-full border border-black/10 bg-white px-2 py-1 text-xs text-black/70">
                        {lead.status}
                      </span>
                    </td>
                    <td className="border-b border-black/10 px-4 py-3 text-sm text-black/70">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="border-b border-black/10 px-4 py-3 text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setVisitLeadId(lead._id)
                          setVisitOpen(true)
                        }}
                      >
                        Schedule
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                        onClick={() => setTimelineLeadId(lead._id)}
                      >
                        Timeline
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : null}

        {timelineLeadId ? (
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs uppercase tracking-[0.18em] text-black/50">
                Selected Lead
              </div>
              <Button variant="ghost" onClick={() => setTimelineLeadId('')}>
                Close
              </Button>
            </div>
            <LeadTimeline leadId={timelineLeadId} />
          </div>
        ) : null}

      <VisitModal
        open={visitOpen}
        defaultLeadId={visitLeadId}
        onClose={() => setVisitOpen(false)}
      />
      </div>
    </div>
  )
}
