"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { usersServices } from "@/services/admin/users";
import { rolesServices } from "@/services/admin/roles";
import { permissionsServices } from "@/services/admin/permissions";
import {
  Loader2,
  User,
  Shield,
  Key,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AssignPermissionsPage() {
  const [step, setStep] = useState(1); // 1: Chọn user, 2: Gán role, 3: Gán permissions
  const [loading, setLoading] = useState(false);

  // Data
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);

  // Selected
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);

  // Current user info
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // User search state
  const [userSearchOpen, setUserSearchOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");

  // Fetch users
  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("limit", "1000");
      const res = await usersServices.getAllUser(params);
      setUsers(res?.data?.data || []);
    } catch (error) {
      toast.error("Lấy danh sách người dùng thất bại");
    }
  };

  // Fetch roles
  const fetchRoles = async () => {
    try {
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("limit", "100");
      const res = await rolesServices.getAllRoles(params);
      setRoles(res?.data?.data || []);
    } catch (error) {
      toast.error("Lấy danh sách vai trò thất bại");
    }
  };

  // Fetch permissions - Lấy tất cả bằng cách fetch nhiều trang
  const fetchPermissions = async () => {
    try {
      // Validation schema có max limit = 100, nên dùng limit = 100 và fetch nhiều lần
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("limit", "100"); // Max limit theo validation

      const firstPage = await permissionsServices.getAllPermissions(params);
      let permissionsList = firstPage?.data?.data || [];

      // Nếu có pagination và totalPages > 1, fetch các trang còn lại
      const pagination = firstPage?.data?.pagination;
      if (pagination && pagination.totalPages > 1) {
        console.log(`📄 Có ${pagination.totalPages} trang, đang fetch thêm...`);
        const allPromises = [];
        for (let page = 2; page <= pagination.totalPages; page++) {
          const pageParams = new URLSearchParams();
          pageParams.set("page", page.toString());
          pageParams.set("limit", "100");
          allPromises.push(permissionsServices.getAllPermissions(pageParams));
        }

        const otherPages = await Promise.all(allPromises);
        otherPages.forEach((pageRes) => {
          const pageData = pageRes?.data?.data || [];
          permissionsList = [...permissionsList, ...pageData];
        });
      }

      console.log("✅ Total permissions fetched:", permissionsList.length);
      console.log("📋 Modules:", [
        ...new Set(permissionsList.map((p) => p.module)),
      ]);
      console.log(
        "📋 Sample (first 10):",
        permissionsList.slice(0, 10).map((p) => p.name)
      );

      setPermissions(permissionsList);
    } catch (error) {
      console.error("❌ Error fetching permissions:", error);
      toast.error(
        "Lấy danh sách quyền thất bại: " + (error?.message || "Unknown error")
      );
    }
  };

  // Fetch user permissions
  const fetchUserPermissions = async (userId) => {
    try {
      const res = await permissionsServices.getUserPermissions(userId);
      // Response structure: { status, message, data: { permissions: [...] } }
      const permissions = res?.data?.permissions || res?.data || [];
      setUserPermissions(Array.isArray(permissions) ? permissions : []);
    } catch (error) {
      // User có thể chưa có permissions
      console.log("User chưa có permissions hoặc lỗi:", error);
      setUserPermissions([]);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchPermissions();
  }, []);

  // When user is selected
  useEffect(() => {
    if (selectedUserId) {
      const user = users.find((u) => u.id === parseInt(selectedUserId));
      if (user) {
        setCurrentUser(user);
        setCurrentUserRole(user.role_name);
        setSelectedRoleId(user.role_id?.toString() || "");
        setIsSuperAdmin(user.role_id === 1);
        fetchUserPermissions(user.id);
      }
    }
  }, [selectedUserId, users]);

  // Filter permissions: Ẩn tất cả quyền về user, role và permissions
  // Chỉ hiển thị các quyền khác (posts, events, documents, transactions, applications, etc.)
  const filteredPermissions = permissions.filter((perm) => {
    // Loại trừ tất cả quyền về user management, role management và permission management
    const shouldShow =
      !perm.name.startsWith("users.") &&
      !perm.name.startsWith("roles.") &&
      !perm.name.startsWith("permissions.");
    if (!shouldShow) {
      console.log("🚫 Filtered out:", perm.name);
    }
    return shouldShow;
  });

  console.log("🔍 All permissions:", permissions.length);
  console.log("🔍 Filtered permissions:", filteredPermissions.length);
  console.log(
    "🔍 Filtered list:",
    filteredPermissions.map((p) => p.name)
  );

  // Group permissions by module
  const groupedPermissions = filteredPermissions.reduce((acc, perm) => {
    const module = perm.module || "other";
    if (!acc[module]) {
      acc[module] = [];
    }
    acc[module].push(perm);
    return acc;
  }, {});

  // Handle user selection
  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
    setUserSearchOpen(false);
    setUserSearchQuery("");
    setStep(2);
  };

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!userSearchQuery) {
      return users;
    }
    const query = userSearchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.fullname?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.role_name?.toLowerCase().includes(query)
    );
  }, [users, userSearchQuery]);

  // Get selected user display name
  const selectedUserDisplay = useMemo(() => {
    if (!selectedUserId) return "Chọn người dùng...";
    const user = users.find((u) => u.id === parseInt(selectedUserId));
    if (!user) return "Chọn người dùng...";
    return `${user.fullname} (${user.email}) - ${
      user.role_name || "Chưa có vai trò"
    }`;
  }, [selectedUserId, users]);

  // Handle role assignment
  const handleAssignRole = async () => {
    if (!selectedUserId || !selectedRoleId) {
      toast.error("Vui lòng chọn người dùng và vai trò");
      return;
    }

    setLoading(true);
    try {
      // API: POST /admin/roles/:roleId/assign với body { user_id: userId }
      const res = await rolesServices.assignRole(
        parseInt(selectedRoleId),
        parseInt(selectedUserId)
      );
      if (res?.status === "success") {
        toast.success("Gán vai trò thành công");
        setStep(3);
        // Update current user role
        const newRole = roles.find((r) => r.id === parseInt(selectedRoleId));
        if (newRole) {
          setCurrentUserRole(newRole.name);
          setIsSuperAdmin(parseInt(selectedRoleId) === 1);
        }
        // Reload user data để cập nhật role mới
        await fetchUsers();
      } else {
        toast.error(res?.message || "Gán vai trò thất bại");
      }
    } catch (error) {
      console.error("Error assigning role:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Có lỗi xảy ra khi gán vai trò"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle permission toggle
  const handlePermissionToggle = (permissionId) => {
    setSelectedPermissionIds((prev) => {
      if (prev.includes(permissionId)) {
        return prev.filter((id) => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };

  // Handle bulk grant permissions
  const handleGrantPermissions = async () => {
    if (!selectedUserId) {
      toast.error("Vui lòng chọn người dùng");
      return;
    }

    if (selectedPermissionIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một quyền");
      return;
    }

    setLoading(true);
    try {
      // API: POST /admin/permissions/user/:userId/bulk-grant với body { permission_ids: [...] }
      const res = await permissionsServices.bulkGrantPermissions(
        parseInt(selectedUserId),
        selectedPermissionIds
      );
      if (res?.status === "success") {
        toast.success("Gán quyền thành công");
        // Reset form
        setSelectedUserId("");
        setSelectedRoleId("");
        setSelectedPermissionIds([]);
        setCurrentUser(null);
        setCurrentUserRole(null);
        setUserPermissions([]);
        setStep(1);
        // Reload users để cập nhật
        await fetchUsers();
      } else {
        toast.error(res?.message || "Gán quyền thất bại");
      }
    } catch (error) {
      console.error("Error granting permissions:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Có lỗi xảy ra khi gán quyền"
      );
    } finally {
      setLoading(false);
    }
  };

  // Check if permission is already granted
  const isPermissionGranted = (permissionId) => {
    return userPermissions.some((up) => up.id === permissionId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Gán Vai trò & Quyền cho Người dùng
        </h1>
        <p className="text-muted-foreground">
          Chọn người dùng, gán vai trò, sau đó gán các quyền tương ứng
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-4">
        <div
          className={`flex items-center gap-2 ${
            step >= 1 ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            1
          </div>
          <span>Chọn người dùng</span>
        </div>
        <div className="w-12 h-0.5 bg-border" />
        <div
          className={`flex items-center gap-2 ${
            step >= 2 ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            2
          </div>
          <span>Gán vai trò</span>
        </div>
        <div className="w-12 h-0.5 bg-border" />
        <div
          className={`flex items-center gap-2 ${
            step >= 3 ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            3
          </div>
          <span>Gán quyền</span>
        </div>
      </div>

      {/* Step 1: Select User */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Bước 1: Chọn Người dùng
            </CardTitle>
            <CardDescription>
              Chọn người dùng mà bạn muốn gán vai trò và quyền
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="user-select">Người dùng</Label>
              <Popover open={userSearchOpen} onOpenChange={setUserSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={userSearchOpen}
                    className="w-full justify-between mt-2"
                    disabled={loading}
                  >
                    <span className="truncate">{selectedUserDisplay}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[600px] p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Tìm kiếm theo tên, email hoặc vai trò..."
                      value={userSearchQuery}
                      onValueChange={setUserSearchQuery}
                    />
                    <CommandList>
                      <CommandEmpty>
                        {userSearchQuery
                          ? `Không tìm thấy người dùng nào với "${userSearchQuery}"`
                          : "Nhập để tìm kiếm người dùng..."}
                      </CommandEmpty>
                      <CommandGroup>
                        {filteredUsers.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={`${user.fullname} ${user.email} ${
                              user.role_name || ""
                            }`}
                            onSelect={() =>
                              handleUserSelect(user.id.toString())
                            }
                            className="cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedUserId === user.id.toString()
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {user.fullname}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {user.email} -{" "}
                                {user.role_name || "Chưa có vai trò"}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {users.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Tổng số: {users.length} người dùng
                  {userSearchQuery && ` • Tìm thấy: ${filteredUsers.length}`}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Assign Role */}
      {step === 2 && currentUser && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Bước 2: Gán Vai trò
            </CardTitle>
            <CardDescription>
              Gán vai trò cho người dùng:{" "}
              <strong>{currentUser.fullname}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="role-select">Vai trò</Label>
              <Select
                value={selectedRoleId}
                onValueChange={setSelectedRoleId}
                disabled={loading}
              >
                <SelectTrigger id="role-select" className="mt-2">
                  <SelectValue placeholder="Chọn vai trò..." />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.name}
                      {role.description && ` - ${role.description}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {currentUserRole && (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm">
                  Vai trò hiện tại: <Badge>{currentUserRole}</Badge>
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setStep(1);
                  setSelectedUserId("");
                }}
                disabled={loading}
              >
                Quay lại
              </Button>
              <Button onClick={handleAssignRole} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang gán...
                  </>
                ) : (
                  "Gán Vai trò"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Assign Permissions */}
      {step === 3 && currentUser && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Bước 3: Gán Quyền
            </CardTitle>
            <CardDescription>
              Gán quyền cho người dùng: <strong>{currentUser.fullname}</strong>{" "}
              (Vai trò: <Badge>{currentUserRole}</Badge>)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current permissions */}
            {userPermissions.length > 0 && (
              <div>
                <Label>Quyền hiện tại</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {userPermissions.map((perm) => (
                    <Badge key={perm.id} variant="secondary">
                      {perm.name}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Các quyền mới sẽ thay thế các quyền hiện tại
                </p>
              </div>
            )}

            <Separator />

            {/* Permission selection */}
            <div>
              <Label>Chọn quyền</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Chọn các quyền bạn muốn gán cho người dùng này. Có thể chọn
                nhiều quyền cùng lúc.
                <br />
                <span className="text-xs italic">
                  Lưu ý: Các quyền về quản lý người dùng (users.*), vai trò
                  (roles.*) và quyền (permissions.*) đã được ẩn.
                </span>
              </p>

              {Object.keys(groupedPermissions).length === 0 ? (
                <div className="p-8 text-center border rounded-md">
                  <p className="text-muted-foreground">
                    Không có quyền nào để hiển thị. Vui lòng kiểm tra:
                  </p>
                  <ul className="text-sm text-muted-foreground mt-2 list-disc list-inside">
                    <li>Database có đủ permissions không?</li>
                    <li>API có trả về đủ dữ liệu không?</li>
                    <li>Xem console để kiểm tra response</li>
                  </ul>
                  <p className="text-xs mt-4">
                    Tổng số permissions: {permissions.length} | Sau filter:{" "}
                    {filteredPermissions.length}
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto border rounded-md p-4">
                  {Object.entries(groupedPermissions).map(([module, perms]) => (
                    <div key={module} className="space-y-2">
                      <h4 className="font-semibold text-sm uppercase text-muted-foreground">
                        {module} ({perms.length} quyền)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {perms.map((perm) => (
                          <div
                            key={perm.id}
                            className="flex items-center space-x-2 p-2 rounded border hover:bg-muted"
                          >
                            <Checkbox
                              id={`perm-${perm.id}`}
                              checked={selectedPermissionIds.includes(perm.id)}
                              onCheckedChange={() =>
                                handlePermissionToggle(perm.id)
                              }
                              disabled={loading}
                            />
                            <Label
                              htmlFor={`perm-${perm.id}`}
                              className="flex-1 cursor-pointer"
                            >
                              <div className="font-mono text-sm">
                                {perm.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {perm.description}
                              </div>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-sm">
                  Đã chọn: <strong>{selectedPermissionIds.length}</strong> quyền
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setStep(2);
                  setSelectedPermissionIds([]);
                }}
                disabled={loading}
              >
                Quay lại
              </Button>
              <Button onClick={handleGrantPermissions} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang gán...
                  </>
                ) : (
                  "Gán Quyền"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
