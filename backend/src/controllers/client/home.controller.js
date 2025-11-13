import asyncWrapper from '../../middlewares/error.handler.js';

import HomeService from '../../services/client/home.service.js';
import { utils } from '../../utils/index.js';
import { PaginationSchema } from '../../validation/common/common.schema.js';

const HomeControler = {
  Home: asyncWrapper(async (req, res) => {
    // const { name, status } = req.query;
    const home = await HomeService.home({
      //   filters: { name, status },
    });

    utils.success(res, 'Lấy danh sách thành công', {
      home,
    });
  }),
  getAllQuestions: asyncWrapper(async (req, res) => {
    // Tạm thời bỏ qua validation, bạn có thể thêm sau
    // const valid = await PaginationSchema.validateAsync(req.query);
    const { page, limit } = req.query;
    const questions = await HomeService.getAllQuestions({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      // filters: { title: req.query.title }
    });
    utils.success(res, 'Lấy danh sách câu hỏi thành công', questions);
  }),

  getQuestionDetail: asyncWrapper(async (req, res) => {
    const { slug } = req.params;
    const question = await HomeService.getQuestionDetail(slug);
    utils.success(res, 'Lấy chi tiết câu hỏi thành công', question);
  }),
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
  // lấy chi tiết bài viết
  postDetaill: asyncWrapper(async (req, res) => {
    const { slug } = req.params;
    const post = await HomeService.getPostDetaill(slug);
    utils.success(res, 'Lấy post thành công', post);
  }),
  getAllPost: asyncWrapper(async (req, res) => {
    const post = await HomeService.getAllPost();
    utils.success(res, 'Lấy post thành công', post);
  }),
};
export default HomeControler;
