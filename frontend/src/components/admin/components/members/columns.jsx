// src/components/admin/components/members/columns.jsx
import React from "react";
import { RowActions } from "./RowActions";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/datetime";
import { GraduationCap, Phone, Mail, Calendar } from "lucide-react";

const getInitials = (name) => {
  if (!name) return "U";
  const names = name.split(" ");
  const initials = names.map((n) => n[0]).join("");
  return initials.substring(0, 2).toUpperCase();
};

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

  // 2. Cột Thành viên (Avatar, Fullname, Email, Phone)
  {
    accessorKey: "fullname",
    header: "Thành viên",
    cell: ({ row }) => {
      const member = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={member.avatar_url} alt={member.fullname} />
            <AvatarFallback>{getInitials(member.fullname)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{member.fullname}</span>
            <div className="flex flex-col gap-0.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span>{member.email}</span>
              </div>
              {member.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>{member.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    },
  },

  // 3. Cột MSSV
  {
    accessorKey: "student_id",
    header: "MSSV",
    cell: ({ row }) => {
      const studentId = row.getValue("student_id");
      return (
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono">{studentId || "N/A"}</span>
        </div>
      );
    },
  },

  // 4. Cột Năm học
  {
    accessorKey: "academic_year",
    header: "Năm học",
    cell: ({ row }) => {
      const academicYear = row.getValue("academic_year");
      return <span>{academicYear || "N/A"}</span>;
    },
  },

  // 6. Cột Ngày tham gia CLB
  {
    accessorKey: "join_date",
    header: "Ngày tham gia",
    cell: ({ row }) => {
      const date = row.getValue("join_date");
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{date ? formatDate(date) : "N/A"}</span>
        </div>
      );
    },
  },

  // 7. Cột Trạng thái
  {
    accessorKey: "is_active",
    header: "Trạng thái",
    cell: ({ row }) => {
      const isActive = row.getValue("is_active");
      return isActive ? (
        <Badge variant="default" className="bg-green-600">
          Hoạt động
        </Badge>
      ) : (
        <Badge variant="outline">Vô hiệu hóa</Badge>
      );
    },
  },

  // 8. Cột Hành động
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const onEdit = table.options.meta?.onEdit;
      const onDelete = table.options.meta?.onDelete;
      return <RowActions row={row} onEdit={onEdit} onDelete={onDelete} />;
    },
    enableSorting: false,
    enableHiding: false,
  },
];

