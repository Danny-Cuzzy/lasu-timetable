import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import ExpandableCard from '../components/ExpandableCard'
import API from '../config'
import ConfirmModal from '../components/ConfirmModal'

// const API = 'http://localhost:5000/api'
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

function StudentDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [logoutModal, setLogoutModal] = useState(false)
  const [activeDay, setActiveDay] = useState('Monday')
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await axios.get(`${API}/timetable/student`, { headers })
        setData(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchTimetable()
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-500 text-sm">Loading your timetable...</p>
    </div>
  )

  const dayEntries = data?.entries?.filter(
    e => e.timeslot.day === activeDay
  ) || []

  const totalClasses = data?.entries?.length || 0

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4
        flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center
            text-white text-sm font-bold flex-shrink-0"
            style={{ backgroundColor: '#0a1f44' }}>
            {/* L for lecturer, S for student */}
            S
            </div>
            <div>
            <p className="text-sm font-semibold text-gray-800">
                {data?.student?.name}
            </p>
            <p className="text-xs text-gray-500">
                {data?.student?.matricNumber} · Student
            </p>
            </div>
        </div>
        <button
            onClick={() => setLogoutModal(true)}
            className="text-xs text-red-500 hover:text-red-700 font-medium
                px-3 py-1.5 border border-red-200 rounded-lg"
        >
            Logout
        </button>
      </header>

      <main className="p-8">

        {/* Page Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Timetable</h2>
          <p className="text-sm text-gray-500 mt-1">
            {data?.student?.department} ·{' '}
            {data?.student?.level} Level ·{' '}
            {totalClasses} course{totalClasses !== 1 ? 's' : ''} this semester
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {DAYS.map(day => {
            const count = data?.entries?.filter(
              e => e.timeslot.day === day
            ).length || 0
            return (
              <div key={day}
                className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-500 font-medium">{day}</p>
                <p className="text-2xl font-bold mt-1"
                  style={{ color: '#0a1f44' }}>
                  {count}
                </p>
                <p className="text-xs text-gray-400">
                  class{count !== 1 ? 'es' : ''}
                </p>
              </div>
            )
          })}
        </div>

        {/* Day Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-4 py-2 text-sm font-medium rounded-lg
                border transition ${
                activeDay === day
                  ? 'text-white border-transparent'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
              style={activeDay === day
                ? { backgroundColor: '#0a1f44' } : {}}
            >
              {day}
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                activeDay === day
                  ? 'bg-blue-400 text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {data?.entries?.filter(
                  e => e.timeslot.day === day
                ).length || 0}
              </span>
            </button>
          ))}
        </div>

      {/* Timetable Table */}
      {/* ── DESKTOP TABLE ── */}
      <div className="hidden lg:block bg-white border border-gray-200
        rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: '#0a1f44' }}>
            <tr>
              <th className="px-4 py-3 text-left text-white font-medium">Time</th>
              <th className="px-4 py-3 text-left text-white font-medium">Course</th>
              <th className="px-4 py-3 text-left text-white font-medium">
                {/* Department for lecturer, Lecturer for student */}
                Department
              </th>
              <th className="px-4 py-3 text-left text-white font-medium">Room</th>
              <th className="px-4 py-3 text-left text-white font-medium">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dayEntries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center
                  text-gray-400 text-sm">
                  No classes scheduled for {activeDay}
                </td>
              </tr>
            ) : (
              dayEntries.map(entry => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {entry.timeslot.startTime} – {entry.timeslot.endTime}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-bold
                      text-blue-700 mr-2">
                      {entry.course.code}
                    </span>
                    <span className="text-gray-800">{entry.course.title}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {entry.course.department.name}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{entry.room.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      entry.room.type === 'VIRTUAL'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {entry.room.type}
                    </span>
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
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                      Time
                    </p>
                    <p className="text-sm text-gray-700">
                      {entry.timeslot.startTime} – {entry.timeslot.endTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                      Room
                    </p>
                    <p className="text-sm text-gray-700">{entry.room.name}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                    Department
                  </p>
                  <p className="text-sm text-gray-700">
                    {entry.course.department.name}
                  </p>
                </div>
              </div>
            </ExpandableCard>
          ))
        )}
      </div>      
      </main>
       <ConfirmModal
        isOpen={logoutModal}
        title="Logout"
        message="Are you sure you want to log out of the student portal ?"
        confirmText="Logout"
        confirmStyle="danger"
        onConfirm={() => {
            setLogoutModal(false)
            handleLogout()
        }}
        onCancel={() => setLogoutModal(false)}
      />
    </div>
  )
}

export default StudentDashboard