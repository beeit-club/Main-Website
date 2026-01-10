# PHÂN TÍCH & THIẾT KẾ CẤU TRÚC EMAIL MODULAR

Tài liệu này phân tích kiến trúc hệ thống email chia nhỏ (Modular Architecture) để dễ dàng quản lý, bảo trì và mở rộng.

---

## 1. Vấn Đề Hiện Tại (Monolithic)

Hiện tại, mỗi template trong Database đang lưu trữ toàn bộ mã HTML:
```html
<!-- Template: login-otp -->
<html>
  <head>...style...</head>
  <body>
    <header>Logo, Gradient Tím...</header>
    <content>Mã OTP là {{otp}}</content>
    <footer>Copyright BeeIT...</footer>
  </body>
</html>
```

**Nhược điểm:**
1.  **Trùng lặp code**: Footer và CSS Style lặp lại 13 lần.
2.  **Khó bảo trì**: Muốn sửa số hotline dưới Footer, phải sửa 13 dòng trong Database.
3.  **Khó nhất quán**: Có thể lỡ tay làm Header email này to hơn email kia một chút.

---

## 2. Giải Pháp Thiết Kế: Master Layout System

Chúng ta sẽ áp dụng mô hình **Layout - Partial - View** (thường thấy trong MVC).

### Cấu trúc đề xuất

Một email hoàn chỉnh sẽ được ghép từ 3 phần:

```text
[ MASTER LAYOUT (Khung xương) ]
      |
      +--- [ PARTIAL: HEADER ] (Logo, Màu sắc chủ đạo)
      |
      +--- [ VIEW: BODY CONTENT ] (Nội dung riêng của từng email)
      |
      +--- [ PARTIAL: FOOTER ] (Thông tin liên hệ, Copyright)
```

### 2.1. Master Layout (`layout_main`)
Chứa các thẻ HTML chuẩn, CSS Reset, và Responsive Style chung.
```html
<!DOCTYPE html>
<html>
<head>
    <!-- Meta tags, Font, CSS Reset -->
    <style>...CSS dùng chung...</style>
</head>
<body style="background-color: #f4f4f4;">
    <table class="container">
        <!-- Header Placeholder -->
        {{> header }}
        
        <!-- Body Placeholder (Nội dung thay đổi) -->
        {{{ body }}}
        
        <!-- Footer Placeholder -->
        {{> footer }}
    </table>
</body>
</html>
```

### 2.2. Header Partial (`partial_header`)
Header cần linh hoạt màu sắc (Ví dụ: OTP màu tím, Thành công màu xanh, Cảnh báo màu vàng). Ta sẽ truyền biến `theme_color` vào.

```html
<tr>
    <td style="background: {{theme_gradient}}; padding: 30px; text-align: center;">
        <h1 style="color: white;">{{title}}</h1>
        {{#if subtitle}}
            <p style="color: white;">{{subtitle}}</p>
        {{/if}}
    </td>
</tr>
```

### 2.3. Footer Partial (`partial_footer`)
Chứa thông tin cố định.
```html
<tr>
    <td style="text-align: center; color: #666;">
        <p>Ban Quản Lý Bee IT Club</p>
        <p>Liên hệ: contact@beeit.club | TP.HCM</p>
        <p>© 2026 Bee IT Club. All rights reserved.</p>
    </td>
</tr>
```

### 2.4. Body Content (Các Template hiện tại)
Lúc này, trong bảng `email_templates`, ta chỉ cần lưu phần ruột:
```html
<!-- Template: login-otp (chỉ còn lại phần này) -->
<div class="content-padding">
    <p>Xin chào {{fullname}},</p>
    <div class="otp-box">{{otp}}</div>
    <p>Vui lòng không chia sẻ mã này.</p>
</div>
```

---

## 3. Phân Loại Email (System vs Dynamic)

Dù cấu trúc kỹ thuật giống nhau (đều dùng Layout), nhưng về mặt quản lý cần chia rõ:

| Đặc điểm | **1. Email Cố Định (System/Transactional)** | **2. Email Động (Marketing/Campaign)** |
| :--- | :--- | :--- |
| **Mục đích** | Vận hành hệ thống (OTP, Đổi pass, Thông báo) | Tin tức, Sự kiện, Khuyến mãi |
| **Người tạo** | Developer (Code) | Admin / Marketing Team |
| **Slug** | Cố định (VD: `login-otp`, `welcome`) | Tùy ý (VD: `newsletter-jan-2026`) |
| **Biến (Data)** | Bắt buộc đúng cấu trúc code gọi (VD: cần `otp`) | Linh hoạt, Admin tự định nghĩa biến |
| **Header** | Thường fix màu theo loại (Lỗi=Đỏ, Info=Xanh) | Có thể tùy biến hình ảnh/banner |

