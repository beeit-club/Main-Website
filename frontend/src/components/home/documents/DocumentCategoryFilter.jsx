"use client";

import { useEffect, useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDocumentCategoriesStore } from "@/stores/documentCategoriesStore";

export function DocumentCategoryFilter({
  selectedCategoryId,
  onCategoryChange,
  documents,
}) {
  const { documentCategories, isLoading, fetchDocumentCategories } =
    useDocumentCategoriesStore();

  useEffect(() => {
    if (!isLoading && documentCategories.length === 0) {
      fetchDocumentCategories();
    }
  }, [isLoading, documentCategories.length, fetchDocumentCategories]);

  // Đếm số lượng documents theo category
  const categoryCounts = useMemo(() => {
    const counts = {};
    documents.forEach((doc) => {
      const catId = doc.category_id;
      if (catId) {
        counts[catId] = (counts[catId] || 0) + 1;
      }
    });
    return counts;
  }, [documents]);

  const handleCategoryClick = (categoryId) => {
    if (selectedCategoryId === categoryId) {
      // Nếu đã chọn thì bỏ chọn (hiển thị tất cả)
      onCategoryChange(null);
    } else {
      onCategoryChange(categoryId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2 mb-8">
        <Badge variant="outline" className="animate-pulse">
          Đang tải danh mục...
        </Badge>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategoryId === null ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryClick(null)}
          className="rounded-full"
        >
          Tất cả ({documents.length})
        </Button>
        {documentCategories.map((category) => {
          const count = categoryCounts[category.id] || 0;
          if (count === 0) return null; // Không hiển thị category không có document

          return (
            <Button
              key={category.id}
              variant={
                selectedCategoryId === category.id ? "default" : "outline"
              }
              size="sm"
              onClick={() => handleCategoryClick(category.id)}
              className="rounded-full"
            >
              {category.name} ({count})
            </Button>
          );
        })}
      </div>
    </div>
  );
}
