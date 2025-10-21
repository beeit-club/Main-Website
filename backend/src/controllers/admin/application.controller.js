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

    // Mặc định status là 2 (Chờ xử lý)
    const applicationData = { ...req.body, status: 2 };

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

  // [ADMIN] Phê duyệt đơn
  approveApplication: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    const { id } = req.params;
    // Giả sử adminId được lấy từ middleware xác thực
    const adminId = req.user.id; // Thay `req.user.id` bằng biến chứa ID admin của bạn

    const result = await applicationService.approveApplication(id, adminId);
    utils.success(res, message.APPLICATION_APPROVED_SUCCESS, {
      newUserId: result.newUserId,
    });
  }),

  // [ADMIN] Từ chối đơn
  rejectApplication: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    const { id } = req.params;
    await applicationService.rejectApplication(id);
    utils.success(res, message.APPLICATION_REJECTED_SUCCESS, { id });
  }),
};

export default applicationController;
