// config/email.config.js
// Cấu hình footer mặc định cho tất cả email

export const emailConfig = {
  // Footer mặc định cho tất cả email
  defaultFooter: `
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; text-align: center;">
      <p style="margin: 0 0 15px 0; font-size: 14px; font-weight: 600; color: #1f2937;">
        Bee IT Club - Code hard, play harder
      </p>
      <p style="margin: 0 0 8px 0;">
        <a href="https://facebook.beeit.club" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Facebook: https://facebook.beeit.club</a>
      </p>
      <p style="margin: 0 0 8px 0;">
        <a href="https://beeit.club" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Website: https://beeit.club</a>
      </p>
      <p style="margin: 0 0 8px 0;">
        <a href="mailto:support@beeit.club" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Email: support@beeit.club</a>
      </p>
      <p style="margin: 0 0 15px 0;">
        <a href="https://join.beeit.club" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Join with us: https://join.beeit.club</a>
      </p>
      <p style="margin: 0; font-size: 11px; color: #9ca3af;">
        Email này được gửi tự động từ hệ thống quản lý CLB. Vui lòng không trả lời email này.
      </p>
    </div>
  `,

  // Wrapper HTML cho email (có thể tùy chỉnh)
  emailWrapper: (content, footer = null) => {
    const defaultFooter = footer || emailConfig.defaultFooter;
    return `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email từ Bee IT</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="padding: 40px;">
                    ${content}
                    ${defaultFooter}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  },
};
