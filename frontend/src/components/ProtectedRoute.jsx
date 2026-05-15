import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  // Not logged in at all — send to login
  if (!token) {
    return <Navigate to="/" replace />
  }

  // Logged in but wrong role — send to their own dashboard
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />
    if (role === 'LECTURER') return <Navigate to="/lecturer/dashboard" replace />
    if (role === 'STUDENT') return <Navigate to="/student/dashboard" replace />
  }

  return children
}

export default ProtectedRoute