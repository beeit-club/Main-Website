import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { rolesServices } from "@/services/admin/roles";
import { toast } from "sonner";

const roleSchema = yup.object({
  name: yup
    .string()
    .required("Tên vai trò là bắt buộc")
    .min(2, "Tên vai trò phải có ít nhất 2 ký tự")
    .max(100, "Tên vai trò tối đa 100 ký tự"),
  description: yup
    .string()
    .nullable()
    .max(500, "Mô tả tối đa 500 ký tự"),
});

export function RoleDialog({ open, onOpenChange, role, onSave }) {
  const isEditing = !!role;
  const isSuperAdmin = role?.id === 1;

  const form = useForm({
    resolver: yupResolver(roleSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (role) {
      form.reset({
        name: role.name || "",
        description: role.description || "",
      });
    } else {
      form.reset({
        name: "",
        description: "",
      });
    }
  }, [role, open]);

  const { isSubmitting } = form.formState;

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        if (isSuperAdmin) {
          toast.error("Không thể chỉnh sửa vai trò Super Admin");
          return;
        }
        const res = await rolesServices.updateRole(role.id, data);
        if (res.status === "success") {
          toast.success("Cập nhật vai trò thành công");
          onSave();
        } else {
          toast.error(res.message || "Cập nhật vai trò thất bại");
        }
      } else {
        const res = await rolesServices.createRole(data);
        if (res.status === "success") {
          toast.success("Tạo vai trò thành công");
          onSave();
        } else {
          toast.error(res.message || "Tạo vai trò thất bại");
        }
      }
    } catch (error) {
      toast.error(error?.message || "Có lỗi xảy ra");
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa Vai trò" : "Thêm Vai trò Mới"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên Vai trò</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: Admin, Moderator..."
                      {...field}
                      disabled={isSubmitting || isSuperAdmin}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả về vai trò này..."
                      {...field}
                      disabled={isSubmitting || isSuperAdmin}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                variant="ghost"
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Huỷ
              </Button>
              <Button type="submit" disabled={isSubmitting || isSuperAdmin}>
                {isSubmitting ? "Đang lưu..." : isEditing ? "Cập nhật" : "Tạo mới"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

