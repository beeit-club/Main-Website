// services/email/userDataMapper.service.js
// Service map dữ liệu user từ database thành variables cho email template

import ServiceError from '../../error/service.error.js';

/**
 * Service để map dữ liệu user từ database thành variables cho email template
 * 
 * Trách nhiệm:
 * - Map user data → email variables
 * - Tính toán các giá trị derived (years_as_member, formatted dates)
 * - Merge với additional data (event, document, ...)
 * - Tạo recipients list cho bulk email
 */
class UserDataMapper {
  /**
   * Tính số năm là thành viên từ join_date
   * @param {Date|string} joinDate - Ngày tham gia
   * @returns {number|null} Số năm là thành viên
   */
  calculateYearsAsMember(joinDate) {
    if (!joinDate) {
      return null;
    }

    try {
      const join = new Date(joinDate);
      const now = new Date();
      const diffTime = now - join;
      const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
      return diffYears >= 0 ? diffYears : 0;
    } catch (error) {
      console.error('Lỗi khi tính số năm là thành viên:', error);
      return null;
    }
  }

  /**
   * Format ngày tham gia theo định dạng tiếng Việt
   * @param {Date|string} joinDate - Ngày tham gia
   * @returns {string|null} Ngày đã format
   */
  formatJoinDate(joinDate) {
    if (!joinDate) {
      return null;
    }

    try {
      const date = new Date(joinDate);
      return date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Lỗi khi format ngày tham gia:', error);
      return null;
    }
  }

  /**
   * Map user data từ DB → email variables
   * 
   * @param {Object} userData - User data từ DB (có member_profiles)
   * @param {Object} additionalData - Dữ liệu bổ sung (event, document, message, ...)
   * @returns {Object} Variables để render email template
   * 
   * @example
   * const variables = mapper.mapUserToVariables(userData, {
   *   event_title: "Workshop ReactJS",
   *   message: "Thông báo quan trọng"
   * });
   */
  mapUserToVariables(userData, additionalData = {}) {
    // Validate input
    if (!userData) {
      throw new ServiceError(
        'Thiếu dữ liệu user',
        'MISSING_USER_DATA',
        'userData là bắt buộc',
        400,
      );
    }

    // Tính toán các giá trị derived
    const yearsAsMember = this.calculateYearsAsMember(userData.join_date);
    const formattedJoinDate = this.formatJoinDate(userData.join_date);

    // Base variables từ users table
    const baseVariables = {
      // Thông tin cơ bản user
      fullname: userData.fullname || '',
      email: userData.email || '',
      phone: userData.phone || null,
      avatar_url: userData.avatar_url || null,
      bio: userData.bio || null,

      // Thông tin vai trò
      role_name: userData.role_name || null,
      role_description: userData.role_description || null,

      // Thông tin thành viên (nếu có)
      student_id: userData.student_id || null,
      academic_year: userData.academic_year || null,

      join_date: userData.join_date || null,
      formatted_join_date: formattedJoinDate,
      years_as_member: yearsAsMember,
    };

    // Merge với additional data (event, document, message, ...)
    // additionalData sẽ override baseVariables nếu có key trùng
    return {
      ...baseVariables,
      ...additionalData,
    };
  }

  /**
   * Map nhiều users cùng lúc → variables list
   * 
   * @param {Array<Object>} usersData - Danh sách users từ DB
   * @param {Object} additionalData - Dữ liệu chung cho tất cả users
   * @returns {Array<Object>} Danh sách variables cho từng user
   * 
   * @example
   * const variablesList = mapper.mapUsersToVariables(usersData, {
   *   event_title: "Workshop ReactJS"
   * });
   */
  mapUsersToVariables(usersData, additionalData = {}) {
    if (!Array.isArray(usersData)) {
      throw new ServiceError(
        'Dữ liệu users phải là mảng',
        'INVALID_USERS_DATA',
        'usersData phải là array',
        400,
      );
    }

    return usersData.map((user) =>
      this.mapUserToVariables(user, additionalData),
    );
  }

  /**
   * Tạo recipients list cho bulk email từ users data
   * 
   * @param {Array<Object>} usersData - Danh sách users từ DB
   * @param {Object} additionalData - Dữ liệu bổ sung
   * @returns {Array<Object>} Recipients: [{ email, variables }]
   * 
   * @example
   * const recipients = mapper.createRecipientsList(usersData, {
   *   event_title: "Workshop ReactJS"
   * });
   * // Returns: [
   * //   { email: "user1@example.com", variables: {...} },
   * //   { email: "user2@example.com", variables: {...} }
   * // ]
   */
  createRecipientsList(usersData, additionalData = {}) {
    if (!Array.isArray(usersData)) {
      throw new ServiceError(
        'Dữ liệu users phải là mảng',
        'INVALID_USERS_DATA',
        'usersData phải là array',
        400,
      );
    }

    if (usersData.length === 0) {
      return [];
    }

    return usersData
      .filter((user) => user.email) // Chỉ lấy users có email
      .map((user) => ({
        email: user.email,
        variables: this.mapUserToVariables(user, additionalData),
      }));
  }
}

export default new UserDataMapper();
