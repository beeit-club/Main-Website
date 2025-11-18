// src/components/admin/components/categories/columns.jsx
import React from "react";
import { RowActions } from "./RowActions"; // <-- Trỏ tới RowActions của categories
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/datetime";

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(val) => table.toggleAllPageRowsSelected(!!val)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(val) => row.toggleSelected(!!val)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Tên Danh mục",
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: (info) => <span className="italic">{info.getValue()}</span>,
  },
  {
    // Giả sử API trả về { ..., parent: { id: 1, name: "Cha" } }
    accessorKey: "parent.name",
    header: "Danh mục cha",
    cell: ({ row }) => {
      const parentName = row.original.parent?.name;
      if (!parentName)
        return <span className="text-gray-400 italic">— Không có —</span>;
      return parentName;
    },
  },
  {
    accessorKey: "created_at",
    header: "Ngày tạo",
    cell: ({ row }) => {
      const date = row.getValue("created_at");
      return <span>{date ? formatDate(date) : "N/A"}</span>;
    },
  },
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
