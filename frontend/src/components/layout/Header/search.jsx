import React from "react";
import { Search } from "lucide-react";
export default function SearchHeader() {
  return (
    <div>
      <form method="get" className="relative max-w-80 min-w-72 w-full  h-9">
        <input
          className=" max-w-80 min-w-72 w-full  rounded-md  border h-9 px-2"
          type="text"
          name="search"
          placeholder="Tìm kiếm..."
        />
        <button className=" absolute right-2 top-1/2   -translate-y-1/2">
          <Search />
        </button>
      </form>
    </div>
  );
}
