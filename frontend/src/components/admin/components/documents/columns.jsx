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
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("title")}</span>
    ),
  },
  {
    // Giả định BE JOIN và trả về { ..., category: { name: '...' } }
    accessorKey: "category.name",
    header: "Danh mục",
    cell: ({ row }) => {
      const categoryName = row.original.category?.name;
      return categoryName || <span className="italic text-gray-400">N/A</span>;
    },
  },
  {
    accessorKey: "access_level",
    header: "Quyền truy cập",
    cell: ({ row }) => {
      const level = row.getValue("access_level");
      if (level === "public")
        return <Badge variant="secondary">Công khai</Badge>;
      if (level === "member_only")
        return <Badge variant="outline">Thành viên</Badge>;
      if (level === "restricted")
        return <Badge variant="default">Hạn chế</Badge>;
      return <span className="italic text-gray-400">{level}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return status === 1 ? (
        <Badge className="bg-green-500">Xuất bản</Badge>
      ) : (
        <Badge variant="destructive">Bản nháp</Badge>
      );
    },
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
