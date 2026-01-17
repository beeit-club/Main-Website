import handlebars from 'handlebars';
import mjml2html from 'mjml';
import ServiceError from '../../error/service.error.js';

class TemplateRenderer {
  constructor() {
    this.registerHelpers();
  }

  registerHelpers() {
    // Helper định dạng ngày giờ VN
    handlebars.registerHelper('formatDate', (date) => {
      if (!date) return '';
      try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return date; // Return original string if invalid
        return d.toLocaleDateString('vi-VN', {
          day: '2-digit', month: '2-digit', year: 'numeric'
        });
      } catch (e) { return date; }
    });

    handlebars.registerHelper('formatTime', (date) => {
      if (!date) return '';
      try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return date;
        return d.toLocaleTimeString('vi-VN', {
          hour: '2-digit', minute: '2-digit'
        });
      } catch (e) { return date; }
    });

    // Helper logic cơ bản
    handlebars.registerHelper('ifEq', function (arg1, arg2, options) {
      return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    });

    // Helper xử lý biến thiếu (Optional: chỉ bật khi debug/preview)
    // Giúp hiển thị {{variable_name}} thay vì khoảng trắng nếu thiếu dữ liệu
    handlebars.registerHelper('helperMissing', function (/* [args, ] options */) {
      const options = arguments[arguments.length - 1];
      // Trả về lại chuỗi {{variable}} để user biết
      return new handlebars.SafeString('{{' + options.name + '}}');
    });
  }

  /**
   * Chuẩn hóa nội dung đầu vào thành MJML hợp lệ
   * Tự động bọc text/html thường vào cấu trúc mjml -> mj-text
   */
  normalizeMJML(content) {
    if (!content || content.trim() === '') return '';

    const trimmed = content.trim();

    // Nếu đã có thẻ mở <mjml>, giả định là đúng (hoặc sẽ lỗi parse sau)
    if (trimmed.startsWith('<mjml>')) return trimmed;

    // Kiểm tra xem có thẻ mj- nào không
    const hasMjTag = content.includes('<mj-');

    if (!hasMjTag) {
      // Trường hợp: Text thường hoặc HTML thuần
      // Bọc vào mj-text
      return `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>${content}</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;
    } else {
      // Trường hợp: Fragment MJML (ví dụ <mj-section>...)
      // Bọc thiếu gì bổ sung nấy
      let wrapped = content;
      if (!wrapped.includes('<mj-body>')) {
        wrapped = `<mj-body>${wrapped}</mj-body>`;
      }
      if (!wrapped.includes('<mjml>')) {
        wrapped = `<mjml>${wrapped}</mjml>`;
      }
      return wrapped;
    }
  }

  /**
   * Biên dịch MJML sang HTML chuẩn
   * @param {string} mjmlContent 
   * @returns {string} html
   */
  compileMJML(mjmlContent) {
    // Chuẩn hóa trước khi compile
    const normalized = this.normalizeMJML(mjmlContent);

    if (!normalized) return '';
    try {
      const { html, errors } = mjml2html(normalized, {
        validationLevel: 'soft', // Không crash nếu lỗi nhẹ
        minify: false // Tắt minify để debug lỗi mất nội dung
      });

      if (errors && errors.length > 0) {
        console.warn('MJML Warnings:', errors);
      }
      return html;
    } catch (error) {
      throw new ServiceError('Lỗi biên dịch MJML', 'MJML_COMPILE_ERROR', error.message);
    }
  }

  /**
   * Quét và phát hiện các biến trong nội dung
   * Loại bỏ các biến hệ thống/helper
   */
  detectVariables(content) {
    if (!content) return [];

    // Regex tìm chuỗi trong {{ }}
    // Group 1: Tên biến
    const regex = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
    const matches = new Set();
    let match;

    while ((match = regex.exec(content)) !== null) {
      const varName = match[1];
      // Bỏ qua các helper words thường gặp nếu cần
      if (!['if', 'else', 'each', 'formatDate', 'formatTime'].includes(varName)) {
        matches.add(varName);
      }
    }

    return Array.from(matches);
  }

  /**
   * Render HTML cuối cùng để gửi email
   * @param {string} htmlTemplate - HTML đã compile từ MJML
   * @param {object} variables - Dữ liệu thực tế
   */
  renderFinalHtml(htmlTemplate, variables = {}) {
    try {
      const template = handlebars.compile(htmlTemplate);
      return template(variables);
    } catch (error) {
      throw new ServiceError('Lỗi render Handlebars', 'RENDER_ERROR', error.message);
    }
  }

  /**
   * Render Subject (Tiêu đề cũng có thể có biến)
   */
  renderSubject(subjectTemplate, variables = {}) {
    try {
      return handlebars.compile(subjectTemplate || '')(variables);
    } catch (e) {
      return subjectTemplate;
    }
  }
}

export default new TemplateRenderer();