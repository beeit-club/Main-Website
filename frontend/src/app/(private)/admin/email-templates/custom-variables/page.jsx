// app/(private)/admin/email-templates/custom-variables/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Sparkles,
  Code,
  CheckCircle2,
  XCircle,
  Copy,
} from "lucide-react";
import { HelperFunctionsReference } from "@/components/admin/email-templates/HelperFunctionsReference";
import { emailCustomVariableServices } from "@/services/admin/emailCustomVariableServices";
import { emailTemplateServices } from "@/services/admin/emailTemplateServices";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation Schema
const customVariableSchema = yup.object({
  name: yup
    .string()
    .required("Tên biến là bắt buộc")
    .matches(
      /^[a-z][a-z0-9_]*$/,
      "Tên biến chỉ được chứa chữ thường, số và dấu gạch dưới, bắt đầu bằng chữ"
    ),
  description: yup.string().optional(),
  type: yup
    .string()
    .oneOf(["expression", "helper", "function"])
    .default("expression"),
  expression: yup.string().when("type", {
    is: "expression",
    then: (schema) => schema.required("Expression là bắt buộc"),
  }),
  return_type: yup
    .string()
    .oneOf(["string", "number", "boolean", "date", "object"])
    .default("string"),
  template_id: yup.number().nullable().optional(),
  is_active: yup.boolean().default(true),
});

