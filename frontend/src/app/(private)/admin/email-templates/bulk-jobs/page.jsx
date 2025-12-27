// app/(private)/admin/email-templates/bulk-jobs/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BatchJobDetailsDialog } from "@/components/admin/email-templates/BatchJobDetailsDialog";
import { bulkEmailServices } from "@/services/admin/bulkEmailServices";
import { emailTemplateServices } from "@/services/admin/emailTemplateServices";
import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  RefreshCw,
  X,
  ArrowLeft,
} from "lucide-react";
import { PaginationControls } from "@/components/common/Pagination";
import Link from "next/link";

export default function BulkEmailJobsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState({ totalPages: 0, total: 0 });
  
  // Initialize state từ searchParams một cách an toàn
  const getPageFromParams = () => {
    try {
      const page = searchParams?.get("page");
      return page ? parseInt(page) - 1 : 0;
    } catch {
      return 0;
    }
  };

  const getLimitFromParams = () => {
    try {
      const limit = searchParams?.get("limit");
      return limit ? parseInt(limit) : 10;
    } catch {
      return 10;
    }
  };

  const [pagination, setPagination] = useState({
    pageIndex: getPageFromParams(),
    pageSize: getLimitFromParams(),
  });
  
  const [search, setSearch] = useState(() => {
    try {
      return searchParams?.get("q") || "";
    } catch {
      return "";
    }
  });
  
  const [statusFilter, setStatusFilter] = useState(() => {
    try {
      return searchParams?.get("status") || "all";
    } catch {
      return "all";
    }
  });
  
  const [templateFilter, setTemplateFilter] = useState(() => {
    try {
      return searchParams?.get("template_id") || "all";
    } catch {
      return "all";
    }
  });
  
  const [templates, setTemplates] = useState([]);

  // Dialog state
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);

  // Auto-open dialog nếu có job_id trong URL
  useEffect(() => {
    try {
      const jobId = searchParams?.get("job_id");
      if (jobId) {
        setSelectedJobId(parseInt(jobId));
        setOpenDetails(true);
      }
    } catch (error) {
      console.error("Error reading job_id from URL:", error);
    }
  }, [searchParams]);

  // Load templates for filter
  useEffect(() => {
    async function loadTemplates() {
      try {
        const res = await emailTemplateServices.getAllTemplates({
          page: 1,
          limit: 100,
        });
        setTemplates(res?.data?.data || []);
      } catch (error) {
        console.error("Error loading templates:", error);
      }
    }
    loadTemplates();
  }, []);

  // Load batch jobs
  useEffect(() => {
    async function loadJobs() {
      setIsLoading(true);
      try {
        const params = {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
        };
        if (search) params.q = search;
        if (statusFilter && statusFilter !== "all") params.status = statusFilter;
        if (templateFilter && templateFilter !== "all") {
          const templateId = parseInt(templateFilter, 10);
          if (!isNaN(templateId)) {
            params.template_id = templateId;
          }
        }

        const res = await bulkEmailServices.getAllBatchJobs(params);
        setJobs(res?.data?.data || []);
        setMeta({
          totalPages: res?.data?.pagination?.totalPages || 0,
          total: res?.data?.pagination?.total || 0,
        });
      } catch (error) {
        const errorMessage = error?.message || error?.response?.data?.message || "Lỗi khi tải danh sách batch jobs";
        toast.error(errorMessage);
        console.error("Error loading batch jobs:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadJobs();
  }, [pagination.pageIndex, pagination.pageSize, search, statusFilter, templateFilter]);

  // Update URL
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", (pagination.pageIndex + 1).toString());
    params.set("limit", pagination.pageSize.toString());
    if (search) params.set("q", search);
    if (statusFilter && statusFilter !== "all") params.set("status", statusFilter);
    if (templateFilter && templateFilter !== "all") params.set("template_id", templateFilter);
    router.replace(`/admin/email-templates/bulk-jobs?${params.toString()}`, {
      scroll: false,
    });
  }, [pagination, search, statusFilter, templateFilter, router]);

  // Auto refresh nếu có job đang processing
  useEffect(() => {
    const hasProcessing = jobs.some(
      (job) => job.status === "processing" || job.status === "pending"
    );
      if (hasProcessing) {
      const interval = setInterval(() => {
        // Reload jobs
        const params = {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
        };
        if (search) params.q = search;
        if (statusFilter && statusFilter !== "all") params.status = statusFilter;
        if (templateFilter && templateFilter !== "all") {
          const templateId = parseInt(templateFilter, 10);
          if (!isNaN(templateId)) {
            params.template_id = templateId;
          }
        }

        bulkEmailServices
          .getAllBatchJobs(params)
          .then((res) => {
            setJobs(res?.data?.data || []);
            setMeta({
              totalPages: res?.data?.pagination?.totalPages || 0,
              total: res?.data?.pagination?.total || 0,
            });
          })
          .catch((error) => {
            console.error("Error refreshing jobs:", error);
          });
      }, 5000); // Refresh mỗi 5 giây

      return () => clearInterval(interval);
    }
  }, [jobs, pagination, search, statusFilter, templateFilter]);

  function handleViewJob(jobId) {
    setSelectedJobId(jobId);
    setOpenDetails(true);
  }

  function getStatusBadge(status) {
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
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/email-templates">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Quản Lý Batch Jobs</h1>
              <p className="text-muted-foreground">
                Theo dõi và quản lý các đợt gửi email hàng loạt
              </p>
            </div>
          </div>
        </div>
        <Link href="/admin/email-templates/bulk-send">
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Gửi Email Mới
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Tìm kiếm job..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
          }}
          className="max-w-sm"
        />
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tất cả status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={templateFilter}
          onValueChange={(value) => {
            setTemplateFilter(value);
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Tất cả templates" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {templates.map((template) => (
              <SelectItem key={template.id} value={template.id.toString()}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tên Job</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tiến độ</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Bắt đầu</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Không có batch job nào
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.id}</TableCell>
                  <TableCell>{job.job_name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {job.template_name || "N/A"}
                  </TableCell>
                  <TableCell>{getStatusBadge(job.status)}</TableCell>
                  <TableCell>
                    <div className="w-32">
                      <Progress value={job.progress_percent || 0} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {job.progress_percent?.toFixed(1) || 0}%
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="text-green-600">
                        ✅ {job.sent_count || 0}
                      </div>
                      <div className="text-red-600">
                        ❌ {job.failed_count || 0}
                      </div>
                      <div className="text-muted-foreground">
                        / {job.total_recipients || 0}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {job.started_at
                      ? new Date(job.started_at).toLocaleString("vi-VN")
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewJob(job.id)}
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <PaginationControls
        pagination={pagination}
        meta={meta}
        setPagination={setPagination}
      />

      {/* Details Dialog */}
      {selectedJobId && (
        <BatchJobDetailsDialog
          open={openDetails}
          onOpenChange={setOpenDetails}
          jobId={selectedJobId}
        />
      )}
    </div>
  );
}

