import { AppCode, AppMessage } from '../../common/message/index.js';
import ServiceError from '../../error/service.error.js';
import { applicationModel } from '../../models/admin/index.js';

const applicationService = {
  // Nộp đơn (Public)
  createApplication: async (applicationData) => {
    try {
      const { email, student_id } = applicationData;
      const isExist = await applicationModel.checkIfExists({
        email,
        student_id,
      });
      if (isExist) {
        throw new ServiceError(
          AppMessage.EMAIL_OR_STUDENT_ID_EXISTS,
          AppCode.EMAIL_OR_STUDENT_ID_EXISTS_CODE,
          'Dữ liệu đã tồn tại',
          409,
        );
      }
      return await applicationModel.createApplication(applicationData);
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách đơn (Admin)
  getAllApplications: async (options) => {
    try {
      return await applicationModel.getAllApplications(options);
    } catch (error) {
      throw error;
    }
  },

  // Lấy chi tiết 1 đơn (Admin)
  getOneApplication: async (id) => {
    try {
      const application = await applicationModel.getOneApplication(id);
      if (!application) {
        throw new ServiceError(
          AppMessage.APPLICATION_NOT_FOUND,
          AppCode.APPLICATION_NOT_FOUND_CODE,
        );
      }
      return application;
    } catch (error) {
      throw error;
    }
  },

  // Phê duyệt đơn (Admin)
  approveApplication: async (id, adminId) => {
    // LƯU Ý: Lý tưởng nhất, toàn bộ tiến trình này nên nằm trong một DATABASE TRANSACTION
    // để đảm bảo tính toàn vẹn dữ liệu. Nếu một bước thất bại, tất cả các bước trước đó sẽ được rollback.
    try {
      const application = await applicationService.getOneApplication(id);
      if (application.status !== 2) {
        // 2 = Chờ xử lý
        throw new ServiceError(
          AppMessage.APPLICATION_ALREADY_PROCESSED,
          AppCode.APPLICATION_ALREADY_PROCESSED_CODE,
        );
      }

      // 1. Tạo user mới
      const newUser = {
        fullname: application.fullname,
        email: application.email,
        phone: application.phone,
        role_id: 3, // Giả sử role_id: 3 là "Thành viên"
        email_verified_at: new Date(),
      };
      const userResult = await applicationModel.createUser(newUser);
      const newUserId = userResult.insertId;

      if (!newUserId) {
        throw new Error('Không thể tạo user');
      }

      // 2. Tạo hồ sơ thành viên
      const newProfile = {
        user_id: newUserId,
        student_id: application.student_id,
        join_date: new Date(),
        created_by: adminId,
      };
      await applicationModel.createMemberProfile(newProfile);

      // 3. Cập nhật trạng thái đơn
      await applicationModel.updateApplication(id, { status: 1 }); // 1 = Được chấp thuận

      return { newUserId };
    } catch (error) {
      // Nếu có lỗi, bạn có thể thêm logic để xóa user vừa tạo (nếu có)
      // để tránh dữ liệu rác.
      console.error('Lỗi khi duyệt đơn:', error);
      throw new ServiceError(
        AppMessage.APPROVAL_FAILED,
        AppCode.APPROVAL_FAILED_CODE,
        error.message,
        500,
      );
    }
  },

  // Từ chối đơn (Admin)
  rejectApplication: async (id) => {
    try {
      const application = await applicationService.getOneApplication(id);
      if (application.status !== 2) {
        throw new ServiceError(
          AppMessage.APPLICATION_ALREADY_PROCESSED,
          AppCode.APPLICATION_ALREADY_PROCESSED_CODE,
        );
      }
      return await applicationModel.updateApplication(id, { status: 0 }); // 0 = Bị từ chối
    } catch (error) {
      throw error;
    }
  },
};

export default applicationService;
