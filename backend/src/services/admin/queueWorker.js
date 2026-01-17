
import EmailQueueModel from '../../models/admin/emailQueue.model.js';
import EmailBatchJobModel from '../../models/admin/emailBatchJob.model.js';
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
          try { variables = JSON.parse(variables); } catch (e) { }
        }

        // Logic mới: Kiểm tra actionKey trong variables
        if (variables && variables._actionKey) {
          const actionKey = variables._actionKey;
          // Xóa _actionKey để không truyền vào template
          const { _actionKey, ...realVariables } = variables;

          await emailService.sendEmailByAction(
            actionKey,
            item.recipient_email,
            realVariables,
            false // useQueue = false (Direct send)
          );
        } else if (item.template_id) {
          // Logic cũ (nếu còn dùng batch job DB templates)
          // Tuy nhiên chúng ta đã bỏ DB template service, nên phần này có thể sẽ lỗi nếu gọi sendDynamicEmail với ID
          // Tạm thời coi như không hỗ trợ DB ID nữa hoặc để đó.
          // Nếu muốn hỗ trợ, phải sửa sendDynamicEmail để nhận ID lại (nhưng ta đã refactor nó nhận filename).
          console.warn(`[QueueWorker] Item ${item.id} has template_id but DB templates are deprecated.`);
        } else {
          throw new Error('Queue item missing identifier (actionKey)');
        }

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

    // 3. Cập nhật thống kê cho các BatchJob liên quan
    // Lấy danh sách unique batch job IDs
    const batchJobIds = [...new Set(items.map(i => i.batch_job_id).filter(id => id))];
    for (const jobId of batchJobIds) {
      await EmailBatchJobModel.updateStats(jobId);
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
