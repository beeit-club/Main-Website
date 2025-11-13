"use client";
import { DataTable } from "@/components/admin/components/document-categories/data-table";
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

import { columns } from "@/components/admin/components/document-categories/columns";
import { documentCategoryServices } from "@/services/admin/documentCategoryServices";
import { documentCategorySchema } from "@/validation/documentCategorySchema";

import React, { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDebounce } from "@/hooks/useDebounce";
import { PlusCircle } from "lucide-react";

// === COMPONENT CHÍNH ===
export default function ListDocumentCategories() {
  // Data state
  const [data, setData] = useState([]); // Dữ liệu cho bảng (đã phân trang)
  console.log("🚀 ~ ListDocumentCategories ~ data:", data);
  const [categoryList, setCategoryList] = useState([]); // Danh sách đầy đủ (cho dropdown)
  const [categoryMap, setCategoryMap] = useState(new Map()); // Map ID -> Tên (để hiển thị)

  const [isLoading, setIsLoading] = useState(true);

  // Dialog state
  const [openAdd, setOpenAdd] = useState(false);

  // Server-side state
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [pageCount, setPageCount] = useState(0);
  const [globalFilter, setGlobalFilter] = useState(""); // Lọc theo 'name'

  const debouncedSearch = useDebounce(globalFilter, 500);

  // Tải danh sách đầy đủ (cho dropdown và mapping)
  async function loadAllCategories() {
    try {
      const res = await documentCategoryServices.getAll({ limit: 1000 }); // Lấy tất cả
      const categories = res?.data.data.data || [];
      setCategoryList(categories);

      // Tạo Map để tra cứu tên
      const map = new Map();
      categories.forEach((cat) => {
        map.set(cat.id, cat.name);
      });
      setCategoryMap(map);
    } catch (error) {
      toast.error("Tải danh sách danh mục (đầy đủ) thất bại.");
    }
  }

  // Tải dữ liệu chính cho bảng (phân trang)
  async function loadData() {
    setIsLoading(true);
    try {
      const options = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        name: debouncedSearch, // BE lọc theo 'name'
      };

      const res = await documentCategoryServices.getAll(options);
      const categories = res?.data.data.data || [];
      setData(categories || []);
      setPageCount(res?.data.data.pagination.totalPages || 0);
    } catch (error) {
      toast.error("Tải danh sách tài liệu thất bại.");
    } finally {
      setIsLoading(false);
    }
  }

  // Tải lại data khi state server-side thay đổi
  useEffect(() => {
    loadData();
  }, [pagination, debouncedSearch]);

  // Tải danh sách đầy đủ khi mount
  useEffect(() => {
    loadAllCategories();
  }, []);

  // Transform data để thêm parent_name
  const displayData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      parent_name: categoryMap.get(item.parent_id) || "— Không có —", //
    }));
  }, [data, categoryMap]);

  // --- Cấu hình React Hook Form (cho Dialog Thêm) ---
  const form = useForm({
    resolver: yupResolver(documentCategorySchema),
    defaultValues: {
      name: "",
      parent_id: "null", // Dùng "null" string cho Select
    },
  });
  const { isSubmitting } = form.formState;

  // --- Xử lý Submit Form Thêm ---
  async function onSubmit(formData) {
    try {
      const res = await documentCategoryServices.create(formData);
      if (res.status === "success") {
        toast.success("Thêm danh mục mới thành công!");
        setOpenAdd(false);
        form.reset();
        loadData(); // Tải lại trang hiện tại
        loadAllCategories(); // Tải lại danh sách đầy đủ
      } else {
        toast.error(res.message || "Thêm danh mục thất bại.");
      }
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra khi thêm danh mục.");
    }
  }

  function handleCloseDialog() {
    setOpenAdd(false);
    form.reset({ name: "", parent_id: "null" });
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Danh mục Tài liệu</h1>
        <Button onClick={() => setOpenAdd(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Thêm Danh mục
        </Button>
      </div>

      {/* Bảng dữ liệu */}
      <DataTable
        columns={columns}
        data={displayData} // Dùng data đã biến đổi
        isLoading={isLoading}
        // State
        pagination={pagination}
        globalFilter={globalFilter}
        // Setters
        onPaginationChange={setPagination}
        onGlobalFilterChange={setGlobalFilter}
        // Manual flags
        manualPagination={true}
        manualSorting={false} // BE không hỗ trợ sort
        manualFiltering={true}
        // Counts
        pageCount={pageCount}
        // Không có customFilter
      />

      {/* --- Dialog Thêm Danh mục --- */}
      <Dialog open={openAdd} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thêm Danh mục Mới</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên Danh mục</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: Hướng dẫn sử dụng" {...field} />
                    </FormControl>{" "}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Parent ID */}
              <FormField
                control={form.control}
                name="parent_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Danh mục cha</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={String(field.value || "null")}
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
                    </Select>{" "}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={handleCloseDialog}
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
