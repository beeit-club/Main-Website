// src/app/admin/tags/page.jsx

"use client";
import { columns } from "@/components/admin/components/tags/columns";
import { DataTable } from "@/components/admin/components/tags/data-table";
import { Button } from "@/components/ui/button";
import { tagServices } from "@/services/admin/tags";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { tagSchema } from "@/validation/postSchema";
import { PaginationControls } from "@/components/common/Pagination";
import { useSearchParams } from "next/navigation";

export default function ListTags() {
  const searchParams = useSearchParams();
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ totalPages: 0, total: 0 });
  const [openAdd, setOpenAdd] = useState(false);
  const [viewMode, setViewMode] = useState(
    // Đọc 'status' từ URL, nếu không có thì mặc định là 'active'
    searchParams.get("status") || "active"
  )

  // State chung cho cả tab Active và Trash
  const [columnFilters, setColumnFilters] = useState([]);
  const [tagName, setTagName] = useState(searchParams.get("name") || "");
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
    setTagName("");
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

  // Hàm lấy dữ liệu
  async function getTags() {
    const params = new URLSearchParams();
    // 1. State Phân trang
    params.set("page", (pagination.pageIndex + 1).toString());
    params.set("limit", pagination.pageSize.toString());

    // State Tìm kiếm theo title 
    if (tagName) {
      params.set("name", tagName);
    }

    try {
      const service = viewMode === "active"
        ? tagServices.getAllTags
        : tagServices.getDeletedTags;
      const res = await service(params);
      setData(res?.data.data.data || []);
      setMeta({
        totalPages: res?.data?.data?.pagination?.totalPages || 0,
        total: res?.data?.data?.pagination?.total || 0,
      });
    } catch (error) {
      toast.error("Lấy danh sách tags thất bại");
    }
  }

  useEffect(() => {
    getTags();
  }, [pagination.pageIndex,
  pagination.pageSize,
    searchParams,
    tagName,
    columnFilters,
    viewMode]);

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

      <Tabs value={viewMode} onValueChange={onTabChange}>
        <TabsList>
          <TabsTrigger value="active">Đang hoạt động</TabsTrigger>
          <TabsTrigger value="trash">Thùng rác</TabsTrigger>
        </TabsList>

        {/* Nội dung Tab "Active" */}
        <TabsContent value="active">
          <DataTable columns={memoizedColumns}
            data={data}
            tagName={tagName}
            setTagName={setTagName}
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
          <DataTable columns={memoizedColumns}
            data={data}
            tagName={tagName}
            setTagName={setTagName}
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
