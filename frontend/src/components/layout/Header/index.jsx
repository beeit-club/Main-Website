// common/: Components chung, không thuộc module cụ thể.
import React from "react";
import Logo from "./logo";
import Nav from "./nav";
import Search from "./search";
import Account from "./account";
import { ModeToggle } from "@/components/mode-toggle";

export default function Header() {
  return (
    <div className=" border-b-2 sticky top-0 z-50 ">
      <div className="flex justify-between max-w-7xl mx-auto h-16 items-center">
        <div className="flex gap-11 items-center">
          {/* logo */}
          <div>
            <Logo />
          </div>
          {/* end logo */}
          {/* nav */}
          <div>
            <Nav />
          </div>
          {/* end nav */}
        </div>
        {/* =========== */}
        <div className="flex gap-5 items-center">
          {/* search */}
          <div>
            <Search />
          </div>
          {/* end search */}
          {/* togole dark */}
          <ModeToggle />
          {/* end mode toggle */}
          {/* account */}
          <div>
            <Account />
          </div>
          {/* end account */}
        </div>
      </div>
    </div>
  );
}
