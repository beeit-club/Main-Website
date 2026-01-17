"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Eye, Save, ArrowLeft, RefreshCw, Send } from "lucide-react";
import { EmailVariableList } from "./EmailVariableList"; 
import { TestSendDialog } from "./TestSendDialog"; 
import { useRouter } from "next/navigation";
import { emailTemplateServices } from "@/services/admin/emailTemplateServices";
import { toast } from "sonner";

// Validation Schema
const schema = yup.object({
  name: yup.string().required("Vui lòng nhập tên mẫu email").max(255),
  subject: yup.string().required("Vui lòng nhập tiêu đề email").max(500),
  body: yup.string().required("Nội dung không được để trống").min(10, "Nội dung quá ngắn"),
  category: yup.string().optional(),
  is_active: yup.boolean().optional(),
});

export function EmailTemplateForm({ initialData, isEdit, onSubmit }) {
  const router = useRouter();
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [mockData, setMockData] = useState({});
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewSubject, setPreviewSubject] = useState("");
  const [iframeUrl, setIframeUrl] = useState(null);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  
  // Ref để chèn text vào textarea
  const bodyInputRef = useRef(null);

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: initialData?.name || "",
      subject: initialData?.subject || "",
      body: initialData?.body || "",
      category: initialData?.category || "custom",
      is_active: initialData?.is_active ?? true,
    },
  });

  const { watch, setValue, getValues } = form;
  const bodyContent = watch("body");
  const subjectContent = watch("subject");

  // Clean up Blob URL
  useEffect(() => {
    return () => {
        if (iframeUrl) URL.revokeObjectURL(iframeUrl);
    };
  }, [iframeUrl]);

  // Update Blob URL khi có previewHtml mới
  useEffect(() => {
    if (previewHtml) {
        const blob = new Blob([previewHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        setIframeUrl(url);
    } else {
        setIframeUrl(null);
    }
  }, [previewHtml]);

  // Hàm gọi API Preview Raw
  const fetchPreview = async () => {
    setIsPreviewLoading(true);
    try {
      const currentValues = getValues();
      const res = await emailTemplateServices.previewRaw({
        mjml_content: currentValues.body,
        subject: currentValues.subject,
        variables: mockData
      });
      
      if(res.status === 'success') {
          setPreviewHtml(res.data.html || "");
          if(res.data.subject) {
              setPreviewSubject(res.data.subject);
          } else {
              setPreviewSubject(currentValues.subject);
          }
      }
    } catch (error) {
      console.error("Preview error", error);
      toast.error("Lỗi tải xem trước");
    } finally {
      setIsPreviewLoading(false);
    }
  };

  // Debounce Preview
  useEffect(() => {
    const timer = setTimeout(() => {
        if(bodyContent || subjectContent) {
            fetchPreview();
        }
    }, 800);
    return () => clearTimeout(timer);
  }, [bodyContent, subjectContent, mockData]);

  // Auto-detect variables
  useEffect(() => {
    const textToCheck = (subjectContent || "") + (bodyContent || "");
    const regex = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
    const matches = new Set();
    let match;
    while ((match = regex.exec(textToCheck)) !== null) {
        if(!['#if', '/if', 'else', 'each', '/each'].some(k => match[1].startsWith(k))) {
             matches.add(match[1]);
        }
    }
    const vars = Array.from(matches);

    setMockData((prev) => {
      const newData = { ...prev };
      vars.forEach((v) => {
        if (newData[v] === undefined) {
            if(v === 'fullname') newData[v] = 'Nguyễn Văn A';
            else if(v === 'email') newData[v] = 'nguyenvana@example.com';
            else if(v.includes('date')) newData[v] = new Date().toISOString();
            else newData[v] = `[${v}]`;
        }
      });
      return newData;
    });
  }, [bodyContent, subjectContent]);

  const handleInsertVariable = (variableTag) => {
    const textarea = bodyInputRef.current;
    if (!textarea) {
        setValue("body", (getValues("body") || "") + variableTag);
        return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const newText = text.substring(0, start) + variableTag + text.substring(end);
    setValue("body", newText, { shouldDirty: true });
    setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variableTag.length, start + variableTag.length);
    }, 0);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-[calc(100vh-80px)]">
        <div className="flex items-center justify-between border-b pb-4 mb-4 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" type="button" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                {isEdit ? "Chỉnh sửa Mẫu Email" : "Tạo Mẫu Email Mới"}
                {isEdit && <span className="text-xs font-normal text-muted-foreground px-2 py-1 bg-gray-100 rounded">ID: {initialData?.id}</span>}
              </h1>
            </div>
          </div>
          <div className="flex gap-2">
            {isEdit && (
                <Button 
                    type="button" 
                    variant="outline" 
                    className="border-orange-600 text-orange-600 hover:bg-orange-50"
                    onClick={() => setIsTestDialogOpen(true)}
                >
                    <Send className="mr-2 h-4 w-4" />
                    Gửi Thử
                </Button>
            )}
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white font-bold" disabled={form.formState.isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {form.formState.isSubmitting ? "Đang lưu..." : "Lưu Lại"}
            </Button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-0 border rounded-lg overflow-hidden shadow-sm bg-white">
          <div className="col-span-5 flex flex-col border-r h-full overflow-hidden">
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên mẫu</FormLabel>
                        <FormControl><Input placeholder="Tên mẫu email" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Danh mục</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Chọn danh mục" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="authentication">Xác thực</SelectItem>
                            <SelectItem value="recruitment">Tuyển dụng</SelectItem>
                            <SelectItem value="event">Sự kiện</SelectItem>
                            <SelectItem value="custom">Khác</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề</FormLabel>
                      <FormControl><Input placeholder="Tiêu đề email" {...field} /></FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex-1 flex flex-col h-full min-h-[400px]">
                    <Label className="mb-2">Nội dung HTML/MJML</Label>
                    <div className="flex-1 border rounded-md overflow-hidden flex">
                        <FormField
                            control={form.control}
                            name="body"
                            render={({ field }) => (
                                <Textarea 
                                    {...field} 
                                    ref={(e) => { field.ref(e); bodyInputRef.current = e; }}
                                    className="flex-1 resize-none border-0 focus-visible:ring-0 font-mono text-sm p-4" 
                                />
                            )}
                        />
                        <div className="w-[200px] border-l bg-gray-50 flex flex-col">
                            <EmailVariableList onInsertVariable={handleInsertVariable} />
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <div className="col-span-7 flex flex-col bg-gray-100/50 h-full overflow-hidden">
             <div className="h-12 border-b bg-white flex items-center justify-between px-4">
                <div className="flex items-center gap-2 text-sm font-semibold"><Eye className="h-4 w-4" /> Xem trước</div>
                <Button variant="outline" size="sm" onClick={fetchPreview} disabled={isPreviewLoading}>
                    <RefreshCw className={`h-3 w-3 mr-2 ${isPreviewLoading ? 'animate-spin' : ''}`} /> Làm mới
                </Button>
             </div>
             <div className="flex-1 p-6 overflow-y-auto flex flex-col items-center bg-gray-200">
                <div className="w-full max-w-[600px] bg-white shadow-lg min-h-[500px] rounded-sm overflow-hidden flex flex-col relative mb-4">
                    <div className="bg-gray-50 border-b p-4 text-sm shrink-0">
                        <p className="font-bold">Subject: {previewSubject}</p>
                    </div>
                    <div className="flex-1 relative w-full h-full min-h-[400px]">
                        {isPreviewLoading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10"><RefreshCw className="h-8 w-8 animate-spin text-orange-500" /></div>}
                        <iframe key={iframeUrl} className="w-full h-full border-none min-h-[500px] bg-white" src={iframeUrl} title="Preview" />
                    </div>
                </div>
                <details className="w-full max-w-[600px] mb-4">
                    <summary className="text-xs text-gray-500 cursor-pointer">Xem Source Code</summary>
                    <pre className="p-2 bg-gray-800 text-green-400 text-[10px] rounded max-h-[200px] overflow-auto">{previewHtml}</pre>
                </details>
             </div>

             <div className="h-[180px] bg-white border-t p-4 overflow-y-auto grid grid-cols-3 gap-4">
                {Object.keys(mockData).map((key) => (
                    <div key={key} className="space-y-1">
                        <Label className="text-xs font-mono text-orange-600">{`{{${key}}}`}</Label>
                        <Input className="h-8 text-xs bg-gray-50" value={mockData[key]} onChange={(e) => setMockData(prev => ({ ...prev, [key]: e.target.value }))} />
                    </div>
                ))}
             </div>
          </div>
        </div>

        {isEdit && (
            <TestSendDialog 
                isOpen={isTestDialogOpen} 
                onOpenChange={setIsTestDialogOpen}
                templateId={initialData?.id}
                mockVariables={mockData}
            />
        )}
      </form>
    </Form>
  );
}