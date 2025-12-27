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
import { useDebounce, useDebouncedSearch } from "@/hooks/useDebounce";
import { PlusCircle } from "lucide-react";

// === COMPONENT CHÍNH ===
export default function ListDocumentCategories() {
  // Data state
  const [data, setData] = useState([]); // Dữ liệu cho bảng (đã phân trang)

  const [isLoading, setIsLoading] = useState(true);

  // Dialog state
  const [openAdd, setOpenAdd] = useState(false);

  // Server-side state
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [pageCount, setPageCount] = useState(0);
  const [globalFilter, setGlobalFilter] = useState(""); // Lọc theo 'name'

  const debouncedSearch = useDebounce(globalFilter, 500);


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
      // Response structure: { status, message, data: { documentCategories: { data: [...], pagination: {...} } } }
      const documentCategories = res?.data?.data?.documentCategories || {};
      const categories = documentCategories?.data || res?.data?.data?.data || [];
      setData(categories);
      setPageCount(documentCategories?.pagination?.totalPages || res?.data?.data?.pagination?.totalPages || 0);
    } catch (error) {
      console.error("❌ Error loading data:", error);
      toast.error("Tải danh sách tài liệu thất bại.");
    } finally {
      setIsLoading(false);
    }
  }

  // Tải lại data khi state server-side thay đổi
  useEffect(() => {
    loadData();
  }, [pagination, debouncedSearch]);

  // --- Cấu hình React Hook Form (cho Dialog Thêm) ---
  const form = useForm({
    resolver: yupResolver(documentCategorySchema),
    defaultValues: {
      name: "",
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
      } else {
        toast.error(res.message || "Thêm danh mục thất bại.");
      }
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra khi thêm danh mục.");
    }
  }

  function handleCloseDialog() {
    setOpenAdd(false);
    form.reset({ name: "" });
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
        data={data}
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