---

## 4. Cách Truyền Biến (Variable Flow)

Đây là cách một biến (ví dụ `{{otp}}`) đi từ Code vào Email:

**Bước 1: Code gọi Service**
```javascript
emailService.sendDynamicEmail('login-otp', 'user@gmail.com', {
    fullname: 'Hikari',
    otp: '123456'
});
```

**Bước 2: Service lấy Template & Config**
Hệ thống sẽ lấy template `login-otp`. Template này có config riêng (Metadata):
*   `title`: "Mã xác thực" (Dùng cho Header)
*   `theme_gradient`: "linear-gradient(to right, #667eea, #764ba2)" (Màu tím cho Header)

**Bước 3: Merge Variables**
Tổng hợp các biến để render:
```javascript
const finalVariables = {
    // Biến từ Code
    fullname: 'Hikari',
    otp: '123456',
    
    // Biến cấu hình giao diện (tự động inject)
    theme_gradient: 'linear-gradient(...)',
    title: 'Mã xác thực',
    
    // Biến toàn cục (Global)
    company_name: 'Bee IT Club',
    current_year: 2026
};
```

**Bước 4: Render (Handlebars)**
1.  Render `partial_header` với `theme_gradient`, `title`.
2.  Render `body` (template `login-otp`) với `otp`, `fullname`.
3.  Render `partial_footer` với `company_name`.
4.  Ghép tất cả vào `layout_main`.

---

## 5. Quy Trình Tạo Một Email Mới

### Trường hợp 1: Tạo Email Marketing mới (VD: Thông báo Workshop)
1.  **Admin Dashboard**: Chọn "Tạo Email Mới".
2.  **Chọn Layout**: Mặc định là `Master Layout`.
3.  **Cấu hình Header**:
    *   Nhập Title: "Workshop AI 2026"
    *   Chọn màu Header: Gradient Cam (Sự kiện).
4.  **Soạn Body**: Dùng Editor soạn nội dung: "Chào {{fullname}}, mời bạn tham gia..."
5.  **Khai báo biến**: Admin định nghĩa là email này cần biến `fullname`.

### Trường hợp 2: Thêm Email Hệ thống mới (VD: Thông báo đổi email thành công)
1.  **Database**: Insert row mới vào `email_templates`.
    *   Slug: `email-change-success`
    *   Body: `<p>Bạn đã đổi email thành công...</p>`
2.  **Code (Backend)**:
    *   Thêm hàm `sendEmailChangeSuccess(user)` trong `emailService.js`.
    *   Gọi `sendDynamicEmail('email-change-success', ...)`

---

## 6. Kế Hoạch Cải Tiến Database

Để hỗ trợ mô hình này, ta cần điều chỉnh Database một chút:

1.  **Thêm cột `type` vào bảng `email_templates`**:
    *   `layout`: Chứa Master Layout HTML.
    *   `partial`: Chứa Header/Footer HTML.
    *   `template`: Chứa Body HTML (như hiện tại).
    
2.  **Thêm cột `metadata` (JSON)**:
    *   Lưu cấu hình màu sắc header, tiêu đề mặc định cho từng template.
    
Ví dụ dữ liệu bảng `email_templates` sau khi sửa:

| ID | Slug | Type | Name | HTML Content | Metadata (JSON) |
|:---|:---|:---|:---|:---|:---|
| 1 | `master-layout` | `layout` | Layout Chính | `<html>...{{>header}} {{{body}}} {{>footer}}...</html>` | |
| 2 | `header-default` | `partial` | Header Chuẩn | `<div>...{{title}}...</div>` | |
| 3 | `footer-default` | `partial` | Footer Chuẩn | `<div>...Copyright...</div>` | |
| 4 | `login-otp` | `template` | OTP Login | `<p>Mã là {{otp}}</p>` | `{ "header_color": "purple", "title": "OTP" }` |

---

## 7. Kết Luận

Việc chuyển sang cấu trúc này giúp bạn:
1.  **Footer cố định**: Sửa 1 nơi, cập nhật 100 email.
2.  **Header linh hoạt**: Tái sử dụng code header nhưng vẫn đổi được màu sắc/tiêu đề theo từng loại email.
3.  **Body gọn nhẹ**: Chỉ tập trung vào nội dung chính.

Bạn có đồng ý triển khai theo mô hình Layout/Partial này không?
