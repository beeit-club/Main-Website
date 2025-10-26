// src/components/RowActions.jsx
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription, // <-- Thêm DialogDescription
} from "@/components/ui/dialog";
import DOMPurify from "isomorphic-dompurify";
import { Badge } from "@/components/ui/badge"; // <-- Thêm Badge để hiển thị tags
import { postServices } from "@/services/admin/post";
import { toast } from "sonner";
import { format } from "date-fns"; // <-- (Optional) Thêm để format ngày tháng
import { MoreHorizontal, User, Folder, CalendarDays, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/datetime";
export function RowActions({ row }) {
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false); // <-- 1. State mới cho dialog xem chi tiết
  const [post, setPost] = useState({});
  const router = useRouter();
  function onSaveEdit() {
    router.push(`/admin/posts/${row.original.slug}/edit`);
  }

  async function onConfirmDelete() {
    const res = await postServices.delete(row.original.id);
    if (res?.data.status == "success") {
      toast.success("xóa mềm thành công");
    } else {
      toast.error("xóa mềm không thành công");
    }
    setOpenDelete(false);
  }

  async function onView() {
    try {
      const res = await postServices.getOne(row.original.slug);
      if (res?.data.status == "success") {
        setPost(res?.data.data);
        setOpenView(true);
      } else {
        toast.error("Lấy chi tiết bài viết thất bại");
      }
    } catch (error) {
      console.error("Failed to fetch post:", error);
      toast.error("Có lỗi xảy ra khi lấy dữ liệu.");
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onSaveEdit()}>Edit</DropdownMenuItem>
          {/* <-- 3. Cập nhật onClick */}
          <DropdownMenuItem onClick={onView}>View</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenDelete(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirm Dialog (Không thay đổi) */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Bạn có chắc muốn xóa <strong>{row.original.title}</strong> ?
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenDelete(false)}>
              Huỷ
            </Button>
            <Button variant="destructive" onClick={onConfirmDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent className="lg:min-w-6xl max-w-6xl max-h-[90vh] flex flex-col">
          {/* Header chỉ chứa Tiêu đề */}
          <DialogHeader>
            <DialogTitle>
              <div className="text-3xl font-bold overflow-hidden ">
                {post.title}
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* Phần nội dung cuộn (Layout mới) */}
          <div className="flex-1 overflow-y-auto pr-4 space-y-6 py-4">
            {/* 1. Khu vực Metadata (Tác giả, Ngày, Danh mục, Views) */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground pb-4 border-b">
              {/* Tác giả */}
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  {/* Nếu có ảnh thì hiển thị, không thì fallback */}
                  <AvatarImage
                    src={post.author_avatar}
                    alt={post.author_name}
                  />
                  <AvatarFallback>
                    {post.author_name ? (
                      post.author_name.charAt(0).toUpperCase()
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-primary">
                  {post.author_name || "Đang cập nhật"}
                </span>
              </div>

              {/* Danh mục */}
              <div className="flex items-center gap-1.5">
                <Folder className="h-4 w-4" />
                <span>{post.category_name}</span>
              </div>

              {/* Ngày tạo */}
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                <span>
                  {post.created_at ? formatDate(post.created_at) : "N/A"}
                </span>
              </div>

              {/* Lượt xem */}
              <div className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                <span>{post.view_count} lượt xem</span>
              </div>
            </div>

            {/* 2. Khu vực Nội dung bài viết (HTML) */}
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.content || ""),
              }}
              // 'prose' sẽ tự động style các thẻ p, h1, ul...
              className="prose prose-lg dark:prose-invert max-w-none"
            />

            {/* 3. Khu vực Tags (Nếu có) */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap items-center gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary" className="text-sm">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer đứng yên */}
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setOpenView(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
