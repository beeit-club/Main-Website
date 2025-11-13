// src/components/DataTable.jsx
import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { DataTableToolbar } from "./DataTableToolbar";
import { ChevronsUpDown } from "lucide-react";

// manualSorting; tìm hiều cái này khi thêm vào vs giá trị true thì nó sẽ làm gì

// Props đã bị BỎ: pagination, setPagination
export function DataTable({
  columns,
  data,
  meta, // (meta này chứa viewMode cho cột Actions)
  isLoading,
  rolesList,
  // State
  sorting,
  globalFilter,
  columnFilters,
  // Setters
  setSorting,
  setGlobalFilter,
  setColumnFilters,
}) {
  // State local cho UI, không ảnh hưởng BE
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Cấu hình table (ĐÃ BỎ pagination)
  const table = useReactTable({
    data,
    columns,
    meta: meta, // Truyền viewMode vào cột Actions

    // Bật chế độ manual cho 2 cái còn lại
    manualSorting: true,
    manualFiltering: true,

    // BỎ: manualPagination, pageCount

    // Kết nối state (đã bỏ pagination)
    state: {
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility,
      rowSelection,
    },

    // Kết nối setters (đã bỏ onPaginationChange)
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      {/* Toolbar (Lọc) vẫn giữ nguyên */}
      <DataTableToolbar table={table} rolesList={rolesList} />

      {/* Bảng <table> */}
      <div className="rounded-md border">
        <table className="w-full">
          {/* <thead> (Phần header sắp xếp giữ nguyên) */}
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortState = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      className="text-left p-2 cursor-pointer select-none"
                      onClick={
                        canSort
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                    >
                      <div className="flex items-center gap-2">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {canSort ? (
                          <ChevronsUpDown
                            className={`h-4 w-4 transition-opacity ${
                              sortState ? "opacity-100" : "opacity-30"
                            } ${sortState === "desc" ? "rotate-180" : ""}`}
                          />
                        ) : null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          {/* <tbody> (Phần loading / no results giữ nguyên) */}
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center">
                  Đang tải...
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center">
                  Không tìm thấy kết quả.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* === PHẦN PHÂN TRANG ĐÃ BỊ XÓA HOÀN TOÀN === */}
    </div>
  );
}
