// services/email/templateRenderer.service.js

import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import EmailTemplateModel from '../../models/admin/emailTemplate.model.js';

class TemplateRenderer {
  // Render template từ database
  async renderFromDatabase(templateIdOrSlug, variables = {}) {
    // Get template từ DB (by ID or slug)
    let template;
    if (typeof templateIdOrSlug === 'number' || /^\d+$/.test(templateIdOrSlug)) {
      template = await EmailTemplateModel.getTemplateById(templateIdOrSlug);
    } else {
      template = await EmailTemplateModel.getTemplateBySlug(templateIdOrSlug);
    }

    if (!template) {
      throw new Error(`Template không tồn tại: ${templateIdOrSlug}`);
    }

    // Parse JSON fields
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

    // Merge variables với default_variables
    const mergedVariables = {
      ...defaultVariables,
      ...variables,
    };

    // Validate required variables
    this.validateVariables(templateVariables, mergedVariables);

    // Compile và render template
    const compiled = handlebars.compile(template.html_content);
    const html = compiled(mergedVariables);

    return html;
  }

  // Render template từ file (fallback)
  renderFromFile(templateName, variables = {}) {
    const filePath = path.join(
      process.cwd(),
      'src/emails',
      `${templateName}.hbs`,
    );

    if (!fs.existsSync(filePath)) {
      throw new Error(`Template file không tồn tại: ${templateName}.hbs`);
    }

    const source = fs.readFileSync(filePath, 'utf8');
    const compiled = handlebars.compile(source);
    return compiled(variables);
  }

  // Render subject (có thể có variables)
  renderSubject(template, variables = {}) {
    if (!template.subject) {
      return 'Email từ CLB Management';
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

    // Compile subject (có thể có Handlebars)
    const compiled = handlebars.compile(template.subject);
    return compiled(mergedVariables);
  }

  // Validate variables
  validateVariables(templateVariables, providedVariables) {
    if (!Array.isArray(templateVariables)) {
      return; // Không có validation nếu không định nghĩa
    }

    const errors = [];

    for (const varDef of templateVariables) {
      if (varDef.required && !(varDef.name in providedVariables)) {
        errors.push(`Variable '${varDef.name}' là bắt buộc nhưng không được cung cấp`);
      }

      // Type validation (optional)
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
      throw new Error(`Validation errors: ${errors.join(', ')}`);
    }
  }

  // Validate template syntax (basic check)
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

