# API Documentation - Club Management System

## Chuẩn Response Format

Tất cả các API endpoint đều trả về response theo format chuẩn sau:

### Success Response

```json
{
  "status": "success",
  "message": "Thông điệp mô tả kết quả",
  "data": {
    // Dữ liệu trả về
  }
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Thông điệp lỗi",
  "error": {
    "code": "ERROR_CODE",
    "details": "Chi tiết lỗi"
  }
}
```

### Validation Error Response

```json
{
  "status": "error",
  "message": "Dữ liệu không hợp lệ",
  "error": {
    "code": "VALIDATION_ERROR",
    "fields": {
      "email": ["Email không hợp lệ"],
      "password": ["Mật khẩu phải có ít nhất 8 ký tự"]
    }
  }
}
```

## HTTP Status Codes

- `200` - OK (Success)
- `201` - Created (Tạo mới thành công)
- `400` - Bad Request (Dữ liệu không hợp lệ)
- `401` - Unauthorized (Chưa đăng nhập)
- `403` - Forbidden (Không có quyền)
- `404` - Not Found (Không tìm thấy)
- `422` - Unprocessable Entity (Validation error)
- `500` - Internal Server Error (Lỗi server)

---

## 1. AUTHENTICATION & USER MANAGEMENT

### 1.1 Đăng ký tài khoản

```
POST /api/auth/register
```

**Request Body:**

```json
{
  "fullname": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "0123456789"
}
```

**Success Response (201):**

```json
{
  "status": "success",
  "message": "Đăng ký tài khoản thành công",
  "data": {
    "user": {
      "id": 1,
      "fullname": "Nguyễn Văn A",
      "email": "nguyenvana@example.com",
      "phone": "0123456789",
      "avatar_url": null,
      "role": {
        "id": 1,
        "name": "Thành viên"
      },
      "is_active": true,
      "created_at": "2025-09-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 1.2 Đăng nhập

```
POST /api/auth/login
```

**Request Body:**

```json
{
  "email": "nguyenvana@example.com",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Đăng nhập thành công",
  "data": {
    "user": {
      "id": 1,
      "fullname": "Nguyễn Văn A",
      "email": "nguyenvana@example.com",
      "phone": "0123456789",
      "avatar_url": null,
      "role": {
        "id": 1,
        "name": "Thành viên"
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "permissions": ["post:create", "post:comment", "event:register"]
  }
}
```

### 1.3 Đăng xuất

```
POST /api/auth/logout
Authorization: Bearer <token>
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Đăng xuất thành công",
  "data": null
}
```

### 1.4 Lấy thông tin profile

```
GET /api/auth/profile
Authorization: Bearer <token>
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Lấy thông tin thành công",
  "data": {
    "user": {
      "id": 1,
      "fullname": "Nguyễn Văn A",
      "email": "nguyenvana@example.com",
      "phone": "0123456789",
      "avatar_url": "https://example.com/avatar.jpg",
      "bio": "Thành viên CLB lập trình",
      "role": {
        "id": 1,
        "name": "Thành viên"
      },
      "member_profile": {
        "student_id": "20210001",
        "academic_year": "2021-09-01",
        "course": 21,
        "join_date": "2025-01-15"
      }
    }
  }
}
```

---

## 2. POSTS MANAGEMENT

### 2.1 Lấy danh sách bài viết

```
GET /api/posts?page=1&limit=10&category_id=1&status=1
```

**Query Parameters:**

- `page`: Trang hiện tại (default: 1)
- `limit`: Số bài viết mỗi trang (default: 10, max: 50)
- `category_id`: ID danh mục bài viết
- `status`: Trạng thái (0=archived, 1=published)
- `search`: Từ khóa tìm kiếm
- `sort`: Sắp xếp (created_at, view_count, title)
- `order`: Thứ tự (asc, desc)

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Lấy danh sách bài viết thành công",
  "data": {
    "posts": [
      {
        "id": 1,
        "title": "Giới thiệu về React.js",
        "slug": "gioi-thieu-ve-react-js",
        "featured_image": "https://example.com/image.jpg",
        "meta_description": "Bài viết giới thiệu về React.js",
        "category": {
          "id": 1,
          "name": "Kiến thức lập trình",
          "slug": "kien-thuc-lap-trinh"
        },
        "author": {
          "id": 1,
          "fullname": "Nguyễn Văn A",
          "avatar_url": "https://example.com/avatar.jpg"
        },
        "view_count": 150,
        "published_at": "2025-09-15T10:30:00Z",
        "tags": [
          {
            "id": 1,
            "name": "React",
            "slug": "react"
          },
          {
            "id": 2,
            "name": "JavaScript",
            "slug": "javascript"
          }
        ]
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 25,
      "total_pages": 3,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

### 2.2 Lấy chi tiết bài viết

```
GET /api/posts/{slug}
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Lấy chi tiết bài viết thành công",
  "data": {
    "post": {
      "id": 1,
      "title": "Giới thiệu về React.js",
      "slug": "gioi-thieu-ve-react-js",
      "content": "<p>Nội dung bài viết...</p>",
      "featured_image": "https://example.com/image.jpg",
      "meta_description": "Bài viết giới thiệu về React.js",
      "category": {
        "id": 1,
        "name": "Kiến thức lập trình",
        "slug": "kien-thuc-lap-trinh"
      },
      "author": {
        "id": 1,
        "fullname": "Nguyễn Văn A",
        "avatar_url": "https://example.com/avatar.jpg"
      },
      "view_count": 151,
      "published_at": "2025-09-15T10:30:00Z",
      "created_at": "2025-09-15T10:00:00Z",
      "tags": [
        {
          "id": 1,
          "name": "React",
          "slug": "react"
        },
        {
          "id": 2,
          "name": "JavaScript",
          "slug": "javascript"
        }
      ]
    }
  }
}
```

### 2.3 Tạo bài viết mới

```
POST /api/posts
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "title": "Giới thiệu về Vue.js",
  "content": "<p>Nội dung bài viết về Vue.js...</p>",
  "featured_image": "https://example.com/vue-image.jpg",
  "meta_description": "Bài viết giới thiệu về Vue.js framework",
  "category_id": 1,
  "tags": ["Vue", "JavaScript", "Frontend"],
  "status": 1
}
```

**Success Response (201):**

```json
{
  "status": "success",
  "message": "Tạo bài viết thành công",
  "data": {
    "post": {
      "id": 2,
      "title": "Giới thiệu về Vue.js",
      "slug": "gioi-thieu-ve-vue-js",
      "content": "<p>Nội dung bài viết về Vue.js...</p>",
      "status": 1,
      "created_at": "2025-09-15T09:30:00Z"
    }
  }
}
```

### 2.4 Cập nhật bài viết

```
PUT /api/posts/{id}
Authorization: Bearer <token>
```

**Request Body:** (Tương tự như tạo mới)

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Cập nhật bài viết thành công",
  "data": {
    "post": {
      "id": 2,
      "title": "Giới thiệu về Vue.js - Updated",
      "updated_at": "2025-09-15T10:45:00Z"
    }
  }
}
```

