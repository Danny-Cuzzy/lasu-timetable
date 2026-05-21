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
  const { identifier, role, newPassword } = req.body

  try {
    if (role === 'STUDENT') {
      const student = await prisma.student.findUnique({
        where: { matricNumber: identifier },
        include: { user: true }
      })

      if (!student) {
        return res.status(404).json({
          message: 'No student found with that matric number'
        })
      }

      // If newPassword provided, use it. Otherwise reset to default.
      const passwordToSet = newPassword
        ? newPassword
        : `LASU${student.matricNumber}${student.lastName.toUpperCase()}`

      const hashedPassword = await bcrypt.hash(passwordToSet, 10)

      await prisma.user.update({
        where: { id: student.userId },
        data: { password: hashedPassword }
      })

      return res.json({
        message: 'Password reset successfully',
        defaultPassword: newPassword ? null : passwordToSet
      })
    }

    if (role === 'LECTURER') {
      const lecturer = await prisma.lecturer.findUnique({
        where: { staffId: identifier },
        include: { user: true }
      })

      if (!lecturer) {
        return res.status(404).json({
          message: 'No lecturer found with that Staff ID'
        })
      }

      const passwordToSet = newPassword || 'lecturer123'
      const hashedPassword = await bcrypt.hash(passwordToSet, 10)

      await prisma.user.update({
        where: { id: lecturer.userId },
        data: { password: hashedPassword }
      })

      return res.json({
        message: 'Password reset successfully',
        defaultPassword: newPassword ? null : passwordToSet
      })
    }

    return res.status(400).json({ message: 'Invalid role for password reset' })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const signup = async (req, res) => {
  const { matricNumber, email, password } = req.body

  try {
    // Find student by matric number
    const student = await prisma.student.findUnique({
      where: { matricNumber },
      include: { user: true }
    })

    if (!student) {
      return res.status(400).json({
        message: 'Matric number not found. Contact your administrator.'
      })
    }

    // Check email matches what admin stored
    if (student.user.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(400).json({
        message: 'Email address does not match our records for this matric number.'
      })
    }

    // Check if student has already signed up
    // We detect this by checking if password is still the default pattern
    // Actually we just allow password update — student can sign up again to reset
    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: student.userId },
      data: { password: hashedPassword }
    })

    const token = generateToken(student.user)
    res.json({
      message: 'Sign up successful',
      token,
      role: student.user.role,
      userId: student.user.id
    })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { register, login, resetPassword, signup }