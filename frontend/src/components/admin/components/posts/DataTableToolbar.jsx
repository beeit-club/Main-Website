// src/components/DataTableToolbar.jsx
import React, { useEffect } from "react";
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

export function DataTableToolbar({ table, categoryList, title, setTitle }) {
  const statusColumn = table.getColumn("status");
  const categoryColumn = table.getColumn("category_name");
  const isFiltered = table.getState().columnFilters.length > 0;

  // độ trễ khi search
  useEffect(() => {
    const delay = setTimeout(() => {
      setTitle(title);
    }, 500);
    return () => clearTimeout(delay);
  }, [title]);


  return (
    <div className="flex items-center justify-between py-4 gap-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Tìm kiếm..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="max-w-xs w-full sm:w-64"
        />
        {categoryColumn && (
          <Select
            value={categoryColumn.getFilterValue() || "all"}
            onValueChange={(value) => {
              categoryColumn.setFilterValue(value === "all" ? undefined : value);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Trạng thái bài viết" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categoryList.map((cate) => { return <SelectItem value={cate.id} key={cate.id}>{cate.name}</SelectItem> })}
            </SelectContent>
          </Select>
        )}
        {statusColumn && (
          <Select
            value={statusColumn.getFilterValue() || "all"}
            onValueChange={(value) => {
              statusColumn.setFilterValue(value === "all" ? undefined : value);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Trạng thái bài viết" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="1">Hoạt động</SelectItem>
              <SelectItem value="0">Nháp</SelectItem>
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
        <div>
        </div>
      </div>

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
