"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function DataTableToolbar({ table, title, setTitle }) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tiêu đề..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
    </div>
  );
}

