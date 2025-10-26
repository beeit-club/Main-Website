// ================================================================
// MOCK DATA CHO CLUB MANAGEMENT SYSTEM
// ================================================================

// 1. USERS & ROLES DATA
// ================================================================

export const mockRoles = [
  { id: 1, name: "Thành viên", description: "Thành viên thông thường của CLB" },
  { id: 2, name: "Ban chủ nhiệm", description: "Quản lý và điều hành CLB" },
  { id: 3, name: "Admin", description: "Quản trị viên hệ thống" },
];

export const mockUsers = [
  {
    id: 1,
    fullname: "Nguyễn Văn An",
    email: "nguyenvanan@example.com",
    phone: "0123456789",
    avatar_url: "https://i.pravatar.cc/150?img=1",
    bio: "Đam mê lập trình web và mobile. Yêu thích React và Node.js",
    role: { id: 2, name: "Ban chủ nhiệm" },
    is_active: true,
    email_verified_at: "2025-01-15T10:00:00Z",
    created_at: "2024-09-01T08:00:00Z",
  },
  {
    id: 2,
    fullname: "Trần Thị Bình",
    email: "tranthib@example.com",
    phone: "0987654321",
    avatar_url: "https://i.pravatar.cc/150?img=2",
    bio: "Frontend Developer, UI/UX enthusiast",
    role: { id: 1, name: "Thành viên" },
    is_active: true,
    email_verified_at: "2025-02-10T14:30:00Z",
    created_at: "2024-10-05T09:15:00Z",
  },
  {
    id: 3,
    fullname: "Lê Minh Châu",
    email: "leminhchau@example.com",
    phone: "0912345678",
    avatar_url: "https://i.pravatar.cc/150?img=3",
    bio: "Backend Developer, DevOps lover",
    role: { id: 1, name: "Thành viên" },
    is_active: true,
    email_verified_at: "2025-01-20T11:00:00Z",
    created_at: "2024-11-12T10:30:00Z",
  },
  {
    id: 4,
    fullname: "Phạm Văn Dũng",
    email: "phamvandung@example.com",
    phone: "0934567890",
    avatar_url: "https://i.pravatar.cc/150?img=4",
    bio: "Full-stack developer, thích khám phá công nghệ mới",
    role: { id: 2, name: "Ban chủ nhiệm" },
    is_active: true,
    email_verified_at: "2025-03-01T09:00:00Z",
    created_at: "2024-09-15T13:45:00Z",
  },
  {
    id: 5,
    fullname: "Hoàng Thị Mai",
    email: "hoangthimai@example.com",
    phone: "0945678901",
    avatar_url: "https://i.pravatar.cc/150?img=5",
    bio: "Data Science và Machine Learning enthusiast",
    role: { id: 1, name: "Thành viên" },
    is_active: true,
    email_verified_at: "2025-02-15T16:20:00Z",
    created_at: "2024-12-01T08:00:00Z",
  },
];

export const mockMemberProfiles = [
  {
    user_id: 1,
    student_id: "20210001",
    academic_year: "2021-09-01",
    course: 21,
    join_date: "2024-09-01",
    user: mockUsers[0],
  },
  {
    user_id: 2,
    student_id: "20220025",
    academic_year: "2022-09-01",
    course: 22,
    join_date: "2024-10-05",
    user: mockUsers[1],
  },
  {
    user_id: 3,
    student_id: "20210089",
    academic_year: "2021-09-01",
    course: 21,
    join_date: "2024-11-12",
    user: mockUsers[2],
  },
  {
    user_id: 4,
    student_id: "20210045",
    academic_year: "2021-09-01",
    course: 21,
    join_date: "2024-09-15",
    user: mockUsers[3],
  },
  {
    user_id: 5,
    student_id: "20230012",
    academic_year: "2023-09-01",
    course: 23,
    join_date: "2024-12-01",
    user: mockUsers[4],
  },
];

// 2. POSTS DATA
// ================================================================

export const mockPostCategories = [
  { id: 1, name: "Kiến thức lập trình", slug: "kien-thuc-lap-trinh" },
  { id: 2, name: "Tin tức CLB", slug: "tin-tuc-clb" },
  { id: 3, name: "Chia sẻ kinh nghiệm", slug: "chia-se-kinh-nghiem" },
  { id: 4, name: "Dự án thực tế", slug: "du-an-thuc-te" },
  { id: 5, name: "Sự kiện & Hoạt động", slug: "su-kien-hoat-dong" },
];

export const mockTags = [
  { id: 1, name: "React", slug: "react" },
  { id: 2, name: "JavaScript", slug: "javascript" },
  { id: 3, name: "Node.js", slug: "nodejs" },
  { id: 4, name: "Vue.js", slug: "vuejs" },
  { id: 5, name: "Python", slug: "python" },
  { id: 6, name: "TypeScript", slug: "typescript" },
  { id: 7, name: "Docker", slug: "docker" },
  { id: 8, name: "Git", slug: "git" },
  { id: 9, name: "MongoDB", slug: "mongodb" },
  { id: 10, name: "PostgreSQL", slug: "postgresql" },
];

