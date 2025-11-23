"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { authServices } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Edit
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, isLogin, isLoading: authLoading } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Đợi authStore init xong trước khi check đăng nhập
    if (authLoading) {
      return; // Chưa init xong, đợi tiếp
    }

    // Kiểm tra đăng nhập (sau khi đã init xong)
    if (!isLogin) {
      toast.error("Vui lòng đăng nhập để xem trang cá nhân");
      router.push("/login");
      return;
    }

    // Fetch profile từ server
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await authServices.getProfile();
        if (res.status === "success") {
          setProfile(res.data.user);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Không thể tải thông tin cá nhân");
        // Nếu lỗi 401, redirect về login
        if (error?.response?.status === 401) {
          router.push("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [isLogin, authLoading, router]);

  // Hiển thị loading khi đang init auth hoặc đang fetch profile
  if (authLoading || isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 md:py-12">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container max-w-4xl mx-auto py-8 md:py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Không thể tải thông tin cá nhân</p>
            <Button onClick={() => router.push("/login")} className="mt-4">
              Đăng nhập
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    fullname,
    email,
    phone,
    avatar_url,
    bio,
    created_at,
  } = profile;

  return (
    <div className="container max-w-4xl mx-auto py-8 md:py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl md:text-4xl font-bold">Trang cá nhân</h1>
        <Button asChild>
          <Link href="/profile/edit">
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Cột trái: Avatar và thông tin cơ bản */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={avatar_url} alt={fullname} />
                <AvatarFallback className="text-2xl">
                  {fullname?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">{fullname}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Bỏ phần hiển thị role và trạng thái */}
          </CardContent>
        </Card>

        {/* Cột phải: Thông tin chi tiết */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Họ tên */}
            <div className="flex items-start space-x-4">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Họ và tên</p>
                <p className="text-base font-semibold">{fullname || "Chưa cập nhật"}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-4">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-base">{email || "Chưa cập nhật"}</p>
              </div>
            </div>

            {/* Số điện thoại */}
            <div className="flex items-start space-x-4">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Số điện thoại</p>
                <p className="text-base">{phone || "Chưa cập nhật"}</p>
              </div>
            </div>

            {/* Ngày tham gia */}
            <div className="flex items-start space-x-4">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Ngày tham gia</p>
                <p className="text-base">
                  {created_at
                    ? format(new Date(created_at), "dd MMMM yyyy", { locale: vi })
                    : "Chưa có thông tin"}
                </p>
              </div>
            </div>

            {/* Tiểu sử */}
            {bio && (
              <div className="flex items-start space-x-4">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Tiểu sử</p>
                  <p className="text-base whitespace-pre-wrap">{bio}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

