"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { beeitServices } from "@/services/admin/beeitServices";
import { revalidateBeeit } from "@/utils/revalidateCache";
import { ImageIcon, Save, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

export default function HeroPage() {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    loadHero();
  }, []);

  const loadHero = async () => {
    try {
      setLoading(true);
      const res = await beeitServices.hero.get();
      if (res?.data?.data?.hero) {
        const heroData = res.data.data.hero;
        setHero(heroData);
        reset(heroData);
      }
    } catch (error) {
      toast.error("Không thể tải thông tin Hero");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!hero) return;
    
    try {
      setSaving(true);
      await beeitServices.hero.update(hero.id, data);
      
      // Revalidate cache để cập nhật ngay lập tức
      await revalidateBeeit();
      
      toast.success("Cập nhật Hero thành công! Trang sẽ được cập nhật ngay lập tức.");
      await loadHero();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Cập nhật thất bại");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hero) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Không tìm thấy Hero. Vui lòng kiểm tra lại.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý Hero Section</h1>
        <p className="text-muted-foreground mt-2">
          Cấu hình banner và nội dung chính của trang BeeIT
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
                <CardDescription>
                  Cấu hình tiêu đề và mô tả chính
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title_line1">Dòng tiêu đề 1</Label>
                  <Input
                    id="title_line1"
                    {...register("title_line1", { required: "Bắt buộc" })}
                    placeholder="BUILDING THE"
                  />
                  {errors.title_line1 && (
                    <p className="text-sm text-destructive">{errors.title_line1.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title_line2">Dòng tiêu đề 2</Label>
                  <Input
                    id="title_line2"
                    {...register("title_line2", { required: "Bắt buộc" })}
                    placeholder="DIGITAL HIVE"
                  />
                  {errors.title_line2 && (
                    <p className="text-sm text-destructive">{errors.title_line2.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle">Mô tả</Label>
                  <Textarea
                    id="subtitle"
                    {...register("subtitle")}
                    placeholder="Cộng đồng lập trình viên đam mê công nghệ..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hình ảnh nền</CardTitle>
                <CardDescription>
                  URL ảnh nền cho banner Hero
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="background_image_url">URL ảnh nền</Label>
                  <div className="flex gap-2">
                    <Input
                      id="background_image_url"
                      {...register("background_image_url")}
                      placeholder="https://..."
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const url = document.getElementById("background_image_url").value;
                        if (url) window.open(url, "_blank");
                      }}
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="background_image_alt">Alt text</Label>
                  <Input
                    id="background_image_alt"
                    {...register("background_image_alt")}
                    placeholder="BEE IT Club"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="overlay_opacity">
                    Độ mờ overlay ({hero.overlay_opacity || 0.5})
                  </Label>
                  <Input
                    id="overlay_opacity"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    {...register("overlay_opacity", {
                      valueAsNumber: true,
                      min: { value: 0, message: "Tối thiểu 0" },
                      max: { value: 1, message: "Tối đa 1" },
                    })}
                  />
                  {errors.overlay_opacity && (
                    <p className="text-sm text-destructive">{errors.overlay_opacity.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Xem trước</CardTitle>
                <CardDescription>
                  Preview của Hero section
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video rounded-lg overflow-hidden border bg-black">
                  {hero.background_image_url && (
                    <img
                      src={hero.background_image_url}
                      alt={hero.background_image_alt || "Hero background"}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div
                    className="absolute inset-0 bg-black/50 flex items-center justify-center"
                    style={{ opacity: hero.overlay_opacity || 0.5 }}
                  >
                    <div className="text-center text-white p-6">
                      <h2 className="text-2xl font-bold mb-2">
                        {hero.title_line1 || "BUILDING THE"}
                      </h2>
                      <h2 className="text-3xl font-bold mb-4">
                        {hero.title_line2 || "DIGITAL HIVE"}
                      </h2>
                      <p className="text-sm opacity-90">
                        {hero.subtitle || "Mô tả..."}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hành động</CardTitle>
              </CardHeader>
              <CardContent>
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

