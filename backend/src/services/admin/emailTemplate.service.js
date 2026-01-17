import EmailTemplateModel from '../../models/admin/emailTemplate.model.js';
import templateRenderer from '../email/templateRenderer.service.js';
import { utils } from '../../utils/index.js'; // Helper tạo slug
import ServiceError from '../../error/service.error.js';

class EmailTemplateService {
  
  async createTemplate(data, userId) {
    // 1. Compile MJML -> HTML
    const htmlContent = templateRenderer.compileMJML(data.mjml_content);
    
    // 2. Tự động phát hiện biến
    const detectedVars = templateRenderer.detectVariables(data.mjml_content);
    const variablesSchema = this._mergeVariables(detectedVars, data.variables || []);

    // 3. Tạo Slug nếu chưa có
    const slug = data.slug || utils.slugify(data.name);

    // 4. Lưu DB
    const insertId = await EmailTemplateModel.create({
      ...data,
      slug,
      html_content: htmlContent,
      variables: variablesSchema,
      created_by: userId
    });

    return { id: insertId, message: 'Tạo mẫu email thành công' };
  }

  async updateTemplate(id, data) {
    const current = await EmailTemplateModel.getById(id);
    if (!current) throw new ServiceError('Không tìm thấy template', 'NOT_FOUND');

    const updateData = { ...data };

    // Nếu có sửa nội dung MJML -> Compile lại
    if (data.mjml_content) {
      updateData.html_content = templateRenderer.compileMJML(data.mjml_content);
      
      // Update lại danh sách biến (giữ config cũ nếu trùng tên)
      const detectedVars = templateRenderer.detectVariables(data.mjml_content);
      updateData.variables = this._mergeVariables(detectedVars, data.variables || current.variables);
    }

    await EmailTemplateModel.update(id, updateData);
    return { id, message: 'Cập nhật thành công' };
  }

  async getTemplate(id) {
    return EmailTemplateModel.getById(id);
  }

  async getList(query) {
    return EmailTemplateModel.getAll(query);
  }

  async deleteTemplate(id) {
    // Check if system template (optional logic)
    const current = await EmailTemplateModel.getById(id);
    if (current && current.is_system) {
        throw new ServiceError('Không thể xóa template hệ thống', 'FORBIDDEN');
    }
    return EmailTemplateModel.delete(id);
  }

  // --- Helper ---

  /**
   * Trộn danh sách biến phát hiện được với cấu hình cũ
   * @param {string[]} detectedKeys - List tên biến quét được từ MJML
   * @param {object[]} existingConfig - Config cũ [{key: 'name', label: 'Tên'}]
   */
  _mergeVariables(detectedKeys, existingConfig) {
    const result = [];
    const configMap = new Map(existingConfig.map(v => [v.key, v]));

    for (const key of detectedKeys) {
      if (configMap.has(key)) {
        // Nếu đã cấu hình rồi -> Giữ nguyên
        result.push(configMap.get(key));
      } else {
        // Nếu mới -> Tạo config mặc định
        result.push({
          key: key,
          label: key, // Tạm dùng key làm nhãn
          type: 'text',
          required: true,
          defaultValue: ''
        });
      }
    }
    return result;
  }
}

export default new EmailTemplateService();