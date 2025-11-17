// app/ClientWrapper.jsx
"use client";

import { useAuthInit } from "@/hooks/useAuthInit";
import { useCategoriesInit } from "@/hooks/useCategoriesInit";

export default function ClientWrapper({ children }) {
  useAuthInit();
  useCategoriesInit(); // Init categories khi app load
  return <>{children}</>;
}
