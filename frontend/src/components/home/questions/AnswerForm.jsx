"use client";

import React, { useRef, useState } from "react";
import { createAnswer } from "@/services/home";
import TinyEditor from "@/components/TinyEditor/TinyEditor";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function AnswerForm({ questionId, onSuccess }) {
  const editorRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Lấy nội dung từ TinyEditor
    const editorContent = editorRef.current
      ? editorRef.current.getContent()
      : "";

    // Validate nội dung
    if (!editorContent || editorContent.trim() === "") {
      toast.error("Nội dung trả lời không được để trống");
      setIsSubmitting(false);
      return;
    }

    // Kiểm tra độ dài nội dung (loại bỏ HTML tags để đếm text thực)
    const textContent = editorContent.replace(/<[^>]*>/g, "").trim();
    if (textContent.length < 10) {
      toast.error("Nội dung trả lời cần ít nhất 10 ký tự");
      setIsSubmitting(false);
      return;
    }

    try {
      await createAnswer({
        question_id: questionId,
        content: editorContent,
      });

      toast.success("Đã gửi câu trả lời thành công!");

      // Reset editor
      if (editorRef.current) {
        editorRef.current.setContent("");
      }

      // Gọi callback onSuccess để parent component có thể refresh data
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("❌ Error creating answer:", error);
      
      let errorMessage = "Không thể tạo câu trả lời. Vui lòng thử lại.";
      
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

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Trả lời câu hỏi</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>
              Nội dung trả lời <span className="text-destructive">*</span>
            </Label>
            <p className="text-sm text-muted-foreground">
              Viết câu trả lời chi tiết và rõ ràng cho câu hỏi này (tối thiểu 10 ký tự).
            </p>
            <TinyEditor editorRef={editorRef} initialValue="" />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang gửi..." : "Gửi câu trả lời"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

