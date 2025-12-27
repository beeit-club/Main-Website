// components/admin/email-templates/UserSelectionTable.jsx
"use client";

import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usersServices } from "@/services/admin/users";
import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";

/**
 * Component: Table chọn users với checkbox
 * 
 * Props:
 * - selectedUserIds: Array<number> - Danh sách user IDs đã chọn
 * - onSelectionChange: (userIds: number[]) => void - Callback khi selection thay đổi
 * - search?: string - Search term
 * - roleId?: number - Filter theo role
 */
export function UserSelectionTable({
  selectedUserIds = [],
  onSelectionChange,
  search = "",
  roleId = null,
}) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [meta, setMeta] = useState({ totalPages: 0, total: 0 });

  // Fetch users
  useEffect(() => {
    async function loadUsers() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
        });
        if (search) params.set("search", search);
        if (roleId) params.set("roleId", roleId.toString());

        const res = await usersServices.getAllUser(params);
        setUsers(res?.data?.data || []);
        setMeta({
          totalPages: res?.data?.pagination?.totalPages || 0,
          total: res?.data?.pagination?.total || 0,
        });
      } catch (error) {
        toast.error("Lỗi khi tải danh sách users");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    loadUsers();
  }, [pagination.page, pagination.limit, search, roleId]);

  // Handle select/deselect all
  const handleSelectAll = () => {
    const allIds = users.map((u) => u.id);
    const newSelection = [...new Set([...selectedUserIds, ...allIds])];
    onSelectionChange(newSelection);
  };

  const handleDeselectAll = () => {
    const currentPageIds = users.map((u) => u.id);
    const newSelection = selectedUserIds.filter(
      (id) => !currentPageIds.includes(id)
    );
    onSelectionChange(newSelection);
  };

  // Handle select/deselect single user
  const handleToggleUser = (userId) => {
    if (selectedUserIds.includes(userId)) {
      onSelectionChange(selectedUserIds.filter((id) => id !== userId));
    } else {
      onSelectionChange([...selectedUserIds, userId]);
    }
  };

  // Check if all current page users are selected
  const allCurrentPageSelected =
    users.length > 0 &&
    users.every((user) => selectedUserIds.includes(user.id));

  // Check if some current page users are selected
  const someCurrentPageSelected = users.some((user) =>
    selectedUserIds.includes(user.id)
  );

  return (
    <div className="space-y-4">
      {/* Header với actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            disabled={isLoading || users.length === 0}
          >
            Chọn tất cả trang này
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeselectAll}
            disabled={isLoading || users.length === 0}
          >
            Bỏ chọn trang này
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Đã chọn: <span className="font-semibold">{selectedUserIds.length}</span> người
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allCurrentPageSelected}
                  indeterminate={someCurrentPageSelected && !allCurrentPageSelected}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleSelectAll();
                    } else {
                      handleDeselectAll();
                    }
                  }}
                />
              </TableHead>
              <TableHead>Người dùng</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Không có user nào
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const isSelected = selectedUserIds.includes(user.id);
                return (
                  <TableRow
                    key={user.id}
                    className={isSelected ? "bg-muted/50" : ""}
                  >
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleToggleUser(user.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {user.fullname}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role_name || "N/A"}</TableCell>
                    <TableCell>
                      {user.is_active ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-400">
                          <XCircle className="h-4 w-4" />
                          Inactive
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Trang {pagination.page} / {meta.totalPages} ({meta.total} users)
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.max(1, prev.page - 1),
                }))
              }
              disabled={pagination.page === 1 || isLoading}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.min(meta.totalPages, prev.page + 1),
                }))
              }
              disabled={pagination.page === meta.totalPages || isLoading}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

