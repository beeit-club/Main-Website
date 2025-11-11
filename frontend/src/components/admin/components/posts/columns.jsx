// src/components/columns.jsx
import React from "react";
import { RowActions } from "./RowActions";
import { Checkbox } from "@/components/ui/checkbox";

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(val) => table.toggleAllPageRowsSelected(!!val)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(val) => row.toggleSelected(!!val)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "category_name",
    header: "Danh mục",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "author_name",
    header: "Người đăng",
    cell: ({ row }) => {
      const username = row.getValue("author_name");
      if (!username)
        return <span className="text-gray-400 italic">Chưa xác định</span>;
      return username;
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status");

      return (
        <span
          className={`px-2 py-1 text-xs rounded-full ${status == 1
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
            }`}
        >
          {status == 1 ? "Hoạt động" : "Nháp"}
        </span>
      );
    },
  },
  // 6. Cột Hành động (Sẽ nhận viewMode từ page.jsx)
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      // Lấy viewMode từ meta của table (sẽ được truyền từ page.jsx)
      const viewMode = table.options.meta?.viewMode;
      return <RowActions row={row} viewMode={viewMode} />;
    },
    enableSorting: false,
    enableHiding: false,
  },
];