export const mockPosts = [
  {
    id: 1,
    title: "Giới thiệu về React.js - Framework phổ biến nhất 2025",
    slug: "gioi-thieu-ve-react-js",
    content:
      "<p>React.js là một thư viện JavaScript mã nguồn mở được phát triển bởi Facebook, được sử dụng rộng rãi để xây dựng giao diện người dùng. Với khả năng tái sử dụng component và virtual DOM hiệu quả, React đã trở thành lựa chọn hàng đầu của các developer.</p><h2>Tại sao nên học React?</h2><p>React giúp bạn xây dựng ứng dụng web hiện đại với hiệu suất cao và dễ bảo trì...</p>",
    featured_image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    meta_description:
      "Tìm hiểu về React.js, framework JavaScript phổ biến nhất hiện nay",
    category: mockPostCategories[0],
    author: mockUsers[0],
    status: 1,
    view_count: 245,
    published_at: "2025-09-15T10:30:00Z",
    created_at: "2025-09-14T14:20:00Z",
    tags: [mockTags[0], mockTags[1]],
  },
  {
    id: 2,
    title: "Workshop React Native - Xây dựng ứng dụng di động đa nền tảng",
    slug: "workshop-react-native",
    content:
      "<p>CLB lập trình sẽ tổ chức workshop về React Native vào cuối tuần này. Đây là cơ hội tuyệt vời để các bạn học cách xây dựng ứng dụng mobile cho cả iOS và Android chỉ với một codebase.</p><h2>Nội dung workshop</h2><ul><li>Cài đặt môi trường</li><li>Các component cơ bản</li><li>Navigation và routing</li><li>State management với Redux</li></ul>",
    featured_image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
    meta_description: "Workshop React Native - Học cách xây dựng app di động",
    category: mockPostCategories[1],
    author: mockUsers[3],
    status: 1,
    view_count: 189,
    published_at: "2025-09-10T09:00:00Z",
    created_at: "2025-09-09T16:45:00Z",
    tags: [mockTags[0], mockTags[1]],
  },
  {
    id: 3,
    title: "Node.js Best Practices - Những điều cần biết khi làm Backend",
    slug: "nodejs-best-practices",
    content:
      "<p>Node.js đã trở thành một trong những platform backend phổ biến nhất. Tuy nhiên, để viết code Node.js hiệu quả và bảo mật, bạn cần nắm vững các best practices.</p><h2>Các best practices quan trọng</h2><p>1. Sử dụng async/await thay vì callback<br>2. Handle errors properly<br>3. Validate user input<br>4. Sử dụng environment variables</p>",
    featured_image:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800",
    meta_description: "Tìm hiểu các best practices khi làm việc với Node.js",
    category: mockPostCategories[0],
    author: mockUsers[2],
    status: 1,
    view_count: 312,
    published_at: "2025-09-08T14:15:00Z",
    created_at: "2025-09-07T11:30:00Z",
    tags: [mockTags[2], mockTags[1]],
  },
  {
    id: 4,
    title: "Kinh nghiệm tham gia Hackathon lần đầu",
    slug: "kinh-nghiem-tham-gia-hackathon",
    content:
      "<p>Tuần trước mình vừa tham gia Hackathon lần đầu tiên và có rất nhiều trải nghiệm thú vị muốn chia sẻ với các bạn...</p><h2>Chuẩn bị trước khi tham gia</h2><p>Việc chuẩn bị kỹ càng là rất quan trọng. Bạn nên tìm hiểu về chủ đề, công nghệ sẽ sử dụng và lập team từ trước...</p>",
    featured_image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
    meta_description: "Chia sẻ kinh nghiệm tham gia Hackathon lần đầu tiên",
    category: mockPostCategories[2],
    author: mockUsers[1],
    status: 1,
    view_count: 156,
    published_at: "2025-09-05T16:20:00Z",
    created_at: "2025-09-04T10:00:00Z",
    tags: [mockTags[1]],
  },
  {
    id: 5,
    title: "Dự án Website quản lý CLB - Từ ý tưởng đến thực tế",
    slug: "du-an-website-quan-ly-clb",
    content:
      "<p>Sau 3 tháng phát triển, chúng mình đã hoàn thành website quản lý CLB với đầy đủ các tính năng cần thiết...</p><h2>Tech stack sử dụng</h2><ul><li>Frontend: React.js, TailwindCSS</li><li>Backend: Node.js, Express</li><li>Database: MySQL</li><li>Deployment: Vercel, Railway</li></ul>",
    featured_image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    meta_description: "Chia sẻ về dự án website quản lý CLB",
    category: mockPostCategories[3],
    author: mockUsers[0],
    status: 1,
    view_count: 421,
    published_at: "2025-09-01T08:00:00Z",
    created_at: "2025-08-31T15:30:00Z",
    tags: [mockTags[0], mockTags[2], mockTags[9]],
  },
];

