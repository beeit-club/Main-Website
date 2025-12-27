// src/components/admin/components/members/RowActions.jsx
import React, { useState } from "react";
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
  DialogDescription,
} from "@/components/ui/dialog";
import { usersServices } from "@/services/admin/users";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Pencil,
  Trash,
} from "lucide-react";

export function RowActions({ row, onEdit, onDelete }) {
  const [openDelete, setOpenDelete] = useState(false);
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);

  const userId = row.original.user_id || row.original.id;
  const userName = row.original.fullname;

  // Hàm reload trang
  const reloadPage = () => window.location.reload();

  async function onConfirmDelete() {
    setIsDeleteSubmitting(true);
    try {
      const res = await usersServices.deleteMember(userId);
      if (res.status === "success") {
        toast.success("Xóa thành viên thành công");
        setOpenDelete(false);
        reloadPage();
      } else {
        toast.error(res.message || "Xóa thất bại");
      }
    } catch (error) {
      toast.error(error?.message || "Có lỗi xảy ra khi xóa thành viên.");
    } finally {
      setIsDeleteSubmitting(false);
    }
  }

  return (
    <>
      {/* Nút bấm trigger (3 chấm) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit && onEdit(row.original)}>
            <Pencil className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </DropdownMenuItem>
          <DropdownMenuSeparator />
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
            <DialogDescription>
              Hành động này sẽ xóa hồ sơ thành viên khỏi hệ thống.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            Bạn có chắc muốn xóa thành viên <strong>{userName}</strong>?
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setOpenDelete(false)}
              disabled={isDeleteSubmitting}
            >
              Huỷ
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirmDelete}
              disabled={isDeleteSubmitting}
            >
              {isDeleteSubmitting ? "Đang xóa..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

