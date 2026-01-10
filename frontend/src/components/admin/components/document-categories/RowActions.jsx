import React, { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";

import { documentCategoryServices } from "@/services/admin/documentCategoryServices";
import { documentCategorySchema } from "@/validation/documentCategorySchema";

export function RowActions({ row }) {
  const categoryId = row.original.id;
  const categoryName = row.original.name;

  // State cho 2 dialog
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);


  // --- Cấu hình React Hook Form cho Edit ---
  const form = useForm({
    resolver: yupResolver(documentCategorySchema),
  });
  const { isSubmitting: isEditSubmitting } = form.formState;

  // --- Xử lý XÓA ---
  async function onConfirmDelete() {
    setIsDeleteSubmitting(true);
    try {
      await documentCategoryServices.softDelete(categoryId); //
      toast.success("Đã xóa danh mục.");
      setOpenDelete(false);
      window.location.reload();
    } catch (error) {
      toast.error("Xóa danh mục thất bại.");
    } finally {
      setIsDeleteSubmitting(false);
    }
  }

  // --- Xử lý SỬA ---
  // 1. Mở dialog và fetch data
  async function onEditClick() {
    try {
      // Gọi API lấy chi tiết
      const dataRes = await documentCategoryServices.getOne(categoryId);

      // Xử lý dữ liệu chi tiết
      if (dataRes?.data.data) {
        const category = dataRes.data.data;
        form.reset({
          name: category.name,
        });
        setOpenEdit(true); // Mở dialog khi đã load thành công
      } else {
        toast.error("Lấy chi tiết danh mục thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lấy dữ liệu.");
    }
  }

  // 2. Submit form Sửa
  async function onConfirmEdit(formData) {
    try {
      const res = await documentCategoryServices.update(categoryId, formData); //
      if (res.status === "success") {
        toast.success("Cập nhật danh mục thành công!");
        setOpenEdit(false);
        window.location.reload();
      } else {
        toast.error(res.message || "Cập nhật thất bại.");
      }
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật.");
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEditClick}>
            <Pencil className="mr-2 h-4 w-4" />
            Sửa
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenDelete(true)}
            className="text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" />
            Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* --- Dialog Xóa --- */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận Xóa</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Bạn có chắc muốn xóa danh mục <strong>{categoryName}</strong>?
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenDelete(false)}>
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

      {/* --- Dialog Sửa --- */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Danh mục</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onConfirmEdit)}
              className="space-y-4"
            >
              {/* Tên Danh mục */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên Danh mục</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isEditSubmitting} />
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
