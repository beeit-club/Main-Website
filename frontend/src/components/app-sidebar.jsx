"use client";

import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconMail,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { User, Layout, BarChart3, Mail, UsersRound, Settings } from "lucide-react";

const data = {
  user: {
    name: "Hairobet",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    // 1. Tổng quan
    {
      title: "Bảng điều khiển",
      url: "/admin/dashboard",
      icon: IconDashboard,
    },
    // 2. Quản lý người dùng và quyền
    {
      title: "Người dùng",
      url: "/admin/users",
      icon: User,
    },
    {
      title: "Thành viên",
      url: "/admin/members",
      icon: IconUsers,
    },
    {
      title: "Duyệt thành viên",
      url: "/admin/members/requests",
      icon: IconListDetails,
    },
    {
      title: "Vai trò & Quyền",
      url: "/admin/roles-permissions",
      icon: IconSettings,
    },
    {
      title: "Gán quyền",
      url: "/admin/assign-permissions",
      icon: IconUsers,
    },
    // 3. Nội dung & Bài viết
    {
      title: "Bài viết",
      url: "/admin/posts",
      icon: IconChartBar,
    },
    {
      title: "Danh mục",
      url: "/admin/categories",
      icon: IconUsers,
    },
    {
      title: "Thẻ",
      url: "/admin/tags",
      icon: IconFolder,
    },
    // 4. Tuyển dụng & Ứng viên
    {
      title: "Đơn đăng ký",
      url: "/admin/applications",
      icon: IconUsers,
    },
    {
      title: "Phỏng vấn",
      url: "/admin/interviews",
      icon: IconUsers,
    },
    {
      title: "Câu hỏi",
      url: "/admin/questions",
      icon: IconUsers,
    },
    // 5. Tài liệu
    {
      title: "Tài liệu",
      url: "/admin/documents",
      icon: IconUsers,
    },
    {
      title: "Danh mục tài liệu",
      url: "/admin/document-categories",
      icon: IconUsers,
    },
    // 6. Giao dịch & Email
    {
      title: "Giao dịch",
      url: "/admin/transactions",
      icon: IconUsers,
    },
    {
      title: "Mẫu email",
      url: "/admin/email-templates",
      icon: IconMail,
    },
    {
      title: "Ánh xạ Email",
      url: "/admin/email-mappings",
      icon: IconSettings,
    },
    // 7. BeeIT Landing Page Management
    {
      title: "BeeIT - Hero",
      url: "/admin/beeit/hero",
      icon: Layout,
    },
    {
      title: "BeeIT - Statistics",
      url: "/admin/beeit/stats",
      icon: BarChart3,
    },
    {
      title: "BeeIT - Leaders",
      url: "/admin/beeit/leaders",
      icon: UsersRound,
    },
    {
      title: "BeeIT - Footer",
      url: "/admin/beeit/footer",
      icon: Settings,
    },
    {
      title: "BeeIT - Email Submissions",
      url: "/admin/beeit/email-submissions",
      icon: Mail,
    },
    {
      title: "BeeIT - Achievements",
      url: "/admin/beeit/achievements",
      icon: IconChartBar,
    },
    {
      title: "BeeIT - Photos",
      url: "/admin/beeit/photos",
      icon: IconCamera,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Cài đặt",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Trợ giúp",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Tìm kiếm",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Bee IT</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
