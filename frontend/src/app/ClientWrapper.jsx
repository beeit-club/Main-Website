// app/ClientWrapper.jsx
"use client";

import { useAuthInit } from "@/hooks/useAuthInit";
import { useCategoriesInit } from "@/hooks/useCategoriesInit";
import { useDocumentCategoriesInit } from "@/hooks/useDocumentCategoriesInit";

export default function ClientWrapper({ children }) {
  useAuthInit();
  useCategoriesInit(); // Init categories khi app load
  useDocumentCategoriesInit(); // Init documentCategories khi app load
  return <>{children}</>;
}
