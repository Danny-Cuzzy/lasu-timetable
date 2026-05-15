import { useState } from 'react'
import axios from 'axios'
import API from '../../config'

// const API = 'http://localhost:5000/api'

function AddLecturers() {
  const [mode, setMode] = useState('single')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    firstName: '', lastName: '', staffId: '', email: ''
  })

  const [bulkText, setBulkText] = useState('')

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  const handleSingleAdd = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const res = await axios.post(`${API}/admin/lecturers`, form, { headers })
      setMessage(`✅ ${res.data.message}. Default password: ${res.data.lecturer.defaultPassword}`)
      setForm({ firstName: '', lastName: '', staffId: '', email: '' })
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Failed to add lecturer'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleBulkAdd = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const lines = bulkText.trim().split('\n').filter(l => l.trim())
      const lecturers = lines.map(line => {
        const parts = line.trim().split(/\s+/)
        return {
          firstName: parts[0] || '',
          lastName: parts[1] || '',
          staffId: parts[2] || '',
          email: parts[3] || ''
        }
      }).filter(l => l.firstName && l.lastName && l.staffId && l.email)

      if (lecturers.length === 0) {
        setMessage('❌ No valid entries. Format: FirstName LastName StaffID Email')
        setLoading(false)
        return
      }

      const res = await axios.post(
        `${API}/admin/lecturers/bulk-add`,
        { lecturers },
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
        <h1 className="text-2xl font-bold text-gray-900">Add Lecturers</h1>
        <p className="text-sm text-gray-500 mt-1">
          Add lecturers individually or in bulk
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6">
        {['single', 'bulk'].map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setMessage('') }}
            className={`px-5 py-2 text-sm font-medium rounded-lg border
              transition ${
              mode === m
                ? 'text-white border-transparent'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
            style={mode === m ? { backgroundColor: '#0a1f44' } : {}}
          >
            {m === 'single' ? 'Single Lecturer' : 'Bulk Add'}
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

      {/* Single Add */}
      {mode === 'single' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            Lecturer Details
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
                Staff ID
              </label>
              <input
                type="text"
                value={form.staffId}
                onChange={e => setForm({ ...form, staffId: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2
                  text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                Format: LASU/DEPT/001
              </p>
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
                Lecturer's real email address for notifications
              </p>
            </div>

            <div className="pt-2">
              <p className="text-xs text-gray-400 mb-3">
                Default password: lecturer123
              </p>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 text-white text-sm font-medium
                  rounded-lg disabled:opacity-50 transition"
                style={{ backgroundColor: '#0a1f44' }}
              >
                {loading ? 'Adding...' : 'Add Lecturer'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bulk Add */}
      {mode === 'bulk' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-1">
            Bulk Add Lecturers
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            One lecturer per line:
            <span className="font-mono text-xs ml-2 bg-gray-100 px-2 py-0.5 rounded">
              FirstName LastName StaffID Email
            </span>
          </p>

          <form onSubmit={handleBulkAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lecturer List
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
                Example: Taofik Ajagbe LASU/CS/013 ajagbe@lasu.edu.ng
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-white text-sm font-medium
                rounded-lg disabled:opacity-50 transition"
              style={{ backgroundColor: '#0a1f44' }}
            >
              {loading ? 'Adding...' : 'Bulk Add Lecturers'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default AddLecturers