export const mockComments = [
  {
    id: 1,
    content: "Bài viết rất hay và bổ ích! Cảm ơn bạn đã chia sẻ.",
    author: mockUsers[1],
    post_id: 1,
    parent_id: null,
    status: 1,
    created_at: "2025-09-15T11:00:00Z",
    replies: [
      {
        id: 2,
        content: "Cảm ơn bạn đã đọc! Mình sẽ viết thêm các bài nâng cao hơn.",
        author: mockUsers[0],
        post_id: 1,
        parent_id: 1,
        status: 1,
        created_at: "2025-09-15T11:15:00Z",
        replies: [],
      },
    ],
  },
  {
    id: 3,
    content:
      "Mình có thể tham gia workshop này không ạ? Mình chưa có kinh nghiệm về React Native.",
    author: mockUsers[4],
    post_id: 2,
    parent_id: null,
    status: 1,
    created_at: "2025-09-10T10:30:00Z",
    replies: [
      {
        id: 4,
        content:
          "Chắc chắn rồi! Workshop dành cho tất cả mọi người, kể cả người mới bắt đầu.",
        author: mockUsers[3],
        post_id: 2,
        parent_id: 3,
        status: 1,
        created_at: "2025-09-10T11:00:00Z",
        replies: [],
      },
    ],
  },
  {
    id: 5,
    content:
      "Best practices này rất hữu ích, đặc biệt là phần về error handling.",
    author: mockUsers[0],
    post_id: 3,
    parent_id: null,
    status: 1,
    created_at: "2025-09-08T15:30:00Z",
    replies: [],
  },
];

// 3. EVENTS DATA
// ================================================================

export const mockEvents = [
  {
    id: 1,
    title: "Workshop React Native - Xây dựng ứng dụng mobile đa nền tảng",
    slug: "workshop-react-native-2025",
    content:
      "<p>Workshop về React Native dành cho các thành viên muốn học cách xây dựng ứng dụng mobile...</p>",
    featured_image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    meta_description: "Workshop React Native cho người mới bắt đầu",
    start_time: "2025-10-20T14:00:00Z",
    end_time: "2025-10-20T17:00:00Z",
    location: "Phòng A1.101, Tòa nhà A",
    max_participants: 50,
    registration_deadline: "2025-10-18T23:59:59Z",
    status: 1,
    is_public: true,
    created_by: mockUsers[3],
    created_at: "2025-09-15T10:00:00Z",
    registered_count: 32,
  },
  {
    id: 2,
    title: "Code Challenge - Tháng 10/2025",
    slug: "code-challenge-thang-10-2025",
    content:
      "<p>Cuộc thi lập trình hàng tháng của CLB với nhiều giải thưởng hấp dẫn...</p>",
    featured_image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
    meta_description: "Cuộc thi lập trình hàng tháng của CLB",
    start_time: "2025-10-15T09:00:00Z",
    end_time: "2025-10-15T17:00:00Z",
    location: "Phòng Lab 1, Lab 2, Lab 3",
    max_participants: 100,
    registration_deadline: "2025-10-12T23:59:59Z",
    status: 1,
    is_public: false,
    created_by: mockUsers[0],
    created_at: "2025-09-01T08:00:00Z",
    registered_count: 67,
  },
  {
    id: 3,
    title: "Meetup với Senior Developer - Chia sẻ kinh nghiệm",
    slug: "meetup-senior-developer",
    content:
      "<p>Buổi gặp gỡ và chia sẻ kinh nghiệm với anh Nguyễn Văn A - Senior Developer tại FPT Software...</p>",
    featured_image:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800",
    meta_description: "Meetup với Senior Developer",
    start_time: "2025-10-25T18:30:00Z",
    end_time: "2025-10-25T20:30:00Z",
    location: "Hội trường B, Tòa nhà B",
    max_participants: 80,
    registration_deadline: "2025-10-23T23:59:59Z",
    status: 1,
    is_public: true,
    created_by: mockUsers[0],
    created_at: "2025-09-10T14:00:00Z",
    registered_count: 45,
  },
  {
    id: 4,
    title: "Hackathon 2025 - Code for Community",
    slug: "hackathon-2025",
    content:
      "<p>Hackathon lớn nhất trong năm với chủ đề 'Code for Community'...</p>",
    featured_image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
    meta_description: "Hackathon 2025 - Code for Community",
    start_time: "2025-11-15T08:00:00Z",
    end_time: "2025-11-17T18:00:00Z",
    location: "Trung tâm Hội nghị Quốc gia",
    max_participants: 200,
    registration_deadline: "2025-11-01T23:59:59Z",
    status: 1,
    is_public: true,
    created_by: mockUsers[3],
    created_at: "2025-08-20T09:00:00Z",
    registered_count: 123,
  },
  {
    id: 5,
    title: "Workshop Git & GitHub - Làm việc nhóm hiệu quả",
    slug: "workshop-git-github",
    content: "<p>Workshop về Git và GitHub cho người mới bắt đầu...</p>",
    featured_image:
      "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800",
    meta_description: "Workshop Git & GitHub cơ bản",
    start_time: "2025-10-10T14:00:00Z",
    end_time: "2025-10-10T16:30:00Z",
    location: "Phòng B2.203",
    max_participants: 40,
    registration_deadline: "2025-10-08T23:59:59Z",
    status: 3,
    is_public: true,
    created_by: mockUsers[2],
    created_at: "2025-08-25T11:00:00Z",
    registered_count: 40,
  },
];

