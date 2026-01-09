// services/admin/emailTemplate.service.js

import EmailTemplateModel from '../../models/admin/emailTemplate.model.js';
import templateRenderer from '../email/templateRenderer.service.js';
import emailService from '../email/emailService.js';
import ServiceError from '../../error/service.error.js';
import { code, message } from '../../common/message/index.js';
import { slugify } from '../../utils/function.js';

class EmailTemplateService {
  // Lấy danh sách templates
  async getAllTemplates(options) {
    return EmailTemplateModel.getAllTemplates(options);
  }

  // Lấy template theo ID
  async getTemplateById(id) {
    const template = await EmailTemplateModel.getTemplateById(id);
    if (!template) {
      throw new ServiceError(
        'Template không tồn tại',
        'TEMPLATE_NOT_FOUND',
        null,
        404,
      );
    }

    // Parse JSON fields
    if (template.variables && typeof template.variables === 'string') {
      template.variables = JSON.parse(template.variables);
    }
    if (
      template.default_variables &&
      typeof template.default_variables === 'string'
    ) {
      template.default_variables = JSON.parse(template.default_variables);
    }

    return template;
  }

  // Tạo template mới
  async createTemplate(data, userId) {
    // Validate required fields
    if (!data.name || !data.subject || !data.body) {
      throw new ServiceError(
        'Thiếu thông tin bắt buộc',
        'MISSING_REQUIRED_FIELDS',
        'name, subject, body là bắt buộc',
        400,
      );
    }

    // Validate name unique
    const nameExists = await EmailTemplateModel.checkNameExists(data.name);
    if (nameExists) {
      throw new ServiceError(
        'Tên template đã tồn tại',
        'NAME_EXISTS',
        `Tên "${data.name}" đã được sử dụng`,
        409,
      );
    }

    // Validate variables JSON format
    if (data.variables) {
      try {
        if (typeof data.variables === 'string') {
          data.variables = JSON.parse(data.variables);
        }
        if (!Array.isArray(data.variables)) {
          throw new Error('Variables phải là array');
        }
      } catch (error) {
        throw new ServiceError(
          'Variables không đúng format',
          'INVALID_VARIABLES_FORMAT',
          error.message,
          400,
        );
      }
    }

    // Validate default_variables JSON format
    if (data.default_variables) {
      try {
        if (typeof data.default_variables === 'string') {
          data.default_variables = JSON.parse(data.default_variables);
        }
        if (
          typeof data.default_variables !== 'object' ||
          Array.isArray(data.default_variables)
        ) {
          throw new Error('Default variables phải là object');
        }
      } catch (error) {
        throw new ServiceError(
          'Default variables không đúng format',
          'INVALID_DEFAULT_VARIABLES_FORMAT',
          error.message,
          400,
        );
      }
    }

    // Validate template syntax
    const syntaxCheck = templateRenderer.validateTemplateSyntax(
      data.body,
    );
    if (!syntaxCheck.valid) {
      throw new ServiceError(
        'Template syntax không hợp lệ',
        'INVALID_TEMPLATE_SYNTAX',
        syntaxCheck.error,
        400,
      );
    }

    // Set created_by
    data.created_by = userId;

    // Create template
    return EmailTemplateModel.createTemplate(data);
  }

  // Cập nhật template
  async updateTemplate(id, data, userId) {
    // Check template exists
    const existingTemplate = await EmailTemplateModel.getTemplateById(id);
    if (!existingTemplate) {
      throw new ServiceError(
        'Template không tồn tại',
        'TEMPLATE_NOT_FOUND',
        null,
        404,
      );
    }

    // Validate name unique (nếu có thay đổi)
    if (data.name && data.name !== existingTemplate.name) {
      const nameExists = await EmailTemplateModel.checkNameExists(
        data.name,
        id,
      );
      if (nameExists) {
        throw new ServiceError(
          'Tên template đã tồn tại',
          'NAME_EXISTS',
          `Tên "${data.name}" đã được sử dụng`,
          409,
        );
      }
    }

    // Validate variables (tương tự create)
    if (data.variables) {
      try {
        if (typeof data.variables === 'string') {
          data.variables = JSON.parse(data.variables);
        }
        if (!Array.isArray(data.variables)) {
          throw new Error('Variables phải là array');
        }
      } catch (error) {
        throw new ServiceError(
          'Variables không đúng format',
          'INVALID_VARIABLES_FORMAT',
          error.message,
          400,
        );
      }
    }

    // Validate default_variables (tương tự create)
    if (data.default_variables) {
      try {
        if (typeof data.default_variables === 'string') {
          data.default_variables = JSON.parse(data.default_variables);
        }
        if (
          typeof data.default_variables !== 'object' ||
          Array.isArray(data.default_variables)
        ) {
          throw new Error('Default variables phải là object');
        }
      } catch (error) {
        throw new ServiceError(
          'Default variables không đúng format',
          'INVALID_DEFAULT_VARIABLES_FORMAT',
          error.message,
          400,
        );
      }
    }

    // Validate template syntax (nếu có thay đổi html_content/body)
    const contentToCheck = data.body || data.html_content;
    if (contentToCheck) {
      const syntaxCheck = templateRenderer.validateTemplateSyntax(
        contentToCheck,
      );
      if (!syntaxCheck.valid) {
        throw new ServiceError(
          'Template syntax không hợp lệ',
          'INVALID_TEMPLATE_SYNTAX',
          syntaxCheck.error,
          400,
        );
      }
    }

    // Set updated_by
    data.updated_by = userId;

    // Update template
    return EmailTemplateModel.updateTemplate(id, data);
  }

  // Xóa template
  async deleteTemplate(id) {
    // Check template exists
    const template = await EmailTemplateModel.getTemplateById(id);
    if (!template) {
      throw new ServiceError(
        'Template không tồn tại',
        'TEMPLATE_NOT_FOUND',
        null,
        404,
      );
    }

    // Check is_system - không cho xóa
    if (template.is_system) {
      throw new ServiceError(
        'Không thể xóa template hệ thống',
        'CANNOT_DELETE_SYSTEM_TEMPLATE',
        null,
        403,
      );
    }

    // Soft delete
    return EmailTemplateModel.deleteTemplate(id);
  }

  // Preview template
  async previewTemplate(id, variables = null) {
    const template = await this.getTemplateById(id);

    // Merge variables với default_variables
    const defaultVariables = template.default_variables || {};
    const mergedVariables = {
      ...defaultVariables,
      ...(variables || {}),
    };

    // Render template
    const html = await templateRenderer.renderFromDatabase(id, mergedVariables);
    const subject = await templateRenderer.renderSubject(
      template,
      mergedVariables,
    );

    return {
      html,
      subject,
      variables: mergedVariables,
    };
  }

  // Test gửi email
  async testSendTemplate(id, recipientEmail, variables = null) {
    const template = await this.getTemplateById(id);

    // Preview template với variables
    const preview = await this.previewTemplate(id, variables);

    // Gửi email thật
    try {
      await emailService.sendDynamicEmail(id, recipientEmail, variables || {});
      return {
        success: true,
        message: 'Email đã được gửi thành công',
      };
    } catch (error) {
      throw new ServiceError(
        'Gửi email thất bại',
        'EMAIL_SEND_FAILED',
        error.message,
        500,
      );
    }
  }

  // Validate variables
  validateVariables(template, variables) {
    return templateRenderer.validateVariables(
      template.variables || [],
      variables,
    );
  }

  // Lấy categories
  async getCategories() {
    return EmailTemplateModel.getCategories();
  }
}

export default new EmailTemplateService();
