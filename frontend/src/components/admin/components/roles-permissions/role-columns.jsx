import React from "react";
import { RowActions } from "./RoleRowActions";
import { Checkbox } from "@/components/ui/checkbox";
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
    header: "Tên Vai trò",
    cell: ({ row }) => {
      const name = row.getValue("name");
      return <span className="font-medium">{name}</span>;
    },
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => {
      const desc = row.getValue("description");
      return <span className="text-sm text-muted-foreground">{desc || "—"}</span>;
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
    header: "Hành động",
    cell: ({ row, table }) => {
      const onEdit = table.options.meta?.onEdit;
      const onDelete = table.options.meta?.onDelete;
      return (
        <RowActions
          row={row}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];

