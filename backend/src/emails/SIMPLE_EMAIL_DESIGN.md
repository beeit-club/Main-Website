# THIẾT KẾ EMAIL TỐI GIẢN (CONTENT-FOCUSED)

Tài liệu này mô tả cấu trúc hệ thống email tập trung vào nội dung, loại bỏ CSS phức tạp, đảm bảo hiển thị rõ ràng và tốc độ tải nhanh nhất.

---

## 1. Cấu Trúc Module (3 Phần)

Thay vì layout HTML phức tạp, chúng ta sử dụng cấu trúc xếp chồng đơn giản:

```text
+--------------------------------------------------+
|  HEADER (Cố định)                                |
|  [BEE IT CLUB] - TIÊU ĐỀ EMAIL                   |
+--------------------------------------------------+
|                                                  |
|  BODY (Thay đổi theo từng loại email)            |
|                                                  |
|  Xin chào {{fullname}},                          |
|                                                  |
|  Nội dung chính được trình bày rõ ràng ở đây.    |
|  Các thông tin quan trọng được in đậm.           |
|                                                  |
+--------------------------------------------------+
|  FOOTER (Cố định)                                |
|  ---------------------------------------------   |
|  BQL Bee IT Club - contact@beeit.club            |
+--------------------------------------------------+
```

### 1.1. Header Partial
Đơn giản là một tiêu đề H2 hoặc H3 để người dùng biết email đến từ đâu.
```html
<div style="margin-bottom: 20px;">
    <h3>[BEE IT CLUB] - {{title}}</h3>
</div>
```

### 1.2. Footer Partial
Sử dụng thẻ `<hr>` để tạo vạch ngăn cách tự nhiên.
```html
<div style="margin-top: 30px; font-size: 12px; color: #666;">
    <hr style="border: 0; border-top: 1px solid #eee;" />
    <p>Ban Quản Lý Bee IT Club | Email tự động, vui lòng không trả lời.</p>
</div>
```

### 1.3. Body Content
Sử dụng các thẻ HTML cơ bản nhất:
*   `<p>`: Đoạn văn.
*   `<b>` hoặc `<strong>`: In đậm thông tin quan trọng (Mã OTP, Ngày giờ).
*   `<ul>`/`<li>`: Gạch đầu dòng cho danh sách.
*   `<br>`: Xuống dòng.
*   `<a>`: Link liên kết.

---

## 2. Phân Loại Email & Cách Quản Lý

### Nhóm 1: Email Cố Định (System Emails)
Là các email gắn liền với logic code.
*   **Ví dụ**: Login OTP, Quên mật khẩu, Xác nhận email.
*   **Đặc điểm**:
    *   Biến số (Variables) là CỐ ĐỊNH (Dev quy định). Ví dụ OTP luôn cần biến `{{otp}}`.
    *   Ít khi thay đổi nội dung.
*   **Cách tạo mới**:
    1.  Dev thêm slug vào Code.
    2.  Insert mẫu vào DB 1 lần.

### Nhóm 2: Email Động (Campaign/Notification Emails)
Là các email phục vụ vận hành, tin tức.
*   **Ví dụ**: Thông báo Workshop, Nhắc lịch phỏng vấn, Chúc mừng sinh nhật.
*   **Đặc điểm**:
    *   Biến số LINH HOẠT. Admin có thể tự thêm `{{dia_diem}}`, `{{qua_tang}}` tùy ý.
    *   Nội dung thay đổi thường xuyên.
*   **Cách tạo mới**:
    1.  Admin vào trang quản trị.
    2.  Tạo Template mới -> Đặt tên biến trong nội dung (VD: `{{link_zoom}}`).
    3.  Khi gửi, nhập giá trị cho các biến đó.

---

## 3. Quy Trình Tạo & Truyền Biến (Ví dụ thực tế)

Giả sử bạn muốn tạo một email **"Thông báo hủy lịch phỏng vấn"**.

### Bước 1: Thiết kế Nội dung (Body)
Admin soạn thảo (hoặc Dev insert vào DB):
```html
<p>Chào <b>{{fullname}}</b>,</p>
<p>Rất tiếc, lịch phỏng vấn ngày <b>{{date}}</b> của bạn đã bị hủy do: {{reason}}.</p>
<p>Chúng tôi sẽ liên hệ lại sau để sắp xếp lịch mới.</p>
```

### Bước 2: Cấu hình Header (Tự động)
Hệ thống sẽ tự ghép Header vào:
`[BEE IT CLUB] - Thông báo hủy lịch`

### Bước 3: Truyền Dữ liệu (Code)
Khi gọi hàm gửi:
```javascript
emailService.sendDynamicEmail('cancel-interview', 'user@gmail.com', {
    fullname: 'Nguyễn Văn A',
    date: '20/01/2026',
    reason: 'Mentor bận đột xuất'
});
```

### Bước 4: Kết quả User nhận được
> **[BEE IT CLUB] - Thông báo hủy lịch**
>
> Chào **Nguyễn Văn A**,
>
> Rất tiếc, lịch phỏng vấn ngày **20/01/2026** của bạn đã bị hủy do: Mentor bận đột xuất.
>
> Chúng tôi sẽ liên hệ lại sau để sắp xếp lịch mới.
>
> ---------------------------------------------
> Ban Quản Lý Bee IT Club | Email tự động...

---

## 4. Kế Hoạch Triển Khai (Action Plan)

Để chuyển đổi sang giao diện tối giản này, tôi sẽ thực hiện:

1.  **Cập nhật Database**:
    *   Xóa nội dung HTML cũ (đầy màu sắc).
    *   Thay bằng nội dung HTML tối giản (chỉ thẻ p, b, ul).
2.  **Cập nhật `templateRenderer`**:
    *   Viết lại hàm render để ghép chuỗi đơn giản: `Header + Body + Footer`.
    *   Không dùng wrapper HTML phức tạp nữa.

Bạn có muốn tôi tiến hành cập nhật lại Database với các mẫu tối giản này ngay không?
