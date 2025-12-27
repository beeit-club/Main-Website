import dashboardService from '../../services/admin/dashboard.service.js';
import asyncWrapper from '../../middlewares/error.handler.js';
import { utils } from '../../utils/index.js';

const dashboardController = {
  /**
   * 📊 Lấy thống kê tổng quan cho dashboard
   * GET /api/admin/dashboard/stats
   */
  getDashboardStats: asyncWrapper(async (req, res) => {
    const stats = await dashboardService.getDashboardStats();
    return utils.success(res, 'Lấy thống kê dashboard thành công', { stats });
  }),

  /**
   * 📈 Lấy dữ liệu thống kê theo thời gian cho biểu đồ
   * GET /api/admin/dashboard/timeseries?period=30d
   */
  getTimeSeriesData: asyncWrapper(async (req, res) => {
    const { period = '30d' } = req.query;
    const data = await dashboardService.getTimeSeriesData(period);
    return utils.success(res, 'Lấy dữ liệu biểu đồ thành công', { data });
  }),
};

export default dashboardController;

