# Forum (Q&A) Module Roadmap

## Phase 1: Backend Client API
1. **Create Client Controllers**: Tạo `controllers/client/question.controller.js` và `answer.controller.js`.
2. **Public API**: Mở API lấy danh sách câu hỏi và chi tiết câu hỏi (Public).
3. **Owner Check Middleware**: Viết middleware kiểm tra xem user có phải người tạo câu hỏi/câu trả lời không trước khi cho phép Update/Delete.

## Phase 2: Frontend Refactor
1. **Update Service**: Sửa `questionServices.js` để gọi đúng API `/client/questions` thay vì `/admin/`.
2. **UI Upgrade**: Sử dụng Shadcn UI cho danh sách câu hỏi, form đặt câu hỏi và trình soạn thảo câu trả lời.

## Phase 3: Voting & Ranking
1. **Vote Tracking**: Tạo bảng `answer_votes` để quản lý lượt vote của từng user.
2. **Ranking Logic**: Sắp xếp câu trả lời theo Vote cao nhất hoặc "Accepted Answer".
