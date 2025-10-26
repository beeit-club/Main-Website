import { API_BACKEND } from '../../config/server.config.js';
import asyncWrapper from '../../middlewares/error.handler.js';
import postService from '../../services/admin/posts.service.js';
import { slugify } from '../../utils/function.js';
import { utils } from '../../utils/index.js';
import { PostSchema } from '../../validation/admin/post.validation.js';
import {
  PaginationSchema,
  params,
} from '../../validation/common/common.schema.js';

const postController = {
  // lấy toàn bộ
  getPosts: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    // Validate (nhưng sẽ không lỗi vì transform đã fallback)
    const valid = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });
    const { status, category_id, title } = req.query;
    const posts = await postService.getAllPosts({
      ...valid,
      filters: { status, category_id, title },
    });
    utils.success(res, 'Lấy danh sách  post thành công', posts);
  }),

  // lấy 1
  getPostBySlug: asyncWrapper(async (req, res) => {
    await params.slug.validate(req.params, { abortEarly: false });
    const { slug } = req.params;
    const post = await postService.getPostBySlug(slug);
    utils.success(res, 'Lấy bài viết  thành công', post);
  }),
  // thêm
  createPost: asyncWrapper(async (req, res) => {
    await PostSchema.create.validate(req.body, { abortEarly: false });
    const { title, content, meta_description, category_id, status, tags } =
      req.body;
    const slug = slugify(title);
    const file = req.file;
    const user = req.user;
    const { id } = user;
    if (!file) {
      return utils.validationError(
        res,
        { file: 'vui lòng chọn file' },
        'Vui lòng chọn một file',
      );
    }
    const featured_image = `${API_BACKEND}/uploads/posts/${file.filename}`;
    const data = {
      title,
      slug,
      content,
      meta_description,
      category_id,
      status: status ?? 0,
      tags,
      featured_image,
      created_by: id,
    };

    const post = await postService.createPost(data);

    utils.success(res, 'Thêm danh mục thành công', {
      id: post.insertId,
      title,
      slug,
    });
  }),
  // cập nhật
  updatePost: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    await PostSchema.update.validate(req.body, { abortEarly: false });
    const { title, content, meta_description, category_id, status, tags } =
      req.body;
    const { id } = req.params;
    const slug = slugify(title);
    const data = {
      title,
      slug,
      content,
      meta_description,
      category_id,
      status: status ?? 0,
      tags,
    };
    const post = await postService.updatePost(id, data);

    utils.success(res, 'Cập nhật bài viết thành công', {
      id: post.insertId,
      title,
      slug,
    });
  }),
  // xóa mềm
  deletePost: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;
    await postService.deletePost(id);
    utils.success(res, 'Xóa mềm post thành công');
  }),
  // khôi phục
  restorePost: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;
    const post = await postService.restorePost(id);
    utils.success(res, 'Khôi phục bài thành công', { id });
  }),
  //  thay đổi trạng thái
  changePostStatus: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    await PostSchema.status.validate(req.body, { abortEarly: false });
    const { id } = req.params;
    const { status } = req.body;
    const post = await postService.changePostStatus(id, status);
    utils.success(res, 'Thay đổi trạng thái bài thành công', { id });
  }),
  // danh sách bài viết đã xóa

  getDeletedPosts: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    // Validate (nhưng sẽ không lỗi vì transform đã fallback)
    const valid = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });
    const { status, category_id, title } = req.query;
    const post = await postService.getDeletedPosts({
      ...valid,
      filters: { status, category_id, title },
    });
    utils.success(res, 'Lấy Danh sách bài viết xóa thành công', post.data);
  }),
  // xóa vĩnh viễn
  permanentDeletePost: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;
    await postService.permanentDeletePost(id);
    utils.success(res, 'Xóa vĩnh viễn post thành công');
  }),
};
export default postController;
