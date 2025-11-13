import ServiceError from '../../error/service.error.js';
import postModel from '../../models/admin/post.model.js';
import HomeModel from '../../models/client/home.model.js';

const HomeService = {
  // lấy toàn bộ
  getAllCategory: async (option) => {
    try {
      const categories = await HomeModel.getAllCategory(option);
      return categories;
    } catch (error) {
      throw error;
    }
  },
  getAllTag: async (option) => {
    try {
      const tags = await HomeModel.getAllTag(option);
      return tags;
    } catch (error) {
      throw error;
    }
  },
  getAllPost: async (option) => {
    try {
      const tags = await HomeModel.getAllPost(option);
      return tags;
    } catch (error) {
      throw error;
    }
  },
  getPostDetaill: async (slug) => {
    try {
      // kiểm tra xem post tồn tại không
      const isCheck = await postModel.checkIsPost(slug);
      console.log('🚀 ~ isCheck:', isCheck);
      if (!isCheck) {
        throw new ServiceError(
          'Bài viết không tồn tại', // Bạn cần định nghĩa message này
          'POST_NO_EXISTS_CODE', // và code này
          'Bài không tồn tại',
          404,
        );
      }
      const post = await HomeModel.getPostDetaill(slug);
      return post;
    } catch (error) {
      throw error;
    }
  },
};
export default HomeService;
