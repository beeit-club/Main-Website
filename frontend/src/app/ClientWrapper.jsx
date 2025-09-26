// app/ClientWrapper.jsx
"use client";

import { useAuthInit } from "@/hooks/useAuthInit";

export default function ClientWrapper({ children }) {
  useAuthInit();
  return <>{children}</>;
}
