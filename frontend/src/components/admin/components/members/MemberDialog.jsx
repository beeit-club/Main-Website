// src/components/admin/components/members/MemberDialog.jsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usersServices } from "@/services/admin/users";
import { toast } from "sonner";
import { Loader2, User, Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

// Schema validation cho create
const createMemberSchema = yup.object({
  user_id: yup
    .number()
    .required("Vui lòng chọn người dùng"),
  student_id: yup
    .string()
    .required("MSSV là bắt buộc")
    .max(20, "MSSV tối đa 20 ký tự"),
  academic_year: yup
    .date()
    .nullable()
    .typeError("Năm học phải là định dạng ngày hợp lệ"),
  course: yup
    .string()
    .max(50, "Khóa học tối đa 50 ký tự"),
  join_date: yup
    .date()
    .nullable()
    .typeError("Ngày tham gia phải là định dạng ngày hợp lệ"),
});

// Schema validation cho update
const updateMemberSchema = yup.object({
  student_id: yup
    .string()
    .required("MSSV là bắt buộc")
    .max(20, "MSSV tối đa 20 ký tự"),
  academic_year: yup
    .date()
    .nullable()
    .typeError("Năm học phải là định dạng ngày hợp lệ"),
  course: yup
    .string()
    .max(50, "Khóa học tối đa 50 ký tự"),
  join_date: yup
    .date()
    .nullable()
    .typeError("Ngày tham gia phải là định dạng ngày hợp lệ"),
});

const getInitials = (name) => {
  if (!name) return "U";
  const names = name.split(" ");
  const initials = names.map((n) => n[0]).join("");
  return initials.substring(0, 2).toUpperCase();
};

export function MemberDialog({ open, onOpenChange, member, onSave }) {
  const isEditing = !!member;
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const debouncedUserSearch = useDebounce(userSearch, 500);

  const form = useForm({
    resolver: yupResolver(isEditing ? updateMemberSchema : createMemberSchema),
    defaultValues: {
      user_id: null,
      student_id: "",
      academic_year: "",
      course: "",
      join_date: "",
    },
  });

  // Load available users khi mở dialog để thêm mới hoặc khi search thay đổi
  useEffect(() => {
    if (open && !isEditing) {
      loadAvailableUsers(debouncedUserSearch);
    }
  }, [open, isEditing, debouncedUserSearch]);

  // Reset form khi member thay đổi
  useEffect(() => {
    if (member && isEditing) {
      // Format dates cho input type="date"
      const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      form.reset({
        student_id: member.student_id || "",
        academic_year: formatDateForInput(member.academic_year),
        course: member.course || "",
        join_date: formatDateForInput(member.join_date),
      });
      setSelectedUser({
        id: member.user_id || member.id,
        fullname: member.fullname,
        email: member.email,
        avatar_url: member.avatar_url,
      });
    } else {
      form.reset({
        user_id: null,
        student_id: "",
        academic_year: null,
        course: "",
        join_date: null,
      });
      setSelectedUser(null);
    }
  }, [member, open, isEditing]);

  const loadAvailableUsers = async (search = "") => {
    setLoadingUsers(true);
    try {
      const params = {
        page: 1,
        limit: 100,
      };
      if (search) {
        params.search = search;
      }
      const res = await usersServices.getAvailableUsers(params);
      if (res.status === "success") {
        setAvailableUsers(res.data.users || []);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setLoadingUsers(false);
    }
  };

  const { isSubmitting } = form.formState;

  const onSubmit = async (data) => {
    try {
      // Format dates
      const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toISOString().split("T")[0];
      };

      const submitData = {
        ...data,
        academic_year: formatDate(data.academic_year),
        join_date: formatDate(data.join_date) || new Date().toISOString().split("T")[0],
      };

      if (isEditing) {
        const userId = member.user_id || member.id;
        const res = await usersServices.updateMember(userId, submitData);
        if (res.status === "success") {
          toast.success("Cập nhật thành viên thành công");
          onSave();
          handleClose();
        } else {
          toast.error(res.message || "Cập nhật thành viên thất bại");
        }
      } else {
        const res = await usersServices.createMember(submitData);
        if (res.status === "success") {
          toast.success("Tạo thành viên thành công");
          onSave();
          handleClose();
        } else {
          toast.error(res.message || "Tạo thành viên thất bại");
        }
      }
    } catch (error) {
      toast.error(error?.message || "Có lỗi xảy ra");
    }
  };

  const handleClose = () => {
    form.reset();
    setSelectedUser(null);
    setUserSearch("");
    onOpenChange(false);
  };

  const handleUserSelect = (userId) => {
    const user = availableUsers.find((u) => u.id === parseInt(userId));
    if (user) {
      setSelectedUser(user);
      form.setValue("user_id", parseInt(userId));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa Thành viên" : "Thêm Thành viên Mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Cập nhật thông tin thành viên"
              : "Chọn người dùng và điền thông tin thành viên"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Chọn User (chỉ khi thêm mới) */}
            {!isEditing && (
              <FormField
                control={form.control}
                name="user_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chọn Người dùng *</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {/* Input search để lọc users */}
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Tìm kiếm theo tên, email..."
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                            className="pl-10"
                            disabled={isSubmitting || loadingUsers}
                          />
                        </div>
                        <Select
                          value={field.value?.toString() || ""}
                          onValueChange={handleUserSelect}
                          disabled={isSubmitting || loadingUsers}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn người dùng">
                              {selectedUser ? (
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={selectedUser.avatar_url} />
                                    <AvatarFallback>
                                      {getInitials(selectedUser.fullname)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{selectedUser.fullname}</span>
                                  <span className="text-muted-foreground">
                                    ({selectedUser.email})
                                  </span>
                                </div>
                              ) : (
                                "Chọn người dùng"
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {loadingUsers ? (
                              <div className="flex items-center justify-center p-4">
                                <Loader2 className="h-4 w-4 animate-spin" />
                              </div>
                            ) : availableUsers.length === 0 ? (
                              <div className="p-4 text-center text-sm text-muted-foreground">
                                {userSearch
                                  ? "Không tìm thấy người dùng nào"
                                  : "Không có người dùng nào khả dụng"}
                              </div>
                            ) : (
                              availableUsers.map((user) => (
                                <SelectItem
                                  key={user.id}
                                  value={user.id.toString()}
                                >
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage src={user.avatar_url} />
                                      <AvatarFallback>
                                        {getInitials(user.fullname)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div>{user.fullname}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {user.email}
                                      </div>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Hiển thị thông tin User khi edit */}
            {isEditing && selectedUser && (
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedUser.avatar_url} />
                  <AvatarFallback>
                    {getInitials(selectedUser.fullname)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedUser.fullname}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedUser.email}
                  </div>
                </div>
              </div>
            )}

            {/* MSSV */}
            <FormField
              control={form.control}
              name="student_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MSSV *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: 20210001"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Khóa học */}
            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Khóa học</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: K21, K22..."
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Năm học */}
            <FormField
              control={form.control}
              name="academic_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Năm học</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value || ""}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ngày tham gia */}
            <FormField
              control={form.control}
              name="join_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày tham gia</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value || ""}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : isEditing ? (
                  "Cập nhật"
                ) : (
                  "Tạo mới"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

