import Button from '../ui/Button.jsx'

const STATUS_STYLES = {
  Active: 'bg-green-50 text-green-700 border-green-200',
  Inactive: 'bg-gray-50 text-gray-700 border-gray-200',
  Maintenance: 'bg-orange-50 text-orange-700 border-orange-200',
  'Coming Soon': 'bg-blue-50 text-blue-700 border-blue-200',
}

export default function PropertiesTable({ rows, onView, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Name</th>
            <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Type</th>
            <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Address</th>
            <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">City</th>
            <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Status</th>
            <th className="border-b px-3 py-2 text-right text-xs font-semibold text-black/60">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p._id} className="hover:bg-gray-50">
              <td className="border-b px-3 py-2 text-sm font-medium text-black/80">{p.name}</td>
              <td className="border-b px-3 py-2 text-sm">{p.type || '-'}</td>
              <td className="border-b px-3 py-2 text-sm">{p.address}</td>
              <td className="border-b px-3 py-2 text-sm">{p.city}</td>
              <td className="border-b px-3 py-2 text-sm">
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${
                    STATUS_STYLES[p.status] || STATUS_STYLES.Active
                  }`}
                >
                  {p.status}
                </span>
              </td>
              <td className="border-b px-3 py-2 text-right">
                <div className="inline-flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => onView?.(p)}>
                    View
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onEdit?.(p)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onDelete?.(p)}>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
