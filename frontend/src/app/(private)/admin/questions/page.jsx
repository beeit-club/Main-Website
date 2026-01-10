// src/app/admin/questions/page.jsx
"use client";
import { columns } from "@/components/admin/components/questions/columns";
import { DataTable } from "@/components/admin/components/questions/data-table";
import { questionServices } from "@/services/admin/questionServices";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ListQuestions() {
  const [data, setData] = useState([]);

  async function getQuestions() {
    try {
      const res = await questionServices.getQuestionsPaginated();
      setData(res?.data.data.data || []);
    } catch (error) {
      toast.error("Lấy danh sách câu hỏi thất bại");
    }
  }

  useEffect(() => {
    getQuestions();
  }, []);

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Danh sách Câu hỏi</h1>
        {/* Admin không có nút Thêm Câu hỏi */}
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
