"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { authServices } from "@/services/auth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { profileUpdateSchema } from "@/validation/profileSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function EditProfilePage() {
  const router = useRouter();
  const { user: authUser, isLogin, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: yupResolver(profileUpdateSchema),
    defaultValues: {
      fullname: "",
      phone: "",
      bio: "",
      avatar_url: "",
    },
  });

  useEffect(() => {
    // Kiểm tra đăng nhập
    if (!isLogin) {
      toast.error("Vui lòng đăng nhập để chỉnh sửa thông tin");
      router.push("/login");
      return;
    }

    // Fetch profile từ server
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await authServices.getProfile();
        if (res.status === "success") {
          const profile = res.data.user;
          form.reset({
            fullname: profile.fullname || "",
            phone: profile.phone || "",
            bio: profile.bio || "",
            avatar_url: profile.avatar_url || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Không thể tải thông tin cá nhân");
        if (error?.response?.status === 401) {
          router.push("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [isLogin, router, form]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Chỉ gửi các field có giá trị (loại bỏ empty strings)
      const updateData = {};
      if (data.fullname && data.fullname.trim()) {
        updateData.fullname = data.fullname.trim();
      }
      if (data.phone && data.phone.trim()) {
        updateData.phone = data.phone.trim();
      }
      if (data.bio !== undefined) {
        updateData.bio = data.bio?.trim() || null;
      }
      if (data.avatar_url && data.avatar_url.trim()) {
        updateData.avatar_url = data.avatar_url.trim();
      }

      // Kiểm tra có ít nhất 1 field để update
      if (Object.keys(updateData).length === 0) {
        toast.error("Vui lòng điền ít nhất một trường để cập nhật");
        setIsSubmitting(false);
        return;
      }

      const res = await authServices.updateProfile(updateData);
      if (res.status === "success") {
        toast.success("Cập nhật thông tin thành công!");
        
        // Update user trong store
        if (res.data.user) {
          setUser(res.data.user);
        }
        
        // Redirect về trang profile
        router.push("/profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error?.message || "Không thể cập nhật thông tin. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 md:py-12">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 md:py-12">
      <div className="mb-6">
        <Link
          href="/profile"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại trang cá nhân
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold">Chỉnh sửa thông tin cá nhân</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>
                Cập nhật thông tin cá nhân của bạn. Email và vai trò không thể thay đổi.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Preview */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={form.watch("avatar_url") || undefined}
                    alt={form.watch("fullname") || "Avatar"}
                  />
                  <AvatarFallback className="text-xl">
                    {form.watch("fullname")?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="avatar_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL ảnh đại diện</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/avatar.jpg"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Dán URL ảnh đại diện của bạn (hoặc để trống)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Họ tên */}
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Họ và tên <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập họ và tên của bạn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Số điện thoại */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0123456789"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Số điện thoại (10-11 chữ số, tùy chọn)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tiểu sử */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiểu sử</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Giới thiệu về bản thân..."
                        className="min-h-[100px]"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Mô tả ngắn gọn về bản thân (tối đa 500 ký tự)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/profile")}
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}

