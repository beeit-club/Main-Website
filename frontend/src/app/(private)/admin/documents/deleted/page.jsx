"use client";
import { DataTable } from "@/components/admin/components/documents/data-table"; // Dùng DataTable server-side
import { Button } from "@/components/ui/button";
import { DeletedColumns } from "@/components/admin/components/documents/deleted/DeletedColumns";
import { documentServices } from "@/services/admin/documentServices";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DeletedDocuments() {
  const [data, setData] = useState([]);
  console.log("🚀 ~ DeletedDocuments ~ data:", data);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [pageCount, setPageCount] = useState(0);

  async function loadData() {
    setIsLoading(true);
    try {
      const options = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      };
      const res = await documentServices.getDeletedDocuments(options);
      console.log("🚀 ~ loadData ~ res:", res);

      setData(res?.data?.data?.documents?.data || []);
      setPageCount(res?.data?.data?.documents?.pagination.totalPages || 0);
    } catch (error) {
      toast.error("Tải thùng rác thất bại.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [pagination]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Thùng rác - Tài liệu</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/documents">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Link>
        </Button>
      </div>

      <DataTable
        columns={DeletedColumns(loadData)} // Truyền hàm loadData để RowActions gọi
        data={data}
        isLoading={isLoading}
        pagination={pagination}
        onPaginationChange={setPagination}
        manualPagination={true}
        pageCount={pageCount}
        // Tắt filter/sort cho trang thùng rác
        manualFiltering={false}
        manualSorting={false}
      />
    </div>
  );
}
