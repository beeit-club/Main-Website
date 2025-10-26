// Giả sử file này ở: src/components/admin/components/tags/columns.jsx

import React from "react";
import { RowActions } from "./RowActions"; // <-- Sẽ trỏ tới file RowActions cho Tags
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/datetime"; // <-- Giả sử bạn có hàm này

export const columns = [
  // 1. Cột chọn (Giữ nguyên)
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

  // 2. Cột Tên Tag
  {
    accessorKey: "name",
    header: "Tên Tag",
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  },

  // 3. Cột Slug
  {
    accessorKey: "slug",
    header: "Slug",
    cell: (info) => <span className="italic">{info.getValue()}</span>,
  },

  // 4. Cột Người tạo (Giả định API trả về 'created_by_name')
  {
    accessorKey: "created_by_name",
    header: "Người tạo",
    cell: ({ row }) => {
      const username = row.getValue("created_by_name");
      if (!username)
        return <span className="text-gray-400 italic">Chưa xác định</span>;
      return username;
    },
  },

  // 5. Cột Ngày tạo
  {
    accessorKey: "created_at",
    header: "Ngày tạo",
    cell: ({ row }) => {
      const date = row.getValue("created_at");
      return <span>{date ? formatDate(date) : "N/A"}</span>;
    },
  },

  // 6. Cột Hành động (Giữ nguyên)
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActions row={row} />, // <-- Sử dụng RowActions của Tags
    enableSorting: false,
    enableHiding: false,
  },
];
