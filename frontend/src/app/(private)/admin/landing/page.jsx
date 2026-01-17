"use client";

import Link from "next/link";
import {
    Layout,
    BarChart2,
    Users,
    Award,
    History,
    Calendar,
    FolderGit2,
    Image as ImageIcon,
    MessageSquare,
    FileInput,
    Camera
} from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const sections = [
    {
        title: "Hero Section",
        description: "Banner chính, tiêu đề và hình nền",
        icon: Layout,
        href: "/admin/landing/hero",
        color: "text-blue-500",
    },
    {
        title: "Thống kê (Stats)",
        description: "Các con số ấn tượng về CLB",
        icon: BarChart2,
        href: "/admin/landing/stats",
        color: "text-green-500",
    },
    {
        title: "Ban chủ nhiệm (Leaders)",
        description: "Thông tin leaders và cố vấn",
        icon: Users,
        href: "/admin/landing/leaders",
        color: "text-purple-500",
    },
    {
        title: "Thành tích (Achievements)",
        description: "Các giải thưởng và cột mốc đáng nhớ",
        icon: Award,
        href: "/admin/landing/achievements",
        color: "text-yellow-500",
    },
    {
        title: "Dòng lịch sử (Timeline)",
        description: "Lịch sử hình thành và phát triển",
        icon: History,
        href: "/admin/landing/timeline",
        color: "text-orange-500",
    },
    {
        title: "Hoạt động (Activities)",
        description: "Các hoạt động chính của CLB",
        icon: Calendar,
        href: "/admin/landing/activities",
        color: "text-red-500",
    },
    {
        title: "Dự án (Projects)",
        description: "Sản phẩm và dự án tiêu biểu",
        icon: FolderGit2,
        href: "/admin/landing/projects",
        color: "text-cyan-500",
    },
    {
        title: "Thư viện ảnh (Gallery/Moments)",
        description: "Khoảnh khắc thành viên",
        icon: Camera,
        href: "/admin/landing/gallery",
        color: "text-pink-500",
    },
    {
        title: "Hậu trường (Behind The Code)",
        description: "Ảnh vui nhộn, chaos mode",
        icon: ImageIcon,
        href: "/admin/landing/photos",
        color: "text-indigo-500",
    },
    {
        title: "Cảm nhận (Testimonials)",
        description: "Review từ cựu thành viên",
        icon: MessageSquare,
        href: "/admin/landing/testimonials",
        color: "text-teal-500",
    },
    {
        title: "Quy trình tuyển (Join Process)",
        description: "Các bước tham gia CLB",
        icon: FileInput,
        href: "/admin/landing/join_process",
        color: "text-gray-500",
    },
];

export default function LandingDashboardPage() {
    return (
        <div className="container mx-auto py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Quản lý Landing Page</h1>
                <p className="text-muted-foreground">
                    Chọn mục bên dưới để chỉnh sửa nội dung hiển thị trên trang chủ BeeIT.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sections.map((section) => (
                    <Link key={section.href} href={section.href}>
                        <Card className="h-full hover:bg-accent/50 transition-colors cursor-pointer border-l-4 border-l-transparent hover:border-l-primary/50">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {section.title}
                                </CardTitle>
                                <section.icon className={`h-4 w-4 ${section.color}`} />
                            </CardHeader>
                            <CardContent>
                                <CardDescription>{section.description}</CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
