const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// REGISTER
const register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role }
    });

    const token = generateToken(user);
    res.status(201).json({ token, role: user.role, userId: user.id });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// LOGIN
// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await prisma.user.findUnique({ where: { email } });

    // If not found by direct email, try finding student by matric number
    if (!user) {
      const student = await prisma.student.findUnique({
        where: { matricNumber: email },
        include: { user: true }
      });
      if (student) {
        user = student.user;
      }
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ token, role: user.role, userId: user.id });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const resetPassword = async (req, res) => {
  const { identifier, role } = req.body

  try {
    if (role === 'STUDENT') {
      const student = await prisma.student.findUnique({
        where: { matricNumber: identifier },
        include: { user: true }
      })

      if (!student) {
        return res.status(404).json({ message: 'No student found with that matric number' })
      }

      const defaultPassword = `LASU${student.matricNumber}${student.lastName.toUpperCase()}`
      const hashedPassword = await bcrypt.hash(defaultPassword, 10)

      await prisma.user.update({
        where: { id: student.userId },
        data: { password: hashedPassword }
      })

      return res.json({
        message: 'Password reset successfully',
        defaultPassword
      })
    }

    if (role === 'LECTURER') {
      const lecturer = await prisma.lecturer.findUnique({
        where: { staffId: identifier },
        include: { user: true }
      })

      if (!lecturer) {
        return res.status(404).json({ message: 'No lecturer found with that Staff ID' })
      }

      const defaultPassword = 'lecturer123'
      const hashedPassword = await bcrypt.hash(defaultPassword, 10)

      await prisma.user.update({
        where: { id: lecturer.userId },
        data: { password: hashedPassword }
      })

      return res.json({
        message: 'Password reset successfully',
        defaultPassword
      })
    }

    return res.status(400).json({ message: 'Invalid role for password reset' })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { register, login, resetPassword };
