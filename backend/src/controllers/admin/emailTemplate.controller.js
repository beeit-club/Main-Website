import asyncWrapper from '../../middlewares/error.handler.js';
import emailTemplateService from '../../services/admin/emailTemplate.service.js';
import emailService from '../../services/email/emailService.js';
import templateRenderer from '../../services/email/templateRenderer.service.js';
import { utils } from '../../utils/index.js';

const emailTemplateController = {
  
  // Lấy danh sách
  getAll: asyncWrapper(async (req, res) => {
    const result = await emailTemplateService.getList(req.query);
    return utils.success(res, 'Lấy danh sách thành công', result);
  }),

  // Lấy chi tiết
  getById: asyncWrapper(async (req, res) => {
    const result = await emailTemplateService.getTemplate(req.params.id);
    return utils.success(res, 'Lấy chi tiết thành công', result);
  }),

  // Tạo mới
  create: asyncWrapper(async (req, res) => {
    const result = await emailTemplateService.createTemplate(req.body, req.user?.id);
    return utils.success(res, 'Tạo template thành công', result);
  }),

  // Cập nhật
  update: asyncWrapper(async (req, res) => {
    const result = await emailTemplateService.updateTemplate(req.params.id, req.body);
    return utils.success(res, 'Cập nhật template thành công', result);
  }),

  // Xóa
  delete: asyncWrapper(async (req, res) => {
    await emailTemplateService.deleteTemplate(req.params.id);
    return utils.success(res, 'Xóa template thành công');
  }),

  // API ĐẶC BIỆT: Compile Preview (Cho Live Editor)
  // Nhận MJML -> Trả về HTML ngay lập tức (không lưu DB)
  compilePreview: asyncWrapper(async (req, res) => {
    let { mjml_content, variables } = req.body;
    
    console.log("[Preview] Original:", mjml_content); // DEBUG

    // Fallback nếu content rỗng để tránh lỗi
    if (!mjml_content || mjml_content.trim() === '') {
        return utils.success(res, 'Compile (Empty)', { html: '', detected_variables: [] });
    }

    // NOTE: Logic bọc <mjml> đã được chuyển vào templateRenderer.compileMJML
    // nên ở đây ta chỉ cần gọi hàm compile là đủ.
    
    // 1. Compile MJML -> HTML Structure
    // templateRenderer sẽ tự normalize input (text -> mjml)
    const htmlStructure = templateRenderer.compileMJML(mjml_content);
    
    // 2. Inject Variables (Handlebars) -> Final HTML
    // Nếu biến thiếu, Handlebars sẽ để trống, không lỗi
    const finalHtml = templateRenderer.renderFinalHtml(htmlStructure, variables || {});

    // 3. Detect Variables (để Frontend biết cần nhập gì)
    const detectedVars = templateRenderer.detectVariables(mjml_content);

    return utils.success(res, 'Compile thành công', {
      html: finalHtml,
      detected_variables: detectedVars
    });
  }),

  // API: Preview Template Đã Lưu (Theo ID)
  previewById: asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const { variables } = req.body;

    // 1. Lấy template từ DB
    const template = await emailTemplateService.getTemplate(id);
    if (!template) {
        throw new Error('Template not found');
    }

    const mjml_content = template.mjml_content || '';

    // 2. Compile MJML
    const htmlStructure = templateRenderer.compileMJML(mjml_content);

    // 3. Render Final
    const finalHtml = templateRenderer.renderFinalHtml(htmlStructure, variables || {});

    return utils.success(res, 'Preview thành công', {
        html: finalHtml,
        subject: templateRenderer.renderSubject(template.subject, variables || {})
    });
  }),

  // API: Gửi thử (Test Send)
  testSend: asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const { recipient_email, variables, userId } = req.body;

    if (!recipient_email) {
        throw new Error('Vui lòng nhập email người nhận');
    }

    // Tạo context để VariableManager làm việc
    let context = { ...variables };

    // Nếu có userId, load thông tin user đó để làm context dữ liệu thật
    if (userId) {
        const { AuthModel } = await import('../../models/auth/index.js');
        const user = await AuthModel.getUserById(userId);
        if (user) {
            context.user = user;
            // Ngoài ra có thể bổ sung thêm các provider khác ở đây (event, document...)
        }
    }

    // Gửi ngay lập tức (useQueue = false)
    await emailService.sendDynamicEmail(id, recipient_email, context, false);

    return utils.success(res, 'Gửi email thử nghiệm thành công');
  })
};

export default emailTemplateController;