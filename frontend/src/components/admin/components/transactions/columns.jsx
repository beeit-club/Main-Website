import React from "react";
import { RowActions } from "./RowActions"; // <-- Trỏ tới RowActions của transactions
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/datetime";
import { formatCurrency } from "@/lib/utils"; // <-- (Bạn cần tự tạo hàm này)

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
    accessorKey: "amount",
    header: "Số tiền",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const type = row.original.type; // Giả sử type là 1 (Thu) hoặc 2 (Chi)

      const formatted = formatCurrency(amount);

      // Thêm màu sắc dựa trên Thu/Chi
      if (type == 1) {
        // Thu
        return <span className="font-medium text-green-600">+{formatted}</span>;
      }
      if (type == 2) {
        // Chi
        return <span className="font-medium text-red-600">-{formatted}</span>;
      }
      return <span className="font-medium">{formatted}</span>;
    },
  },
  {
    accessorKey: "type",
    header: "Loại Giao dịch",
    cell: ({ row }) => {
      const type = row.getValue("type");
      if (type == 1) {
        return <span className="text-green-600">Khoản Thu</span>;
      }
      if (type == 2) {
        return <span className="text-red-600">Khoản Chi</span>;
      }
      return <span className="text-gray-400">Chưa xác định</span>;
    },
  },
  {
    accessorKey: "description",
    header: "Nội dung",
    cell: (info) => <span className="line-clamp-2">{info.getValue()}</span>,
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
    // Cập nhật theo BE model (đã JOIN)
    accessorKey: "created_by_name",
    header: "Người tạo",
    cell: ({ row }) => {
      const userName = row.getValue("created_by_name");
      if (!userName) return <span className="text-gray-400 italic">N/A</span>;
      return userName;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActions row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
];
