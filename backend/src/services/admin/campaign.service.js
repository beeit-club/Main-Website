import EmailCampaignModel from '../../models/admin/emailCampaign.model.js';
import EmailQueueModel from '../../models/admin/emailQueue.model.js';
import ServiceError from '../../error/service.error.js';

class CampaignService {
  /**
   * Tạo chiến dịch gửi email mới (Smart Mapping)
   * @param {Object} data - { name, template_id, recipients: [{email, name, ...}], common_variables: {} }
   * @param {number} userId - ID người tạo
   */
  async createCampaign(data, userId) {
    const { name, template_id, recipients, common_variables } = data;

    if (!recipients || recipients.length === 0) {
      throw new ServiceError('Danh sách người nhận trống', 'NO_RECIPIENTS', null, 400);
    }

    // 1. Tạo Campaign
    const campaignId = await EmailCampaignModel.create({
      name,
      template_id,
      total_recipients: recipients.length,
      status: 'pending',
      created_by: userId
    });

    // 2. Map dữ liệu thông minh
    const queueItems = recipients.map(recipient => {
      // 2a. Các biến có sẵn trong thông tin User
      // (Hệ thống sẽ tự động map các trường này nếu template cần)
      const userVars = {
        fullname: recipient.fullname || recipient.name || '',
        email: recipient.email,
        phone: recipient.phone || '',
        student_id: recipient.student_id || '',
        role_name: recipient.role_name || '',
      };

      // 2b. Merge theo thứ tự ưu tiên:
      // Common Vars (nhập tay) < User Vars (tự động) < Recipient Specific (nếu có override)
      const finalVariables = {
        ...common_variables, // Biến chung (VD: Địa điểm)
        ...userVars,         // Biến cá nhân hóa (VD: Tên)
      };

      return {
        campaign_id: campaignId,
        recipient_email: recipient.email,
        recipient_name: recipient.fullname || recipient.name || '',
        variables: finalVariables
      };
    });

    // 3. Batch Insert
    const BATCH_SIZE = 500;
    for (let i = 0; i < queueItems.length; i += BATCH_SIZE) {
      const batch = queueItems.slice(i, i + BATCH_SIZE);
      await EmailQueueModel.bulkCreate(batch);
    }

    return { campaignId, message: `Đã tạo chiến dịch với ${recipients.length} người nhận` };
  }

  // Lấy danh sách campaigns
  async getCampaigns(options) {
    return EmailCampaignModel.getAll(options);
  }

  // Lấy chi tiết campaign và queue
  async getCampaignDetail(id) {
    const campaign = await EmailCampaignModel.getById(id);
    if (!campaign) throw new ServiceError('Campaign not found', 'NOT_FOUND', null, 404);
    
    return campaign;
  }
}

export default new CampaignService();