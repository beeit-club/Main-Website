"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { memoryFlowService } from "@/services/admin/memoryFlow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import * as yup from "yup";
import { revalidateLanding } from "@/utils/revalidateCache";

const memoryFlowSchema = yup.object().shape({
  title: yup
    .string()
    .required("Tiêu đề là bắt buộc")
    .min(3, "Tiêu đề phải có ít nhất 3 ký tự")
    .max(255, "Tiêu đề không được vượt quá 255 ký tự"),
  caption: yup
    .string()
    .required("Mô tả là bắt buộc")
    .min(5, "Mô tả phải có ít nhất 5 ký tự")
    .max(1000, "Mô tả không được vượt quá 1000 ký tự"),
  image_url: yup
    .string()
    .required("URL ảnh là bắt buộc")
    .url("URL ảnh không hợp lệ")
    .max(500, "URL không được vượt quá 500 ký tự"),
  display_order: yup
    .number()
    .integer("Thứ tự phải là số nguyên")
    .min(0, "Thứ tự phải >= 0")
    .nullable()
    .transform((value) => (value === "" ? null : value)),
  is_active: yup.boolean().default(true),
});

export default function AddMemoryFlowPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const form = useForm({
    resolver: yupResolver(memoryFlowSchema),
    defaultValues: {
      title: "",
      caption: "",
      image_url: "",
      display_order: null,
      is_active: true,
    },
  });

  const imageUrl = form.watch("image_url");

  // Update preview khi image_url thay đổi
  React.useEffect(() => {
    if (imageUrl && imageUrl.startsWith("http")) {
      setImagePreview(imageUrl);
    } else {
      setImagePreview(null);
    }
  }, [imageUrl]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await memoryFlowService.create({
        ...data,
        is_active: data.is_active ? 1 : 0,
      });
      // Revalidate landing page cache
      await revalidateLanding();
      toast.success("Tạo Memory Flow item thành công");
      router.push("/admin/landing/memory-flow");
    } catch (error) {
      toast.error(error?.message || "Tạo thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/landing/memory-flow">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Thêm Memory Flow Item</h1>
        <p className="text-muted-foreground">
          Thêm ảnh mới vào Memory Flow section
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin Memory Flow</CardTitle>
          <CardDescription>
            Điền thông tin bên dưới. Ảnh sẽ lấy từ URL (link bên ngoài).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL ảnh *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Dán link ảnh từ Facebook, Unsplash hoặc CDN khác
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Preview */}
              {imagePreview && (
                <div className="rounded-lg border p-4">
                  <Label className="text-sm font-medium mb-2 block">
            Preview ảnh
                  </Label>
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/logo.jpg";
                      }}
                    />
                  </div>
                </div>
              )}

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề *</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: TECH4TOURISM" {...field} />
                    </FormControl>
                    <FormDescription>
                      Tiêu đề ngắn gọn cho ảnh (3-255 ký tự)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="caption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="VD: CHUNG KẾT TECH4TOURISM 2025"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Mô tả chi tiết cho ảnh (5-1000 ký tự)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="display_order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thứ tự hiển thị</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Tự động"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? null : parseInt(value));
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Số nhỏ hiển thị trước (để trống = tự động)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-end">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <FormLabel className="!mt-0">Hiển thị ngay</FormLabel>
                      </div>
                      <FormDescription>
                        Bật để hiển thị item ngay sau khi tạo
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4">
                <Link href="/admin/landing/memory-flow" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Hủy
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    "Tạo mới"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

