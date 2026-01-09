import { code, message } from '../../common/message/index.js';
import ServiceError from '../../error/service.error.js';
import { applicationModel, InterviewModel } from '../../models/admin/index.js';
import emailService from '../email/emailService.js';

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
      const existInfo = await applicationModel.checkIfExists({
        email,
        student_id,
      });
      
      if (existInfo) {
        if (existInfo.type === 'STUDENT_ID_IS_MEMBER') {
            throw new ServiceError('Mã số sinh viên này đã là thành viên CLB.', 'STUDENT_ID_EXISTS', null, 409);
        }
        if (existInfo.type === 'APPLICATION_EXISTS') {
            throw new ServiceError('Email này đã nộp đơn và đang trong quá trình xử lý.', 'APPLICATION_EXISTS', null, 409);
        }
      }

      // status: 0 (Chờ xử lý)
      const result = await applicationModel.createApplication(applicationData);

      // Gửi email xác nhận nộp đơn
      try {
        await emailService.sendApplicationReceived(applicationData);
      } catch (emailError) {
        console.error('Lỗi khi gửi email xác nhận nộp đơn:', emailError);
      }

      return result;
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

    // Gửi email thông báo lịch phỏng vấn
    try {
      await emailService.sendInterviewScheduled(application, schedule);
    } catch (emailError) {
      console.error('Lỗi khi gửi email thông báo lịch phỏng vấn:', emailError);
    }

    return { application, schedule };
  },

  // BƯỚC 3: Phê duyệt (Status 2 -> 3)
  approveApplication: async (id, interview_notes, adminId) => {
    try {
      const application = await checkApplication(id, 2); // Yêu cầu status 2

      let targetUserId;
      
      // 1. Kiểm tra xem user đã có tài khoản trong hệ thống chưa
      const existingUser = await applicationModel.findUserByEmail(application.email);
      
      if (existingUser) {
        // Nếu đã có tài khoản -> Cập nhật role lên Member (4)
        await applicationModel.updateUserRole(existingUser.id, 4);
        targetUserId = existingUser.id;
      } else {
        // Nếu chưa có -> Tạo user mới
        const newUser = {
          fullname: application.fullname,
          email: application.email,
          phone: application.phone,
          role_id: 4,
          email_verified_at: new Date(),
        };
        const userResult = await applicationModel.createUser(newUser);
        targetUserId = userResult.insertId;
      }

      if (!targetUserId) throw new Error('Không thể xác định User ID');

      // 2. Tạo hồ sơ thành viên
      // Trích xuất năm nhập học từ ngày chọn (để điền vào cột course)
      const enrollmentDate = new Date(application.student_year);
      const enrollmentYear = enrollmentDate.getFullYear();

      const newProfile = {
        user_id: targetUserId,
        student_id: application.student_id,
        join_date: new Date(),
        academic_year: application.student_year, // Lưu full ngày vào cột DATE
        course: `Khóa ${enrollmentYear}`, // Tự động tạo tên khóa (VD: Khóa 2024)
        created_by: adminId,
      };
      await applicationModel.createMemberProfile(newProfile);

      // 3. Cập nhật trạng thái đơn
      await applicationModel.updateApplication(id, {
        status: 3,
        interview_notes,
      });

      // 4. Lấy lại application với interview_notes đã cập nhật
      const updatedApplication = await applicationModel.getOneApplication(id);

      // 5. Gửi email
      try {
        await emailService.sendApplicationApproved(updatedApplication);
        if (!existingUser) {
            await emailService.sendWelcomeEmail({
                fullname: application.fullname,
                email: application.email
            });
        }
      } catch (emailError) {
        console.error('Lỗi khi gửi email chúc mừng/welcome:', emailError);
      }

      return { userId: targetUserId };
    } catch (error) {
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

      // Lấy lại application với interview_notes đã cập nhật
      const updatedApplication = await applicationModel.getOneApplication(id);

      // Gửi email từ chối
      try {
        await emailService.sendApplicationRejected(updatedApplication);
      } catch (emailError) {
        console.error('Lỗi khi gửi email từ chối:', emailError);
      }

      return { id };
    } catch (error) {
      throw error;
    }
  },
};

export default applicationService;