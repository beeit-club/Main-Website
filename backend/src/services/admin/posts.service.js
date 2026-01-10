import { code, message } from '../../common/message/index.js';
import ServiceError from '../../error/service.error.js';
import { tagModel } from '../../models/admin/index.js'; 
import PostModel from '../../models/admin/post.model.js';

const postService = {
  // lấy toàn bộ
  getAllPosts: async (option) => {
    try {
      const posts = await PostModel.getAllPosts(option);
      return posts;
    } catch (error) {
      throw error;
    }
  },
  //   lấy 1
  getPostBySlug: async (slug) => {
    try {
      const post = await PostModel.getPostBySlug(slug);
      if (!post) {
        throw new ServiceError(
          'Bài viết không tồn tại', 
          'NO_POST', 
          'Bài viết không tồn tại',
          404,
        );
      }
      return post;
    } catch (error) {
      throw error;
    }
  },
  getPostById: async (id) => {
    try {
      const post = await PostModel.getPostById(id);
      if (!post) {
        throw new ServiceError(
          'Bài viết không tồn tại', 
          'NO_POST', 
          'Bài viết không tồn tại',
          404,
        );
      }
      return post;
    } catch (error) {
      throw error;
    }
  },
  // thêm
  createPost: async (data) => {
    try {
      // check xem đã có bài này chưa
      const isCheck = await PostModel.checkIsPost(data?.slug);
      if (isCheck) {
        throw new ServiceError(
          'Bài viết đã tồn tại', 
          'POST_EXISTS_CODE', 
          'Bài đã tồn tại',
          409,
        );
      }
      // thêm thẻ
      const { tags, ...files } = data;
      const post = await PostModel.createPost(files);
      await PostModel.addTagsPost(tags, post.insertId);
      return post;
    } catch (error) {
      throw error;
    }
  },
  // update
  updatePost: async (id, data) => {
    try {
      const { tags, ...files } = data;
      const post = await PostModel.updatePost(id, files);
      await PostModel.updateTagsPost(tags, id);
      return post;
    } catch (error) {
      throw error;
    }
  },
  // xóa mềm
  deletePost: async (id) => {
    try {
      const post = await PostModel.deletePost(id);
      return post;
    } catch (error) {
      throw error;
    }
  },
  // khôi phục
  restorePost: async (id) => {
    try {
      const post = await PostModel.restorePost(id);
      return post;
    } catch (error) {
      throw error;
    }
  },
  // toggle status
  changePostStatus: async (id, status) => {
    try {
      const post = await PostModel.changePostStatus(id, status);
      return post;
    } catch (error) {
      throw error;
    }
  },
  // danh sách bài viêt đã xóa

  getDeletedPosts: async (option) => {
    try {
      const post = await PostModel.getDeletedPosts(option);
      return post;
    } catch (error) {
      throw error;
    }
  },
  // xóa vĩnh viễn
  permanentDeletePost: async (id) => {
    try {
      const post = await PostModel.permanentDeletePost(id);
      return post;
    } catch (error) {
      throw error;
    }
  },
};
export default postService;
