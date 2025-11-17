"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState, useTransition } from "react";
import { useCategoriesStore } from "@/stores/categoriesStore";

export function PostFilters() {
  // Lấy categories từ Zustand store thay vì props
  const { categories, isLoading: categoriesLoading } = useCategoriesStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchInput, setSearchInput] = useState(
    searchParams.get("title") || ""
  );

  const currentCategory = searchParams.get("category") || "";
  const currentSearch = searchParams.get("title") || "";

  const updateFilters = (key, value) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset to page 1 when filters change
    params.set("page", "1");

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters("title", searchInput);
  };

  const clearAllFilters = () => {
    setSearchInput("");
    startTransition(() => {
      router.push("/post");
    });
  };

  const hasActiveFilters = currentCategory || currentSearch;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          Bộ lọc
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-8 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Xóa bộ lọc
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Box */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Tìm kiếm</label>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Nhập từ khóa..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isPending}>
              <Search className="h-4 w-4" />
            </Button>
          </form>
          {currentSearch && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Đang tìm:</span>
              <Badge variant="secondary" className="text-xs">
                {currentSearch}
                <button
                  onClick={() => {
                    setSearchInput("");
                    updateFilters("title", "");
                  }}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            </div>
          )}
        </div>

        <Separator />

        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Danh mục</label>
          <Select
            value={currentCategory}
            onValueChange={(value) =>
              updateFilters("category", value === "all" ? "" : value)
            }
          >
            <SelectTrigger disabled={isPending || categoriesLoading}>
              <SelectValue placeholder="Tất cả danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categoriesLoading ? (
                <SelectItem value="loading" disabled>
                  Đang tải...
                </SelectItem>
              ) : (
                categories?.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Đang lọc:</div>
              <div className="flex flex-wrap gap-2">
                {currentCategory && (
                  <Badge variant="outline" className="text-xs">
                    Danh mục:{" "}
                    {categories?.find((c) => c.slug === currentCategory)?.name}
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
