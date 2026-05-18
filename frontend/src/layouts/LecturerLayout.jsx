import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfirmModal from '../components/ConfirmModal'

function LecturerLayout({ lecturer, activeTab, setActiveTab, children }) {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [logoutModal, setLogoutModal] = useState(false)
//   const [activeTab, setActiveTab] = useState('timetable')

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">

      <ConfirmModal
        isOpen={logoutModal}
        title="Logout"
        message="Are you sure you want to log out?"
        confirmText="Logout"
        confirmStyle="danger"
        onConfirm={() => { setLogoutModal(false); handleLogout() }}
        onCancel={() => setLogoutModal(false)}
      />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-white/20 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`no-print fixed top-0 left-0 h-full w-64 z-30 flex flex-col
        transform transition-transform duration-200 ease-in-out
        lg:relative lg:translate-x-0 lg:flex-shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
        style={{ backgroundColor: '#0a1f44' }}>

        {/* Logo */}
        <div className="flex-shrink-0 px-4 py-4 border-b border-blue-900
          flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src="/lasu-logo.png" alt="LASU"
              className="w-10 h-10 object-contain flex-shrink-0" />
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
            className="lg:hidden text-blue-300 hover:text-white p-1
              flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {[
                { key: 'timetable', label: 'My Timetable' },
                { key: 'courses', label: 'My Courses' },
                { key: 'office-hours', label: 'Office Hours' },
                ].map(item => (
                <button
                    key={item.key}
                    onClick={() => {
                        setActiveTab(item.key)
                        setSidebarOpen(false)
                    }}
                    className={`w-full flex items-center px-4 py-2.5 rounded
                        text-sm font-medium transition-colors duration-150
                        text-left ${
                        activeTab === item.key
                        ? 'bg-blue-600 text-white'
                        : 'text-blue-200 hover:bg-blue-900 hover:text-white'
                    }`}
                >
                    {item.label}
                </button>
            ))}
        </nav>

        {/* Bottom Actions */}
        <div className="flex-shrink-0 px-3 py-4 border-t border-blue-900
          space-y-2">
          <button
            onClick={() => window.print()}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded
              text-sm font-medium text-blue-200 hover:bg-blue-900
              hover:text-white transition-colors duration-150"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0
                00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0
                002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002
                2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print / Save PDF
          </button>
          <button
            onClick={() => setLogoutModal(true)}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded
              text-sm font-medium text-red-300 hover:bg-red-900
              hover:text-white transition-colors duration-150"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

        {/* Top Navbar */}
        <header className="flex-shrink-0 bg-white border-b border-gray-200
          px-4 lg:px-8 py-4 flex items-center justify-between z-10 no-print">
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
                Lecturer Portal
              </h2>
              <p className="text-xs text-gray-500 hidden sm:block">
                Lagos State University
              </p>
            </div>
          </div>

          {/* Mobile: show lecturer info in header */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-800">
                {lecturer?.name}
              </p>
              <p className="text-xs text-gray-500">{lecturer?.staffId}</p>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center
              justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: '#0a1f44' }}>
              L
            </div>
          </div>

          {/* Desktop: show name */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">
                {lecturer?.name}
              </p>
              <p className="text-xs text-gray-500">Lecturer</p>
            </div>
            <div className="w-9 h-9 rounded-full flex items-center
              justify-center text-white text-sm font-bold"
              style={{ backgroundColor: '#0a1f44' }}>
              L
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            {children}
        </main>
      </div>
    </div>
  )
}

export default LecturerLayout