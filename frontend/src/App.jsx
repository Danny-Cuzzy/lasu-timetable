import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AdminLogin from './pages/AdminLogin'
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import Lecturers from './pages/admin/Lecturers'
import Students from './pages/admin/Students'
import Courses from './pages/admin/Courses'
import Rooms from './pages/admin/Rooms'
import Timeslots from './pages/admin/Timeslots'
import GenerateTimetable from './pages/admin/GenerateTimetable'
import ViewTimetable from './pages/admin/ViewTimetable'
import AddStudents from './pages/admin/AddStudents'
import AddLecturers from './pages/admin/AddLecturers'
import LecturerDashboard from './pages/LecturerDashboard'
import StudentDashboard from './pages/StudentDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public pages */}
        <Route path="/" element={<Landing />} />

        <Route path="/login" element={
          <PublicRoute><Login /></PublicRoute>
        } />

        <Route path="/signup" element={
          <PublicRoute><Signup /></PublicRoute>
        } />

        <Route path="/secure-access" element={
          <PublicRoute><AdminLogin /></PublicRoute>
        } />

        {/* Admin */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="lecturers" element={<Lecturers />} />
          <Route path="lecturers/add" element={<AddLecturers />} />
          <Route path="students" element={<Students />} />
          <Route path="students/add" element={<AddStudents />} />
          <Route path="courses" element={<Courses />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="timeslots" element={<Timeslots />} />
          <Route path="generate" element={<GenerateTimetable />} />
          <Route path="timetable" element={<ViewTimetable />} />
        </Route>

        {/* Lecturer */}
        <Route path="/lecturer/dashboard" element={
          <ProtectedRoute allowedRoles={['LECTURER']}>
            <LecturerDashboard />
          </ProtectedRoute>
        } />

        {/* Student */}
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