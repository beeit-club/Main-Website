import nodemailer from 'nodemailer';
import { config } from '../config/index.js';
const { mailConfig } = config;

const transporter = nodemailer.createTransport(mailConfig);

export const sendMail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: `"Bee IT Club" <${mailConfig.auth.user}>`,
    to,
    subject,
    html,
  });
};
