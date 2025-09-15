# Hệ thống Quản lý Câu lạc bộ (Club Management System)

Một nền tảng web toàn diện được thiết kế để số hóa và tối ưu hóa các hoạt động quản lý của câu lạc bộ sinh viên. Dự án cung cấp một website công khai để quảng bá hình ảnh và một hệ thống quản lý nội bộ mạnh mẽ cho ban chủ nhiệm và thành viên.

## Các tính năng chính

Hệ thống được xây dựng theo kiến trúc module hóa, bao gồm các chức năng cốt lõi:

- **Quản lý Người dùng & Phân quyền**: Đăng ký/đăng nhập (Email, Google), quản lý hồ sơ, phân quyền linh hoạt theo vai trò (Guest, Member, Board, Admin).
- **Quản lý Nội dung**: Tạo, chỉnh sửa, xóa bài viết với trình soạn thảo WYSIWYG, phân loại theo chủ đề, hệ thống bình luận đa cấp.
- **Cộng đồng Hỏi-Đáp (Q&A)**: Nền tảng hỏi đáp tương tự Stack Overflow với hệ thống vote, đánh dấu câu trả lời tốt nhất và điểm danh tiếng (reputation).
- **Quản lý Tài liệu**: Thư viện tài liệu số cho phép tải lên, phân loại, phân quyền truy cập và xem trước trực tuyến.
- **Quản lý Sự kiện**: Tạo và quản lý sự kiện, cho phép thành viên đăng ký tham gia và hỗ trợ điểm danh (check-in).
- **Quản lý Tài chính**: Theo dõi các khoản thu-chi minh bạch, quản lý chứng từ và tạo báo cáo tài chính trực quan.

## Công nghệ sử dụng

| Phần     | Công nghệ                                               |
| -------- | ------------------------------------------------------- |
| Frontend | Next.js (React), shadcn/ui, Redux Toolkit, React Router |
| Backend  | Node.js, Express.js, MySQL, Prisma, JWT, Google OAuth   |

## Hướng dẫn cài đặt và chạy dự án

Làm theo các bước dưới đây để chạy dự án trên máy cục bộ của bạn, sử dụng hệ điều hành Windows.

### 1. Yêu cầu hệ thống

Hãy chắc chắn rằng bạn đã cài đặt các phần mềm sau:

- Node.js (phiên bản v18.x trở lên)
- npm hoặc yarn
- Git
- MySQL

### 2. Cài đặt

#### Bước 1: Clone repository

Mở Command Prompt hoặc PowerShell và chạy các lệnh sau:

```bash
git clone https://github.com/beeit-club/Main-Website.git
```

#### Bước 2: Cài đặt Backend (API Server)

Chạy các lệnh sau từ thư mục gốc của dự án:

```bash
:: Di chuyển vào thư mục backend
cd backend

:: Cài đặt các thư viện
npm install

:: Sao chép file cấu hình môi trường
copy .env.example .env
```

Mở file `.env` trong thư mục `backend` bằng trình soạn thảo văn bản (như Notepad) và cập nhật thông tin kết nối database của bạn. Ví dụ:

```
DATABASE_URL="mysql://root:mysecretpassword@localhost:3306/club_db"
JWT_SECRET="your-strong-jwt-secret"
PORT=8080
```

Tiếp tục với các lệnh sau:

```bash
:: Chạy database migration để tạo các bảng cần thiết
npx prisma migrate dev

:: Khởi động server backend ở chế độ development
npm run dev
```

Server backend sẽ chạy tại `http://localhost:8080`.

#### Bước 3: Cài đặt Frontend (Web App)

Mở một Command Prompt hoặc PowerShell mới và chạy các lệnh sau từ thư mục gốc của dự án:

```bash
:: Di chuyển vào thư mục frontend
cd frontend

:: Cài đặt các thư viện
npm install

:: Sao chép file cấu hình môi trường
copy .env.example .env.local
```

Mở file `.env.local` trong thư mục `frontend` bằng trình soạn thảo văn bản và trỏ đến địa chỉ API của backend. Ví dụ:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Khởi động ứng dụng frontend ở chế độ development:

```bash
npm run dev
```

Ứng dụng Frontend sẽ chạy tại `http://localhost:3000`.

### 3. Sử dụng

Bây giờ bạn có thể mở trình duyệt và truy cập `http://localhost:3000` để bắt đầu sử dụng hệ thống.
