import { message } from '../../common/message/index.js';
import asyncWrapper from '../../middlewares/error.handler.js';
import userService from '../../services/admin/user.service.js';
import { utils } from '../../utils/index.js';
import Schema from '../../validation/admin/user.validation.js';

const userController = {
  getAllUser: asyncWrapper(async (req, res) => {
    const users = await userService.getAllUser();
    return utils.success(res, message.User.FETCH_SUCCESS, { users });
  }),
  getUserById: asyncWrapper(async (req, res) => {
    await Schema.param.validate(req.params, { abortEarly: false });
    const { id } = req.params || {};
    const user = await userService.getUserById(id);
    return utils.success(res, message.User.FETCH_SUCCESS, { user });
  }),
  createUser: asyncWrapper(async (req, res) => {
    await Schema.createUser.validate(req.body, { abortEarly: false });
    const data = req.body || {};
    const user = await userService.createUser(data);
    return utils.success(res, message.User.CREATE_SUCCESS, {
      user,
    });
  }),
  updateUser: asyncWrapper(async (req, res) => {
    await Schema.param.validate(req.params, { abortEarly: false });
    await Schema.updateUser.validate(req.body, { abortEarly: false });
    const { id } = req.params;
    const data = req.body; // có thể gồm fullname, email, phone, role_id...
    const updatedUser = await userService.updateUser(id, data);
    return utils.success(res, message.User.UPDATE_SUCCESS, {
      user: updatedUser,
    });
  }),
  deleteUser: asyncWrapper(async (req, res) => {
    await Schema.param.validate(req.params, { abortEarly: false });
    const { id } = req.params;
    const { fullname, email } = await userService.getUserById(id);
    await userService.deleteUser(id);
    return utils.success(res, message.User.DELETE_SUCCESS, {
      id,
      fullname,
      email,
    });
  }),
};

export default userController;