### 2.5 Xóa bài viết

```
DELETE /api/posts/{id}
Authorization: Bearer <token>
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Xóa bài viết thành công",
  "data": null
}
```

---

## 3. COMMENTS MANAGEMENT

### 3.1 Lấy bình luận của bài viết

```
GET /api/posts/{post_id}/comments?page=1&limit=20
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Lấy danh sách bình luận thành công",
  "data": {
    "comments": [
      {
        "id": 1,
        "content": "Bài viết rất hay và bổ ích!",
        "author": {
          "id": 2,
          "fullname": "Trần Thị B",
          "avatar_url": "https://example.com/avatar2.jpg"
        },
        "created_at": "2025-09-15T11:00:00Z",
        "replies": [
          {
            "id": 2,
            "content": "Cảm ơn bạn đã chia sẻ!",
            "author": {
              "id": 1,
              "fullname": "Nguyễn Văn A"
            },
            "created_at": "2025-09-15T11:15:00Z"
          }
        ]
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total": 5,
      "total_pages": 1,
      "has_next": false,
      "has_prev": false
    }
  }
}
```

### 3.2 Thêm bình luận

```
POST /api/posts/{post_id}/comments
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "content": "Bài viết rất hay!",
  "parent_id": null
}
```

**Success Response (201):**

```json
{
  "status": "success",
  "message": "Thêm bình luận thành công",
  "data": {
    "comment": {
      "id": 3,
      "content": "Bài viết rất hay!",
      "author": {
        "id": 1,
        "fullname": "Nguyễn Văn A"
      },
      "created_at": "2025-09-15T09:00:00Z"
    }
  }
}
```

