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

export function DataTableToolbar({ table, tagName, setTagName }) {
  // độ trễ khi search
  useEffect(() => {
    const delay = setTimeout(() => {
      setTagName(tagName);
    }, 500);
    return () => clearTimeout(delay);
  }, [tagName]);

  return (
    <div className="flex items-center justify-between py-4 gap-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Tìm kiếm..."
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          className="max-w-xs w-full sm:w-64"
        />
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
