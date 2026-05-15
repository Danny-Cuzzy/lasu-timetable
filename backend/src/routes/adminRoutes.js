const express = require('express')
const router = express.Router()
const {
  updateLecturerEmail,
  updateStudentEmail,
  getAllLecturers,
  getAllStudents,
  getAllCourses,
  getAllRooms,
  deleteLecturer,
  bulkDeleteLecturers,
  deleteStudent,
  bulkDeleteStudents,
  getAllTimeslots,
  addStudent,
  bulkAddStudents,
  getAllDepartments,
  addLecturer,
  bulkAddLecturers,
} = require('../controllers/adminController')
const { protect, restrictTo } = require('../middleware/authMiddleware')



// All routes here are admin only
router.use(protect)
router.use(restrictTo('ADMIN'))

// Lecturer routes
router.get('/lecturers', getAllLecturers)
router.patch('/lecturers/:id/email', updateLecturerEmail)
router.delete('/lecturers/:id', deleteLecturer)
router.post('/lecturers/bulk-delete', bulkDeleteLecturers)

// Student routes
router.get('/students', getAllStudents)
router.patch('/students/:id/email', updateStudentEmail)
router.delete('/students/:id', deleteStudent)
router.post('/students/bulk-delete', bulkDeleteStudents)

router.get('/courses', getAllCourses)
router.get('/rooms', getAllRooms)

router.get('/timeslots', getAllTimeslots)

router.get('/departments', getAllDepartments)
router.post('/students', addStudent)
router.post('/students/bulk-add', bulkAddStudents)
router.post('/lecturers', addLecturer)
router.post('/lecturers/bulk-add', bulkAddLecturers)

module.exports = router