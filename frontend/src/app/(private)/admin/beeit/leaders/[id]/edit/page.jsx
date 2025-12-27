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
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import * as yup from "yup";

const leaderSchema = yup.object().shape({
  name: yup.string().required("Tên là bắt buộc").max(200),
  role: yup.string().required("Vai trò là bắt buộc").max(200),
  image_url: yup.string().url("URL không hợp lệ").max(500).nullable(),
  bio: yup.string().max(2000).nullable(),
  github_url: yup.string().url("URL không hợp lệ").max(500).nullable(),
  linkedin_url: yup.string().url("URL không hợp lệ").max(500).nullable(),
  facebook_url: yup.string().url("URL không hợp lệ").max(500).nullable(),
  email: yup.string().email("Email không hợp lệ").max(200).nullable(),
  display_order: yup.number().integer().min(0).default(0),
  status: yup.string().oneOf(["active", "inactive"]).default("active"),
});

export default function EditLeaderPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);

  const form = useForm({
    resolver: yupResolver(leaderSchema),
    defaultValues: {
      name: "",
      role: "",
      image_url: "",
      bio: "",
      github_url: "",
      linkedin_url: "",
      facebook_url: "",
      email: "",
      display_order: 0,
      status: "active",
    },
  });

  useEffect(() => {
    if (id) {
      loadLeader();
    }
  }, [id]);

  const loadLeader = async () => {
    try {
      setLoading(true);
      const res = await beeitServices.leaders.getById(id);
      if (res?.data?.data?.leader) {
        const leader = res.data.data.leader;
        form.reset(leader);
        setImagePreview(leader.image_url);
      }
    } catch (error) {
      toast.error("Không thể tải thông tin Leader");
      console.error(error);
      router.push("/admin/beeit/leaders");
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
      await beeitServices.leaders.update(id, data);
      
      // Revalidate cache để cập nhật ngay lập tức
      await revalidateBeeit();
      
      toast.success("Cập nhật Leader thành công! Trang sẽ được cập nhật ngay lập tức.");
      router.push("/admin/beeit/leaders");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Cập nhật thất bại");
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
        <Link href="/admin/beeit/leaders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Chỉnh sửa Leader</h1>
          <p className="text-muted-foreground mt-2">
            Cập nhật thông tin Leader
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Same as Add page */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
                <CardDescription>Thông tin chính về Leader</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nguyễn Văn A" {...field} />
                      </FormControl>
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
                        <Input placeholder="FOUNDER / CỐ VẤN" {...field} />
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

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiểu sử</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mô tả về Leader..."
                          rows={6}
                          {...field}
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
                <CardTitle>Social Links</CardTitle>
                <CardDescription>Liên kết mạng xã hội</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="github_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://github.com/..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="linkedin_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://linkedin.com/..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="facebook_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://facebook.com/..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="leader@beeit.club" {...field} />
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
                  <h3 className="font-semibold">{form.watch("name") || "Tên Leader"}</h3>
                  <p className="text-sm text-muted-foreground">
                    {form.watch("role") || "Vai trò"}
                  </p>
                  {form.watch("bio") && (
                    <p className="text-sm mt-2">{form.watch("bio")}</p>
                  )}
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
                      Đang lưu...
                    </>
                  ) : (
                    "Lưu thay đổi"
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

