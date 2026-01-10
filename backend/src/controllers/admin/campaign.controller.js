
import asyncWrapper from '../../middlewares/error.handler.js';
import campaignService from '../../services/admin/campaign.service.js';
import { utils } from '../../utils/index.js';
import * as yup from 'yup';

const createSchema = yup.object({
  name: yup.string().required(),
  template_id: yup.number().required(),
  recipients: yup.array().of(
    yup.object({
      email: yup.string().email().required(),
      fullname: yup.string().optional()
    })
  ).min(1).required(),
  common_variables: yup.object().optional()
});

const campaignController = {
  create: asyncWrapper(async (req, res) => {
    const body = await createSchema.validate(req.body, { stripUnknown: true });
    const result = await campaignService.createCampaign(body, req.user?.id);
    return utils.success(res, 'Tạo chiến dịch thành công', result);
  }),

  getAll: asyncWrapper(async (req, res) => {
    const result = await campaignService.getCampaigns(req.query);
    return utils.success(res, 'Lấy danh sách chiến dịch thành công', result);
  }),

  getDetail: asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const result = await campaignService.getCampaignDetail(id);
    return utils.success(res, 'Lấy chi tiết chiến dịch thành công', { campaign: result });
  })
};

export default campaignController;
