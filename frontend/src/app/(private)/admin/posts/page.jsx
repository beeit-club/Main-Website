"use client";
import { columns } from "@/components/admin/components/posts/columns";
import { DataTable } from "@/components/admin/components/posts/data-table";
import { Button } from "@/components/ui/button";
// import { columns } from "@/components/admin/components/posts/columns";
import { postServices } from "@/services/admin/post";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { PaginationControls } from "@/components/common/Pagination";
import { categoryServices } from "@/services/admin/categories";


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
  const [globalFilter, setGlobalFilter] = useState(
    searchParams.get("search") || ""
  );
  const [columnFilters, setColumnFilters] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  const [pagination, setPagination] = useState({
    pageIndex: searchParams.get("page")
      ? parseInt(searchParams.get("page")) - 1 // API tính page 1, TanStack tính page 0
      : 0,
    pageSize: searchParams.get("limit")
      ? parseInt(searchParams.get("limit"))
      : 10,
  });

  async function getPost() {
    const params = new URLSearchParams();
    // 1. State Phân trang
    params.set("page", (pagination.pageIndex + 1).toString());
    params.set("limit", pagination.pageSize.toString());

    // 2. State Tìm kiếm
    if (globalFilter) {
      params.set("search", globalFilter);
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

    const res = await postServices.getAllPost(params);
    setMeta({
      totalPages: res?.data?.data?.pagination?.totalPages || 0,
      total: res?.data?.data?.pagination?.total || 0,
    });
    setData(res?.data?.data?.data);
  }
  useEffect(() => {
    getPost();
  }, [pagination.pageIndex,
  pagination.pageSize,
    searchParams,
    globalFilter,
    columnFilters]);

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
      <HeavyChartComponent columns={columns}
        data={data}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        categoryList={categoryList}
      />
      <PaginationControls
        pagination={pagination}
        meta={meta}
        setPagination={setPagination}
      />
    </div>
  );
}
