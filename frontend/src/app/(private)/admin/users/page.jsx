"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { columns } from "@/components/admin/components/users/columns";
import { DataTable } from "@/components/admin/components/users/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usersServices } from "@/services/admin/users";
import { toast } from "sonner";
import { PaginationControls } from "@/components/common/Pagination";

export default function ListUsers() {
  const [rolesList, setRolesList] = useState([]);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [viewMode, setViewMode] = useState(
    searchParams.get("status") || "active"
  );
  const [isLoading, setIsLoading] = useState(true);

  // 3. State của TanStack Table
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
      // (như page, limit, status...) thì nó chính là một bộ lọc cột.
      if (
        !["page", "limit", "search", "sort", "order", "status"].includes(key)
      ) {
        filters.push({ id: key, value: value });
      }
    }
    return filters;
  });

  // State chứa dữ liệu trả về từ API
  const [data, setData] = useState([]);

  // Hàm này không thay đổi
  async function getRolesForFilter() {
    try {
      const res = await usersServices.getAllRoles();
      setRolesList(res?.data.roles.data || []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách vai trò");
    }
  }

  // Bất cứ khi nào 1 state (pagination, sorting,...) thay đổi,
  // effect này sẽ chạy lại để:
  // 1. Xây dựng URLSearchParams mới
  // 2. Cập nhật URL trình duyệt
  // 3. Gọi API với các params đó
  useEffect(() => {
    if (rolesList.length === 0) {
      getRolesForFilter();
    }

    async function fetchData() {
      // Tạo một đối tượng URLSearchParams mới dựa trên state của React
      const params = new URLSearchParams();

      // 0. State Tab (quan trọng)
      params.set("status", viewMode);

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

      // ---. CẬP NHẬT URL (Đồng bộ state lên URL) ---
      // SỬA 3: Đây là phần GHI state vào URL
      // Chúng ta dùng router.replace để thay đổi URL mà không reload trang.
      // 'replace' sẽ thay thế lịch sử trình duyệt, 'push' sẽ tạo mới (người dùng
      // có thể nhấn back). 'replace' thường tốt hơn cho bộ lọc.
      // 'scroll: false' để ngăn trang cuộn lên đầu mỗi khi lọc.
      //
      // Chỉ cập nhật URL nếu params mới khác params cũ (để tránh chạy lại vô tận)
      if (params.toString() !== searchParams.toString()) {
        router.replace(`${pathname}?${params.toString()}`, {
          scroll: false,
        });
      }

      // ---  GỌI API (Sử dụng params đã tạo) ---
      setIsLoading(true);
      try {
        const service =
          viewMode === "active"
            ? usersServices.getAllUser
            : usersServices.getDeletedUsers;

        // Gọi API với đối tượng 'params' đã được xây dựng ở trên
        const res = await service(params);
        setData(res?.data.data || []);

        setMeta({
          totalPages: res?.data.pagination?.totalPages || 0,
          total: res?.data.pagination?.total || 0,
        });
      } catch (error) {
        toast.error(`Lấy danh sách users (${viewMode}) thất bại`);
      } finally {
        setIsLoading(false);
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
    viewMode,
    pathname,
    router,
    searchParams, // Quan trọng: để so sánh ở bước B
    rolesList.length, // Để trigger getRolesForFilter
  ]);

  // === HÀM XỬ LÝ & RENDER ===

  // Đổi tab (Active/Trash)
  const onTabChange = (newMode) => {
    // 1. Chỉ cần cập nhật state 'viewMode'
    setViewMode(newMode);
    // 2. Reset về trang 1 khi đổi tab
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    // 3. 'useEffect' ở trên sẽ tự động được kích hoạt
    //    và nó sẽ lo phần còn lại (cập nhật URL, gọi API)
  };

  // muons làm hiển thị đc 2 bảng thì cần truyefn thuộc tính viewMode để biết
  const memoizedColumns = useMemo(
    () =>
      columns.map((col) => ({
        ...col,
        meta: { ...col.meta, viewMode: viewMode },
      })),
    [viewMode]
  );

  // === RENDER ===
  // Các component con (DataTable, PaginationControls) không cần biết gì về URL.
  // Chúng chỉ nhận props (state) và gọi các hàm setter (setSorting, setPagination...)
  // Component cha (ListUsers) sẽ xử lý tất cả logic đồng bộ state và URL.
  return (
    <div className="space-y-4">
      <Tabs value={viewMode} onValueChange={onTabChange}>
        <TabsList>
          <TabsTrigger value="active">Đang hoạt động</TabsTrigger>
          <TabsTrigger value="trash">Thùng rác</TabsTrigger>
        </TabsList>

        {/* Nội dung Tab "Active" */}
        <TabsContent value="active">
          <DataTable
            columns={memoizedColumns}
            data={data}
            meta={{ viewMode: viewMode }}
            isLoading={isLoading}
            rolesList={rolesList}
            // Props (State)
            sorting={sorting}
            globalFilter={globalFilter}
            columnFilters={columnFilters}
            // Setters (Hàm để thay đổi state)
            // (Không truyền setPagination vì PaginationControls xử lý)
            setSorting={setSorting}
            setGlobalFilter={setGlobalFilter}
            setColumnFilters={setColumnFilters}
          />

          <PaginationControls
            pagination={pagination}
            meta={meta}
            setPagination={setPagination}
          />
        </TabsContent>

        {/* Nội dung Tab "Trash" */}
        <TabsContent value="trash">
          <DataTable
            columns={memoizedColumns}
            data={data}
            meta={{ viewMode: viewMode }}
            isLoading={isLoading}
            rolesList={rolesList}
            // Props
            sorting={sorting}
            globalFilter={globalFilter}
            columnFilters={columnFilters}
            // Setters
            setSorting={setSorting}
            setGlobalFilter={setGlobalFilter}
            setColumnFilters={setColumnFilters}
          />

          <PaginationControls
            pagination={pagination}
            meta={meta}
            setPagination={setPagination}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
