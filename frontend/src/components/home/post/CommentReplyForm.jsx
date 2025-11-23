"use client";

import React, { useRef, useState } from "react";
import { commentService } from "@/services/comment";
import TinyEditor from "@/components/TinyEditor/TinyEditor";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { X } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export function CommentReplyForm({ postId, parentId, onSuccess, onCancel }) {
  const editorRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Vui lòng đăng nhập để trả lời");
      return;
    }

    setIsSubmitting(true);

    const editorContent = editorRef.current
      ? editorRef.current.getContent()
      : "";

    if (!editorContent || editorContent.trim() === "") {
      toast.error("Nội dung trả lời không được để trống");
      setIsSubmitting(false);
      return;
    }

    const textContent = editorContent.replace(/<[^>]*>/g, "").trim();
    if (textContent.length < 5) {
      toast.error("Nội dung trả lời cần ít nhất 5 ký tự");
      setIsSubmitting(false);
      return;
    }

    try {
      await commentService.createComment({
        post_id: postId,
        author_id: user.id,
        parent_id: parentId,
        content: editorContent,
      });

      toast.success("Đã gửi trả lời thành công!");

      if (editorRef.current) {
        editorRef.current.setContent("");
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("❌ Error creating reply:", error);

      let errorMessage = "Không thể tạo trả lời. Vui lòng thử lại.";

      if (typeof error === "string") {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 p-4 border rounded-lg bg-muted/50">
      <div className="flex items-center justify-between mb-3">
        <Label className="text-sm font-medium">Trả lời bình luận</Label>
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <form onSubmit={onSubmit} className="space-y-3">
        <TinyEditor editorRef={editorRef} initialValue="" />
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" size="sm" onClick={onCancel}>
              Hủy
            </Button>
          )}
          <Button type="submit" size="sm" disabled={isSubmitting}>
            {isSubmitting ? "Đang gửi..." : "Gửi"}
          </Button>
        </div>
      </form>
    </div>
  );
}

