import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API = 'http://localhost:5000/api'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await axios.post(`${API}/auth/login`, { email, password })

      if (res.data.role !== 'ADMIN') {
        setError('Access denied. Admin credentials required.')
        setLoading(false)
        return
      }

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('role', res.data.role)
      localStorage.setItem('userId', res.data.userId)
      navigate('/admin/dashboard')

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-8">

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full flex items-center justify-center
            mx-auto mb-4 text-lg font-bold text-white"
            style={{ backgroundColor: '#0a1f44' }}>
            A
          </div>
          <h1 className="text-xl font-bold text-gray-800">Administrator Access</h1>
          <p className="text-gray-500 text-xs mt-1">
            LASU Timetable Management System
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600
            text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-semibold py-2.5 rounded-lg
              text-sm transition disabled:opacity-50"
            style={{ backgroundColor: '#0a1f44' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin