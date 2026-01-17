"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import HeroForm from "@/components/admin/landing/HeroForm";
import ListForm from "@/components/admin/landing/ListForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Configuration for fields of each section
const SECTION_CONFIG = {
    stats: [
        { name: "label", label: "Nhãn (Label)", type: "text" },
        { name: "value", label: "Giá trị (Number)", type: "number" },
        { name: "suffix", label: "Đơn vị (Suffix)", type: "text" },
    ],
    leaders: [
        { name: "name", label: "Họ và tên", type: "text" },
        { name: "role", label: "Chức vụ", type: "text" },
        { name: "image_url", label: "Ảnh đại diện", type: "text" },
        { name: "bio", label: "Tiểu sử", type: "textarea" },
        { name: "email", label: "Email", type: "text" },
    ],
    achievements: [
        { name: "title", label: "Tiêu đề", type: "text" },
        { name: "year", label: "Năm", type: "text" },
        { name: "description", label: "Mô tả", type: "text" },
        { name: "image", label: "Hình ảnh", type: "text" },
        { name: "row_number", label: "Hàng (Row)", type: "number" },
    ],
    timeline: [
        { name: "year", label: "Thời gian", type: "text" },
        { name: "title", label: "Sự kiện", type: "text" },
        { name: "description", label: "Mô tả", type: "textarea" },
        { name: "image", label: "Hình ảnh", type: "text" },
    ],
    activities: [
        { name: "title", label: "Tên hoạt động", type: "text" },
        { name: "icon", label: "Icon Code (Lucide)", type: "text" },
        { name: "description", label: "Mô tả", type: "textarea" },
        { name: "image", label: "Hình ảnh", type: "text" },
    ],
    projects: [
        { name: "title", label: "Tên dự án", type: "text" },
        { name: "category", label: "Danh mục", type: "text" },
        { name: "description", label: "Mô tả", type: "textarea" },
        { name: "tech_stack", label: "Công nghệ (JSON array)", type: "json" },
        { name: "image", label: "Hình ảnh", type: "text" },
    ],
    gallery: [
        { name: "image_url", label: "Link ảnh", type: "text" },
        { name: "caption", label: "Mô tả (Caption)", type: "text" },
        { name: "height_class", label: "Chiều cao (vd: h-64)", type: "text" },
    ],
    photos: [
        { name: "image_url", label: "Link ảnh", type: "text" },
        { name: "alt_text", label: "Mô tả ảnh", type: "text" },
    ],
    testimonials: [
        { name: "author", label: "Người viết", type: "text" },
        { name: "role", label: "Chức danh", type: "text" },
        { name: "content", label: "Nội dung", type: "textarea" },
        { name: "avatar_url", label: "Avatar", type: "text" },
        { name: "year_info", label: "Niên khóa", type: "text" },
    ],
    join_process: [
        { name: "title", label: "Bước", type: "text" },
        { name: "date_range", label: "Thời gian", type: "text" },
        { name: "icon", label: "Icon", type: "text" },
        { name: "description", label: "Mô tả", type: "textarea" },
    ],
};

const SECTION_TITLES = {
    hero: "Hero Section",
    stats: "Thống kê",
    leaders: "Ban chủ nhiệm",
    achievements: "Thành tích",
    timeline: "Lịch sử",
    activities: "Hoạt động",
    projects: "Dự án",
    gallery: "Thư viện ảnh",
    photos: "Hậu trường",
    testimonials: "Cảm nhận thành viên",
    join_process: "Quy trình tuyển",
};

import { landingServices } from "@/services/admin/landing";

export default function SectionPage() {
    const { section } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const jsonData = await landingServices.getSectionData(section);
            // If hero, it returns array but we take first item usually, but API returns array
            setData(jsonData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (section) fetchData();
    }, [section]);

    const title = SECTION_TITLES[section] || section;

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/landing">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Quản lý: {title}</h1>
            </div>

            {section === "hero" ? (
                <HeroForm data={data && data.length > 0 ? data[0] : null} onRefresh={fetchData} />
            ) : (
                <ListForm
                    section={section}
                    data={data || []}
                    fields={SECTION_CONFIG[section] || []}
                    onRefresh={fetchData}
                />
            )}
        </div>
    );
}
