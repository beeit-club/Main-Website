
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function testSMTP() {
  console.log('--- TESTING SMTP CONNECTION ---');
  console.log('Host:', process.env.SMTP_HOST);
  console.log('User:', process.env.SMTP_USER);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log('✅ SMTP Connection Successful!');
    
    // Try sending
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER, // Send to self
      subject: "Test SMTP from BeeIT",
      text: "If you receive this, SMTP is working.",
    });
    console.log('✅ Email Sent:', info.messageId);

  } catch (error) {
    console.error('❌ SMTP Error:', error);
  }
}

testSMTP();
