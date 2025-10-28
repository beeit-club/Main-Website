import asyncWrapper from '../../middlewares/error.handler.js';
import { applicationService } from '../../services/admin/index.js';
import { utils } from '../../utils/index.js';
import ApplicationSchema from '../../validation/admin/application.validation.js';
import { message } from '../../common/message/index.js';
import {
  PaginationSchema,
  params,
} from '../../validation/common/common.schema.js';

const applicationController = {
  // [PUBLIC] Nộp đơn
  createApplication: asyncWrapper(async (req, res) => {
    await ApplicationSchema.create.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    // Mặc định status là 0 (Chờ xử lý)
    const applicationData = { ...req.body, status: 0 };

    const application = await applicationService.createApplication(
      applicationData,
    );
    utils.success(res, message.APPLICATION_SUBMIT_SUCCESS, {
      id: application.insertId,
    });
  }),

  // [ADMIN] Lấy danh sách đơn
  getApplications: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const valid = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });
    const { search, status } = req.query;

    const result = await applicationService.getAllApplications({
      ...valid,
      filters: { search, status },
    });
    utils.success(res, message.GET_APPLICATIONS_SUCCESS, result);
  }),

  // [ADMIN] Lấy chi tiết đơn
  getApplicationById: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    const { id } = req.params;
    const application = await applicationService.getOneApplication(id);
    utils.success(res, message.GET_APPLICATION_SUCCESS, { application });
  }),

  // === WORKFLOW MỚI ===

  // [ADMIN] BƯỚC 1: Duyệt đơn (0 -> 1)
  reviewApplication: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    await applicationService.reviewApplication(req.params.id);
    utils.success(res, 'Duyệt đơn thành công (chờ đặt lịch)', {
      id: req.params.id,
    });
  }),

  // [ADMIN] BƯỚC 2: Đặt lịch (1 -> 2)
  scheduleApplication: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    await ApplicationSchema.schedule.validate(req.body, { stripUnknown: true });

    await applicationService.scheduleApplication(
      req.params.id,
      req.body.schedule_id,
    );
    utils.success(res, 'Đặt lịch phỏng vấn thành công (đã gửi email)', {
      id: req.params.id,
    });
  }),

  // [ADMIN] BƯỚC 3: Phê duyệt (2 -> 3)
  approveApplication: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    await ApplicationSchema.decision.validate(req.body, { stripUnknown: true });
    const adminId = req.user.id; // Lấy từ middleware auth

    const result = await applicationService.approveApplication(
      req.params.id,
      req.body.interview_notes,
      adminId,
    );
    utils.success(res, message.APPLICATION_APPROVED_SUCCESS, {
      newUserId: result.newUserId,
    });
  }),

  // [ADMIN] BƯỚC 4: Từ chối (0/2 -> 4)
  rejectApplication: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    await ApplicationSchema.decision.validate(req.body, { stripUnknown: true });

    const result = await applicationService.rejectApplication(
      req.params.id,
      req.body.interview_notes,
    );
    utils.success(res, message.APPLICATION_REJECTED_SUCCESS, { id: result.id });
  }),
};

export default applicationController;
