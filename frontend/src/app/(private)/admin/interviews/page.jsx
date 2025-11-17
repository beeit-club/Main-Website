// src/app/admin/interviews/page.jsx
"use client";
import React, { useEffect, useState } from "react";
import { columns } from "@/components/admin/components/interviews/columns";
// Giả sử bạn dùng DataTable chung
import { DataTable } from "@/components/admin/components/interviews/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { interviewSchema } from "@/validation/applications";

export default function ListInterviews() {
  const [data, setData] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  async function getSchedules() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: 1, limit: 9999 });
      const res = await interviewServices.getAllInterviews(params);
      setData(res?.data.data || []);
    } catch (error) {
      toast.error("Lấy danh sách lịch thất bại");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getSchedules();
  }, []);

  // Form cho Thêm mới
  const form = useForm({
    resolver: yupResolver(interviewSchema),
    defaultValues: {
      title: "",
      interview_date: "",
      start_time: "", // Cập nhật
      end_time: "", // Cập nhật
      location: "",
      description: "",
    },
  });
  const { isSubmitting } = form.formState;

  // Submit Thêm mới
  async function onSubmit(formData) {
    try {
      const res = await interviewServices.createInterview(formData);
      if (res.status === "success") {
        toast.success("Tạo lịch mới thành công!");
        setOpenAdd(false);
        form.reset();
        window.location.reload();
      }
    } catch (error) {
      toast.error("Tạo lịch thất bại.");
    }
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Quản lý Lịch Phỏng Vấn</h1>
        <Button onClick={() => setOpenAdd(true)}>Thêm Lịch Mới</Button>
      </div>
      <DataTable columns={columns} data={data} isLoading={isLoading} />

      {/* Dialog Thêm Lịch (ĐÃ CẬP NHẬT FORM) */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Tạo Lịch Phỏng Vấn Mới</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: Đợt 1 - Online"
                        {...field}
                        disabled={isSubmitting}
                      />
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
                      <Input
                        placeholder="VD: Google Meet Link..."
                        {...field}
                        disabled={isSubmitting}
                      />
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
                    <FormLabel>Mô tả (tùy chọn)</FormLabel>
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
                  onClick={() => setOpenAdd(false)}
                  disabled={isSubmitting}
                >
                  Huỷ
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang lưu..." : "Lưu"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
