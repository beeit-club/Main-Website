// src/components/admin/components/tags/RowActions.jsx

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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { tagServices } from "@/services/admin/tags";
import { toast } from "sonner";
import { formatDate } from "@/lib/datetime";
import {
  MoreHorizontal,
  CalendarDays,
  Pencil,
  Eye,
  Trash,
  Hash,
  User,
} from "lucide-react";
import { tagSchema } from "@/validation/postSchema";

export function RowActions({ row }) {
  // States cho 3 dialog
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);
  const [tagDataForView, setTagDataForView] = useState(null);

  const tagId = row.original.id;
  console.log("🚀 ~ RowActions ~ tagId:", tagId);
  const tagName = row.original.name;

  // --- Cấu hình React Hook Form cho Edit ---
  const form = useForm({
    resolver: yupResolver(tagSchema),
  });
  const { isSubmitting: isEditSubmitting } = form.formState;

  // --- Xử lý XÓA (Giữ nguyên logic) ---
  async function onConfirmDelete() {
    setIsDeleteSubmitting(true);
    try {
      const res = await tagServices.deleteTag(tagId);
      if (res?.data.status == "success") {
        toast.success("Xóa tag thành công");
        setOpenDelete(false);
        window.location.reload();
      } else {
        toast.error("Xóa tag không thành công");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa tag.");
    } finally {
      setIsDeleteSubmitting(false);
    }
  }

  // --- Xử lý XEM CHI TIẾT (Giữ nguyên logic) ---
  async function onViewClick() {
    if (!tagDataForView || tagDataForView.id !== tagId) {
      try {
        const res = await tagServices.getOneTag(tagId);
        if (res?.data.status == "success") {
          setTagDataForView(res?.data.data.tag);
          setOpenView(true);
        } else {
          toast.error("Lấy chi tiết tag thất bại");
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi lấy dữ liệu.");
      }
    } else {
      setOpenView(true);
    }
  }

  // --- Xử lý SỬA (Refactored) ---
  // 1. Mở dialog và fetch data
  async function onEditClick() {
    try {
      const res = await tagServices.getOneTag(tagId);
      console.log("🚀 ~ onEditClick ~ res:", res);
      if (res?.data.status == "success") {
        const tag = res?.data.data.tag;
        // Dùng form.reset() để điền dữ liệu vào form
        form.reset({
          name: tag.name,
          meta_description: tag.meta_description || "", // <-- Đã bỏ slug
        });
        setOpenEdit(true);
      } else {
        toast.error("Lấy chi tiết tag thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lấy dữ liệu.");
    }
  }

  // 2. Submit form Sửa
  async function onConfirmEdit(formData) {
    try {
      const res = await tagServices.updateTag(tagId, formData);
      if (res.status === "success") {
        toast.success("Cập nhật tag thành công!");
        setOpenEdit(false);
        window.location.reload();
      } else {
        toast.error(res.message || "Cập nhật thất bại.");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật tag.");
    }
  }

  // 3. Đóng dialog Sửa
  function handleCloseEditDialog() {
    setOpenEdit(false);
    form.reset();
  }

  return (
    <>
      {/* --- Nút bấm trigger --- */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEditClick}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onViewClick}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenDelete(true)}
            className="text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* --- 1. Dialog Xóa (Không đổi) --- */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận Xóa</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Bạn có chắc muốn xóa tag <strong>{tagName}</strong> ?
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setOpenDelete(false)}
              disabled={isDeleteSubmitting}
            >
              Huỷ
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirmDelete}
              disabled={isDeleteSubmitting}
            >
              {isDeleteSubmitting ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- 2. Dialog Xem Chi Tiết (Không đổi) --- */}
      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{tagDataForView?.name}</DialogTitle>
            <DialogDescription>{tagDataForView?.slug}</DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {/* ID */}
            <div>
              <Label className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Hash className="h-4 w-4" />
                ID
              </Label>
              <p className="text-base font-mono">{tagDataForView?.id}</p>
            </div>

            {/* Meta Description */}
            <div>
              <Label className="text-sm text-muted-foreground">
                Mô tả Meta
              </Label>
              <p className="text-base">
                {tagDataForView?.meta_description || (
                  <span className="italic">Không có mô tả</span>
                )}
              </p>
            </div>

            {/* Thông tin ngày tháng và người dùng */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              {/* Ngày tạo */}
              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  Ngày tạo
                </Label>
                <p className="text-base">
                  {tagDataForView?.created_at
                    ? formatDate(tagDataForView.created_at)
                    : "N/A"}
                </p>
              </div>

              {/* Ngày cập nhật */}
              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Pencil className="h-4 w-4" />
                  Ngày cập nhật
                </Label>
                <p className="text-base">
                  {tagDataForView?.updated_at
                    ? formatDate(tagDataForView.updated_at)
                    : "N/A"}
                </p>
              </div>

              {/* Người tạo */}
              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  Người tạo
                </Label>
                <p className="text-base">{tagDataForView?.created_by_name}</p>
              </div>

              {/* Người cập nhật */}
              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  Người cập nhật
                </Label>
                <p className="text-base">{tagDataForView?.updated_by}</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenView(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- 3. Dialog Sửa (Refactored) --- */}
      <Dialog open={openEdit} onOpenChange={handleCloseEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Tag</DialogTitle>
            <DialogDescription>Cập nhật chi tiết cho tag.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onConfirmEdit)}
              className="space-y-4"
            >
              {/* Tên Tag */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên Tag</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isEditSubmitting} />
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
                        disabled={isEditSubmitting}
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
                  onClick={handleCloseEditDialog}
                  disabled={isEditSubmitting}
                >
                  Huỷ
                </Button>
                <Button type="submit" disabled={isEditSubmitting}>
                  {isEditSubmitting ? "Đang cập nhật..." : "Cập nhật"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
