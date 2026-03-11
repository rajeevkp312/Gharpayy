import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export default function DashboardCharts({ byStage }) {
  const data = byStage
    ? Object.entries(byStage).map(([stage, count]) => ({ stage, count }))
    : []

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      <div className="text-xs uppercase tracking-[0.18em] text-black/50">
        Pipeline Status
      </div>
      <div className="mt-2 text-lg font-semibold tracking-tight">Lead Distribution</div>

      <div className="mt-4" style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stage" hide />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="rgb(var(--gh-accent))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 text-xs text-black/50">
        Hover the bars for stage names.
      </div>
    </div>
  )
}
