"use client";
import { DataTable } from "@/components/admin/components/documents/data-table"; // Dùng DataTable server-side
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

import { columns } from "@/components/admin/components/documents/columns";
import { documentServices } from "@/services/admin/documentServices";
import { documentCategoryServices } from "@/services/admin/documentCategoryServices"; // (API Giả định)
import { documentSchema } from "@/validation/documentSchema";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDebounce, useDebouncedSearch } from "@/hooks/useDebounce";
import Link from "next/link";
import { PlusCircle, Trash2 } from "lucide-react";

// === COMPONENT CHÍNH ===
export default function ListDocuments() {
  // Data state
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]); // State cho danh mục

  // Dialog state
  const [openAdd, setOpenAdd] = useState(false);

  // Server-side state
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [pageCount, setPageCount] = useState(0);

  const [sorting, setSorting] = useState([]); // BE chưa hỗ trợ, nhưng để đây
  const [globalFilter, setGlobalFilter] = useState(""); // Lọc theo 'title'
  const [categoryFilter, setCategoryFilter] = useState(""); // Lọc theo 'category_id'

  const debouncedSearch = useDebounce(globalFilter, 500);

  // Tải danh sách danh mục (cho Form và Filter)
  async function loadCategories() {
    try {
      const res = await documentCategoryServices.getAll();
      setCategories(res?.data?.data?.categories.data || []);
    } catch (error) {
      toast.error("Tải danh mục thất bại.");
    }
  }

  // Tải dữ liệu chính cho bảng
  async function loadData() {
    setIsLoading(true);
    try {
      const options = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearch,
        category_id: categoryFilter || undefined,
        // (BE chưa hỗ trợ sort)
      };

      const res = await documentServices.getAllDocuments(options);

      setData(res?.data?.data?.data || []);
      setPageCount(res?.data?.data?.pagination.totalPages || 0);
    } catch (error) {
      toast.error("Tải danh sách tài liệu thất bại.");
    } finally {
      setIsLoading(false);
    }
  }

  // Tải lại data khi state server-side thay đổi
  useEffect(() => {
    loadData();
  }, [pagination, sorting, debouncedSearch, categoryFilter]);

  // Tải danh mục khi mount
  useEffect(() => {
    loadCategories();
  }, []);

  // --- Cấu hình React Hook Form (cho Dialog Thêm) ---
  const form = useForm({
    resolver: yupResolver(documentSchema),
    defaultValues: {
      title: "",
      description: "",
      file_url: "",
      category_id: null,
      access_level: "public",
      status: 0,
    },
  });
  const { isSubmitting } = form.formState;

  // --- Xử lý Submit Form Thêm ---
  async function onSubmit(formData) {
    try {
      const res = await documentServices.createDocument(formData);
      if (res.status === "success") {
        toast.success("Thêm tài liệu mới thành công!");
        setOpenAdd(false);
        form.reset();
        loadData(); // Tải lại trang hiện tại
      } else {
        toast.error(res.message || "Thêm tài liệu thất bại.");
      }
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra khi thêm tài liệu.");
    }
  }

  function handleCloseDialog() {
    setOpenAdd(false);
    form.reset();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý Tài liệu</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/documents/deleted">
              <Trash2 className="mr-2 h-4 w-4" />
              Thùng rác
            </Link>
          </Button>
          <Button onClick={() => setOpenAdd(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm Tài liệu
          </Button>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        // State
        pagination={pagination}
        sorting={sorting}
        globalFilter={globalFilter}
        // Setters
        onPaginationChange={setPagination}
        onSortingChange={setSorting} // BE chưa hỗ trợ
        onGlobalFilterChange={setGlobalFilter}
        // Manual flags
        manualPagination={true}
        manualSorting={false} // Tắt sorting
        manualFiltering={true}
        // Counts
        pageCount={pageCount}
        // Filter tùy chỉnh
        customFilter={
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Lọc theo danh mục..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tất cả danh mục</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {/* --- Dialog Thêm Tài liệu --- */}
      <Dialog open={openAdd} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm Tài liệu Mới</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: Báo cáo tài chính quý 1"
                        {...field}
                      />
                    </FormControl>{" "}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* File URL */}
              <FormField
                control={form.control}
                name="file_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Tệp (Google Drive, ...)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>{" "}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả (Tùy chọn)</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>{" "}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                {/* Category */}
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ? String(field.value) : ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="— Chọn danh mục —" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
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

                {/* Access Level */}
                <FormField
                  control={form.control}
                  name="access_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Truy cập</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="public">Công khai</SelectItem>
                          <SelectItem value="member_only">
                            Thành viên
                          </SelectItem>
                          <SelectItem value="restricted">
                            Hạn chế (Chỉ định)
                          </SelectItem>
                        </SelectContent>
                      </Select>{" "}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">Bản nháp</SelectItem>
                          <SelectItem value="1">Xuất bản</SelectItem>
                        </SelectContent>
                      </Select>{" "}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
