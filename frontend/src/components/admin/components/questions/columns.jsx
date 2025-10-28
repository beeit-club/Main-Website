// src/components/admin/components/questions/columns.jsx
import React from "react";
import { RowActions } from "./RowActions";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/datetime";
import { Badge } from "@/components/ui/badge";

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
    accessorKey: "title",
    header: "Tiêu đề",
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status");
      // status = 1 là đã đăng, 0 là ẩn
      if (status === 1) {
        return <Badge variant="default">Đã đăng</Badge>;
      }
      return <Badge variant="secondary">Đã ẩn</Badge>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Ngày tạo",
    cell: ({ row }) => {
      const date = row.getValue("created_at");
      const isNew = new Date() - new Date(date) < 24 * 60 * 60 * 1000; // Mới trong 24h
      return (
        <div className="flex items-center gap-2">
          <span>{date ? formatDate(date) : "N/A"}</span>
          {isNew && <Badge variant="outline">Mới</Badge>}
        </div>
      );
    },
  },
  {
    accessorKey: "view_count",
    header: "Lượt xem",
    cell: (info) => info.getValue(),
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => <RowActions row={row} />, // <-- Trỏ tới RowActions của questions
  },
];
