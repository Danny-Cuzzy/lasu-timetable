import { useEffect, useState } from 'react'
import axios from 'axios'
import ExpandableCard from '../../components/ExpandableCard'

const API = 'http://localhost:5000/api'

function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterDept, setFilterDept] = useState('')
  const [filterLevel, setFilterLevel] = useState('')

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API}/admin/courses`, { headers })
        setCourses(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const filteredCourses = courses.filter(c => {
    const deptMatch = filterDept ? c.department === filterDept : true
    const levelMatch = filterLevel ? c.level.toString() === filterLevel : true
    return deptMatch && levelMatch
  })

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <p className="text-gray-500 text-sm">Loading courses...</p>
    </div>
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
        <p className="text-sm text-gray-500 mt-1">
          {courses.length} registered course{courses.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-3 mb-4 flex-wrap items-center">
        <select
          value={filterDept}
          onChange={e => setFilterDept(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Departments</option>
          {[...new Set(courses.map(c => c.department))].sort().map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          value={filterLevel}
          onChange={e => setFilterLevel(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Levels</option>
          {['100', '200', '300', '400', '500'].map(l => (
            <option key={l} value={l}>{l} Level</option>
          ))}
        </select>

        {(filterDept || filterLevel) && (
          <button
            onClick={() => { setFilterDept(''); setFilterLevel('') }}
            className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700
              border border-gray-300 rounded-lg bg-white"
          >
            Clear Filters
          </button>
        )}

        <span className="text-sm text-gray-500">
          Showing {filteredCourses.length} of {courses.length}
        </span>
      </div>

      {/* Table */}
      {/* ── DESKTOP TABLE ── */}
      <div className="hidden lg:block bg-white border border-gray-200
        rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: '#0a1f44' }}>
            <tr>
              <th className="px-4 py-3 text-left text-white font-medium">#</th>
              <th className="px-4 py-3 text-left text-white font-medium">Code</th>
              <th className="px-4 py-3 text-left text-white font-medium">Title</th>
              <th className="px-4 py-3 text-left text-white font-medium">Units</th>
              <th className="px-4 py-3 text-left text-white font-medium">Level</th>
              <th className="px-4 py-3 text-left text-white font-medium">Department</th>
              <th className="px-4 py-3 text-left text-white font-medium">Lecturer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCourses.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center
                  text-gray-400 text-sm">No courses match the filters</td>
              </tr>
            ) : (
              filteredCourses.map((c, i) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 font-mono text-xs font-bold
                    text-blue-700">{c.code}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {c.title}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">
                    {c.unitLoad}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-0.5 rounded text-xs font-semibold"
                      style={{ backgroundColor: '#e8f0fe', color: '#0a1f44' }}>
                      {c.level}L
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {c.department}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{c.lecturer}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── MOBILE EXPANDABLE CARDS ── */}
      <div className="lg:hidden space-y-2">
        {filteredCourses.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6
            text-center text-gray-400 text-sm">
            No courses match the filters
          </div>
        ) : (
          filteredCourses.map((c, i) => (
            <ExpandableCard
              key={c.id}
              summary={
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700
                        flex-shrink-0">
                        {c.code}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs font-semibold
                        flex-shrink-0"
                        style={{ backgroundColor: '#e8f0fe', color: '#0a1f44' }}>
                        {c.level}L
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate mt-0.5">
                      {c.title}
                    </p>
                  </div>
                </div>
              }
            >
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                      Unit Load
                    </p>
                    <p className="text-sm text-gray-700">{c.unitLoad} units</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                      Level
                    </p>
                    <p className="text-sm text-gray-700">{c.level} Level</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                    Department
                  </p>
                  <p className="text-sm text-gray-700">{c.department}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                    Lecturer
                  </p>
                  <p className="text-sm text-gray-700">{c.lecturer}</p>
                </div>
              </div>
            </ExpandableCard>
          ))
        )}
      </div>    
    </div>
  )
}

export default Courses