import { useEffect, useState } from 'react'
import axios from 'axios'
import API from '../../config'

// const API = 'http://localhost:5000/api'

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

function Timeslots() {
  const [timeslots, setTimeslots] = useState([])
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const fetchTimeslots = async () => {
      try {
        const res = await axios.get(`${API}/admin/timeslots`, { headers })
        setTimeslots(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchTimeslots()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <p className="text-gray-500 text-sm">Loading timeslots...</p>
    </div>
  )

  // Group timeslots by day
  const grouped = DAY_ORDER.reduce((acc, day) => {
    acc[day] = timeslots.filter(t => t.day === day)
    return acc
  }, {})

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Timeslots</h1>
        <p className="text-sm text-gray-500 mt-1">
          {timeslots.length} available lecture periods across 5 days
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DAY_ORDER.map(day => (
          <div key={day} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3" style={{ backgroundColor: '#0a1f44' }}>
              <h2 className="text-white font-semibold text-sm">{day}</h2>
              <p className="text-blue-300 text-xs">
                {grouped[day].length} period{grouped[day].length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="divide-y divide-gray-100">
              {grouped[day].map((t, i) => (
                <div key={t.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                  <span className="text-xs text-gray-500 w-5">{i + 1}</span>
                  <span className="text-sm font-medium text-gray-800">
                    {t.startTime} — {t.endTime}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded"
                    style={{ backgroundColor: '#e8f0fe', color: '#0a1f44' }}>
                    2 hrs
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Timeslots