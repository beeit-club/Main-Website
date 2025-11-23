"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Calendar,
  Folder,
  Globe,
  Users,
  Lock,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { documentService } from "@/services/documentClient";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DocumentDetail({ document }) {
  const { user, isLogin } = useAuthStore();
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);

  if (!document) return null;

  const {
    id,
    title,
    description,
    file_url,
    preview_url,
    category,
    access_level,
    download_count,
    created_at,
    updated_at,
  } = document;

  const canDownload = () => {
    if (access_level === "public") return true;
    if (access_level === "member_only" && isLogin && user) return true;
    if (access_level === "restricted") {
      // Cần check xem user có trong assigned_users không
      // Tạm thời chỉ cho member và admin
      return isLogin && user;
    }
    return false;
  };

  const handleDownload = async () => {
    if (!canDownload()) {
      toast.error("Bạn không có quyền tải xuống tài liệu này");
      if (!isLogin) {
        router.push("/login");
      }
      return;
    }

    setIsDownloading(true);
    try {
      // Nếu có file_url trực tiếp và public, download trực tiếp
      if (access_level === "public" && file_url) {
        window.open(file_url, "_blank");
        toast.success("Đang tải xuống tài liệu...");
      } else {
        // Dùng API để lấy secure download link
        const response = await documentService.downloadDocument(id);
        if (response.status === "success" && response.data?.download_url) {
          window.open(response.data.download_url, "_blank");
          toast.success("Đang tải xuống tài liệu...");
        }
      }
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error(error?.message || "Không thể tải xuống tài liệu");
    } finally {
      setIsDownloading(false);
    }
  };

  const getAccessBadge = () => {
    switch (access_level) {
      case "public":
        return (
          <Badge className="bg-green-600 text-white">
            <Globe className="h-3 w-3 mr-1" />
            Công khai
          </Badge>
        );
      case "member_only":
        return (
          <Badge className="bg-blue-600 text-white">
            <Users className="h-3 w-3 mr-1" />
            Chỉ thành viên
          </Badge>
        );
      case "restricted":
        return (
          <Badge className="bg-orange-600 text-white">
            <Lock className="h-3 w-3 mr-1" />
            Hạn chế
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{title}</h1>
              {getAccessBadge()}
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        {/* Category & Date */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Folder className="h-5 w-5" />
              Thông tin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {category && (
              <div>
                <p className="text-sm text-muted-foreground">Danh mục</p>
                <Badge variant="outline">{category.name}</Badge>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Ngày tạo</p>
              <p className="font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {format(new Date(created_at), "dd MMMM yyyy", { locale: vi })}
              </p>
            </div>
            {updated_at && updated_at !== created_at && (
              <div>
                <p className="text-sm text-muted-foreground">Cập nhật lần cuối</p>
                <p className="font-semibold">
                  {format(new Date(updated_at), "dd MMMM yyyy", { locale: vi })}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Download Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Download className="h-5 w-5" />
              Tải xuống
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {download_count !== undefined && (
              <div>
                <p className="text-sm text-muted-foreground">Số lượt tải</p>
                <p className="font-semibold text-2xl">{download_count}</p>
              </div>
            )}
            <Button
              onClick={handleDownload}
              disabled={isDownloading || !canDownload()}
              className="w-full"
              size="lg"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tải...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Tải xuống
                </>
              )}
            </Button>
            {!canDownload() && (
              <p className="text-sm text-muted-foreground text-center">
                {!isLogin
                  ? "Vui lòng đăng nhập để tải xuống"
                  : "Bạn không có quyền tải xuống tài liệu này"}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {description && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Mô tả</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{description}</p>
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      {preview_url && (
        <Card>
          <CardHeader>
            <CardTitle>Xem trước</CardTitle>
          </CardHeader>
          <CardContent>
            <iframe
              src={preview_url}
              className="w-full h-96 border rounded-lg"
              title="Document Preview"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

