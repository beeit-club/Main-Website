"use client";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { columns } from "@/components/admin/components/transactions/columns";
import { transactionServices } from "@/services/admin/transactionServices";
import { transactionSchema } from "@/validation/transactionSchema";

import React, { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { useDebounce, useDebouncedSearch } from "@/hooks/useDebounce"; // <-- Bạn cần hook này
import { DataTable } from "@/components/admin/components/transactions/data-table";

// Component hiển thị số dư
function BalanceDisplay({ balanceData }) {
  if (!balanceData) return null;
  const { total_income, total_expense, balance } = balanceData;

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      {/* Thu */}
      <div className="border rounded-lg p-4 flex items-center gap-4">
        <div className="p-3 rounded-full bg-green-100 text-green-600">
          <TrendingUp className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Tổng Thu</p>
          <p className="text-2xl font-bold">{formatCurrency(total_income)}</p>
        </div>
      </div>
      {/* Chi */}
      <div className="border rounded-lg p-4 flex items-center gap-4">
        <div className="p-3 rounded-full bg-red-100 text-red-600">
          <TrendingDown className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Tổng Chi</p>
          <p className="text-2xl font-bold">{formatCurrency(total_expense)}</p>
        </div>
      </div>
      {/* Số dư */}
      <div className="border rounded-lg p-4 flex items-center gap-4 bg-primary text-primary-foreground">
        <div className="p-3 rounded-full bg-primary-foreground/20 text-primary-foreground">
          <Wallet className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-primary-foreground/80">Số Dư Hiện Tại</p>
          <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
        </div>
      </div>
    </div>
  );
}

// === COMPONENT CHÍNH ===
export default function ListTransactions() {
  // Data state
  const [data, setData] = useState([]);
  const [balanceData, setBalanceData] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Server-side state
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [pageCount, setPageCount] = useState(0); // Tổng số trang
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState(""); // State cho lọc Thu/Chi

  // Debounce search input
  const debouncedSearch = useDebounce(globalFilter, 500);

  // Tải dữ liệu cho Bảng (dựa trên state)
  async function loadData() {
    setIsLoading(true);
    try {
      const options = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearch,
        type:
          typeFilter === "all" || typeFilter === "" ? undefined : typeFilter,
        sortBy: sorting[0]?.id,
        sortDirection: sorting[0]?.desc ? "DESC" : "ASC",
      };

      const listRes = await transactionServices.getAllTransactions(options);
      if (listRes?.data.data) {
        setData(listRes.data.data.data || []);
        setPageCount(listRes.data.data.pagination.totalPages || 0);
      } else {
        setData([]);
        setPageCount(0);
      }
    } catch (error) {
      toast.error("Tải danh sách giao dịch thất bại: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  // Tải số dư (chỉ 1 lần hoặc khi cần)
  async function loadBalance() {
    try {
      const balanceRes = await transactionServices.getBalance();
      if (balanceRes?.data.data) {
        setBalanceData(balanceRes.data.data);
      }
    } catch (error) {
      toast.error("Tải số dư thất bại: " + error.message);
    }
  }

  // Tải lại data khi state server-side thay đổi
  useEffect(() => {
    loadData();
  }, [pagination, sorting, debouncedSearch, typeFilter]);

  // Tải số dư khi mount
  useEffect(() => {
    loadBalance();
  }, []);

  // --- Cấu hình React Hook Form ---
  const form = useForm({
    resolver: yupResolver(transactionSchema),
    defaultValues: {
      amount: "",
      type: "2", // Mặc định là "Chi"
      description: "",
      attachment_url: "",
    },
  });
  const { isSubmitting } = form.formState;

  // --- Xử lý Submit Form Thêm ---
  async function onSubmit(formData) {
    try {
      const res = await transactionServices.createTransaction(formData);
      if (res.status === "success") {
        toast.success("Thêm giao dịch mới thành công!");
        setOpenAdd(false);
        form.reset();
        loadData(); // Tải lại trang hiện tại
        loadBalance(); // Tải lại số dư
      } else {
        toast.error(res.message || "Thêm giao dịch thất bại.");
      }
    } catch (error) {
      // Xử lý lỗi 400 (lỗi nghiệp vụ) từ BE
      if (error.statusCode === 400) {
        toast.error(error.message); // Hiển thị lỗi "Không đủ số dư..."
      } else {
        toast.error("Có lỗi xảy ra khi thêm giao dịch.");
      }
    }
  }

  function handleCloseDialog() {
    setOpenAdd(false);
    form.reset();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý Tài chính</h1>
        <Button onClick={() => setOpenAdd(true)}>Thêm Giao dịch</Button>
      </div>

      {/* Hiển thị số dư */}
      <BalanceDisplay balanceData={balanceData} />

      {/* Bảng dữ liệu (đã được cấu hình cho server-side) */}
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        // State
        pagination={pagination}
        sorting={sorting}
        globalFilter={globalFilter}
        // Setters
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        onGlobalFilterChange={setGlobalFilter}
        // Manual flags
        manualPagination={true}
        manualSorting={true}
        manualFiltering={true}
        // Counts
        pageCount={pageCount}
        // Filter tùy chỉnh
        customFilter={
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lọc theo loại..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="1">Khoản Thu</SelectItem>
              <SelectItem value="2">Khoản Chi</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {/* --- Dialog Thêm Giao dịch --- */}
      <Dialog open={openAdd} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thêm Giao dịch Mới</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Grid 2 cột cho Số tiền và Loại */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số tiền (VND)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="VD: 50000"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại giao dịch</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={String(field.value || "2")}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
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
                        placeholder="VD: Mua văn phòng phẩm..."
                        {...field}
                        disabled={isSubmitting}
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
                        placeholder="https://example.com/hoa-don.pdf"
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
                  onClick={handleCloseDialog}
                  disabled={isSubmitting}
                >
                  Huỷ
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang lưu..." : "Lưu"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
