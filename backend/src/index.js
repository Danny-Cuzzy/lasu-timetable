const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const timetableRoutes = require('./routes/timetableRoutes')

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'LASU Timetable API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes)
app.use('/api/timetable', timetableRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 


// Keep Supabase connection alive — pings every 4 minutes
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

setInterval(async () => {
  try {
    await prisma.$queryRaw`SELECT 1`
    console.log('🔄 DB keep-alive ping sent')
  } catch (e) {
    console.error('Keep-alive failed:', e.message)
  }
}, 4 * 60 * 1000)