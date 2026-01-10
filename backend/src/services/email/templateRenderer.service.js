// services/email/templateRenderer.service.js
// Service render template email từ database (Simple Layout Version)

import handlebars from 'handlebars';
import EmailTemplateModel from '../../models/admin/emailTemplate.model.js';
import customVariableService from './customVariable.service.js';
import ServiceError from '../../error/service.error.js';

class TemplateRenderer {
  /**
   * Render template từ database
   * @param {number|string} templateIdOrSlug - Template ID hoặc slug
   * @param {Object} variables - Variables để render
   * @returns {Promise<string>} HTML đã render
   */
  async renderFromDatabase(templateIdOrSlug, variables = {}) {
    try {
      // 1. Lấy template từ DB
      let template;
      if (
        typeof templateIdOrSlug === 'number' ||
        /^\d+$/.test(templateIdOrSlug)
      ) {
        template = await EmailTemplateModel.getTemplateById(templateIdOrSlug);
      } else {
        template = await EmailTemplateModel.getTemplateBySlug(templateIdOrSlug);
      }

      if (!template) {
        throw new ServiceError(
          `Template không tồn tại: ${templateIdOrSlug}`,
          'TEMPLATE_NOT_FOUND',
          null,
          404,
        );
      }

      // 2. Chuẩn bị Variables
      const templateVariables = template.variables
        ? typeof template.variables === 'string'
          ? JSON.parse(template.variables)
          : template.variables
        : [];

      const defaultVariables = template.default_variables
        ? typeof template.default_variables === 'string'
          ? JSON.parse(template.default_variables)
          : template.default_variables
        : {};

      // Merge & Compute custom variables
      const mergedVariables = {
        ...defaultVariables,
        ...variables,
      };

      const finalVariables = await customVariableService.computeCustomVariables(
        mergedVariables,
        template.id,
      );

      // Validate
      this.validateVariables(templateVariables, finalVariables);

      // 3. Render Body (Phần nội dung chính)
      const compiledBody = handlebars.compile(template.body || template.html_content || '');
      const bodyContent = compiledBody(finalVariables);

      // Render Header
      let headerContent = '';
      if (template.header) {
        const compiledHeader = handlebars.compile(template.header);
        headerContent = compiledHeader(finalVariables);
      }

      // Render Footer
      let footerContent = '';
      if (template.footer) {
        const compiledFooter = handlebars.compile(template.footer);
        footerContent = compiledFooter(finalVariables);
      }

      // 4. Combine
      // Nếu không có header/footer trong DB, có thể dùng default layout hoặc để trống
      // Ở đây ta ưu tiên DB, nếu null thì thôi.
      return `${headerContent}${bodyContent}${footerContent}`;
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'Render template thất bại',
        'RENDER_TEMPLATE_FAILED',
        error.message,
        500,
      );
    }
  }

  /**
   * Layout đơn giản: Header text + Nội dung + Footer text
   */
  wrapWithSimpleLayout(title, content) {
    // Render subject để dùng làm title trong header nếu cần
    // (Ở đây ta dùng title truyền vào, thường là subject của email)
    const cleanTitle = title.replace(/{{.*?}}/g, '...').trim(); // Loại bỏ variable placeholder trong title header cho gọn

    return `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; max-width: 600px;">
        <!-- HEADER -->
        <div style="margin-bottom: 20px;">
          <h3 style="color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 10px;">
            [BEE IT CLUB] - ${cleanTitle}
          </h3>
        </div>

        <!-- BODY CONTENT -->
        <div style="margin-bottom: 30px;">
          ${content}
        </div>

        <!-- FOOTER -->
        <div style="margin-top: 30px; font-size: 12px; color: #7f8c8d;">
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p>
            <b>Ban Quản Lý Bee IT Club</b><br/>
            Email tự động từ hệ thống. Vui lòng không trả lời email này.<br/>
            Liên hệ: contact@beeit.club
          </p>
        </div>
      </div>
    `;
  }

  /**
   * Render subject
   */
  async renderSubject(template, variables = {}) {
    try {
      if (!template.subject) return 'Thông báo từ Bee IT Club';

      const compiled = handlebars.compile(template.subject);
      return compiled(variables);
    } catch (error) {
      return template.subject;
    }
  }

  /**
   * Validate variables
   */
  validateVariables(templateVariables, providedVariables) {
    if (!Array.isArray(templateVariables) || templateVariables.length === 0) return;

    for (const varDef of templateVariables) {
      if (varDef.required && !(varDef.name in providedVariables)) {
        // Chỉ warn, không throw lỗi chặn gửi mail để linh hoạt hơn
        console.warn(`Missing required variable: ${varDef.name}`);
      }
    }
  }
}

export default new TemplateRenderer();