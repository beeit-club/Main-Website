import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useDebouncedSearch } from "@/lib/utils";
export function DataTableToolbar({ table, rolesList = [] }) {
  //  phần có id ở file columns giúp cho lấy giá trị ở dưới
  const statusColumn = table.getColumn("active");
  const roleColumn = table.getColumn("roleId");

  const isFiltered = table.getState().columnFilters.length > 0;

  // useDebouncedSearch một hook tự custom để sử dụng làm độ trễ khi search
  const [searchValue, setSearchValue] = useDebouncedSearch(
    table.getState().globalFilter || "",
    table.setGlobalFilter,
    500 // 500ms delay
  );
  return (
    <div className="flex items-center justify-between py-4 gap-4">
      {/* Phía bên trái: Các bộ lọc */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* 1. Lọc Tìm kiếm (Chung) */}
        <Input
          placeholder="Tìm kiếm email, tên..."
          value={searchValue} // Trỏ về state "ảo"
          onChange={(e) => setSearchValue(e.target.value)} // Cập nhật state "ảo"
          className="max-w-xs w-full sm:w-64"
        />

        {/* 2. Lọc Trạng thái (Select) */}
        {statusColumn && (
          <Select
            // SỬA 1: Dùng 'all' làm giá trị mặc định thay vì ""
            value={statusColumn.getFilterValue() || "all"}
            onValueChange={(value) => {
              // SỬA 2: Nếu value là 'all' -> set filter là undefined (để xóa filter)
              // Nếu không, set value bình thường
              statusColumn.setFilterValue(value === "all" ? undefined : value);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              {/* SỬA 3: Đổi value="" thành value="all" */}
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="1">Hoạt động</SelectItem>
              <SelectItem value="0">Vô hiệu hóa</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* 3. Lọc Vai trò (Select) - Đã đúng, chỉ tối ưu lại onValueChange */}
        {roleColumn && (
          <Select
            value={roleColumn.getFilterValue() || "all"}
            onValueChange={(value) => {
              // SỬA 4: Logic tương tự như trên
              roleColumn.setFilterValue(value === "all" ? undefined : value);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Chọn vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả vai trò</SelectItem>
              {rolesList.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* 4. Nút Reset */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              table.setGlobalFilter("");
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Phía bên phải: Ẩn/Hiện cột */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Columns</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((col) => col.getCanHide())
            .map((col) => (
              <DropdownMenuCheckboxItem
                key={col.id}
                checked={col.getIsVisible()}
                onCheckedChange={(val) => col.toggleVisibility(!!val)}
              >
                {col.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