---

## 4. EVENTS MANAGEMENT

### 4.1 Lấy danh sách sự kiện

```
GET /api/events?page=1&limit=10&status=1&upcoming=true
```

**Query Parameters:**

- `page`: Trang hiện tại (default: 1)
- `limit`: Số sự kiện mỗi trang (default: 10, max: 50)
- `status`: Trạng thái (0=draft, 1=published, 2=cancelled, 3=completed)
- `upcoming`: Chỉ lấy sự kiện sắp tới (true/false)
- `past`: Chỉ lấy sự kiện đã qua (true/false)

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Lấy danh sách sự kiện thành công",
  "data": {
    "events": [
      {
        "id": 1,
        "title": "Workshop React Native",
        "slug": "workshop-react-native",
        "content": "<p>Workshop về phát triển ứng dụng với React Native...</p>",
        "featured_image": "https://example.com/event.jpg",
        "start_time": "2025-09-20T14:00:00Z",
        "end_time": "2025-09-20T17:00:00Z",
        "location": "Phòng A1.101",
        "max_participants": 50,
        "registration_deadline": "2025-09-18T23:59:59Z",
        "status": 1,
        "is_public": true,
        "created_at": "2025-09-15T10:00:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 8,
      "total_pages": 1,
      "has_next": false,
      "has_prev": false
    }
  }
}
```

### 4.2 Đăng ký tham gia sự kiện

```
POST /api/events/{event_id}/register
Authorization: Bearer <token> (optional for public events)
```

**Request Body (Member - registration_type: private):**

```json
{
  "registration_type": "private",
  "notes": "Tôi rất quan tâm đến React Native"
}
```

**Request Body (Guest - registration_type: public):**

```json
{
  "registration_type": "public",
  "guest_name": "Lê Văn C",
  "guest_email": "levanc@example.com",
  "guest_phone": "0987654321",
  "notes": "Tôi muốn tham gia workshop này"
}
```

**Success Response (201):**

```json
{
  "status": "success",
  "message": "Đăng ký tham gia sự kiện thành công",
  "data": {
    "registration": {
      "id": 1,
      "event_id": 1,
      "registration_type": "private",
      "user_id": 1,
      "guest_name": null,
      "guest_email": null,
      "guest_phone": null,
      "notes": "Tôi rất quan tâm đến React Native",
      "registered_at": "2025-09-15T10:00:00Z"
    }
  }
}
```

### 4.3 Điểm danh sự kiện (BCN only)

```
POST /api/events/{event_id}/attendances
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "registration_id": 1,
  "checked_in": true,
  "notes": "Đã điểm danh tại sự kiện"
}
```

**Success Response (201):**

```json
{
  "status": "success",
  "message": "Điểm danh thành công",
  "data": {
    "attendance": {
      "id": 1,
      "event_id": 1,
      "registration_id": 1,
      "user_id": 1,
      "checked_in": true,
      "check_in_time": "2025-09-20T14:05:00Z",
      "notes": "Đã điểm danh tại sự kiện",
      "checked_in_by": 2
    }
  }
}
```

---

## 5. DOCUMENTS MANAGEMENT

### 5.1 Lấy danh sách tài liệu

```
GET /api/documents?page=1&limit=10&category_id=1&access_level=public
```

**Query Parameters:**

- `page`: Trang hiện tại (default: 1)
- `limit`: Số tài liệu mỗi trang (default: 10, max: 50)
- `category_id`: ID danh mục tài liệu
- `access_level`: Mức truy cập (public, member_only, restricted)
- `search`: Từ khóa tìm kiếm

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Lấy danh sách tài liệu thành công",
  "data": {
    "documents": [
      {
        "id": 1,
        "title": "Giáo trình React.js cơ bản",
        "slug": "giao-trinh-react-js-co-ban",
        "description": "Tài liệu học React.js từ cơ bản đến nâng cao",
        "file_url": "https://example.com/document.pdf",
        "preview_url": "https://example.com/preview.pdf",
        "category": {
          "id": 1,
          "name": "Tài liệu học tập",
          "slug": "tai-lieu-hoc-tap"
        },
        "access_level": "public",
        "download_count": 150,
        "created_at": "2025-09-10T08:00:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 12,
      "total_pages": 2,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

### 5.2 Tải xuống tài liệu

```
GET /api/documents/{id}/download
Authorization: Bearer <token> (required for member_only or restricted)
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Tạo link tải xuống thành công",
  "data": {
    "download_url": "https://example.com/secure-download/document.pdf?token=abc123",
    "expires_at": "2025-09-15T11:00:00Z"
  }
}
```

---

## 6. Q&A SYSTEM

### 6.1 Lấy danh sách câu hỏi

```
GET /api/questions?page=1&limit=10&status=0&sort=created_at
```

**Query Parameters:**

- `page`: Trang hiện tại (default: 1)
- `limit`: Số câu hỏi mỗi trang (default: 10, max: 50)
- `status`: Trạng thái (0=open, 1=closed, 2=resolved)
- `sort`: Sắp xếp (created_at, view_count)
- `order`: Thứ tự (asc, desc)

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Lấy danh sách câu hỏi thành công",
  "data": {
    "questions": [
      {
        "id": 1,
        "title": "Làm thế nào để học React hiệu quả?",
        "slug": "lam-the-nao-de-hoc-react-hieu-qua",
        "content": "<p>Tôi mới bắt đầu với React...</p>",
        "status": 0,
        "view_count": 45,
        "answers_count": 3,
        "author": {
          "id": 3,
          "fullname": "Phạm Văn D"
        },
        "created_at": "2025-09-15T16:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 15,
      "total_pages": 2,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

### 6.2 Trả lời câu hỏi

```
POST /api/questions/{question_id}/answers
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "content": "<p>Để học React hiệu quả, bạn nên...</p>",
  "parent_id": null
}
```

**Success Response (201):**

```json
{
  "status": "success",
  "message": "Trả lời câu hỏi thành công",
  "data": {
    "answer": {
      "id": 1,
      "content": "<p>Để học React hiệu quả, bạn nên...</p>",
      "question_id": 1,
      "vote_score": 0,
      "is_accepted": false,
      "author": {
        "id": 1,
        "fullname": "Nguyễn Văn A"
      },
      "created_at": "2025-09-15T10:30:00Z"
    }
  }
}
```

### 6.3 Vote câu trả lời

```
POST /api/answers/{answer_id}/vote
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "vote": 1
}
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Vote câu trả lời thành công",
  "data": {
    "answer": {
      "id": 1,
      "vote_score": 1
    }
  }
}
```

---

## 7. MEMBERSHIP APPLICATIONS

### 7.1 Nộp đơn xin gia nhập

```
POST /api/membership/apply
```

**Request Body:**

```json
{
  "fullname": "Hoàng Thị E",
  "email": "hoangthie@example.com",
  "phone": "0912345678",
  "student_year": "K22",
  "major": "Công nghệ thông tin"
}
```

**Success Response (201):**

```json
{
  "status": "success",
  "message": "Nộp đơn xin gia nhập thành công",
  "data": {
    "application": {
      "id": 1,
      "fullname": "Hoàng Thị E",
      "email": "hoangthie@example.com",
      "phone": "0912345678",
      "student_year": "K22",
      "major": "Công nghệ thông tin",
      "status": 2,
      "created_at": "2025-09-15T11:00:00Z"
    }
  }
}
```

### 7.2 Duyệt đơn xin gia nhập (BCN only)

```
PUT /api/membership/applications/{id}/approve
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "student_id": "22010001",
  "course": 22,
  "interview_notes": "Ứng viên có kiến thức tốt về lập trình"
}
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Duyệt đơn gia nhập thành công",
  "data": {
    "user": {
      "id": 5,
      "fullname": "Hoàng Thị E",
      "email": "hoangthie@example.com",
      "role": {
        "id": 1,
        "name": "Thành viên"
      }
    },
    "member_profile": {
      "student_id": "22010001",
      "course": 22,
      "join_date": "2025-09-15"
    }
  }
}
```

---

## 8. FINANCIAL TRANSACTIONS (BCN only)

### 8.1 Lấy danh sách giao dịch

```
GET /api/transactions?page=1&limit=10&type=1&from_date=2025-01-01&to_date=2025-09-30
Authorization: Bearer <token>
```

**Query Parameters:**

- `page`: Trang hiện tại (default: 1)
- `limit`: Số giao dịch mỗi trang (default: 10, max: 50)
- `type`: Loại giao dịch (0=expense, 1=income)
- `from_date`: Ngày bắt đầu (YYYY-MM-DD)
- `to_date`: Ngày kết thúc (YYYY-MM-DD)

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Lấy danh sách giao dịch thành công",
  "data": {
    "transactions": [
      {
        "id": 1,
        "amount": 500000,
        "type": 1,
        "description": "Thu phí thành viên tháng 9",
        "attachment_url": "https://example.com/receipt.pdf",
        "created_by": {
          "id": 1,
          "fullname": "Nguyễn Văn A"
        },
        "created_at": "2025-09-01T10:00:00Z"
      }
    ],
    "summary": {
      "total_income": 2500000,
      "total_expense": 1200000,
      "balance": 1300000
    },
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 20,
      "total_pages": 2,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

### 8.2 Tạo giao dịch mới

```
POST /api/transactions
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "amount": 300000,
  "type": 0,
  "description": "Mua thiết bị cho workshop",
  "attachment_url": "https://example.com/invoice.pdf"
}
```

**Success Response (201):**

```json
{
  "status": "success",
  "message": "Tạo giao dịch thành công",
  "data": {
    "transaction": {
      "id": 2,
      "amount": 300000,
      "type": 0,
      "description": "Mua thiết bị cho workshop",
      "attachment_url": "https://example.com/invoice.pdf",
      "created_at": "2025-09-15T14:30:00Z"
    }
  }
}
```

---

## 9. ADMIN MANAGEMENT

### 9.1 Thống kê tổng quan (Admin/BCN only)

```
GET /api/admin/dashboard
Authorization: Bearer <token>
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Lấy thống kê tổng quan thành công",
  "data": {
    "overview": {
      "total_members": 150,
      "total_posts": 45,
      "total_events": 12,
      "total_documents": 28,
      "pending_applications": 5
    },
    "recent_activities": [
      {
        "id": 1,
        "type": "post_created",
        "description": "Nguyễn Văn A đã tạo bài viết mới",
        "created_at": "2025-09-15T09:30:00Z"
      },
      {
        "id": 2,
        "type": "member_joined",
        "description": "Trần Thị B đã gia nhập CLB",
        "created_at": "2025-09-14T16:45:00Z"
      }
    ],
    "monthly_stats": {
      "posts_created": 8,
      "events_held": 2,
      "new_members": 12,
      "documents_uploaded": 5
    }
  }
}
```

### 9.2 Quản lý phân quyền

```
POST /api/admin/users/{user_id}/permissions
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "permissions": ["post:approve", "event:create", "event:edit"],
  "action": "grant"
}
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Cập nhật quyền thành công",
  "data": {
    "user": {
      "id": 2,
      "fullname": "Trần Thị B",
      "permissions": [
        "post:create",
        "post:comment",
        "post:approve",
        "event:create",
        "event:edit"
      ]
    }
  }
}
```

---

## 10. FILE UPLOAD

### 10.1 Upload file

```
POST /api/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**

