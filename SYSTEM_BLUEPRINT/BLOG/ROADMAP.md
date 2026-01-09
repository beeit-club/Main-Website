# Blog Module Roadmap

## Phase 1: Backend Fixes
1. **Fix Syntax**: Sửa lỗi `changePostStatus` và `restorePost` trong `post.model.js`.
2. **Standardize Wrapper**: Chuyển các câu lệnh UPDATE/DELETE về dùng wrapper `update` / `remove` từ `utils/database.js` để code đồng nhất.
3. **Refactor Controller**: Trả về ID bài viết chính xác trong response update.

## Phase 2: Frontend Enhancement
1. **Shadcn Editor**: Nếu đang dùng TinyMCE, cân nhắc tích hợp thêm các UI components của Shadcn xung quanh (Category Select, Tag Input).
2. **Image Preview**: Cải thiện trải nghiệm upload ảnh với preview và loading state.

## Phase 3: SEO & Features
1. Thêm API lấy bài viết liên quan (Related Posts) dựa trên Tags/Category.
2. Tối ưu hóa SEO với OpenGraph tags.
