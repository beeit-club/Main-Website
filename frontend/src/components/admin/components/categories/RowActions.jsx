// src/components/admin/components/categories/RowActions.jsx

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // <-- Import Select
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { categoryServices } from "@/services/admin/categories"; // <-- Service mới
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
  FolderTree, // <-- Icon cho cha-con
} from "lucide-react";
import { categorySchema } from "@/validation/postSchema";

export function RowActions({ row }) {
  // States cho 3 dialog
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);
  const [categoryDataForView, setCategoryDataForView] = useState(null);
  const [categoryList, setCategoryList] = useState([]); // <-- State cho dropdown

  const categoryId = row.original.id;
  const categorySlug = row.original.slug;
  const categoryName = row.original.name;

  // --- Cấu hình React Hook Form cho Edit ---
  const form = useForm({
    resolver: yupResolver(categorySchema),
  });
  const { isSubmitting: isEditSubmitting } = form.formState;

  // --- Xử lý XÓA ---
  async function onConfirmDelete() {
    setIsDeleteSubmitting(true);
    try {
      const res = await categoryServices.deleteCategory(categoryId);
      if (res?.data.status == "success") {
        toast.success("Xóa danh mục thành công");
        setOpenDelete(false);
        window.location.reload();
      } else {
        toast.error("Xóa danh mục không thành công");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa.");
    } finally {
      setIsDeleteSubmitting(false);
    }
  }

  // --- Xử lý XEM CHI TIẾT ---
  async function onViewClick() {
    if (!categoryDataForView || categoryDataForView.id !== categoryId) {
      try {
        const res = await categoryServices.getOneCategory(categoryId);
        if (res?.data.status == "success") {
          setCategoryDataForView(res?.data.data.category);
          setOpenView(true);
        } else {
          toast.error("Lấy chi tiết danh mục thất bại");
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi lấy dữ liệu.");
      }
    } else {
      setOpenView(true);
    }
  }

  // --- Xử lý SỬA ---
  // 1. Mở dialog và fetch data
  async function onEditClick() {
    try {
      // Gọi 2 API cùng lúc
      const [dataRes, listRes] = await Promise.all([
        categoryServices.getOneCategory(categoryId),
        categoryServices.getAllCategories(),
      ]);

      // Xử lý dữ liệu chi tiết
      if (dataRes?.data.status == "success") {
        const category = dataRes?.data.data.category;
        form.reset({
          name: category.name,
          parent_id: category.parent_id || "null", // Dùng string rỗng cho Select
        });
      } else {
        toast.error("Lấy chi tiết danh mục thất bại");
        return;
      }

      // Xử lý danh sách dropdown
      if (listRes?.data.data.categories.data) {
        // Lọc chính nó ra khỏi danh sách cha
        setCategoryList(
          listRes?.data.data.categories.data.filter(
            (cat) => cat.id !== categoryId
          )
        );
      } else {
        toast.error("Tải danh sách danh mục cha thất bại");
      }

      setOpenEdit(true); // Chỉ mở khi tất cả đã thành công
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lấy dữ liệu.");
    }
  }

  // 2. Submit form Sửa
  async function onConfirmEdit(formData) {
    try {
      const res = await categoryServices.updateCategory(categoryId, formData);
      if (res.status === "success") {
        toast.success("Cập nhật danh mục thành công!");
        setOpenEdit(false);
        window.location.reload();
      } else {
        toast.error(res.message || "Cập nhật thất bại.");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật.");
    }
  }

  // 3. Đóng dialog Sửa
  function handleCloseEditDialog() {
    setOpenEdit(false);
    form.reset();
  }

  // Hàm helper để hiển thị thông tin người dùng
  const renderUser = (userId) => {
    if (userId) return `ID: ${userId}`;
    return <span className="italic">Chưa xác định</span>;
  };

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

      {/* --- 1. Dialog Xóa --- */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận Xóa</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Bạn có chắc muốn xóa danh mục <strong>{categoryName}</strong> ?
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

      {/* --- 2. Dialog Xem Chi Tiết --- */}
      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{categoryDataForView?.name}</DialogTitle>
            <DialogDescription>{categoryDataForView?.slug}</DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {/* ID */}
            <div>
              <Label className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Hash className="h-4 w-4" />
                ID
              </Label>
              <p className="text-base font-mono">{categoryDataForView?.id}</p>
            </div>

            {/* Danh mục cha */}
            <div>
              <Label className="text-sm text-muted-foreground flex items-center gap-1.5">
                <FolderTree className="h-4 w-4" />
                Danh mục cha
              </Label>
              <p className="text-base">
                {categoryDataForView?.parent
                  ? categoryDataForView.parent.name
                  : "— Không có —"}
              </p>
            </div>

            {/* Thông tin ngày tháng và người dùng */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              {/* (Giữ nguyên logic giống RowActions của Tags) */}
              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  Ngày tạo
                </Label>
                <p className="text-base">
                  {categoryDataForView?.created_at
                    ? formatDate(categoryDataForView.created_at)
                    : "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  Người tạo
                </Label>
                <p className="text-base">
                  {renderUser(categoryDataForView?.created_by)}
                </p>
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

      {/* --- 3. Dialog Sửa --- */}
      <Dialog open={openEdit} onOpenChange={handleCloseEditDialog}>
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

              {/* Danh mục cha (Select) */}
              <FormField
                control={form.control}
                name="parent_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Danh mục cha</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={String(field.value || "null")}
                      disabled={isEditSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="— Chọn danh mục cha —" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="null">
                          — Là danh mục cha —
                        </SelectItem>
                        {categoryList.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.name}
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
