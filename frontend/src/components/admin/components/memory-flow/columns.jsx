import React from "react";
import { RowActions } from "./RowActions";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

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
    cell: ({ row }) => {
      const imageUrl = row.getValue("image_url");
      return (
        <div className="w-20 h-20 relative rounded-lg overflow-hidden border">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Memory Flow"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/logo.jpg";
              }}
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
    accessorKey: "title",
    header: "Tiêu đề",
    cell: (info) => (
      <span className="font-medium">{info.getValue()}</span>
    ),
  },
  {
    accessorKey: "caption",
    header: "Mô tả",
    cell: (info) => {
      const caption = info.getValue();
      return (
        <span className="text-sm text-muted-foreground line-clamp-2 max-w-md">
          {caption}
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

