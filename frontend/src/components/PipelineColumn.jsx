import { Droppable } from 'react-beautiful-dnd'

export default function PipelineColumn({ status, count = 0, children }) {
  return (
    <div className="flex w-80 flex-col rounded-2xl border border-black/10 bg-white/60 backdrop-blur shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      <div className="border-b border-black/10 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-black/50">Stage</div>
            <div className="mt-1 text-sm font-semibold tracking-tight">{status}</div>
          </div>

          <div className="mt-1 inline-flex items-center rounded-full border border-black/10 bg-white px-2.5 py-1 text-xs font-medium text-black/70">
            {count}
          </div>
        </div>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 space-y-3 p-4 ${snapshot.isDraggingOver ? 'bg-black/5' : ''}`}
            style={{ minHeight: 80 }}
          >
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
