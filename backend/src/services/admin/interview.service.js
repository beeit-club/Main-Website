import { code, message } from '../../common/message/index.js';
import ServiceError from '../../error/service.error.js';
import { InterviewModel } from '../../models/admin/index.js';

const interviewService = {
  getAll: async (options) => await InterviewModel.getAll(options),
  create: async (data) => await InterviewModel.create(data),
  getOne: async (id) => {
    const schedule = await InterviewModel.getOne(id);
    if (!schedule) {
      throw new ServiceError('Không tìm thấy lịch', 'SCHEDULE_NOT_FOUND');
    }
    return schedule;
  },
  update: async (id, data) => {
    await interviewService.getOne(id); // Check exists
    return await InterviewModel.update(id, data);
  },
  delete: async (id) => {
    await interviewService.getOne(id); // Check exists
    return await InterviewModel.delete(id);
  },
};
export default interviewService;
