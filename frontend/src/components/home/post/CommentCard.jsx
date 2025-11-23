"use client";
import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Edit, Trash2, MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { CommentReplyForm } from "./CommentReplyForm";
import { useAuthStore } from "@/stores/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { commentService } from "@/services/comment";

const TinyEditor = dynamic(() => import("@/components/TinyEditor/TinyEditor"), {
  ssr: false,
});

export function CommentCard({ comment, postId, onUpdate, depth = 0 }) {
  const { user } = useAuthStore();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    id,
    content,
    author_name,
    author_avatar,
    author_id,
    created_at,
    updated_at,
    children = [],
  } = comment;

  const timeAgo = formatDistanceToNow(new Date(created_at), {
    addSuffix: true,
    locale: vi,
  });

  const maxDepth = 3; // Giới hạn độ sâu để tránh UI quá phức tạp
  const isNested = depth > 0;
  const canReply = depth < maxDepth;
  const isOwner = user?.id === author_id;

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await commentService.deleteComment(id);
      toast.success("Đã xóa bình luận");
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error(error?.message || "Không thể xóa bình luận");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={`${isNested ? "ml-8 mt-4" : ""} ${
        depth > 0 ? "border-l-2 border-muted pl-4" : ""
      }`}
    >
      <div className="flex space-x-4 py-4">
        {/* Avatar */}
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={author_avatar} alt={author_name} />
          <AvatarFallback>{author_name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
        </Avatar>

        {/* Nội dung comment */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-foreground">{author_name}</span>
              <span
                className="text-xs text-muted-foreground"
                title={new Date(created_at).toLocaleString()}
              >
                • {timeAgo}
                {updated_at && updated_at !== created_at && " (đã chỉnh sửa)"}
              </span>
            </div>

            {/* Menu actions (chỉ hiển thị cho owner) */}
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} disabled={isDeleting}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Nội dung HTML */}
          {!isEditing ? (
            <div
              className="prose dark:prose-invert max-w-none mb-3"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <CommentEditForm
              comment={comment}
              onSuccess={() => {
                setIsEditing(false);
                if (onUpdate) {
                  onUpdate();
                }
              }}
              onCancel={() => setIsEditing(false)}
            />
          )}

          {/* Nút Trả lời */}
          {!isEditing && canReply && user && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="h-8 text-sm"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Trả lời
            </Button>
          )}

          {/* Form trả lời nested */}
          {showReplyForm && canReply && !isEditing && (
            <CommentReplyForm
              postId={postId}
              parentId={id}
              onSuccess={() => {
                setShowReplyForm(false);
                if (onUpdate) {
                  onUpdate();
                }
              }}
              onCancel={() => setShowReplyForm(false)}
            />
          )}
        </div>
      </div>

      {/* Hiển thị nested children */}
      {children && children.length > 0 && (
        <div className="mt-2">
          {children.map((child) => (
            <CommentCard
              key={child.id}
              comment={child}
              postId={postId}
              onUpdate={onUpdate}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Component Edit Form (inline)
function CommentEditForm({ comment, onSuccess, onCancel }) {
  const editorRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const editorContent = editorRef.current ? editorRef.current.getContent() : "";

    if (!editorContent || editorContent.trim() === "") {
      toast.error("Nội dung bình luận không được để trống");
      setIsSubmitting(false);
      return;
    }

    const textContent = editorContent.replace(/<[^>]*>/g, "").trim();
    if (textContent.length < 5) {
      toast.error("Nội dung bình luận cần ít nhất 5 ký tự");
      setIsSubmitting(false);
      return;
    }

    try {
      await commentService.updateComment(comment.id, {
        content: editorContent,
      });

      toast.success("Đã cập nhật bình luận");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error(error?.message || "Không thể cập nhật bình luận");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <TinyEditor editorRef={editorRef} initialValue={comment.content} />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? "Đang lưu..." : "Lưu"}
        </Button>
      </div>
    </form>
  );
}

