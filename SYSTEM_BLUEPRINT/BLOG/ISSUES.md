# Blog Module Issues

## 1. Logic Bugs
- **Model `changePostStatus`**: Lỗi cú pháp mảng tham số `[, status, id]`.
- **Model `restorePost`**: Dùng `findOne` cho câu lệnh `UPDATE` là sai mục đích.
- **Controller `updatePost`**: Trả về `post.insertId` sau khi update là không chính xác (update không sinh ID mới).

## 2. Consistency
- Tên class `postModel` viết thường (nên là PascalCase `PostModel`).
- Một số hàm trong Model dùng `pool.query` trực tiếp, số khác dùng wrapper.

## 3. Improvements
- Chưa thấy cơ chế lọc theo Tag trong API `getAllPosts`.
- Cần cơ chế tự động dọn dẹp ảnh cũ trên server khi bài viết bị xóa vĩnh viễn hoặc đổi ảnh bìa.
