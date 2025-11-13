import React from "react";
import { RowActions } from "./RowActions";
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
  },
  {
    accessorKey: "name",
    header: "Tên Danh mục",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => <span className="italic">{row.getValue("slug")}</span>,
  },
  {
    // Dùng key 'parent_name' đã được map ở page.jsx
    accessorKey: "parent_name",
    header: "Danh mục cha",
    cell: ({ row }) => <span>{row.getValue("parent_name")}</span>,
  },
  {
    accessorKey: "created_at",
    header: "Ngày tạo",
    cell: ({ row }) => <span>{formatDate(row.getValue("created_at"))}</span>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActions row={row} />,
  },
];
