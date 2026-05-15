import { Navigate } from 'react-router-dom'

function PublicRoute({ children }) {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  if (token) {
    if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />
    if (role === 'LECTURER') return <Navigate to="/lecturer/dashboard" replace />
    if (role === 'STUDENT') return <Navigate to="/student/dashboard" replace />
  }

  return children
}

export default PublicRoute