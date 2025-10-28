// src/components/admin/components/questions/RowActions.jsx
import React, { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { questionServices } from "@/services/admin/questionServices";
import { toast } from "sonner";
import { MoreHorizontal, Eye, Trash, CheckCircle, XCircle } from "lucide-react";

export function RowActions({ row }) {
  const [openDelete, setOpenDelete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const question = row.original;
  const currentStatus = question.status; //

  // Xử lý XÓA
  async function onConfirmDelete() {
    setIsSubmitting(true);
    try {
      const res = await questionServices.deleteQuestion(question.id);
      if (res?.data.status == "success") {
        toast.success("Xóa câu hỏi thành công");
        setOpenDelete(false);
        window.location.reload();
      } else {
        toast.error("Xóa không thành công");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Xử lý ẨN / HIỆN
  async function onToggleStatus() {
    const newStatus = currentStatus === 1 ? 0 : 1;
    const actionText = newStatus === 1 ? "Hiện" : "Ẩn";

    try {
      await questionServices.updateQuestion(question.id, {
        status: newStatus,
      });
      toast.success(`${actionText} câu hỏi thành công`);
      window.location.reload();
    } catch (error) {
      toast.error(`Có lỗi khi ${actionText} câu hỏi.`);
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
          {/* Nút Quản lý (Link) */}
          <DropdownMenuItem asChild>
            <Link href={`/admin/questions/${question.id}/manage`}>
              <Eye className="mr-2 h-4 w-4" />
              Quản lý / Xem chi tiết
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Nút Ẩn / Hiện */}
          {currentStatus === 1 ? (
            <DropdownMenuItem onClick={onToggleStatus}>
              <XCircle className="mr-2 h-4 w-4" />
              Ẩn câu hỏi
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={onToggleStatus}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Hiện câu hỏi
            </DropdownMenuItem>
          )}

          {/* Nút Xóa */}
          <DropdownMenuItem
            onClick={() => setOpenDelete(true)}
            className="text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" />
            Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog Xóa */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận Xóa</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Bạn có chắc muốn xóa câu hỏi: <strong>{question.title}</strong>?
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setOpenDelete(false)}
              disabled={isSubmitting}
            >
              Huỷ
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirmDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
