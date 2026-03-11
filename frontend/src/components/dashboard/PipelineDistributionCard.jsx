import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const STAGES = [
  'New Lead',
  'Contacted',
  'Requirement Collected',
  'Property Suggested',
  'Visit Scheduled',
  'Visit Completed',
  'Booked',
  'Lost',
]

const SHORT = {
  'New Lead': 'New',
  Contacted: 'Contacted',
  'Requirement Collected': 'Requirement',
  'Property Suggested': 'Property',
  'Visit Scheduled': 'Visit',
  'Visit Completed': 'Visit',
  Booked: 'Booked',
  Lost: 'Lost',
}

export default function PipelineDistributionCard({ byStage }) {
  const data = STAGES.map((s) => ({
    stage: SHORT[s] || s,
    fullStage: s,
    count: byStage?.[s] ?? 0,
  }))

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="text-sm font-semibold">Pipeline Distribution</div>

      <div className="mt-3" style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.08)" />
            <XAxis dataKey="stage" tick={{ fill: 'rgba(0,0,0,0.45)', fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fill: 'rgba(0,0,0,0.35)', fontSize: 11 }} />
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.03)' }}
              formatter={(v, n, p) => [v, p?.payload?.fullStage || 'Stage']}
              contentStyle={{
                borderRadius: 12,
                border: '1px solid rgba(0,0,0,0.10)',
              }}
            />
            <Bar dataKey="count" fill="rgb(var(--gh-accent))" radius={[10, 10, 10, 10]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
