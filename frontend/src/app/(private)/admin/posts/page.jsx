"use client";
import { columns } from "@/components/admin/components/posts/columns";
import { DataTable } from "@/components/admin/components/posts/data-table";
import { Button } from "@/components/ui/button";
// import { columns } from "@/components/admin/components/posts/columns";
import { postServices } from "@/services/admin/post";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { PaginationControls } from "@/components/common/Pagination";
import { categoryServices } from "@/services/admin/categories";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";



// Thư viện này rất nặng và sẽ không được tải cho đến khi cần
// CÁCH MỚI (Dành cho named export 'DataTable')
const HeavyChartComponent = dynamic(
  () =>
    import("@/components/admin/components/posts/data-table").then(
      (mod) => mod.DataTable // <--- Thêm dòng này
    ),
  {
    ssr: false,
    loading: () => <p>Đang tải bảng...</p>,
  }
);
export default function ListPost() {
  const searchParams = useSearchParams();
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ totalPages: 0, total: 0 });
  const [viewMode, setViewMode] = useState(
    // Đọc 'status' từ URL, nếu không có thì mặc định là 'active'
    searchParams.get("status") || "active"
  )
  const [categoryList, setCategoryList] = useState([]);

  // State chung cho cả tab Active và Trash
  const [columnFilters, setColumnFilters] = useState([]);
  const [title, setTitle] = useState(searchParams.get("title") || "");
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
    setTitle("");
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

  async function getPost() {
    // debugger;
    const params = new URLSearchParams();
    // 1. State Phân trang
    params.set("page", (pagination.pageIndex + 1).toString());
    params.set("limit", pagination.pageSize.toString());

    // State Tìm kiếm theo title 
    if (title) {
      params.set("title", title);
    }

    // 4. State Bộ lọc cột
    columnFilters.forEach((filter) => {
      if (filter.value && filter.id !== 'category_name') {
        params.set(filter.id, filter.value);
      }
      else if (filter.value && filter.id == 'category_name') {
        params.set('category_id', filter.value);
      }
    });

    try {
      const service = viewMode === "active"
        ? postServices.getAllPost
        : postServices.getDeletedPosts;

      const res = await service(params);
      if (viewMode === "active") {
        setMeta({
          totalPages: res?.data?.data?.pagination?.totalPages || 0,
          total: res?.data?.data?.pagination?.total || 0,
        });
        setData(res?.data?.data?.data);
      } else {
        setData(res?.data?.data)
        // setMeta({ totalPages: 0, total: 0 }); //bổ sung pagination cho trash sau
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }

  useEffect(() => {
    getPost();
  }, [pagination.pageIndex,
  pagination.pageSize,
    searchParams,
    title,
    columnFilters,
    viewMode]);

  async function loadCategoryList() {
    try {
      const res = await categoryServices.getAllClientCategories();
      setCategoryList(res?.data?.data?.categories.data || []);
    } catch (error) {
      toast.error("Tải danh sách danh mục cha thất bại");
    }
  }
  useEffect(() => {
    loadCategoryList();
  }, []);

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Danh sách bài viết</h1>
        <Link href={"/admin/posts/add"}>
          <Button>Thêm bài viết</Button>
        </Link>
      </div>
      <Tabs value={viewMode} onValueChange={onTabChange}>
        <TabsList>
          <TabsTrigger value="active">Đang hoạt động</TabsTrigger>
          <TabsTrigger value="trash">Thùng rác</TabsTrigger>
        </TabsList>

        {/* Nội dung Tab "Active" */}
        <TabsContent value="active">
          <HeavyChartComponent columns={memoizedColumns}
            data={data}
            title={title}
            setTitle={setTitle}
            meta={{ viewMode: viewMode }}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            categoryList={categoryList}
          />
          <PaginationControls
            pagination={pagination}
            meta={meta}
            setPagination={setPagination}
          />
        </TabsContent>

        {/* Nội dung Tab "Trash" */}
        <TabsContent value="trash">
          <HeavyChartComponent columns={memoizedColumns}
            data={data}
            title={title}
            setTitle={setTitle}
            meta={{ viewMode: viewMode }}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            categoryList={categoryList}
          />
          <PaginationControls
            pagination={pagination}
            meta={meta}
            setPagination={setPagination}
          />
        </TabsContent>
      </Tabs>


    </div>
  );
}
