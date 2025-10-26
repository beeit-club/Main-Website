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
};
export default HomeService;