- `file`: File to upload
- `type`: Type of file (avatar, document, image, attachment)

**Success Response (201):**

```json
{
  "status": "success",
  "message": "Upload file thành công",
  "data": {
    "file": {
      "url": "https://example.com/uploads/2025/09/document.pdf",
      "filename": "document.pdf",
      "size": 1024000,
      "mime_type": "application/pdf"
    }
  }
}
```

---

## 11. SEARCH & FILTERING

### 11.1 Tìm kiếm toàn bộ

```
GET /api/search?q=react&type=all&page=1&limit=10
```

**Query Parameters:**

- `q`: Từ khóa tìm kiếm
- `type`: Loại tìm kiếm (all, posts, events, documents, questions)
- `page`: Trang hiện tại (default: 1)
- `limit`: Số kết quả mỗi trang (default: 10, max: 50)

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Tìm kiếm thành công",
  "data": {
    "results": {
      "posts": [
        {
          "id": 1,
          "title": "Giới thiệu về React.js",
          "type": "post",
          "url": "/posts/gioi-thieu-ve-react-js"
        }
      ],
      "events": [
        {
          "id": 1,
          "title": "Workshop React Native",
          "type": "event",
          "url": "/events/workshop-react-native"
        }
      ],
      "documents": [],
      "questions": []
    },
    "total_results": 2,
    "search_time": "0.045s"
  }
}
```

---

## 12. NOTIFICATIONS (Future Feature)

### 12.1 Lấy thông báo của user

```
GET /api/notifications?page=1&limit=10&unread_only=true
Authorization: Bearer <token>
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Lấy danh sách thông báo thành công",
  "data": {
    "notifications": [
      {
        "id": 1,
        "title": "Bài viết của bạn được duyệt",
        "content": "Bài viết 'Giới thiệu về Vue.js' đã được duyệt và xuất bản",
        "type": "post_approved",
        "is_read": false,
        "created_at": "2025-09-15T10:30:00Z"
      }
    ],
    "unread_count": 3,
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 15,
      "total_pages": 2,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

---

## ERROR HANDLING

### Common Error Responses

#### 401 Unauthorized

```json
{
  "status": "error",
  "message": "Token không hợp lệ hoặc đã hết hạn",
  "error": {
    "code": "UNAUTHORIZED",
    "details": "Please login again"
  }
}
```

#### 403 Forbidden

```json
{
  "status": "error",
  "message": "Bạn không có quyền thực hiện hành động này",
  "error": {
    "code": "FORBIDDEN",
    "details": "Required permission: post:create"
  }
}
```

#### 404 Not Found

```json
{
  "status": "error",
  "message": "Không tìm thấy tài nguyên",
  "error": {
    "code": "NOT_FOUND",
    "details": "Post with id 999 not found"
  }
}
```

#### 422 Validation Error

```json
{
  "status": "error",
  "message": "Dữ liệu không hợp lệ",
  "error": {
    "code": "VALIDATION_ERROR",
    "fields": {
      "title": ["Tiêu đề không được để trống"],
      "email": ["Email không đúng định dạng"],
      "password": ["Mật khẩu phải có ít nhất 8 ký tự"]
    }
  }
}
```

#### 500 Internal Server Error

```json
{
  "status": "error",
  "message": "Lỗi hệ thống",
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "details": "An unexpected error occurred"
  }
}
```

---

## PAGINATION STRUCTURE

Tất cả API trả về danh sách đều có cấu trúc pagination như sau:

```json
{
  "pagination": {
    "current_page": 1,
    "per_page": 10,
    "total": 100,
    "total_pages": 10,
    "has_next": true,
    "has_prev": false,
    "next_page": 2,
    "prev_page": null
  }
}
```

---

## AUTHENTICATION

### Bearer Token

Tất cả API yêu cầu authentication đều sử dụng Bearer token trong header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiration

- Access token: 24 hours
- Refresh token: 30 days
- Password reset token: 1 hour
- Email verification token: 24 hours

---

## RATE LIMITING

### Giới hạn request

- Guest: 100 requests/hour
- Member: 1000 requests/hour
- BCN/Admin: 5000 requests/hour

### Rate limit headers

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1726387200
```

---

## API VERSIONING

API sử dụng URL versioning:

- Current version: `/api/v1/`
- Legacy support: `/api/` (maps to v1)

---

## CORS POLICY

API hỗ trợ CORS với các domain được phép:

- `http://localhost:3000` (Development)
- `https://club.example.com` (Production)
- `https://admin.club.example.com` (Admin panel)

---

## CONTENT TYPES

### Request Content-Type

- JSON: `application/json`
- Form data: `multipart/form-data` (for file uploads)
- URL encoded: `application/x-www-form-urlencoded`

### Response Content-Type

- Always: `application/json; charset=utf-8`

---

## CACHING STRATEGY

### Cache Headers

```
Cache-Control: public, max-age=3600
ETag: "abc123def456"
Last-Modified: Mon, 15 Sep 2025 10:00:00 GMT
```

### Cacheable Endpoints

- GET `/api/posts` - 5 minutes
- GET `/api/events` - 10 minutes
- GET `/api/documents` - 15 minutes
- GET `/api/posts/{slug}` - 1 hour

---

## WEBHOOK SUPPORT (Future Feature)

### Webhook Events

- `member.created`
- `post.published`
- `event.created`
- `application.approved`

### Webhook Payload Example

```json
{
  "event": "post.published",
  "data": {
    "id": 1,
    "title": "New Post Title",
    "author_id": 2
  },
  "timestamp": "2025-09-15T10:30:00Z"
}
```

---
