"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { beeitServices } from "@/services/admin/beeitServices";
import { revalidateBeeit } from "@/utils/revalidateCache";
import { Plus, Loader2, Edit2, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function PhotosPage() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const res = await beeitServices.photos.getAll();
      setPhotos(res?.data?.data?.data || []);
    } catch (error) {
      toast.error("Không thể tải danh sách Photos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa Photo này?")) return;

    try {
      setDeletingId(id);
      await beeitServices.photos.delete(id);
      
      // Revalidate cache để cập nhật ngay lập tức
      await revalidateBeeit();
      
      toast.success("Xóa Photo thành công! Trang sẽ được cập nhật ngay lập tức.");
      await loadPhotos();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Xóa thất bại");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Sắp xếp theo display_order
  const sortedPhotos = [...photos].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Photos</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý hình ảnh hiển thị trong phần Behind The Code
          </p>
        </div>
        <Link href="/admin/beeit/photos/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm Photo
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sortedPhotos.map((photo) => (
          <Card key={photo.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-sm">Photo #{photo.id}</CardTitle>
                  {photo.alt_text && (
                    <CardDescription className="mt-1 line-clamp-1">
                      {photo.alt_text}
                    </CardDescription>
                  )}
                </div>
                <div className="flex gap-1">
                  <Link href={`/admin/beeit/photos/${photo.id}/edit`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(photo.id)}
                    disabled={deletingId === photo.id}
                    className="h-8 w-8 text-destructive"
                  >
                    {deletingId === photo.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {photo.image_url && (
                  <div className="relative aspect-square rounded-lg overflow-hidden border">
                    <img
                      src={photo.image_url}
                      alt={photo.alt_text || "Photo"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/logo.jpg";
                      }}
                    />
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  Thứ tự: {photo.display_order} | Status:{" "}
                  <Badge
                    variant={photo.status === "active" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {photo.status === "active" ? "Hoạt động" : "Không hoạt động"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {photos.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            Chưa có Photo nào. Hãy thêm Photo đầu tiên!
          </CardContent>
        </Card>
      )}
    </div>
  );
}

