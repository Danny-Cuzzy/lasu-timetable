import { Link } from 'react-router-dom'

const features = [
  {
    title: 'Automated Timetable Generation',
    description: 'Conflict-free schedules generated in seconds using a constraint-based algorithm that eliminates room and lecturer clashes automatically.'
  },
  {
    title: 'Role-Based Access',
    description: 'Separate, tailored portals for administrators, lecturers, and students — each seeing exactly what they need and nothing more.'
  },
  {
    title: 'Real-Time Notifications',
    description: 'Students and lecturers receive instant email alerts whenever the timetable is generated or a schedule change is made.'
  },
  {
    title: 'Hybrid Scheduling',
    description: 'Supports both physical lecture halls and virtual platforms including Zoom, Google Meet, and LASU-VLAP for blended learning.'
  },
  {
    title: 'Mobile Friendly',
    description: 'Fully responsive interface that works seamlessly on smartphones, tablets, and desktop computers.'
  },
  {
    title: 'Printable Schedules',
    description: 'Students and lecturers can download and print their personal timetable as a PDF directly from their portal.'
  },
]

function Landing() {
  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="border-b border-gray-100 px-6 lg:px-16 py-4
        flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <img src="/lasu-logo.png" alt="LASU"
            className="w-9 h-9 object-contain" />
          <div>
            <p className="text-xs font-bold leading-tight"
              style={{ color: '#0a1f44' }}>
              Lagos State University
            </p>
            <p className="text-xs text-gray-500 leading-tight">
              Timetable Management System
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium rounded-lg
              border border-gray-300 text-gray-700 hover:bg-gray-50
              transition"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 text-sm font-medium rounded-lg
              text-white transition"
            style={{ backgroundColor: '#0a1f44' }}
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 lg:px-16 py-16 lg:py-24"
        style={{ backgroundColor: '#0a1f44' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-blue-600 text-white text-xs
            font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wide">
            Lagos State University, Ojo
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-white
            leading-tight mb-6">
            Central Timetable
            <span className="block" style={{ color: '#93c5fd' }}>
              Management System
            </span>
          </h1>
          <p className="text-blue-200 text-base lg:text-lg mb-10 max-w-2xl
            mx-auto leading-relaxed">
            A web-based platform that automates the generation, management,
            and dissemination of university lecture timetables for the
            Faculty of Computing and Information Technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-3 rounded-lg text-sm font-semibold
                text-white transition"
              style={{ backgroundColor: '#2563eb' }}
            >
              Set Up Your Account
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 rounded-lg text-sm font-semibold
                border border-blue-400 text-blue-200 hover:bg-blue-900
                transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 lg:px-16 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2"
            style={{ color: '#0a1f44' }}>
            How It Works
          </h2>
          <p className="text-gray-500 text-sm text-center mb-10">
            Three simple steps to access your timetable
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Admin Adds You',
                desc: 'Your administrator registers your matric number and school email in the system.'
              },
              {
                step: '02',
                title: 'You Sign Up',
                desc: 'Use your matric number and school email to set up your account with a password of your choice.'
              },
              {
                step: '03',
                title: 'Access Your Timetable',
                desc: 'Log in anytime to view your schedule, courses, and receive instant notifications for any changes.'
              },
            ].map(item => (
              <div key={item.step} className="bg-white border border-gray-200
                rounded-xl p-6">
                <div className="text-3xl font-bold mb-3"
                  style={{ color: '#93c5fd' }}>
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 lg:px-16 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2"
            style={{ color: '#0a1f44' }}>
            System Features
          </h2>
          <p className="text-gray-500 text-sm text-center mb-10">
            Built specifically for LASU's academic scheduling needs
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-6
                hover:border-blue-300 transition">
                <div className="w-8 h-1 rounded mb-4"
                  style={{ backgroundColor: '#0a1f44' }} />
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Each Role */}
      <section className="px-6 lg:px-16 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10"
            style={{ color: '#0a1f44' }}>
            Designed for Everyone
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                role: 'Students',
                color: '#0a1f44',
                points: [
                  'View your weekly class schedule',
                  'See all your registered courses',
                  'Receive email alerts for changes',
                  'Download and print your timetable',
                ]
              },
              {
                role: 'Lecturers',
                color: '#1d4ed8',
                points: [
                  'View your teaching schedule',
                  'See all assigned courses',
                  'Check your available free periods',
                  'Receive notifications for updates',
                ]
              },
              {
                role: 'Administrators',
                color: '#1e3a5f',
                points: [
                  'Generate conflict-free timetables',
                  'Manage students and lecturers',
                  'Edit and update schedule entries',
                  'Oversee all system data',
                ]
              },
            ].map(group => (
              <div key={group.role} className="bg-white border border-gray-200
                rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg flex items-center
                  justify-center text-white text-sm font-bold mb-4"
                  style={{ backgroundColor: group.color }}>
                  {group.role[0]}
                </div>
                <h3 className="font-bold text-gray-900 mb-4">{group.role}</h3>
                <ul className="space-y-2">
                  {group.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2
                      text-xs text-gray-600">
                      <span className="mt-0.5 text-green-500 flex-shrink-0">
                        ✓
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-16 py-16"
        style={{ backgroundColor: '#0a1f44' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-blue-200 text-sm mb-8">
            Set up your account using your LASU matric number and school
            email address provided by your administrator.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-3 rounded-lg text-sm font-semibold
                text-white transition"
              style={{ backgroundColor: '#2563eb' }}
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 rounded-lg text-sm font-semibold
                border border-blue-400 text-blue-200 hover:bg-blue-900
                transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 lg:px-16 py-8">
        <div className="flex flex-col sm:flex-row items-center
          justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/lasu-logo.png" alt="LASU"
              className="w-7 h-7 object-contain" />
            <p className="text-xs text-gray-500">
              Lagos State University · Timetable Management System
            </p>
          </div>
          <p className="text-xs text-gray-400">
            Department of Computer Science · Faculty of Computing & IT
          </p>
        </div>
      </footer>

    </div>
  )
}

export default Landing