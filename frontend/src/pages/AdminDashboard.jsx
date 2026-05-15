import { useEffect, useState } from 'react'
import axios from 'axios'
import API from '../config'

// const API = 'http://localhost:5000/api'

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">
        {label}
      </p>
      <p className="text-3xl font-bold mt-2" style={{ color: '#0a1f44' }}>
        {value ?? '—'}
      </p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

function AdminDashboard() {
  const [stats, setStats] = useState({
    lecturers: null,
    students: null,
    courses: null,
    rooms: null,
  })

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [lec, stu, cou, roo] = await Promise.all([
          axios.get(`${API}/admin/lecturers`, { headers }),
          axios.get(`${API}/admin/students`, { headers }),
          axios.get(`${API}/admin/courses`, { headers }),
          axios.get(`${API}/admin/rooms`, { headers }),
        ])
        setStats({
          lecturers: lec.data.length,
          students: stu.data.length,
          courses: cou.data.length,
          rooms: roo.data.length,
        })
      } catch (err) {
        console.error('Failed to fetch stats', err)
      }
    }
    fetchStats()
  }, [])

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of the timetable management system
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard label="Lecturers" value={stats.lecturers} sub="Registered staff" />
        <StatCard label="Students" value={stats.students} sub="Registered students" />
        <StatCard label="Courses" value={stats.courses} sub="Active courses" />
        <StatCard label="Rooms" value={stats.rooms} sub="Physical & virtual" />
      </div>

      {/* Info Panel */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">
          Quick Guide
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
          <li>Use <strong>Lecturers</strong> and <strong>Students</strong> to manage user emails</li>
          <li>Use <strong>Courses</strong> to view all registered courses and their assigned lecturers</li>
          <li>Use <strong>Rooms</strong> to view available physical and virtual venues</li>
          <li>Use <strong>Timeslots</strong> to view all available lecture periods</li>
          <li>Use <strong>Generate Timetable</strong> to run the constraint-based scheduling engine</li>
          <li>Use <strong>View Timetable</strong> to view and manage the generated schedule</li>
        </ol>
      </div>
    </div>
  )
}

export default AdminDashboard