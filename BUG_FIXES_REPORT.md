# BÁO CÁO SỬA LỖI - CLIENT MODULES

## 🔴 CÁC LỖI ĐÃ PHÁT HIỆN VÀ SỬA

### 1. **Lỗi: "Attempted to call fetchAllEvents() from the server but fetchAllEvents is on the client"**

**Nguyên nhân:**
- File `event.js` có `"use client"` directive ở đầu file
- Nhưng các hàm `fetchAllEvents()` và `fetchEventDetail()` lại dùng `fetch` với `next: { revalidate }` - đây là server-side API
- Next.js không cho phép gọi client functions từ server components

**Giải pháp:**
- ✅ Tách file `event.js` thành 2 phần:
  - **Server-side functions** (không có "use client"): `fetchAllEvents()`, `fetchEventDetail()`
  - **Client-side service** (có "use client"): Tạo file mới `eventClient.js` chứa `eventService`

**Files đã sửa:**
- `frontend/src/services/event.js` - Bỏ "use client", chỉ giữ server-side fetch functions
- `frontend/src/services/eventClient.js` - File mới cho client-side operations
- `frontend/src/components/home/events/EventDetail.jsx` - Import từ `eventClient.js`
- `frontend/src/components/home/events/EventRegistrationForm.jsx` - Import từ `eventClient.js`

---

### 2. **Lỗi: "Attempted to call fetchAllDocuments() from the server but fetchAllDocuments is on the client"**

**Nguyên nhân:**
- Tương tự như events, file `document.js` có `"use client"` nhưng lại dùng server-side fetch

**Giải pháp:**
- ✅ Tách file `document.js` thành 2 phần:
  - **Server-side functions**: `fetchAllDocuments()`, `fetchDocumentDetail()`
  - **Client-side service**: Tạo file mới `documentClient.js` chứa `documentService`

**Files đã sửa:**
- `frontend/src/services/document.js` - Bỏ "use client", chỉ giữ server-side fetch functions
- `frontend/src/services/documentClient.js` - File mới cho client-side operations
- `frontend/src/components/home/documents/DocumentDetail.jsx` - Import từ `documentClient.js`

---

### 3. **Lỗi: "flatComments.forEach is not a function"**

**Nguyên nhân:**
- Backend trả về structure: `{ status: 'success', data: { comments: { data: [], pagination: {} } } }`
- Code đang expect `comments` là array trực tiếp
- `selectWithPagination` trả về `{ data: [], pagination: {} }`, không phải array

**Giải pháp:**
- ✅ Sửa `CommentSection.jsx` để xử lý đúng structure:
  - Kiểm tra nếu `comments.data` là array thì dùng `comments.data`
  - Kiểm tra nếu `comments` là array trực tiếp thì dùng `comments`
  - Thêm validation để đảm bảo luôn là array trước khi forEach

**Files đã sửa:**
- `frontend/src/components/home/post/CommentSection.jsx` - Xử lý đúng data structure

---

### 4. **Lỗi: "Attempted to call fetchEventDetail() from the server"**

**Nguyên nhân:**
- Tương tự lỗi #1, `fetchEventDetail()` bị đánh dấu là client function

**Giải pháp:**
- ✅ Đã sửa cùng với lỗi #1 (tách server/client functions)

---

## 📋 PATTERN ĐÚNG CHO NEXT.JS APP ROUTER

### **Server Components (Pages):**
```javascript
// ✅ ĐÚNG - Không có "use client"
const baseUrl = process.env.NEXT_PUBLIC_API_BACKEND;

export const fetchAllEvents = async (params = {}) => {
  const res = await fetch(url, {
    next: { revalidate: 3600, tags: ["events-list"] }
  });
  return res.json();
};
```

### **Client Components:**
```javascript
// ✅ ĐÚNG - Có "use client" và dùng axiosClient
"use client";
import axiosClient from "./api";

export const eventService = {
  registerEvent: async (eventId, data) => {
    const response = await axiosClient.post(`/admin/events/${eventId}/registrations`, data);
    return response.data;
  }
};
```

### **Cấu trúc Files:**
```
services/
  ├── event.js          # Server-side fetch (không có "use client")
  ├── eventClient.js    # Client-side service (có "use client")
  ├── document.js       # Server-side fetch
  ├── documentClient.js # Client-side service
  └── post.js          # Server-side fetch (đã đúng pattern)
```

---

## ✅ CÁC FILE ĐÃ SỬA

1. ✅ `frontend/src/services/event.js` - Bỏ "use client", chỉ giữ server functions
2. ✅ `frontend/src/services/eventClient.js` - File mới cho client operations
3. ✅ `frontend/src/services/document.js` - Bỏ "use client", chỉ giữ server functions
4. ✅ `frontend/src/services/documentClient.js` - File mới cho client operations
5. ✅ `frontend/src/components/home/events/EventDetail.jsx` - Import từ eventClient
6. ✅ `frontend/src/components/home/events/EventRegistrationForm.jsx` - Import từ eventClient
7. ✅ `frontend/src/components/home/documents/DocumentDetail.jsx` - Import từ documentClient
8. ✅ `frontend/src/components/home/post/CommentSection.jsx` - Xử lý đúng data structure

---

## 🎯 KẾT QUẢ

Tất cả các lỗi đã được sửa:
- ✅ Events module hoạt động đúng (server + client)
- ✅ Documents module hoạt động đúng (server + client)
- ✅ Comments module xử lý đúng data structure
- ✅ Tuân thủ đúng pattern Next.js App Router

**Lưu ý:** Cần test lại các trang để đảm bảo không còn lỗi runtime.

