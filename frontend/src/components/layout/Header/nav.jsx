import React from "react";

export default function Nav() {
  return (
    <div>
      <ul className="flex gap-5 ">
        <li className=" p-2 font-medium ">Trang chủ</li>
        <li className=" p-2 font-medium ">Bài viết</li>
        <li className=" p-2 font-medium ">Hỏi đáp</li>
        <li className=" p-2 font-medium ">Tài liệu</li>
        <li className=" p-2 font-medium ">Sự kiện</li>
        <li className=" p-2 font-medium ">Thành viên</li>
      </ul>
    </div>
  );
}
