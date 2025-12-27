// services/email/templateRenderer.service.js
// Service render template email từ database hoặc file

import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import EmailTemplateModel from '../../models/admin/emailTemplate.model.js';
import { config } from '../../config/index.js';
const { emailConfig } = config;
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
      // 1. Lấy template từ DB (theo ID hoặc slug)
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

      // 2. Parse JSON fields (variables và default_variables)
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

      // 3. Merge variables với default_variables
      // Thứ tự: default_variables (thấp) → variables (cao)
      const mergedVariables = {
        ...defaultVariables,
        ...variables,
      };

      // 4. Compute custom variables và merge vào
      // Custom variables có thể override cả default và variables
      const finalVariables = await customVariableService.computeCustomVariables(
        mergedVariables,
        template.id,
      );

      // 5. Validate required variables
      this.validateVariables(templateVariables, finalVariables);

      // 6. Compile và render template với Handlebars
      const compiled = handlebars.compile(template.html_content);
      const content = compiled(finalVariables);

      // 7. Wrap với email wrapper và thêm footer mặc định
      // Kiểm tra xem content đã có wrapper HTML chưa
      const hasHtmlWrapper =
        content.trim().toLowerCase().startsWith('<!doctype') ||
        content.trim().toLowerCase().startsWith('<html');

      if (hasHtmlWrapper) {
        // Nếu đã có wrapper, chỉ thêm footer vào body
        return content.replace(
          /<\/body>/i,
          `${emailConfig.defaultFooter}</body>`,
        );
      } else {
        // Nếu chưa có wrapper, wrap toàn bộ với email wrapper
        return emailConfig.emailWrapper(content);
      }
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'Render template từ database thất bại',
        'RENDER_TEMPLATE_FAILED',
        error.message,
        500,
      );
    }
  }

  /**
   * Render template từ file .hbs (fallback cho email cố định)
   * @param {string} templateName - Tên template (không có .hbs)
   * @param {Object} variables - Variables để render
   * @returns {string} HTML đã render
   */
  renderFromFile(templateName, variables = {}) {
    try {
      const filePath = path.join(
        process.cwd(),
        'src/emails',
        `${templateName}.hbs`,
      );

      if (!fs.existsSync(filePath)) {
        throw new ServiceError(
          `Template file không tồn tại: ${templateName}.hbs`,
          'TEMPLATE_FILE_NOT_FOUND',
          `Không tìm thấy file tại: ${filePath}`,
          404,
        );
      }

      const source = fs.readFileSync(filePath, 'utf8');
      const compiled = handlebars.compile(source);
      return compiled(variables);
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'Render template từ file thất bại',
        'RENDER_FILE_TEMPLATE_FAILED',
        error.message,
        500,
      );
    }
  }

  /**
   * Render subject (có thể có variables)
   * @param {Object} template - Template object từ DB
   * @param {Object} variables - Variables để render
   * @returns {Promise<string>} Subject đã render
   */
  async renderSubject(template, variables = {}) {
    try {
      // Nếu không có subject, trả về subject mặc định
      if (!template.subject) {
        return 'Email từ Bee IT Club';
      }

      // Parse default_variables
      const defaultVariables = template.default_variables
        ? typeof template.default_variables === 'string'
          ? JSON.parse(template.default_variables)
          : template.default_variables
        : {};

      // Merge variables
      const mergedVariables = {
        ...defaultVariables,
        ...variables,
      };

      // Compute custom variables cho subject
      const finalVariables = await customVariableService.computeCustomVariables(
        mergedVariables,
        template.id,
      );

      // Compile subject (có thể có Handlebars)
      const compiled = handlebars.compile(template.subject);
      return compiled(finalVariables);
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'Render subject thất bại',
        'RENDER_SUBJECT_FAILED',
        error.message,
        500,
      );
    }
  }

  /**
   * Validate variables theo định nghĩa trong template
   * @param {Array} templateVariables - Định nghĩa variables từ template
   * @param {Object} providedVariables - Variables được cung cấp
   * @throws {ServiceError} Nếu validation thất bại
   */
  validateVariables(templateVariables, providedVariables) {
    // Không có validation nếu không định nghĩa variables
    if (!Array.isArray(templateVariables) || templateVariables.length === 0) {
      return;
    }

    const errors = [];

    for (const varDef of templateVariables) {
      // Kiểm tra required variables
      if (varDef.required && !(varDef.name in providedVariables)) {
        errors.push(
          `Variable '${varDef.name}' là bắt buộc nhưng không được cung cấp`,
        );
      }

      // Kiểm tra type (nếu có định nghĩa type)
      if (varDef.name in providedVariables && varDef.type) {
        const value = providedVariables[varDef.name];
        const type = typeof value;

        if (varDef.type === 'string' && type !== 'string') {
          errors.push(`Variable '${varDef.name}' phải là string`);
        } else if (varDef.type === 'number' && type !== 'number') {
          errors.push(`Variable '${varDef.name}' phải là number`);
        } else if (varDef.type === 'boolean' && type !== 'boolean') {
          errors.push(`Variable '${varDef.name}' phải là boolean`);
        }
      }
    }

    if (errors.length > 0) {
      throw new ServiceError(
        'Validation variables thất bại',
        'VARIABLES_VALIDATION_FAILED',
        errors.join(', '),
        400,
      );
    }
  }

  /**
   * Validate template syntax (kiểm tra Handlebars syntax)
   * @param {string} htmlContent - Nội dung HTML template
   * @returns {Object} { valid: boolean, error?: string }
   */
  validateTemplateSyntax(htmlContent) {
    try {
      handlebars.compile(htmlContent);
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error.message,
      };
    }
  }
}

export default new TemplateRenderer();
