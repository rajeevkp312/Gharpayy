export default function VisitsTodayCard({ loading, value }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition hover:-translate-y-[2px] hover:shadow-[0_18px_55px_rgba(0,0,0,0.12)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(650px_circle_at_15%_15%,rgba(var(--gh-accent),0.22),transparent_55%),linear-gradient(135deg,rgba(17,17,17,0.06),transparent_55%)]" />
      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-black/50">
              Today
            </div>
            <div className="mt-2 text-lg font-semibold tracking-tight">
              Visits Scheduled
            </div>
          </div>

          <div className="rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-xs font-medium text-black/70 backdrop-blur">
            Highlight
          </div>
        </div>

        <div className="mt-6 flex items-baseline gap-2">
          <div className="text-5xl font-semibold tracking-tight text-[rgb(var(--gh-black))]">
            {loading ? '-' : value}
          </div>
          <div className="text-sm text-black/60">visits</div>
        </div>

        <div className="mt-3 text-sm text-black/60">
          Keep the team aligned — plan the day with clarity.
        </div>
      </div>

      <div className="h-1.5 w-full bg-black/5">
        <div className="h-full w-2/3 bg-[rgb(var(--gh-accent))]" />
      </div>
    </div>
  )
}
