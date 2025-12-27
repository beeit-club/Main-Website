import DashboardModel from '../../models/admin/dashboard.model.js';
import ServiceError from '../../error/service.error.js';

const dashboardService = {
  /**
   * Lấy thống kê tổng quan cho dashboard
   */
  getDashboardStats: async () => {
    try {
      const stats = await DashboardModel.getDashboardStats();
      return stats;
    } catch (error) {
      throw new ServiceError(
        'DASHBOARD_STATS_ERROR',
        'DASHBOARD_STATS_ERROR',
        'Không thể lấy thống kê dashboard',
        500,
      );
    }
  },

  /**
   * Lấy dữ liệu thống kê theo thời gian cho biểu đồ
   */
  getTimeSeriesData: async (period = '30d') => {
    try {
      const data = await DashboardModel.getTimeSeriesData(period);
      return data;
    } catch (error) {
      throw new ServiceError(
        'DASHBOARD_TIMESERIES_ERROR',
        'DASHBOARD_TIMESERIES_ERROR',
        'Không thể lấy dữ liệu biểu đồ',
        500,
      );
    }
  },
};

export default dashboardService;

