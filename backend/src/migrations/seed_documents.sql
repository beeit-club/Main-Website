-- Seed data cho Document Categories (Bỏ cột description)
INSERT INTO `document_categories` (`id`, `name`, `slug`, `created_at`) VALUES
(1, 'Lập trình Web', 'lap-trinh-web', NOW()),
(2, 'Lập trình Di động', 'lap-trinh-di-dong', NOW()),
(3, 'Thiết kế đồ họa', 'thiet-ke-do-hoa', NOW()),
(4, 'Kỹ năng mềm', 'ky-nang-mem', NOW()),
(5, 'Tài nguyên Nội bộ', 'tai-nguyen-noi-bo', NOW())
ON DUPLICATE KEY UPDATE name=name;

-- Seed data cho Documents (Link nguồn bên thứ 3)
INSERT INTO `documents` (`title`, `slug`, `description`, `file_url`, `preview_url`, `category_id`, `access_level`, `status`, `download_count`, `created_at`) VALUES
-- Web Dev
('Fullstack Web Roadmap 2026', 'fullstack-web-roadmap-2026', 'Lộ trình học Web từ zero đến hero', 'https://roadmap.sh/full-stack', 'https://roadmap.sh/images/og-main.png', 1, 'public', 1, 150, NOW()),
('Next.js Documentation PDF', 'nextjs-documentation-pdf', 'Tài liệu chính thức Next.js offline', 'https://nextjs.org/docs', 'https://nextjs.org/static/blog/next-13/swc.png', 1, 'public', 1, 85, NOW()),

-- Mobile Dev
('Flutter Architecture Guide', 'flutter-architecture-guide', 'Hướng dẫn kiến trúc clean code trong Flutter', 'https://github.com/flutter/samples', 'https://storage.googleapis.com/cms-storage-bucket/7076035a051758a4f47c.png', 2, 'member_only', 1, 42, NOW()),

-- Design
('Figma UI Kit cho Người mới', 'figma-ui-kit-beginner', 'Bộ UI kit cơ bản để thực hành thiết kế', 'https://www.figma.com/community/file/123456789', 'https://s3-alpha.figma.com/hub/file/2837492/2345.png', 3, 'public', 1, 210, NOW()),

-- Soft Skills
('Kỹ năng thuyết trình chuyên nghiệp', 'ky-nang-thuyet-trinh-chuyen-nghiep', 'Slide hướng dẫn cách thuyết trình thu hút', 'https://docs.google.com/presentation/d/1abcxyz/edit', 'https://upload.wikimedia.org/wikipedia/commons/thumb/p/p4/Google_Presentations_icon_%282014-2020%29.svg/1200px-Google_Presentations_icon_%282014-2020%29.svg.png', 4, 'public', 1, 67, NOW()),

-- Internal
('Sổ tay Thành viên Bee IT', 'so-tay-thanh-vien-bee-it', 'Tất cả quy định và quyền lợi thành viên', 'https://docs.google.com/document/d/internal-link', 'https://cdn.dribbble.com/users/314275/screenshots/11075727/media/20265275e7a33c2a92286433602ce766.jpg', 5, 'member_only', 1, 300, NOW());