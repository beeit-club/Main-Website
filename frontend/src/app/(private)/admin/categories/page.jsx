// src/app/admin/categories/page.jsx

"use client";
import { columns } from "@/components/admin/components/categories/columns";
import { DataTable } from "@/components/admin/components/categories/data-table";
import { Button } from "@/components/ui/button";
import { categoryServices } from "@/services/admin/categories";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // <-- Import Select
import { Input } from "@/components/ui/input";
import { categorySchema } from "@/validation/postSchema";

export default function ListCategories() {
  const [data, setData] = useState([]);
  const [categoryList, setCategoryList] = useState([]); // <-- State cho dropdown
  const [openAdd, setOpenAdd] = useState(false);

  // Lấy dữ liệu cho Dropdown (danh sách phẳng)
  async function loadCategoryList() {
    try {
      const res = await categoryServices.getAllCategories();
      setCategoryList(res?.data.data.categories.data || []); // Giả sử BE trả về mảng
      setData(res?.data.data.pagination || []);
    } catch (error) {
      toast.error("Tải danh sách danh mục cha thất bại");
    }
  }

  useEffect(() => {
    loadCategoryList(); // Tải danh sách cho dropdown
  }, []);

  // --- Cấu hình React Hook Form ---
  const form = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      name: "",
      parent_id: "null", // Dùng string rỗng cho Select
    },
  });

  const { isSubmitting } = form.formState;

  // --- Xử lý Submit Form Thêm ---
  async function onSubmit(formData) {
    try {
      const res = await categoryServices.createCategory(formData);
      if (res.status === "success") {
        toast.success("Thêm danh mục mới thành công!");
        setOpenAdd(false);
        form.reset();
        window.location.reload();
      } else {
        toast.error(res.message || "Thêm danh mục thất bại.");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm danh mục.");
    }
  }

  function handleCloseDialog() {
    setOpenAdd(false);
    form.reset({ name: "", parent_id: "null" });
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Danh sách Danh mục</h1>
        <Button onClick={() => setOpenAdd(true)}>Thêm Danh mục</Button>
      </div>
      <DataTable columns={columns} data={categoryList} />

      {/* --- Dialog Thêm Danh mục --- */}
      <Dialog open={openAdd} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thêm Danh mục Mới</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Tên Danh mục */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên Danh mục</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: Lập Trình"
                        {...field}
                        disabled={isSubmitting}
                      />
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
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="— Chọn danh mục cha —" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* Lựa chọn "Không có" */}
                        <SelectItem value="null">
                          — Là danh mục cha —
                        </SelectItem>
                        {/* Map qua danh sách */}
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
