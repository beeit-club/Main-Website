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
import { permissionsServices } from "@/services/admin/permissions";
import { toast } from "sonner";

const permissionSchema = yup.object({
  name: yup
    .string()
    .required("Tên quyền là bắt buộc")
    .min(2, "Tên quyền phải có ít nhất 2 ký tự")
    .max(100, "Tên quyền tối đa 100 ký tự"),
  description: yup
    .string()
    .required("Mô tả là bắt buộc")
    .min(5, "Mô tả phải có ít nhất 5 ký tự")
    .max(500, "Mô tả tối đa 500 ký tự"),
  module: yup
    .string()
    .nullable()
    .max(50, "Module tối đa 50 ký tự"),
});

export function PermissionDialog({ open, onOpenChange, permission, onSave }) {
  const isEditing = !!permission;

  const form = useForm({
    resolver: yupResolver(permissionSchema),
    defaultValues: {
      name: "",
      description: "",
      module: "",
    },
  });

  useEffect(() => {
    if (permission) {
      form.reset({
        name: permission.name || "",
        description: permission.description || "",
        module: permission.module || "",
      });
    } else {
      form.reset({
        name: "",
        description: "",
        module: "",
      });
    }
  }, [permission, open]);

  const { isSubmitting } = form.formState;

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        const res = await permissionsServices.updatePermission(
          permission.id,
          data
        );
        if (res.status === "success") {
          toast.success("Cập nhật quyền thành công");
          onSave();
        } else {
          toast.error(res.message || "Cập nhật quyền thất bại");
        }
      } else {
        const res = await permissionsServices.createPermission(data);
        if (res.status === "success") {
          toast.success("Tạo quyền thành công");
          onSave();
        } else {
          toast.error(res.message || "Tạo quyền thất bại");
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
            {isEditing ? "Chỉnh sửa Quyền" : "Thêm Quyền Mới"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên Quyền</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: posts.create, users.edit..."
                      {...field}
                      disabled={isSubmitting}
                      className="font-mono"
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
                      placeholder="Mô tả về quyền này..."
                      {...field}
                      disabled={isSubmitting}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="module"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Module (Tùy chọn)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: user_management, content_management..."
                      {...field}
                      disabled={isSubmitting}
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang lưu..." : isEditing ? "Cập nhật" : "Tạo mới"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

