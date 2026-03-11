import { useEffect, useMemo, useState } from 'react'
import { DragDropContext, Draggable } from 'react-beautiful-dnd'

import { axiosClient } from '../api/axiosClient.js'
import Topbar from './layout/Topbar.jsx'
import PipelineColumn from './PipelineColumn.jsx'
import PremiumLeadCard from './pipeline/PremiumLeadCard.jsx'

const STATUSES = [
  'New Lead',
  'Contacted',
  'Requirement Collected',
  'Property Suggested',
  'Visit Scheduled',
  'Visit Completed',
  'Booked',
  'Lost',
]

export default function PipelineBoard({ openSidebar }) {
  const [pipeline, setPipeline] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const columns = useMemo(() => {
    const base = {}
    for (const s of STATUSES) base[s] = []

    if (!pipeline) return base

    for (const s of STATUSES) {
      base[s] = Array.isArray(pipeline[s]) ? pipeline[s] : []
    }

    return base
  }, [pipeline])

  async function refresh() {
    const res = await axiosClient.get('/api/pipeline')
    setPipeline(res.data)
  }

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        setLoading(true)
        setError('')
        await refresh()
      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || e.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [])

  async function onDragEnd(result) {
    const { destination, source, draggableId } = result

    if (!destination) return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const fromStatus = source.droppableId
    const toStatus = destination.droppableId

    if (fromStatus === toStatus) {
      return
    }

    const current = columns[fromStatus]
    const lead = current.find((l) => l._id === draggableId)

    if (!lead) return

    const prevPipeline = pipeline

    try {
      const next = { ...columns }
      next[fromStatus] = [...next[fromStatus]].filter((l) => l._id !== draggableId)
      next[toStatus] = [{ ...lead, status: toStatus }, ...next[toStatus]]

      setPipeline(next)

      await axiosClient.patch(`/api/leads/${draggableId}`, { status: toStatus })
    } catch (e) {
      setPipeline(prevPipeline)
      setError(e?.response?.data?.message || e.message)
    }
  }

  return (
    <div>
      <Topbar
        title="Pipeline"
        onMenuClick={openSidebar}
        action={{
          label: 'Refresh',
          onClick: () => {
            setError('')
            setLoading(true)
            refresh()
              .catch((e) => setError(e?.response?.data?.message || e.message))
              .finally(() => setLoading(false))
          },
        }}
      />

      <div className="px-4 py-4 sm:px-6 sm:py-5 overflow-x-auto">
        {loading ? <p className="mt-4">Loading...</p> : null}
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        {!loading ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 pb-4">
              {STATUSES.map((status) => (
                <PipelineColumn
                  key={status}
                  status={status}
                  count={columns[status]?.length ?? 0}
                >
                  {columns[status].map((lead, index) => (
                    <Draggable key={lead._id} draggableId={lead._id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            opacity: snapshot.isDragging ? 0.9 : 1,
                          }}
                        >
                          <PremiumLeadCard lead={lead} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                </PipelineColumn>
              ))}
            </div>
          </DragDropContext>
        ) : null}
      </div>
    </div>
  )
}
