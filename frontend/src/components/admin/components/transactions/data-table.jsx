import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { DataTableToolbar } from "./DataTableToolbar"; // <-- Dùng bản server
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Loader2 } from "lucide-react";

export function DataTable({
  columns,
  data,
  isLoading,

  // States
  pagination,
  sorting,
  globalFilter,
  rowSelection, // Vẫn giữ lại để quản lý checkbox
  columnVisibility, // Vẫn giữ lại để quản lý ẩn/hiện cột

  // Setters
  onPaginationChange,
  onSortingChange,
  onGlobalFilterChange,
  onRowSelectionChange,
  onColumnVisibilityChange,

  // Manual flags
  manualPagination,
  manualSorting,
  manualFiltering,

  // Counts
  pageCount,

  // Filters
  customFilter,
}) {
  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      sorting,
      globalFilter,
      rowSelection: rowSelection || {},
      columnVisibility: columnVisibility || {},
    },

    // Setters
    onPaginationChange: onPaginationChange,
    onSortingChange: onSortingChange,
    onGlobalFilterChange: onGlobalFilterChange,
    onRowSelectionChange: onRowSelectionChange,
    onColumnVisibilityChange: onColumnVisibilityChange,

    // Manual flags (quan trọng)
    manualPagination: manualPagination,
    manualSorting: manualSorting,
    manualFiltering: manualFiltering,

    // Models
    getCoreRowModel: getCoreRowModel(),

    // Counts
    pageCount: pageCount, // Số trang từ BE

    // Tắt các model client-side
    getFilteredRowModel: undefined,
    getSortedRowModel: undefined,
    getPaginationRowModel: undefined,
  });

  const pageIndex = table.getState().pagination.pageIndex;

  return (
    <div>
      {/* Truyền state và filter xuống Toolbar */}
      <DataTableToolbar
        table={table}
        globalFilter={globalFilter}
        onGlobalFilterChange={onGlobalFilterChange}
        customFilter={customFilter}
      />

      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortState = header.column.getIsSorted(); // 'asc' | 'desc' | false
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
                            className={`h-4 w-4 ${
                              sortState
                                ? sortState === "asc"
                                  ? "rotate-180"
                                  : ""
                                : "opacity-40"
                            }`}
                          />
                        ) : null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="p-4 text-center">
                  <Loader2 className="h-6 w-6 animate-spin inline-block" />
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-4 text-center">
                  No results.
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

      {/* Pagination (Sử dụng logic từ file gốc của bạn) */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </Button>

          {/* page numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: pageCount }).map((_, i) => {
              // only render a window around current page to avoid huge list
              if (pageCount > 7) {
                const start = Math.max(0, pageIndex - 3);
                const end = Math.min(pageCount, pageIndex + 4);
                if (i < start || i >= end) return null;
              }
              return (
                <Button
                  key={i}
                  variant={i === pageIndex ? "default" : "ghost"}
                  size="sm"
                  onClick={() => table.setPageIndex(i)}
                >
                  {i + 1}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          Trang <strong>{table.getState().pagination.pageIndex + 1}</strong> /{" "}
          <strong>{pageCount}</strong>
        </div>
      </div>
    </div>
  );
}
