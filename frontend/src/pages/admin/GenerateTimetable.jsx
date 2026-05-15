import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API = 'http://localhost:5000/api'

function GenerateTimetable() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await axios.post(`${API}/timetable/generate`, {}, { headers })
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Generate Timetable</h1>
        <p className="text-sm text-gray-500 mt-1">
          Run the constraint-based scheduling algorithm to generate a conflict-free timetable
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-800 mb-3">
          How the Algorithm Works
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
          <li>Iterates through every registered course</li>
          <li>For each course, tries every available timeslot and room combination</li>
          <li>Checks that the lecturer is not already teaching at that time</li>
          <li>Checks that the room is not already occupied at that time</li>
          <li>Assigns the first combination that satisfies all constraints</li>
          <li>Flags any course that could not be scheduled for admin review</li>
        </ol>

        <div className="mt-4 p-3 rounded text-sm"
          style={{ backgroundColor: '#e8f0fe', color: '#0a1f44' }}>
          ⚠ Running this will clear the existing timetable and generate a fresh one.
        </div>
      </div>

      {/* Generate Button */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-6 py-3 text-white font-semibold rounded-lg text-sm
            disabled:opacity-50 disabled:cursor-not-allowed transition"
          style={{ backgroundColor: '#0a1f44' }}
        >
          {loading ? 'Generating...' : 'Generate Timetable Now'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm mb-6">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            Generation Result
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <p className="text-xs text-green-600 uppercase tracking-wide font-medium">
                Successfully Scheduled
              </p>
              <p className="text-3xl font-bold text-green-700 mt-1">
                {result.scheduled}
              </p>
              <p className="text-xs text-green-600 mt-1">courses assigned</p>
            </div>

            <div className={`p-4 rounded-lg border ${
              result.unscheduled > 0
                ? 'bg-red-50 border-red-200'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <p className={`text-xs uppercase tracking-wide font-medium ${
                result.unscheduled > 0 ? 'text-red-600' : 'text-gray-500'
              }`}>
                Unscheduled
              </p>
              <p className={`text-3xl font-bold mt-1 ${
                result.unscheduled > 0 ? 'text-red-700' : 'text-gray-400'
              }`}>
                {result.unscheduled}
              </p>
              <p className={`text-xs mt-1 ${
                result.unscheduled > 0 ? 'text-red-600' : 'text-gray-400'
              }`}>
                courses could not be placed
              </p>
            </div>
          </div>

          {/* Unscheduled list */}
          {result.unscheduledCourses?.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-red-700 mb-2">
                Courses that could not be scheduled:
              </p>
              <ul className="space-y-1">
                {result.unscheduledCourses.map((c, i) => (
                  <li key={i} className="text-sm text-red-600 flex items-center gap-2">
                    <span className="font-mono text-xs bg-red-100 px-1.5 py-0.5 rounded">
                      {c.code}
                    </span>
                    {c.title}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.unscheduled === 0 && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <p className="text-sm text-green-700 font-medium">
                All courses successfully scheduled with zero conflicts
              </p>
            </div>
          )}

          <button
            onClick={() => navigate('/admin/timetable')}
            className="mt-6 px-5 py-2.5 text-white text-sm font-medium rounded-lg"
            style={{ backgroundColor: '#0a1f44' }}
          >
            View Generated Timetable →
          </button>
        </div>
      )}
    </div>
  )
}

export default GenerateTimetable