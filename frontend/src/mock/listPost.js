// mock/posts.js
// Mock data with real image URLs from Picsum (using slug as seed)

const mockPosts = [
  {
    id: 1,
    title: "Sự kiện Khai giảng Năm học Mới 2025",
    slug: "su-kien-khai-giang-nam-hoc-moi-2025",
    content:
      "Nội dung chi tiết về sự kiện khai giảng năm học mới. Đây là dịp để các thành viên câu lạc bộ gặp gỡ và chia sẻ kế hoạch cho năm mới...",
    excerpt:
      "Nội dung chi tiết về sự kiện khai giảng năm học mới. Đây là dịp để các thành viên câu lạc bộ gặp gỡ...",
    featured_image:
      "https://picsum.photos/seed/su-kien-khai-giang-nam-hoc-moi-2025/800/600",
    meta_description: "Sự kiện khai giảng năm học mới cho câu lạc bộ.",
    category: { id: 1, name: "Sự kiện" },
    status: 1,
    view_count: 150,
    published_at: "2025-09-15T10:00:00Z",
    created_by: { id: 1, fullname: "Admin User" },
    tags: ["khai giảng", "năm học mới", "câu lạc bộ"],
  },
  {
    id: 2,
    title: "Hướng dẫn Tham gia Câu lạc bộ",
    slug: "huong-dan-tham-gia-cau-lac-bo",
    content:
      "Bài viết hướng dẫn chi tiết cách đăng ký và tham gia các hoạt động của câu lạc bộ. Bao gồm các bước nộp đơn, phỏng vấn...",
    excerpt:
      "Bài viết hướng dẫn chi tiết cách đăng ký và tham gia các hoạt động của câu lạc bộ...",
    featured_image:
      "https://picsum.photos/seed/huong-dan-tham-gia-cau-lac-bo/800/600",
    meta_description: "Hướng dẫn tham gia câu lạc bộ cho thành viên mới.",
    category: { id: 2, name: "Hướng dẫn" },
    status: 1,
    view_count: 200,
    published_at: "2025-08-20T14:30:00Z",
    created_by: { id: 2, fullname: "Moderator A" },
    tags: ["tham gia", "hướng dẫn", "thành viên mới"],
  },
  {
    id: 3,
    title: "Kết quả Cuộc thi Lập trình Nội bộ",
    slug: "ket-qua-cuoc-thi-lap-trinh-noi-bo",
    content:
      "Tóm tắt kết quả cuộc thi lập trình nội bộ câu lạc bộ. Chúc mừng các đội thắng cuộc và bài học rút ra...",
    excerpt:
      "Tóm tắt kết quả cuộc thi lập trình nội bộ câu lạc bộ. Chúc mừng các đội thắng cuộc...",
    featured_image:
      "https://picsum.photos/seed/ket-qua-cuoc-thi-lap-trinh-noi-bo/800/600",
    meta_description: "Kết quả cuộc thi lập trình nội bộ.",
    category: { id: 3, name: "Tin tức" },
    status: 1,
    view_count: 120,
    published_at: "2025-09-10T09:45:00Z",
    created_by: { id: 1, fullname: "Admin User" },
    tags: ["cuộc thi", "lập trình", "kết quả"],
  },
  {
    id: 4,
    title: "Workshop: Kỹ năng Làm việc Nhóm",
    slug: "workshop-ky-nang-lam-viec-nhom",
    content:
      "Thông tin về workshop kỹ năng làm việc nhóm sắp tới. Đăng ký tham gia để cải thiện kỹ năng mềm...",
    excerpt: "Thông tin về workshop kỹ năng làm việc nhóm sắp tới...",
    featured_image:
      "https://picsum.photos/seed/workshop-ky-nang-lam-viec-nhom/800/600",
    meta_description: "Workshop về kỹ năng làm việc nhóm.",
    category: { id: 1, name: "Sự kiện" },
    status: 1,
    view_count: 80,
    published_at: "2025-09-25T11:00:00Z",
    created_by: { id: 3, fullname: "Editor B" },
    tags: ["workshop", "kỹ năng mềm", "làm việc nhóm"],
  },
  {
    id: 5,
    title: "Cập nhật Quy định Mới của Câu lạc bộ",
    slug: "cap-nhat-quy-dinh-moi-cua-cau-lac-bo",
    content:
      "Các quy định mới được cập nhật để đảm bảo hoạt động câu lạc bộ diễn ra suôn sẻ hơn...",
    excerpt:
      "Các quy định mới được cập nhật để đảm bảo hoạt động câu lạc bộ...",
    featured_image:
      "https://picsum.photos/seed/cap-nhat-quy-dinh-moi-cua-cau-lac-bo/800/600",
    meta_description: "Cập nhật quy định mới của câu lạc bộ.",
    category: { id: 4, name: "Quy định" },
    status: 1,
    view_count: 90,
    published_at: "2025-09-01T13:15:00Z",
    created_by: { id: 1, fullname: "Admin User" },
    tags: ["quy định", "cập nhật", "câu lạc bộ"],
  },
  {
    id: 6,
    title: "Chia sẻ Kinh nghiệm Học tập",
    slug: "chia-se-kinh-nghiem-hoc-tap",
    content:
      "Các thành viên chia sẻ kinh nghiệm học tập hiệu quả trong câu lạc bộ...",
    excerpt: "Các thành viên chia sẻ kinh nghiệm học tập hiệu quả...",
    featured_image:
      "https://picsum.photos/seed/chia-se-kinh-nghiem-hoc-tap/800/600",
    meta_description: "Chia sẻ kinh nghiệm học tập từ thành viên.",
    category: { id: 2, name: "Hướng dẫn" },
    status: 1,
    view_count: 110,
    published_at: "2025-08-25T10:30:00Z",
    created_by: { id: 2, fullname: "Moderator A" },
    tags: ["kinh nghiệm", "học tập", "chia sẻ"],
  },
  {
    id: 7,
    title: "Sự kiện Teambuilding Cuối Tuần",
    slug: "su-kien-teambuilding-cuoi-tuan",
    content:
      "Lịch teambuilding cuối tuần để tăng cường sự gắn kết giữa các thành viên...",
    excerpt: "Lịch teambuilding cuối tuần để tăng cường sự gắn kết...",
    featured_image:
      "https://picsum.photos/seed/su-kien-teambuilding-cuoi-tuan/800/600",
    meta_description: "Sự kiện teambuilding cuối tuần.",
    category: { id: 1, name: "Sự kiện" },
    status: 1,
    view_count: 140,
    published_at: "2025-09-20T15:00:00Z",
    created_by: { id: 3, fullname: "Editor B" },
    tags: ["teambuilding", "sự kiện", "gắn kết"],
  },
  {
    id: 8,
    title: "Tin tức Công nghệ Mới Nhất",
    slug: "tin-tuc-cong-nghe-moi-nhat",
    content:
      "Cập nhật các tin tức công nghệ mới nhất liên quan đến lĩnh vực của câu lạc bộ...",
    excerpt: "Cập nhật các tin tức công nghệ mới nhất...",
    featured_image:
      "https://picsum.photos/seed/tin-tuc-cong-nghe-moi-nhat/800/600",
    meta_description: "Tin tức công nghệ mới nhất.",
    category: { id: 3, name: "Tin tức" },
    status: 1,
    view_count: 160,
    published_at: "2025-09-05T12:00:00Z",
    created_by: { id: 1, fullname: "Admin User" },
    tags: ["tin tức", "công nghệ", "cập nhật"],
  },
  {
    id: 9,
    title: "Hướng dẫn Sử dụng Công cụ Mới",
    slug: "huong-dan-su-dung-cong-cu-moi",
    content: "Hướng dẫn chi tiết sử dụng công cụ mới trong câu lạc bộ...",
    excerpt: "Hướng dẫn chi tiết sử dụng công cụ mới...",
    featured_image:
      "https://picsum.photos/seed/huong-dan-su-dung-cong-cu-moi/800/600",
    meta_description: "Hướng dẫn sử dụng công cụ mới.",
    category: { id: 2, name: "Hướng dẫn" },
    status: 1,
    view_count: 95,
    published_at: "2025-09-12T14:45:00Z",
    created_by: { id: 2, fullname: "Moderator A" },
    tags: ["hướng dẫn", "công cụ", "sử dụng"],
  },
  {
    id: 10,
    title: "Báo cáo Hoạt động Quý 3",
    slug: "bao-cao-hoat-dong-quy-3",
    content:
      "Báo cáo chi tiết hoạt động của câu lạc bộ trong quý 3 năm 2025...",
    excerpt: "Báo cáo chi tiết hoạt động của câu lạc bộ trong quý 3...",
    featured_image:
      "https://picsum.photos/seed/bao-cao-hoat-dong-quy-3/800/600",
    meta_description: "Báo cáo hoạt động quý 3.",
    category: { id: 4, name: "Quy định" },
    status: 1,
    view_count: 70,
    published_at: "2025-09-30T16:00:00Z",
    created_by: { id: 3, fullname: "Editor B" },
    tags: ["báo cáo", "hoạt động", "quý 3"],
  },
];

export default mockPosts;
