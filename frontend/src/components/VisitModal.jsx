import { useEffect, useState } from 'react'
import { axiosClient } from '../api/axiosClient.js'

export default function VisitModal({ open, onClose, defaultLeadId, onCreated }) {
  const [leads, setLeads] = useState([])
  const [agents, setAgents] = useState([])

  const [leadId, setLeadId] = useState(defaultLeadId || '')
  const [propertyName, setPropertyName] = useState('')
  const [visitDate, setVisitDate] = useState('')
  const [visitTime, setVisitTime] = useState('')
  const [agentId, setAgentId] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setLeadId(defaultLeadId || '')
      setError('')
    }
  }, [open, defaultLeadId])

  useEffect(() => {
    if (!open) return

    let mounted = true

    async function load() {
      try {
        const [leadsRes, agentsRes] = await Promise.all([
          axiosClient.get('/api/leads'),
          axiosClient.get('/api/agents'),
        ])

        if (!mounted) return

        setLeads(leadsRes.data)
        setAgents(agentsRes.data)

        if (!defaultLeadId && leadsRes.data?.length && !leadId) {
          setLeadId(leadsRes.data[0]._id)
        }

        if (agentsRes.data?.length && !agentId) {
          setAgentId(agentsRes.data[0]._id)
        }
      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || e.message)
      }
    }

    load()

    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      setLoading(true)
      await axiosClient.post('/api/visits', {
        leadId,
        propertyName,
        visitDate,
        visitTime,
        agentId,
      })

      onCreated?.()
      onClose?.()

      setPropertyName('')
      setVisitDate('')
      setVisitTime('')
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-2xl border border-black/10 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.20)]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-black/50">
              Visit Scheduling
            </div>
            <div className="mt-1 text-lg font-semibold tracking-tight">
              Schedule Visit
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md border border-black/10 px-3 py-2 text-sm text-black/70 hover:bg-black/5 transition"
            type="button"
          >
            Close
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium">Select Lead</label>
            <select
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a lead
              </option>
              {leads.map((l) => (
                <option key={l._id} value={l._id}>
                  {l.name} ({l.phone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Property Name</label>
            <input
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
              placeholder="Indiranagar PG"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">Visit Date</label>
              <input
                type="date"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Visit Time</label>
              <input
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                value={visitTime}
                onChange={(e) => setVisitTime(e.target.value)}
                placeholder="11:00 AM"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Agent</label>
            <select
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              required
            >
              <option value="" disabled>
                Select an agent
              </option>
              {agents.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex items-center gap-2 pt-2">
            <button
              disabled={loading}
              type="submit"
              className="rounded-md bg-[rgb(var(--gh-accent))] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:shadow-md hover:-translate-y-[1px] disabled:opacity-60"
            >
              {loading ? 'Scheduling...' : 'Schedule'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-black/10 px-4 py-2 text-sm font-medium text-black/70 hover:bg-black/5 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
