import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";

export function RowActions({ row, onEdit, onDelete }) {
  // Disabled: Không cho phép sửa/xóa roles
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open actions">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled>
          <Pencil className="mr-2 h-4 w-4" />
          Chỉnh sửa (Đã vô hiệu hóa)
        </DropdownMenuItem>
        <DropdownMenuItem disabled className="text-red-600">
          <Trash className="mr-2 h-4 w-4" />
          Xóa (Đã vô hiệu hóa)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

