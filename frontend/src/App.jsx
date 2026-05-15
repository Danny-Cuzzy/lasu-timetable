import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import Lecturers from './pages/admin/Lecturers'
import Students from './pages/admin/Students'
import Courses from './pages/admin/Courses'
import Rooms from './pages/admin/Rooms'
import Timeslots from './pages/admin/Timeslots'
import GenerateTimetable from './pages/admin/GenerateTimetable'
import ViewTimetable from './pages/admin/ViewTimetable'
import LecturerDashboard from './pages/LecturerDashboard'
import StudentDashboard from './pages/StudentDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import AddStudents from './pages/admin/AddStudents'
import AddLecturers from './pages/admin/AddLecturers'
import AdminLogin from './pages/AdminLogin'


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public — redirect away if already logged in */}
        <Route path="/" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />

        // Add this route — outside the /admin block
        <Route path="/secure-access" element={
        <PublicRoute>
            <AdminLogin />
        </PublicRoute>
        } />

        {/* Admin only */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="lecturers" element={<Lecturers />} />
          <Route path="students" element={<Students />} />
          <Route path="courses" element={<Courses />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="timeslots" element={<Timeslots />} />
          <Route path="generate" element={<GenerateTimetable />} />
          <Route path="timetable" element={<ViewTimetable />} />
          <Route path="students/add" element={<AddStudents />} />
          <Route path="lecturers/add" element={<AddLecturers />} />
        </Route>

        {/* Lecturer only */}
        <Route path="/lecturer/dashboard" element={
          <ProtectedRoute allowedRoles={['LECTURER']}>
            <LecturerDashboard />
          </ProtectedRoute>
        } />

        {/* Student only */}
        <Route path="/student/dashboard" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default App