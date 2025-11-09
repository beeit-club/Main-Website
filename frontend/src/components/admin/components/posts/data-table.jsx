// src/components/DataTable.jsx
import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { DataTableToolbar } from "./DataTableToolbar";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { PaginationControls } from "@/components/common/Pagination";
import { useSearchParams } from "next/navigation";

export function DataTable({ columns, data, globalFilter, setGlobalFilter, columnFilters, setColumnFilters, categoryList }) {
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const searchParams = useSearchParams(); // Hook để ĐỌC các param từ URL
  // State Phân trang (Đọc 'page' và 'limit' từ URL)

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, columnVisibility, rowSelection, columnFilters },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    // getFilteredRowModel: getFilteredRowModel(),// dòng này làm filter fe ghi đè be
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // initial pagination
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  });
  const pageCount = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex;
  return (
    <div>
      <DataTableToolbar table={table} categoryList={categoryList} />
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
                            className={`h-4 w-4 ${sortState
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
            {table.getRowModel().rows.length === 0 ? (
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
    </div>
  );
}
