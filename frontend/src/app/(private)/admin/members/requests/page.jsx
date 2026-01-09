"use client";

import { useEffect, useState } from "react";
import { usersServices } from "@/services/admin/users";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner";
import { Check, X, GraduationCap, BookOpen, Clock } from "lucide-react";

export default function MemberRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for dialogs
  const [actionDialog, setActionDialog] = useState({ open: false, type: null, request: null });
  const [adminNote, setAdminNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const res = await usersServices.getPendingRequests({ limit: 50 }); // Fetch up to 50 requests
      setRequests(res.data.data || []);
    } catch (error) {
      toast.error("Không thể tải danh sách yêu cầu");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleOpenAction = (type, request) => {
    setActionDialog({ open: true, type, request });
    setAdminNote("");
  };

  const handleCloseAction = () => {
    setActionDialog({ open: false, type: null, request: null });
  };

  const handleSubmitAction = async () => {
    if (!actionDialog.request) return;

    try {
      setIsSubmitting(true);
      const { id } = actionDialog.request;
      const data = { note: adminNote };

      if (actionDialog.type === "approve") {
        await usersServices.approveRequest(id, data);
        toast.success("Đã phê duyệt yêu cầu thành công");
      } else {
        await usersServices.rejectRequest(id, data);
        toast.success("Đã từ chối yêu cầu");
      }
      
      handleCloseAction();
      fetchRequests(); // Reload list
    } catch (error) {
      // Prioritize showing the specific details from the backend
      const errorMessage = error?.error?.details || error?.message || "Có lỗi xảy ra";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Yêu cầu cập nhật thông tin</h1>
        <p className="text-muted-foreground">
          Duyệt các yêu cầu đăng ký hoặc cập nhật thông tin thành viên từ người dùng
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
          <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Hiện không có yêu cầu nào đang chờ duyệt.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {requests.map((req) => (
            <Card key={req.id} className="flex flex-col">
              <CardHeader className="flex-row gap-4 items-start space-y-0 pb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={req.avatar_url} />
                  <AvatarFallback>{req.fullname?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base truncate">{req.fullname}</CardTitle>
                  <CardDescription className="truncate">{req.email}</CardDescription>
                  <p className="text-xs text-muted-foreground mt-1">
                    Gửi lúc: {format(new Date(req.created_at), "HH:mm dd/MM/yyyy")}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-muted/50 p-2 rounded">
                    <span className="text-xs text-muted-foreground block mb-1">MSSV</span>
                    <span className="font-medium">{req.student_id}</span>
                  </div>
                </div>
                {req.academic_year && (
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span>Niên khóa: {format(new Date(req.academic_year), "yyyy")}</span>
                  </div>
                )}
                {req.reason && (
                  <div className="bg-yellow-50 border border-yellow-100 p-3 rounded text-yellow-900">
                    <p className="text-xs font-semibold mb-1">Ghi chú từ người dùng:</p>
                    <p className="italic">"{req.reason}"</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-2 gap-2">
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white" 
                  onClick={() => handleOpenAction("approve", req)}
                >
                  <Check className="h-4 w-4 mr-2" /> Duyệt
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1"
                  onClick={() => handleOpenAction("reject", req)}
                >
                  <X className="h-4 w-4 mr-2" /> Từ chối
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Action Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={handleCloseAction}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === "approve" ? "Phê duyệt yêu cầu" : "Từ chối yêu cầu"}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.type === "approve" 
                ? `Xác nhận cập nhật thông tin thành viên cho ${actionDialog.request?.fullname}?`
                : `Bạn có chắc chắn muốn từ chối yêu cầu của ${actionDialog.request?.fullname}?`
              }
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="admin-note" className="mb-2 block">Ghi chú của Admin (tùy chọn)</Label>
            <Textarea 
              id="admin-note"
              placeholder={actionDialog.type === "approve" ? "Nhập ghi chú lưu lại..." : "Nhập lý do từ chối..."}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseAction} disabled={isSubmitting}>Hủy</Button>
            <Button 
              variant={actionDialog.type === "approve" ? "default" : "destructive"}
              className={actionDialog.type === "approve" ? "bg-green-600 hover:bg-green-700" : ""}
              onClick={handleSubmitAction}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang xử lý..." : (actionDialog.type === "approve" ? "Xác nhận duyệt" : "Xác nhận từ chối")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
