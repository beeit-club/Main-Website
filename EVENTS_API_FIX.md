# SỬA LỖI 401 - EVENTS API

## 🔴 Vấn đề
- API `/admin/events` yêu cầu authentication (có middleware `verifyToken`)
- Server-side fetch không thể gửi JWT token
- Lỗi 401 Unauthorized khi fetch events từ server components

## ✅ Giải pháp
Tạo **Client API routes (public)** cho events, tương tự như posts, questions.

---

## 📝 CÁC THAY ĐỔI

### 1. **Backend - Service Layer**
**File:** `backend/src/services/client/home.service.js`

Thêm 2 methods mới:
- `getAllEvents()` - Lấy danh sách events (chỉ published và public)
- `getEventBySlug()` - Lấy chi tiết event theo slug

```javascript
// === EVENTS (PUBLIC) ===
getAllEvents: async (options) => {
  // Chỉ lấy events published (status = 1) và public
  const events = await eventModel.getAllEvents({
    ...options,
    status: options.status || 1,
    is_public: '1',
  });
  return events;
},

getEventBySlug: async (slug) => {
  // Lấy event by slug, chỉ lấy published và public
  const eventId = await eventModel.getEventBySlug(slug);
  if (!eventId || !eventId.id) {
    throw new ServiceError('Sự kiện không tồn tại', ...);
  }
  const fullEvent = await eventModel.getEventById(eventId.id, true);
  if (!fullEvent || fullEvent.status !== 1 || fullEvent.is_public !== 1) {
    throw new ServiceError('Sự kiện không tồn tại', ...);
  }
  return fullEvent;
},
```

---

### 2. **Backend - Controller Layer**
**File:** `backend/src/controllers/client/home.controller.js`

Thêm 2 controllers mới:
- `getAllEvents()` - Controller cho GET `/client/events`
- `getEventBySlug()` - Controller cho GET `/client/events/:slug`

```javascript
// === EVENTS (PUBLIC) ===
getAllEvents: asyncWrapper(async (req, res) => {
  const query = PaginationSchema.cast(req.query);
  const valid = await PaginationSchema.validate(query, {
    stripUnknown: true,
  });
  const { upcoming, past, status } = req.query;

  const events = await HomeService.getAllEvents({
    ...valid,
    upcoming: upcoming === 'true',
    past: past === 'true',
    status: status || 1,
  });
  utils.success(res, 'Lấy danh sách sự kiện thành công', events);
}),

getEventBySlug: asyncWrapper(async (req, res) => {
  const { slug } = req.params;
  const event = await HomeService.getEventBySlug(slug);
  utils.success(res, 'Lấy chi tiết sự kiện thành công', { event });
}),
```

---

### 3. **Backend - Router Layer**
**File:** `backend/src/routers/client/home.router.js`

Thêm 2 routes mới (PUBLIC - không cần authentication):
```javascript
// Routes cho Events (PUBLIC - không cần đăng nhập)
Router.get('/events', HomeControler.getAllEvents); // Client xem danh sách sự kiện
Router.get('/events/:slug', HomeControler.getEventBySlug); // Client xem chi tiết sự kiện theo slug
```

---

### 4. **Backend - Model Layer**
**File:** `backend/src/models/admin/event.model.js`

Sửa xử lý `is_public` để hỗ trợ cả string và number:
```javascript
if (options.is_public !== undefined) {
  sql += ` AND is_public = ?`;
  const isPublicValue = options.is_public === 'true' || options.is_public === '1' || options.is_public === 1 ? 1 : 0;
  params.push(isPublicValue);
}
```

---

### 5. **Frontend - Service Layer**
**File:** `frontend/src/services/event.js`

Thay đổi URL từ `/admin/events` → `/client/events`:
```javascript
// Trước: const url = `${baseUrl}/admin/events${query ? `?${query}` : ""}`;
// Sau:
const url = `${baseUrl}/client/events${query ? `?${query}` : ""}`;

// fetchEventDetail: Đổi từ ID → slug
export const fetchEventDetail = async (slug) => {
  const url = `${baseUrl}/client/events/${slug}`;
  // ...
};
```

---

### 6. **Frontend - Pages**
**File:** `frontend/src/app/(client)/events/[id]/page.jsx`

- Đổi từ `id` → `slug` trong params
- Sửa response structure: `eventsResponse.data?.data` thay vì `eventsResponse.data?.events`

**File:** `frontend/src/app/(client)/events/page.jsx`

- Sửa response structure: `eventsResponse.data?.data` thay vì `eventsResponse.data?.events`

---

### 7. **Frontend - Components**
**File:** `frontend/src/components/home/events/EventCard.jsx`

- Đổi link từ `/events/${id}` → `/events/${slug}`

---

## 🎯 KẾT QUẢ

✅ **Backend:**
- `/client/events` - GET danh sách events (public, không cần auth)
- `/client/events/:slug` - GET chi tiết event theo slug (public, không cần auth)

✅ **Frontend:**
- Server-side fetch hoạt động đúng (không còn lỗi 401)
- Dùng slug thay vì ID cho URLs
- Response structure được xử lý đúng

---

## 📋 API ENDPOINTS MỚI

### GET `/api/client/events`
**Query params:**
- `page` - Số trang (default: 1)
- `limit` - Số items mỗi trang (default: 10)
- `status` - Trạng thái (default: 1 - published)
- `upcoming` - Lọc events sắp diễn ra (true/false)
- `past` - Lọc events đã kết thúc (true/false)

**Response:**
```json
{
  "status": "success",
  "data": {
    "data": [...events],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

### GET `/api/client/events/:slug`
**Response:**
```json
{
  "status": "success",
  "data": {
    "event": {
      "id": 1,
      "title": "...",
      "slug": "...",
      ...
    }
  }
}
```

---

## ⚠️ LƯU Ý

1. **Chỉ lấy published events:** `status = 1`
2. **Chỉ lấy public events:** `is_public = 1`
3. **Dùng slug thay vì ID** cho URLs (SEO-friendly)
4. **Không cần authentication** cho các endpoints này (public)

