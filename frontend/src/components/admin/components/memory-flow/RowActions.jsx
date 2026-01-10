"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, RotateCcw, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { memoryFlowService } from "@/services/admin/memoryFlow";
import { revalidateLanding } from "@/utils/revalidateCache";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function RowActions({ row, viewMode }) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const item = row.original;

  const handleEdit = () => {
    router.push(`/admin/landing/memory-flow/${item.id}/edit`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (viewMode === "trash") {
        await memoryFlowService.deletePermanent(item.id);
        toast.success("Xóa vĩnh viễn thành công");
      } else {
        await memoryFlowService.delete(item.id);
        toast.success("Xóa thành công");
      }
      await revalidateLanding();
      router.refresh();
    } catch (error) {
      toast.error(error?.message || "Xóa thất bại");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleRestore = async () => {
    try {
      await memoryFlowService.restore(item.id);
      await revalidateLanding();
      toast.success("Khôi phục thành công");
      router.refresh();
    } catch (error) {
      toast.error(error?.message || "Khôi phục thất bại");
    }
  };

  const handleToggleActive = async () => {
    setIsToggling(true);
    try {
      await memoryFlowService.toggleActive(item.id, !item.is_active);
      await revalidateLanding();
      toast.success(
        item.is_active ? "Đã ẩn item" : "Đã hiển thị item"
      );
      router.refresh();
    } catch (error) {
      toast.error(error?.message || "Cập nhật thất bại");
    } finally {
      setIsToggling(false);
    }
  };

  if (viewMode === "trash") {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleRestore}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Khôi phục
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa vĩnh viễn
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa vĩnh viễn</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa vĩnh viễn item này? Hành động này
                không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? "Đang xóa..." : "Xóa vĩnh viễn"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleToggleActive}
            disabled={isToggling}
          >
            {item.is_active ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Ẩn
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Hiển thị
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Item này sẽ được chuyển vào thùng rác. Bạn có thể khôi phục sau.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

