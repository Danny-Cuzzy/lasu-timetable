const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ── CLEAR EXISTING DATA ───────────────────────────────────
  await prisma.timetable.deleteMany()
  await prisma.course.deleteMany()
  await prisma.student.deleteMany()
  await prisma.lecturer.deleteMany()
  await prisma.user.deleteMany()
  await prisma.timeslot.deleteMany()
  await prisma.room.deleteMany()
  await prisma.department.deleteMany()
  await prisma.faculty.deleteMany()
  console.log('🧹 Existing data cleared')

  // ── 1. FACULTIES ─────────────────────────────────────────
  const facCIT  = await prisma.faculty.create({ data: { name: 'Faculty of Computing and Information Technology' } })
  const facSci  = await prisma.faculty.create({ data: { name: 'Faculty of Science' } })
  const facArts = await prisma.faculty.create({ data: { name: 'Faculty of Arts' } })
  const facMgt  = await prisma.faculty.create({ data: { name: 'Faculty of Management Sciences' } })
  const facSoc  = await prisma.faculty.create({ data: { name: 'Faculty of Social Sciences' } })
  const facEdu  = await prisma.faculty.create({ data: { name: 'Faculty of Education' } })
  const facLaw  = await prisma.faculty.create({ data: { name: 'Faculty of Law' } })
  const facEng  = await prisma.faculty.create({ data: { name: 'Faculty of Engineering' } })
  console.log('✅ Faculties created')

  // ── 2. DEPARTMENTS ───────────────────────────────────────
  // CIT
  const deptCS   = await prisma.department.create({ data: { name: 'Computer Science', facultyId: facCIT.id } })
  const deptIT   = await prisma.department.create({ data: { name: 'Information Technology', facultyId: facCIT.id } })
  const deptCyber = await prisma.department.create({ data: { name: 'Cyber Security', facultyId: facCIT.id } })
  const deptSWE  = await prisma.department.create({ data: { name: 'Software Engineering', facultyId: facCIT.id } })
  const deptDSA  = await prisma.department.create({ data: { name: 'Data Science and Analytics', facultyId: facCIT.id } })

  // Science
  const deptMath  = await prisma.department.create({ data: { name: 'Mathematics', facultyId: facSci.id } })
  const deptPhys  = await prisma.department.create({ data: { name: 'Physics', facultyId: facSci.id } })
  const deptChem  = await prisma.department.create({ data: { name: 'Chemistry', facultyId: facSci.id } })
  const deptBioch = await prisma.department.create({ data: { name: 'Biochemistry', facultyId: facSci.id } })
  const deptMicro = await prisma.department.create({ data: { name: 'Microbiology', facultyId: facSci.id } })

  // Arts
  const deptEng   = await prisma.department.create({ data: { name: 'English Language', facultyId: facArts.id } })
  const deptHist  = await prisma.department.create({ data: { name: 'History and International Relations', facultyId: facArts.id } })
  const deptForLg = await prisma.department.create({ data: { name: 'Foreign Languages', facultyId: facArts.id } })
  const deptPhilo = await prisma.department.create({ data: { name: 'Philosophy', facultyId: facArts.id } })

  // Management Sciences
  const deptBusAd = await prisma.department.create({ data: { name: 'Business Administration', facultyId: facMgt.id } })
  const deptAcct  = await prisma.department.create({ data: { name: 'Accounting', facultyId: facMgt.id } })
  const deptFin   = await prisma.department.create({ data: { name: 'Banking and Finance', facultyId: facMgt.id } })
  const deptMktg  = await prisma.department.create({ data: { name: 'Marketing', facultyId: facMgt.id } })

  // Social Sciences
  const deptEcon  = await prisma.department.create({ data: { name: 'Economics', facultyId: facSoc.id } })
  const deptPol   = await prisma.department.create({ data: { name: 'Political Science', facultyId: facSoc.id } })
  const deptSoci  = await prisma.department.create({ data: { name: 'Sociology', facultyId: facSoc.id } })
  const deptPsych = await prisma.department.create({ data: { name: 'Psychology', facultyId: facSoc.id } })

  // Education
  const deptEdMgt = await prisma.department.create({ data: { name: 'Educational Management', facultyId: facEdu.id } })
  const deptEdFnd = await prisma.department.create({ data: { name: 'Educational Foundations and Counselling', facultyId: facEdu.id } })

  // Law
  const deptLaw   = await prisma.department.create({ data: { name: 'Law', facultyId: facLaw.id } })

  // Engineering
  const deptECE   = await prisma.department.create({ data: { name: 'Electronics and Computer Engineering', facultyId: facEng.id } })
  const deptCivil = await prisma.department.create({ data: { name: 'Civil Engineering', facultyId: facEng.id } })
  const deptMech  = await prisma.department.create({ data: { name: 'Mechanical Engineering', facultyId: facEng.id } })

  console.log('✅ Departments created')

  // ── 3. ROOMS ─────────────────────────────────────────────
  await prisma.room.createMany({
    data: [
      { name: 'LT1', capacity: 300, type: 'PHYSICAL', building: 'Main Block' },
      { name: 'LT2', capacity: 300, type: 'PHYSICAL', building: 'Main Block' },
      { name: 'LT3', capacity: 250, type: 'PHYSICAL', building: 'Main Block' },
      { name: 'LT4', capacity: 250, type: 'PHYSICAL', building: 'Annex Block' },
      { name: 'LT5', capacity: 200, type: 'PHYSICAL', building: 'Annex Block' },
      { name: 'LT6', capacity: 200, type: 'PHYSICAL', building: 'Annex Block' },
      { name: 'Lab 1', capacity: 60, type: 'PHYSICAL', building: 'ICT Block' },
      { name: 'Lab 2', capacity: 60, type: 'PHYSICAL', building: 'ICT Block' },
      { name: 'Lab 3', capacity: 60, type: 'PHYSICAL', building: 'ICT Block' },
      { name: 'Room 101', capacity: 80, type: 'PHYSICAL', building: 'Science Block' },
      { name: 'Room 102', capacity: 80, type: 'PHYSICAL', building: 'Science Block' },
      { name: 'Room 103', capacity: 80, type: 'PHYSICAL', building: 'Science Block' },
      { name: 'Room 201', capacity: 100, type: 'PHYSICAL', building: 'Arts Block' },
      { name: 'Room 202', capacity: 100, type: 'PHYSICAL', building: 'Arts Block' },
      { name: 'Room 301', capacity: 120, type: 'PHYSICAL', building: 'Management Block' },
      { name: 'Room 302', capacity: 120, type: 'PHYSICAL', building: 'Management Block' },
      { name: 'Zoom', capacity: 500, type: 'VIRTUAL', building: null },
      { name: 'Google Meet', capacity: 500, type: 'VIRTUAL', building: null },
      { name: 'LASU-VLAP', capacity: 1000, type: 'VIRTUAL', building: null },
    ]
  })
  console.log('✅ Rooms created')

  // ── 4. TIMESLOTS ─────────────────────────────────────────
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  const times = [
    { startTime: '08:00', endTime: '10:00' },
    { startTime: '10:00', endTime: '12:00' },
    { startTime: '12:00', endTime: '14:00' },
    { startTime: '14:00', endTime: '16:00' },
    { startTime: '16:00', endTime: '18:00' },
  ]
  for (const day of days) {
    for (const time of times) {
      await prisma.timeslot.create({ data: { day, ...time } })
    }
  }
  console.log('✅ Timeslots created')

  // ── 5. LECTURERS ─────────────────────────────────────────
  const lecturerData = [
    // CS — real LASU names from document
    { firstName: 'Taofik', lastName: 'Ajagbe', staffId: 'LASU/CS/001' },
    { firstName: 'Adetokunbo', lastName: 'Adenowo', staffId: 'LASU/CS/002' },
    { firstName: 'Olukayode', lastName: 'Aiyeniko', staffId: 'LASU/CS/003' },
    { firstName: 'Boluwaji', lastName: 'Akinnuwesi', staffId: 'LASU/CS/004' },
    { firstName: 'Benjamin', lastName: 'Aribisala', staffId: 'LASU/CS/005' },
    { firstName: 'Uthman', lastName: 'Dosumu', staffId: 'LASU/CS/006' },
    { firstName: 'Olusola', lastName: 'Olabanjo', staffId: 'LASU/CS/007' },
    { firstName: 'Ayodele', lastName: 'Oloyede', staffId: 'LASU/CS/008' },
    { firstName: 'Rilwan', lastName: 'Shanu', staffId: 'LASU/CS/009' },
    { firstName: 'Kehinde', lastName: 'Sotonwa', staffId: 'LASU/CS/010' },
    { firstName: 'Adam', lastName: 'Zubair', staffId: 'LASU/CS/011' },
    { firstName: 'Mukaila', lastName: 'Rahman', staffId: 'LASU/CS/012' },
    // Science
    { firstName: 'Adeleke', lastName: 'Adeniyi', staffId: 'LASU/CHM/001' },
    { firstName: 'Olabunmi', lastName: 'Adewusi', staffId: 'LASU/CHM/002' },
    { firstName: 'Michael', lastName: 'Dosunmu', staffId: 'LASU/CHM/003' },
    { firstName: 'Segun', lastName: 'Adeola', staffId: 'LASU/BCH/001' },
    { firstName: 'Adesegun', lastName: 'Adeyemo', staffId: 'LASU/BCH/002' },
    { firstName: 'Habeeb', lastName: 'Bankole', staffId: 'LASU/BCH/003' },
    // Arts
    { firstName: 'Oladele', lastName: 'Adejobi', staffId: 'LASU/ENG/001' },
    { firstName: 'Ezekiel', lastName: 'Ajose', staffId: 'LASU/ENG/002' },
    { firstName: 'Ganiu', lastName: 'Bamgbose', staffId: 'LASU/ENG/003' },
    { firstName: 'Issiaka', lastName: 'Daouda', staffId: 'LASU/FOR/001' },
    { firstName: 'Tunde', lastName: 'Fatunde', staffId: 'LASU/FOR/002' },
    // Management
    { firstName: 'Saidi', lastName: 'Adelekan', staffId: 'LASU/BUS/001' },
    { firstName: 'Abayomi', lastName: 'Adeoye', staffId: 'LASU/BUS/002' },
    { firstName: 'Matthew', lastName: 'Abata', staffId: 'LASU/ACC/001' },
    { firstName: 'James', lastName: 'Abiola', staffId: 'LASU/ACC/002' },
    // Social Sciences
    { firstName: 'Titilola', lastName: 'Abari', staffId: 'LASU/ECO/001' },
    { firstName: 'Felix', lastName: 'Adekunjo', staffId: 'LASU/ECO/002' },
    { firstName: 'Idris', lastName: 'Adenuga', staffId: 'LASU/ECO/003' },
    // Engineering
    { firstName: 'Abiodun', lastName: 'Ajasa', staffId: 'LASU/ECE/001' },
    { firstName: 'Lateef', lastName: 'Akinyemi', staffId: 'LASU/ECE/002' },
    { firstName: 'Adeyinka', lastName: 'Ogunlewe', staffId: 'LASU/ECE/003' },
  ]

  const lecturers = []
  for (const l of lecturerData) {
    const tag = l.staffId.replace(/\//g, '.')
    const email = `bossmand698+${tag}@gmail.com`
    const hashedPassword = await bcrypt.hash('lecturer123', 10)
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role: 'LECTURER' }
    })
    const lecturer = await prisma.lecturer.create({
      data: { staffId: l.staffId, firstName: l.firstName, lastName: l.lastName, userId: user.id }
    })
    lecturers.push(lecturer)
  }
  console.log('✅ Lecturers created')

  // ── 6. COURSES ───────────────────────────────────────────
  const coursesData = [
    // ── Computer Science ──
    { code: 'CSC101', title: 'Introduction to Computer Science', unitLoad: 3, level: 100, departmentId: deptCS.id, lecturerId: lecturers[0].id },
    { code: 'CSC102', title: 'Introduction to Programming', unitLoad: 3, level: 100, departmentId: deptCS.id, lecturerId: lecturers[1].id },
    { code: 'CSC103', title: 'Logic and Problem Solving', unitLoad: 2, level: 100, departmentId: deptCS.id, lecturerId: lecturers[2].id },
    { code: 'CSC201', title: 'Data Structures', unitLoad: 3, level: 200, departmentId: deptCS.id, lecturerId: lecturers[3].id },
    { code: 'CSC202', title: 'Discrete Mathematics', unitLoad: 3, level: 200, departmentId: deptCS.id, lecturerId: lecturers[4].id },
    { code: 'CSC203', title: 'Object Oriented Programming', unitLoad: 3, level: 200, departmentId: deptCS.id, lecturerId: lecturers[5].id },
    { code: 'CSC204', title: 'Computer Organization', unitLoad: 3, level: 200, departmentId: deptCS.id, lecturerId: lecturers[6].id },
    { code: 'CSC301', title: 'Data Structures and Algorithms', unitLoad: 3, level: 300, departmentId: deptCS.id, lecturerId: lecturers[0].id },
    { code: 'CSC302', title: 'Computer Architecture', unitLoad: 3, level: 300, departmentId: deptCS.id, lecturerId: lecturers[1].id },
    { code: 'CSC303', title: 'Operating Systems', unitLoad: 3, level: 300, departmentId: deptCS.id, lecturerId: lecturers[2].id },
    { code: 'CSC304', title: 'Computer Networks', unitLoad: 3, level: 300, departmentId: deptCS.id, lecturerId: lecturers[3].id },
    { code: 'CSC305', title: 'Theory of Computation', unitLoad: 3, level: 300, departmentId: deptCS.id, lecturerId: lecturers[4].id },
    { code: 'CSC401', title: 'Artificial Intelligence', unitLoad: 3, level: 400, departmentId: deptCS.id, lecturerId: lecturers[5].id },
    { code: 'CSC402', title: 'Software Engineering', unitLoad: 3, level: 400, departmentId: deptCS.id, lecturerId: lecturers[6].id },
    { code: 'CSC403', title: 'Database Management Systems', unitLoad: 3, level: 400, departmentId: deptCS.id, lecturerId: lecturers[7].id },
    { code: 'CSC404', title: 'Information Security', unitLoad: 3, level: 400, departmentId: deptCS.id, lecturerId: lecturers[8].id },
    { code: 'CSC405', title: 'Machine Learning', unitLoad: 3, level: 400, departmentId: deptCS.id, lecturerId: lecturers[9].id },

    // ── Information Technology ──
    { code: 'ITT101', title: 'Introduction to IT', unitLoad: 3, level: 100, departmentId: deptIT.id, lecturerId: lecturers[10].id },
    { code: 'ITT201', title: 'Web Design Fundamentals', unitLoad: 3, level: 200, departmentId: deptIT.id, lecturerId: lecturers[11].id },
    { code: 'ITT202', title: 'Database Systems', unitLoad: 3, level: 200, departmentId: deptIT.id, lecturerId: lecturers[0].id },
    { code: 'ITT301', title: 'Web Technologies', unitLoad: 3, level: 300, departmentId: deptIT.id, lecturerId: lecturers[1].id },
    { code: 'ITT302', title: 'Network Administration', unitLoad: 3, level: 300, departmentId: deptIT.id, lecturerId: lecturers[2].id },
    { code: 'ITT303', title: 'Cloud Computing', unitLoad: 3, level: 300, departmentId: deptIT.id, lecturerId: lecturers[3].id },
    { code: 'ITT401', title: 'Cybersecurity Fundamentals', unitLoad: 3, level: 400, departmentId: deptIT.id, lecturerId: lecturers[4].id },
    { code: 'ITT402', title: 'IT Project Management', unitLoad: 3, level: 400, departmentId: deptIT.id, lecturerId: lecturers[5].id },

    // ── Cyber Security ──
    { code: 'CYB201', title: 'Fundamentals of Cyber Security', unitLoad: 3, level: 200, departmentId: deptCyber.id, lecturerId: lecturers[6].id },
    { code: 'CYB301', title: 'Ethical Hacking', unitLoad: 3, level: 300, departmentId: deptCyber.id, lecturerId: lecturers[7].id },
    { code: 'CYB302', title: 'Digital Forensics', unitLoad: 3, level: 300, departmentId: deptCyber.id, lecturerId: lecturers[8].id },
    { code: 'CYB303', title: 'Cryptography', unitLoad: 3, level: 300, departmentId: deptCyber.id, lecturerId: lecturers[9].id },
    { code: 'CYB401', title: 'Network Security', unitLoad: 3, level: 400, departmentId: deptCyber.id, lecturerId: lecturers[10].id },
    { code: 'CYB402', title: 'Malware Analysis', unitLoad: 3, level: 400, departmentId: deptCyber.id, lecturerId: lecturers[11].id },

    // ── Software Engineering ──
    { code: 'SWE201', title: 'Introduction to Software Engineering', unitLoad: 3, level: 200, departmentId: deptSWE.id, lecturerId: lecturers[0].id },
    { code: 'SWE301', title: 'Software Design Patterns', unitLoad: 3, level: 300, departmentId: deptSWE.id, lecturerId: lecturers[1].id },
    { code: 'SWE302', title: 'Agile Development', unitLoad: 3, level: 300, departmentId: deptSWE.id, lecturerId: lecturers[2].id },
    { code: 'SWE303', title: 'Requirements Engineering', unitLoad: 3, level: 300, departmentId: deptSWE.id, lecturerId: lecturers[3].id },
    { code: 'SWE401', title: 'Software Testing', unitLoad: 3, level: 400, departmentId: deptSWE.id, lecturerId: lecturers[4].id },
    { code: 'SWE402', title: 'DevOps and CI/CD', unitLoad: 3, level: 400, departmentId: deptSWE.id, lecturerId: lecturers[5].id },

    // ── Data Science ──
    { code: 'DSA201', title: 'Introduction to Data Science', unitLoad: 3, level: 200, departmentId: deptDSA.id, lecturerId: lecturers[6].id },
    { code: 'DSA301', title: 'Statistical Computing', unitLoad: 3, level: 300, departmentId: deptDSA.id, lecturerId: lecturers[7].id },
    { code: 'DSA302', title: 'Data Mining', unitLoad: 3, level: 300, departmentId: deptDSA.id, lecturerId: lecturers[8].id },
    { code: 'DSA401', title: 'Big Data Analytics', unitLoad: 3, level: 400, departmentId: deptDSA.id, lecturerId: lecturers[9].id },

    // ── Mathematics ──
    { code: 'MTH101', title: 'Elementary Mathematics I', unitLoad: 3, level: 100, departmentId: deptMath.id, lecturerId: lecturers[10].id },
    { code: 'MTH102', title: 'Elementary Mathematics II', unitLoad: 3, level: 100, departmentId: deptMath.id, lecturerId: lecturers[11].id },
    { code: 'MTH201', title: 'Calculus I', unitLoad: 3, level: 200, departmentId: deptMath.id, lecturerId: lecturers[10].id },
    { code: 'MTH202', title: 'Calculus II', unitLoad: 3, level: 200, departmentId: deptMath.id, lecturerId: lecturers[11].id },
    { code: 'MTH301', title: 'Linear Algebra', unitLoad: 3, level: 300, departmentId: deptMath.id, lecturerId: lecturers[10].id },
    { code: 'MTH302', title: 'Real Analysis', unitLoad: 3, level: 300, departmentId: deptMath.id, lecturerId: lecturers[11].id },
    { code: 'MTH401', title: 'Numerical Analysis', unitLoad: 3, level: 400, departmentId: deptMath.id, lecturerId: lecturers[10].id },

    // ── Physics ──
    { code: 'PHY101', title: 'General Physics I', unitLoad: 3, level: 100, departmentId: deptPhys.id, lecturerId: lecturers[12].id },
    { code: 'PHY102', title: 'General Physics II', unitLoad: 3, level: 100, departmentId: deptPhys.id, lecturerId: lecturers[13].id },
    { code: 'PHY201', title: 'Mechanics', unitLoad: 3, level: 200, departmentId: deptPhys.id, lecturerId: lecturers[12].id },
    { code: 'PHY301', title: 'Electromagnetism', unitLoad: 3, level: 300, departmentId: deptPhys.id, lecturerId: lecturers[13].id },
    { code: 'PHY401', title: 'Quantum Mechanics', unitLoad: 3, level: 400, departmentId: deptPhys.id, lecturerId: lecturers[14].id },

    // ── Chemistry ──
    { code: 'CHM101', title: 'General Chemistry I', unitLoad: 3, level: 100, departmentId: deptChem.id, lecturerId: lecturers[12].id },
    { code: 'CHM102', title: 'General Chemistry II', unitLoad: 3, level: 100, departmentId: deptChem.id, lecturerId: lecturers[13].id },
    { code: 'CHM201', title: 'Organic Chemistry I', unitLoad: 3, level: 200, departmentId: deptChem.id, lecturerId: lecturers[14].id },
    { code: 'CHM301', title: 'Physical Chemistry', unitLoad: 3, level: 300, departmentId: deptChem.id, lecturerId: lecturers[12].id },
    { code: 'CHM401', title: 'Analytical Chemistry', unitLoad: 3, level: 400, departmentId: deptChem.id, lecturerId: lecturers[13].id },

    // ── Biochemistry ──
    { code: 'BCH201', title: 'Introduction to Biochemistry', unitLoad: 3, level: 200, departmentId: deptBioch.id, lecturerId: lecturers[15].id },
    { code: 'BCH301', title: 'Enzymology', unitLoad: 3, level: 300, departmentId: deptBioch.id, lecturerId: lecturers[16].id },
    { code: 'BCH401', title: 'Molecular Biology', unitLoad: 3, level: 400, departmentId: deptBioch.id, lecturerId: lecturers[17].id },

    // ── Microbiology ──
    { code: 'MCB201', title: 'General Microbiology', unitLoad: 3, level: 200, departmentId: deptMicro.id, lecturerId: lecturers[15].id },
    { code: 'MCB301', title: 'Medical Microbiology', unitLoad: 3, level: 300, departmentId: deptMicro.id, lecturerId: lecturers[16].id },
    { code: 'MCB401', title: 'Virology', unitLoad: 3, level: 400, departmentId: deptMicro.id, lecturerId: lecturers[17].id },

    // ── English Language ──
    { code: 'ENG101', title: 'Use of English I', unitLoad: 2, level: 100, departmentId: deptEng.id, lecturerId: lecturers[18].id },
    { code: 'ENG102', title: 'Use of English II', unitLoad: 2, level: 100, departmentId: deptEng.id, lecturerId: lecturers[19].id },
    { code: 'ENG201', title: 'Introduction to Literature', unitLoad: 3, level: 200, departmentId: deptEng.id, lecturerId: lecturers[20].id },
    { code: 'ENG301', title: 'African Literature', unitLoad: 3, level: 300, departmentId: deptEng.id, lecturerId: lecturers[18].id },
    { code: 'ENG302', title: 'Linguistics', unitLoad: 3, level: 300, departmentId: deptEng.id, lecturerId: lecturers[19].id },
    { code: 'ENG401', title: 'Research Methods in English', unitLoad: 3, level: 400, departmentId: deptEng.id, lecturerId: lecturers[20].id },

    // ── History ──
    { code: 'HIS201', title: 'Nigerian History', unitLoad: 3, level: 200, departmentId: deptHist.id, lecturerId: lecturers[18].id },
    { code: 'HIS301', title: 'African History', unitLoad: 3, level: 300, departmentId: deptHist.id, lecturerId: lecturers[19].id },
    { code: 'HIS401', title: 'International Relations', unitLoad: 3, level: 400, departmentId: deptHist.id, lecturerId: lecturers[20].id },

    // ── Foreign Languages ──
    { code: 'FOR201', title: 'French I', unitLoad: 3, level: 200, departmentId: deptForLg.id, lecturerId: lecturers[21].id },
    { code: 'FOR301', title: 'French II', unitLoad: 3, level: 300, departmentId: deptForLg.id, lecturerId: lecturers[22].id },
    { code: 'FOR401', title: 'Translation Studies', unitLoad: 3, level: 400, departmentId: deptForLg.id, lecturerId: lecturers[21].id },

    // ── Philosophy ──
    { code: 'PHI201', title: 'Introduction to Philosophy', unitLoad: 3, level: 200, departmentId: deptPhilo.id, lecturerId: lecturers[22].id },
    { code: 'PHI301', title: 'Logic and Critical Thinking', unitLoad: 3, level: 300, departmentId: deptPhilo.id, lecturerId: lecturers[21].id },
    { code: 'PHI401', title: 'Ethics and Moral Philosophy', unitLoad: 3, level: 400, departmentId: deptPhilo.id, lecturerId: lecturers[22].id },

    // ── Business Administration ──
    { code: 'BUS101', title: 'Introduction to Business', unitLoad: 3, level: 100, departmentId: deptBusAd.id, lecturerId: lecturers[23].id },
    { code: 'BUS201', title: 'Principles of Management', unitLoad: 3, level: 200, departmentId: deptBusAd.id, lecturerId: lecturers[24].id },
    { code: 'BUS301', title: 'Organisational Behaviour', unitLoad: 3, level: 300, departmentId: deptBusAd.id, lecturerId: lecturers[23].id },
    { code: 'BUS401', title: 'Strategic Management', unitLoad: 3, level: 400, departmentId: deptBusAd.id, lecturerId: lecturers[24].id },

    // ── Accounting ──
    { code: 'ACC101', title: 'Introduction to Accounting', unitLoad: 3, level: 100, departmentId: deptAcct.id, lecturerId: lecturers[25].id },
    { code: 'ACC201', title: 'Financial Accounting', unitLoad: 3, level: 200, departmentId: deptAcct.id, lecturerId: lecturers[26].id },
    { code: 'ACC301', title: 'Management Accounting', unitLoad: 3, level: 300, departmentId: deptAcct.id, lecturerId: lecturers[25].id },
    { code: 'ACC401', title: 'Auditing and Assurance', unitLoad: 3, level: 400, departmentId: deptAcct.id, lecturerId: lecturers[26].id },

    // ── Banking and Finance ──
    { code: 'FIN201', title: 'Money and Banking', unitLoad: 3, level: 200, departmentId: deptFin.id, lecturerId: lecturers[25].id },
    { code: 'FIN301', title: 'Corporate Finance', unitLoad: 3, level: 300, departmentId: deptFin.id, lecturerId: lecturers[26].id },
    { code: 'FIN401', title: 'Investment Analysis', unitLoad: 3, level: 400, departmentId: deptFin.id, lecturerId: lecturers[25].id },

    // ── Economics ──
    { code: 'ECO101', title: 'Introduction to Economics', unitLoad: 3, level: 100, departmentId: deptEcon.id, lecturerId: lecturers[27].id },
    { code: 'ECO201', title: 'Microeconomics', unitLoad: 3, level: 200, departmentId: deptEcon.id, lecturerId: lecturers[28].id },
    { code: 'ECO202', title: 'Macroeconomics', unitLoad: 3, level: 200, departmentId: deptEcon.id, lecturerId: lecturers[29].id },
    { code: 'ECO301', title: 'Econometrics', unitLoad: 3, level: 300, departmentId: deptEcon.id, lecturerId: lecturers[27].id },
    { code: 'ECO401', title: 'Development Economics', unitLoad: 3, level: 400, departmentId: deptEcon.id, lecturerId: lecturers[28].id },

    // ── Political Science ──
    { code: 'POL201', title: 'Introduction to Political Science', unitLoad: 3, level: 200, departmentId: deptPol.id, lecturerId: lecturers[29].id },
    { code: 'POL301', title: 'Comparative Politics', unitLoad: 3, level: 300, departmentId: deptPol.id, lecturerId: lecturers[27].id },
    { code: 'POL401', title: 'Nigerian Government and Politics', unitLoad: 3, level: 400, departmentId: deptPol.id, lecturerId: lecturers[28].id },

    // ── Sociology ──
    { code: 'SOC201', title: 'Introduction to Sociology', unitLoad: 3, level: 200, departmentId: deptSoci.id, lecturerId: lecturers[29].id },
    { code: 'SOC301', title: 'Social Research Methods', unitLoad: 3, level: 300, departmentId: deptSoci.id, lecturerId: lecturers[27].id },
    { code: 'SOC401', title: 'Development Sociology', unitLoad: 3, level: 400, departmentId: deptSoci.id, lecturerId: lecturers[28].id },

    // ── Law ──
    { code: 'LAW101', title: 'Nigerian Legal System', unitLoad: 3, level: 100, departmentId: deptLaw.id, lecturerId: lecturers[29].id },
    { code: 'LAW201', title: 'Law of Contract', unitLoad: 3, level: 200, departmentId: deptLaw.id, lecturerId: lecturers[27].id },
    { code: 'LAW301', title: 'Constitutional Law', unitLoad: 3, level: 300, departmentId: deptLaw.id, lecturerId: lecturers[28].id },
    { code: 'LAW401', title: 'Criminal Law', unitLoad: 3, level: 400, departmentId: deptLaw.id, lecturerId: lecturers[29].id },

    // ── Engineering ──
    { code: 'ECE301', title: 'Digital Electronics', unitLoad: 3, level: 300, departmentId: deptECE.id, lecturerId: lecturers[30].id },
    { code: 'ECE302', title: 'Microprocessors', unitLoad: 3, level: 300, departmentId: deptECE.id, lecturerId: lecturers[31].id },
    { code: 'ECE401', title: 'Embedded Systems', unitLoad: 3, level: 400, departmentId: deptECE.id, lecturerId: lecturers[32].id },
    { code: 'CVE301', title: 'Structural Analysis', unitLoad: 3, level: 300, departmentId: deptCivil.id, lecturerId: lecturers[30].id },
    { code: 'CVE401', title: 'Foundation Engineering', unitLoad: 3, level: 400, departmentId: deptCivil.id, lecturerId: lecturers[31].id },
    { code: 'MCE301', title: 'Thermodynamics', unitLoad: 3, level: 300, departmentId: deptMech.id, lecturerId: lecturers[32].id },
    { code: 'MCE401', title: 'Fluid Mechanics', unitLoad: 3, level: 400, departmentId: deptMech.id, lecturerId: lecturers[30].id },
  ]

  for (const c of coursesData) {
    await prisma.course.create({ data: c })
  }
  console.log('✅ Courses created')

  // ── 7. STUDENTS ──────────────────────────────────────────
  const studentData = [
    // CS — real
    { firstName: 'Daniel', lastName: 'Arinze', matricNumber: '220591085', level: 200, departmentId: deptCS.id },
    { firstName: 'Peter', lastName: 'Chukwura', matricNumber: '210502034', level: 300, departmentId: deptCS.id },
    // CS — fabricated
    { firstName: 'Emeka', lastName: 'Okonkwo', matricNumber: '220591086', level: 200, departmentId: deptCS.id },
    { firstName: 'Tunde', lastName: 'Bakare', matricNumber: '210502035', level: 300, departmentId: deptCS.id },
    { firstName: 'Ngozi', lastName: 'Eze', matricNumber: '200488021', level: 400, departmentId: deptCS.id },
    { firstName: 'Biodun', lastName: 'Adewale', matricNumber: '200488022', level: 400, departmentId: deptCS.id },
    { firstName: 'Fatima', lastName: 'Sule', matricNumber: '230612001', level: 100, departmentId: deptCS.id },
    { firstName: 'Chidi', lastName: 'Nwosu', matricNumber: '230612002', level: 100, departmentId: deptCS.id },
    // IT
    { firstName: 'Ada', lastName: 'Obi', matricNumber: '220591090', level: 200, departmentId: deptIT.id },
    { firstName: 'Seun', lastName: 'Adeyemi', matricNumber: '210502040', level: 300, departmentId: deptIT.id },
    { firstName: 'Kemi', lastName: 'Lawal', matricNumber: '200488030', level: 400, departmentId: deptIT.id },
    { firstName: 'Bode', lastName: 'Adekunle', matricNumber: '230612010', level: 100, departmentId: deptIT.id },
    // Cyber Security
    { firstName: 'Yusuf', lastName: 'Ibrahim', matricNumber: '210502041', level: 300, departmentId: deptCyber.id },
    { firstName: 'Amaka', lastName: 'Osei', matricNumber: '200488031', level: 400, departmentId: deptCyber.id },
    { firstName: 'Sola', lastName: 'Afolabi', matricNumber: '220591095', level: 200, departmentId: deptCyber.id },
    // Software Engineering
    { firstName: 'Lanre', lastName: 'Bello', matricNumber: '210502042', level: 300, departmentId: deptSWE.id },
    { firstName: 'Chisom', lastName: 'Agu', matricNumber: '200488032', level: 400, departmentId: deptSWE.id },
    { firstName: 'Dayo', lastName: 'Ogundimu', matricNumber: '220591096', level: 200, departmentId: deptSWE.id },
    // Data Science
    { firstName: 'Zara', lastName: 'Ahmed', matricNumber: '220591097', level: 200, departmentId: deptDSA.id },
    { firstName: 'Femi', lastName: 'Osho', matricNumber: '210502043', level: 300, departmentId: deptDSA.id },
    // Mathematics
    { firstName: 'Bisi', lastName: 'Ogunleye', matricNumber: '210502044', level: 300, departmentId: deptMath.id },
    { firstName: 'Rotimi', lastName: 'Adekunle', matricNumber: '220591092', level: 200, departmentId: deptMath.id },
    { firstName: 'Hauwa', lastName: 'Musa', matricNumber: '200488033', level: 400, departmentId: deptMath.id },
    // Physics
    { firstName: 'Zainab', lastName: 'Yusuf', matricNumber: '210502045', level: 300, departmentId: deptPhys.id },
    { firstName: 'Kunle', lastName: 'Adebayo', matricNumber: '220591093', level: 200, departmentId: deptPhys.id },
    // Chemistry
    { firstName: 'Folake', lastName: 'Ojo', matricNumber: '220591098', level: 200, departmentId: deptChem.id },
    { firstName: 'Gbenga', lastName: 'Salami', matricNumber: '210502046', level: 300, departmentId: deptChem.id },
    // Biochemistry
    { firstName: 'Chidinma', lastName: 'Okafor', matricNumber: '220591099', level: 200, departmentId: deptBioch.id },
    { firstName: 'Rasheed', lastName: 'Balogun', matricNumber: '210502047', level: 300, departmentId: deptBioch.id },
    // English
    { firstName: 'Taiwo', lastName: 'Ogundele', matricNumber: '220591100', level: 200, departmentId: deptEng.id },
    { firstName: 'Kehinde', lastName: 'Ogundele', matricNumber: '210502048', level: 300, departmentId: deptEng.id },
    // History
    { firstName: 'Musa', lastName: 'Garba', matricNumber: '220591101', level: 200, departmentId: deptHist.id },
    { firstName: 'Adaeze', lastName: 'Nwosu', matricNumber: '210502049', level: 300, departmentId: deptHist.id },
    // Business Admin
    { firstName: 'Tobi', lastName: 'Adeleke', matricNumber: '220591102', level: 200, departmentId: deptBusAd.id },
    { firstName: 'Lola', lastName: 'Akinwande', matricNumber: '210502050', level: 300, departmentId: deptBusAd.id },
    { firstName: 'Emeka', lastName: 'Chukwu', matricNumber: '200488034', level: 400, departmentId: deptBusAd.id },
    // Accounting
    { firstName: 'Shade', lastName: 'Okonkwo', matricNumber: '220591103', level: 200, departmentId: deptAcct.id },
    { firstName: 'Kayode', lastName: 'Adebiyi', matricNumber: '210502051', level: 300, departmentId: deptAcct.id },
    // Economics
    { firstName: 'Nkem', lastName: 'Obi', matricNumber: '220591104', level: 200, departmentId: deptEcon.id },
    { firstName: 'Hassan', lastName: 'Usman', matricNumber: '210502052', level: 300, departmentId: deptEcon.id },
    { firstName: 'Grace', lastName: 'Eze', matricNumber: '200488035', level: 400, departmentId: deptEcon.id },
    // Law
    { firstName: 'Tola', lastName: 'Adegoke', matricNumber: '220591105', level: 200, departmentId: deptLaw.id },
    { firstName: 'Ifeanyi', lastName: 'Obi', matricNumber: '210502053', level: 300, departmentId: deptLaw.id },
    // Engineering
    { firstName: 'Seyi', lastName: 'Omotosho', matricNumber: '220591106', level: 200, departmentId: deptECE.id },
    { firstName: 'Uche', lastName: 'Okafor', matricNumber: '210502054', level: 300, departmentId: deptECE.id },
  ]

  for (const st of studentData) {
    const rawPassword = `LASU${st.matricNumber}${st.lastName.toUpperCase()}`
    const hashedPassword = await bcrypt.hash(rawPassword, 10)
    const email = `daniel.arinze220591085+${st.matricNumber}@st.lasu.edu.ng`
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role: 'STUDENT' }
    })
    await prisma.student.create({
      data: {
        matricNumber: st.matricNumber,
        firstName: st.firstName,
        lastName: st.lastName,
        level: st.level,
        departmentId: st.departmentId,
        userId: user.id
      }
    })
  }
  console.log('✅ Students created')

  // ── 8. ADMIN ─────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.create({
    data: { email: 'admin@lasu.edu.ng', password: adminPassword, role: 'ADMIN' }
  })
  console.log('✅ Admin created')
  console.log('')
  console.log('🎉 Seeding complete!')
  console.log('─────────────────────────────────────────────────')
  console.log('👤 ADMIN    → admin@lasu.edu.ng / admin123')
  console.log('👨‍🏫 LECTURER → bossmand698+LASU.CS.001@gmail.com / lecturer123')
  console.log('👨‍🎓 STUDENT  → matric: 220591085 / LASU220591085ARINZE')
  console.log('─────────────────────────────────────────────────')
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })