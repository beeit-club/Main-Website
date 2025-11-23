"use client";

import React, { useRef, useState } from "react";
import { commentService } from "@/services/comment";
import TinyEditor from "@/components/TinyEditor/TinyEditor";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";

export function CommentForm({ postId, onSuccess }) {
  const editorRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Vui lòng đăng nhập để bình luận");
      return;
    }

    setIsSubmitting(true);

    // Lấy nội dung từ TinyEditor
    const editorContent = editorRef.current
      ? editorRef.current.getContent()
      : "";

    // Validate nội dung
    if (!editorContent || editorContent.trim() === "") {
      toast.error("Nội dung bình luận không được để trống");
      setIsSubmitting(false);
      return;
    }

    // Kiểm tra độ dài nội dung (loại bỏ HTML tags để đếm text thực)
    const textContent = editorContent.replace(/<[^>]*>/g, "").trim();
    if (textContent.length < 5) {
      toast.error("Nội dung bình luận cần ít nhất 5 ký tự");
      setIsSubmitting(false);
      return;
    }

    try {
      await commentService.createComment({
        post_id: postId,
        author_id: user.id,
        content: editorContent,
      });

      toast.success("Đã gửi bình luận thành công!");

      // Reset editor
      if (editorRef.current) {
        editorRef.current.setContent("");
      }

      // Gọi callback onSuccess để parent component có thể refresh data
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("❌ Error creating comment:", error);

      let errorMessage = "Không thể tạo bình luận. Vui lòng thử lại.";

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

  if (!user) {
    return (
      <Card className="mt-6">
        <CardContent className="py-6 text-center">
          <p className="text-muted-foreground">
            Vui lòng <a href="/login" className="text-primary underline">đăng nhập</a> để bình luận
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Bình luận</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>
              Nội dung bình luận <span className="text-destructive">*</span>
            </Label>
            <p className="text-sm text-muted-foreground">
              Viết bình luận của bạn (tối thiểu 5 ký tự).
            </p>
            <TinyEditor editorRef={editorRef} initialValue="" />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang gửi..." : "Gửi bình luận"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

