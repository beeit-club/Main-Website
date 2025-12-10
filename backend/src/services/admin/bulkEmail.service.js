// services/admin/bulkEmail.service.js

import EmailBatchJobModel from '../../models/admin/emailBatchJob.model.js';
import EmailBatchRecipientModel from '../../models/admin/emailBatchRecipient.model.js';
import EmailTemplateModel from '../../models/admin/emailTemplate.model.js';
import { emailService } from '../email/emailService.js';
import ServiceError from '../../error/service.error.js';

class BulkEmailService {
  // Tạo batch job mới
  async createBatchJob(templateIdOrSlug, recipients, options = {}) {
    // Validate recipients
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      throw new ServiceError(
        'Recipients không được rỗng',
        'INVALID_RECIPIENTS',
        'Phải có ít nhất 1 recipient',
        400,
      );
    }

    // Validate template
    let template;
    if (typeof templateIdOrSlug === 'number' || /^\d+$/.test(templateIdOrSlug)) {
      template = await EmailTemplateModel.getTemplateById(templateIdOrSlug);
    } else {
      template = await EmailTemplateModel.getTemplateBySlug(templateIdOrSlug);
    }

    if (!template) {
      throw new ServiceError(
        'Template không tồn tại',
        'TEMPLATE_NOT_FOUND',
        null,
        404,
      );
    }

    // Validate recipients format
    for (const recipient of recipients) {
      if (!recipient.email) {
        throw new ServiceError(
          'Recipient phải có email',
          'INVALID_RECIPIENT',
          'Mỗi recipient phải có field email',
          400,
        );
      }
    }

    // Create batch job
    const job = await EmailBatchJobModel.createJob({
      template_id: template.id,
      template_slug: template.slug,
      job_name: options.jobName || `Bulk Email - ${template.name}`,
      total_recipients: recipients.length,
      status: 'pending',
      options: JSON.stringify(options),
      created_by: options.createdBy || null,
    });

    // Create recipients
    const recipientRecords = recipients.map(rec => ({
      batch_job_id: job.id,
      recipient_email: rec.email,
      variables: rec.variables || {},
      status: 'pending',
    }));

    await EmailBatchRecipientModel.bulkCreate(recipientRecords);

