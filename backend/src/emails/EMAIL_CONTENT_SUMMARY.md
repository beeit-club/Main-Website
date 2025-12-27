# 📧 Tóm Tắt Nội Dung Các Email Templates

## 1. 🔐 Login OTP (`loginOTP.hbs`)

**Mục đích**: Gửi mã OTP đăng nhập

**Nội dung chính**:

- Header: "🔐 Mã OTP đăng nhập" (gradient tím)
- Hiển thị mã OTP 6 chữ số trong box nổi bật
- Cảnh báo bảo mật: không chia sẻ OTP, chỉ có hiệu lực trong thời gian ngắn
- Footer: "Ban Quản Lý CLB"

**Variables**: `otp`

---

## 2. ✅ Application Received (`applicationReceived.hbs`)

**Mục đích**: Xác nhận đã nhận đơn đăng ký

**Nội dung chính**:

- Header: "Xác nhận nộp đơn thành công" (gradient tím)
- Chào mừng và cảm ơn
- Thông tin đơn đăng ký: Họ tên, Email, Mã sinh viên (nếu có), Trạng thái: "Đang chờ xử lý"
- Thông báo sẽ xem xét và thông báo kết quả qua email

**Variables**: `fullname`, `email`, `student_id` (optional)

---

## 3. 📅 Interview Scheduled (`interviewScheduled.hbs`)

**Mục đích**: Thông báo lịch phỏng vấn

**Nội dung chính**:

- Header: "Thông báo lịch phỏng vấn" (gradient tím)
- Thông báo đơn đã được duyệt và mời phỏng vấn
- Thông tin lịch phỏng vấn:
  - Tiêu đề
  - Ngày phỏng vấn (format tiếng Việt)
  - Thời gian: start_time - end_time
  - Địa điểm/Link (nếu có)
  - Ghi chú (nếu có)
- Lưu ý: có mặt đúng giờ, chuẩn bị giấy tờ, liên hệ nếu có thay đổi

**Variables**: `fullname`, `schedule_title`, `interview_date`, `start_time`, `end_time`, `location` (optional), `description` (optional)

---

## 4. 🎉 Application Approved (`applicationApproved.hbs`)

**Mục đích**: Chúc mừng phê duyệt đơn

**Nội dung chính**:

- Header: "🎉 Chúc mừng! Đơn đăng ký của bạn đã được phê duyệt" (gradient xanh lá)
- Thông báo đơn đã được phê duyệt
- Box xanh: "Bạn đã chính thức trở thành thành viên của CLB!"
- Ghi chú từ buổi phỏng vấn (nếu có)
- Bước tiếp theo:
  - Đăng nhập bằng email
  - Hoàn thiện hồ sơ
  - Tham gia hoạt động
  - Theo dõi thông báo

**Variables**: `fullname`, `email`, `interview_notes` (optional)

---

## 5. ❌ Application Rejected (`applicationRejected.hbs`)

**Mục đích**: Thông báo từ chối đơn

**Nội dung chính**:

- Header: "Thông báo về đơn đăng ký" (gradient hồng)
- Thông báo đơn không được chấp nhận
- Ghi chú/Lý do từ chối (nếu có)
- Lời khuyên: có thể nộp đơn lại vào đợt tiếp theo
- Cảm ơn và chúc thành công

**Variables**: `fullname`, `interview_notes` (optional)

---

## 6. ✅ Event Registration Confirmed (`eventRegistrationConfirmed.hbs`)

**Mục đích**: Xác nhận đăng ký sự kiện

**Nội dung chính**:

- Header: "✅ Đăng ký thành công - Xác nhận tham gia sự kiện" (gradient tím)
- Cảm ơn đã đăng ký
- Thông tin sự kiện:
  - Tên sự kiện
  - Thời gian bắt đầu/kết thúc
  - Địa điểm (nếu có)
  - Hạn đăng ký (nếu có)
- Ghi chú của người đăng ký (nếu có)
- Lưu ý: có mặt đúng giờ, mang email xác nhận

**Variables**: `fullname` (optional), `event_title`, `start_time`, `end_time`, `location` (optional), `registration_deadline` (optional), `notes` (optional)

---

## 7. ⏰ Event Reminder (`eventReminder.hbs`)

**Mục đích**: Nhắc nhở trước sự kiện

**Nội dung chính**:

- Header: "⏰ Nhắc nhở sự kiện - Sự kiện của bạn sắp diễn ra" (gradient hồng)
- Nhắc nhở về sự kiện đã đăng ký
- Thông tin sự kiện: Tên, Thời gian, Địa điểm
- Hiển thị "Còn lại: X giờ/ngày" (nếu có)
- Lưu ý quan trọng: có mặt đúng giờ, mang email xác nhận, thông báo nếu không thể tham gia

**Variables**: `fullname` (optional), `event_title`, `start_time`, `end_time`, `location` (optional), `time_until` (optional)

---

## 8. ✅ Event Check-in Confirmation (`eventCheckInConfirmation.hbs`)

**Mục đích**: Xác nhận đã điểm danh

**Nội dung chính**:

