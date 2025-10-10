import { code, message } from '../../common/message/index.js';
import ServiceError from '../../error/service.error.js';
import { tagModel } from '../../models/admin/index.js'; // Giả sử bạn có file index export model
import postModel from '../../models/admin/post.model.js';

const postService = {
  // lấy toàn bộ
  getAllPosts: async (option) => {
    try {
      const posts = await postModel.getAllPosts(option);
      return posts;
    } catch (error) {
      throw error;
    }
  },
  //   lấy 1
  getPostBySlug: async (slug) => {
    try {
      const post = await postModel.getPostBySlug(slug);
      if (!post) {
        throw new ServiceError(
          'Bài viết không tồn tại', // Bạn cần định nghĩa message này
          'NO_POST', // và code này
          'Bài viết không tồn tại',
          404,
        );
      }
      console.log('🚀 ~ post:', post);
      return post;
    } catch (error) {
      throw error;
    }
  },
  // thêm
  createPost: async (data) => {
    try {
      // check xem đã có bài này chưa
      const isCheck = await postModel.checkIsPost(data?.slug);
      if (isCheck) {
        throw new ServiceError(
          'Bài viết đã tồn tại', // Bạn cần định nghĩa message này
          'POST_EXISTS_CODE', // và code này
          'Bài đã tồn tại',
          409,
        );
      }
      // thêm thẻ
      const { tags, ...files } = data;
      const post = await postModel.createPost(files);
      await postModel.addTagsPost(tags, post.insertId);
      return post;
    } catch (error) {
      throw error;
    }
  },
  // update
  updatePost: async (id, data) => {
    try {
      // check slug mới (nếu có) đã tồn tại chưa
      if (data.slug) {
        const isCheck = await postModel.checkIsPost(data.slug);
        // Nếu slug đã tồn tại và không phải là của chính tag đang update
        if (isCheck) {
          throw new ServiceError(
            'Conflict',
            'Bài viết đã có',
            'Bài viết đã tồn tại',
            409,
          );
        }
      }
      // cập nhật thẻ
      const { tags, ...files } = data;
      const post = await postModel.updatePost(id, files);
      await postModel.updateTagsPost(tags, id);
      return post;
    } catch (error) {
      throw error;
    }
  },
  // xóa mềm
  deletePost: async (id) => {
    try {
      const post = await postModel.deletePost(id);
      return post;
    } catch (error) {
      throw error;
    }
  },
  // khôi phục
  restorePost: async (id) => {
    try {
      const post = await postModel.restorePost(id);
      return post;
    } catch (error) {
      throw error;
    }
  },
  // toggle status
  changePostStatus: async (id, status) => {
    try {
      const post = await postModel.changePostStatus(id, status);
      return post;
    } catch (error) {
      throw error;
    }
  },
  // danh sách bài viêt đã xóa

  getDeletedPosts: async (option) => {
    try {
      const post = await postModel.getDeletedPosts(option);
      return post;
    } catch (error) {
      throw error;
    }
  },
  // xóa vĩnh viễn
  permanentDeletePost: async (id) => {
    try {
      const post = await postModel.permanentDeletePost(id);
      return post;
    } catch (error) {
      throw error;
    }
  },
};
export default postService;
