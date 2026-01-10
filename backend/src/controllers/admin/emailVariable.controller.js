
import asyncWrapper from '../../middlewares/error.handler.js';
import { query } from '../../utils/database.js';
import { utils } from '../../utils/index.js';

const emailVariableController = {
  // Lấy toàn bộ danh sách biến chuẩn
  getAllVariables: asyncWrapper(async (req, res) => {
    const [rows] = await query('SELECT * FROM email_variables ORDER BY name ASC');
    return utils.success(res, 'Lấy danh sách biến thành công', { variables: rows });
  })
};

export default emailVariableController;
