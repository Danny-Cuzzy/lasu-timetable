import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import ExpandableCard from '../components/ExpandableCard'
import ConfirmModal from '../components/ConfirmModal'
import API from '../config'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

function LecturerDashboard() {
  const [timetable, setTimetable] = useState(null)
  const [courses, setCourses] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeDay, setActiveDay] = useState('Monday')
  const [activeTab, setActiveTab] = useState('timetable')
  const [logoutModal, setLogoutModal] = useState(false)
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ttRes, courseRes] = await Promise.all([
          axios.get(`${API}/timetable/lecturer`, { headers }),
          axios.get(`${API}/timetable/lecturer/courses`, { headers })
        ])
        setTimetable(ttRes.data)
        setCourses(courseRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-500 text-sm">Loading...</p>
    </div>
  )

  const lecturer = timetable?.lecturer || {}
  const entries = timetable?.entries || []
  const courseList = courses?.courses || []
  const officeHours = courses?.officeHours || []
  const dayEntries = entries.filter(e => e.timeslot.day === activeDay)

  const officeHoursByDay = DAYS.reduce((acc, day) => {
    acc[day] = officeHours.filter(ts => ts.day === day)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gray-100">

      <ConfirmModal
        isOpen={logoutModal}
        title="Logout"
        message="Are you sure you want to log out?"
        confirmText="Logout"
        confirmStyle="danger"
        onConfirm={() => { setLogoutModal(false); handleLogout() }}
        onCancel={() => setLogoutModal(false)}
      />

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white; }
        }
        .print-only { display: none; }
      `}</style>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 lg:px-8
        py-3 flex items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <img src="/lasu-logo.png" alt="LASU"
            className="w-9 h-9 object-contain" />
          <div>
            <p className="text-xs font-bold text-gray-800">
              Lagos State University
            </p>
            <p className="text-xs text-gray-500">
              Timetable Management System
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">
              {lecturer.name}
            </p>
            <p className="text-xs text-gray-500">
              {lecturer.staffId} · Lecturer
            </p>
          </div>
          <div className="w-9 h-9 rounded-full flex items-center
            justify-center text-white text-sm font-bold"
            style={{ backgroundColor: '#0a1f44' }}>
            L
          </div>
          <button
            onClick={() => setLogoutModal(true)}
            className="text-xs text-red-500 hover:text-red-700
              font-medium px-3 py-1.5 border border-red-200 rounded-lg"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-4 lg:p-8">

        {/* Print Header */}
        <div className="print-only mb-6 text-center border-b pb-4">
          <h1 className="text-xl font-bold">Lagos State University</h1>
          <p className="text-sm text-gray-600">Timetable Management System</p>
          <p className="text-sm font-semibold mt-2">
            {lecturer.name} · {lecturer.staffId}
          </p>
          <p className="text-xs text-gray-500">Lecturer</p>
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-6 no-print">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Portal</h2>
            <p className="text-sm text-gray-500 mt-1">{lecturer.staffId}</p>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 text-sm
              font-medium text-white rounded-lg"
            style={{ backgroundColor: '#0a1f44' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0
                00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0
                002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002
                2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print / Save PDF
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6 no-print">
          {[
            { label: 'Total Classes', value: entries.length, sub: 'this semester' },
            { label: 'Courses Teaching', value: courseList.length, sub: 'assigned' },
            { label: 'Free Periods', value: officeHours.length, sub: 'available slots' },
          ].map(card => (
            <div key={card.label} className="bg-white border border-gray-200
              rounded-lg p-4">
              <p className="text-xs text-gray-500 font-medium">{card.label}</p>
              <p className="text-2xl font-bold mt-1"
                style={{ color: '#0a1f44' }}>
                {card.value}
              </p>
              <p className="text-xs text-gray-400">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-gray-200 mb-6 no-print">
          {[
            { key: 'timetable', label: 'My Timetable' },
            { key: 'courses', label: 'My Courses' },
            { key: 'office-hours', label: 'Office Hours' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium border-b-2
                transition ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TIMETABLE TAB ── */}
        {activeTab === 'timetable' && (
          <div className="no-print">
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
              {DAYS.map(day => {
                const count = entries.filter(
                  e => e.timeslot.day === day
                ).length
                return (
                  <button
                    key={day}
                    onClick={() => setActiveDay(day)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg
                      border transition whitespace-nowrap ${
                      activeDay === day
                        ? 'text-white border-transparent'
                        : 'bg-white border-gray-300 text-gray-600'
                    }`}
                    style={activeDay === day
                      ? { backgroundColor: '#0a1f44' } : {}}
                  >
                    {day}
                    <span className={`ml-2 text-xs px-1.5 py-0.5
                      rounded-full ${
                      activeDay === day
                        ? 'bg-blue-400 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block bg-white border border-gray-200
              rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead style={{ backgroundColor: '#0a1f44' }}>
                  <tr>
                    <th className="px-4 py-3 text-left text-white font-medium">
                      Time
                    </th>
                    <th className="px-4 py-3 text-left text-white font-medium">
                      Course
                    </th>
                    <th className="px-4 py-3 text-left text-white font-medium">
                      Department
                    </th>
                    <th className="px-4 py-3 text-left text-white font-medium">
                      Room
                    </th>
                    <th className="px-4 py-3 text-left text-white font-medium">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dayEntries.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center
                        text-gray-400 text-sm">
                        No classes on {activeDay}
                      </td>
                    </tr>
                  ) : dayEntries.map(entry => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {entry.timeslot.startTime} – {entry.timeslot.endTime}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-bold
                          text-blue-700 mr-2">
                          {entry.course.code}
                        </span>
                        <span className="text-gray-800">
                          {entry.course.title}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {entry.course.department.name}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {entry.room.name}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs
                          font-medium ${
                          entry.room.type === 'VIRTUAL'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {entry.room.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-2">
              {dayEntries.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg
                  p-6 text-center text-gray-400 text-sm">
                  No classes on {activeDay}
                </div>
              ) : dayEntries.map(entry => (
                <ExpandableCard
                  key={entry.id}
                  summary={
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold
                          text-blue-700">
                          {entry.course.code}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs
                          font-medium flex-shrink-0 ${
                          entry.room.type === 'VIRTUAL'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {entry.room.name}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900
                        truncate mt-0.5">
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
                        <p className="text-xs text-gray-400 uppercase
                          tracking-wide mb-0.5">Time</p>
                        <p className="text-sm text-gray-700">
                          {entry.timeslot.startTime} – {entry.timeslot.endTime}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase
                          tracking-wide mb-0.5">Room</p>
                        <p className="text-sm text-gray-700">
                          {entry.room.name}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase
                        tracking-wide mb-0.5">Department</p>
                      <p className="text-sm text-gray-700">
                        {entry.course.department.name}
                      </p>
                    </div>
                  </div>
                </ExpandableCard>
              ))}
            </div>
          </div>
        )}

        {/* Print timetable */}
        <div className="print-only">
          {DAYS.map(day => {
            const dayEnt = entries.filter(e => e.timeslot.day === day)
            if (dayEnt.length === 0) return null
            return (
              <div key={day} className="mb-6">
                <h3 className="font-bold text-gray-800 mb-2 border-b pb-1">
                  {day}
                </h3>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left p-2 border">Time</th>
                      <th className="text-left p-2 border">Course</th>
                      <th className="text-left p-2 border">Dept</th>
                      <th className="text-left p-2 border">Room</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dayEnt.map(entry => (
                      <tr key={entry.id}>
                        <td className="p-2 border text-xs">
                          {entry.timeslot.startTime}–{entry.timeslot.endTime}
                        </td>
                        <td className="p-2 border text-xs">
                          <span className="font-mono font-bold mr-1">
                            {entry.course.code}
                          </span>
                          {entry.course.title}
                        </td>
                        <td className="p-2 border text-xs">
                          {entry.course.department.name}
                        </td>
                        <td className="p-2 border text-xs">
                          {entry.room.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          })}
        </div>

        {/* ── COURSES TAB ── */}
        {activeTab === 'courses' && (
          <div className="no-print">
            <p className="text-sm text-gray-500 mb-4">
              {courseList.length} courses assigned
            </p>

            {/* Desktop Table */}
            <div className="hidden lg:block bg-white border border-gray-200
              rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead style={{ backgroundColor: '#0a1f44' }}>
                  <tr>
                    <th className="px-4 py-3 text-left text-white font-medium">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-white font-medium">
                      Code
                    </th>
                    <th className="px-4 py-3 text-left text-white font-medium">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-white font-medium">
                      Level
                    </th>
                    <th className="px-4 py-3 text-left text-white font-medium">
                      Units
                    </th>
                    <th className="px-4 py-3 text-left text-white font-medium">
                      Department
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {courseList.map((c, i) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                      <td className="px-4 py-3 font-mono text-xs font-bold
                        text-blue-700">
                        {c.code}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {c.title}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-0.5 rounded text-xs
                          font-semibold"
                          style={{
                            backgroundColor: '#e8f0fe',
                            color: '#0a1f44'
                          }}>
                          {c.level}L
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">
                        {c.unitLoad}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {c.department}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-2">
              {courseList.map(c => (
                <ExpandableCard
                  key={c.id}
                  summary={
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold
                        text-blue-700 flex-shrink-0">
                        {c.code}
                      </span>
                      <p className="text-sm font-medium text-gray-900
                        truncate flex-1">
                        {c.title}
                      </p>
                      <span className="px-2 py-0.5 rounded text-xs
                        font-semibold flex-shrink-0"
                        style={{
                          backgroundColor: '#e8f0fe',
                          color: '#0a1f44'
                        }}>
                        {c.level}L
                      </span>
                    </div>
                  }
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-400 uppercase
                        tracking-wide mb-0.5">Unit Load</p>
                      <p className="text-sm text-gray-700">
                        {c.unitLoad} units
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase
                        tracking-wide mb-0.5">Department</p>
                      <p className="text-sm text-gray-700">{c.department}</p>
                    </div>
                  </div>
                </ExpandableCard>
              ))}
            </div>
          </div>
        )}

        {/* ── OFFICE HOURS TAB ── */}
        {activeTab === 'office-hours' && (
          <div className="no-print">
            <p className="text-sm text-gray-500 mb-4">
              Your free periods — timeslots with no assigned class
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
              gap-4">
              {DAYS.map(day => (
                <div key={day} className="bg-white border border-gray-200
                  rounded-lg overflow-hidden">
                  <div className="px-4 py-3"
                    style={{ backgroundColor: '#0a1f44' }}>
                    <h3 className="text-white font-semibold text-sm">
                      {day}
                    </h3>
                    <p className="text-blue-300 text-xs">
                      {officeHoursByDay[day].length} free period
                      {officeHoursByDay[day].length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {officeHoursByDay[day].length === 0 ? (
                      <div className="px-4 py-3 text-xs text-gray-400">
                        Fully booked
                      </div>
                    ) : officeHoursByDay[day].map(ts => (
                      <div key={ts.id} className="px-4 py-3 flex
                        items-center justify-between hover:bg-gray-50">
                        <span className="text-sm font-medium text-gray-800">
                          {ts.startTime} — {ts.endTime}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded
                          bg-green-100 text-green-700 font-medium">
                          Free
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default LecturerDashboard