    return job;
  }

  // Process batch job (gửi emails)
  async processBatchJob(jobId, options = {}) {
    const job = await EmailBatchJobModel.getJobById(jobId);
    if (!job) {
      throw new ServiceError(
        'Batch job không tồn tại',
        'BATCH_JOB_NOT_FOUND',
        null,
        404,
      );
    }

    // Check status
    if (job.status === 'processing') {
      throw new ServiceError(
        'Job đang được xử lý',
        'JOB_ALREADY_PROCESSING',
        null,
        409,
      );
    }

    if (job.status === 'completed' || job.status === 'cancelled') {
      throw new ServiceError(
        `Không thể xử lý job với status: ${job.status}`,
        'INVALID_JOB_STATUS',
        null,
        400,
      );
    }

    // Update status
    await EmailBatchJobModel.updateJob(jobId, {
      status: 'processing',
      started_at: new Date(),
    });

    const batchSize = options.batchSize || 20;
    const delay = options.delay || 1000;

    try {
      // Get all pending recipients
      let recipients = await EmailBatchRecipientModel.getPendingByJobId(jobId);
      const total = recipients.length;

      // Process in batches
      for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);

        // Process batch (parallel)
        await Promise.all(
          batch.map(recipient => this.processRecipient(job, recipient)),
        );

        // Update progress
        const processed = Math.min(i + batchSize, total);
        const progress = total > 0 ? (processed / total) * 100 : 0;

        // Get current stats
        const stats = await EmailBatchRecipientModel.getStatsByJobId(jobId);

        await EmailBatchJobModel.updateJob(jobId, {
          sent_count: stats.sent || 0,
          failed_count: stats.failed || 0,
          progress_percent: progress,
        });

        // Delay between batches
        if (i + batchSize < recipients.length) {
          await this.sleep(delay);
        }
      }

      // Get final stats
      const finalStats = await EmailBatchRecipientModel.getStatsByJobId(jobId);

      // Update job status
      await EmailBatchJobModel.updateJob(jobId, {
        status: 'completed',
        completed_at: new Date(),
        sent_count: finalStats.sent || 0,
        failed_count: finalStats.failed || 0,
        progress_percent: 100,
      });

      return {
        success: true,
        stats: finalStats,
      };
    } catch (error) {
      await EmailBatchJobModel.updateJob(jobId, {
        status: 'failed',
        error_message: error.message,
      });
      throw error;
    }
  }

  // Process single recipient
  async processRecipient(job, recipient) {
    try {
      const variables = recipient.variables
        ? typeof recipient.variables === 'string'
          ? JSON.parse(recipient.variables)
          : recipient.variables
        : {};

      // Send email
      await emailService.sendDynamicEmail(
        job.template_slug || job.template_id,
        recipient.recipient_email,
        variables,
      );

      // Update recipient
      await EmailBatchRecipientModel.updateRecipient(recipient.id, {
        status: 'sent',
        sent_at: new Date(),
      });
    } catch (error) {
      // Update recipient as failed
      await EmailBatchRecipientModel.updateRecipient(recipient.id, {
        status: 'failed',
        error_message: error.message,
        retry_count: (recipient.retry_count || 0) + 1,
      });
    }
  }

  // Retry failed emails
  async retryFailedEmails(jobId) {
    const job = await EmailBatchJobModel.getJobById(jobId);
    if (!job) {
      throw new ServiceError(
        'Batch job không tồn tại',
        'BATCH_JOB_NOT_FOUND',
        null,
        404,
      );
    }

    const failedRecipients = await EmailBatchRecipientModel.getFailedByJobId(jobId);

    if (failedRecipients.length === 0) {
      return {
        success: true,
        message: 'Không có email nào cần retry',
        retried_count: 0,
      };
    }

    // Reset status
    const recipientIds = failedRecipients.map(r => r.id);
    await EmailBatchRecipientModel.resetStatus(recipientIds);

    // Re-process
    return this.processBatchJob(jobId);
  }

  // Get batch job status
  async getBatchJobStatus(jobId) {
    const job = await EmailBatchJobModel.getJobById(jobId);
    if (!job) {
      throw new ServiceError(
        'Batch job không tồn tại',
        'BATCH_JOB_NOT_FOUND',
        null,
        404,
      );
    }

    const stats = await EmailBatchRecipientModel.getStatsByJobId(jobId);

    // Parse options
    let options = {};
    if (job.options) {
      options = typeof job.options === 'string' 
        ? JSON.parse(job.options) 
        : job.options;
    }

    return {
      id: job.id,
      job_name: job.job_name,
      status: job.status,
      total_recipients: job.total_recipients,
      sent_count: stats.sent || 0,
      failed_count: stats.failed || 0,
      pending_count: stats.pending || 0,
      progress_percent: job.progress_percent,
      started_at: job.started_at,
      completed_at: job.completed_at,
      options,
    };
  }

  // Cancel batch job
  async cancelBatchJob(jobId) {
    const job = await EmailBatchJobModel.getJobById(jobId);
    if (!job) {
      throw new ServiceError(
        'Batch job không tồn tại',
        'BATCH_JOB_NOT_FOUND',
        null,
        404,
      );
    }

    if (job.status === 'completed' || job.status === 'cancelled') {
      throw new ServiceError(
        `Không thể hủy job với status: ${job.status}`,
        'INVALID_JOB_STATUS',
        null,
        400,
      );
    }

    await EmailBatchJobModel.updateJob(jobId, {
      status: 'cancelled',
    });

    return {
      success: true,
      message: 'Job đã được hủy',
    };
  }

  // Helper: Sleep
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new BulkEmailService();

