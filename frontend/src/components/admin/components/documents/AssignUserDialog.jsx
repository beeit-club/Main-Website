import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { documentServices } from "@/services/admin/documentServices";
import { toast } from "sonner";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "recharts";
import { usersServices } from "@/services/admin/users";

export function AssignUserDialog({ open, onOpenChange, docId, docTitle }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [allUsers, setAllUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [openCombobox, setOpenCombobox] = useState(false);

  // Lọc ra danh sách user chưa được gán để hiển thị trong Combobox
  const unassignedUsers = useMemo(() => {
    const assignedIds = new Set(assignedUsers.map((u) => u.id));
    return allUsers.filter((u) => !assignedIds.has(u.id));
  }, [allUsers, assignedUsers]);

  // Fetch dữ liệu khi dialog mở
  async function fetchData() {
    if (!open || !docId) return;
    setIsLoading(true);
    try {
      // Gọi 2 API song song
      const [userRes, docRes] = await Promise.all([
        usersServices.getAllUser(), // Lấy 1000 user
        documentServices.getOneDocument(docId), // Lấy user đã gán
      ]);
      setAllUsers(userRes?.data?.data.data || []);
      // Giả định BE trả về { document: { ..., assigned_users: [...] } }
      setAssignedUsers(docRes?.data?.data?.document?.assigned_users || []);
    } catch (error) {
      toast.error("Tải dữ liệu người dùng thất bại.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [open, docId]);

  // Xử lý Gán 1 user
  async function handleAssignUser() {
    if (!selectedUserId) {
      toast.error("Vui lòng chọn một người dùng.");
      return;
    }
    setIsSubmitting(true);
    try {
      await documentServices.assignUsersToDocument(docId, [selectedUserId]);
      toast.success("Gán quyền thành công.");
      setSelectedUserId(null); // Reset combobox
      fetchData(); // Tải lại danh sách
    } catch (error) {
      toast.error(error.message || "Gán quyền thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Xử lý Xóa 1 user
  async function handleRemoveUser(userId) {
    try {
      await documentServices.removeUserFromDocument(docId, userId);
      toast.success("Xóa quyền truy cập thành công.");
      fetchData(); // Tải lại danh sách
    } catch (error) {
      toast.error(error.message || "Xóa quyền thất bại.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gán Quyền Truy Cập</DialogTitle>
          <DialogDescription>
            Quản lý người dùng có quyền truy cập tài liệu:{" "}
            <strong>{docTitle}</strong>
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Phần 1: Thêm User */}
            <div>
              <Label>Thêm người dùng</Label>
              <div className="flex gap-2 mt-1">
                <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {selectedUserId
                        ? unassignedUsers.find((u) => u.id === selectedUserId)
                            ?.fullname
                        : "Chọn người dùng..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Tìm người dùng..." />
                      <CommandEmpty>Không tìm thấy.</CommandEmpty>
                      <CommandList>
                        {unassignedUsers.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={user.fullname}
                            onSelect={() => {
                              setSelectedUserId(user.id);
                              setOpenCombobox(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedUserId === user.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {user.fullname} ({user.email})
                          </CommandItem>
                        ))}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Button
                  onClick={handleAssignUser}
                  disabled={isSubmitting || !selectedUserId}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Gán"
                  )}
                </Button>
              </div>
            </div>

            {/* Phần 2: Danh sách đã gán */}
            <div>
              <Label>Đã được gán ({assignedUsers.length})</Label>
              <ScrollArea className="h-40 w-full rounded-md border mt-1">
                <div className="p-4 space-y-2">
                  {assignedUsers.length === 0 ? (
                    <p className="text-sm text-center text-muted-foreground">
                      Chưa có ai được gán.
                    </p>
                  ) : (
                    assignedUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-2 rounded hover:bg-muted"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar_url} />
                            <AvatarFallback>{user.fullname[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">
                            {user.fullname}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleRemoveUser(user.id)}
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
