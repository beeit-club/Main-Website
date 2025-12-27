"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PaginationControls } from "@/components/common/Pagination";

// Roles
import { columns as roleColumns } from "@/components/admin/components/roles-permissions/role-columns";
import { DataTable as RoleDataTable } from "@/components/admin/components/roles-permissions/role-data-table";
import { rolesServices } from "@/services/admin/roles";
// Disabled: Không cho phép thêm/sửa roles
// import { RoleDialog } from "@/components/admin/components/roles-permissions/RoleDialog";

// Permissions
import { columns as permissionColumns } from "@/components/admin/components/roles-permissions/permission-columns";
import { DataTable as PermissionDataTable } from "@/components/admin/components/roles-permissions/permission-data-table";
import { permissionsServices } from "@/services/admin/permissions";
// Disabled: Permissions chỉ xem
// import { PermissionDialog } from "@/components/admin/components/roles-permissions/PermissionDialog";

export default function RolesPermissionsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Tab state
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "roles"
  );

  // Roles state
  const [rolesData, setRolesData] = useState([]);
  const [rolesMeta, setRolesMeta] = useState({ totalPages: 0, total: 0 });
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesPagination, setRolesPagination] = useState({
    pageIndex: searchParams.get("roles_page")
      ? parseInt(searchParams.get("roles_page")) - 1
      : 0,
    pageSize: searchParams.get("roles_limit")
      ? parseInt(searchParams.get("roles_limit"))
      : 10,
  });
  const [rolesSearch, setRolesSearch] = useState(
    searchParams.get("roles_search") || ""
  );
  const [rolesSorting, setRolesSorting] = useState([]);
  // Disabled: Không cho phép thêm/sửa roles
  // const [openRoleDialog, setOpenRoleDialog] = useState(false);
  // const [editingRole, setEditingRole] = useState(null);

  // Permissions state
  const [permissionsData, setPermissionsData] = useState([]);
  const [permissionsMeta, setPermissionsMeta] = useState({
    totalPages: 0,
    total: 0,
  });
  const [permissionsLoading, setPermissionsLoading] = useState(true);
  const [permissionsPagination, setPermissionsPagination] = useState({
    pageIndex: searchParams.get("permissions_page")
      ? parseInt(searchParams.get("permissions_page")) - 1
      : 0,
    pageSize: searchParams.get("permissions_limit")
      ? parseInt(searchParams.get("permissions_limit"))
      : 10,
  });
  const [permissionsSearch, setPermissionsSearch] = useState(
    searchParams.get("permissions_search") || ""
  );
  const [permissionsSorting, setPermissionsSorting] = useState([]);
  // Disabled: Permissions chỉ xem
  // const [openPermissionDialog, setOpenPermissionDialog] = useState(false);
  // const [editingPermission, setEditingPermission] = useState(null);

  // Fetch Roles
  const fetchRoles = async () => {
    setRolesLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", (rolesPagination.pageIndex + 1).toString());
      params.set("limit", rolesPagination.pageSize.toString());
      if (rolesSearch) params.set("search", rolesSearch);
      if (rolesSorting.length > 0) {
        params.set("sortBy", rolesSorting[0].id);
        params.set("sortDirection", rolesSorting[0].desc ? "desc" : "asc");
      }

      const res = await rolesServices.getAllRoles(params);
      setRolesData(res?.data?.data || []);
      setRolesMeta({
        totalPages: res?.data?.pagination?.totalPages || 0,
        total: res?.data?.pagination?.total || 0,
      });
    } catch (error) {
      toast.error("Lấy danh sách vai trò thất bại");
    } finally {
      setRolesLoading(false);
    }
  };

  // Fetch Permissions
  const fetchPermissions = async () => {
    setPermissionsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", (permissionsPagination.pageIndex + 1).toString());
      params.set("limit", permissionsPagination.pageSize.toString());
      if (permissionsSearch) params.set("search", permissionsSearch);
      if (permissionsSorting.length > 0) {
        params.set("sortBy", permissionsSorting[0].id);
        params.set(
          "sortDirection",
          permissionsSorting[0].desc ? "desc" : "asc"
        );
      }

      const res = await permissionsServices.getAllPermissions(params);
      setPermissionsData(res?.data?.data || []);
      setPermissionsMeta({
        totalPages: res?.data?.pagination?.totalPages || 0,
        total: res?.data?.pagination?.total || 0,
      });
    } catch (error) {
      toast.error("Lấy danh sách quyền thất bại");
    } finally {
      setPermissionsLoading(false);
    }
  };

  // Update URL
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("tab", activeTab);
    if (activeTab === "roles") {
      params.set("roles_page", (rolesPagination.pageIndex + 1).toString());
      params.set("roles_limit", rolesPagination.pageSize.toString());
      if (rolesSearch) params.set("roles_search", rolesSearch);
    } else {
      params.set(
        "permissions_page",
        (permissionsPagination.pageIndex + 1).toString()
      );
      params.set(
        "permissions_limit",
        permissionsPagination.pageSize.toString()
      );
      if (permissionsSearch) params.set("permissions_search", permissionsSearch);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [
    activeTab,
    rolesPagination,
    permissionsPagination,
    rolesSearch,
    permissionsSearch,
  ]);

  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab === "roles") {
      fetchRoles();
    } else {
      fetchPermissions();
    }
  }, [
    activeTab,
    rolesPagination,
    permissionsPagination,
    rolesSearch,
    permissionsSearch,
    rolesSorting,
    permissionsSorting,
  ]);

  // Disabled: Không cho phép thêm/sửa/xóa roles
  // const handleRoleCreate = () => {
  //   setEditingRole(null);
  //   setOpenRoleDialog(true);
  // };

  // const handleRoleEdit = (role) => {
  //   setEditingRole(role);
  //   setOpenRoleDialog(true);
  // };

  // const handleRoleDelete = async (id) => {
  //   if (!confirm("Bạn có chắc muốn xóa vai trò này?")) return;
  //   try {
  //     const res = await rolesServices.deleteRole(id);
  //     if (res.status === "success") {
  //       toast.success("Xóa vai trò thành công");
  //       fetchRoles();
  //     } else {
  //       toast.error(res.message || "Xóa vai trò thất bại");
  //     }
  //   } catch (error) {
  //     toast.error(error?.message || "Có lỗi xảy ra khi xóa vai trò");
  //   }
  // };

  // const handleRoleSave = () => {
  //   setOpenRoleDialog(false);
  //   setEditingRole(null);
  //   fetchRoles();
  // };

  // Disabled: Permissions chỉ xem, không cho thêm/sửa/xóa
  // const handlePermissionCreate = () => {
  //   setEditingPermission(null);
  //   setOpenPermissionDialog(true);
  // };

  // const handlePermissionEdit = (permission) => {
  //   setEditingPermission(permission);
  //   setOpenPermissionDialog(true);
  // };

  // const handlePermissionDelete = async (id) => {
  //   if (!confirm("Bạn có chắc muốn xóa quyền này?")) return;
  //   try {
  //     const res = await permissionsServices.deletePermission(id);
  //     if (res.status === "success") {
  //       toast.success("Xóa quyền thành công");
  //       fetchPermissions();
  //     } else {
  //       toast.error(res.message || "Xóa quyền thất bại");
  //     }
  //   } catch (error) {
  //     toast.error(error?.message || "Có lỗi xảy ra khi xóa quyền");
  //   }
  // };

  // const handlePermissionSave = () => {
  //   setOpenPermissionDialog(false);
  //   setEditingPermission(null);
  //   fetchPermissions();
  // };

  const memoizedRoleColumns = useMemo(
    () =>
      roleColumns.map((col) => ({
        ...col,
        meta: {
          ...col.meta,
          // Disabled: Không cho sửa/xóa
          // onEdit: handleRoleEdit,
          // onDelete: handleRoleDelete,
        },
      })),
    []
  );

  const memoizedPermissionColumns = useMemo(
    () =>
      permissionColumns.map((col) => ({
        ...col,
        meta: {
          ...col.meta,
          // Disabled: Permissions chỉ xem
          // onEdit: handlePermissionEdit,
          // onDelete: handlePermissionDelete,
        },
      })),
    []
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý Vai trò & Quyền</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="roles">Vai trò (Roles)</TabsTrigger>
          <TabsTrigger value="permissions">Quyền (Permissions)</TabsTrigger>
        </TabsList>

        {/* Roles Tab */}
        <TabsContent value="roles">
          <div className="space-y-4">
            {/* Disabled: Không cho phép thêm roles */}
            {/* <div className="flex justify-end">
              <Button onClick={handleRoleCreate}>Thêm Vai trò</Button>
            </div> */}
            <RoleDataTable
              columns={memoizedRoleColumns}
              data={rolesData}
              isLoading={rolesLoading}
              search={rolesSearch}
              setSearch={setRolesSearch}
              sorting={rolesSorting}
              setSorting={setRolesSorting}
            />
            <PaginationControls
              pagination={rolesPagination}
              meta={rolesMeta}
              setPagination={setRolesPagination}
            />
          </div>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions">
          <div className="space-y-4">
            {/* Disabled: Không cho phép thêm permissions, chỉ xem */}
            {/* <div className="flex justify-end">
              <Button onClick={handlePermissionCreate}>Thêm Quyền</Button>
            </div> */}
            <PermissionDataTable
              columns={memoizedPermissionColumns}
              data={permissionsData}
              isLoading={permissionsLoading}
              search={permissionsSearch}
              setSearch={setPermissionsSearch}
              sorting={permissionsSorting}
              setSorting={setPermissionsSorting}
            />
            <PaginationControls
              pagination={permissionsPagination}
              meta={permissionsMeta}
              setPagination={setPermissionsPagination}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Disabled: Không cho phép thêm/sửa roles và permissions */}
      {/* <RoleDialog
        open={openRoleDialog}
        onOpenChange={setOpenRoleDialog}
        role={editingRole}
        onSave={handleRoleSave}
      />

      <PermissionDialog
        open={openPermissionDialog}
        onOpenChange={setOpenPermissionDialog}
        permission={editingPermission}
        onSave={handlePermissionSave}
      /> */}
    </div>
  );
}

