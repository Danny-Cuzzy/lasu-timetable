import { useEffect, useState } from 'react'
import axios from 'axios'
import ExpandableCard from '../../components/ExpandableCard'

const API = 'http://localhost:5000/api'
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

function ViewTimetable() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeDay, setActiveDay] = useState('Monday')
  const [editId, setEditId] = useState(null)
  const [rooms, setRooms] = useState([])
  const [timeslots, setTimeslots] = useState([])
  const [editRoom, setEditRoom] = useState('')
  const [editTimeslot, setEditTimeslot] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  const fetchAll = async () => {
    try {
      const [tt, rm, ts] = await Promise.all([
        axios.get(`${API}/timetable`, { headers }),
        axios.get(`${API}/admin/rooms`, { headers }),
        axios.get(`${API}/admin/timeslots`, { headers }),
      ])
      setEntries(tt.data)
      setRooms(rm.data)
      setTimeslots(ts.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const handleSave = async (id) => {
    setSaving(true)
    setMessage('')
    try {
      await axios.patch(`${API}/timetable/${id}`, {
        roomId: parseInt(editRoom),
        timeslotId: parseInt(editTimeslot)
      }, { headers })
      setMessage('Entry updated successfully')
      setEditId(null)
      fetchAll()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <p className="text-gray-500 text-sm">Loading timetable...</p>
    </div>
  )

  if (entries.length === 0) return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">View Timetable</h1>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
        <p className="text-gray-500 text-sm mb-4">
          No timetable has been generated yet.
        </p>
        <a href="/admin/generate"
          className="px-5 py-2.5 text-white text-sm font-medium rounded-lg inline-block"
          style={{ backgroundColor: '#0a1f44' }}>
          Generate Timetable
        </a>
      </div>
    </div>
  )

  // Filter entries by active day
  const dayEntries = entries.filter(
    e => e.timeslot.day === activeDay
  ).sort((a, b) =>
    a.timeslot.startTime.localeCompare(b.timeslot.startTime)
  )

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">View Timetable</h1>
          <p className="text-sm text-gray-500 mt-1">
            {entries.length} total entries · Click Edit to modify room or timeslot
          </p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 px-4 py-3 rounded text-sm border ${
          message.includes('failed') || message.includes('already')
            ? 'bg-red-50 border-red-200 text-red-700'
            : 'bg-blue-50 border-blue-200 text-blue-700'
        }`}>
          {message}
        </div>
      )}

      {/* Day Tabs */}
      {/* <div className="flex gap-2 mb-6 flex-wrap"> */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition ${
              activeDay === day
                ? 'text-white border-transparent'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
            style={activeDay === day ? { backgroundColor: '#0a1f44' } : {}}
          >
            {day}
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
              activeDay === day ? 'bg-blue-400 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {entries.filter(e => e.timeslot.day === day).length}
            </span>
          </button>
        ))}
      </div>

      {/* ── DESKTOP TABLE ── */}
      <div className="hidden lg:block bg-white border border-gray-200
        rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: '#0a1f44' }}>
            <tr>
              <th className="px-4 py-3 text-left text-white font-medium">Time</th>
              <th className="px-4 py-3 text-left text-white font-medium">Course</th>
              <th className="px-4 py-3 text-left text-white font-medium">Department</th>
              <th className="px-4 py-3 text-left text-white font-medium">Lecturer</th>
              <th className="px-4 py-3 text-left text-white font-medium">Room</th>
              <th className="px-4 py-3 text-left text-white font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dayEntries.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center
                  text-gray-400 text-sm">
                  No classes scheduled for {activeDay}
                </td>
              </tr>
            ) : (
              dayEntries.map(entry => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {editId === entry.id ? (
                      <select value={editTimeslot}
                        onChange={e => setEditTimeslot(e.target.value)}
                        className="border border-blue-400 rounded px-2 py-1
                          text-xs focus:outline-none focus:ring-2
                          focus:ring-blue-500">
                        {timeslots.map(ts => (
                          <option key={ts.id} value={ts.id}>
                            {ts.day} {ts.startTime}–{ts.endTime}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="font-medium text-gray-800">
                        {entry.timeslot.startTime} – {entry.timeslot.endTime}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-bold text-blue-700 mr-2">
                      {entry.course.code}
                    </span>
                    <span className="text-gray-800">{entry.course.title}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {entry.course.department.name}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {entry.lecturer.firstName} {entry.lecturer.lastName}
                  </td>
                  <td className="px-4 py-3">
                    {editId === entry.id ? (
                      <select value={editRoom}
                        onChange={e => setEditRoom(e.target.value)}
                        className="border border-blue-400 rounded px-2 py-1
                          text-xs focus:outline-none focus:ring-2
                          focus:ring-blue-500">
                        {rooms.map(r => (
                          <option key={r.id} value={r.id}>
                            {r.name} ({r.type})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        entry.room.type === 'VIRTUAL'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {entry.room.name}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editId === entry.id ? (
                      <div className="flex gap-2">
                        <button onClick={() => handleSave(entry.id)}
                          disabled={saving}
                          className="px-3 py-1 bg-blue-600 text-white text-xs
                            rounded hover:bg-blue-700 disabled:opacity-50">
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button onClick={() => setEditId(null)}
                          className="px-3 py-1 bg-gray-200 text-gray-700
                            text-xs rounded hover:bg-gray-300">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditId(entry.id)
                          setEditRoom(entry.room.id.toString())
                          setEditTimeslot(entry.timeslot.id.toString())
                        }}
                        className="px-3 py-1 text-xs rounded border
                          border-blue-600 text-blue-600 hover:bg-blue-50">
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── MOBILE EXPANDABLE CARDS ── */}
      <div className="lg:hidden space-y-2">
        {dayEntries.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6
            text-center text-gray-400 text-sm">
            No classes scheduled for {activeDay}
          </div>
        ) : (
          dayEntries.map(entry => (
            <ExpandableCard
              key={entry.id}
              summary={
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700">
                      {entry.course.code}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium
                      flex-shrink-0 ${
                      entry.room.type === 'VIRTUAL'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {entry.room.name}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate mt-0.5">
                    {entry.course.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {entry.timeslot.startTime} – {entry.timeslot.endTime}
                  </p>
                </div>
              }
            >
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                      Time
                    </p>
                    {editId === entry.id ? (
                      <select value={editTimeslot}
                        onChange={e => setEditTimeslot(e.target.value)}
                        className="w-full border border-blue-400 rounded px-2
                          py-1.5 text-xs focus:outline-none">
                        {timeslots.map(ts => (
                          <option key={ts.id} value={ts.id}>
                            {ts.day} {ts.startTime}–{ts.endTime}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-sm text-gray-700">
                        {entry.timeslot.startTime} – {entry.timeslot.endTime}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                      Room
                    </p>
                    {editId === entry.id ? (
                      <select value={editRoom}
                        onChange={e => setEditRoom(e.target.value)}
                        className="w-full border border-blue-400 rounded px-2
                          py-1.5 text-xs focus:outline-none">
                        {rooms.map(r => (
                          <option key={r.id} value={r.id}>
                            {r.name} ({r.type})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-sm text-gray-700">{entry.room.name}</p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                    Lecturer
                  </p>
                  <p className="text-sm text-gray-700">
                    {entry.lecturer.firstName} {entry.lecturer.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                    Department
                  </p>
                  <p className="text-sm text-gray-700">
                    {entry.course.department.name}
                  </p>
                </div>
                <div className="flex gap-2 pt-1">
                  {editId === entry.id ? (
                    <>
                      <button onClick={() => handleSave(entry.id)}
                        disabled={saving}
                        className="px-4 py-2 bg-blue-600 text-white text-xs
                          rounded hover:bg-blue-700 disabled:opacity-50">
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button onClick={() => setEditId(null)}
                        className="px-4 py-2 bg-gray-200 text-gray-700
                          text-xs rounded">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setEditId(entry.id)
                        setEditRoom(entry.room.id.toString())
                        setEditTimeslot(entry.timeslot.id.toString())
                      }}
                      className="px-4 py-2 text-xs rounded border
                        border-blue-600 text-blue-600 hover:bg-blue-50">
                      Edit Entry
                    </button>
                  )}
                </div>
              </div>
            </ExpandableCard>
          ))
        )}
      </div>    
    </div>
  )
}

export default ViewTimetable