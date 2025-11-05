import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { transactionServices } from "@/services/admin/transactionServices";
import { toast } from "sonner";
import { formatDate } from "@/lib/datetime";
import { formatCurrency } from "@/lib/utils";
import {
  MoreHorizontal,
  CalendarDays,
  Pencil,
  Eye,
  Hash,
  User,
  FileText,
  DollarSign,
  Type,
} from "lucide-react";
import { transactionSchema } from "@/validation/transactionSchema";

export function RowActions({ row }) {
  // Bỏ state cho Delete
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [transactionDataForView, setTransactionDataForView] = useState(null);

  const transactionId = row.original.id;

  // --- Cấu hình React Hook Form cho Edit ---
  const form = useForm({
    resolver: yupResolver(transactionSchema),
  });
  const { isSubmitting: isEditSubmitting } = form.formState;

  // --- Xử lý XEM CHI TIẾT ---
  async function onViewClick() {
    if (
      !transactionDataForView ||
      transactionDataForView.id !== transactionId
    ) {
      try {
        const res = await transactionServices.getOneTransaction(transactionId);
        if (res?.data.status == "success") {
          setTransactionDataForView(res?.data.data.transaction);
          setOpenView(true);
        } else {
          toast.error("Lấy chi tiết giao dịch thất bại");
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi lấy dữ liệu.");
      }
    } else {
      setOpenView(true);
    }
  }

  // --- Xử lý SỬA ---
  // 1. Mở dialog và fetch data
  async function onEditClick() {
    try {
      const res = await transactionServices.getOneTransaction(transactionId);
      if (res?.data.status == "success") {
        const transaction = res?.data.data.transaction;
        form.reset({
          amount: transaction.amount,
          type: String(transaction.type), // Chuyển sang string cho Select
          description: transaction.description,
          attachment_url: transaction.attachment_url || "", // Tải URL cũ
        });
        setOpenEdit(true);
      } else {
        toast.error("Lấy chi tiết giao dịch thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lấy dữ liệu.");
    }
  }

  // 2. Submit form Sửa
  async function onConfirmEdit(formData) {
    try {
      const res = await transactionServices.updateTransaction(
        transactionId,
        formData
      );
      if (res.status === "success") {
        toast.success("Cập nhật giao dịch thành công!");
        setOpenEdit(false);
        window.location.reload(); // Hoặc gọi hàm refetch từ page.jsx
      } else {
        toast.error(res.message || "Cập nhật thất bại.");
      }
    } catch (error) {
      // Xử lý lỗi 400 (lỗi nghiệp vụ) từ BE
      if (error.statusCode === 400) {
        toast.error(error.message); // Hiển thị lỗi "Không đủ số dư..."
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật.");
      }
    }
  }

  // 3. Đóng dialog Sửa
  function handleCloseEditDialog() {
    setOpenEdit(false);
    form.reset();
  }

  // Hàm helper
  const renderUser = (userName) => {
    if (userName) return userName;
    return <span className="italic">Chưa xác định</span>;
  };

  return (
    <>
      {/* --- Nút bấm trigger --- */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEditClick}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onViewClick}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
          {/* Không có nút Delete vì BE không cung cấp API */}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* --- 1. Dialog Xóa (Đã bị loại bỏ) --- */}

      {/* --- 2. Dialog Xem Chi Tiết --- */}
      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Chi tiết Giao dịch</DialogTitle>
            <DialogDescription>
              ID: {transactionDataForView?.id}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Số tiền */}
              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4" />
                  Số tiền
                </Label>
                <p
                  className={`text-xl font-bold ${
                    transactionDataForView?.type == 1
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transactionDataForView?.type == 1 ? "+" : "-"}
                  {formatCurrency(transactionDataForView?.amount || 0)}
                </p>
              </div>
              {/* Loại giao dịch */}
              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Type className="h-4 w-4" />
                  Loại giao dịch
                </Label>
                <p className="text-base font-medium">
                  {transactionDataForView?.type == 1
                    ? "Khoản Thu"
                    : "Khoản Chi"}
                </p>
              </div>
            </div>

            {/* Nội dung */}
            <div>
              <Label className="text-sm text-muted-foreground flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                Nội dung
              </Label>
              <p className="text-base whitespace-pre-wrap">
                {transactionDataForView?.description || "— Không có —"}
              </p>
            </div>

            {/* File đính kèm (dạng link) */}
            <div>
              <Label className="text-sm text-muted-foreground flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                Tệp đính kèm
              </Label>
              {transactionDataForView?.attachment_url ? (
                <a
                  href={transactionDataForView.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {transactionDataForView.attachment_url}
                </a>
              ) : (
                <p className="text-base italic">— Không có —</p>
              )}
            </div>

            {/* Thông tin ngày tháng và người dùng */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  Ngày tạo
                </Label>
                <p className="text-base">
                  {transactionDataForView?.created_at
                    ? formatDate(transactionDataForView.created_at)
                    : "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  Người tạo
                </Label>
                <p className="text-base">
                  {/* Cập nhật theo BE model */}
                  {renderUser(transactionDataForView?.created_by_name)}
                </p>
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

      {/* --- 3. Dialog Sửa --- */}
      <Dialog open={openEdit} onOpenChange={handleCloseEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Giao dịch</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onConfirmEdit)}
              className="space-y-4"
            >
              {/* Grid 2 cột cho Số tiền và Loại */}
              <div className="grid grid-cols-2 gap-4">
                {/* Số tiền */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số tiền (VND)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          disabled={isEditSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Loại giao dịch */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại giao dịch</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={String(field.value || "")}
                        disabled={isEditSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="— Chọn loại —" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Khoản Thu</SelectItem>
                          <SelectItem value="2">Khoản Chi</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Nội dung */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nội dung</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        {...field}
                        disabled={isEditSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tệp đính kèm (Input string) */}
              <FormField
                control={form.control}
                name="attachment_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Tệp đính kèm (Tùy chọn)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://..."
                        {...field}
                        disabled={isEditSubmitting}
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
                  onClick={handleCloseEditDialog}
                  disabled={isEditSubmitting}
                >
                  Huỷ
                </Button>
                <Button type="submit" disabled={isEditSubmitting}>
                  {isEditSubmitting ? "Đang cập nhật..." : "Cập nhật"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
