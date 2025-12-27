// components/admin/email-templates/BatchJobDetailsDialog.jsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { bulkEmailServices } from "@/services/admin/bulkEmailServices";
import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  X,
  Eye,
} from "lucide-react";
import { formatDate } from "@/lib/datetime";

/**
 * Component: Dialog hiển thị chi tiết batch job
 * 
 * Props:
 * - open: boolean
 * - onOpenChange: (open: boolean) => void
 * - jobId: number - ID của batch job
 */
export function BatchJobDetailsDialog({ open, onOpenChange, jobId }) {
  const [job, setJob] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [pagination, setPagination] = useState({ page: 1, limit: 20 });
  const [meta, setMeta] = useState({ totalPages: 0, total: 0 });

  // Load job details
  useEffect(() => {
    if (open && jobId) {
      loadJobDetails();
    }
  }, [open, jobId]);

  // Load recipients
  useEffect(() => {
    if (open && jobId) {
      loadRecipients();
    }
  }, [open, jobId, activeTab, pagination.page, pagination.limit]);

  // Auto refresh nếu job đang processing
  useEffect(() => {
    if (!open || !job) return;

    if (job.status === "processing" || job.status === "pending") {
      const interval = setInterval(() => {
        loadJobDetails();
        loadRecipients();
      }, 3000); // Refresh mỗi 3 giây

      return () => clearInterval(interval);
    }
  }, [open, job?.status]);

  async function loadJobDetails() {
    try {
      const res = await bulkEmailServices.getBatchJobById(jobId);
      setJob(res?.data?.job || null);
    } catch (error) {
      toast.error("Lỗi khi tải thông tin job");
      console.error(error);
    }
  }

  async function loadRecipients() {
    setIsLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (activeTab !== "all") {
        params.status = activeTab;
      }

      const res = await bulkEmailServices.getBatchJobRecipients(jobId, params);
      setRecipients(res?.data?.data || []);
      setMeta({
        totalPages: res?.data?.pagination?.totalPages || 0,
        total: res?.data?.pagination?.total || 0,
      });
    } catch (error) {
      toast.error("Lỗi khi tải danh sách recipients");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRetryFailed() {
    try {
      await bulkEmailServices.retryFailedEmails(jobId);
      toast.success("Đã bắt đầu retry failed emails");
      loadJobDetails();
      loadRecipients();
    } catch (error) {
      toast.error("Lỗi khi retry failed emails");
      console.error(error);
    }
  }

  async function handleCancel() {
    try {
      await bulkEmailServices.cancelBatchJob(jobId);
      toast.success("Đã hủy batch job");
      loadJobDetails();
    } catch (error) {
      toast.error("Lỗi khi hủy batch job");
      console.error(error);
    }
  }

  if (!job) {
    return null;
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-600">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-blue-600">
            <Clock className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-600">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline">
            <X className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getRecipientStatusBadge = (status) => {
    switch (status) {
      case "sent":
        return (
          <Badge className="bg-green-600">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Sent
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-600">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi Tiết Batch Job #{job.id}</DialogTitle>
          <DialogDescription>{job.job_name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Trạng thái</p>
              <div className="mt-1">{getStatusBadge(job.status)}</div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Template</p>
              <p className="mt-1 font-medium">{job.template_name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng số recipients</p>
              <p className="mt-1 font-medium">{job.total_recipients}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tiến độ</p>
              <div className="mt-1">
                <Progress value={job.progress_percent || 0} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {job.progress_percent?.toFixed(1) || 0}%
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Đã gửi</p>
              <p className="mt-1 font-medium text-green-600">
                {job.sent_count || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Thất bại</p>
              <p className="mt-1 font-medium text-red-600">
                {job.failed_count || 0}
              </p>
            </div>
            {job.started_at && (
              <div>
                <p className="text-sm text-muted-foreground">Bắt đầu</p>
                <p className="mt-1 text-sm">
                  {formatDate(job.started_at, true)}
                </p>
              </div>
            )}
            {job.completed_at && (
              <div>
                <p className="text-sm text-muted-foreground">Hoàn thành</p>
                <p className="mt-1 text-sm">
                  {formatDate(job.completed_at, true)}
                </p>
              </div>
            )}
          </div>

          {/* Recipients Table */}
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">
                  Tất cả ({job.total_recipients || 0})
                </TabsTrigger>
                <TabsTrigger value="sent">
                  Đã gửi ({job.sent_count || 0})
                </TabsTrigger>
                <TabsTrigger value="failed">
                  Thất bại ({job.failed_count || 0})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({job.pending_count || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Sent At</TableHead>
                        <TableHead>Error</TableHead>
                        <TableHead>Retry</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            Đang tải...
                          </TableCell>
                        </TableRow>
                      ) : recipients.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            Không có recipients nào
                          </TableCell>
                        </TableRow>
                      ) : (
                        recipients.map((recipient) => (
                          <TableRow key={recipient.id}>
                            <TableCell className="font-medium">
                              {recipient.recipient_email}
                            </TableCell>
                            <TableCell>
                              {getRecipientStatusBadge(recipient.status)}
                            </TableCell>
                            <TableCell>
                              {recipient.sent_at
                                ? formatDate(recipient.sent_at, true)
                                : "-"}
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {recipient.error_message || "-"}
                            </TableCell>
                            <TableCell>
                              {recipient.status === "failed" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleRetryFailed}
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {meta.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Trang {pagination.page} / {meta.totalPages}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPagination((prev) => ({
                            ...prev,
                            page: Math.max(1, prev.page - 1),
                          }))
                        }
                        disabled={pagination.page === 1}
                      >
                        Trước
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPagination((prev) => ({
                            ...prev,
                            page: Math.min(meta.totalPages, prev.page + 1),
                          }))
                        }
                        disabled={pagination.page === meta.totalPages}
                      >
                        Sau
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <DialogFooter>
          {job.status === "processing" && (
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Hủy Job
            </Button>
          )}
          {job.status === "completed" && job.failed_count > 0 && (
            <Button variant="outline" onClick={handleRetryFailed}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Failed
            </Button>
          )}
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

