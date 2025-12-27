"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { beeitServices } from "@/services/admin/beeitServices";
import { revalidateBeeit } from "@/utils/revalidateCache";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import * as yup from "yup";

const achievementSchema = yup.object().shape({
  title: yup.string().required("Tiêu đề là bắt buộc").max(200),
  year: yup.string().required("Năm là bắt buộc").max(20),
  description: yup.string().max(1000).nullable(),
  image_url: yup.string().url("URL không hợp lệ").max(500).nullable(),
  row_number: yup.number().oneOf([1, 2], "Row number phải là 1 hoặc 2").default(1),
  display_order: yup.number().integer().min(0).default(0),
  status: yup.string().oneOf(["active", "inactive"]).default("active"),
});

export default function EditAchievementPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);

  const form = useForm({
    resolver: yupResolver(achievementSchema),
    defaultValues: {
      title: "",
      year: "",
      description: "",
      image_url: "",
      row_number: 1,
      display_order: 0,
      status: "active",
    },
  });

  useEffect(() => {
    loadAchievement();
  }, [id]);

  const loadAchievement = async () => {
    try {
      setLoading(true);
      const res = await beeitServices.achievements.getById(id);
      const achievement = res?.data?.data?.achievement;
      if (achievement) {
        form.reset(achievement);
        setImagePreview(achievement.image_url);
      }
    } catch (error) {
      toast.error("Không thể tải Achievement");
      console.error(error);
      router.push("/admin/beeit/achievements");
    } finally {
      setLoading(false);
    }
  };

  const imageUrl = form.watch("image_url");

  React.useEffect(() => {
    if (imageUrl) {
      setImagePreview(imageUrl);
    }
  }, [imageUrl]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await beeitServices.achievements.update(id, data);
      
      // Revalidate cache để cập nhật ngay lập tức
      await revalidateBeeit();
      
      toast.success("Cập nhật Achievement thành công! Trang sẽ được cập nhật ngay lập tức.");
      router.push("/admin/beeit/achievements");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Cập nhật Achievement thất bại");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/beeit/achievements">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Chỉnh sửa Achievement</h1>
          <p className="text-muted-foreground mt-2">
            Cập nhật thông tin Achievement
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cơ bản</CardTitle>
                  <CardDescription>Thông tin chính về Achievement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiêu đề *</FormLabel>
                        <FormControl>
                          <Input placeholder="HACKATHON 2023" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Năm *</FormLabel>
                        <FormControl>
                          <Input placeholder="2023" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Vô địch Quốc gia AI"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL ảnh</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://..."
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setImagePreview(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="row_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Row Number *</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn row" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Row 1 (Scroll Right)</SelectItem>
                            <SelectItem value="2">Row 2 (Scroll Left)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="display_order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thứ tự hiển thị</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trạng thái</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Hoạt động</SelectItem>
                            <SelectItem value="inactive">Không hoạt động</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Preview */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Xem trước</CardTitle>
                </CardHeader>
                <CardContent>
                  {imagePreview ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden border">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/logo.jpg";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="aspect-video rounded-lg border flex items-center justify-center bg-muted">
                      <p className="text-muted-foreground">Chưa có ảnh</p>
                    </div>
                  )}
                  <div className="mt-4 space-y-2">
                    <h3 className="font-semibold">{form.watch("title") || "Tiêu đề"}</h3>
                    <p className="text-sm text-muted-foreground">
                      {form.watch("year") || "Năm"}
                    </p>
                    {form.watch("description") && (
                      <p className="text-sm mt-2">{form.watch("description")}</p>
                    )}
                    <div className="text-xs text-muted-foreground mt-2">
                      Row: {form.watch("row_number") === 1 ? "Row 1 (Scroll Right)" : "Row 2 (Scroll Left)"}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hành động</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang cập nhật...
                      </>
                    ) : (
                      "Cập nhật Achievement"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

