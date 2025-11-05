import React from "react";
import { DeletedRowActions } from "./DeletedRowActions";
import { formatDate } from "@/lib/datetime";

export const DeletedColumns = (refetchData) => [
  // Nhận hàm refetch
  {
    accessorKey: "title",
    header: "Tiêu đề",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("title")}</span>
    ),
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "deleted_at",
    header: "Ngày xóa",
    cell: ({ row }) => <span>{formatDate(row.getValue("deleted_at"))}</span>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <DeletedRowActions row={row} refetchData={refetchData} />
    ),
  },
];
