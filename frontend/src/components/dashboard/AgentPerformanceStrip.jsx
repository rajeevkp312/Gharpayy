export default function AgentPerformanceStrip({ topAgent }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="text-sm font-semibold">Agent Performance</div>

      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="flex items-center justify-between rounded-2xl border border-black/10 bg-black/[0.01] p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(var(--gh-accent),0.12)] text-sm font-semibold text-[rgb(var(--gh-accent))]">
              {topAgent?.agentName ? topAgent.agentName.slice(0, 1).toUpperCase() : 'A'}
            </div>
            <div>
              <div className="text-sm font-semibold text-black/80">
                {topAgent?.agentName || 'Top Agent'}
              </div>
              <div className="mt-1 text-xs text-black/50">
                {topAgent ? `${topAgent.totalLeads} active · ${topAgent.visitsScheduled} visits · ${topAgent.bookings} booked` : 'No data yet'}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-lg font-semibold text-black/80">
              {topAgent?.bookings ? `${Math.round((topAgent.bookings / Math.max(1, topAgent.totalLeads)) * 100)}%` : '0%'}
            </div>
            <div className="text-xs text-black/40">conversion</div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-black/10 bg-black/[0.01] p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-sm font-semibold text-black/60">
              R
            </div>
            <div>
              <div className="text-sm font-semibold text-black/60">Runner-up</div>
              <div className="mt-1 text-xs text-black/40">
                Add more agents to compare performance.
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-lg font-semibold text-black/60">—</div>
            <div className="text-xs text-black/40">conversion</div>
          </div>
        </div>
      </div>
    </div>
  )
}
