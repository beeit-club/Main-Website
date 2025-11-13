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
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Trash, UserCheck } from "lucide-react";

import { documentServices } from "@/services/admin/documentServices";
import { documentCategoryServices } from "@/services/admin/documentCategoryServices"; // (API Giả định)
import { documentSchema } from "@/validation/documentSchema";
import { AssignUserDialog } from "./AssignUserDialog"; // Component mới

export function RowActions({ row }) {
  const document = row.original;

  // State cho 3 dialog
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAssignUser, setOpenAssignUser] = useState(false);

  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);

  // --- Cấu hình React Hook Form cho Edit ---
  const form = useForm({
    resolver: yupResolver(documentSchema),
    defaultValues: {
      // Set giá trị mặc định khi dialog mở
      title: document.title,
      description: document.description || "",
      file_url: document.file_url || "",
      category_id: document.category_id || null,
      access_level: document.access_level || "public",
      status: document.status || 0,
    },
  });
  const { isSubmitting: isEditSubmitting } = form.formState;

  // Tải danh mục khi dialog Sửa mở
  async function loadCategoriesForEdit() {
    if (categories.length === 0) {
      try {
        const res = await documentCategoryServices.getAll();
        setCategories(res?.data?.data?.categories || []);
      } catch (error) {
        toast.error("Tải danh mục thất bại.");
      }
    }
  }

  // --- Xử lý XÓA ---
  async function onConfirmDelete() {
    setIsDeleteSubmitting(true);
    try {
      await documentServices.deleteDocument(document.id);
      toast.success("Đã chuyển tài liệu vào thùng rác.");
      setOpenDelete(false);
      window.location.reload(); // Tải lại trang
    } catch (error) {
      toast.error("Xóa tài liệu thất bại.");
    } finally {
      setIsDeleteSubmitting(false);
    }
  }

  // --- Xử lý SỬA ---
  function onEditClick() {
    // Reset form về giá trị của row này
    form.reset({
      title: document.title,
      description: document.description || "",
      file_url: document.file_url || "",
      category_id: document.category_id || null,
      access_level: document.access_level || "public",
      status: document.status || 0,
    });
    loadCategoriesForEdit(); // Tải danh mục
    setOpenEdit(true);
  }

  async function onConfirmEdit(formData) {
    try {
      const res = await documentServices.updateDocument(document.id, formData);
      if (res.status === "success") {
        toast.success("Cập nhật tài liệu thành công!");
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
          {/* Chỉ hiển thị nút gán quyền nếu access_level = 'restricted' */}
          {document.access_level === "restricted" && (
            <DropdownMenuItem onClick={() => setOpenAssignUser(true)}>
              <UserCheck className="mr-2 h-4 w-4" />
              Gán quyền
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setOpenDelete(true)}
            className="text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" />
            Xóa (Thùng rác)
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
            Bạn có chắc muốn chuyển tài liệu <strong>{document.title}</strong>{" "}
            vào thùng rác?
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Tài liệu</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onConfirmEdit)}
              className="space-y-4"
            >
              {/* (Copy toàn bộ FormFields từ page.jsx: title, file_url, description, category_id, access_level, status) */}
              {/* ... (Ví dụ: FormField cho title) ... */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>{" "}
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* ... (Các fields còn lại) ... */}
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

      {/* --- Dialog Gán Quyền (Component riêng) --- */}
      <AssignUserDialog
        open={openAssignUser}
        onOpenChange={setOpenAssignUser}
        docId={document.id}
        docTitle={document.title}
      />
    </>
  );
}
