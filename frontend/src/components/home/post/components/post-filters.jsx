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
  const currentTag = searchParams.get("tag") || "";

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

  const hasActiveFilters = currentCategory || currentSearch || currentTag;

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          Bộ lọc
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-7 px-2 text-[10px]"
            >
              <X className="h-2.5 w-2.5 mr-1" />
              Xóa bộ lọc
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Box */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium">Tìm kiếm</label>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Nhập từ khóa..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1 h-8 text-xs"
            />
            <Button type="submit" size="icon" className="h-8 w-8" disabled={isPending}>
              <Search className="h-3.5 w-3.5" />
            </Button>
          </form>
          {currentSearch && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">Đang tìm:</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {currentSearch}
                <button
                  onClick={() => {
                    setSearchInput("");
                    updateFilters("title", "");
                  }}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </Badge>
            </div>
          )}
        </div>

        <Separator />

        {/* Category Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium">Danh mục</label>
          <Select
            value={currentCategory}
            onValueChange={(value) =>
              updateFilters("category", value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="h-8 text-xs" disabled={isPending || categoriesLoading}>
              <SelectValue placeholder="Tất cả danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">Tất cả danh mục</SelectItem>
              {categoriesLoading ? (
                <SelectItem value="loading" disabled className="text-xs">
                  Đang tải...
                </SelectItem>
              ) : (
                categories?.map((category) => (
                  <SelectItem key={category.id} value={category.slug} className="text-xs">
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
            <div className="space-y-1.5">
              <div className="text-[10px] text-muted-foreground">Đang lọc:</div>
              <div className="flex flex-wrap gap-1.5">
                {currentCategory && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    Danh mục:{" "}
                    {categories?.find((c) => c.slug === currentCategory)?.name}
                  </Badge>
                )}
                {currentTag && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20">
                    Thẻ: #{currentTag}
                    <button
                      onClick={() => updateFilters("tag", "")}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-2 w-2" />
                    </button>
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
