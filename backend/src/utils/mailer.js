import nodemailer from 'nodemailer';
import { mailConfig } from '../config/mail.config.js';

const transporter = nodemailer.createTransport(mailConfig);

export const sendMail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: `"CLB Management" <${mailConfig.auth.user}>`,
    to,
    subject,
    html,
  });
};
