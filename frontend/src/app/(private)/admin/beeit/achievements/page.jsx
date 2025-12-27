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

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      const res = await beeitServices.achievements.getAll();
      setAchievements(res?.data?.data?.data || []);
    } catch (error) {
      toast.error("Không thể tải danh sách Achievements");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa Achievement này?")) return;

    try {
      setDeletingId(id);
      await beeitServices.achievements.delete(id);
      
      // Revalidate cache để cập nhật ngay lập tức
      await revalidateBeeit();
      
      toast.success("Xóa Achievement thành công! Trang sẽ được cập nhật ngay lập tức.");
      await loadAchievements();
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

  // Phân loại theo row_number
  const row1Achievements = achievements.filter(a => a.row_number === 1 || !a.row_number).sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  const row2Achievements = achievements.filter(a => a.row_number === 2).sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Achievements</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý các thành tựu hiển thị trong Hall of Fame
          </p>
        </div>
        <Link href="/admin/beeit/achievements/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm Achievement
          </Button>
        </Link>
      </div>

      {/* Row 1 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Row 1 (Scroll Right)</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {row1Achievements.map((achievement) => (
            <Card key={achievement.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                    <CardDescription className="mt-1">{achievement.year}</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Link href={`/admin/beeit/achievements/${achievement.id}/edit`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(achievement.id)}
                      disabled={deletingId === achievement.id}
                      className="h-8 w-8 text-destructive"
                    >
                      {deletingId === achievement.id ? (
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
                  {achievement.image_url && (
                    <div className="relative aspect-video rounded-lg overflow-hidden border">
                      <img
                        src={achievement.image_url}
                        alt={achievement.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/logo.jpg";
                        }}
                      />
                    </div>
                  )}
                  {achievement.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {achievement.description}
                    </p>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Thứ tự: {achievement.display_order} | Status:{" "}
                    <Badge
                      variant={achievement.status === "active" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {achievement.status === "active" ? "Hoạt động" : "Không hoạt động"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {row1Achievements.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              Chưa có Achievement nào ở Row 1
            </CardContent>
          </Card>
        )}
      </div>

      {/* Row 2 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Row 2 (Scroll Left)</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {row2Achievements.map((achievement) => (
            <Card key={achievement.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                    <CardDescription className="mt-1">{achievement.year}</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Link href={`/admin/beeit/achievements/${achievement.id}/edit`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(achievement.id)}
                      disabled={deletingId === achievement.id}
                      className="h-8 w-8 text-destructive"
                    >
                      {deletingId === achievement.id ? (
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
                  {achievement.image_url && (
                    <div className="relative aspect-video rounded-lg overflow-hidden border">
                      <img
                        src={achievement.image_url}
                        alt={achievement.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/logo.jpg";
                        }}
                      />
                    </div>
                  )}
                  {achievement.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {achievement.description}
                    </p>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Thứ tự: {achievement.display_order} | Status:{" "}
                    <Badge
                      variant={achievement.status === "active" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {achievement.status === "active" ? "Hoạt động" : "Không hoạt động"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {row2Achievements.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              Chưa có Achievement nào ở Row 2
            </CardContent>
          </Card>
        )}
      </div>

      {achievements.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            Chưa có Achievement nào. Hãy thêm Achievement đầu tiên!
          </CardContent>
        </Card>
      )}
    </div>
  );
}

