const { sendTimetableGeneratedEmail } = require('../services/emailService')
const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Update lecturer email
const updateLecturerEmail = async (req, res) => {
  const { id } = req.params
  const { email } = req.body

  try {
    const lecturer = await prisma.lecturer.findUnique({
      where: { id: parseInt(id) },
      include: { user: true }
    })

    if (!lecturer) {
      return res.status(404).json({ message: 'Lecturer not found' })
    }

    const updatedUser = await prisma.user.update({
      where: { id: lecturer.userId },
      data: { email }
    })

    // Auto-notify new email if timetable exists
    try {
      const timetableExists = await prisma.timetable.findFirst()
      if (timetableExists) {
        await sendTimetableGeneratedEmail({
          to: email,
          name: `${lecturer.firstName} ${lecturer.lastName}`
        })
      }
    } catch (emailError) {
      console.error('Auto-notify on email update failed:', emailError.message)
    }

    res.json({
      message: 'Lecturer email updated successfully',
      name: `${lecturer.firstName} ${lecturer.lastName}`,
      email: updatedUser.email
    })

  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'That email is already in use' })
    }
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Update student email
const updateStudentEmail = async (req, res) => {
  const { id } = req.params
  const { email } = req.body

  try {
    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) },
      include: { user: true }
    })

    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    const updatedUser = await prisma.user.update({
      where: { id: student.userId },
      data: { email }
    })

    // Auto-notify new email if timetable exists
    try {
      const timetableExists = await prisma.timetable.findFirst()
      if (timetableExists) {
        await sendTimetableGeneratedEmail({
          to: email,
          name: `${student.firstName} ${student.lastName}`
        })
      }
    } catch (emailError) {
      console.error('Auto-notify on email update failed:', emailError.message)
    }

    res.json({
      message: 'Email updated successfully',
      name: `${student.firstName} ${student.lastName}`,
      email: updatedUser.email
    })

  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'That email is already in use' })
    }
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}


// Get all lecturers (so admin can see IDs and names)
const getAllLecturers = async (req, res) => {
  try {
    const lecturers = await prisma.lecturer.findMany({
      include: { user: { select: { email: true } } },
      orderBy: { lastName: 'asc' }
    })

    const result = lecturers.map(l => ({
      id: l.id,
      staffId: l.staffId,
      name: `${l.firstName} ${l.lastName}`,
      email: l.user.email,
      department: l.staffId.split('/')[1]
    }))

    res.json(result)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
// Get all students (so admin can see IDs and names)
const getAllStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: { select: { email: true } },
        department: {
          include: { faculty: { select: { name: true } } }
        }
      },
      orderBy: { lastName: 'asc' }
    })

    const result = students.map(s => ({
      id: s.id,
      matricNumber: s.matricNumber,
      name: `${s.firstName} ${s.lastName}`,
      level: s.level,
      department: s.department.name,
      faculty: s.department.faculty.name,
      email: s.user.email
    }))

    res.json(result)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        department: { select: { name: true } },
        lecturer: { select: { firstName: true, lastName: true } }
      },
      orderBy: { code: 'asc' }
    })
    const result = courses.map(c => ({
      id: c.id,
      code: c.code,
      title: c.title,
      unitLoad: c.unitLoad,
      level: c.level,
      department: c.department.name,
      lecturer: `${c.lecturer.firstName} ${c.lecturer.lastName}`
    }))
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Get all rooms
const getAllRooms = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { name: 'asc' }
    })
    res.json(rooms)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Delete single lecturer
