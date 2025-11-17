"use client";

import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { questionSchema } from "@/validation/questionSchema";
import { createQuestion } from "@/services/home";
import TinyEditor from "@/components/TinyEditor/TinyEditor";
import { useRouter } from "next/navigation";

// --- Import shadcn/ui components ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AskQuestionPage() {
  const router = useRouter();
  const editorRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Khởi tạo react-hook-form
  const form = useForm({
    resolver: yupResolver(questionSchema),
    defaultValues: {
      title: "",
      meta_description: "",
    },
  });

  // 2. Hàm xử lý khi submit form
  const onSubmit = async (data) => {
    console.log("🚀 Form submitted with data:", data);
    setIsSubmitting(true);

    // Lấy nội dung từ TinyEditor
    const editorContent = editorRef.current
      ? editorRef.current.getContent()
      : "";
    
    console.log("📝 Editor content:", editorContent);
    
    if (!editorContent || editorContent.trim() === "") {
      toast.error("Nội dung câu hỏi không được để trống");
      setIsSubmitting(false);
      return;
    }

    try {
      const questionData = {
        title: data.title,
        content: editorContent,
        meta_description: data.meta_description || "",
      };
      
      console.log("📤 Sending question data:", questionData);
      
      // Gửi dữ liệu lên server
      const response = await createQuestion(questionData);
      
      console.log("✅ Response from server:", response);

      toast.success("Câu hỏi đã được đăng thành công!");
      
      // Reset form
      form.reset();
      if (editorRef.current) {
        editorRef.current.setContent("");
      }
      
      // Revalidate cache để cập nhật danh sách câu hỏi
      try {
        await fetch("/api/revalidate?tag=questionsList", {
          method: "POST",
        });
        console.log("✅ Cache revalidated for questionsList");
      } catch (revalidateError) {
        console.error("⚠️ Failed to revalidate cache:", revalidateError);
        // Không block flow nếu revalidate fail
      }
      
      // Redirect về trang danh sách câu hỏi (sẽ tự động lấy dữ liệu mới vì cache đã revalidate)
      setTimeout(() => {
        router.push("/questions");
      }, 1500);
    } catch (error) {
      console.error("❌ Error creating question:", error);
      console.error("❌ Error details:", {
        error,
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
      });
      
      // Hiển thị lỗi chi tiết hơn
      let errorMessage = "Không thể tạo câu hỏi. Vui lòng thử lại.";
      
      if (typeof error === "string") {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.error) {
        errorMessage = error.error;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hàm xử lý khi form validation fail
  const onError = (errors) => {
    console.error("❌ Form validation errors:", errors);
    toast.error("Vui lòng kiểm tra lại thông tin đã nhập");
  };

  return (
    <div className="container max-w-5xl mx-auto py-8 md:py-12">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/questions"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách câu hỏi
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold">Đặt câu hỏi mới</h1>
        <p className="text-muted-foreground mt-2">
          Chia sẻ thắc mắc của bạn với cộng đồng
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin câu hỏi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tiêu đề */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tiêu đề câu hỏi <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tiêu đề câu hỏi của bạn..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Một tiêu đề rõ ràng giúp người khác dễ dàng hiểu và trả lời.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mô tả Meta */}
              <FormField
                control={form.control}
                name="meta_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả ngắn (SEO)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả ngắn gọn về câu hỏi (tối đa 160 ký tự)..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Tùy chọn: Giúp tối ưu hóa công cụ tìm kiếm.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nội dung câu hỏi */}
              <FormItem>
                <FormLabel>
                  Nội dung chi tiết <span className="text-destructive">*</span>
                </FormLabel>
                <FormDescription className="mb-2">
                  Mô tả chi tiết vấn đề của bạn. Càng rõ ràng càng tốt.
                </FormDescription>
                <FormControl>
                  <TinyEditor editorRef={editorRef} initialValue="" />
                </FormControl>
                <FormMessage />
              </FormItem>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/questions")}
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang gửi..." : "Gửi câu hỏi"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}

