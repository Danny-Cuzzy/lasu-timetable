import { useEffect, useState } from 'react'
import axios from 'axios'
import ExpandableCard from '../../components/ExpandableCard'

const API = 'http://localhost:5000/api'

function Rooms() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(`${API}/admin/rooms`, { headers })
        setRooms(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchRooms()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <p className="text-gray-500 text-sm">Loading rooms...</p>
    </div>
  )

  const physical = rooms.filter(r => r.type === 'PHYSICAL')
  const virtual = rooms.filter(r => r.type === 'VIRTUAL')

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Rooms & Venues</h1>
        <p className="text-sm text-gray-500 mt-1">
          {physical.length} physical · {virtual.length} virtual
        </p>
      </div>

      {/* Physical Rooms — Desktop */}
      <div className="hidden lg:block bg-white border border-gray-200
        rounded-lg overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: '#0a1f44' }}>
            <tr>
              <th className="px-4 py-3 text-left text-white font-medium">#</th>
              <th className="px-4 py-3 text-left text-white font-medium">Room</th>
              <th className="px-4 py-3 text-left text-white font-medium">Building</th>
              <th className="px-4 py-3 text-left text-white font-medium">Capacity</th>
              <th className="px-4 py-3 text-left text-white font-medium">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {physical.map((r, i) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                <td className="px-4 py-3 text-gray-600">{r.building}</td>
                <td className="px-4 py-3 text-gray-600">{r.capacity} seats</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold
                    bg-green-100 text-green-700">Physical</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Physical Rooms — Mobile */}
      <div className="lg:hidden space-y-2 mb-8">
        {physical.map((r, i) => (
          <ExpandableCard
            key={r.id}
            summary={
              <div>
                <p className="font-medium text-gray-900 text-sm">{r.name}</p>
                <p className="text-xs text-gray-500">{r.building}</p>
              </div>
            }
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                  Capacity
                </p>
                <p className="text-sm text-gray-700">{r.capacity} seats</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                  Type
                </p>
                <span className="px-2 py-0.5 rounded text-xs font-semibold
                  bg-green-100 text-green-700">Physical</span>
              </div>
            </div>
          </ExpandableCard>
        ))}
      </div>

      {/* Virtual — Desktop */}
      <div className="hidden lg:block bg-white border border-gray-200
        rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: '#0a1f44' }}>
            <tr>
              <th className="px-4 py-3 text-left text-white font-medium">#</th>
              <th className="px-4 py-3 text-left text-white font-medium">Platform</th>
              <th className="px-4 py-3 text-left text-white font-medium">Capacity</th>
              <th className="px-4 py-3 text-left text-white font-medium">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {virtual.map((r, i) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                <td className="px-4 py-3 text-gray-600">{r.capacity} participants</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold
                    bg-blue-100 text-blue-700">Virtual</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Virtual — Mobile */}
      <div className="lg:hidden space-y-2">
        {virtual.map((r, i) => (
          <ExpandableCard
            key={r.id}
            summary={
              <div>
                <p className="font-medium text-gray-900 text-sm">{r.name}</p>
                <p className="text-xs text-gray-500">Virtual Platform</p>
              </div>
            }
          >
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                Capacity
              </p>
              <p className="text-sm text-gray-700">{r.capacity} participants</p>
            </div>
          </ExpandableCard>
        ))}
      </div>    
    </div>
  )
}

export default Rooms