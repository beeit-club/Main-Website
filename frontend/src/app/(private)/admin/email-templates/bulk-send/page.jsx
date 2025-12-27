// app/(private)/admin/email-templates/bulk-send/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserSelectionTable } from "@/components/admin/email-templates/UserSelectionTable";
import { AdditionalDataForm } from "@/components/admin/email-templates/AdditionalDataForm";
import { emailTemplateServices } from "@/services/admin/emailTemplateServices";
import { bulkEmailServices } from "@/services/admin/bulkEmailServices";
import { usersServices } from "@/services/admin/users";
import { toast } from "sonner";
import { Mail, Users, Filter, Send, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BulkEmailSendPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("select-users");
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [additionalData, setAdditionalData] = useState({});
  const [options, setOptions] = useState({
    jobName: "",
    batchSize: 20,
    delay: 1000,
  });

  // Filters cho tab "Filter Users"
  const [filters, setFilters] = useState({
    role_id: "all",
    search: "",
    is_member_only: false,
  });
  const [roles, setRoles] = useState([]);
  const [filteredUsersCount, setFilteredUsersCount] = useState(0);

  // Loading states
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load templates
  useEffect(() => {
    async function loadTemplates() {
      setIsLoadingTemplates(true);
      try {
        const res = await emailTemplateServices.getAllTemplates({
          page: 1,
          limit: 100,
          is_active: true,
        });
        setTemplates(res?.data?.data || []);
      } catch (error) {
        toast.error("Lỗi khi tải danh sách templates");
        console.error(error);
      } finally {
        setIsLoadingTemplates(false);
      }
    }
    loadTemplates();
  }, []);

  // Load roles
  useEffect(() => {
    async function loadRoles() {
      try {
        const res = await usersServices.getAllRoles();
        setRoles(res?.data?.data || []);
      } catch (error) {
        console.error("Error loading roles:", error);
      }
    }
    loadRoles();
  }, []);

  // Load template details khi chọn template
  useEffect(() => {
    if (selectedTemplateId) {
      async function loadTemplate() {
        try {
          const res = await emailTemplateServices.getTemplateById(
            selectedTemplateId
          );
          setSelectedTemplate(res?.data?.template || null);
        } catch (error) {
          console.error("Error loading template:", error);
        }
      }
      loadTemplate();
    } else {
      setSelectedTemplate(null);
    }
  }, [selectedTemplateId]);

  // Count filtered users
  useEffect(() => {
    if (activeTab === "filter-users" && filters) {
      async function countUsers() {
        try {
          // Tạm thời dùng getAllUser với filters để đếm
          const params = new URLSearchParams();
          if (filters.search) params.set("search", filters.search);
          if (filters.role_id && filters.role_id !== "all") params.set("roleId", filters.role_id);
          params.set("page", "1");
          params.set("limit", "1");

          const res = await usersServices.getAllUser(params);
          setFilteredUsersCount(res?.data?.pagination?.total || 0);
        } catch (error) {
          console.error("Error counting users:", error);
        }
      }
      countUsers();
    }
  }, [activeTab, filters]);

  // Handle submit - Gửi từ User IDs
  async function handleSubmitFromUsers() {
    if (!selectedTemplateId) {
      toast.error("Vui lòng chọn template");
      return;
    }

    if (selectedUserIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 user");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await bulkEmailServices.sendBulkEmailFromUsers(
        selectedTemplateId,
        {
          user_ids: selectedUserIds,
          additional_data: additionalData,
          options: {
            ...options,
            jobName: options.jobName || `Bulk Email - ${selectedTemplate?.name || "Template"}`,
          },
        }
      );

      if (res.status === "success") {
        toast.success(`Đã tạo batch job #${res.data.job_id}`);
        router.push(`/admin/email-templates/bulk-jobs?job_id=${res.data.job_id}`);
      } else {
        toast.error(res.message || "Gửi email thất bại");
      }
    } catch (error) {
      toast.error(error?.message || "Có lỗi xảy ra khi gửi email");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle submit - Gửi từ Filters
  async function handleSubmitFromFilters() {
    if (!selectedTemplateId) {
      toast.error("Vui lòng chọn template");
      return;
    }

    // Validate ít nhất 1 filter
    if ((!filters.role_id || filters.role_id === "all") && !filters.search && !filters.is_member_only) {
      toast.error("Vui lòng chọn ít nhất 1 điều kiện filter");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await bulkEmailServices.sendBulkEmailFromFilters(
        selectedTemplateId,
        {
          filters: {
            role_id: (filters.role_id && filters.role_id !== "all") ? filters.role_id : null,
            search: filters.search || null,
            is_member_only: filters.is_member_only || false,
          },
          additional_data: additionalData,
          options: {
            ...options,
            jobName: options.jobName || `Bulk Email - ${selectedTemplate?.name || "Template"}`,
          },
        }
      );

      if (res.status === "success") {
        toast.success(`Đã tạo batch job #${res.data.job_id}`);
        router.push(`/admin/email-templates/bulk-jobs?job_id=${res.data.job_id}`);
      } else {
        toast.error(res.message || "Gửi email thất bại");
      }
    } catch (error) {
      toast.error(error?.message || "Có lỗi xảy ra khi gửi email");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
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
              <h1 className="text-3xl font-bold">Gửi Email Hàng Loạt</h1>
              <p className="text-muted-foreground">
                Gửi email cho nhiều người dùng cùng lúc
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="select-users">
            <Users className="h-4 w-4 mr-2" />
            Chọn Users
          </TabsTrigger>
          <TabsTrigger value="filter-users">
            <Filter className="h-4 w-4 mr-2" />
            Filter Users
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Chọn Users */}
        <TabsContent value="select-users" className="space-y-6">
          {/* Step 1: Chọn Template */}
          <Card>
            <CardHeader>
              <CardTitle>Bước 1: Chọn Template</CardTitle>
              <CardDescription>
                Chọn email template để gửi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Template *</Label>
                <Select
                  value={selectedTemplateId}
                  onValueChange={setSelectedTemplateId}
                  disabled={isLoadingTemplates}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id.toString()}>
                        {template.name} {template.category && `(${template.category})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Chọn Users */}
          <Card>
            <CardHeader>
              <CardTitle>Bước 2: Chọn Người Nhận</CardTitle>
              <CardDescription>
                Chọn users từ danh sách (có thể chọn nhiều)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserSelectionTable
                selectedUserIds={selectedUserIds}
                onSelectionChange={setSelectedUserIds}
              />
            </CardContent>
          </Card>

          {/* Step 3: Additional Data */}
          <AdditionalDataForm
            value={additionalData}
            onChange={setAdditionalData}
            templateVariables={selectedTemplate?.variables || []}
          />

          {/* Step 4: Options */}
          <Card>
            <CardHeader>
              <CardTitle>Bước 4: Tùy Chọn</CardTitle>
              <CardDescription>
                Cấu hình cho batch job
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Tên Job</Label>
                <Input
                  placeholder="VD: Event Notification"
                  value={options.jobName}
                  onChange={(e) =>
                    setOptions({ ...options, jobName: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Tên để nhận diện batch job này
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Batch Size</Label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={options.batchSize}
                    onChange={(e) =>
                      setOptions({
                        ...options,
                        batchSize: parseInt(e.target.value) || 20,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Số email gửi mỗi batch (1-100)
                  </p>
                </div>
                <div>
                  <Label>Delay (ms)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="60000"
                    value={options.delay}
                    onChange={(e) =>
                      setOptions({
                        ...options,
                        delay: parseInt(e.target.value) || 1000,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Thời gian delay giữa các batch (0-60000ms)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => router.back()}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmitFromUsers}
              disabled={isSubmitting || !selectedTemplateId || selectedUserIds.length === 0}
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Đang gửi..." : "Gửi Email"}
            </Button>
          </div>
        </TabsContent>

        {/* Tab 2: Filter Users */}
        <TabsContent value="filter-users" className="space-y-6">
          {/* Step 1: Chọn Template */}
          <Card>
            <CardHeader>
              <CardTitle>Bước 1: Chọn Template</CardTitle>
              <CardDescription>
                Chọn email template để gửi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Template *</Label>
                <Select
                  value={selectedTemplateId}
                  onValueChange={setSelectedTemplateId}
                  disabled={isLoadingTemplates}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id.toString()}>
                        {template.name} {template.category && `(${template.category})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Bước 2: Chọn Điều Kiện Filter</CardTitle>
              <CardDescription>
                Lọc users theo các điều kiện (chọn ít nhất 1)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Vai trò</Label>
                <Select
                  value={filters.role_id}
                  onValueChange={(value) =>
                    setFilters({ ...filters, role_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tìm kiếm</Label>
                <Input
                  placeholder="Tên, email, hoặc MSSV..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="member-only"
                  checked={filters.is_member_only}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      is_member_only: e.target.checked,
                    })
                  }
                  className="h-4 w-4"
                />
                <Label htmlFor="member-only" className="cursor-pointer">
                  Chỉ lấy thành viên (có member_profiles)
                </Label>
              </div>

              {filteredUsersCount > 0 && (
                <div className="rounded-md bg-muted p-3">
                  <p className="text-sm">
                    Tìm thấy <span className="font-semibold">{filteredUsersCount}</span> users
                    phù hợp với điều kiện
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 3: Additional Data */}
          <AdditionalDataForm
            value={additionalData}
            onChange={setAdditionalData}
            templateVariables={selectedTemplate?.variables || []}
          />

          {/* Step 4: Options */}
          <Card>
            <CardHeader>
              <CardTitle>Bước 4: Tùy Chọn</CardTitle>
              <CardDescription>Cấu hình cho batch job</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Tên Job</Label>
                <Input
                  placeholder="VD: Member Notification"
                  value={options.jobName}
                  onChange={(e) =>
                    setOptions({ ...options, jobName: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Batch Size</Label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={options.batchSize}
                    onChange={(e) =>
                      setOptions({
                        ...options,
                        batchSize: parseInt(e.target.value) || 20,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Delay (ms)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="60000"
                    value={options.delay}
                    onChange={(e) =>
                      setOptions({
                        ...options,
                        delay: parseInt(e.target.value) || 1000,
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => router.back()}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmitFromFilters}
              disabled={
                isSubmitting ||
                !selectedTemplateId ||
                ((!filters.role_id || filters.role_id === "all") && !filters.search && !filters.is_member_only)
              }
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Đang gửi..." : "Gửi Email"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

