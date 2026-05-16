import { useState } from 'react'
import { NavLink, useNavigate, Outlet } from 'react-router-dom'
import ConfirmModal from '../components/ConfirmModal'

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Lecturers', path: '/admin/lecturers' },
  { label: 'Add Lecturers', path: '/admin/lecturers/add' },
  { label: 'Students', path: '/admin/students' },
  { label: 'Add Students', path: '/admin/students/add' },
  { label: 'Courses', path: '/admin/courses' },
  { label: 'Rooms', path: '/admin/rooms' },
  { label: 'Timeslots', path: '/admin/timeslots' },
  { label: 'Generate Timetable', path: '/admin/generate' },
  { label: 'View Timetable', path: '/admin/timetable' },
]

function AdminLayout() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [logoutModal, setLogoutModal] = useState(false)

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">

      <ConfirmModal
        isOpen={logoutModal}
        title="Logout"
        message="Are you sure you want to log out of the admin portal?"
        confirmText="Logout"
        confirmStyle="danger"
        onConfirm={() => { setLogoutModal(false); handleLogout() }}
        onCancel={() => setLogoutModal(false)}
      />

      {/* ── MOBILE OVERLAY ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-white/20 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR — fixed, never scrolls ── */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 z-30 flex flex-col
        transform transition-transform duration-200 ease-in-out
        lg:relative lg:translate-x-0 lg:flex-shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
        style={{ backgroundColor: '#0a1f44' }}>

        {/* Logo */}
        <div className="flex-shrink-0 px-4 py-4 border-b border-blue-900
        flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
                <img
                    src="/lasu-logo.png"
                    alt="LASU"
                    className="w-10 h-10 object-contain flex-shrink-0"
                />
                <div>
                    <p className="text-white text-xs font-bold leading-tight">
                        Lagos State University
                    </p>
                    <p className="text-blue-300 text-xs leading-tight mt-0.5">
                        Timetable System
                    </p>
                </div>
            </div>
            <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-blue-300 hover:text-white p-1 flex-shrink-0"
            >
                ✕
            </button>
        </div>

        {/* Nav Items — this inner div scrolls if needed */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-4 py-2.5 rounded text-sm font-medium
                transition-colors duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-200 hover:bg-blue-900 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout — always visible at bottom */}
        <div className="flex-shrink-0 px-3 py-4 border-t border-blue-900">
          <button
            onClick={() => setLogoutModal(true)}
            className="w-full flex items-center px-4 py-2.5 rounded text-sm
              font-medium text-red-300 hover:bg-red-900 hover:text-white
              transition-colors duration-150"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT — this scrolls ── */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

        {/* Top Navbar — fixed at top */}
        <header className="flex-shrink-0 bg-white border-b border-gray-200
        px-4 lg:px-8 py-3 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                    style={{ color: '#0a1f44' }}
                    >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <div>
                    <h2 className="text-sm font-semibold text-gray-800">
                        Administrator Portal
                    </h2>
                    <p className="text-xs text-gray-500 hidden sm:block">
                        Faculty of Computing & Information Technology
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-800">Admin</p>
                    <p className="text-xs text-gray-500">admin@lasu.edu.ng</p>
                </div>
                <div className="w-9 h-9 rounded-full flex items-center
                    justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: '#0a1f44' }}>
                    A
                </div>
            </div>
        </header>
        
        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default AdminLayout