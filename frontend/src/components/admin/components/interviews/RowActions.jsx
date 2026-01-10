// src/components/admin/components/interviews/RowActions.jsx
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { interviewServices } from "@/services/admin/interview";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { interviewSchema } from "@/validation/applications";

export function RowActions({ row }) {
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scheduleId = row.original.id;

  const form = useForm({
    resolver: yupResolver(interviewSchema),
  });

  // Tải dữ liệu khi bấm Sửa
  async function onEditClick() {
    try {
      const res = await interviewServices.getOneInterview(scheduleId);
      if (res.status == "success") {
        const schedule = res.data.schedule;

        // Chuyển đổi dữ liệu cho <input>
        // schedule.interview_date là "YYYY-MM-DD..." -> lấy 10 ký tự đầu
        const dateValue = schedule.interview_date.slice(0, 10);
        // schedule.start_time là "HH:mm:ss" -> lấy 5 ký tự đầu
        const startTimeValue = schedule.start_time.slice(0, 5);
        const endTimeValue = schedule.end_time.slice(0, 5);

        form.reset({
          title: schedule.title,
          interview_date: dateValue,
          start_time: startTimeValue,
          end_time: endTimeValue,
          location: schedule.location || "",
          description: schedule.description || "",
        });
        setOpenEdit(true);
      }
    } catch (error) {
      toast.error("Lấy chi tiết lịch thất bại.");
    }
  }

  // Submit Sửa
  async function onConfirmEdit(formData) {
    setIsSubmitting(true);
    try {
      const res = await interviewServices.updateInterview(scheduleId, formData);
      if (res.status === "success") {
        toast.success("Cập nhật lịch thành công!");
        setOpenEdit(false);
        window.location.reload();
      }
    } catch (error) {
      toast.error("Cập nhật thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Submit Xóa
  async function onConfirmDelete() {
    setIsSubmitting(true);
    try {
      await interviewServices.deleteInterview(scheduleId);
      toast.success("Xóa lịch thành công");
      setOpenDelete(false);
      window.location.reload();
    } catch (error) {
      toast.error("Xóa thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEditClick}>
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenDelete(true)}
            className="text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog Xóa */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận Xóa</DialogTitle>
          </DialogHeader>
          <p>
            Bạn có chắc muốn xóa lịch: <strong>{row.original.title}</strong>?
          </p>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setOpenDelete(false)}
              disabled={isSubmitting}
            >
              Huỷ
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirmDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Sửa (ĐÃ CẬP NHẬT FORM) */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Lịch Phỏng Vấn</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onConfirmEdit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Ngày và Giờ */}
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="interview_date"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Ngày</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Giờ bắt đầu</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="end_time"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Giờ kết thúc</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa điểm / Link</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setOpenEdit(false)}
                  disabled={isSubmitting}
                >
                  Huỷ
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
