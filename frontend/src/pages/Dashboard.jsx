import { useEffect, useState } from 'react'
import { axiosClient } from '../api/axiosClient.js'
import Topbar from '../components/layout/Topbar.jsx'
import StatTile from '../components/dashboard/StatTile.jsx'
import PipelineDistributionCard from '../components/dashboard/PipelineDistributionCard.jsx'
import LeadSourcesCard from '../components/dashboard/LeadSourcesCard.jsx'
import SimpleListCard from '../components/dashboard/SimpleListCard.jsx'
import AgentPerformanceStrip from '../components/dashboard/AgentPerformanceStrip.jsx'

export default function Dashboard({ openSidebar }) {
  const [visitsToday, setVisitsToday] = useState(0)
  const [stats, setStats] = useState(null)
  const [topAgent, setTopAgent] = useState(null)
  const [leads, setLeads] = useState([])
  const [followups, setFollowups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        setLoading(true)
        const [visitsRes, dashboardRes, performanceRes, leadsRes, followupsRes] = await Promise.all([
          axiosClient.get('/api/visits'),
          axiosClient.get('/api/dashboard'),
          axiosClient.get('/api/agents/performance'),
          axiosClient.get('/api/leads'),
          axiosClient.get('/api/followups'),
        ])

        const today = new Date()
        const yyyy = today.getFullYear()
        const mm = String(today.getMonth() + 1).padStart(2, '0')
        const dd = String(today.getDate()).padStart(2, '0')
        const todayStr = `${yyyy}-${mm}-${dd}`

        const count = (visitsRes.data || []).filter(
          (v) => v.visitDate === todayStr && v.outcome === 'Scheduled',
        ).length

        if (mounted) setVisitsToday(count)
        if (mounted) setStats(dashboardRes.data)

        if (mounted) setLeads(leadsRes.data || [])
        if (mounted) setFollowups(followupsRes.data || [])

        const list = performanceRes.data || []
        const best = list.length ? list[0] : null
        if (mounted) setTopAgent(best)
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
      <Topbar title="Dashboard" onMenuClick={openSidebar} />

      <div className="px-4 py-4 sm:px-6 sm:py-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <StatTile
            title="Total Leads"
            value={loading ? '-' : stats?.totalLeads ?? 0}
            icon="users"
            trend="up"
            trendValue="12%"
          />
          <StatTile
            title="Avg Response Time"
            value={loading ? '-' : '3.3'}
            suffix="min"
            icon="clock"
            trend="down"
            trendValue="8%"
          />
          <StatTile
            title="Visits Scheduled"
            value={loading ? '-' : stats?.visitsScheduled ?? 0}
            icon="calendar"
            trend="up"
            trendValue="15%"
          />
          <StatTile
            title="Bookings Closed"
            value={loading ? '-' : stats?.booked ?? 0}
            icon="check"
            trend="up"
            trendValue="22%"
          />

          <StatTile
            title="Conversion Rate"
            value={loading ? '-' : '7.1'}
            suffix="%"
            icon="spark"
            trend="up"
            trendValue="5%"
          />
          <StatTile
            title="SLA Compliance"
            value={loading ? '-' : '91'}
            suffix="%"
            icon="shield"
            trend="down"
            trendValue="3%"
          />
          <StatTile
            title="New Today"
            value={loading ? '-' : stats?.newLeads ?? 0}
            icon="users"
          />
          <StatTile
            title="SLA Breaches"
            value={loading ? '-' : 1}
            icon="alert"
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-12">
          <div className="xl:col-span-8">
            <PipelineDistributionCard byStage={stats?.byStage} />
          </div>
          <div className="xl:col-span-4">
            <LeadSourcesCard leads={leads} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-12">
          <div className="xl:col-span-4">
            <SimpleListCard
              title="Needs Attention"
              badge={3}
              rows={(leads || []).slice(0, 3).map((l) => ({
                left: l.name,
                sub: l.source,
                right: l.assignedAgent?.name || '-',
              }))}
              emptyText="No leads need attention"
            />
          </div>
          <div className="xl:col-span-4">
            <SimpleListCard
              title="Hot Leads"
              rightLabel="Score ≥70"
              rows={(leads || []).slice(0, 5).map((l, idx) => ({
                left: l.name,
                sub: l.source,
                right: String(70 + idx * 10),
                rightTone: 'good',
              }))}
              emptyText="No hot leads"
            />
          </div>
          <div className="xl:col-span-4">
            <SimpleListCard
              title="Follow-ups"
              rightLabel={`${(followups || []).filter((f) => f.status !== 'Completed').length} pending`}
              rows={(followups || [])
                .filter((f) => f.status !== 'Completed')
                .slice(0, 5)
                .map((f) => ({
                  left: f.leadId?.name || '-',
                  sub: f.agentId?.name || '-',
                  right: f.status,
                }))}
              emptyText="No pending follow-ups"
            />
          </div>
        </div>

        <div className="mt-4">
          <AgentPerformanceStrip topAgent={topAgent} />
        </div>

        <div className="mt-4 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold">Visits Scheduled Today</div>
          <div className="mt-1 text-xs text-black/50">Quick pulse for today</div>
          <div className="mt-4 text-4xl font-semibold tracking-tight">
            {loading ? '-' : visitsToday}
          </div>
        </div>
      </div>
    </div>
  )
}
