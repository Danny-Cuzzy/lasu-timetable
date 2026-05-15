const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const { sendTimetableGeneratedEmail, sendTimetableChangeEmail } = require('../services/emailService')

const generateTimetable = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: { lecturer: true, department: true }
    })
    const rooms = await prisma.room.findMany()
    const timeslots = await prisma.timeslot.findMany({
      orderBy: [{ day: 'asc' }, { startTime: 'asc' }]
    })

    await prisma.timetable.deleteMany()

    const timetable = []
    const unscheduled = []
    const lecturerBusy = {}
    const roomBusy = {}
    const dayLoad = {
      Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0
    }

    // Shuffle courses so same department doesn't cluster
    const shuffledCourses = [...courses].sort(() => Math.random() - 0.5)

    for (const course of shuffledCourses) {
      let assigned = false

      // Sort timeslots by day load so least loaded day is tried first
      const sortedTimeslots = [...timeslots].sort((a, b) => {
        const loadA = dayLoad[a.day] || 0
        const loadB = dayLoad[b.day] || 0
        if (loadA !== loadB) return loadA - loadB
        return a.startTime.localeCompare(b.startTime)
      })

      for (const timeslot of sortedTimeslots) {
        const lecturerKey = `${course.lecturerId}-${timeslot.id}`
        if (lecturerBusy[lecturerKey]) continue

        // Sort rooms by capacity to avoid wasting large rooms
        const sortedRooms = [...rooms].sort((a, b) => a.capacity - b.capacity)

        for (const room of sortedRooms) {
          const roomKey = `${room.id}-${timeslot.id}`
          if (roomBusy[roomKey]) continue

          lecturerBusy[lecturerKey] = true
          roomBusy[roomKey] = true
          dayLoad[timeslot.day] = (dayLoad[timeslot.day] || 0) + 1

          timetable.push({
            courseId: course.id,
            lecturerId: course.lecturerId,
            roomId: room.id,
            timeslotId: timeslot.id
          })

          assigned = true
          break
        }
        if (assigned) break
      }

      if (!assigned) {
        unscheduled.push({ code: course.code, title: course.title })
      }
    }

    await prisma.timetable.createMany({ data: timetable })

    // Send notifications
    try {
      const scheduledCourseIds = timetable.map(t => t.courseId)
      const lecturersToNotify = await prisma.lecturer.findMany({
        where: { courses: { some: { id: { in: scheduledCourseIds } } } },
        include: { user: { select: { email: true } } }
      })
      const studentsToNotify = await prisma.student.findMany({
        include: { user: { select: { email: true } } }
      })

      const emailPromises = []
      for (const lecturer of lecturersToNotify) {
        emailPromises.push(
          sendTimetableGeneratedEmail({
            to: lecturer.user.email,
            name: `${lecturer.firstName} ${lecturer.lastName}`
          })
        )
      }
      for (const student of studentsToNotify) {
        emailPromises.push(
          sendTimetableGeneratedEmail({
            to: student.user.email,
            name: `${student.firstName} ${student.lastName}`
          })
        )
      }
      await Promise.allSettled(emailPromises)
    } catch (emailError) {
      console.error('Email error:', emailError.message)
    }

    res.json({
      message: 'Timetable generated successfully',
      scheduled: timetable.length,
      unscheduled: unscheduled.length,
      unscheduledCourses: unscheduled,
      dayDistribution: dayLoad
    })

  } catch (error) {
    res.status(500).json({ message: 'Generation failed', error: error.message })
  }
}

