import React from "react";
import { RowActions } from "./RowActions";
import { Checkbox } from "@/components/ui/checkbox";

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
    accessorKey: "display_order",
    header: "Thứ tự",
    cell: (info) => (
      <span className="font-semibold">{info.getValue() || 0}</span>
    ),
  },
  {
    accessorKey: "image_url",
    header: "Ảnh",
import SafeImage from "@/components/common/SafeImage";

// ... inside columns ...

    cell: ({ row }) => {
      const imageUrl = row.getValue("image_url");
      return (
        <div className="w-16 h-16 relative rounded-full overflow-hidden border">
          {imageUrl ? (
            <SafeImage
              src={imageUrl}
              alt="Founder"
              className="w-full h-full object-cover"
              fill
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">
              No image
            </div>
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "Họ tên",
    cell: (info) => (
      <span className="font-medium">{info.getValue()}</span>
    ),
  },
  {
    accessorKey: "role",
    header: "Vai trò",
    cell: (info) => (
      <span className="text-sm text-muted-foreground">{info.getValue()}</span>
    ),
  },
  {
    accessorKey: "is_founder",
    header: "Loại",
    cell: ({ row }) => {
      const isFounder = row.getValue("is_founder");
      return (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            isFounder == 1
              ? "bg-yellow-100 text-yellow-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {isFounder == 1 ? "Người sáng lập" : "Ban Chủ Nhiệm"}
        </span>
      );
    },
  },
  {
    accessorKey: "is_active",
    header: "Trạng thái",
    cell: ({ row }) => {
      const isActive = row.getValue("is_active");
      return (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            isActive == 1
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {isActive == 1 ? "Hiển thị" : "Ẩn"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row, table }) => {
      const viewMode = table.options.meta?.viewMode;
      return <RowActions row={row} viewMode={viewMode} />;
    },
    enableSorting: false,
    enableHiding: false,
  },
];

