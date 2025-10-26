import asyncWrapper from '../../middlewares/error.handler.js';

import HomeService from '../../services/client/home.service.js';
import { utils } from '../../utils/index.js';
import { PaginationSchema } from '../../validation/common/common.schema.js';

const HomeControler = {
  // lấy toàn bộ
  getCategories: asyncWrapper(async (req, res) => {
    // const { name, status } = req.query;
    const categories = await HomeService.getAllCategory({
      //   filters: { name, status },
    });
    utils.success(res, 'Lấy danh sách thành công', {
      categories,
    });
  }),
  getTags: asyncWrapper(async (req, res) => {
    // const { name } = req.query;
    const tags = await HomeService.getAllTag({
      // ...valid,
      // filters: { name },
    });
    utils.success(res, 'Lấy danh sách thẻ thành công', tags);
  }),
};
export default HomeControler;
