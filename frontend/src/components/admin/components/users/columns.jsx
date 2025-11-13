// src/components/admin/components/users/columns.jsx
import React from "react";
import { RowActions } from "./RowActions"; // <-- Sẽ trỏ tới file RowActions cho Users
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/datetime";

const getInitials = (name) => {
  if (!name) return "U";
  const names = name.split(" ");
  const initials = names.map((n) => n[0]).join("");
  return initials.substring(0, 2).toUpperCase();
};

//  tìm hiểu
// khi có id và khi không có id, nó để làm bộ lọc trên url
// {
//     id: "active",
//     accessorKey: "is_active",
//     header: "Trạng thái",
//     cell: ({ row }) => {
//       const isActive = row.getValue("active");
//       return isActive ? (
//         <Badge variant="default" className="bg-green-600">
//           Hoạt động
//         </Badge>
//       ) : (
//         <Badge variant="outline">Vô hiệu hóa</Badge>
//       );
//     },
//   },

export const columns = [
  // 1. Cột chọn
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

  // 2. Cột Người dùng (Avatar, Fullname, Email)
  {
    accessorKey: "fullname",
    header: "Người dùng",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar_url} alt={user.fullname} />
            <AvatarFallback>{getInitials(user.fullname)}</AvatarFallback>
          </Avatar>
          <div>
            <span className="font-medium">{user.fullname}</span>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      );
    },
  },

  {
    id: "roleId",
    accessorKey: "role_name",
    header: "Vai trò",
    cell: ({ row }) => {
      const roleName = row.original.role_name;
      if (!roleName) {
        return <span className="text-gray-400 italic">Chưa rõ</span>;
      }

      let variant;
      switch (roleName) {
        case "Super Admin":
          variant = "destructive"; // Màu đỏ, nổi bật nhất
          break;
        case "Admin":
          variant = "default"; // Màu đen/chính
          break;
        case "Moderator":
          variant = "secondary"; // Màu xám
          break;
        case "Member":
          variant = "outline"; // Chỉ viền
          break;
        case "Guest":
          variant = "outline"; // Chỉ viền
          break;
        default:
          variant = "secondary"; // Mặc định cho các role lạ (nếu có)
      }

      return <Badge variant={variant}>{roleName}</Badge>;
    },
  },

  // 4. Cột Trạng thái (is_active)
  {
    id: "active",
    accessorKey: "is_active",
    header: "Trạng thái",
    cell: ({ row }) => {
      const isActive = row.getValue("active");
      return isActive ? (
        <Badge variant="default" className="bg-green-600">
          Hoạt động
        </Badge>
      ) : (
        <Badge variant="outline">Vô hiệu hóa</Badge>
      );
    },
  },

  // 5. Cột Ngày tham gia
  {
    accessorKey: "created_at",
    header: "Ngày tham gia",
    cell: ({ row }) => {
      const date = row.getValue("created_at");
      return <span>{date ? formatDate(date) : "N/A"}</span>;
    },
  },

  // 6. Cột Hành động (Sẽ nhận viewMode từ page.jsx)
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      // Lấy viewMode từ meta của table (sẽ được truyền từ page.jsx)
      const viewMode = table.options.meta?.viewMode;
      return <RowActions row={row} viewMode={viewMode} />;
    },
    enableSorting: false,
    enableHiding: false,
  },
];
