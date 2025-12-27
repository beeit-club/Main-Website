import React from "react";
// Removed: Không cần RowActions vì đã bỏ cột Actions
// import { RowActions } from "./PermissionRowActions";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/datetime";

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
    accessorKey: "name",
    header: "Tên Quyền",
    cell: ({ row }) => (
      <span className="font-medium font-mono text-sm">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => {
      const desc = row.getValue("description");
      return <span className="text-sm">{desc || "—"}</span>;
    },
  },
  {
    accessorKey: "module",
    header: "Module",
    cell: ({ row }) => {
      const module = row.getValue("module");
      return module ? (
        <Badge variant="secondary">{module}</Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
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
  // Removed: Cột Actions đã được bỏ vì permissions chỉ xem
];

