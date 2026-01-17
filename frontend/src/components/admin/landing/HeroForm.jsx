"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner"; // Assuming sonner is installed or use alert

import { landingServices } from "@/services/admin/landing";

export default function HeroForm({ data, onRefresh }) {
    const { register, handleSubmit, setValue } = useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (data) {
            setValue("title_line1", data.title_line1);
            setValue("title_line2", data.title_line2);
            setValue("subtitle", data.subtitle);
            setValue("background_image_url", data.background_image_url);
            setValue("background_image_alt", data.background_image_alt);
        }
    }, [data, setValue]);

    const onSubmit = async (formData) => {
        setLoading(true);
        try {
            if (data?.id) {
                await landingServices.updateItem("hero", data.id, formData);
            } else {
                await landingServices.createItem("hero", formData);
            }

            onRefresh();
            alert("Đã lưu Hero section!");
        } catch (error) {
            console.error(error);
            alert(error.message || "Lỗi khi lưu dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Chỉnh sửa Hero Section</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label>Dòng tiêu đề 1</label>
                            <Input {...register("title_line1")} placeholder="BUILDING THE" />
                        </div>
                        <div className="space-y-2">
                            <label>Dòng tiêu đề 2</label>
                            <Input {...register("title_line2")} placeholder="DIGITAL HIVE" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label>Mô tả phụ (Subtitle)</label>
                        <Textarea {...register("subtitle")} rows={3} />
                    </div>

                    <div className="space-y-2">
                        <label>Ảnh nền URL</label>
                        <Input {...register("background_image_url")} />
                        {data?.background_image_url && (
                            <div className="mt-2 relative h-40 w-full rounded overflow-hidden">
                                <img src={data.background_image_url} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label>Mô tả ảnh nền (Alt)</label>
                        <Input {...register("background_image_alt")} />
                    </div>

                    <Button type="submit" disabled={loading}>
                        {loading ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
