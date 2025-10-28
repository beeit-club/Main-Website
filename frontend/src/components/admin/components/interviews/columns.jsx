// src/components/admin/components/interviews/columns.jsx
import React from "react";
import { RowActions } from "./RowActions";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/datetime"; // Giả sử bạn có hàm này

// Helper rút gọn time (HH:mm:ss -> HH:mm)
const formatTime = (timeStr) => (timeStr ? timeStr.slice(0, 5) : "N/A");

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
  // Cột Tiêu đề
  {
    accessorKey: "title",
    header: "Tiêu đề",
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  },
  // Cột Địa điểm
  {
    accessorKey: "location",
    header: "Địa điểm / Link",
  },
  // Cột Ngày phỏng vấn
  {
    accessorKey: "interview_date",
    header: "Ngày phỏng vấn",
    cell: ({ row }) => {
      const date = row.getValue("interview_date");
      // Dùng formatDate cho Date (YYYY-MM-DD)
      return <span>{date ? formatDate(date, false) : "N/A"}</span>;
    },
  },
  // Cột Thời gian (MỚI)
  {
    accessorKey: "start_time",
    header: "Thời gian",
    cell: ({ row }) => {
      const start = row.original.start_time;
      const end = row.original.end_time;
      return <span>{`${formatTime(start)} - ${formatTime(end)}`}</span>;
    },
  },
  // Cột Hành động
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActions row={row} />,
  },
];