const deleteLecturer = async (req, res) => {
  const { id } = req.params
  try {
    const lecturer = await prisma.lecturer.findUnique({
      where: { id: parseInt(id) }
    })
    if (!lecturer) return res.status(404).json({ message: 'Lecturer not found' })

    await prisma.lecturer.delete({ where: { id: parseInt(id) } })
    await prisma.user.delete({ where: { id: lecturer.userId } })

    res.json({ message: 'Lecturer deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Bulk delete lecturers
const bulkDeleteLecturers = async (req, res) => {
  const { ids } = req.body
  try {
    const lecturers = await prisma.lecturer.findMany({
      where: { id: { in: ids.map(Number) } }
    })
    const userIds = lecturers.map(l => l.userId)

    await prisma.lecturer.deleteMany({ where: { id: { in: ids.map(Number) } } })
    await prisma.user.deleteMany({ where: { id: { in: userIds } } })

    res.json({ message: `${ids.length} lecturer(s) deleted` })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Delete single student
const deleteStudent = async (req, res) => {
  const { id } = req.params
  try {
    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) }
    })
    if (!student) return res.status(404).json({ message: 'Student not found' })

    await prisma.student.delete({ where: { id: parseInt(id) } })
    await prisma.user.delete({ where: { id: student.userId } })

    res.json({ message: 'Student deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Bulk delete students
const bulkDeleteStudents = async (req, res) => {
  const { ids } = req.body
  try {
    const students = await prisma.student.findMany({
      where: { id: { in: ids.map(Number) } }
    })
    const userIds = students.map(s => s.userId)

    await prisma.student.deleteMany({ where: { id: { in: ids.map(Number) } } })
    await prisma.user.deleteMany({ where: { id: { in: userIds } } })

    res.json({ message: `${ids.length} student(s) deleted` })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Add single student
const addStudent = async (req, res) => {
  const { firstName, lastName, matricNumber, level, departmentId, email } = req.body

  try {
    const rawPassword = `LASU${matricNumber}${lastName.toUpperCase()}`
    const hashedPassword = await bcrypt.hash(rawPassword, 10)
    const email = req.body.email

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: 'Student with this matric number already exists' })
    }

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role: 'STUDENT' }
    })

    const student = await prisma.student.create({
      data: {
        matricNumber,
        firstName,
        lastName,
        level: parseInt(level),
        departmentId: parseInt(departmentId),
        userId: user.id
      },
      include: {
        department: { select: { name: true } },
        user: { select: { email: true } }
      }
    })

    // Auto-notify if a timetable already exists
    try {
    const timetableExists = await prisma.timetable.findFirst()
    if (timetableExists) {
        await sendTimetableGeneratedEmail({
        to: email,
        name: `${firstName} ${lastName}`
        })
    }
    } catch (emailError) {
    console.error('Auto-notify failed:', emailError.message)
    }

    res.status(201).json({
      message: 'Student added successfully',
      student: {
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        matricNumber: student.matricNumber,
        level: student.level,
        department: student.department.name,
        email: student.user.email,
        defaultPassword: rawPassword
      }
    })
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Matric number already exists' })
    }
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Bulk add students
const bulkAddStudents = async (req, res) => {
  const { students } = req.body

  const results = { success: [], failed: [] }

  for (const st of students) {
    try {
      const rawPassword = `LASU${st.matricNumber}${st.lastName.toUpperCase()}`
      const hashedPassword = await bcrypt.hash(rawPassword, 10)
      const email = st.email || `daniel.arinze220591085+${st.matricNumber}@st.lasu.edu.ng`

      const user = await prisma.user.create({
        data: { email, password: hashedPassword, role: 'STUDENT' }
      })

      await prisma.student.create({
        data: {
          matricNumber: st.matricNumber,
          firstName: st.firstName,
          lastName: st.lastName,
          level: parseInt(st.level),
          departmentId: parseInt(st.departmentId),
          userId: user.id
        }
      })

      results.success.push(st.matricNumber)

      // Auto-notify if a timetable already exists
      try {
        const timetableExists = await prisma.timetable.findFirst()
        if (timetableExists) {
            await sendTimetableGeneratedEmail({
            to: email,
            name: `${st.firstName} ${st.lastName}`
            })
        }
        } catch (emailError) {
        console.error('Auto-notify failed for', st.matricNumber, emailError.message)
        }

    } catch (error) {
      results.failed.push({
        matricNumber: st.matricNumber,
        reason: error.code === 'P2002'
          ? 'Already exists' : error.message
      })
    }
  }

  res.json({
    message: `${results.success.length} added, ${results.failed.length} failed`,
    results
  })
}


// Add single lecturer
const addLecturer = async (req, res) => {
  const { firstName, lastName, staffId, email } = req.body

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists' })
    }

    const hashedPassword = await bcrypt.hash('lecturer123', 10)
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role: 'LECTURER' }
    })

    const lecturer = await prisma.lecturer.create({
      data: { firstName, lastName, staffId, userId: user.id },
      include: { user: { select: { email: true } } }
    })

    // Auto-notify if timetable exists
    try {
      const timetableExists = await prisma.timetable.findFirst()
      if (timetableExists) {
        await sendTimetableGeneratedEmail({
          to: email,
          name: `${firstName} ${lastName}`
        })
      }
    } catch (emailError) {
      console.error('Auto-notify failed:', emailError.message)
    }

    res.status(201).json({
      message: 'Lecturer added successfully',
      lecturer: {
        id: lecturer.id,
        name: `${lecturer.firstName} ${lecturer.lastName}`,
        staffId: lecturer.staffId,
        email: lecturer.user.email,
        defaultPassword: 'lecturer123'
      }
    })
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Staff ID or email already exists' })
    }
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Bulk add lecturers
const bulkAddLecturers = async (req, res) => {
  const { lecturers } = req.body
  const results = { success: [], failed: [] }

  for (const l of lecturers) {
    try {
      const hashedPassword = await bcrypt.hash('lecturer123', 10)

      const user = await prisma.user.create({
        data: { email: l.email, password: hashedPassword, role: 'LECTURER' }
      })

      await prisma.lecturer.create({
        data: {
          firstName: l.firstName,
          lastName: l.lastName,
          staffId: l.staffId,
          userId: user.id
        }
      })

      // Auto-notify if timetable exists
      try {
        const timetableExists = await prisma.timetable.findFirst()
        if (timetableExists) {
          await sendTimetableGeneratedEmail({
            to: l.email,
            name: `${l.firstName} ${l.lastName}`
          })
        }
      } catch (emailError) {
        console.error('Auto-notify failed for', l.staffId, emailError.message)
      }

      results.success.push(l.staffId)
    } catch (error) {
      results.failed.push({
        staffId: l.staffId,
        reason: error.code === 'P2002' ? 'Already exists' : error.message
      })
    }
  }

  res.json({
    message: `${results.success.length} added, ${results.failed.length} failed`,
    results
  })
}


// Get all departments for dropdowns
const getAllDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      include: { faculty: { select: { name: true } } },
      orderBy: { name: 'asc' }
    })
    res.json(departments)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Get all timeslots
const getAllTimeslots = async (req, res) => {
  try {
    const timeslots = await prisma.timeslot.findMany({
      orderBy: [{ day: 'asc' }, { startTime: 'asc' }]
    })
    res.json(timeslots)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
// Reset student password to default LASU pattern

module.exports = {
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
}