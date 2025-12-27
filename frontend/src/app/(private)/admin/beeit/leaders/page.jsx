"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { beeitServices } from "@/services/admin/beeitServices";
import { revalidateBeeit } from "@/utils/revalidateCache";
import { Plus, Loader2, Edit2, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function LeadersPage() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadLeaders();
  }, []);

  const loadLeaders = async () => {
    try {
      setLoading(true);
      const res = await beeitServices.leaders.getAll();
      setLeaders(res?.data?.data?.data || []);
    } catch (error) {
      toast.error("Không thể tải danh sách Leaders");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa Leader này?")) return;

    try {
      setDeletingId(id);
      await beeitServices.leaders.delete(id);
      
      // Revalidate cache để cập nhật ngay lập tức
      await revalidateBeeit();
      
      toast.success("Xóa Leader thành công! Trang sẽ được cập nhật ngay lập tức.");
      await loadLeaders();
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

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Leaders</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý thông tin Cố vấn và Ban Chủ Nhiệm
          </p>
        </div>
        <Link href="/admin/beeit/leaders/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm Leader
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {leaders.map((leader) => (
          <Card key={leader.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{leader.name}</CardTitle>
                  <CardDescription className="mt-1">{leader.role}</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Link href={`/admin/beeit/leaders/${leader.id}/edit`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(leader.id)}
                    disabled={deletingId === leader.id}
                    className="h-8 w-8 text-destructive"
                  >
                    {deletingId === leader.id ? (
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
                {leader.image_url && (
                  <div className="relative aspect-video rounded-lg overflow-hidden border">
                    <img
                      src={leader.image_url}
                      alt={leader.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/logo.jpg";
                      }}
                    />
                  </div>
                )}
                {leader.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {leader.bio}
                  </p>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  {leader.github_url && (
                    <Badge variant="outline" className="text-xs">
                      GitHub
                    </Badge>
                  )}
                  {leader.linkedin_url && (
                    <Badge variant="outline" className="text-xs">
                      LinkedIn
                    </Badge>
                  )}
                  {leader.facebook_url && (
                    <Badge variant="outline" className="text-xs">
                      Facebook
                    </Badge>
                  )}
                  {leader.email && (
                    <Badge variant="outline" className="text-xs">
                      Email
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  Thứ tự: {leader.display_order} | Status:{" "}
                  <Badge
                    variant={leader.status === "active" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {leader.status === "active" ? "Hoạt động" : "Không hoạt động"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {leaders.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            Chưa có Leader nào. Hãy thêm Leader đầu tiên!
          </CardContent>
        </Card>
      )}
    </div>
  );
}