export const mockEventRegistrations = [
  {
    id: 1,
    event_id: 1,
    user_id: 1,
    registration_type: "private",
    guest_name: null,
    guest_email: null,
    guest_phone: null,
    notes: "Tôi rất quan tâm đến React Native",
    registered_at: "2025-09-16T10:00:00Z",
  },
  {
    id: 2,
    event_id: 1,
    user_id: null,
    registration_type: "public",
    guest_name: "Lê Văn C",
    guest_email: "levanc@example.com",
    guest_phone: "0987654321",
    notes: "Tôi muốn tham gia workshop này",
    registered_at: "2025-09-17T14:30:00Z",
  },
  {
    id: 3,
    event_id: 2,
    user_id: 2,
    registration_type: "private",
    guest_name: null,
    guest_email: null,
    guest_phone: null,
    notes: "Mong muốn được thử thách bản thân",
    registered_at: "2025-09-05T09:15:00Z",
  },
];

// 4. QUESTIONS & ANSWERS DATA
// ================================================================

export const mockQuestions = [
  {
    id: 1,
    title: "Làm thế nào để học React hiệu quả cho người mới bắt đầu?",
    slug: "lam-the-nao-de-hoc-react-hieu-qua",
    content:
      "<p>Tôi mới bắt đầu học lập trình web và muốn học React. Các bạn có thể cho tôi lộ trình học React hiệu quả được không?</p><p>Hiện tại tôi đã biết HTML, CSS và JavaScript cơ bản.</p>",
    meta_description: "Hỏi về lộ trình học React cho người mới",
    status: 0,
    view_count: 156,
    created_by: mockUsers[4],
    created_at: "2025-09-15T16:30:00Z",
    answers_count: 3,
  },
  {
    id: 2,
    title: "So sánh giữa MongoDB và PostgreSQL, nên chọn cái nào?",
    slug: "so-sanh-mongodb-va-postgresql",
    content:
      "<p>Mình đang làm một dự án web và đang phân vân không biết nên chọn MongoDB hay PostgreSQL.</p><p>Dự án của mình là một trang web thương mại điện tử nhỏ. Các bạn có thể tư vấn giúp mình được không?</p>",
    meta_description: "So sánh MongoDB vs PostgreSQL",
    status: 2,
    view_count: 289,
    created_by: mockUsers[1],
    created_at: "2025-09-12T10:15:00Z",
    answers_count: 5,
  },
  {
    id: 3,
    title: "Cách tối ưu hiệu suất cho ứng dụng React?",
    slug: "cach-toi-uu-hieu-suat-react",
    content:
      "<p>App React của mình đang chạy khá chậm khi có nhiều component render. Các bạn có tips gì để tối ưu hiệu suất không?</p>",
    meta_description: "Tối ưu hiệu suất ứng dụng React",
    status: 0,
    view_count: 203,
    created_by: mockUsers[2],
    created_at: "2025-09-10T14:20:00Z",
    answers_count: 4,
  },
  {
    id: 4,
    title: "Docker có thực sự cần thiết cho dự án nhỏ không?",
    slug: "docker-co-can-thiet-cho-du-an-nho",
    content:
      "<p>Mình thấy nhiều người dùng Docker nhưng chưa hiểu rõ lợi ích của nó. Với dự án nhỏ có cần thiết phải dùng Docker không?</p>",
    meta_description: "Docker có cần thiết cho dự án nhỏ?",
    status: 0,
    view_count: 134,
    created_by: mockUsers[3],
    created_at: "2025-09-08T09:45:00Z",
    answers_count: 2,
  },
  {
    id: 5,
    title: "Làm sao để deploy website React lên Vercel?",
    slug: "deploy-react-len-vercel",
    content:
      "<p>Mình mới hoàn thành dự án React đầu tiên và muốn deploy lên Vercel. Các bước cụ thể là gì ạ?</p>",
    meta_description: "Hướng dẫn deploy React lên Vercel",
    status: 2,
    view_count: 178,
    created_by: mockUsers[4],
    created_at: "2025-09-05T11:00:00Z",
    answers_count: 3,
  },
];

