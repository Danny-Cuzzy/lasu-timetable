const https = require('https')

const sendEmail = async ({ to, name, subject, htmlContent }) => {
  const data = JSON.stringify({
    sender: {
      name: 'LASU Timetable System',
      email: 'bossmand698@gmail.com'
    },
    to: [{ email: to, name }],
    subject,
    htmlContent
  })

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.brevo.com',
      path: '/v3/smtp/email',
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-length': Buffer.byteLength(data)
      }
    }

    const req = https.request(options, (res) => {
      let body = ''
      res.on('data', chunk => body += chunk)
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`✅ Email sent to ${to}`)
          resolve()
        } else {
          console.error(`❌ Email failed to ${to}: ${body}`)
          reject(new Error(body))
        }
      })
    })

    req.on('error', (error) => {
      console.error(`❌ Email request error to ${to}:`, error.message)
      reject(error)
    })

    req.write(data)
    req.end()
  })
}

const sendTimetableGeneratedEmail = async ({ to, name }) => {
  await sendEmail({
    to,
    name,
    subject: 'New Timetable Published — LASU',
    htmlContent: `
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
            current academic session. Please log in to view your schedule.
          </p>
          <div style="background: white; border: 1px solid #e5e7eb;
            border-left: 4px solid #16a34a; border-radius: 6px;
            padding: 20px; margin: 20px 0;">
            <p style="margin: 0; color: #16a34a; font-weight: bold;
              font-size: 14px;">
              ✓ Your timetable is now available
            </p>
            <p style="margin: 8px 0 0 0; color: #374151; font-size: 13px;">
              Log in to see your courses, rooms, and lecture times
              for this semester.
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
            Management System. Please do not reply to this email.
          </p>
        </div>
      </div>
    `
  })
}

const sendTimetableChangeEmail = async ({
  to, name, courseCode, courseTitle, changeType, oldValue, newValue
}) => {
  await sendEmail({
    to,
    name,
    subject: `Timetable Update: ${courseCode} — ${changeType} Changed`,
    htmlContent: `
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
            A timetable update has been made to a course you are
            associated with.
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
            Management System. Please do not reply to this email.
          </p>
        </div>
      </div>
    `
  })
}

module.exports = { sendTimetableChangeEmail, sendTimetableGeneratedEmail }