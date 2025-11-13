// src/components/admin/components/users/RowActions.jsx
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
import { Label } from "@/components/ui/label"; // !! ĐÃ XÓA: Form, Input, Select, Textarea...
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// !! ĐÃ XÓA: useForm, yupResolver, userUpdateSchema

import { usersServices } from "@/services/admin/users";
import { toast } from "sonner";
import { formatDate } from "@/lib/datetime";
import {
  MoreHorizontal,
  Pencil,
  Eye,
  Trash,
  User,
  ToggleLeft,
  ToggleRight,
  RefreshCcw,
  Trash2,
  Mail,
  Phone,
  Briefcase,
  BookUser,
  CalendarDays,
} from "lucide-react";

// Helper function để lấy 2 chữ cái đầu
const getInitials = (name) => {
  if (!name) return "U";
  const names = name.split(" ");
  const initials = names.map((n) => n[0]).join("");
  return initials.substring(0, 2).toUpperCase();
};

export function RowActions({ row, viewMode = "active" }) {
  // States cho các dialog
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openPermanentDelete, setOpenPermanentDelete] = useState(false);

  // States loading
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);
  const [isToggleSubmitting, setIsToggleSubmitting] = useState(false);
  const [isRestoreSubmitting, setIsRestoreSubmitting] = useState(false);
  const [isPermDeleteSubmitting, setIsPermDeleteSubmitting] = useState(false);

  // State chứa data chi tiết
  const [userDataForView, setUserDataForView] = useState(null);
  // !! ĐÃ XÓA: [rolesList, setRolesList]

  const userId = row.original.id;
  const userName = row.original.fullname;
  const isActive = row.original.is_active;

  // --- Hàm reload trang ---
  const reloadPage = () => window.location.reload();
  async function onConfirmDelete() {
    setIsDeleteSubmitting(true);
    try {
      const res = await usersServices.deleteUser(userId);
      if (res.status == "success") {
        toast.success("Vô hiệu hóa user thành công");
        setOpenDelete(false);
        reloadPage();
      } else {
        toast.error(res.message || "Vô hiệu hóa thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa user.");
    } finally {
      setIsDeleteSubmitting(false);
    }
  }

  // --- Xử lý XÓA VĨNH VIỄN (Trash View) ---
  async function onConfirmPermanentDelete() {
    setIsPermDeleteSubmitting(true);
    try {
      const res = await usersServices.hardDeleteUser(userId);
      if (res.status == "success") {
        toast.success("Xóa user vĩnh viễn thành công");
        setOpenPermanentDelete(false);
        reloadPage();
      } else {
        toast.error(res.message || "Xóa vĩnh viễn thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra.");
    } finally {
      setIsPermDeleteSubmitting(false);
    }
  }

  // --- Xử lý KHÔI PHỤC (Trash View) ---
  async function onRestore() {
    setIsRestoreSubmitting(true);
    try {
      const res = await usersServices.restoreUser(userId);
      if (res.status == "success") {
        toast.success("Khôi phục user thành công");
        reloadPage();
      } else {
        toast.error(res.message || "Khôi phục thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra.");
    } finally {
      setIsRestoreSubmitting(false);
    }
  }

  async function onToggleActive() {
    setIsToggleSubmitting(true);
    try {
      const res = await usersServices.toggleUserActive(userId, {
        is_active: isActive ? 0 : 1,
      });
      if (res.status == "success") {
        toast.success("Thay đổi trạng thái thành công");
        reloadPage();
      } else {
        toast.error(res.message || "Thay đổi trạng thái thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra.");
    } finally {
      setIsToggleSubmitting(false);
    }
  }

  // --- Xử lý XEM CHI TIẾT ---
  async function onViewClick() {
    if (!userDataForView || userDataForView.id !== userId) {
      try {
        const res = await usersServices.getUserById(userId);
        if (res.status == "success") {
          setUserDataForView(res.data.user);
          setOpenView(true);
        } else {
          toast.error("Lấy chi tiết user thất bại");
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi lấy dữ liệu.");
      }
    } else {
      setOpenView(true);
    }
  }

  return (
    <>
      {/* --- Nút bấm trigger (3 chấm) --- */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* == Các hành động cho View "Active" == */}
          {viewMode === "active" && (
            <>
              {/* !! ĐÃ XÓA: DropdownMenuItem (Chỉnh sửa) */}
              <DropdownMenuItem onClick={onViewClick}>
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onToggleActive}
                disabled={isToggleSubmitting}
              >
                {isActive ? (
                  <ToggleLeft className="mr-2 h-4 w-4" />
                ) : (
                  <ToggleRight className="mr-2 h-4 w-4" />
                )}
                {isActive ? "Vô hiệu hóa" : "Kích hoạt"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setOpenDelete(true)}
                className="text-red-600"
              >
                <Trash className="mr-2 h-4 w-4" />
                Xóa (Lưu trữ)
              </DropdownMenuItem>
            </>
          )}

          {/* == Các hành động cho View "Trash" == */}
          {viewMode === "trash" && (
            <>
              <DropdownMenuItem
                onClick={onRestore}
                disabled={isRestoreSubmitting}
                className="text-green-600"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Khôi phục
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setOpenPermanentDelete(true)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa vĩnh viễn
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* --- 1. Dialog Xóa MỀM (Active) --- */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận Xóa (Lưu trữ)</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Bạn có chắc muốn xóa user <strong>{userName}</strong>? User sẽ được
            chuyển vào thùng rác.
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

      {/* --- 2. Dialog Xóa VĨNH VIỄN (Trash) --- */}
      <Dialog open={openPermanentDelete} onOpenChange={setOpenPermanentDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận XÓA VĨNH VIỄN</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            Bạn có chắc muốn xóa vĩnh viễn user <strong>{userName}</strong>?
            Toàn bộ dữ liệu liên quan có thể bị mất.
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setOpenPermanentDelete(false)}
              disabled={isPermDeleteSubmitting}
            >
              Huỷ
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirmPermanentDelete}
              disabled={isPermDeleteSubmitting}
            >
              {isPermDeleteSubmitting ? "Đang xóa..." : "Xóa vĩnh viễn"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- 3. Dialog Xem Chi Tiết (Giữ nguyên) --- */}
      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={userDataForView?.avatar_url}
                  alt={userDataForView?.fullname}
                />
                <AvatarFallback>
                  {getInitials(userDataForView?.fullname)}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl">
                  {userDataForView?.fullname}
                </DialogTitle>
                <DialogDescription>{userDataForView?.email}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {/* Trạng thái và Vai trò */}
            <div className="flex gap-4">
              {userDataForView?.is_active ? (
                <Badge variant="default" className="bg-green-600">
                  Hoạt động
                </Badge>
              ) : (
                <Badge variant="outline">Vô hiệu hóa</Badge>
              )}
              <Badge variant="secondary">{userDataForView?.role?.name}</Badge>
            </div>

            {/* Thông tin cá nhân */}
            <div className="space-y-2">
              <h4 className="font-semibold">Thông tin cá nhân</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{userDataForView?.phone || "Chưa cập nhật"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {userDataForView?.email_verified_at
                      ? "Đã xác thực"
                      : "Chưa xác thực"}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <BookUser className="h-4 w-4 text-muted-foreground mt-1" />
                <p>{userDataForView?.bio || "Chưa có tiểu sử."}</p>
              </div>
            </div>

            {/* Thông tin thành viên (Từ bảng member_profiles) */}
            {userDataForView?.memberProfile && (
              <div className="space-y-2 pt-4 border-t">
                <h4 className="font-semibold">Thông tin thành viên CLB</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <strong>MSSV:</strong>
                    <span>{userDataForView.memberProfile.student_id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <strong>Khóa:</strong>
                    <span>{userDataForView.memberProfile.course}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Thông tin hệ thống */}
            <div className="space-y-2 pt-4 border-t">
              <h4 className="font-semibold">Thông tin hệ thống</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Ngày tham gia: {formatDate(userDataForView?.created_at)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Pencil className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Cập nhật: {formatDate(userDataForView?.updated_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenView(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
