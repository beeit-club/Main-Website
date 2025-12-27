"use client";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { columns } from "@/components/admin/components/members/columns";
import { DataTable } from "@/components/admin/components/members/data-table";
import { MemberDialog } from "@/components/admin/components/members/MemberDialog";
import { usersServices } from "@/services/admin/users";
import { toast } from "sonner";
import { PaginationControls } from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ListMembers() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState(true);

  // State của TanStack Table
  const [meta, setMeta] = useState({ totalPages: 0, total: 0 });

  // State Phân trang (Đọc 'page' và 'limit' từ URL)
  const [pagination, setPagination] = useState({
    pageIndex: searchParams.get("page")
      ? parseInt(searchParams.get("page")) - 1 // API tính page 1, TanStack tính page 0
      : 0,
    pageSize: searchParams.get("limit")
      ? parseInt(searchParams.get("limit"))
      : 10,
  });

  // State Sắp xếp (Đọc 'sort' và 'order' từ URL)
  const [sorting, setSorting] = useState(() => {
    const sort = searchParams.get("sort");
    const order = searchParams.get("order");
    if (sort && order) {
      // Chuyển đổi thành định dạng của TanStack Table
      return [{ id: sort, desc: order === "desc" }];
    }
    return []; // Mảng rỗng nếu không có sắp xếp
  });

  // State Tìm kiếm toàn cục (Đọc 'search' từ URL)
  const [globalFilter, setGlobalFilter] = useState(
    searchParams.get("search") || ""
  );

  // State Lọc theo cột (Đọc tất cả các param "lạ" từ URL)
  const [columnFilters, setColumnFilters] = useState(() => {
    const filters = [];
    // Lặp qua tất cả các key-value trên URL
    for (const [key, value] of searchParams.entries()) {
      // Nếu key không phải là các key "đặc biệt" mà chúng ta đã xử lý
      // (như page, limit, search...) thì nó chính là một bộ lọc cột.
      if (
        !["page", "limit", "search", "sort", "order"].includes(key)
      ) {
        filters.push({ id: key, value: value });
      }
    }
    return filters;
  });

  // State chứa dữ liệu trả về từ API
  const [data, setData] = useState([]);

  // State cho dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Ref để track params đã gọi API lần cuối, tránh gọi API trùng lặp
  const lastApiParamsRef = useRef("");
  // Ref để track URL params đã được update, tránh update URL không cần thiết
  const lastUrlParamsRef = useRef("");

  // Bất cứ khi nào 1 state (pagination, sorting,...) thay đổi,
  // effect này sẽ chạy lại để:
  // 1. Xây dựng URLSearchParams mới
  // 2. Cập nhật URL trình duyệt
  // 3. Gọi API với các params đó
  useEffect(() => {
    async function fetchData() {
      // Tạo một đối tượng URLSearchParams mới dựa trên state của React
      const params = new URLSearchParams();

      // 1. State Phân trang
      params.set("page", (pagination.pageIndex + 1).toString());
      params.set("limit", pagination.pageSize.toString());

      // 2. State Tìm kiếm
      if (globalFilter) {
        params.set("search", globalFilter);
      }

      // 3. State Sắp xếp
      if (sorting.length > 0) {
        params.set("sort", sorting[0].id);
        params.set("order", sorting[0].desc ? "desc" : "asc");
      }

      // 4. State Bộ lọc cột
      columnFilters.forEach((filter) => {
        if (filter.value) {
          params.set(filter.id, filter.value);
        }
      });

      const paramsString = params.toString();
      const currentParamsString = searchParams.toString();

      // ---. CẬP NHẬT URL (Đồng bộ state lên URL) ---
      // Chỉ cập nhật URL nếu params mới khác params hiện tại VÀ khác params đã update lần cuối
      // Điều này tránh vòng lặp re-render khi searchParams thay đổi
      if (paramsString !== currentParamsString && paramsString !== lastUrlParamsRef.current) {
        lastUrlParamsRef.current = paramsString;
        router.replace(`${pathname}?${paramsString}`, {
          scroll: false,
        });
      }

      // ---  GỌI API (Sử dụng params đã tạo) ---
      // Chỉ gọi API nếu params thực sự thay đổi (so với lần gọi API trước)
      // Điều này tránh gọi API trùng lặp khi component re-render
      if (paramsString !== lastApiParamsRef.current) {
        lastApiParamsRef.current = paramsString;
        setIsLoading(true);
        try {
          // Gọi API với đối tượng 'params' đã được xây dựng ở trên
          const res = await usersServices.getAllMembers(params);
          setData(res?.data.data || []);

          setMeta({
            totalPages: res?.data.pagination?.totalPages || 0,
            total: res?.data.pagination?.total || 0,
          });
        } catch (error) {
          toast.error("Lấy danh sách thành viên thất bại");
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchData();
  }, [
    // Bất cứ khi nào các state này thay đổi, 'useEffect' sẽ chạy lại
    pagination.pageIndex,
    pagination.pageSize,
    globalFilter,
    sorting,
    columnFilters,
    pathname,
    router,
    // ĐÃ LOẠI BỎ searchParams để tránh vòng lặp re-render
  ]);

  // Handlers cho edit và delete
  const handleEdit = (member) => {
    setSelectedMember(member);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedMember(null);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedMember(null);
  };

  const handleSave = () => {
    // Reload data
    const params = new URLSearchParams();
    params.set("page", (pagination.pageIndex + 1).toString());
    params.set("limit", pagination.pageSize.toString());
    if (globalFilter) params.set("search", globalFilter);
    if (sorting.length > 0) {
      params.set("sort", sorting[0].id);
      params.set("order", sorting[0].desc ? "desc" : "asc");
    }
    lastApiParamsRef.current = "";
    window.location.reload();
  };

  // === RENDER ===
  // Các component con (DataTable, PaginationControls) không cần biết gì về URL.
  // Chúng chỉ nhận props (state) và gọi các hàm setter (setSorting, setPagination...)
  // Component cha (ListMembers) sẽ xử lý tất cả logic đồng bộ state và URL.
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Danh sách Thành viên</h1>
          <p className="text-muted-foreground">
            Quản lý danh sách các thành viên trong câu lạc bộ
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm thành viên
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        meta={{
          onEdit: handleEdit,
          onDelete: () => {},
        }}
        // Props (State)
        sorting={sorting}
        globalFilter={globalFilter}
        columnFilters={columnFilters}
        // Setters (Hàm để thay đổi state)
        setSorting={setSorting}
        setGlobalFilter={setGlobalFilter}
        setColumnFilters={setColumnFilters}
      />

      <PaginationControls
        pagination={pagination}
        meta={meta}
        setPagination={setPagination}
      />

      {/* Dialog Add/Edit Member */}
      <MemberDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        member={selectedMember}
        onSave={handleSave}
      />
    </div>
  );
}

