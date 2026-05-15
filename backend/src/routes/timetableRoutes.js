const express = require('express')
const router = express.Router()

const {
  generateTimetable,
  getTimetable,
  updateTimetableEntry,
  getLecturerTimetable,
  getStudentTimetable
} = require('../controllers/timetableController')
const { protect, restrictTo } = require('../middleware/authMiddleware')

router.use(protect)

// Generate — admin only
router.post('/generate', restrictTo('ADMIN'), generateTimetable)

// View — all roles
router.get('/', getTimetable)
router.get('/lecturer', getLecturerTimetable)
router.get('/student', getStudentTimetable)

// Update entry — admin only
router.patch('/:id', restrictTo('ADMIN'), updateTimetableEntry)

module.exports = router