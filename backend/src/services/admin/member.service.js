import { code, message } from '../../common/message/index.js';
import ServiceError from '../../error/service.error.js';
import memberModel from '../../models/admin/member.model.js';
import userModel from '../../models/admin/user.model.js';

const memberService = {
  /**
   * 📋 Lấy danh sách thành viên (có phân trang)
   */
  getAllMembers: async (option) => {
    try {
      const result = await memberModel.getAllMembers(option);
      return result;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 🔹 Lấy thông tin chi tiết thành viên theo user_id
   */
  getMemberByUserId: async (userId) => {
    try {
      if (!userId) {
        throw new ServiceError(
          'Thiếu user_id',
          'MISSING_USER_ID',
          'user_id là bắt buộc',
          400,
        );
      }

      const member = await memberModel.getMemberByUserId(userId);

      if (!member) {
        throw new ServiceError(
          'Thành viên không tồn tại',
          'MEMBER_NOT_FOUND',
          'Không tìm thấy thành viên với user_id này',
          404,
        );
      }

      return member;
    } catch (error) {
      throw error;
    }
  },

  /**
   * ➕ Tạo thành viên mới
   */
  createMember: async (data, adminId) => {
    try {
      const { user_id, student_id, academic_year, course, join_date } = data;

      // 1. Kiểm tra user_id có tồn tại không
      const user = await userModel.getUserById(user_id);
      if (!user) {
        throw new ServiceError(
          'Người dùng không tồn tại',
          'USER_NOT_FOUND',
          'User_id không hợp lệ',
          404,
        );
      }

      // 2. Kiểm tra user đã có member profile chưa
      const existingMember = await memberModel.checkMemberExists(user_id);
      if (existingMember) {
        throw new ServiceError(
          'Người dùng đã là thành viên',
          'MEMBER_ALREADY_EXISTS',
          'User này đã có hồ sơ thành viên',
          400,
        );
      }

      // 3. Kiểm tra student_id đã tồn tại chưa
      if (student_id) {
        const existingStudentId = await memberModel.checkStudentIdExists(student_id);
        if (existingStudentId) {
          throw new ServiceError(
            'MSSV đã tồn tại',
            'STUDENT_ID_EXISTS',
            'MSSV này đã được sử dụng bởi thành viên khác',
            400,
          );
        }
      }

      // 4. Cập nhật role_id của user thành 4 (Member) nếu chưa phải
      if (user.role_id !== 4) {
        await userModel.updateUser(user_id, { role_id: 4 });
      }

      // 5. Tạo member profile
      const memberData = {
        user_id,
        student_id,
        academic_year: academic_year ? new Date(academic_year) : null,
        course,
        join_date: join_date ? new Date(join_date) : new Date(),
        created_by: adminId,
      };

      const result = await memberModel.createMember(memberData);

      // 6. Lấy lại thông tin member vừa tạo
      const newMember = await memberModel.getMemberByUserId(user_id);

      return newMember;
    } catch (error) {
      throw error;
    }
  },

  /**
   * ✏️ Cập nhật thông tin thành viên
   */
  updateMember: async (userId, data, adminId) => {
    try {
      // 1. Kiểm tra member có tồn tại không
      const member = await memberModel.getMemberByUserId(userId);
      if (!member) {
        throw new ServiceError(
          'Thành viên không tồn tại',
          'MEMBER_NOT_FOUND',
          'Không tìm thấy thành viên với user_id này',
          404,
        );
      }

      // 2. Kiểm tra student_id nếu có thay đổi
      if (data.student_id && data.student_id !== member.student_id) {
        const existingStudentId = await memberModel.checkStudentIdExists(
          data.student_id,
          userId,
        );
        if (existingStudentId) {
          throw new ServiceError(
            'MSSV đã tồn tại',
            'STUDENT_ID_EXISTS',
            'MSSV này đã được sử dụng bởi thành viên khác',
            400,
          );
        }
      }

      // 3. Chuẩn bị dữ liệu cập nhật
      const updateData = {};
      if (data.student_id !== undefined) updateData.student_id = data.student_id;
      if (data.academic_year !== undefined)
        updateData.academic_year = data.academic_year ? new Date(data.academic_year) : null;
      if (data.course !== undefined) updateData.course = data.course;
      if (data.join_date !== undefined)
        updateData.join_date = data.join_date ? new Date(data.join_date) : null;
      
      updateData.updated_by = adminId;

      // 4. Cập nhật
      await memberModel.updateMember(userId, updateData);

      // 5. Lấy lại thông tin đã cập nhật
      const updatedMember = await memberModel.getMemberByUserId(userId);

      return updatedMember;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 🗑️ Xóa thành viên (soft delete)
   */
  deleteMember: async (userId) => {
    try {
      // 1. Kiểm tra member có tồn tại không
      const member = await memberModel.getMemberByUserId(userId);
      if (!member) {
        throw new ServiceError(
          'Thành viên không tồn tại',
          'MEMBER_NOT_FOUND',
          'Không tìm thấy thành viên với user_id này',
          404,
        );
      }

      // 2. Xóa mềm member profile
      await memberModel.deleteMember(userId);

      return { message: 'Xóa thành viên thành công' };
    } catch (error) {
      throw error;
    }
  },

  /**
   * 📋 Lấy danh sách users chưa có member profile (để chọn khi thêm)
   */
  getAvailableUsers: async (options = {}) => {
    try {
      const users = await memberModel.getAvailableUsers(options);
      return users;
    } catch (error) {
      throw error;
    }
  },
};

export default memberService;