export const mockAnswers = [
  {
    id: 1,
    content:
      "<p>Để học React hiệu quả, bạn nên theo lộ trình sau:</p><ol><li>Củng cố JavaScript ES6+ (arrow functions, destructuring, spread operator, promises, async/await)</li><li>Học các khái niệm cơ bản của React: Components, Props, State</li><li>Tìm hiểu về React Hooks: useState, useEffect, useContext</li><li>Làm các dự án nhỏ để thực hành</li><li>Học thêm về React Router và State Management (Redux/Context API)</li></ol><p>Quan trọng nhất là thực hành nhiều!</p>",
    question_id: 1,
    status: 1,
    vote_score: 5,
    is_accepted: true,
    parent_id: null,
    created_by: mockUsers[0],
    created_at: "2025-09-15T17:00:00Z",
  },
  {
    id: 2,
    content:
      "<p>Mình khuyên bạn nên học qua các khóa học trực tuyến như:</p><ul><li>React Official Documentation (miễn phí và rất tốt)</li><li>FreeCodeCamp</li><li>The Odin Project</li></ul><p>Đừng quên join các community như CLB của mình để được hỗ trợ nhé!</p>",
    question_id: 1,
    status: 1,
    vote_score: 3,
    is_accepted: false,
    parent_id: null,
    created_by: mockUsers[3],
    created_at: "2025-09-15T18:30:00Z",
  },
  {
    id: 3,
    content:
      "<p>Với dự án thương mại điện tử, mình nghĩ PostgreSQL sẽ phù hợp hơn vì:</p><ul><li>Đảm bảo tính toàn vẹn dữ liệu với ACID</li><li>Hỗ trợ transactions tốt cho xử lý đơn hàng</li><li>Quan hệ giữa các bảng rõ ràng (sản phẩm, đơn hàng, khách hàng)</li></ul><p>MongoDB phù hợp hơn với dữ liệu phi cấu trúc hoặc cần scale nhanh.</p>",
    question_id: 2,
    status: 1,
    vote_score: 8,
    is_accepted: true,
    parent_id: null,
    created_by: mockUsers[2],
    created_at: "2025-09-12T11:30:00Z",
  },
  {
    id: 4,
    content:
      "<p>Một số cách tối ưu hiệu suất React:</p><ol><li>Sử dụng React.memo() để tránh re-render không cần thiết</li><li>Dùng useMemo() và useCallback() hooks</li><li>Code splitting với React.lazy() và Suspense</li><li>Virtualize long lists với react-window hoặc react-virtualized</li><li>Optimize images và assets</li></ol>",
    question_id: 3,
    status: 1,
    vote_score: 6,
    is_accepted: false,
    parent_id: null,
    created_by: mockUsers[0],
    created_at: "2025-09-10T15:30:00Z",
  },
  {
    id: 5,
    content:
      "<p>Deploy React lên Vercel rất đơn giản:</p><ol><li>Push code lên GitHub</li><li>Đăng ký tài khoản Vercel (miễn phí)</li><li>Import project từ GitHub</li><li>Vercel tự động detect React và config</li><li>Click Deploy!</li></ol><p>Chỉ mất 5 phút thôi!</p>",
    question_id: 5,
    status: 1,
    vote_score: 4,
    is_accepted: true,
    parent_id: null,
    created_by: mockUsers[0],
    created_at: "2025-09-05T12:00:00Z",
  },
];

// 5. DOCUMENTS DATA
// ================================================================

export const mockDocumentCategories = [
  { id: 1, name: "Tài liệu học tập", slug: "tai-lieu-hoc-tap" },
  { id: 2, name: "Hướng dẫn cài đặt", slug: "huong-dan-cai-dat" },
  { id: 3, name: "Báo cáo & Biên bản", slug: "bao-cao-bien-ban" },
  { id: 4, name: "Quy định CLB", slug: "quy-dinh-clb" },
  { id: 5, name: "Tài liệu dự án", slug: "tai-lieu-du-an" },
];

