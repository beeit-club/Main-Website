// src/app/admin/tags/page.jsx

"use client";
import { columns } from "@/components/admin/components/tags/columns";
import { DataTable } from "@/components/admin/components/tags/data-table";
import { Button } from "@/components/ui/button";
import { tagServices } from "@/services/admin/tags";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// Import các component cho Dialog và Form
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
import { tagSchema } from "@/validation/postSchema";

export default function ListTags() {
  const [data, setData] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);

  // Hàm lấy dữ liệu
  async function getTags() {
    try {
      const res = await tagServices.getAllTags();
      setData(res?.data.data.data || []);
    } catch (error) {
      toast.error("Lấy danh sách tags thất bại");
    }
  }

  useEffect(() => {
    getTags();
  }, []);

  // --- Cấu hình React Hook Form ---
  const form = useForm({
    resolver: yupResolver(tagSchema),
    defaultValues: {
      name: "",
      meta_description: "", // <-- Đã bỏ slug
    },
  });

  const { isSubmitting } = form.formState;

  // --- Xử lý Submit Form Thêm ---
  async function onSubmit(formData) {
    try {
      const res = await tagServices.createTag(formData);
      if (res.status === "success") {
        toast.success("Thêm tag mới thành công!");
        setOpenAdd(false);
        form.reset();
        window.location.reload();
      } else {
        toast.error(res.message || "Thêm tag thất bại.");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm tag.");
    }
  }

  // Đóng dialog và reset form
  function handleCloseDialog() {
    setOpenAdd(false);
    form.reset();
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Danh sách Tags</h1>
        <Button onClick={() => setOpenAdd(true)}>Thêm Tag</Button>
      </div>
      <DataTable columns={columns} data={data} />

      {/* --- Dialog Thêm Tag với React Hook Form --- */}
      <Dialog open={openAdd} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thêm Tag Mới</DialogTitle>
            <DialogDescription>
              Tạo một tag mới để sử dụng trong các bài viết.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Tên Tag */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên Tag</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: JavaScript"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* TRƯỜNG SLUG ĐÃ BỊ XÓA */}

              {/* Meta Description */}
              <FormField
                control={form.control}
                name="meta_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả Meta</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả ngắn (tối ưu SEO)"
                        {...field}
                        value={field.value || ""}
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
                  onClick={handleCloseDialog}
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
