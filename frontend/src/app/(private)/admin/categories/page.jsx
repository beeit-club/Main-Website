// src/app/admin/categories/page.jsx

"use client";
import { columns } from "@/components/admin/components/categories/columns";
import { DataTable } from "@/components/admin/components/categories/data-table";
import { Button } from "@/components/ui/button";
import { categoryServices } from "@/services/admin/categories";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
import { PaginationControls } from "@/components/common/Pagination";
import { useSearchParams } from "next/navigation";

export default function ListCategories() {
  const [openAdd, setOpenAdd] = useState(false);
  const searchParams = useSearchParams();
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ totalPages: 0, total: 0 });
  const [viewMode, setViewMode] = useState(
    // Đọc 'status' từ URL, nếu không có thì mặc định là 'active'
    searchParams.get("status") || "active"
  )

  // State chung cho cả tab Active và Trash
  const [columnFilters, setColumnFilters] = useState([]);
  const [cateName, setCateName] = useState(searchParams.get("name") || "");
  const [pagination, setPagination] = useState({
    pageIndex: searchParams.get("page")
      ? parseInt(searchParams.get("page")) - 1 // API tính page 1, TanStack tính page 0
      : 0,
    pageSize: searchParams.get("limit")
      ? parseInt(searchParams.get("limit"))
      : 10,
  });
  // Đổi tab (Active/Trash)
  const onTabChange = (newMode) => {
    // 1. Chỉ cần cập nhật state 'viewMode'
    setViewMode(newMode);
    // 2. Reset về trang 1 khi đổi tab
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setCateName("");
    setColumnFilters([]);
    // 3. 'useEffect' ở trên sẽ tự động được kích hoạt
    //    và nó sẽ lo phần còn lại (cập nhật URL, gọi API)
  };

  const memoizedColumns = useMemo(
    () =>
      columns.map((col) => ({
        ...col,
        meta: { ...col.meta, viewMode: viewMode },
      })),
    [viewMode]
  );
  // Lấy dữ liệu cho Dropdown (danh sách phẳng)
  async function loadCategoryList() {
    const params = new URLSearchParams();
    // 1. State Phân trang
    params.set("page", (pagination.pageIndex + 1).toString());
    params.set("limit", pagination.pageSize.toString());

    // 2.Tìm kiếm theo tên
    if (cateName) {
      params.set("name", cateName);
    }
    try {
      const service = viewMode === "active"
        ? categoryServices.getAllCategories
        : categoryServices.getAllDeletedCategories;
      const res = await service(params);
      setMeta({
        totalPages: res?.data?.data?.categories.pagination?.totalPages || 0,
        total: res?.data?.data?.categories.pagination?.total || 0,
      });
      setData(res?.data.data.categories.data || []);
    } catch (error) {
      toast.error("Tải danh sách danh mục cha thất bại");
    }
  }

  useEffect(() => {
    loadCategoryList(); // Tải danh sách cho dropdown
  }, [pagination.pageIndex,
  pagination.pageSize,
    searchParams,
    cateName,
    columnFilters,
    viewMode]);

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
      <Tabs value={viewMode} onValueChange={onTabChange}>
        <TabsList>
          <TabsTrigger value="active">Đang hoạt động</TabsTrigger>
          <TabsTrigger value="trash">Thùng rác</TabsTrigger>
        </TabsList>

        {/* Nội dung Tab "Active" */}
        <TabsContent value="active">
          <DataTable
            columns={memoizedColumns}
            data={data}
            cateName={cateName}
            setCateName={setCateName}
            meta={{ viewMode: viewMode }}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters} />
          {/* pagination */}
          <PaginationControls
            pagination={pagination}
            meta={meta}
            setPagination={setPagination}
          />
        </TabsContent>

        {/* Nội dung Tab "Trash" */}
        <TabsContent value="trash">
          <DataTable
            columns={memoizedColumns}
            data={data}
            cateName={cateName}
            setCateName={setCateName}
            meta={{ viewMode: viewMode }}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters} />
          {/* pagination */}
          <PaginationControls
            pagination={pagination}
            meta={meta}
            setPagination={setPagination}
          />
        </TabsContent>
      </Tabs>
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
                        {data.map((cat) => (
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
