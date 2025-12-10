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
  // Disabled: Permissions chỉ xem, không cho sửa/xóa
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
          Chỉnh sửa (Chỉ xem)
        </DropdownMenuItem>
        <DropdownMenuItem disabled className="text-red-600">
          <Trash className="mr-2 h-4 w-4" />
          Xóa (Chỉ xem)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

