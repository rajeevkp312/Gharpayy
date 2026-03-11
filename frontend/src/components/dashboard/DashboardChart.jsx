import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export default function DashboardChart({ title = 'Lead Distribution', byStage }) {
  const data = byStage
    ? Object.entries(byStage).map(([stage, count]) => ({ stage, count }))
    : []

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-black/50">
            Pipeline
          </div>
          <div className="mt-2 text-lg font-semibold tracking-tight">{title}</div>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-black/[0.02]">
          <div className="h-2.5 w-2.5 rounded-full bg-[rgb(var(--gh-accent))]" />
        </div>
      </div>

      <div className="mt-5" style={{ width: '100%', height: 340 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ left: 4, right: 10, top: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
            <XAxis dataKey="stage" hide />
            <YAxis allowDecimals={false} stroke="rgba(0,0,0,0.35)" />
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.04)' }}
              contentStyle={{
                borderRadius: 12,
                border: '1px solid rgba(0,0,0,0.10)',
              }}
            />
            <Bar
              dataKey="count"
              fill="rgb(var(--gh-accent))"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 text-xs text-black/50">Hover to see stage names.</div>
    </div>
  )
}
