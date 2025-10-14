// common/message/event.message.js

// ✅ Success messages
export const EVENT_CREATE_SUCCESS = 'Tạo sự kiện mới thành công';
export const EVENT_UPDATE_SUCCESS = 'Cập nhật sự kiện thành công';
export const EVENT_DELETE_SUCCESS = 'Xóa sự kiện thành công';
export const EVENT_GET_SUCCESS = 'Lấy danh sách sự kiện thành công';
export const EVENT_GET_DETAIL_SUCCESS = 'Lấy chi tiết sự kiện thành công';
export const REGISTRATION_SUCCESS = 'Đăng ký tham gia sự kiện thành công';
export const CHECKIN_SUCCESS = 'Check-in thành công';

// ❌ Error messages
export const EVENT_NOT_FOUND = 'Không tìm thấy sự kiện';
export const EVENT_SLUG_EXISTS = 'Sự kiện với slug này đã tồn tại';
export const REGISTRATION_FAILED = 'Đăng ký thất bại, vui lòng thử lại';
export const EVENT_IS_FULL = 'Sự kiện đã đạt số lượng người tham gia tối đa';
export const REGISTRATION_DEADLINE_PASSED =
  'Đã hết hạn đăng ký tham gia sự kiện';
export const USER_ALREADY_REGISTERED =
  'Bạn đã đăng ký tham gia sự kiện này rồi';
export const REGISTRATION_NOT_FOUND = 'Không tìm thấy lượt đăng ký này';
export const ALREADY_CHECKED_IN = 'Lượt đăng ký này đã được check-in từ trước';
