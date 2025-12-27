"use client";

import { columns } from "@/components/admin/components/memory-flow/columns";
import { DataTable } from "@/components/admin/components/memory-flow/data-table";
import { Button } from "@/components/ui/button";
import { memoryFlowService } from "@/services/admin/memoryFlow";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

export default function MemoryFlowPage() {
  const searchParams = useSearchParams();
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ totalPages: 0, total: 0 });
  const [viewMode, setViewMode] = useState(
    searchParams.get("status") || "active"
  );
  const [columnFilters, setColumnFilters] = useState([]);
  const [title, setTitle] = useState(searchParams.get("title") || "");
  const [pagination, setPagination] = useState({
    pageIndex: searchParams.get("page")
      ? parseInt(searchParams.get("page")) - 1
      : 0,
    pageSize: searchParams.get("limit")
      ? parseInt(searchParams.get("limit"))
      : 10,
  });
  const [loading, setLoading] = useState(true);

  const onTabChange = (newMode) => {
    setViewMode(newMode);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setTitle("");
    setColumnFilters([]);
  };

  const memoizedColumns = useMemo(
    () =>
      columns.map((col) => ({
        ...col,
        meta: { ...col.meta, viewMode: viewMode },
      })),
    [viewMode]
  );

  async function getItems() {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", (pagination.pageIndex + 1).toString());
    params.set("limit", pagination.pageSize.toString());

    if (title) {
      params.set("search", title);
    }

    try {
      const service =
        viewMode === "active"
          ? memoryFlowService.getAll
          : memoryFlowService.getDeleted;

      const res = await service(params);
      if (viewMode === "active") {
        setMeta({
          totalPages: res?.data?.data?.pagination?.totalPages || 0,
          total: res?.data?.data?.pagination?.total || 0,
          currentPage: res?.data?.data?.pagination?.currentPage || 1,
        });
        setData(res?.data?.data?.data || []);
      } else {
        setMeta({
          totalPages: res?.data?.data?.pagination?.totalPages || 0,
          total: res?.data?.data?.pagination?.total || 0,
          currentPage: res?.data?.data?.pagination?.currentPage || 1,
        });
        setData(res?.data?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching memory flow:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getItems();
  }, [pagination.pageIndex, pagination.pageSize, viewMode, title]);

  if (loading) {
    return <div className="p-6">Đang tải...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Memory Flow</h1>
          <p className="text-muted-foreground">
            Quản lý ảnh hiển thị trong Memory Flow section
          </p>
        </div>
        <Link href="/admin/landing/memory-flow/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm mới
          </Button>
        </Link>
      </div>

      <Tabs value={viewMode} onValueChange={onTabChange}>
        <TabsList>
          <TabsTrigger value="active">Đang hoạt động</TabsTrigger>
          <TabsTrigger value="trash">Thùng rác</TabsTrigger>
        </TabsList>
        <TabsContent value={viewMode}>
          <DataTable
            columns={memoizedColumns}
            data={data}
            meta={meta}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            title={title}
            setTitle={setTitle}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

