// src/app/admin/users/page.jsx

"use client";
import React, { useEffect, useState, useMemo } from "react";
import { columns } from "@/components/admin/components/users/columns";
import { DataTable } from "@/components/admin/components/users/data-table"; // <-- Dùng data-table chung
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usersServices } from "@/services/admin/users"; // <-- Service mới
import { toast } from "sonner";
import { Users, Trash, UserPlus } from "lucide-react";
// !! ĐÃ XÓA: Button, Dialog, Form, Input, Select, yup, useForm...

export default function ListUsers() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [viewMode, setViewMode] = useState("active"); // 'active' | 'trash'
  const [isLoading, setIsLoading] = useState(true);
  // !! ĐÃ XÓA: [openAdd, setOpenAdd]
  // !! ĐÃ XÓA: [roles, setRoles]

  // --- Hàm lấy dữ liệu (active hoặc trash) ---
  async function getUsers(mode) {
    setIsLoading(true);
    try {
      const service =
        mode === "active"
          ? usersServices.getAllUser
          : usersServices.getDeletedUsers;
      const params = new URLSearchParams({ page: 1, limit: 9999 });
      const res = await service(params);
      setData(res?.data.data || []);
    } catch (error) {
      toast.error(`Lấy danh sách users (${mode}) thất bại`);
    } finally {
      setIsLoading(false);
    }
  }

  // --- Hàm lấy Stats (ĐÃ BỎ LẤY ROLES) ---
  async function getInitialData() {
    try {
      const statsRes = await usersServices.getUserStats();
      setStats(statsRes?.data || null);
    } catch (error) {
      toast.error("Lấy dữ liệu stats thất bại");
    }
  }

  // --- UseEffect lấy data lần đầu ---
  useEffect(() => {
    getInitialData();
    getUsers(viewMode);
  }, []);

  // --- Xử lý khi đổi Tab (Active/Trash) ---
  const onTabChange = (newMode) => {
    setViewMode(newMode);
    getUsers(newMode);
  };

  // !! ĐÃ XÓA: Cấu hình React Hook Form
  // !! ĐÃ XÓA: Hàm onSubmit (Thêm mới)
  // !! ĐÃ XÓA: Hàm handleCloseDialog

  // --- Memoize columns để truyền viewMode ---
  const memoizedColumns = useMemo(
    () =>
      columns.map((col) => ({
        ...col,
        meta: { ...col.meta, viewMode: viewMode },
      })),
    [viewMode]
  );

  return (
    <div className="space-y-4">
      {/* 1. Thống kê */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.total_users || "..."}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đang hoạt động
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.active_users || "..."}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thùng rác</CardTitle>
            <Trash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.deleted_users || "..."}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Thanh tiêu đề (ĐÃ BỎ NÚT THÊM) */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý Người Dùng</h1>
        {/* !! ĐÃ XÓA: Button Thêm User */}
      </div>

      {/* 3. Tabs và Bảng dữ liệu */}
      <Tabs value={viewMode} onValueChange={onTabChange}>
        <TabsList>
          <TabsTrigger value="active">Đang hoạt động</TabsTrigger>
          <TabsTrigger value="trash">Thùng rác</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <DataTable
            columns={memoizedColumns}
            data={data}
            isLoading={isLoading}
            meta={{ viewMode: viewMode }}
          />
        </TabsContent>
        <TabsContent value="trash">
          <DataTable
            columns={memoizedColumns}
            data={data}
            isLoading={isLoading}
            meta={{ viewMode: viewMode }}
          />
        </TabsContent>
      </Tabs>

      {/* !! ĐÃ XÓA: Dialog Thêm User */}
    </div>
  );
}
