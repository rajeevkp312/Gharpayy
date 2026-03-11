export default function LeaderboardCard({ loading, topAgent }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition hover:-translate-y-[2px] hover:shadow-[0_18px_55px_rgba(0,0,0,0.12)]">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-black/50">
            Leaderboard
          </div>
          <div className="mt-2 text-lg font-semibold tracking-tight">
            Top Performing Agent
          </div>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-black/[0.02]">
          <div className="h-2.5 w-2.5 rounded-full bg-[rgb(var(--gh-accent))]" />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <div className="text-sm text-black/60">Agent</div>
          <div className="mt-1 text-base font-semibold text-[rgb(var(--gh-black))]">
            {loading ? '-' : topAgent?.agentName || '-'}
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-black/60">Bookings</div>
          <div className="mt-1 text-3xl font-semibold tracking-tight text-[rgb(var(--gh-accent))]">
            {loading ? '-' : topAgent?.bookings ?? 0}
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-black/60">
        Focus on quality follow-ups to keep conversions high.
      </div>
    </div>
  )
}
