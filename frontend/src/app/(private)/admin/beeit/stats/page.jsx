"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { beeitServices } from "@/services/admin/beeitServices";
import { revalidateBeeit } from "@/utils/revalidateCache";
import { Edit2, Plus, Trash2, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const statSchema = yup.object({
  stat_key: yup.string().required("Bắt buộc").max(50),
  label: yup.string().required("Bắt buộc").max(100),
  value: yup.number().required("Bắt buộc").min(0).integer(),
  suffix: yup.string().max(10).default(""),
  display_order: yup.number().min(0).default(0),
});

export default function StatsPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStat, setEditingStat] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const form = useForm({
    resolver: yupResolver(statSchema),
    defaultValues: {
      stat_key: "",
      label: "",
      value: 0,
      suffix: "",
      display_order: 0,
    },
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await beeitServices.stats.getAll();
      setStats(res?.data?.data?.data || []);
    } catch (error) {
      toast.error("Không thể tải danh sách Stats");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (stat = null) => {
    setEditingStat(stat);
    if (stat) {
      form.reset(stat);
    } else {
      form.reset({
        stat_key: "",
        label: "",
        value: 0,
        suffix: "",
        display_order: stats.length,
      });
    }
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingStat(null);
    form.reset();
  };

  const onSubmit = async (data) => {
    try {
      if (editingStat) {
        await beeitServices.stats.update(editingStat.id, data);
        toast.success("Cập nhật Stat thành công!");
      } else {
        await beeitServices.stats.create(data);
        toast.success("Tạo Stat thành công!");
      }
      
      // Revalidate cache để cập nhật ngay lập tức
      await revalidateBeeit();
      
      closeDialog();
      await loadStats();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Thao tác thất bại");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa Stat này?")) return;

    try {
      setDeletingId(id);
      await beeitServices.stats.delete(id);
      
      // Revalidate cache để cập nhật ngay lập tức
      await revalidateBeeit();
      
      toast.success("Xóa Stat thành công!");
      await loadStats();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Xóa thất bại");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  const quickUpdate = async (id, field, value) => {
    try {
      await beeitServices.stats.update(id, { [field]: value });
      
      // Revalidate cache để cập nhật ngay lập tức
      await revalidateBeeit();
      
      toast.success("Cập nhật thành công!");
      await loadStats();
    } catch (error) {
      toast.error("Cập nhật thất bại");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Statistics</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý các thống kê hiển thị trên trang BeeIT
          </p>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm Stat
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{stat.label}</CardTitle>
                  <CardDescription className="mt-1">
                    Key: {stat.stat_key}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDialog(stat)}
                    className="h-8 w-8"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(stat.id)}
                    disabled={deletingId === stat.id}
                    className="h-8 w-8 text-destructive"
                  >
                    {deletingId === stat.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-4xl font-bold text-primary">
                    {stat.value}
                    <span className="text-2xl ml-1">{stat.suffix}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={stat.value}
                    onChange={(e) => quickUpdate(stat.id, "value", parseInt(e.target.value) || 0)}
                    className="h-8 text-sm"
                    min="0"
                  />
                  <Input
                    type="text"
                    value={stat.suffix}
                    onChange={(e) => quickUpdate(stat.id, "suffix", e.target.value)}
                    className="h-8 text-sm w-20"
                    placeholder="+"
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  Thứ tự: {stat.display_order}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {stats.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            Chưa có Stat nào. Hãy thêm Stat đầu tiên!
          </CardContent>
        </Card>
      )}

      {/* Dialog Form */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingStat ? "Chỉnh sửa Stat" : "Thêm Stat mới"}
            </DialogTitle>
            <DialogDescription>
              {editingStat
                ? "Cập nhật thông tin Stat"
                : "Tạo một Stat mới để hiển thị trên trang"}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="stat_key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stat Key *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="members, events, projects..."
                        disabled={!!editingStat}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label *</FormLabel>
                    <FormControl>
                      <Input placeholder="THÀNH VIÊN" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá trị *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="suffix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suffix</FormLabel>
                      <FormControl>
                        <Input placeholder="+, K, M..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="display_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thứ tự hiển thị</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Hủy
                </Button>
                <Button type="submit">
                  {editingStat ? "Cập nhật" : "Tạo mới"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

