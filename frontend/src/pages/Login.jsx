import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import API from '../config'

// const API = 'http://localhost:5000/api'

function Login() {
  const [mode, setMode] = useState('login')
  const [role, setRole] = useState('LECTURER')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [resetIdentifier, setResetIdentifier] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await axios.post(`${API}/auth/login`, {
        email: identifier,
        password
      })

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('role', res.data.role)
      localStorage.setItem('userId', res.data.userId)

      if (res.data.role === 'ADMIN') navigate('/admin/dashboard')
      else if (res.data.role === 'LECTURER') navigate('/lecturer/dashboard')
      else navigate('/student/dashboard')

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await axios.post(`${API}/auth/reset-password`, {
        identifier: resetIdentifier,
        role
      })
      setSuccess(
        `Password reset successfully. Your new password is: ${res.data.defaultPassword}`
      )
      setResetIdentifier('')
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const getIdentifierLabel = () => {
    if (role === 'STUDENT') return 'Matric Number'
    if (role === 'LECTURER') return 'Email Address'
    return 'Email Address'
  }

  const getIdentifierHint = () => {
    if (role === 'STUDENT') return 'Format: Your LASU matric number'
    if (role === 'LECTURER') return 'Format: bossmand698+LASU.DEPT.001@gmail.com'
    return null
  }

  const getPasswordHint = () => {
    if (role === 'STUDENT') return 'Format: LASU + MatricNumber + Surname in uppercase'
    return null
  }

  const getResetIdentifierLabel = () => {
    if (role === 'STUDENT') return 'Matric Number'
    if (role === 'LECTURER') return 'Staff ID'
    return null
  }

  const getResetIdentifierHint = () => {
    if (role === 'STUDENT') return 'Enter your LASU matric number'
    if (role === 'LECTURER') return 'Format: LASU/CS/001'
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-start sm:items-center
  justify-center px-4 py-8">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">

        {/* Header */}
        <div className="text-center mb-8">
            <img
                src="/lasu-logo.png"
                alt="LASU Logo"
                className="w-16 h-16 mx-auto mb-3 object-contain"
            />
            <h1 className="text-xl font-bold text-gray-800">
                Lagos State University
            </h1>
            <p className="text-gray-500 text-sm mt-1">
                Timetable Management System
            </p>
            <p className="text-gray-400 text-xs mt-0.5">
                Ojo, Lagos State
            </p>
        </div>

        {/* Role Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {mode === 'login' ? 'Login As' : 'Reset Password For'}
          </label>
          <div className={`grid gap-2 ${mode === 'reset' ? 'grid-cols-2' : 'grid-cols-2'}`}>
            {(mode === 'reset' ? ['STUDENT', 'LECTURER'] : ['LECTURER', 'STUDENT']).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRole(r)
                  setIdentifier('')
                  setPassword('')
                  setResetIdentifier('')
                  setError('')
                  setSuccess('')
                }}
                className={`py-2 rounded-lg text-sm font-medium border transition ${
                  role === r
                    ? 'text-white border-transparent'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
                style={role === r ? { backgroundColor: '#0a1f44' } : {}}
              >
                {r.charAt(0) + r.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600
            text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700
            text-sm rounded-lg px-4 py-3 mb-6">
            {success}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {getIdentifierLabel()}
              </label>
              <input
                type="text"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                  text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                  focus:border-transparent"
              />
              {getIdentifierHint() && (
                <p className="text-xs text-gray-400 mt-1">{getIdentifierHint()}</p>
              )}
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
                  text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                  focus:border-transparent"
              />
              {getPasswordHint() && (
                <p className="text-xs text-gray-400 mt-1">{getPasswordHint()}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-2.5 rounded-lg
                text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#0a1f44' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Forgot Password Link */}
            {role !== 'ADMIN' && (
              <p className="text-center text-xs text-gray-500">
                Forgot your password?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('reset')
                    setError('')
                    setSuccess('')
                    setIdentifier('')
                    setPassword('')
                  }}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Reset it here
                </button>
              </p>
            )}
          </form>
        )}

        {/* RESET PASSWORD FORM */}
        {mode === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {getResetIdentifierLabel()}
              </label>
              <input
                type="text"
                value={resetIdentifier}
                onChange={e => setResetIdentifier(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                  text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                  focus:border-transparent"
              />
              {getResetIdentifierHint() && (
                <p className="text-xs text-gray-400 mt-1">
                  {getResetIdentifierHint()}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-2.5 rounded-lg
                text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#0a1f44' }}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>

            <p className="text-center text-xs text-gray-500">
              Remembered your password?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login')
                  setError('')
                  setSuccess('')
                  setResetIdentifier('')
                }}
                className="text-blue-600 hover:underline font-medium"
              >
                Back to login
              </button>
            </p>
          </form>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-8">
          Lagos State University · Timetable Management System
        </p>
      </div>
    </div>
  )
}

export default Login