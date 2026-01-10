"use client";

import { useEffect } from "react";
import { useCategoriesStore } from "@/stores/categoriesStore";

/**
 * Hook để init categories khi app load
 * Dùng trong ClientWrapper (root level)
 */
export function useCategoriesInit() {
  const { fetchCategories, isInitialized } = useCategoriesStore();

  useEffect(() => {
    // Chỉ fetch nếu chưa init
    if (!isInitialized) {
      fetchCategories();
    }
  }, [fetchCategories, isInitialized]);
}
