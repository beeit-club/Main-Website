
import EmailQueueModel from '../../models/admin/emailQueue.model.js';
import EmailCampaignModel from '../../models/admin/emailCampaign.model.js';
import emailService from '../email/emailService.js';

const BATCH_SIZE = 5; // Số lượng email gửi mỗi lần quét
const INTERVAL_MS = 5000; // Quét mỗi 5 giây

let isRunning = false;

async function processQueue() {
  if (isRunning) return;
  isRunning = true;

  try {
    // 1. Lấy các item đang pending
    const items = await EmailQueueModel.getPendingItems(BATCH_SIZE);
    
    if (items.length === 0) {
      isRunning = false;
      return;
    }

    console.log(`[QueueWorker] Processing ${items.length} emails...`);

    // 2. Xử lý từng item (Song song)
    const promises = items.map(async (item) => {
      try {
        // Cập nhật trạng thái đang xử lý
        await EmailQueueModel.update(item.id, { status: 'processing' });

        // Parse variables
        let variables = item.variables;
        if (typeof variables === 'string') {
          try { variables = JSON.parse(variables); } catch (e) {}
        }

        // Gửi email (Dùng hàm sendDynamicEmail có sẵn)
        // Lưu ý: item.template_id lấy từ join bảng campaign
        await emailService.sendDynamicEmail(
          item.template_id,
          item.recipient_email,
          variables
        );

        // Thành công
        await EmailQueueModel.update(item.id, { 
          status: 'sent', 
          sent_at: new Date() 
        });

      } catch (error) {
        console.error(`[QueueWorker] Failed item ${item.id}:`, error.message);
        
        // Thất bại -> Tăng attempt, nếu > 3 thì fail hẳn
        const newAttempts = (item.attempts || 0) + 1;
        const newStatus = newAttempts >= 3 ? 'failed' : 'pending'; // Retry sau
        
        await EmailQueueModel.update(item.id, { 
          status: newStatus,
          attempts: newAttempts,
          error_message: error.message
        });
      }
    });

    await Promise.all(promises);

    // 3. Cập nhật thống kê cho các Campaign liên quan
    // Lấy danh sách unique campaign IDs
    const campaignIds = [...new Set(items.map(i => i.campaign_id))];
    for (const campId of campaignIds) {
      await EmailCampaignModel.updateStats(campId);
    }

  } catch (error) {
    console.error('[QueueWorker] Error:', error);
  } finally {
    isRunning = false;
  }
}

export const startWorker = () => {
  console.log('[QueueWorker] Started. Polling every 5s...');
  setInterval(processQueue, INTERVAL_MS);
};
