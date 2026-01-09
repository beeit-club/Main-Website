# Members Module Roadmap

## Phase 1: Backend Optimization
1. **Sync Role**: Cập nhật `MemberService.createMember` để tự động update `role_id` của user sang Member role (giả định role_id cho Member).
2. **Transaction Support**: Sử dụng Database Transaction khi tạo Member (Insert Profile + Update User Role) để đảm bảo tính toàn vẹn dữ liệu.
3. **API Standardization**: Đảm bảo response trả về đúng format `utils.success`.

## Phase 2: Frontend Upgrade (Shadcn UI)
1. **Data Table**: Sử dụng Shadcn `DataTable` với Sorting, Filtering và Pagination.
2. **Form Management**: Sử dụng `react-hook-form` + `zod` cho form Thêm/Sửa thành viên.
3. **User Selection**: Cải tiến UI chọn User bằng `Popover` + `Command` (Autocomplete).

## Phase 3: Profile Integration
1. Cho phép Member tự cập nhật thông tin profile của mình (ngoài MSSV cần Admin duyệt).
