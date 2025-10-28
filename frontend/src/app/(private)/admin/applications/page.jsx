// src/app/admin/applications/page.jsx
"use client";
import React, { useEffect, useState } from "react";
import { columns } from "@/components/admin/components/applications/columns";
// Giả sử bạn dùng DataTable chung
import { DataTable } from "@/components/admin/components/users/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { applicationServices } from "@/services/admin/applications";
import { toast } from "sonner";

export default function ListApplications() {
  const [data, setData] = useState([]);
  const [viewMode, setViewMode] = useState("0"); // Status 0 (Chờ xử lý)
  const [isLoading, setIsLoading] = useState(true);

  // --- Hàm lấy dữ liệu (theo status) ---
  async function getApplications(mode) {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: 1,
        limit: 9999,
        status: mode, // Dùng mode (status) để filter API
      });
      const res = await applicationServices.getAllApplications(params);
      setData(res?.data.data || []);
    } catch (error) {
      toast.error(`Lấy danh sách đơn (status: ${mode}) thất bại`);
    } finally {
      setIsLoading(false);
    }
  }

  // --- UseEffect lấy data lần đầu (Tab "0") ---
  useEffect(() => {
    getApplications(viewMode);
  }, []);

  // --- Xử lý khi đổi Tab ---
  const onTabChange = (newMode) => {
    setViewMode(newMode);
    getApplications(newMode);
  };

  return (
    <div className="space-y-4">
      {/* 1. Thanh tiêu đề */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý Đơn Gia Nhập</h1>
      </div>

      {/* 2. Tabs và Bảng dữ liệu */}
      <Tabs value={viewMode} onValueChange={onTabChange}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="0">Chờ xử lý (Mới)</TabsTrigger>
          <TabsTrigger value="1">Chờ phỏng vấn</TabsTrigger>
          <TabsTrigger value="2">Đã đặt lịch</TabsTrigger>
          <TabsTrigger value="3">Đã duyệt</TabsTrigger>
          <TabsTrigger value="4">Đã từ chối</TabsTrigger>
        </TabsList>

        {/* 5 TabsContent dùng chung 1 DataTable, chỉ khác meta */}
        <TabsContent value="0">
          <DataTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            meta={{ viewMode: "0" }}
          />
        </TabsContent>
        <TabsContent value="1">
          <DataTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            meta={{ viewMode: "1" }}
          />
        </TabsContent>
        <TabsContent value="2">
          <DataTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            meta={{ viewMode: "2" }}
          />
        </TabsContent>
        <TabsContent value="3">
          <DataTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            meta={{ viewMode: "3" }}
          />
        </TabsContent>
        <TabsContent value="4">
          <DataTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            meta={{ viewMode: "4" }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
