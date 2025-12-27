"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { beeitServices } from "@/services/admin/beeitServices";
import { revalidateBeeit } from "@/utils/revalidateCache";
import { Save, Loader2, ExternalLink } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

export default function FooterPage() {
  const [footer, setFooter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    loadFooter();
  }, []);

  const loadFooter = async () => {
    try {
      setLoading(true);
      const res = await beeitServices.footer.get();
      if (res?.data?.data?.settings) {
        const footerData = res.data.data.settings;
        setFooter(footerData);
        reset(footerData);
      }
    } catch (error) {
      toast.error("Không thể tải Footer settings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!footer) return;
    
    try {
      setSaving(true);
      await beeitServices.footer.update(footer.id, data);
      
      // Revalidate cache để cập nhật ngay lập tức
      await revalidateBeeit();
      
      toast.success("Cập nhật Footer settings thành công! Trang sẽ được cập nhật ngay lập tức.");
      await loadFooter();
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

  if (!footer) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Không tìm thấy Footer settings.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý Footer</h1>
        <p className="text-muted-foreground mt-2">
          Cấu hình thông tin liên hệ và social media links
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Terminal Settings</CardTitle>
                <CardDescription>Cấu hình giao diện terminal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="terminal_prompt">Terminal Prompt</Label>
                  <Input
                    id="terminal_prompt"
                    {...register("terminal_prompt")}
                    placeholder="guest@beeit-terminal:~"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heading_text">Heading Text</Label>
                  <Input
                    id="heading_text"
                    {...register("heading_text")}
                    placeholder="# Kết nối với chúng tôi"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subheading_text">Subheading Text</Label>
                  <Textarea
                    id="subheading_text"
                    {...register("subheading_text")}
                    placeholder="Sẵn sàng kích hoạt tiềm năng của bạn?"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="command_prompt">Command Prompt</Label>
                  <Input
                    id="command_prompt"
                    {...register("command_prompt")}
                    placeholder="guest@beeit:~$"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="command_text">Command Text</Label>
                  <Input
                    id="command_text"
                    {...register("command_text")}
                    placeholder="join --email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="placeholder_text">Placeholder</Label>
                  <Input
                    id="placeholder_text"
                    {...register("placeholder_text")}
                    placeholder="nhập_email_của_bạn"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="button_text">Button Text</Label>
                  <Input
                    id="button_text"
                    {...register("button_text")}
                    placeholder="[GỬI_LỆNH]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    {...register("contact_email")}
                    placeholder="contact@beeit.club"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location_text">Location</Label>
                  <Input
                    id="location_text"
                    {...register("location_text")}
                    placeholder="TP.HCM, Việt Nam"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="copyright_text">Copyright Text</Label>
                  <Input
                    id="copyright_text"
                    {...register("copyright_text")}
                    placeholder="© {year} BEE IT CLUB..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Sử dụng {"{year}"} để tự động thay bằng năm hiện tại
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>URLs cho các mạng xã hội</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="github_url">GitHub URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="github_url"
                      type="url"
                      {...register("github_url")}
                      placeholder="https://github.com/..."
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const url = document.getElementById("github_url").value;
                        if (url) window.open(url, "_blank");
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facebook_url">Facebook URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="facebook_url"
                      type="url"
                      {...register("facebook_url")}
                      placeholder="https://facebook.com/..."
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const url = document.getElementById("facebook_url").value;
                        if (url) window.open(url, "_blank");
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram_url">Instagram URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="instagram_url"
                      type="url"
                      {...register("instagram_url")}
                      placeholder="https://instagram.com/..."
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const url = document.getElementById("instagram_url").value;
                        if (url) window.open(url, "_blank");
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
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

