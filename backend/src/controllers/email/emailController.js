import { emailService } from '../../services/email/emailService.js';

export const emailController = {
  async sendReminder(req, res) {
    try {
      const member = req.body; // { fullname, email, deadline }
      await emailService.sendReminder(member);
      return res.json({ status: 'success', message: 'Đã gửi email nhắc hạn' });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: 'error', message: 'Gửi email thất bại' });
    }
  },
};
