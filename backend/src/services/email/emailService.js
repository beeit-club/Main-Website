import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import { sendMail } from '../../utils/mailer.js';

const renderTemplate = (templateName, variables) => {
  const filePath = path.join(
    process.cwd(),
    'src/emails',
    `${templateName}.hbs`,
  );
  const source = fs.readFileSync(filePath, 'utf8');
  const compiled = handlebars.compile(source);
  return compiled(variables);
};

export const emailService = {
  async sendReminder(member) {
    const html = renderTemplate('reminder', {
      name: member.fullname,
      deadline: member.deadline,
    });
    return sendMail({
      to: member.email,
      subject: 'Nhắc hạn đóng phí',
      html,
    });
  },
};
