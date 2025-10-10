// common/message/document.message.js

// ✅ Success messages
export const DOCUMENT_CREATE_SUCCESS = 'Thêm tài liệu thành công';
export const DOCUMENT_UPDATE_SUCCESS = 'Cập nhật tài liệu thành công';
export const DOCUMENT_DELETE_SUCCESS = 'Xóa tài liệu thành công';
export const DOCUMENT_GET_SUCCESS = 'Lấy danh sách tài liệu thành công';
export const DOCUMENT_GET_DETAIL_SUCCESS = 'Lấy chi tiết tài liệu thành công';
export const DOCUMENT_ASSIGN_USERS_SUCCESS =
  'Gán quyền truy cập tài liệu thành công';
export const DOCUMENT_REMOVE_USER_SUCCESS =
  'Xóa quyền truy cập tài liệu của người dùng thành công';

// ❌ Error messages
export const DOCUMENT_EXISTS = 'Tài liệu với slug này đã tồn tại';
export const DOCUMENT_NOT_FOUND = 'Không tìm thấy tài liệu';
export const DOCUMENT_CREATE_FAILED = 'Thêm tài liệu thất bại';
export const DOCUMENT_UPDATE_FAILED = 'Cập nhật tài liệu thất bại';
export const DOCUMENT_DELETE_FAILED = 'Xóa tài liệu thất bại';
export const DOCUMENT_ASSIGNMENT_FAILED = 'Gán quyền cho người dùng thất bại';
export const DOCUMENT_REMOVAL_FAILED = 'Xóa quyền của người dùng thất bại';
export const DOCUMENT_USER_NOT_ASSIGNED =
  'Người dùng này không có quyền truy cập tài liệu';
