// services/email/emailQueue.service.js
import EmailQueueModel from '../../models/admin/emailQueue.model.js';
import { query } from '../../utils/database.js';

class EmailQueueService {
  /**
   * Đẩy email vào hàng đợi
   * @param {Object} data 
   * @param {string} data.recipientEmail
   * @param {string|null} data.recipientName
   * @param {number} data.templateId
   * @param {Object} data.variables
   * @param {number|null} data.batchJobId - ID của đợt gửi (nếu có)
   */
  async addToQueue({ recipientEmail, recipientName, actionKey, variables, batchJobId = null }) {
    try {
      // Logic mới: Không bắt buộc phải có Campaign/BatchJob cho các email hệ thống lẻ (OTP, Noti)
      // Nếu batchJobId = null, nghĩa là email hệ thống gửi lẻ.

      // Inject actionKey vào variables để worker biết dùng template nào
      // Đây là cách "hack" nhẹ để không phải sửa schema DB thêm cột action_key
      const finalVariables = { ...(variables || {}), _actionKey: actionKey };

      const insertData = {
        recipient_email: recipientEmail,
        recipient_name: recipientName || null,
        variables: finalVariables,
        status: 'pending',
        attempts: 0
      };

      if (batchJobId) {
        insertData.batch_job_id = batchJobId;
      }

      // Chúng ta cần đảm bảo Model hỗ trợ insert có batch_job_id
      // Ở đây tôi viết raw query hoặc dùng model nếu đã update
      // Giả sử dùng Model bulkCreate hoặc create
      await EmailQueueModel.create(insertData);

      return { success: true, message: 'Đã thêm vào hàng đợi' };
    } catch (error) {
      console.error('[EmailQueue] Lỗi thêm vào queue:', error);
      // Không throw lỗi chết app, chỉ log
      return { success: false, error: error.message };
    }
  }

  // Hàm xử lý Queue (Worker sẽ gọi hàm này)
  async processQueueItem(item) {
    // Logic gửi mail thật sẽ nằm ở đây hoặc ở Worker Service riêng
    // ...
  }
}

export default new EmailQueueService();
