import asyncWrapper from '../../middlewares/error.handler.js';
import { interviewService } from '../../services/admin/index.js';
import { utils } from '../../utils/index.js';
import InterviewSchema from '../../validation/admin/interview.validation.js';
import { message } from '../../common/message/index.js';
import {
  PaginationSchema,
  params,
} from '../../validation/common/common.schema.js';

const interviewController = {
  getAll: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const valid = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });
    const { search } = req.query;
    const result = await interviewService.getAll({
      ...valid,
      filters: { search },
    });
    utils.success(res, 'Lấy danh sách lịch phỏng vấn thành công', result);
  }),
  getById: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    const schedule = await interviewService.getOne(req.params.id);
    utils.success(res, 'Lấy chi tiết thành công', { schedule });
  }),
  create: asyncWrapper(async (req, res) => {
    await InterviewSchema.create.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    const data = { ...req.body, created_by: req.user.id };
    const result = await interviewService.create(data);
    utils.success(
      res,
      'Tạo lịch phỏng vấn thành công',
      { id: result.insertId },
      201,
    );
  }),
  update: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    await InterviewSchema.update.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    await interviewService.update(req.params.id, req.body);
    utils.success(res, 'Cập nhật lịch thành công');
  }),
  delete: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    await interviewService.delete(req.params.id);
    utils.success(res, 'Xóa lịch thành công');
  }),
};
export default interviewController;
