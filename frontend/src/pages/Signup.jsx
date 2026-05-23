import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import API from '../config'

function Signup() {
  const [role, setRole] = useState('STUDENT')

  // Student fields
  const [matricNumber, setMatricNumber] = useState('')
  const [studentEmail, setStudentEmail] = useState('')

  // Lecturer fields
  const [staffId, setStaffId] = useState('')
  const [lecturerEmail, setLecturerEmail] = useState('')

  // Common
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      let res
      if (role === 'STUDENT') {
        res = await axios.post(`${API}/auth/signup`, {
          matricNumber,
          email: studentEmail,
          password
        })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('role', res.data.role)
        localStorage.setItem('userId', res.data.userId)
        navigate('/student/dashboard')
      } else {
        res = await axios.post(`${API}/auth/lecturer-signup`, {
          staffId,
          email: lecturerEmail,
          password
        })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('role', res.data.role)
        localStorage.setItem('userId', res.data.userId)
        navigate('/lecturer/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Sign up failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-start sm:items-center
      justify-center px-4 py-8">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <img src="/lasu-logo.png" alt="LASU Logo"
            className="w-16 h-16 mx-auto mb-3 object-contain" />
          <h1 className="text-xl font-bold text-gray-800">
            Lagos State University
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Timetable Management System
          </p>
          <p className="text-gray-400 text-xs mt-1">Account Setup</p>
        </div>

        {/* Role Toggle */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            I am a
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['STUDENT', 'LECTURER'].map(r => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRole(r)
                  setError('')
                  setPassword('')
                  setConfirmPassword('')
                }}
                className={`py-2 rounded-lg text-sm font-medium border
                  transition ${
                  role === r
                    ? 'text-white border-transparent'
                    : 'bg-white border-gray-300 text-gray-600'
                }`}
                style={role === r ? { backgroundColor: '#0a1f44' } : {}}
              >
                {r.charAt(0) + r.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4
          py-3 mb-6">
          <p className="text-xs text-blue-700">
            {role === 'STUDENT'
              ? 'Use your LASU matric number and the school email address assigned to you by your administrator.'
              : 'Use your Staff ID and the email address registered for you by your administrator.'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600
            text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">

          {role === 'STUDENT' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Matric Number
                </label>
                <input
                  type="text"
                  value={matricNumber}
                  onChange={e => setMatricNumber(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4
                    py-2.5 text-sm focus:outline-none focus:ring-2
                    focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Format: Your LASU matric number
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School Email Address
                </label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={e => setStudentEmail(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4
                    py-2.5 text-sm focus:outline-none focus:ring-2
                    focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Format: firstname.lastnamematricnumber@st.lasu.edu.ng
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Staff ID
                </label>
                <input
                  type="text"
                  value={staffId}
                  onChange={e => setStaffId(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4
                    py-2.5 text-sm focus:outline-none focus:ring-2
                    focus:ring-blue-500"
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
                  value={lecturerEmail}
                  onChange={e => setLecturerEmail(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4
                    py-2.5 text-sm focus:outline-none focus:ring-2
                    focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  The email address registered for you by your administrator
                </p>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Choose Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4
                py-2.5 text-sm focus:outline-none focus:ring-2
                focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">Minimum 6 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4
                py-2.5 text-sm focus:outline-none focus:ring-2
                focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-semibold py-2.5 rounded-lg
              text-sm transition disabled:opacity-50 mt-2"
            style={{ backgroundColor: '#0a1f44' }}
          >
            {loading ? 'Setting up account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login"
            className="text-blue-600 hover:underline font-medium">
            Sign in here
          </Link>
        </p>

        <p className="text-center text-xs text-gray-400 mt-3">
          Lagos State University · Timetable Management System
        </p>
      </div>
    </div>
  )
}

export default Signup