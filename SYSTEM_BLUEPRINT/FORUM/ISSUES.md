# Forum (Q&A) Module Issues

## 1. Architectural Issue (Critical)
- **API Leak**: Client-side đang sử dụng API endpoints của Admin (`/admin/questions`). Điều này vi phạm nguyên tắc phân quyền và an toàn dữ liệu. Người dùng có thể thực hiện các hành động Admin nếu không có check quyền chặt chẽ.

## 2. Missing Client Controller
- Hiện tại chưa có `question.controller.js` và `answer.controller.js` dành riêng cho Client (Public API).

## 3. Business Logic
- Thiếu logic kiểm tra quyền sở hữu (Owner check): Người dùng chỉ được sửa/xóa câu hỏi/câu trả lời của chính mình.
- `voteAnswer`: Chưa thấy bảng `answer_votes` để lưu vết người dùng nào đã vote (để tránh một người vote nhiều lần). Hiện tại có vẻ chỉ tăng/giảm số lượng trong bảng `answers`.

## 4. Frontend UI
- Cần kiểm tra trang `/questions` để xem đã tích hợp API thật chưa.
