// ========================== USER ==========================
// Success messages
export const FETCH_SUCCESS = 'Lấy dữ liệu người dùng thành công.';
export const CREATE_SUCCESS = 'Tạo người dùng thành công.';
export const UPDATE_SUCCESS = 'Cập nhật người dùng thành công.';
export const DELETE_SUCCESS = 'Xóa người dùng thành công.';
export const HARD_DELETE_SUCCESS = 'Xóa vĩnh viễn người dùng thành công.';
export const ACTIVATE_SUCCESS = 'Kích hoạt người dùng thành công.';
export const DEACTIVATE_SUCCESS = 'Vô hiệu hóa người dùng thành công.';
export const VERIFY_EMAIL_SUCCESS = 'Xác minh email thành công.';
export const RESET_PASSWORD_SUCCESS = 'Đặt lại mật khẩu thành công.';
export const LOGIN_SUCCESS = 'Đăng nhập thành công.';
export const LOGOUT_SUCCESS = 'Đăng xuất thành công.';
export const RESTORE_SUCCESS = 'Khôi phục người dùng thành công.';
export const FETCH_DELETED_SUCCESS =
  'Lấy danh sách người dùng đã xóa thành công.';
export const SEARCH_SUCCESS = 'Tìm kiếm người dùng thành công.';
export const FETCH_BY_ROLE_SUCCESS =
  'Lấy danh sách người dùng theo vai trò thành công.';
export const STATS_SUCCESS = 'Lấy thống kê người dùng thành công.';

// Failure messages
export const FETCH_FAILURE = 'Lấy dữ liệu người dùng thất bại.';
export const CREATE_FAILURE = 'Tạo người dùng thất bại.';
export const UPDATE_FAILURE = 'Cập nhật người dùng thất bại.';
export const DELETE_FAILURE = 'Xóa người dùng thất bại.';
export const HARD_DELETE_FAILURE = 'Xóa vĩnh viễn người dùng thất bại.';
export const ACTIVATE_FAILURE = 'Kích hoạt người dùng thất bại.';
export const DEACTIVATE_FAILURE = 'Vô hiệu hóa người dùng thất bại.';
export const VERIFY_EMAIL_FAILURE = 'Xác minh email thất bại.';
export const RESET_PASSWORD_FAILURE = 'Đặt lại mật khẩu thất bại.';
export const LOGIN_FAILURE = 'Đăng nhập thất bại.';
export const LOGOUT_FAILURE = 'Đăng xuất thất bại.';
export const RESTORE_FAILURE = 'Khôi phục người dùng thất bại.';
export const STATS_FAILURE = 'Lấy thống kê người dùng thất bại.';

// Error messages
export const USER_NOT_FOUND = 'Người dùng không tồn tại.';
export const USER_NOT_FOUND_DELETED = 'Không tìm thấy người dùng đã xóa.';
export const NO_DELETED_USERS = 'Không có người dùng nào đã bị xóa.';
export const NO_UPDATE = 'Không có dữ liệu để cập nhật.';
export const EMAIL_EXISTS = 'Email đã tồn tại.';
export const EMAIL_ALREADY_VERIFIED = 'Email đã được xác minh.';
export const SEARCH_NO_RESULT = 'Không tìm thấy kết quả tìm kiếm.';
export const NO_USERS_IN_ROLE = 'Không có người dùng nào trong vai trò này.';

// Validation messages
export const INVALID_ID = 'Thiếu hoặc sai định dạng ID';
export const INVALID_NAME = 'Tên không hợp lệ (ít nhất 4 ký tự)';
export const INVALID_EMAIL = 'Email không hợp lệ';
export const INVALID_PHONE = 'Số điện thoại không hợp lệ';
export const INVALID_ROLE_ID = 'ID vai trò không hợp lệ';
export const KEYWORD_REQUIRED = 'Từ khóa tìm kiếm là bắt buộc.';

// ========================== ROLE ==========================
// Success messages
export const ROLE_FETCH_SUCCESS = 'Lấy dữ liệu vai trò thành công.';
export const ROLE_CREATE_SUCCESS = 'Tạo vai trò mới thành công.';
export const ROLE_UPDATE_SUCCESS = 'Cập nhật vai trò thành công.';
export const ROLE_DELETE_SUCCESS = 'Xóa vai trò thành công.';
export const ROLE_ASSIGN_SUCCESS = 'Phân quyền cho người dùng thành công.';

// Failure messages
export const ROLE_FETCH_FAILURE = 'Lấy dữ liệu vai trò thất bại.';
export const ROLE_CREATE_FAILURE = 'Tạo vai trò mới thất bại.';
export const ROLE_UPDATE_FAILURE = 'Cập nhật vai trò thất bại.';
export const ROLE_DELETE_FAILURE = 'Xóa vai trò thất bại.';
export const ROLE_ASSIGN_FAILURE = 'Phân quyền cho người dùng thất bại.';

// Error messages
export const ROLE_NOT_FOUND = 'Vai trò không tồn tại.';
export const ROLE_NAME_EXISTS = 'Tên vai trò đã tồn tại.';
export const ROLE_IN_USE = 'Vai trò đang được sử dụng, không thể xóa.';

// ========================== PERMISSION ==========================
// Success messages
export const PERMISSION_FETCH_SUCCESS = 'Lấy dữ liệu quyền thành công.';
export const PERMISSION_CREATE_SUCCESS = 'Tạo quyền mới thành công.';
export const PERMISSION_UPDATE_SUCCESS = 'Cập nhật quyền thành công.';
export const PERMISSION_DELETE_SUCCESS = 'Xóa quyền thành công.';
export const PERMISSION_GRANT_SUCCESS = 'Cấp quyền thành công.';
export const PERMISSION_REVOKE_SUCCESS = 'Thu hồi quyền thành công.';

// Failure messages
export const PERMISSION_FETCH_FAILURE = 'Lấy dữ liệu quyền thất bại.';
export const PERMISSION_CREATE_FAILURE = 'Tạo quyền mới thất bại.';
export const PERMISSION_UPDATE_FAILURE = 'Cập nhật quyền thất bại.';
export const PERMISSION_DELETE_FAILURE = 'Xóa quyền thất bại.';
export const PERMISSION_GRANT_FAILURE = 'Cấp quyền thất bại.';
export const PERMISSION_REVOKE_FAILURE = 'Thu hồi quyền thất bại.';

// Error messages
export const PERMISSION_NOT_FOUND = 'Quyền không tồn tại.';
export const PERMISSION_NAME_EXISTS = 'Tên quyền đã tồn tại.';
export const PERMISSION_IN_USE = 'Quyền đang được sử dụng, không thể xóa.';
