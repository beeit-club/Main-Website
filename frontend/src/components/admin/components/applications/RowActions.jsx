// src/components/admin/components/applications/RowActions.jsx
import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { applicationServices } from "@/services/admin/applications";
import { interviewServices } from "@/services/admin/interview"; // Import service mới
import { toast } from "sonner";
import { formatDate } from "@/lib/datetime";
import {
  MoreHorizontal,
  Eye,
  Check,
  X,
  Calendar,
  User,
  Mail,
  Phone,
  BookUser,
  FileText,
  Hash,
} from "lucide-react";
import { decisionSchema, scheduleSchema } from "@/validation/applications";

export function RowActions({ row, viewMode }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States cho 5 dialog
  const [openView, setOpenView] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [openSchedule, setOpenSchedule] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const [openReject, setOpenReject] = useState(false);

  // Data
  const [dataForView, setDataForView] = useState(null);
  const [schedulesList, setSchedulesList] = useState([]); // Danh sách lịch

  const applicationId = row.original.id;
  const applicantName = row.original.fullname;

  // 2 Form (1 cho đặt lịch, 1 cho quyết định)
  const formSchedule = useForm({
    resolver: yupResolver(scheduleSchema),
  });
  const formDecision = useForm({
    resolver: yupResolver(decisionSchema),
    defaultValues: { interview_notes: "" },
  });

  const reloadPage = () => window.location.reload();

  // === CÁC HÀM GỌI API ===

  // (Xem chi tiết)
  async function onViewClick() {
    if (!dataForView) {
      try {
        const res = await applicationServices.getOneApplication(applicationId);
        setDataForView(res.data.application);
      } catch (error) {
        toast.error("Lấy chi tiết thất bại");
      }
    }
    setOpenView(true);
  }

  // (Duyệt đơn 0 -> 1)
  async function onConfirmReview() {
    setIsSubmitting(true);
    try {
      await applicationServices.reviewApplication(applicationId);
      toast.success("Duyệt đơn thành công!");
      reloadPage();
    } catch (error) {
      toast.error(error.message || "Duyệt thất bại");
    } finally {
      setIsSubmitting(false);
    }
  }

  // (Click nút Đặt lịch - Tải data trước)
  async function onScheduleClick() {
    try {
      const res = await interviewServices.getAllInterviews(
        new URLSearchParams({ limit: 999 })
      );
      setSchedulesList(res.data.data || []);
      setOpenSchedule(true);
    } catch (error) {
      toast.error("Không thể tải danh sách lịch");
    }
  }

  // (Đặt lịch 1 -> 2)
  async function onConfirmSchedule(formData) {
    setIsSubmitting(true);
    try {
      await applicationServices.scheduleApplication(applicationId, formData);
      toast.success("Đặt lịch thành công, email đã được gửi!");
      reloadPage();
    } catch (error) {
      toast.error(error.message || "Đặt lịch thất bại");
    } finally {
      setIsSubmitting(false);
    }
  }

  // (Phê duyệt 2 -> 3)
  async function onConfirmApprove(formData) {
    setIsSubmitting(true);
    try {
      await applicationServices.approveApplication(applicationId, formData);
      toast.success("Phê duyệt thành công!");
      reloadPage();
    } catch (error) {
      toast.error(error.message || "Phê duyệt thất bại");
    } finally {
      setIsSubmitting(false);
    }
  }

  // (Từ chối 0/2 -> 4)
  async function onConfirmReject(formData) {
    setIsSubmitting(true);
    try {
      await applicationServices.rejectApplication(applicationId, formData);
      toast.success("Đã từ chối đơn");
      reloadPage();
    } catch (error) {
      toast.error(error.message || "Từ chối thất bại");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* --- Nút bấm trigger --- */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* Luôn hiển thị Xem chi tiết */}
          <DropdownMenuItem onClick={onViewClick}>
            <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          {/* === Tab 0: Chờ xử lý === */}
          {viewMode == "0" && (
            <>
              <DropdownMenuItem onClick={() => setOpenReview(true)}>
                <Check className="mr-2 h-4 w-4 text-green-600" /> Duyệt đơn
                (Vòng 1)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setOpenReject(true)}
                className="text-red-600"
              >
                <X className="mr-2 h-4 w-4" /> Từ chối
              </DropdownMenuItem>
            </>
          )}

          {/* === Tab 1: Chờ phỏng vấn === */}
          {viewMode == "1" && (
            <DropdownMenuItem onClick={onScheduleClick}>
              <Calendar className="mr-2 h-4 w-4 text-blue-600" /> Đặt lịch phỏng
              vấn
            </DropdownMenuItem>
          )}

          {/* === Tab 2: Đã đặt lịch === */}
          {viewMode == "2" && (
            <>
              <DropdownMenuItem onClick={() => setOpenApprove(true)}>
                <Check className="mr-2 h-4 w-4 text-green-600" /> Phê duyệt
                (Trúng tuyển)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setOpenReject(true)}
                className="text-red-600"
              >
                <X className="mr-2 h-4 w-4" /> Từ chối (Trượt)
              </DropdownMenuItem>
            </>
          )}

          {/* Tab 3, 4 không có action gì thêm */}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* --- Dialog 1: Xem Chi Tiết --- */}
      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{dataForView?.fullname}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Thông tin ứng viên</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <User /> {dataForView?.fullname}
                </div>
                <div className="flex items-center gap-2">
                  <Mail /> {dataForView?.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone /> {dataForView?.phone}
                </div>
              </div>
            </div>
            <div className="space-y-2 pt-4 border-t">
              <h4 className="font-semibold">Thông tin sinh viên</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Hash /> {dataForView?.student_id}
                </div>
                <div className="flex items-center gap-2">
                  <BookUser /> {dataForView?.major}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar /> {dataForView?.student_year}
                </div>
              </div>
            </div>
            <div className="space-y-2 pt-4 border-t">
              <h4 className="font-semibold">Ghi chú (Admin)</h4>
              <p className="italic">
                {dataForView?.interview_notes || "Chưa có ghi chú."}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenView(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Dialog 2: Xác nhận Duyệt đơn (0 -> 1) --- */}
      <Dialog open={openReview} onOpenChange={setOpenReview}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận Duyệt Đơn</DialogTitle>
          </DialogHeader>
          <p>
            Bạn có chắc muốn duyệt đơn của <strong>{applicantName}</strong> qua
            vòng đơn?
          </p>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setOpenReview(false)}
              disabled={isSubmitting}
            >
              Huỷ
            </Button>
            <Button onClick={onConfirmReview} disabled={isSubmitting}>
              {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Dialog 3: Đặt Lịch Phỏng Vấn (1 -> 2) --- */}
      <Dialog open={openSchedule} onOpenChange={setOpenSchedule}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đặt lịch cho: {applicantName}</DialogTitle>
          </DialogHeader>
          <Form {...formSchedule}>
            <form
              onSubmit={formSchedule.handleSubmit(onConfirmSchedule)}
              className="space-y-4"
            >
              <FormField
                control={formSchedule.control}
                name="schedule_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chọn lịch phỏng vấn</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn một lịch đã tạo..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {schedulesList.map((schedule) => (
                          <SelectItem
                            key={schedule.id}
                            value={schedule.id.toString()}
                          >
                            {schedule.title} (
                            {formatDate(schedule.interview_date, true)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setOpenSchedule(false)}
                  disabled={isSubmitting}
                >
                  Huỷ
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang đặt lịch..." : "Đặt lịch"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* --- Dialog 4: Phê Duyệt (Trúng tuyển) (2 -> 3) --- */}
      <Dialog open={openApprove} onOpenChange={setOpenApprove}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Phê duyệt: {applicantName}</DialogTitle>
          </DialogHeader>
          <Form {...formDecision}>
            <form
              onSubmit={formDecision.handleSubmit(onConfirmApprove)}
              className="space-y-4"
            >
              <FormField
                control={formDecision.control}
                name="interview_notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú phỏng vấn (tùy chọn)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ghi chú về buổi phỏng vấn..."
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setOpenApprove(false)}
                  disabled={isSubmitting}
                >
                  Huỷ
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? "Đang xử lý..." : "Xác nhận Trúng Tuyển"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* --- Dialog 5: Từ Chối (0/2 -> 4) --- */}
      <Dialog open={openReject} onOpenChange={setOpenReject}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối: {applicantName}</DialogTitle>
          </DialogHeader>
          {/* Reset form khi mở dialog này */}
          <Form {...formDecision}>
            <form
              onSubmit={formDecision.handleSubmit(onConfirmReject)}
              className="space-y-4"
            >
              <FormField
                control={formDecision.control}
                name="interview_notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú / Lý do (tùy chọn)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ghi chú lý do..."
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setOpenReject(false)}
                  disabled={isSubmitting}
                >
                  Huỷ
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang xử lý..." : "Xác nhận Từ Chối"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
