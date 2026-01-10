"use client";

import { useEffect } from "react";
import { useDocumentCategoriesStore } from "@/stores/documentCategoriesStore";

/**
 * Hook để init documentCategories khi app load
 * Dùng trong ClientWrapper (root level)
 */
export function useDocumentCategoriesInit() {
  const { fetchDocumentCategories, isInitialized } = useDocumentCategoriesStore();

  useEffect(() => {
    // Fetch với force refresh = false (chỉ fetch nếu chưa init)
    if (!isInitialized) {
      fetchDocumentCategories(false);
    }
  }, [fetchDocumentCategories, isInitialized]);
}

