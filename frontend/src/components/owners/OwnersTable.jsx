import Button from '../ui/Button.jsx'

export default function OwnersTable({ rows, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Name</th>
            <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Phone</th>
            <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Email</th>
            <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">City</th>
            <th className="border-b px-3 py-2 text-right text-xs font-semibold text-black/60">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((o) => (
            <tr key={o._id} className="hover:bg-gray-50">
              <td className="border-b px-3 py-2 text-sm font-medium text-black/80">{o.name}</td>
              <td className="border-b px-3 py-2 text-sm">{o.phone}</td>
              <td className="border-b px-3 py-2 text-sm">{o.email || '-'}</td>
              <td className="border-b px-3 py-2 text-sm">{o.city || '-'}</td>
              <td className="border-b px-3 py-2 text-right">
                <div className="inline-flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => onEdit?.(o)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onDelete?.(o)}>
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