const getTimetable = async (req, res) => {
  try {
    const entries = await prisma.timetable.findMany({
      include: {
        course: {
          include: { department: true }
        },
        lecturer: true,
        room: true,
        timeslot: true
      },
      orderBy: [
        { timeslot: { day: 'asc' } },
        { timeslot: { startTime: 'asc' } }
      ]
    })

    res.json(entries)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const updateTimetableEntry = async (req, res) => {
  const { id } = req.params
  const rooms = await prisma.room.findMany()
  const timeslots = await prisma.timeslot.findMany()
  const { roomId, timeslotId } = req.body

  try {
    // Check room is not already booked at this timeslot
    const roomConflict = await prisma.timetable.findFirst({
      where: {
        roomId: parseInt(roomId),
        timeslotId: parseInt(timeslotId),
        NOT: { id: parseInt(id) }
      }
    })
    if (roomConflict) {
      return res.status(400).json({
        message: 'Room is already booked at this timeslot'
      })
    }

    // Check lecturer is not already booked at this timeslot
    const entry = await prisma.timetable.findUnique({
      where: { id: parseInt(id) }
    })
    const lecturerConflict = await prisma.timetable.findFirst({
      where: {
        lecturerId: entry.lecturerId,
        timeslotId: parseInt(timeslotId),
        NOT: { id: parseInt(id) }
      }
    })
    if (lecturerConflict) {
      return res.status(400).json({
        message: 'Lecturer already has a class at this timeslot'
      })
    }

    const updated = await prisma.timetable.update({
      where: { id: parseInt(id) },
      data: {
        roomId: parseInt(roomId),
        timeslotId: parseInt(timeslotId)
      },
      include: {
        course: true,
        lecturer: true,
        room: true,
        timeslot: true
      }
    })

    // ── SEND CHANGE NOTIFICATION ──────────────────────────
try {
  const fullEntry = await prisma.timetable.findUnique({
    where: { id: parseInt(id) },
    include: {
      course: true,
      lecturer: { include: { user: { select: { email: true } } } },
      room: true,
      timeslot: true
    }
  })

  const oldRoom = rooms.find(r => r.id === entry.roomId)
  const oldTimeslot = timeslots.find(t => t.id === entry.timeslotId)

  // Determine what changed
  const roomChanged = parseInt(roomId) !== entry.roomId
  const timeslotChanged = parseInt(timeslotId) !== entry.timeslotId

  const changeType = roomChanged && timeslotChanged
    ? 'Room & Timeslot'
    : roomChanged ? 'Room' : 'Timeslot'

  const oldValue = roomChanged
    ? `${oldRoom?.name || 'Unknown'}`
    : `${oldTimeslot?.day} ${oldTimeslot?.startTime}–${oldTimeslot?.endTime}`

  const newValue = roomChanged
    ? `${fullEntry.room.name}`
    : `${fullEntry.timeslot.day} ${fullEntry.timeslot.startTime}–${fullEntry.timeslot.endTime}`

  const emailPayload = {
    courseCode: fullEntry.course.code,
    courseTitle: fullEntry.course.title,
    changeType,
    oldValue,
    newValue
  }

  // Email the lecturer
  await sendTimetableChangeEmail({
    to: fullEntry.lecturer.user.email,
    name: `${fullEntry.lecturer.firstName} ${fullEntry.lecturer.lastName}`,
    ...emailPayload
  })

  // Email all students
  const students = await prisma.student.findMany({
    include: { user: { select: { email: true } } }
  })

  await Promise.allSettled(
    students.map(s =>
      sendTimetableChangeEmail({
        to: s.user.email,
        name: `${s.firstName} ${s.lastName}`,
        ...emailPayload
      })
    )
  )
} catch (emailError) {
console.error('Email notification error:', emailError.message)
}

    res.json({
      message: 'Timetable entry updated',
      entry: updated
    })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const getLecturerTimetable = async (req, res) => {
  try {
    const userId = req.user.id

    const lecturer = await prisma.lecturer.findUnique({
      where: { userId }
    })

    if (!lecturer) {
      return res.status(404).json({ message: 'Lecturer not found' })
    }

    const entries = await prisma.timetable.findMany({
      where: { lecturerId: lecturer.id },
      include: {
        course: { include: { department: true } },
        room: true,
        timeslot: true
      },
      orderBy: [
        { timeslot: { day: 'asc' } },
        { timeslot: { startTime: 'asc' } }
      ]
    })

    res.json({
      lecturer: {
        name: `${lecturer.firstName} ${lecturer.lastName}`,
        staffId: lecturer.staffId
      },
      entries
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const getStudentTimetable = async (req, res) => {
  try {
    const userId = req.user.id

    const student = await prisma.student.findUnique({
      where: { userId },
      include: { department: true }
    })

    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    // Students see all courses in their department and level
    const entries = await prisma.timetable.findMany({
      where: {
        course: {
          departmentId: student.departmentId,
          level: student.level
        }
      },
      include: {
        course: { include: { department: true } },
        lecturer: true,
        room: true,
        timeslot: true
      },
      orderBy: [
        { timeslot: { day: 'asc' } },
        { timeslot: { startTime: 'asc' } }
      ]
    })

    res.json({
      student: {
        name: `${student.firstName} ${student.lastName}`,
        matricNumber: student.matricNumber,
        level: student.level,
        department: student.department.name
      },
      entries
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { 
    generateTimetable, 
    getTimetable, 
    updateTimetableEntry,
    getLecturerTimetable,
    getStudentTimetable
}