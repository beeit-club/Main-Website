import asyncWrapper from '../../middlewares/error.handler.js';
import { utils } from '../../utils/index.js';
import memoryFlowService from '../../services/admin/memoryFlow.service.js';
import founderService from '../../services/admin/founder.service.js';

const LandingController = {
  // Lấy Memory Flow items (public)
  getMemoryFlow: asyncWrapper(async (req, res) => {
    const { limit } = req.query;
    const limitNum = limit ? parseInt(limit) : null;

    const items = await memoryFlowService.getActiveItems(limitNum);

    utils.success(res, 'Lấy Memory Flow thành công', items);
  }),

  // Lấy Founders (public)
  getFounders: asyncWrapper(async (req, res) => {
    const data = await founderService.getAllActive();

    utils.success(res, 'Lấy Founders/Members thành công', data);
  }),

  // Lấy tất cả landing content (public)
  getContent: asyncWrapper(async (req, res) => {
    const { memoryFlowLimit } = req.query;
    const limitNum = memoryFlowLimit ? parseInt(memoryFlowLimit) : null;

    const [memoryFlow, founders] = await Promise.all([
      memoryFlowService.getActiveItems(limitNum),
      founderService.getAllActive(),
    ]);

    utils.success(res, 'Lấy landing content thành công', {
      memoryFlow,
      founders,
    });
  }),
};

export default LandingController;