export const mockDocuments = [
  {
    id: 1,
    title: "Giáo trình React.js từ cơ bản đến nâng cao",
    slug: "giao-trinh-react-js-co-ban-nang-cao",
    description:
      "Tài liệu học React.js đầy đủ với các ví dụ thực tế và bài tập",
    file_url: "https://example.com/documents/react-guide.pdf",
    preview_url: "https://example.com/previews/react-guide.pdf",
    category: mockDocumentCategories[0],
    access_level: "public",
    status: 1,
    download_count: 234,
    created_by: mockUsers[0],
    created_at: "2025-08-15T10:00:00Z",
  },
  {
    id: 2,
    title: "Hướng dẫn cài đặt môi trường lập trình Node.js",
    slug: "huong-dan-cai-dat-nodejs",
    description:
      "Chi tiết các bước cài đặt Node.js, NPM và các tools cần thiết",
    file_url: "https://example.com/documents/nodejs-setup.pdf",
    preview_url: "https://example.com/previews/nodejs-setup.pdf",
    category: mockDocumentCategories[1],
    access_level: "public",
    status: 1,
    download_count: 189,
    created_by: mockUsers[2],
    created_at: "2025-08-20T14:30:00Z",
  },
  {
    id: 3,
    title: "Biên bản họp BCN tháng 9/2025",
    slug: "bien-ban-hop-bcn-thang-9-2025",
    description: "Nội dung cuộc họp BCN ngày 15/09/2025",
    file_url: "https://example.com/documents/meeting-09-2025.pdf",
    preview_url: null,
    category: mockDocumentCategories[2],
    access_level: "member_only",
    status: 1,
    download_count: 45,
    created_by: mockUsers[0],
    created_at: "2025-09-16T16:00:00Z",
  },
  {
    id: 4,
    title: "Quy định hoạt động CLB Lập trình",
    slug: "quy-dinh-hoat-dong-clb",
    description: "Các quy định và nội quy của CLB",
    file_url: "https://example.com/documents/club-rules.pdf",
    preview_url: "https://example.com/previews/club-rules.pdf",
    category: mockDocumentCategories[3],
    access_level: "public",
    status: 1,
    download_count: 156,
    created_by: mockUsers[0],
    created_at: "2025-07-01T09:00:00Z",
  },
  {
    id: 5,
    title: "Documentation dự án Website CLB",
    slug: "documentation-du-an-website-clb",
    description: "Tài liệu kỹ thuật chi tiết của dự án Website CLB",
    file_url: "https://example.com/documents/project-docs.pdf",
    preview_url: "https://example.com/previews/project-docs.pdf",
    category: mockDocumentCategories[4],
    access_level: "restricted",
    status: 1,
    download_count: 67,
    created_by: mockUsers[0],
    created_at: "2025-09-01T11:00:00Z",
  },
  {
    id: 6,
    title: "Git & GitHub - Từ Zero đến Hero",
    slug: "git-github-tu-zero-den-hero",
    description: "Hướng dẫn sử dụng Git và GitHub cho người mới bắt đầu",
    file_url: "https://example.com/documents/git-guide.pdf",
    preview_url: "https://example.com/previews/git-guide.pdf",
    category: mockDocumentCategories[0],
    access_level: "public",
    status: 1,
    download_count: 312,
    created_by: mockUsers[2],
    created_at: "2025-08-10T08:30:00Z",
  },
];

// 6. TRANSACTIONS DATA
// ================================================================

export const mockTransactions = [
  {
    id: 1,
    amount: 500000,
    type: 1, // income
    description: "Thu phí thành viên tháng 9/2025",
    attachment_url: "https://example.com/receipts/receipt-001.pdf",
    created_by: mockUsers[0],
    created_at: "2025-09-01T10:00:00Z",
  },
  {
    id: 2,
    amount: 300000,
    type: 0, // expense
    description: "Mua thiết bị cho workshop React Native",
    attachment_url: "https://example.com/invoices/invoice-001.pdf",
    created_by: mockUsers[3],
    created_at: "2025-09-05T14:30:00Z",
  },
  {
    id: 3,
    amount: 150000,
    type: 0,
    description: "Chi phí tổ chức Code Challenge",
    attachment_url: "https://example.com/invoices/invoice-002.pdf",
    created_by: mockUsers[0],
    created_at: "2025-09-10T09:15:00Z",
  },
  {
    id: 4,
    amount: 1000000,
    type: 1,
    description: "Tài trợ từ công ty ABC cho Hackathon 2025",
    attachment_url: "https://example.com/receipts/receipt-002.pdf",
    created_by: mockUsers[0],
    created_at: "2025-09-12T16:00:00Z",
  },
  {
    id: 5,
    amount: 200000,
    type: 0,
    description: "Chi phí in ấn tài liệu và giáo trình",
    attachment_url: "https://example.com/invoices/invoice-003.pdf",
    created_by: mockUsers[3],
    created_at: "2025-09-14T11:30:00Z",
  },
];

// 7. MEMBERSHIP APPLICATIONS DATA
// ================================================================

export const mockMembershipApplications = [
  {
    id: 1,
    fullname: "Hoàng Thị Mai",
    email: "hoangthimai@example.com",
    phone: "0945678901",
    student_year: "K23",
    major: "Công nghệ thông tin",
    interview_notes: null,
    status: 2, // pending
    created_at: "2025-09-18T10:30:00Z",
  },
  {
    id: 2,
    fullname: "Đỗ Văn Nam",
    email: "dovannam@example.com",
    phone: "0956789012",
    student_year: "K22",
    major: "Khoa học máy tính",
    interview_notes: "Ứng viên có kiến thức tốt về JavaScript và React",
    status: 1, // approved
    created_at: "2025-09-15T14:00:00Z",
  },
  {
    id: 3,
    fullname: "Vũ Thị Oanh",
    email: "vuthioanh@example.com",
    phone: "0967890123",
    student_year: "K23",
    major: "Công nghệ thông tin",
    interview_notes: "Cần cải thiện kỹ năng lập trình cơ bản",
    status: 0, // rejected
    created_at: "2025-09-12T09:00:00Z",
  },
  {
    id: 4,
    fullname: "Bùi Minh Phương",
    email: "buiminhphuong@example.com",
    phone: "0978901234",
    student_year: "K22",
    major: "Hệ thống thông tin",
    interview_notes: null,
    status: 2,
    created_at: "2025-09-19T16:45:00Z",
  },
];

// 8. PERMISSIONS DATA
// ================================================================

