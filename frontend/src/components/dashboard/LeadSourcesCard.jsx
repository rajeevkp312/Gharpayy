import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = [
  '#2563EB',
  '#F97316',
  '#10B981',
  '#EF4444',
  '#A855F7',
  '#F59E0B',
  '#06B6D4',
]

function toTitle(s) {
  if (!s) return ''
  return String(s)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase())
}

export default function LeadSourcesCard({ leads }) {
  const counts = {}
  for (const l of leads || []) {
    const k = l.source || 'unknown'
    counts[k] = (counts[k] || 0) + 1
  }

  const data = Object.entries(counts)
    .map(([source, count]) => ({ source, name: toTitle(source), count }))
    .sort((a, b) => b.count - a.count)

  return (
    <div className="relative rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="text-sm font-semibold">Lead Sources</div>

      <div className="mt-2" style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <PieChart>
            <Tooltip
              formatter={(v, n, p) => [v, p?.payload?.name || 'Source']}
              contentStyle={{
                borderRadius: 12,
                border: '1px solid rgba(0,0,0,0.10)',
              }}
            />
            <Pie
              data={data}
              dataKey="count"
              nameKey="name"
              innerRadius={62}
              outerRadius={86}
              paddingAngle={2}
            >
              {data.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-2 text-xs text-black/60">
        {data.slice(0, 6).map((d, idx) => (
          <div key={d.source} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
            />
            <span>{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
