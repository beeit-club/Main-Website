// services/email/emailQueue.service.js
import EmailQueueModel from '../../models/admin/emailQueue.model.js';
import EmailCampaignModel from '../../models/admin/emailCampaign.model.js';
import EmailTemplateModel from '../../models/admin/emailTemplate.model.js';
import { query } from '../../utils/database.js';

class EmailQueueService {
  /**
   * Đẩy một email vào hàng đợi
   */
  async addToQueue({ recipientEmail, recipientName, templateId, variables, campaignId = null }) {
    try {
      // 1. Nếu không có campaignId, tìm hoặc tạo campaign "System Notifications"
      if (!campaignId) {
        campaignId = await this.getOrCreateSystemCampaign(templateId);
      }

      // 2. Thêm vào email_queue
      await EmailQueueModel.bulkCreate([{
        campaign_id: campaignId,
        recipient_email: recipientEmail,
        recipient_name: recipientName || null,
        variables: variables || {}
      }]);

      // 3. Cập nhật thống kê campaign
      await EmailCampaignModel.updateStats(campaignId);

      return { success: true, message: 'Đã thêm vào hàng đợi gửi email' };
    } catch (error) {
      console.error('Lỗi khi thêm email vào hàng đợi:', error);
      throw error;
    }
  }

  /**
   * Lấy hoặc tạo một campaign hệ thống cho một template cụ thể
   */
  async getOrCreateSystemCampaign(templateId) {
    try {
      // Tìm campaign hệ thống đang active cho template này trong ngày hôm nay
      const today = new Date().toISOString().slice(0, 10);
      const campaignNamePrefix = `SYSTEM_AUTO_`;
      
      const sql = `
        SELECT id FROM email_campaigns 
        WHERE template_id = ? 
        AND name LIKE ? 
        AND status IN ('pending', 'processing') 
        ORDER BY created_at DESC 
        LIMIT 1
      `;
      const [rows] = await query(sql, [templateId, `${campaignNamePrefix}%`]);
      
      if (rows && rows.length > 0) {
        return rows[0].id;
      }

      // Nếu không thấy, tạo mới một campaign cho hệ thống
      const template = await EmailTemplateModel.getTemplateById(templateId);
      const campaignName = `${campaignNamePrefix}${template ? template.name : 'GENERIC'}_${today}`;
      
      return await EmailCampaignModel.create({
        name: campaignName,
        template_id: templateId,
        status: 'processing',
        total_recipients: 0
      });
    } catch (error) {
      console.error('Lỗi khi lấy/tạo system campaign:', error);
      throw error;
    }
  }
}

export default new EmailQueueService();