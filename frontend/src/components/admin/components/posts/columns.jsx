// src/components/columns.jsx
import React from "react";
import { ColumnDef } from "@tanstack/react-table"; // không bắt buộc, ok nếu còn
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
      if (!status)
        return <span className="text-gray-400 italic">Chưa xác định</span>;
      return (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            status == 1
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status == 1 ? "Hoạt động" : "Ngừng"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActions row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
];
