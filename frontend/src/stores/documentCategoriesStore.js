"use client";

import { create } from "zustand";

export const useDocumentCategoriesStore = create((set, get) => ({
  // State
  documentCategories: [],
  isLoading: false,
  error: null,
  isInitialized: false,

  // Actions
  setDocumentCategories: (documentCategories) =>
    set({
      documentCategories,
      isLoading: false,
      error: null,
      isInitialized: true,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) =>
    set({
      error,
      isLoading: false,
    }),

  // Fetch documentCategories from API
  fetchDocumentCategories: async (forceRefresh = false) => {
    // Nếu đã fetch rồi và không phải force refresh thì không fetch lại
    if (get().isInitialized && !forceRefresh) return;

    set({ isLoading: true, error: null });

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BACKEND;
      // Thêm timestamp để bypass cache
      const timestamp = new Date().getTime();
      const res = await fetch(`${baseUrl}/client/documentCategory?t=${timestamp}`, {
        method: "GET",
        cache: "no-store", // Không cache
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch documentCategories: ${res.status}`);
      }

      const response = await res.json();

      if (response.status === "success") {
        set({
          documentCategories: response.data?.documentCategories.data || [],
          isLoading: false,
          error: null,
          isInitialized: true,
        });
      } else {
        throw new Error(response.message || "Failed to fetch documentCategories");
      }
    } catch (error) {
      console.error("Error fetching documentCategories:", error);
      set({
        error: error.message,
        isLoading: false,
        documentCategories: [],
      });
    }
  },

  // Reset store và fetch lại
  reset: () =>
    set({
      documentCategories: [],
      isLoading: false,
      error: null,
      isInitialized: false,
    }),

  // Force refresh - reset và fetch lại
  forceRefresh: async () => {
    get().reset();
    await get().fetchDocumentCategories(true);
  },
}));

// Helper function to build tree structure (reuse từ categoriesStore)
export function buildDocumentCategoryTree(documentCategories, parentId = null) {
  const tree = [];
  const children = documentCategories.filter((item) => item.parent_id === parentId);

  for (const item of children) {
    const grandchildren = buildDocumentCategoryTree(documentCategories, item.id);
    tree.push({
      ...item,
      children: grandchildren,
    });
  }

  return tree;
}