export const mockPermissions = [
  {
    id: 1,
    name: "post:create",
    description: "Tạo bài viết mới",
    module: "posts",
  },
  {
    id: 2,
    name: "post:edit",
    description: "Chỉnh sửa bài viết",
    module: "posts",
  },
  { id: 3, name: "post:delete", description: "Xóa bài viết", module: "posts" },
  {
    id: 4,
    name: "post:approve",
    description: "Duyệt bài viết",
    module: "posts",
  },
  {
    id: 5,
    name: "post:comment",
    description: "Bình luận bài viết",
    module: "posts",
  },
  { id: 6, name: "event:create", description: "Tạo sự kiện", module: "events" },
  {
    id: 7,
    name: "event:edit",
    description: "Chỉnh sửa sự kiện",
    module: "events",
  },
  { id: 8, name: "event:delete", description: "Xóa sự kiện", module: "events" },
  {
    id: 9,
    name: "event:register",
    description: "Đăng ký sự kiện",
    module: "events",
  },
  {
    id: 10,
    name: "event:checkin",
    description: "Điểm danh sự kiện",
    module: "events",
  },
  {
    id: 11,
    name: "document:upload",
    description: "Upload tài liệu",
    module: "documents",
  },
  {
    id: 12,
    name: "document:download",
    description: "Tải tài liệu",
    module: "documents",
  },
  {
    id: 13,
    name: "member:approve",
    description: "Duyệt thành viên",
    module: "members",
  },
  {
    id: 14,
    name: "finance:view",
    description: "Xem tài chính",
    module: "finance",
  },
  {
    id: 15,
    name: "finance:manage",
    description: "Quản lý tài chính",
    module: "finance",
  },
];

// 9. DASHBOARD STATS DATA
// ================================================================

export const mockDashboardStats = {
  overview: {
    total_members: 150,
    total_posts: 45,
    total_events: 12,
    total_documents: 28,
    pending_applications: 5,
    active_members: 142,
    upcoming_events: 3,
  },
  recent_activities: [
    {
      id: 1,
      type: "post_created",
      description: "Nguyễn Văn An đã tạo bài viết mới",
      post_title: "Giới thiệu về React.js",
      created_at: "2025-09-15T09:30:00Z",
    },
    {
      id: 2,
      type: "member_joined",
      description: "Trần Thị Bình đã gia nhập CLB",
      created_at: "2025-09-14T16:45:00Z",
    },
    {
      id: 3,
      type: "event_created",
      description: "Phạm Văn Dũng đã tạo sự kiện mới",
      event_title: "Workshop React Native",
      created_at: "2025-09-15T10:00:00Z",
    },
    {
      id: 4,
      type: "document_uploaded",
      description: "Lê Minh Châu đã upload tài liệu mới",
      document_title: "Git & GitHub Guide",
      created_at: "2025-09-14T14:20:00Z",
    },
    {
      id: 5,
      type: "comment_added",
      description: "Hoàng Thị Mai đã bình luận bài viết",
      post_title: "Node.js Best Practices",
      created_at: "2025-09-15T11:00:00Z",
    },
  ],
  monthly_stats: {
    posts_created: 8,
    events_held: 2,
    new_members: 12,
    documents_uploaded: 5,
    total_registrations: 145,
  },
  financial_summary: {
    total_income: 2500000,
    total_expense: 1200000,
    balance: 1300000,
    transactions_count: 15,
  },
  popular_posts: [
    { id: 5, title: "Dự án Website quản lý CLB", view_count: 421 },
    { id: 3, title: "Node.js Best Practices", view_count: 312 },
    { id: 1, title: "Giới thiệu về React.js", view_count: 245 },
  ],
};

// 10. PAGINATION HELPER
// ================================================================

export const createPagination = (currentPage, perPage, total) => {
  const totalPages = Math.ceil(total / perPage);
  return {
    current_page: currentPage,
    per_page: perPage,
    total: total,
    total_pages: totalPages,
    has_next: currentPage < totalPages,
    has_prev: currentPage > 1,
    next_page: currentPage < totalPages ? currentPage + 1 : null,
    prev_page: currentPage > 1 ? currentPage - 1 : null,
  };
};

// 11. API RESPONSE HELPERS
// ================================================================

export const createSuccessResponse = (message, data) => ({
  status: "success",
  message: message,
  data: data,
});

export const createErrorResponse = (message, code, details = null) => ({
  status: "error",
  message: message,
  error: {
    code: code,
    details: details,
  },
});

export const createValidationErrorResponse = (message, fields) => ({
  status: "error",
  message: message,
  error: {
    code: "VALIDATION_ERROR",
    fields: fields,
  },
});

// 12. EXAMPLE API RESPONSES
// ================================================================

// Ví dụ response cho GET /api/posts
export const mockPostsListResponse = {
  status: "success",
  message: "Lấy danh sách bài viết thành công",
  data: {
    posts: mockPosts,
    pagination: createPagination(1, 10, mockPosts.length),
  },
};

// Ví dụ response cho GET /api/posts/{slug}
export const mockPostDetailResponse = {
  status: "success",
  message: "Lấy chi tiết bài viết thành công",
  data: {
    post: mockPosts[0],
  },
};

