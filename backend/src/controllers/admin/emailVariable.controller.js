
import asyncWrapper from '../../middlewares/error.handler.js';
import variableManager from '../../services/email/variables/variableManager.js';
import { utils } from '../../utils/index.js';

const emailVariableController = {
  // Lấy toàn bộ danh sách biến chuẩn
  getAllVariables: asyncWrapper(async (req, res) => {
    // Gọi qua Manager để đảm bảo tính nhất quán (sau này có thể cache hoặc filter tại đây)
    const variables = await variableManager.getVariableDefinitions();
    return utils.success(res, 'Lấy danh sách biến thành công', { variables });
  })
};

export default emailVariableController;
