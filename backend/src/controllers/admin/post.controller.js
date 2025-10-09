import asyncWrapper from '../../middlewares/error.handler.js';

const postController = {
  getPosts: asyncWrapper(async (req, res) => {}),
};
export default postController;
