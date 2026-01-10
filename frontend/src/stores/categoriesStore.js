"use client";

import { create } from "zustand";

export const useCategoriesStore = create((set, get) => ({
  // State
  categories: [],
  isLoading: false,
  error: null,
  isInitialized: false,

  // Actions
  setCategories: (categories) =>
    set({
      categories,
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

  // Fetch categories from API
  fetchCategories: async () => {
    // Nếu đã fetch rồi thì không fetch lại
    if (get().isInitialized) return;

    set({ isLoading: true, error: null });

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BACKEND;
      const res = await fetch(`${baseUrl}/client/category`, {
        method: "GET",
        cache: "force-cache", // Cache permanently
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch categories: ${res.status}`);
      }

      const response = await res.json();

      if (response.status === "success") {
        set({
          categories: response.data?.categories.data || [],
          isLoading: false,
          error: null,
          isInitialized: true,
        });
      } else {
        throw new Error(response.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      set({
        error: error.message,
        isLoading: false,
        categories: [],
      });
    }
  },

  // Reset store (nếu cần)
  reset: () =>
    set({
      categories: [],
      isLoading: false,
      error: null,
      isInitialized: false,
    }),
}));

// Helper function to build tree structure
export function buildCategoryTree(categories, parentId = null) {
  const tree = [];
  const children = categories.filter((item) => item.parent_id === parentId);

  for (const item of children) {
    const grandchildren = buildCategoryTree(categories, item.id);
    tree.push({
      ...item,
      children: grandchildren,
    });
  }

  return tree;
}
