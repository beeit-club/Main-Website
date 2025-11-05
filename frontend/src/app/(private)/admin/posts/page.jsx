"use client";
import { columns } from "@/components/admin/components/posts/columns";
import { DataTable } from "@/components/admin/components/posts/data-table";
import { Button } from "@/components/ui/button";
// import { columns } from "@/components/admin/components/posts/columns";
import { postServices } from "@/services/admin/post";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Thư viện này rất nặng và sẽ không được tải cho đến khi cần
// CÁCH MỚI (Dành cho named export 'DataTable')
const HeavyChartComponent = dynamic(
  () =>
    import("@/components/admin/components/posts/data-table").then(
      (mod) => mod.DataTable // <--- Thêm dòng này
    ),
  {
    ssr: false,
    loading: () => <p>Đang tải bảng...</p>,
  }
);
export default function ListPost() {
  const [data, setData] = useState([]);
  async function getPost() {
    const res = await postServices.getAllPost();
    setData(res?.data.data.data);
  }
  useEffect(() => {
    getPost();
  }, []);
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Danh sách bài viết</h1>
        <Link href={"/admin/posts/add"}>
          <Button>Thêm bài viết</Button>
        </Link>
      </div>
      <HeavyChartComponent columns={columns} data={data} />
    </div>
  );
}
