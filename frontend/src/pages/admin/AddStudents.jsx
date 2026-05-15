import { useEffect, useState } from 'react'
import axios from 'axios'
import API from '../../config'

// const API = 'http://localhost:5000/api'

function AddStudents() {
  const [departments, setDepartments] = useState([])
  const [mode, setMode] = useState('single')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Single student form
  const [form, setForm] = useState({
    firstName: '', lastName: '', matricNumber: '',
    level: '100', departmentId: '', email: ''
  })

  // Bulk add — CSV style text input
  const [bulkText, setBulkText] = useState('')
  const [bulkDeptId, setBulkDeptId] = useState('')
  const [bulkLevel, setBulkLevel] = useState('100')

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    axios.get(`${API}/admin/departments`, { headers })
      .then(res => setDepartments(res.data))
      .catch(console.error)
  }, [])

  const handleSingleAdd = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const res = await axios.post(`${API}/admin/students`, form, { headers })
      setMessage(`✅ ${res.data.message}. Default password: ${res.data.student.defaultPassword}`)
      setForm({ firstName: '', lastName: '', matricNumber: '', level: '100', departmentId: '' })
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Failed to add student'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleBulkAdd = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // Parse bulk text — each line: FirstName LastName MatricNumber
      const lines = bulkText.trim().split('\n').filter(l => l.trim())
      const students = lines.map(line => {
        const parts = line.trim().split(/\s+/)
        return {
          firstName: parts[0] || '',
          lastName: parts[1] || '',
          matricNumber: parts[2] || '',
          email: parts[3] || `daniel.arinze220591085+${parts[2]}@st.lasu.edu.ng`,
          level: bulkLevel,
          departmentId: bulkDeptId
        }
      }).filter(s => s.firstName && s.lastName && s.matricNumber)

      if (students.length === 0) {
        setMessage('❌ No valid entries found. Format: FirstName LastName MatricNumber')
        setLoading(false)
        return
      }

      const res = await axios.post(
        `${API}/admin/students/bulk-add`,
        { students },
        { headers }
      )
      setMessage(`✅ ${res.data.message}`)
      setBulkText('')
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Bulk add failed'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Students</h1>
        <p className="text-sm text-gray-500 mt-1">
          Add students individually or in bulk
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6">
        {['single', 'bulk'].map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setMessage('') }}
            className={`px-5 py-2 text-sm font-medium rounded-lg border transition ${
              mode === m
                ? 'text-white border-transparent'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
            style={mode === m ? { backgroundColor: '#0a1f44' } : {}}
          >
            {m === 'single' ? 'Single Student' : 'Bulk Add'}
          </button>
        ))}
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 px-4 py-3 rounded text-sm border ${
          message.startsWith('✅')
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message}
        </div>
      )}

      {/* Single Add Form */}
      {mode === 'single' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            Student Details
          </h2>
          <form onSubmit={handleSingleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Matric Number
              </label>
              <input
                type="text"
                value={form.matricNumber}
                onChange={e => setForm({ ...form, matricNumber: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2
                  text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                </label>
                <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                    Format: FirstName LastName MatricNumber Email (email optional)
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level
                </label>
                <select
                  value={form.level}
                  onChange={e => setForm({ ...form, level: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {['100', '200', '300', '400', '500'].map(l => (
                    <option key={l} value={l}>{l} Level</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  value={form.departmentId}
                  onChange={e => setForm({ ...form, departmentId: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select department</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.faculty.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs text-gray-400 mb-3">
                Default password will be: LASU + MatricNumber + LastName (uppercase)
              </p>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 text-white text-sm font-medium rounded-lg
                  disabled:opacity-50 transition"
                style={{ backgroundColor: '#0a1f44' }}
              >
                {loading ? 'Adding...' : 'Add Student'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bulk Add Form */}
      {mode === 'bulk' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-1">
            Bulk Add Students
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Enter one student per line in this format:
            <span className="font-mono text-xs ml-2 bg-gray-100 px-2 py-0.5 rounded">
              FirstName LastName MatricNumber
            </span>
          </p>

          <form onSubmit={handleBulkAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department (applies to all)
                </label>
                <select
                  value={bulkDeptId}
                  onChange={e => setBulkDeptId(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select department</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.faculty.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level (applies to all)
                </label>
                <select
                  value={bulkLevel}
                  onChange={e => setBulkLevel(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {['100', '200', '300', '400', '500'].map(l => (
                    <option key={l} value={l}>{l} Level</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student List
              </label>
              <textarea
                value={bulkText}
                onChange={e => setBulkText(e.target.value)}
                rows={10}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2
                  text-sm font-mono focus:outline-none focus:ring-2
                  focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                Example line: Daniel Arinze 220591085
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-white text-sm font-medium rounded-lg
                disabled:opacity-50 transition"
              style={{ backgroundColor: '#0a1f44' }}
            >
              {loading ? 'Adding...' : 'Bulk Add Students'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default AddStudents