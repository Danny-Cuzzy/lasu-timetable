const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_HOST,
  port: parseInt(process.env.BREVO_PORT),
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS
  }
})

transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error)
  } else {
    console.log('✅ Email transporter ready')
  }
})

const sendTimetableChangeEmail = async ({ to, name, courseCode, courseTitle, changeType, oldValue, newValue }) => {
  const mailOptions = {
    from: `"LASU Timetable System" <${process.env.BREVO_USER}>`,
    to,
    subject: `Timetable Update: ${courseCode} — ${changeType} Changed`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0a1f44; padding: 24px 32px;">
          <h1 style="color: white; margin: 0; font-size: 18px;">
            Lagos State University
          </h1>
          <p style="color: #93c5fd; margin: 4px 0 0 0; font-size: 13px;">
            Timetable Management System
          </p>
        </div>
        <div style="padding: 32px; background-color: #f9fafb;
          border: 1px solid #e5e7eb;">
          <p style="color: #374151; font-size: 15px; margin-top: 0;">
            Dear <strong>${name}</strong>,
          </p>
          <p style="color: #374151; font-size: 14px;">
            A timetable update has been made to a course you are associated with.
          </p>
          <div style="background: white; border: 1px solid #e5e7eb;
            border-left: 4px solid #0a1f44; border-radius: 6px;
            padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #6b7280;">
              Course
            </p>
            <p style="margin: 0 0 16px 0; font-size: 15px;
              font-weight: bold; color: #0a1f44;">
              ${courseCode} — ${courseTitle}
            </p>
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #6b7280;">
              What Changed
            </p>
            <p style="margin: 0 0 16px 0; font-size: 15px; color: #374151;">
              ${changeType}
            </p>
            <div style="display: flex; gap: 16px;">
              <div style="flex: 1; background: #fef2f2;
                border-radius: 4px; padding: 12px;">
                <p style="margin: 0 0 4px 0; font-size: 11px;
                  color: #ef4444; font-weight: bold;">Previous</p>
                <p style="margin: 0; font-size: 14px; color: #374151;">
                  ${oldValue}
                </p>
              </div>
              <div style="flex: 1; background: #f0fdf4;
                border-radius: 4px; padding: 12px;">
                <p style="margin: 0 0 4px 0; font-size: 11px;
                  color: #16a34a; font-weight: bold;">New</p>
                <p style="margin: 0; font-size: 14px; color: #374151;">
                  ${newValue}
                </p>
              </div>
            </div>
          </div>
          <a href="${process.env.FRONTEND_URL}"
            style="display: inline-block; background-color: #0a1f44;
              color: white; padding: 12px 24px; border-radius: 6px;
              text-decoration: none; font-size: 14px; font-weight: bold;">
            View Updated Timetable
          </a>
        </div>
        <div style="padding: 16px 32px; background-color: #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;
            text-align: center;">
            This is an automated notification from the LASU Timetable
            Management System.
          </p>
        </div>
      </div>
    `
  }
  await transporter.sendMail(mailOptions)
}

const sendTimetableGeneratedEmail = async ({ to, name }) => {
  const mailOptions = {
    from: `"LASU Timetable System" <${process.env.BREVO_USER}>`,
    to,
    subject: 'New Timetable Published — LASU',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0a1f44; padding: 24px 32px;">
          <h1 style="color: white; margin: 0; font-size: 18px;">
            Lagos State University
          </h1>
          <p style="color: #93c5fd; margin: 4px 0 0 0; font-size: 13px;">
            Timetable Management System
          </p>
        </div>
        <div style="padding: 32px; background-color: #f9fafb;
          border: 1px solid #e5e7eb;">
          <p style="color: #374151; font-size: 15px; margin-top: 0;">
            Dear <strong>${name}</strong>,
          </p>
          <p style="color: #374151; font-size: 14px;">
            A new timetable has been generated and published for the
            current academic session.
          </p>
          <div style="background: white; border: 1px solid #e5e7eb;
            border-left: 4px solid #16a34a; border-radius: 6px;
            padding: 20px; margin: 20px 0;">
            <p style="margin: 0; color: #16a34a; font-weight: bold;
              font-size: 14px;">
              ✓ Your timetable is now available
            </p>
            <p style="margin: 8px 0 0 0; color: #374151; font-size: 13px;">
              Log in to see your courses, rooms, and lecture times.
            </p>
          </div>
          <a href="${process.env.FRONTEND_URL}"
            style="display: inline-block; background-color: #0a1f44;
              color: white; padding: 12px 24px; border-radius: 6px;
              text-decoration: none; font-size: 14px; font-weight: bold;">
            View My Timetable
          </a>
        </div>
        <div style="padding: 16px 32px; background-color: #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;
            text-align: center;">
            This is an automated notification from the LASU Timetable
            Management System.
          </p>
        </div>
      </div>
    `
  }
  await transporter.sendMail(mailOptions)
}

module.exports = { sendTimetableChangeEmail, sendTimetableGeneratedEmail }