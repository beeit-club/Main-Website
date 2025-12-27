"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { founderService } from "@/services/admin/founder";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import * as yup from "yup";
import { revalidateLanding } from "@/utils/revalidateCache";

const founderSchema = yup.object().shape({
  name: yup
    .string()
    .required("Họ tên là bắt buộc")
    .min(3, "Họ tên phải có ít nhất 3 ký tự")
    .max(255, "Họ tên không được vượt quá 255 ký tự"),
  role: yup
    .string()
    .required("Vai trò là bắt buộc")
    .min(3, "Vai trò phải có ít nhất 3 ký tự")
    .max(255, "Vai trò không được vượt quá 255 ký tự"),
  image_url: yup
    .string()
    .required("URL ảnh là bắt buộc")
    .url("URL ảnh không hợp lệ")
    .max(500, "URL không được vượt quá 500 ký tự"),
  bio: yup
    .string()
    .nullable()
    .max(2000, "Tiểu sử không được vượt quá 2000 ký tự"),
  achievements: yup.array().of(yup.string().required("Thành tựu không được để trống")),
  social_email: yup
    .string()
    .nullable()
    .email("Email không hợp lệ")
    .max(255, "Email không được vượt quá 255 ký tự"),
  social_linkedin: yup
    .string()
    .nullable()
    .url("LinkedIn URL không hợp lệ")
    .max(255, "LinkedIn URL không được vượt quá 255 ký tự"),
  social_github: yup
    .string()
    .nullable()
    .url("GitHub URL không hợp lệ")
    .max(255, "GitHub URL không được vượt quá 255 ký tự"),
  display_order: yup
    .number()
    .integer("Thứ tự phải là số nguyên")
    .min(0, "Thứ tự phải >= 0")
    .nullable()
    .transform((value) => (value === "" ? null : value)),
  is_active: yup.boolean().default(true),
  is_founder: yup.boolean().default(false),
});

export default function AddFounderPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const form = useForm({
    resolver: yupResolver(founderSchema),
    defaultValues: {
      name: "",
      role: "",
      image_url: "",
      bio: "",
      achievements: [],
      social_email: "",
      social_linkedin: "",
      social_github: "",
      display_order: null,
      is_active: true,
      is_founder: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "achievements",
  });

  const imageUrl = form.watch("image_url");

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
      // Convert achievements array to JSON
      const payload = {
        ...data,
        achievements: data.achievements.length > 0 ? JSON.stringify(data.achievements) : null,
        is_active: data.is_active ? 1 : 0,
        is_founder: data.is_founder ? 1 : 0,
        social_email: data.social_email || null,
        social_linkedin: data.social_linkedin || null,
        social_github: data.social_github || null,
        bio: data.bio || null,
      };
      await founderService.create(payload);
      // Revalidate landing page cache
      await revalidateLanding();
      toast.success("Tạo Founder/Member thành công");
      router.push("/admin/landing/founders");
    } catch (error) {
      toast.error(error?.message || "Tạo thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/landing/founders">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Thêm Founder/Member</h1>
        <p className="text-muted-foreground">
          Thêm thông tin Người sáng lập hoặc Thành viên Ban Chủ Nhiệm
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin Founder/Member</CardTitle>
          <CardDescription>
            Điền thông tin bên dưới. Ảnh sẽ lấy từ URL (link bên ngoài).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="is_founder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === "true")}
                      value={field.value ? "true" : "false"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Người sáng lập</SelectItem>
                        <SelectItem value="false">Ban Chủ Nhiệm</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Chọn loại: Người sáng lập hoặc Thành viên Ban Chủ Nhiệm
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              {imagePreview && (
                <div className="rounded-lg border p-4">
                  <Label className="text-sm font-medium mb-2 block">
                    Preview ảnh
                  </Label>
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border mx-auto">
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ tên *</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: Thầy Nguyễn Hoàng Anh" {...field} />
                    </FormControl>
                    <FormDescription>
                      Họ và tên đầy đủ (3-255 ký tự)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vai trò *</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: Người sáng lập BeeIT Club" {...field} />
                    </FormControl>
                    <FormDescription>
                      Vai trò/chức danh (3-255 ký tự)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiểu sử</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="VD: Giảng viên tâm huyết, khởi xướng BeeIT từ 2023..."
                        rows={4}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Tiểu sử ngắn gọn (tối đa 2000 ký tự)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Thành tựu</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append("")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm thành tựu
                  </Button>
                </div>
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`achievements.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              placeholder={`Thành tựu ${index + 1}`}
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                {fields.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Chưa có thành tựu nào. Nhấn "Thêm thành tựu" để thêm.
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <Label>Liên kết mạng xã hội</Label>
                <FormField
                  control={form.control}
                  name="social_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@beeit.club"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="social_linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://linkedin.com/in/..."
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="social_github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://github.com/..."
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                <Link href="/admin/landing/founders" className="flex-1">
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

