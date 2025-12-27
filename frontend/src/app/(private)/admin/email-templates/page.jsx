"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Mail, Eye, Send, Trash2, Edit, X, Sparkles } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PaginationControls } from "@/components/common/Pagination";
import { emailTemplateServices } from "@/services/admin/emailTemplateServices";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { EmailVariableList } from "@/components/admin/email-templates/EmailVariableList";
import { EmailEditor } from "@/components/admin/email-templates/EmailEditor";

// Validation Schema
const emailTemplateSchema = yup.object({
  name: yup.string().required("Tên template là bắt buộc").max(255),
  slug: yup.string().max(255).optional(),
  subject: yup.string().required("Subject là bắt buộc").max(500),
  html_content: yup.string().required("Nội dung HTML là bắt buộc").min(10),
  category: yup
    .string()
    .oneOf(
      [
        "authentication",
        "application",
        "event",
        "document",
        "system",
        "custom",
      ],
      "Category không hợp lệ"
    )
    .optional(),
  description: yup.string().max(1000).optional(),
  is_active: yup.boolean().optional(),
});

export default function EmailTemplatesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState({ totalPages: 0, total: 0 });
  const [pagination, setPagination] = useState({
    pageIndex: searchParams.get("page")
      ? parseInt(searchParams.get("page")) - 1
      : 0,
    pageSize: searchParams.get("limit")
      ? parseInt(searchParams.get("limit"))
      : 10,
  });
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [categories, setCategories] = useState([]);

  // Dialog states
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [openTestSend, setOpenTestSend] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewSubject, setPreviewSubject] = useState("");

  // Forms
  const formAdd = useForm({
    resolver: yupResolver(emailTemplateSchema),
    defaultValues: {
      name: "",
      slug: "",
      subject: "",
      html_content: "",
      category: "custom",
      description: "",
      is_active: true,
    },
  });

  const formEdit = useForm({
    resolver: yupResolver(emailTemplateSchema),
    defaultValues: {},
  });

  const formTestSend = useForm({
    defaultValues: {
      recipient_email: "",
      variables: {},
    },
  });

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await emailTemplateServices.getCategories();
        setCategories(res.data?.categories || []);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    }
    loadCategories();
  }, []);

  // Fetch templates
  useEffect(() => {
    async function loadTemplates() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: (pagination.pageIndex + 1).toString(),
          limit: pagination.pageSize.toString(),
        });
        if (search) params.set("q", search);

        const res = await emailTemplateServices.getAllTemplates(params);
        setTemplates(res.data?.data || []);
        setMeta({
          totalPages: res.data?.pagination?.totalPages || 0,
          total: res.data?.pagination?.total || 0,
        });
      } catch (error) {
        toast.error("Lỗi khi tải danh sách templates");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    loadTemplates();
  }, [pagination.pageIndex, pagination.pageSize, search]);

  // Update URL when search changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", (pagination.pageIndex + 1).toString());
    params.set("limit", pagination.pageSize.toString());
    if (search) params.set("q", search);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pagination, search, pathname, router]);

  // Handle Create
  async function handleCreate(data) {
    try {
      const res = await emailTemplateServices.createTemplate(data);
      if (res.status === "success") {
        toast.success("Tạo template thành công!");
        setOpenAdd(false);
        formAdd.reset();
        // Reload data
        const params = new URLSearchParams({
          page: (pagination.pageIndex + 1).toString(),
          limit: pagination.pageSize.toString(),
        });
        if (search) params.set("q", search);
        const res = await emailTemplateServices.getAllTemplates(params);
        setTemplates(res.data?.data || []);
        setMeta({
          totalPages: res.data?.pagination?.totalPages || 0,
          total: res.data?.pagination?.total || 0,
        });
      } else {
        toast.error(res.message || "Tạo template thất bại");
      }
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra khi tạo template");
    }
  }

  // Handle Edit
  function handleOpenEdit(template) {
    setSelectedTemplate(template);
    formEdit.reset({
      name: template.name,
      slug: template.slug,
      subject: template.subject,
      html_content: template.html_content,
      category: template.category || "custom",
      description: template.description || "",
      is_active: template.is_active,
    });
    setOpenEdit(true);
  }

  async function handleUpdate(data) {
    try {
      const res = await emailTemplateServices.updateTemplate(
        selectedTemplate.id,
        data
      );
      if (res.status === "success") {
        toast.success("Cập nhật template thành công!");
        setOpenEdit(false);
        setSelectedTemplate(null);
        // Reload data
        const params = new URLSearchParams({
          page: (pagination.pageIndex + 1).toString(),
          limit: pagination.pageSize.toString(),
        });
        if (search) params.set("q", search);
        const res = await emailTemplateServices.getAllTemplates(params);
        setTemplates(res.data?.data || []);
      } else {
        toast.error(res.message || "Cập nhật template thất bại");
      }
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật template");
    }
  }

  // Handle Preview
  async function handlePreview(template) {
    setSelectedTemplate(template);
    try {
      const res = await emailTemplateServices.previewTemplate(template.id);
      setPreviewHtml(res.data?.preview?.html || "");
      setPreviewSubject(res.data?.preview?.subject || "");
      setOpenPreview(true);
    } catch (error) {
      toast.error("Lỗi khi preview template");
      console.error(error);
    }
  }

  // Handle Test Send
  function handleOpenTestSend(template) {
    setSelectedTemplate(template);
    formTestSend.reset({
      recipient_email: "",
      variables: {},
    });
    setOpenTestSend(true);
  }

  async function handleTestSend(data) {
    try {
      const res = await emailTemplateServices.testSendTemplate(
        selectedTemplate.id,
        data.recipient_email,
        data.variables || {}
      );
      if (res.status === "success") {
        toast.success("Email đã được gửi thành công!");
        setOpenTestSend(false);
        formTestSend.reset();
      } else {
        toast.error(res.message || "Gửi email thất bại");
      }
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra khi gửi email");
    }
  }

  // Handle Delete
  function handleOpenDelete(template) {
    setSelectedTemplate(template);
    setOpenDelete(true);
  }

  async function handleDelete() {
    try {
      const res = await emailTemplateServices.deleteTemplate(
        selectedTemplate.id
      );
      if (res.status === "success") {
        toast.success("Xóa template thành công!");
        setOpenDelete(false);
        setSelectedTemplate(null);
        // Reload data
        const params = new URLSearchParams({
          page: (pagination.pageIndex + 1).toString(),
          limit: pagination.pageSize.toString(),
        });
        if (search) params.set("q", search);
        const res = await emailTemplateServices.getAllTemplates(params);
        setTemplates(res.data?.data || []);
        setMeta({
          totalPages: res.data?.pagination?.totalPages || 0,
          total: res.data?.pagination?.total || 0,
        });
      } else {
        toast.error(res.message || "Xóa template thất bại");
      }
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra khi xóa template");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Templates</h1>
          <p className="text-muted-foreground">Quản lý templates email động</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              router.push("/admin/email-templates/custom-variables")
            }
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Custom Variables
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/admin/email-templates/bulk-send")}
          >
            <Mail className="mr-2 h-4 w-4" />
            Gửi Bulk Email
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/admin/email-templates/bulk-jobs")}
          >
            Batch Jobs
          </Button>
          <Button onClick={() => setOpenAdd(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo Template
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Tìm kiếm template..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
          }}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tên</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : templates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Không có template nào
                </TableCell>
              </TableRow>
            ) : (
              templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>{template.id}</TableCell>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {template.slug}
                  </TableCell>
                  <TableCell>
                    <span className="rounded-full bg-secondary px-2 py-1 text-xs">
                      {template.category || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {template.is_active ? (
                      <span className="text-green-600">Active</span>
                    ) : (
                      <span className="text-gray-400">Inactive</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePreview(template)}
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenTestSend(template)}
                        title="Test Send"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(template)}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDelete(template)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

      {/* === DIALOG CREATE === */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="sm:max-w-[1400px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Tạo Template Mới</DialogTitle>
            <DialogDescription>
              Tạo email template mới với variables động. Kéo thả biến từ danh
              sách bên phải vào nội dung.
            </DialogDescription>
          </DialogHeader>
          <Form {...formAdd}>
            <form
              onSubmit={formAdd.handleSubmit(handleCreate)}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div className="flex-1 grid grid-cols-3 gap-4 overflow-hidden">
                {/* Left Column: Form Fields */}
                <div className="col-span-2 space-y-4 overflow-y-auto pr-2">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={formAdd.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên Template *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="VD: Thông báo sự kiện"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formAdd.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug (Tự động tạo nếu để trống)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="event-notification"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={formAdd.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="authentication">
                                Authentication
                              </SelectItem>
                              <SelectItem value="application">
                                Application
                              </SelectItem>
                              <SelectItem value="event">Event</SelectItem>
                              <SelectItem value="document">Document</SelectItem>
                              <SelectItem value="system">System</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formAdd.control}
                      name="is_active"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(value === "true")
                            }
                            value={field.value ? "true" : "false"}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="true">Active</SelectItem>
                              <SelectItem value="false">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={formAdd.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={2}
                            placeholder="Mô tả template..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formAdd.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="VD: Thông báo: {{event_title}}"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formAdd.control}
                    name="html_content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nội dung HTML *</FormLabel>
                        <FormControl>
                          <EmailEditor
                            value={field.value}
                            onChange={field.onChange}
                            subject={formAdd.watch("subject")}
                            onSubjectChange={(value) =>
                              formAdd.setValue("subject", value)
                            }
                            label=""
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Right Column: Variable List */}
                <div className="col-span-1 border-l pl-4">
                  <EmailVariableList
                    templateId={null}
                    onInsertVariable={(variable) => {
                      const currentContent =
                        formAdd.getValues("html_content") || "";
                      formAdd.setValue(
                        "html_content",
                        currentContent + variable
                      );
                    }}
                  />
                </div>
              </div>

              <DialogFooter className="mt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpenAdd(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={formAdd.formState.isSubmitting}>
                  {formAdd.formState.isSubmitting ? "Đang tạo..." : "Tạo"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* === DIALOG EDIT === */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-[1400px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Template</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin template. Kéo thả biến từ danh sách bên phải
              vào nội dung.
            </DialogDescription>
          </DialogHeader>
          <Form {...formEdit}>
            <form
              onSubmit={formEdit.handleSubmit(handleUpdate)}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div className="flex-1 grid grid-cols-3 gap-4 overflow-hidden">
                {/* Left Column: Form Fields */}
                <div className="col-span-2 space-y-4 overflow-y-auto pr-2">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={formEdit.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên Template *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formEdit.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={formEdit.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="authentication">
                                Authentication
                              </SelectItem>
                              <SelectItem value="application">
                                Application
                              </SelectItem>
                              <SelectItem value="event">Event</SelectItem>
                              <SelectItem value="document">Document</SelectItem>
                              <SelectItem value="system">System</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formEdit.control}
                      name="is_active"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(value === "true")
                            }
                            value={field.value ? "true" : "false"}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="true">Active</SelectItem>
                              <SelectItem value="false">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={formEdit.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả</FormLabel>
                        <FormControl>
                          <Textarea rows={2} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formEdit.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formEdit.control}
                    name="html_content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nội dung HTML *</FormLabel>
                        <FormControl>
                          <EmailEditor
                            value={field.value}
                            onChange={field.onChange}
                            subject={formEdit.watch("subject")}
                            onSubjectChange={(value) =>
                              formEdit.setValue("subject", value)
                            }
                            label=""
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Right Column: Variable List */}
                <div className="col-span-1 border-l pl-4">
                  <EmailVariableList
                    templateId={selectedTemplate?.id || null}
                    onInsertVariable={(variable) => {
                      const currentContent =
                        formEdit.getValues("html_content") || "";
                      formEdit.setValue(
                        "html_content",
                        currentContent + variable
                      );
                    }}
                  />
                </div>
              </div>

              <DialogFooter className="mt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpenEdit(false)}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={formEdit.formState.isSubmitting}
                >
                  {formEdit.formState.isSubmitting
                    ? "Đang cập nhật..."
                    : "Cập nhật"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* === DIALOG PREVIEW === */}
      <Dialog open={openPreview} onOpenChange={setOpenPreview}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview Template</DialogTitle>
            <DialogDescription>{selectedTemplate?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Subject:</Label>
              <p className="text-sm font-medium">{previewSubject}</p>
            </div>
            <div>
              <Label>Nội dung:</Label>
              <div
                className="border rounded-md p-4 bg-white"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenPreview(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* === DIALOG TEST SEND === */}
      <Dialog open={openTestSend} onOpenChange={setOpenTestSend}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Test Gửi Email</DialogTitle>
            <DialogDescription>
              Gửi email test với template: {selectedTemplate?.name}
            </DialogDescription>
          </DialogHeader>
          <Form {...formTestSend}>
            <form
              onSubmit={formTestSend.handleSubmit(handleTestSend)}
              className="space-y-4"
            >
              <FormField
                control={formTestSend.control}
                name="recipient_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email người nhận *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="test@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Label className="mb-2 block">Variables (Optional)</Label>
                <Textarea
                  rows={5}
                  placeholder='{"fullname": "Nguyễn Văn A", "event_title": "Workshop"}'
                  className="font-mono text-sm"
                  onChange={(e) => {
                    try {
                      const vars = JSON.parse(e.target.value || "{}");
                      formTestSend.setValue("variables", vars);
                    } catch {
                      // Invalid JSON, ignore
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Nhập JSON object cho variables
                </p>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpenTestSend(false)}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={formTestSend.formState.isSubmitting}
                >
                  {formTestSend.formState.isSubmitting
                    ? "Đang gửi..."
                    : "Gửi Email"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* === DIALOG DELETE === */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa template "{selectedTemplate?.name}"?
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenDelete(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
