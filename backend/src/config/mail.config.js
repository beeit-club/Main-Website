// Không cần import dotenv nữa, đã được load ở env.config.js
const smtpPort = parseInt(process.env.SMTP_PORT) || 587;

export const mailConfig = {
  host: process.env.SMTP_HOST,
  port: smtpPort,
  // Port 465 dùng SSL/TLS (secure: true)
  // Port 587 dùng STARTTLS (secure: false)
  secure: smtpPort === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};
