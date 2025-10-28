// src/components/admin/components/applications/columns.jsx
import React from "react";
import { RowActions } from "./RowActions";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/datetime";

// Helper render Status
const renderStatus = (status) => {
  switch (Number(status)) {
    case 0:
      return <Badge variant="secondary">Chờ xử lý</Badge>;
    case 1:
      return <Badge variant="outline">Chờ phỏng vấn</Badge>;
    case 2:
      return (
        <Badge variant="default" className="bg-blue-600">
          Đã đặt lịch
        </Badge>
      );
    case 3:
      return (
        <Badge variant="default" className="bg-green-600">
          Đã duyệt
        </Badge>
      );
    case 4:
      return <Badge variant="destructive">Đã từ chối</Badge>;
    default:
      return <Badge variant="secondary">Không rõ</Badge>;
  }
};

export const columns = [
  // Cột chọn
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
  // Cột Ứng viên
  {
    accessorKey: "fullname",
    header: "Ứng viên",
    cell: ({ row }) => {
      const app = row.original;
      return (
        <div>
          <span className="font-medium">{app.fullname}</span>
          <p className="text-sm text-muted-foreground">{app.email}</p>
          <p className="text-sm text-muted-foreground font-mono">
            {app.student_id}
          </p>
        </div>
      );
    },
  },
  // Cột Trạng thái (MỚI)
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => renderStatus(row.getValue("status")),
  },
  // Cột Chuyên ngành
  {
    accessorKey: "major",
    header: "Chuyên ngành",
  },
  // Cột Khóa
  {
    accessorKey: "student_year",
    header: "Khóa/Năm",
  },
  // Cột Ngày nộp
  {
    accessorKey: "created_at",
    header: "Ngày nộp",
    cell: ({ row }) => {
      const date = row.getValue("created_at");
      return <span>{date ? formatDate(date) : "N/A"}</span>;
    },
  },
  // Cột Hành động
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      // viewMode chính là status
      const viewMode = row.original.status;
      return <RowActions row={row} viewMode={viewMode} />;
    },
  },
];
