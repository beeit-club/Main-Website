import { code, message } from '../../common/message/index.js';
import ServiceError from '../../error/service.error.js';
import { applicationModel, InterviewModel } from '../../models/admin/index.js';
// import { sendInterviewInviteEmail, sendCongratsEmail, sendRejectEmail } from '../../utils/mailer.js'; // (Giả sử bạn có file này)

// Tái sử dụng hàm kiểm tra đơn
async function checkApplication(id, expectedStatus) {
  const application = await applicationModel.getOneApplication(id);
  if (!application) {
    throw new ServiceError(
      message.APPLICATION_NOT_FOUND,
      code.APPLICATION_NOT_FOUND_CODE,
    );
  }
  // Nếu expectedStatus là một mảng, kiểm tra xem status có nằm trong mảng không
  if (Array.isArray(expectedStatus)) {
    if (!expectedStatus.includes(application.status)) {
      throw new ServiceError(
        'Trạng thái đơn không hợp lệ',
        'INVALID_STATUS',
        `Đơn đang ở status ${
          application.status
        }, yêu cầu status ${expectedStatus.join(' hoặc ')}`,
      );
    }
  }
  // Nếu là một số, kiểm tra bằng
  else if (application.status !== expectedStatus) {
    throw new ServiceError(
      'Trạng thái đơn không hợp lệ',
      'INVALID_STATUS',
      `Đơn đang ở status ${application.status}, yêu cầu status ${expectedStatus}`,
    );
  }
  return application;
}

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
          message.EMAIL_OR_STUDENT_ID_EXISTS,
          code.EMAIL_OR_STUDENT_ID_EXISTS_CODE,
          'Dữ liệu đã tồn tại',
          409,
        );
      }
      // status: 0 (Chờ xử lý)
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
          message.APPLICATION_NOT_FOUND,
          code.APPLICATION_NOT_FOUND_CODE,
        );
      }
      return application;
    } catch (error) {
      throw error;
    }
  },

  // === WORKFLOW MỚI ===

  // BƯỚC 1: Duyệt đơn (Status 0 -> 1)
  reviewApplication: async (id) => {
    await checkApplication(id, 0); // Yêu cầu status 0
    return await applicationModel.updateApplication(id, { status: 1 });
  },

  // BƯỚC 2: Đặt lịch (Status 1 -> 2)
  scheduleApplication: async (id, schedule_id) => {
    const application = await checkApplication(id, 1); // Yêu cầu status 1
    const schedule = await InterviewModel.getOne(schedule_id); // Kiểm tra lịch có tồn tại
    if (!schedule) {
      throw new ServiceError(
        'Lịch phỏng vấn không tồn tại',
        'SCHEDULE_NOT_FOUND',
      );
    }

    // Cập nhật đơn
    await applicationModel.updateApplication(id, { status: 2, schedule_id });

    // Gửi email mời phỏng vấn (Bạn cần tự cài đặt hàm gửi mail)
    // await sendInterviewInviteEmail(application.email, application.fullname, schedule);
    console.log(`Đã gửi email mời phỏng vấn cho ${application.email}`);

    return { application, schedule };
  },

  // BƯỚC 3: Phê duyệt (Status 2 -> 3)
  approveApplication: async (id, interview_notes, adminId) => {
    // LƯU Ý: Lý tưởng nhất, toàn bộ tiến trình này nên nằm trong một DATABASE TRANSACTION
    try {
      const application = await checkApplication(id, 2); // Yêu cầu status 2

      // 1. Tạo user mới
      const newUser = {
        fullname: application.fullname,
        email: application.email,
        phone: application.phone,
        role_id: 4, // Quan trọng: Đảm bảo role_id 4 là "Member" (theo database của bạn)
        email_verified_at: new Date(),
      };
      const userResult = await applicationModel.createUser(newUser);
      const newUserId = userResult.insertId;
      if (!newUserId) throw new Error('Không thể tạo user');

      // 2. Tạo hồ sơ thành viên
      const newProfile = {
        user_id: newUserId,
        student_id: application.student_id,
        join_date: new Date(),
        course: application.student_year,
        created_by: adminId,
      };
      await applicationModel.createMemberProfile(newProfile);

      // 3. Cập nhật trạng thái đơn
      await applicationModel.updateApplication(id, {
        status: 3,
        interview_notes,
      });

      // 4. Gửi email chúc mừng
      // await sendCongratsEmail(application.email, application.fullname);
      console.log(`Đã gửi email chúc mừng cho ${application.email}`);

      return { newUserId };
    } catch (error) {
      // Nếu có lỗi, bạn có thể thêm logic để xóa user vừa tạo (nếu có)
      // để tránh dữ liệu rác.
      console.error('Lỗi khi duyệt đơn:', error);
      throw new ServiceError(
        message.APPROVAL_FAILED,
        code.APPROVAL_FAILED_CODE,
        error.message,
        500,
      );
    }
  },

  // BƯỚC 4: Từ chối (Status 0/2 -> 4)
  rejectApplication: async (id, interview_notes) => {
    try {
      // Cho phép từ chối ngay từ status 0 (chờ xử lý) hoặc 2 (đã đặt lịch)
      const application = await checkApplication(id, [0, 2]);

      // Cập nhật đơn
      await applicationModel.updateApplication(id, {
        status: 4,
        interview_notes,
      });

      // Gửi email từ chối
      // await sendRejectEmail(application.email, application.fullname, interview_notes);
      console.log(`Đã gửi email từ chối cho ${application.email}`);

      return { id };
    } catch (error) {
      throw error;
    }
  },
};

export default applicationService;
