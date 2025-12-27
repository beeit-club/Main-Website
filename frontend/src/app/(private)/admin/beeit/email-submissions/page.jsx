"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { beeitServices } from "@/services/admin/beeitServices";
import { Mail, CheckCircle2, Archive, Loader2, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function EmailSubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filters, setFilters] = useState({
    email: "",
    status: "",
  });
  const [meta, setMeta] = useState({ totalPages: 0, total: 0 });

  useEffect(() => {
    loadSubmissions();
    loadStatistics();
  }, [pagination, filters]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        ...filters,
      };
      const res = await beeitServices.emailSubmissions.getAll(params);
      setSubmissions(res?.data?.data?.data || []);
      setMeta({
        totalPages: res?.data?.data?.pagination?.totalPages || 0,
        total: res?.data?.data?.pagination?.total || 0,
        currentPage: res?.data?.data?.pagination?.currentPage || 1,
      });
    } catch (error) {
      toast.error("Không thể tải danh sách Email submissions");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const res = await beeitServices.emailSubmissions.getStatistics();
      setStats(res?.data?.data?.stats);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAsProcessed = async (id) => {
    try {
      setProcessing(id);
      await beeitServices.emailSubmissions.markAsProcessed(id);
      toast.success("Đánh dấu đã xử lý thành công!");
      await loadSubmissions();
      await loadStatistics();
    } catch (error) {
      toast.error("Thao tác thất bại");
      console.error(error);
    } finally {
      setProcessing(null);
    }
  };

  const handleMarkAsArchived = async (id) => {
    try {
      setProcessing(id);
      await beeitServices.emailSubmissions.markAsArchived(id);
      toast.success("Đánh dấu đã lưu trữ thành công!");
      await loadSubmissions();
      await loadStatistics();
    } catch (error) {
      toast.error("Thao tác thất bại");
      console.error(error);
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      new: "default",
      processed: "secondary",
      archived: "outline",
    };
    const labels = {
      new: "Mới",
      processed: "Đã xử lý",
      archived: "Đã lưu trữ",
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý Email Submissions</h1>
        <p className="text-muted-foreground mt-2">
          Xem và quản lý các email đăng ký từ form Footer
        </p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Tổng số</CardDescription>
              <CardTitle className="text-2xl">{stats.total || 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Mới</CardDescription>
              <CardTitle className="text-2xl text-primary">{stats.new || 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Đã xử lý</CardDescription>
              <CardTitle className="text-2xl text-secondary">{stats.processed || 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Đã lưu trữ</CardDescription>
              <CardTitle className="text-2xl text-muted-foreground">{stats.archived || 0}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm email..."
                value={filters.email}
                onChange={(e) => {
                  setFilters({ ...filters, email: e.target.value });
                  setPagination({ ...pagination, pageIndex: 0 });
                }}
                className="max-w-sm"
              />
            </div>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => {
                setFilters({ ...filters, status: value === "all" ? "" : value });
                setPagination({ ...pagination, pageIndex: 0 });
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="new">Mới</SelectItem>
                <SelectItem value="processed">Đã xử lý</SelectItem>
                <SelectItem value="archived">Đã lưu trữ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Email Submissions</CardTitle>
          <CardDescription>
            Tổng cộng: {meta.total} email
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Không có email submission nào
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{submission.email}</span>
                      {getStatusBadge(submission.status)}
                    </div>
                    <div className="text-sm text-muted-foreground ml-7">
                      {submission.submitted_at &&
                        format(new Date(submission.submitted_at), "PPp", { locale: vi })}
                    </div>
                    {submission.notes && (
                      <div className="text-sm text-muted-foreground ml-7">
                        Ghi chú: {submission.notes}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {submission.status === "new" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsProcessed(submission.id)}
                        disabled={processing === submission.id}
                      >
                        {processing === submission.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Đã xử lý
                          </>
                        )}
                      </Button>
                    )}
                    {submission.status !== "archived" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsArchived(submission.id)}
                        disabled={processing === submission.id}
                      >
                        {processing === submission.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Archive className="mr-2 h-4 w-4" />
                            Lưu trữ
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Trang {meta.currentPage} / {meta.totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPagination({
                      ...pagination,
                      pageIndex: Math.max(0, pagination.pageIndex - 1),
                    })
                  }
                  disabled={pagination.pageIndex === 0}
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPagination({
                      ...pagination,
                      pageIndex: Math.min(
                        meta.totalPages - 1,
                        pagination.pageIndex + 1
                      ),
                    })
                  }
                  disabled={pagination.pageIndex >= meta.totalPages - 1}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