// Ví dụ response cho GET /api/events
export const mockEventsListResponse = {
  status: "success",
  message: "Lấy danh sách sự kiện thành công",
  data: {
    events: mockEvents,
    pagination: createPagination(1, 10, mockEvents.length),
  },
};

// Ví dụ response cho GET /api/questions
export const mockQuestionsListResponse = {
  status: "success",
  message: "Lấy danh sách câu hỏi thành công",
  data: {
    questions: mockQuestions,
    pagination: createPagination(1, 10, mockQuestions.length),
  },
};

// Ví dụ response cho GET /api/auth/profile
export const mockProfileResponse = {
  status: "success",
  message: "Lấy thông tin thành công",
  data: {
    user: {
      ...mockUsers[0],
      member_profile: mockMemberProfiles[0],
    },
  },
};

// Ví dụ response cho GET /api/documents
export const mockDocumentsListResponse = {
  status: "success",
  message: "Lấy danh sách tài liệu thành công",
  data: {
    documents: mockDocuments,
    pagination: createPagination(1, 10, mockDocuments.length),
  },
};

// Ví dụ response cho GET /api/admin/dashboard
export const mockDashboardResponse = {
  status: "success",
  message: "Lấy thống kê tổng quan thành công",
  data: mockDashboardStats,
};

// 13. NOTIFICATIONS DATA (Future Feature)
// ================================================================

export const mockNotifications = [
  {
    id: 1,
    title: "Bài viết của bạn được duyệt",
    content: "Bài viết 'Giới thiệu về Vue.js' đã được duyệt và xuất bản",
    type: "post_approved",
    is_read: false,
    created_at: "2025-09-15T10:30:00Z",
  },
  {
    id: 2,
    title: "Sự kiện sắp diễn ra",
    content: "Workshop React Native sẽ diễn ra vào ngày 20/10/2025",
    type: "event_reminder",
    is_read: false,
    created_at: "2025-09-15T09:00:00Z",
  },
  {
    id: 3,
    title: "Có câu trả lời mới",
    content: "Câu hỏi của bạn đã nhận được câu trả lời mới",
    type: "answer_received",
    is_read: true,
    created_at: "2025-09-14T16:20:00Z",
  },
  {
    id: 4,
    title: "Đơn gia nhập được duyệt",
    content: "Chúc mừng! Đơn xin gia nhập CLB của bạn đã được chấp nhận",
    type: "application_approved",
    is_read: true,
    created_at: "2025-09-12T11:00:00Z",
  },
];

// 14. SEARCH RESULTS DATA
// ================================================================

export const mockSearchResults = {
  status: "success",
  message: "Tìm kiếm thành công",
  data: {
    results: {
      posts: [
        {
          id: 1,
          title: "Giới thiệu về React.js",
          type: "post",
          url: "/posts/gioi-thieu-ve-react-js",
          excerpt: "React.js là một thư viện JavaScript mã nguồn mở...",
        },
      ],
      events: [
        {
          id: 1,
          title: "Workshop React Native",
          type: "event",
          url: "/events/workshop-react-native-2025",
          excerpt: "Workshop về React Native dành cho các thành viên...",
        },
      ],
      documents: [
        {
          id: 1,
          title: "Giáo trình React.js từ cơ bản đến nâng cao",
          type: "document",
          url: "/documents/giao-trinh-react-js-co-ban-nang-cao",
          excerpt: "Tài liệu học React.js đầy đủ với các ví dụ thực tế...",
        },
      ],
      questions: [
        {
          id: 1,
          title: "Làm thế nào để học React hiệu quả?",
          type: "question",
          url: "/questions/lam-the-nao-de-hoc-react-hieu-qua",
          excerpt: "Tôi mới bắt đầu học lập trình web và muốn học React...",
        },
      ],
    },
    total_results: 4,
    search_time: "0.045s",
  },
};

// 15. EXPORT ALL
// ================================================================

// export {
//   mockRoles,
//   mockUsers,
//   mockMemberProfiles,
//   mockPermissions,

//   // Posts
//   mockPostCategories,
//   mockTags,
//   mockPosts,
//   mockComments,

//   // Events
//   mockEvents,
//   mockEventRegistrations,

//   // Q&A
//   mockQuestions,
//   mockAnswers,

//   // Documents
//   mockDocumentCategories,
//   mockDocuments,

//   // Finance
//   mockTransactions,

//   // Applications
//   mockMembershipApplications,

//   // Dashboard
//   mockDashboardStats,

//   // Notifications
//   mockNotifications,

//   // Search
//   mockSearchResults,

//   // Helpers
//   createPagination,
//   createSuccessResponse,
//   createErrorResponse,
//   createValidationErrorResponse,

//   // Example Responses
//   mockPostsListResponse,
//   mockPostDetailResponse,
//   mockEventsListResponse,
//   mockQuestionsListResponse,
//   mockProfileResponse,
//   mockDocumentsListResponse,
//   mockDashboardResponse,
// };
