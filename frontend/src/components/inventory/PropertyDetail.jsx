import { useEffect, useState } from 'react'
import { axiosClient } from '../../api/axiosClient.js'
import Button from '../ui/Button.jsx'

const ROOM_TYPES = ['Single', 'Double', 'Triple', 'Quad', 'Dormitory', 'Studio', 'Suite']
const BED_TYPES = ['Single', 'Double', 'Bunk Upper', 'Bunk Lower', 'Queen', 'King']
const BED_STATUSES = ['Available', 'Occupied', 'Maintenance', 'Reserved', 'Blocked']

export default function PropertyDetail({ property, onClose, onChange }) {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showAddRoom, setShowAddRoom] = useState(false)
  const [roomName, setRoomName] = useState('')
  const [roomFloor, setRoomFloor] = useState('1')
  const [roomType, setRoomType] = useState('Double')

  const [showAddBed, setShowAddBed] = useState(false)
  const [selectedRoomId, setSelectedRoomId] = useState('')
  const [bedName, setBedName] = useState('')
  const [bedType, setBedType] = useState('Single')
  const [bedRent, setBedRent] = useState('')
  const [bedDeposit, setBedDeposit] = useState('')

  useEffect(() => {
    loadRooms()
  }, [property._id])

  async function loadRooms() {
    try {
      setLoading(true)
      setError('')
      const res = await axiosClient.get(`/api/properties/${property._id}/rooms`)
      setRooms(res.data || [])
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
    } finally {
      setLoading(false)
    }
  }

  async function addRoom() {
    if (!roomName.trim()) return
    try {
      await axiosClient.post(`/api/properties/${property._id}/rooms`, {
        name: roomName.trim(),
        floor: roomFloor,
        roomType,
      })
      setRoomName('')
      setRoomFloor('1')
      setRoomType('Double')
      setShowAddRoom(false)
      await loadRooms()
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
    }
  }

  async function addBed() {
    if (!selectedRoomId || !bedName.trim() || !bedRent) return
    try {
      await axiosClient.post(
        `/api/properties/${property._id}/rooms/${selectedRoomId}/beds`,
        {
          name: bedName.trim(),
          bedType,
          baseRent: Number(bedRent),
          deposit: Number(bedDeposit || 0),
        },
      )
      setBedName('')
      setBedRent('')
      setBedDeposit('')
      setBedType('Single')
      setShowAddBed(false)
      await loadRooms()
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
    }
  }

  async function updateBedStatus(bedId, status) {
    try {
      await axiosClient.patch(`/api/properties/${property._id}/beds/${bedId}/status`, {
        status,
      })
      await loadRooms()
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
    }
  }

  async function deleteRoom(roomId) {
    if (!window.confirm('Delete this room and all its beds?')) return
    try {
      await axiosClient.delete(`/api/properties/${property._id}/rooms/${roomId}`)
      await loadRooms()
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
    }
  }

  async function deleteBed(bedId) {
    if (!window.confirm('Delete this bed?')) return
    try {
      await axiosClient.delete(`/api/properties/${property._id}/beds/${bedId}`)
      await loadRooms()
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-3 sm:items-center">
      <div className="h-[85vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-black/10 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
          <div>
            <div className="text-sm font-semibold">{property.name}</div>
            <div className="text-xs text-black/50">
              {property.address}, {property.city}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="gold"
              size="sm"
              onClick={() => {
                onChange?.(property)
              }}
            >
              Edit Property
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-black/10 px-2 py-1 text-sm text-black/70"
            >
              Close
            </button>
          </div>
        </div>

        <div className="p-4">
          {error ? (
            <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-semibold">Rooms & Beds</div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowAddRoom(true)}>
                + Add Room
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-sm text-black/60">Loading...</div>
          ) : (
            <div className="space-y-4">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">{room.name}</div>
                      <div className="text-xs text-black/50">
                        Floor {room.floor} · {room.roomType}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedRoomId(room._id)
                          setShowAddBed(true)
                        }}
                      >
                        + Add Bed
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteRoom(room._id)}>
                        Delete Room
                      </Button>
                    </div>
                  </div>

                  {room.beds?.length ? (
                    <div className="mt-3 overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="border-b px-3 py-2 text-left text-xs">Bed</th>
                            <th className="border-b px-3 py-2 text-left text-xs">Type</th>
                            <th className="border-b px-3 py-2 text-left text-xs">Rent</th>
                            <th className="border-b px-3 py-2 text-left text-xs">Status</th>
                            <th className="border-b px-3 py-2 text-right text-xs">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {room.beds.map((bed) => (
                            <tr key={bed._id} className="hover:bg-gray-50">
                              <td className="border-b px-3 py-2">{bed.name}</td>
                              <td className="border-b px-3 py-2">{bed.bedType}</td>
                              <td className="border-b px-3 py-2">
                                ₹{Number(bed.baseRent).toLocaleString()}
                              </td>
                              <td className="border-b px-3 py-2">
                                <select
                                  value={bed.status}
                                  onChange={(e) => updateBedStatus(bed._id, e.target.value)}
                                  className="rounded border border-black/10 bg-white px-2 py-1 text-xs"
                                >
                                  {BED_STATUSES.map((s) => (
                                    <option key={s} value={s}>
                                      {s}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="border-b px-3 py-2 text-right">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteBed(bed._id)}
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="mt-3 text-xs text-black/50">No beds in this room yet.</div>
                  )}
                </div>
              ))}

              {!rooms.length && (
                <div className="rounded-2xl border border-black/10 bg-white p-6 text-center shadow-sm">
                  <div className="text-sm text-black/60">No rooms yet.</div>
                  <Button
                    className="mt-2"
                    variant="gold"
                    size="sm"
                    onClick={() => setShowAddRoom(true)}
                  >
                    Add First Room
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {showAddRoom && (
          <div className="border-t border-black/10 p-4">
            <div className="text-sm font-semibold">Add Room</div>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
              <input
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Room name"
                className="rounded-xl border border-black/10 px-3 py-2 text-sm"
              />
              <input
                value={roomFloor}
                onChange={(e) => setRoomFloor(e.target.value)}
                placeholder="Floor"
                className="rounded-xl border border-black/10 px-3 py-2 text-sm"
              />
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="rounded-xl border border-black/10 px-3 py-2 text-sm"
              >
                {ROOM_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <Button variant="gold" size="sm" onClick={addRoom}>
                  Add
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowAddRoom(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {showAddBed && selectedRoomId && (
          <div className="border-t border-black/10 p-4">
            <div className="text-sm font-semibold">
              Add Bed to {rooms.find((r) => r._id === selectedRoomId)?.name}
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-5">
              <input
                value={bedName}
                onChange={(e) => setBedName(e.target.value)}
                placeholder="Bed name"
                className="rounded-xl border border-black/10 px-3 py-2 text-sm"
              />
              <select
                value={bedType}
                onChange={(e) => setBedType(e.target.value)}
                className="rounded-xl border border-black/10 px-3 py-2 text-sm"
              >
                {BED_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <input
                value={bedRent}
                onChange={(e) => setBedRent(e.target.value)}
                placeholder="Rent (₹)"
                type="number"
                className="rounded-xl border border-black/10 px-3 py-2 text-sm"
              />
              <input
                value={bedDeposit}
                onChange={(e) => setBedDeposit(e.target.value)}
                placeholder="Deposit (₹)"
                type="number"
                className="rounded-xl border border-black/10 px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <Button variant="gold" size="sm" onClick={addBed}>
                  Add
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddBed(false)
                    setSelectedRoomId('')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