- Header: "✅ Đã điểm danh - Xác nhận tham gia sự kiện" (gradient xanh lá)
- Cảm ơn đã tham gia
- Thông tin điểm danh:
  - Tên sự kiện
  - Thời gian điểm danh
  - Địa điểm (nếu có)
- Ghi chú (nếu có)
- Lưu ý: Email này là bằng chứng xác nhận tham gia

**Variables**: `fullname` (optional), `event_title`, `check_in_time`, `location` (optional), `notes` (optional)

---

## 9. 🚫 Event Cancellation (`eventCancellation.hbs`)

**Mục đích**: Thông báo hủy/thay đổi sự kiện

**Nội dung chính**:

- Header: "🚫 Sự kiện đã bị hủy" hoặc "⚠️ Thông báo thay đổi sự kiện" (gradient hồng)
- Thông báo hủy hoặc thay đổi
- Thông tin sự kiện:
  - Tên sự kiện
  - Thời gian cũ (gạch ngang) → Thời gian mới (nếu thay đổi)
  - Địa điểm cũ (gạch ngang) → Địa điểm mới (nếu thay đổi)
- Lý do (nếu có)
- Nếu hủy: Thông tin về hoàn tiền
- Nếu thay đổi: Lưu ý cập nhật lịch trình

**Variables**: `fullname` (optional), `event_title`, `is_cancelled`, `original_start_time` (optional), `new_start_time` (optional), `start_time` (optional), `original_location` (optional), `new_location` (optional), `location` (optional), `reason` (optional)

---

## 10. 📄 Document Access Granted (`documentAccessGranted.hbs`)

**Mục đích**: Thông báo cấp quyền tài liệu

**Nội dung chính**:

- Header: "📄 Quyền truy cập đã được cấp - Bạn có thể truy cập tài liệu mới" (gradient tím)
- Thông báo đã được cấp quyền
- Thông tin tài liệu:
  - Tên tài liệu
  - Danh mục (nếu có)
  - Mô tả (nếu có)
- Bước tiếp theo: Đăng nhập → Tài liệu → Tải xuống
- Lưu ý: Không chia sẻ tài liệu, quyền riêng cho bạn

**Variables**: `fullname`, `document_title`, `document_category` (optional), `document_description` (optional)

---

## 11. 🔐 Password Reset (`passwordReset.hbs`)

**Mục đích**: Đặt lại mật khẩu

**Nội dung chính**:

- Header: "🔐 Đặt lại mật khẩu" (gradient tím)
- Thông báo yêu cầu reset password
- Mã OTP 6 chữ số trong box nổi bật
- Link reset password (nếu có) - button "Đặt lại mật khẩu"
- Cảnh báo bảo mật:
  - OTP có hiệu lực trong X phút
  - Không chia sẻ OTP/link
  - Thay đổi mật khẩu sau khi reset

**Variables**: `fullname` (optional), `reset_code`, `reset_link` (optional), `expires_in` (default: 15)

---

## 12. 🎉 Welcome (`welcome.hbs`)

**Mục đích**: Chào mừng thành viên mới

**Nội dung chính**:

- Header: "🎉 Chào mừng! - Chào mừng bạn đến với CLB" (gradient xanh lá)
- Chào mừng trở thành thành viên chính thức
- Box xanh: "Tài khoản của bạn đã được tạo thành công!"
- Email đăng nhập
- Bắt đầu ngay:
  - Đăng nhập và khám phá
  - Hoàn thiện hồ sơ
  - Tham gia hoạt động
  - Kết nối với thành viên
  - Theo dõi thông báo
- Mẹo: Kiểm tra email thường xuyên

**Variables**: `fullname`, `email`

---

## 13. ⏰ Reminder (`reminder.hbs`)

**Mục đích**: Nhắc nhở đóng phí

**Nội dung chính**:

- Header: "⏰ Nhắc nhở hạn đóng phí" (gradient hồng)
- Nhắc nhở về hạn đóng phí sắp tới
- Thông tin đóng phí:
  - Hạn đóng phí (highlight màu đỏ)
  - Số tiền (nếu có)
  - Còn lại: X ngày (nếu có)
- Lưu ý quan trọng: Hoàn thành trước hạn, bỏ qua nếu đã đóng
- Cách thức đóng phí: Đăng nhập → Tài chính → Thanh toán

**Variables**: `name`, `deadline`, `amount` (optional), `days_remaining` (optional)

---

## 🎨 Thiết Kế Chung

Tất cả email đều có:

- **Responsive design**: Tương thích mobile
- **Header gradient**: Màu sắc khác nhau theo loại email
- **Box thông tin**: Màu sắc phù hợp (xanh = thành công, vàng = cảnh báo, đỏ = hủy)
- **Footer**: "Ban Quản Lý CLB" + "Email tự động, không trả lời"
- **Inline CSS**: Tương thích với nhiều email client
- **Tiếng Việt**: Tất cả nội dung bằng tiếng Việt

---

## 📊 Thống Kê

- **Tổng số email**: 13 templates
- **Email tự động**: 10/13
- **Email cần cron job**: 2/13 (Event Reminder, Payment Reminder)
- **Email có OTP**: 2 (Login OTP, Password Reset)
- **Email có link**: 1 (Password Reset - optional)