export default function CustomVariablesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [variables, setVariables] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState(null);
  const [previewResult, setPreviewResult] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [filterType, setFilterType] = useState(
    searchParams.get("type") || "all"
  );
  const [search, setSearch] = useState(searchParams.get("q") || "");

  const form = useForm({
    resolver: yupResolver(customVariableSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "expression",
      expression: "",
      return_type: "string",
      template_id: null,
      is_active: true,
    },
  });

  // Load templates
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

  // Load variables
  useEffect(() => {
    loadVariables();
  }, [filterType, search]);

  async function loadVariables() {
    setIsLoading(true);
    try {
      const params = {};
      if (filterType === "global") {
        // Gửi string "null" để backend hiểu là lấy global variables
        params.template_id = "null";
      } else if (filterType !== "all") {
        params.template_id = parseInt(filterType);
      }
      // Không gửi template_id nếu filterType === "all" (undefined)
      if (search) params.q = search;

      const res = await emailCustomVariableServices.getAllVariables(params);
      setVariables(res?.data?.data || []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách biến");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle Create/Edit
  function handleOpenDialog(variable = null) {
    if (variable) {
      setSelectedVariable(variable);
      form.reset({
        name: variable.name,
        description: variable.description || "",
        type: variable.type || "expression",
        expression: variable.expression || "",
        return_type: variable.return_type || "string",
        template_id: variable.template_id || null,
        is_active: variable.is_active !== undefined ? variable.is_active : true,
      });
    } else {
      setSelectedVariable(null);
      form.reset({
        name: "",
        description: "",
        type: "expression",
        expression: "",
        return_type: "string",
        template_id: null,
        is_active: true,
      });
    }
    setOpenDialog(true);
    setValidationResult(null);
    setPreviewResult(null);
  }

  async function handleSubmit(data) {
    try {
      if (selectedVariable) {
        // Update
        const res = await emailCustomVariableServices.updateVariable(
          selectedVariable.id,
          data
        );
        if (res.status === "success") {
          toast.success("Cập nhật biến thành công!");
          setOpenDialog(false);
          loadVariables();
        }
      } else {
        // Create
        const res = await emailCustomVariableServices.createVariable(data);
        if (res.status === "success") {
          toast.success("Tạo biến thành công!");
          setOpenDialog(false);
          loadVariables();
        }
      }
    } catch (error) {
      toast.error(error?.message || "Có lỗi xảy ra");
    }
  }

  // Validate Expression
  async function handleValidateExpression() {
    const expression = form.watch("expression");
    if (!expression) {
      toast.error("Vui lòng nhập expression");
      return;
    }

    try {
      // Sample variables for testing (dùng giá trị cố định để tránh hydration issues)
      const now = new Date();
      const sampleVars = {
        fullname: "Nguyễn Văn A",
        email: "user@example.com",
        phone: "0123456789",
        years_as_member: 2,
        hours: now.getHours(),
      };

      const res = await emailCustomVariableServices.validateExpression(
        expression,
        sampleVars
      );
      setValidationResult(res.data);

      if (res.data.valid) {
        toast.success("Expression hợp lệ!");
      } else {
        toast.error(`Expression không hợp lệ: ${res.data.error}`);
      }
    } catch (error) {
      toast.error(error?.message || "Lỗi khi validate");
    }
  }

  // Preview Expression
  async function handlePreview(variable = null) {
    const expression = variable?.expression || form.watch("expression");
    if (!expression) {
      toast.error("Vui lòng nhập expression");
      return;
    }

    try {
      // Sample variables for testing (dùng giá trị cố định để tránh hydration issues)
      const now = new Date();
      const sampleVars = {
        fullname: "Nguyễn Văn A",
        email: "user@example.com",
        phone: "0123456789",
        years_as_member: 2,
        hours: now.getHours(),
      };

      const res = await emailCustomVariableServices.previewVariable(
        expression,
        sampleVars
      );
      setPreviewResult(res.data);
      if (variable) {
        setOpenPreview(true);
      }
    } catch (error) {
      toast.error(error?.message || "Lỗi khi preview");
    }
  }

  // Delete
  function handleOpenDelete(variable) {
    setSelectedVariable(variable);
    setOpenDelete(true);
  }

  async function handleDelete() {
    try {
      const res = await emailCustomVariableServices.deleteVariable(
        selectedVariable.id
      );
      if (res.status === "success") {
        toast.success("Xóa biến thành công!");
        setOpenDelete(false);
        setSelectedVariable(null);
        loadVariables();
      }
    } catch (error) {
      toast.error(error?.message || "Có lỗi xảy ra");
    }
  }

  // Copy variable
  function handleCopy(variable) {
    handleOpenDialog(variable);
    form.setValue("name", `${variable.name}_copy`);
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
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Sparkles className="h-8 w-8 text-primary" />
                Custom Variables
              </h1>
              <p className="text-muted-foreground">
                Quản lý biến tùy biến cho email templates
              </p>
            </div>
          </div>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo Biến Mới
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Lọc theo loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="global">Global (Dùng chung)</SelectItem>
            {templates.map((template) => (
              <SelectItem key={template.id} value={template.id.toString()}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Tìm kiếm theo tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Expression</TableHead>
                <TableHead>Dependencies</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : variables.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Không có biến nào
                  </TableCell>
                </TableRow>
              ) : (
                variables.map((variable) => (
                  <TableRow key={variable.id}>
                    <TableCell className="font-medium">
                      <code className="text-sm">{`{{${variable.name}}}`}</code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{variable.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md truncate font-mono text-xs">
                        {variable.expression || "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {variable.dependencies &&
                      variable.dependencies.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {variable.dependencies.map((dep, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-xs"
                            >
                              {dep}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {variable.template_name ? (
                        <Badge variant="secondary">
                          {variable.template_name}
                        </Badge>
                      ) : (
                        <Badge>Global</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {variable.is_active ? (
                        <Badge className="bg-green-600">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setPreviewResult({
                              result: "Loading...",
                              type: "string",
                            });
                            handlePreview(variable);
                          }}
                          title="Preview"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopy(variable)}
                          title="Copy"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(variable)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDelete(variable)}
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
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedVariable ? "Chỉnh Sửa Biến" : "Tạo Biến Mới"}
            </DialogTitle>
            <DialogDescription>
              Tạo biến tùy biến với expression engine
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <Tabs defaultValue="basic" className="w-full">
                <TabsList>
                  <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
                  <TabsTrigger value="expression">Expression</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên biến *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="greeting"
                              {...field}
                              className="font-mono"
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground">
                            Chỉ chữ thường, số và dấu gạch dưới
                          </p>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="return_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kiểu trả về</FormLabel>
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
                              <SelectItem value="string">String</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="boolean">Boolean</SelectItem>
                              <SelectItem value="date">Date</SelectItem>
                              <SelectItem value="object">Object</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={2}
                            placeholder="Mô tả biến này dùng để làm gì..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="template_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Template (Để trống = Global)</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(
                                value === "null" ? null : parseInt(value)
                              )
                            }
                            value={
                              field.value ? field.value.toString() : "null"
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="null">
                                Global (Dùng chung)
                              </SelectItem>
                              {templates.map((template) => (
                                <SelectItem
                                  key={template.id}
                                  value={template.id.toString()}
                                >
                                  {template.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="is_active"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trạng thái</FormLabel>
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
                </TabsContent>

                <TabsContent value="expression" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="expression"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expression *</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                <Textarea
                                  rows={12}
                                  placeholder='IF(HOURS() < 12, "Chào buổi sáng", "Chào buổi chiều")'
                                  className="font-mono text-sm"
                                  {...field}
                                />
                                <div className="flex gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleValidateExpression}
                                  >
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Validate
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handlePreview}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Preview
                                  </Button>
                                </div>
                                {validationResult && (
                                  <div
                                    className={`p-3 rounded-md text-sm ${
                                      validationResult.valid
                                        ? "bg-green-50 text-green-800 border border-green-200"
                                        : "bg-red-50 text-red-800 border border-red-200"
                                    }`}
                                  >
                                    {validationResult.valid ? (
                                      <div>
                                        <CheckCircle2 className="h-4 w-4 inline mr-2" />
                                        Expression hợp lệ
                                        {validationResult.dependencies &&
                                          validationResult.dependencies.length >
                                            0 && (
                                            <div className="mt-2">
                                              Dependencies:{" "}
                                              {validationResult.dependencies.join(
                                                ", "
                                              )}
                                            </div>
                                          )}
                                      </div>
                                    ) : (
                                      <div>
                                        <XCircle className="h-4 w-4 inline mr-2" />
                                        {validationResult.error}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-muted-foreground">
                              💡 Click vào function bên phải để chèn vào
                              expression
                            </p>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <HelperFunctionsReference
                        onInsertFunction={(funcSyntax) => {
                          const currentExpression =
                            form.getValues("expression") || "";
                          const textarea = document.querySelector(
                            'textarea[name="expression"]'
                          );
                          if (textarea) {
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const newExpression =
                              currentExpression.substring(0, start) +
                              funcSyntax +
                              currentExpression.substring(end);
                            form.setValue("expression", newExpression);
                            setTimeout(() => {
                              textarea.focus();
                              const newPos = start + funcSyntax.length;
                              textarea.setSelectionRange(newPos, newPos);
                            }, 0);
                          } else {
                            form.setValue(
                              "expression",
                              currentExpression + funcSyntax
                            );
                          }
                        }}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="space-y-4">
                  {previewResult ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Kết quả Preview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <strong>Giá trị:</strong>{" "}
                            <code className="bg-muted px-2 py-1 rounded">
                              {String(previewResult.result)}
                            </code>
                          </div>
                          <div>
                            <strong>Kiểu:</strong> {previewResult.type}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="py-8 text-center text-muted-foreground">
                        Click "Preview" trong tab Expression để xem kết quả
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpenDialog(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting
                    ? "Đang lưu..."
                    : selectedVariable
                    ? "Cập nhật"
                    : "Tạo"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={openPreview} onOpenChange={setOpenPreview}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preview Biến</DialogTitle>
            <DialogDescription>
              Kết quả khi evaluate expression với sample data
            </DialogDescription>
          </DialogHeader>
          {previewResult && (
            <div className="space-y-4">
              <div>
                <strong>Giá trị:</strong>
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <code className="text-lg">
                    {String(previewResult.result)}
                  </code>
                </div>
              </div>
              <div>
                <strong>Kiểu dữ liệu:</strong>{" "}
                <Badge>{previewResult.type}</Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenPreview(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa Biến</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa biến{" "}
              <code>{selectedVariable?.name}</code>? Hành động này không thể
              hoàn tác.
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
