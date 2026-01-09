"use client";
import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Eye, Edit3 } from "lucide-react";
import { questionServices } from "@/services/questionServices";
import TinyEditor from "@/components/TinyEditor/TinyEditor";
import DOMPurify from "isomorphic-dompurify";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Schema validation
const questionSchema = yup.object({
  title: yup.string().required("Tiêu đề là bắt buộc").min(10, "Tiêu đề quá ngắn"),
});

export default function CreateQuestionDialog({ open, onOpenChange, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false); // State để bật chế độ xem trước
  const [previewData, setPreviewData] = useState({ title: "", content: "" });
  
  const editorRef = useRef(null);

  const form = useForm({
    resolver: yupResolver(questionSchema),
    defaultValues: {
      title: "",
    },
  });

  // Hàm xử lý khi bấm nút Xem trước
  const handlePreview = () => {
    const title = form.getValues("title");
    const content = editorRef.current ? editorRef.current.getContent() : "";

    if (!title) {
        form.setError("title", { message: "Vui lòng nhập tiêu đề trước khi xem" });
        return;
    }
    if (!content || content.trim().length === 0) {
        toast.warning("Nội dung đang trống");
        return;
    }

    setPreviewData({ title, content });
    setIsPreviewMode(true);
  };

  const onSubmit = async (data) => {
    // FIX: Nếu đang ở chế độ Preview, lấy content từ state previewData
    // Nếu đang ở chế độ Form, lấy content mới nhất từ editorRef
    let content = "";
    
    if (isPreviewMode) {
        content = previewData.content;
    } else {
        content = editorRef.current ? editorRef.current.getContent() : "";
    }
    
    if (!content || content.trim().length < 20) {
        toast.error("Nội dung câu hỏi quá ngắn (tối thiểu 20 ký tự)");
        return;
    }

    try {
      setIsSubmitting(true);
      await questionServices.createQuestion({ ...data, content });
      toast.success("Đặt câu hỏi thành công!");
      form.reset();
      setIsPreviewMode(false); // Reset mode
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
        if (!val) setIsPreviewMode(false); // Reset khi đóng
        onOpenChange(val);
    }}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>
            {isPreviewMode ? "Xem trước câu hỏi" : "Đặt câu hỏi mới"}
          </DialogTitle>
          <DialogDescription>
            {isPreviewMode 
                ? "Xem lại nội dung trước khi đăng tải." 
                : "Chia sẻ thắc mắc của bạn với cộng đồng Bee IT."
            }
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="flex-1 overflow-y-auto p-6">
            {!isPreviewMode ? (
                // --- FORM MODE ---
                <Form {...form}>
                    <form id="question-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tiêu đề</FormLabel>
                                    <FormControl>
                                        <Input placeholder="VD: Làm sao để tối ưu truy vấn MySQL?" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormItem>
                            <FormLabel>Nội dung chi tiết</FormLabel>
                            <FormControl>
                                <div className="min-h-[350px]">
                                    <TinyEditor
                                        editorRef={editorRef}
                                        initialValue={previewData.content} // Giữ lại nội dung cũ nếu back từ preview
                                        heightMin={350}
                                        hideMenubar={false}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </form>
                </Form>
            ) : (
                // --- PREVIEW MODE ---
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                    <div>
                        <h3 className="text-2xl font-bold text-primary mb-2">{previewData.title}</h3>
                        <div className="text-sm text-muted-foreground">Preview Mode</div>
                    </div>
                    
                    <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm min-h-[300px]">
                         <div 
                            className="prose dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(previewData.content) }}
                        />
                    </div>
                </div>
            )}
        </div>

        <Separator />

        <DialogFooter className="p-6 pt-4 bg-muted/10">
            {!isPreviewMode ? (
                // Nút bấm ở chế độ Form
                <>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <div className="flex gap-2">
                        <Button type="button" variant="secondary" onClick={handlePreview}>
                            <Eye className="mr-2 h-4 w-4" /> Xem trước
                        </Button>
                        <Button type="submit" form="question-form" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Đăng câu hỏi
                        </Button>
                    </div>
                </>
            ) : (
                // Nút bấm ở chế độ Preview
                <>
                    <Button type="button" variant="outline" onClick={() => setIsPreviewMode(false)}>
                        <Edit3 className="mr-2 h-4 w-4" /> Quay lại sửa
                    </Button>
                    <Button 
                        type="button" 
                        onClick={form.handleSubmit(onSubmit)} 
                        disabled={isSubmitting}
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Xác nhận đăng
                    </Button>
                </>
            )}
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
