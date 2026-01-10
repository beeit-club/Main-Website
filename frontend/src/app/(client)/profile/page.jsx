"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { authServices } from "@/services/auth";
import { memberService } from "@/services/member";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Edit,
  BookOpen,
  GraduationCap,
  FileText,
  Clock,
  AlertCircle
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
  
  // State for member edit request
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    student_id: "",
    academic_year: "",
    reason: ""
  });

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await authServices.getProfile();
      if (res.status === "success") {
        setProfile(res.data.user);
        
        // Pre-fill form if member info exists
        if (res.data.user.member_info) {
          setFormData({
            student_id: res.data.user.member_info.student_id || "",
            academic_year: res.data.user.member_info.academic_year || "",
            reason: ""
          });
        }
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

  useEffect(() => {
    if (authLoading) return;
    if (!isLogin) {
      toast.error("Vui lòng đăng nhập để xem trang cá nhân");
      router.push("/login");
      return;
    }
    fetchProfile();
  }, [isLogin, authLoading, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!formData.student_id) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      setIsSubmitting(true);
      await memberService.requestUpdate(formData);
      toast.success("Gửi yêu cầu cập nhật thành công!");
      setIsEditDialogOpen(false);
      // Refresh profile to show pending status
      fetchProfile();
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Có lỗi xảy ra khi gửi yêu cầu");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="container max-w-5xl mx-auto py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-6">
          <Skeleton className="h-64 w-full md:w-1/3 rounded-lg" />
          <div className="w-full md:w-2/3 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const {
    fullname,
    email,
    phone,
    avatar_url,
    bio,
    created_at,
    member_info,
    questions,
    edit_request
  } = profile;

  return (
    <div className="container max-w-5xl mx-auto py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Hồ sơ cá nhân</h1>
          <p className="text-muted-foreground mt-1">Quản lý thông tin và hoạt động của bạn</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/profile/edit">
            <Edit className="h-4 w-4 mr-2" />
            Sửa hồ sơ cơ bản
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        {/* Left Sidebar: Basic Info */}
        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                  <AvatarImage src={avatar_url} alt={fullname} />
                  <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                    {fullname?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h2 className="text-2xl font-bold mb-1">{fullname}</h2>
              <p className="text-sm text-muted-foreground mb-4">{email}</p>
              
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary" className="px-3 py-1">
                  {profile.role_name || "Thành viên"}
                </Badge>
                {member_info && (
                  <Badge variant="outline" className="px-3 py-1 border-primary text-primary">
                    Thành viên chính thức
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Giới thiệu</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {bio || "Chưa có giới thiệu..."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Content: Tabs */}
        <div className="md:col-span-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="member">Thành viên</TabsTrigger>
              <TabsTrigger value="questions">Câu hỏi ({questions?.length || 0})</TabsTrigger>
            </TabsList>

            {/* Tab: Overview */}
            <TabsContent value="overview" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin liên hệ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center p-3 border rounded-lg">
                      <Mail className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm font-medium">{email}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 border rounded-lg">
                      <Phone className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <p className="text-xs text-muted-foreground">Điện thoại</p>
                        <p className="text-sm font-medium">{phone || "Chưa cập nhật"}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 border rounded-lg">
                      <Calendar className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <p className="text-xs text-muted-foreground">Ngày tham gia</p>
                        <p className="text-sm font-medium">
                          {created_at ? format(new Date(created_at), "dd/MM/yyyy") : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Member Info */}
            <TabsContent value="member" className="mt-6 space-y-6">
              {edit_request && edit_request.status === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg flex items-start gap-3">
                  <Clock className="h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Yêu cầu cập nhật đang chờ duyệt</h4>
                    <p className="text-sm mt-1">
                      Bạn đã gửi yêu cầu cập nhật thông tin thành viên vào ngày {format(new Date(edit_request.created_at), "dd/MM/yyyy HH:mm")}. 
                      Vui lòng chờ Admin phê duyệt.
                    </p>
                  </div>
                </div>
              )}

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Thông tin thành viên CLB</CardTitle>
                    <CardDescription>Thông tin học vấn và hoạt động</CardDescription>
                  </div>
                  {!edit_request || edit_request.status !== 'pending' ? (
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          {member_info ? "Cập nhật thông tin" : "Đăng ký thành viên"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {member_info ? "Cập nhật thông tin thành viên" : "Đăng ký thông tin thành viên"}
                          </DialogTitle>
                          <DialogDescription>
                            Gửi yêu cầu cập nhật thông tin. Admin sẽ xem xét và phê duyệt.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmitRequest} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="student_id">Mã sinh viên *</Label>
                            <Input 
                              id="student_id" 
                              name="student_id" 
                              value={formData.student_id} 
                              onChange={handleInputChange} 
                              placeholder="Ví dụ: 2021601234"
                              required 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="academic_year">Niên khóa</Label>
                            <Input 
                              id="academic_year" 
                              name="academic_year" 
                              type="date"
                              value={formData.academic_year ? formData.academic_year.split('T')[0] : ''} 
                              onChange={handleInputChange} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="reason">Lý do/Ghi chú</Label>
                            <Textarea 
                              id="reason" 
                              name="reason" 
                              value={formData.reason} 
                              onChange={handleInputChange} 
                              placeholder="Ghi chú thêm cho Admin..."
                            />
                          </div>
                          <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                              Hủy
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                              {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Button disabled variant="secondary">Đang chờ duyệt</Button>
                  )}
                </CardHeader>
                <CardContent>
                  {member_info ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center p-3 bg-muted/50 rounded-lg">
                          <GraduationCap className="h-5 w-5 text-primary mr-3" />
                          <div>
                            <p className="text-xs text-muted-foreground">Mã sinh viên</p>
                            <p className="font-medium">{member_info.student_id}</p>
                          </div>
                        </div>
                        <div className="flex items-center p-3 bg-muted/50 rounded-lg">
                          <Calendar className="h-5 w-5 text-primary mr-3" />
                          <div>
                            <p className="text-xs text-muted-foreground">Ngày vào CLB</p>
                            <p className="font-medium">
                              {member_info.join_date ? format(new Date(member_info.join_date), "dd/MM/yyyy") : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">Bạn chưa cập nhật thông tin thành viên.</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Cập nhật để nhận các quyền lợi dành riêng cho thành viên CLB.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Document Benefits (Placeholder) */}
              <Card>
                <CardHeader>
                  <CardTitle>Tài liệu thành viên</CardTitle>
                </CardHeader>
                <CardContent>
                  {member_info ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>Hiện chưa có tài liệu nào dành riêng cho bạn.</p>
                      <Button variant="link" className="mt-2" asChild>
                        <Link href="/documents">Xem tất cả tài liệu</Link>
                      </Button>
                    </div>
                  ) : (
                     <div className="flex items-center justify-center p-6 bg-muted/30 rounded-lg border border-dashed">
                        <p className="text-sm text-muted-foreground">
                          Bạn cần là thành viên chính thức để xem tài liệu nội bộ.
                        </p>
                     </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: My Questions */}
            <TabsContent value="questions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Câu hỏi gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                  {questions && questions.length > 0 ? (
                    <div className="space-y-4">
                      {questions.map((q) => (
                        <div key={q.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="space-y-1">
                            <Link href={`/questions/${q.slug}`} className="font-medium hover:text-primary transition-colors line-clamp-1">
                              {q.title}
                            </Link>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{format(new Date(q.created_at), "dd/MM/yyyy")}</span>
                              <span>•</span>
                              <span>{q.view_count} lượt xem</span>
                            </div>
                          </div>
                          <Badge variant={q.status === 1 ? "default" : "secondary"}>
                            {q.status === 1 ? "Đã duyệt" : "Chờ duyệt"}
                          </Badge>
                        </div>
                      ))}
                      <div className="pt-2 text-center">
                        <Button variant="outline" asChild>
                          <Link href="/questions/my">Xem tất cả</Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">Bạn chưa đặt câu hỏi nào.</p>
                      <Button className="mt-4" asChild>
                        <Link href="/questions/ask">Đặt câu hỏi ngay</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}