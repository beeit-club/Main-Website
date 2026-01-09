import MemberService from '../../services/client/member.service.js';
import asyncWrapper from '../../middlewares/error.handler.js';
import { utils } from '../../utils/index.js';

const MemberController = {
  requestUpdate: asyncWrapper(async (req, res) => {
    const { id } = req.user;
    const result = await MemberService.createRequest(id, req.body);
    return utils.success(res, 'Gửi yêu cầu thành công', result);
  }),
};

export default MemberController;
