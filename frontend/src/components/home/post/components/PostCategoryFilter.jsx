"use client";

import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useCategoriesStore } from "@/stores/categoriesStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function PostCategoryFilter() {
  const { categories, isLoading, fetchCategories } = useCategoriesStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!isLoading && categories.length === 0) {
      fetchCategories();
    }
  }, [isLoading, categories.length, fetchCategories]);

  const currentCategory = searchParams.get("category") || null;

  const handleCategoryClick = (categorySlug) => {
    const params = new URLSearchParams(searchParams);

    if (currentCategory === categorySlug) {
      // Nếu đã chọn thì bỏ chọn (hiển thị tất cả)
      params.delete("category");
    } else {
      params.set("category", categorySlug);
    }

    params.set("page", "1"); // Reset về trang 1

    startTransition(() => {
      router.push(`/post?${params.toString()}`);
    });
  };

  const handleAllClick = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    params.set("page", "1");

    startTransition(() => {
      router.push(`/post?${params.toString()}`);
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2 mb-8">
        <Button variant="outline" size="sm" className="rounded-full" disabled>
          Đang tải danh mục...
        </Button>
      </div>
    );
  }

  // Categories từ store là flat array, không cần flatten
  const allCategories = categories || [];

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={currentCategory === null ? "default" : "outline"}
          size="sm"
          onClick={handleAllClick}
          className="rounded-full"
          disabled={isPending}
        >
          Tất cả
        </Button>
        {allCategories.map((category) => {
          return (
            <Button
              key={category.id}
              variant={
                currentCategory === category.slug ? "default" : "outline"
              }
              size="sm"
              onClick={() => handleCategoryClick(category.slug)}
              className="rounded-full"
              disabled={isPending}
            >
              {category.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
