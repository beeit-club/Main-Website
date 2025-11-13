// common/Header.js
"use client";
import React, { useEffect, useState } from "react";
import Logo from "./logo";
import Nav from "./nav";
import Search from "./search";
import Account from "./account";
import { ModeToggle } from "@/components/mode-toggle";

export default function Header() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // cuộn xuống
        setShow(false);
      } else {
        // cuộn lên
        setShow(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="h-20">
      <header
        className={` fixed left-0 right-0 top-0 z-50 transition-transform duration-300 bg-background ${
          show ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex justify-between max-w-7xl mx-auto h-20 items-center px-4 py-6">
          {/* logo */}
          <div className=" order-2 lg:order-1">
            <Logo />
          </div>
          {/* nav */}
          <div className=" order-1 lg:order-2">
            <Nav />
          </div>
          {/* </div> */}
          <div className=" order-3 flex gap-5 items-center lg:order-3">
            <Search />

            <Account />
          </div>
        </div>
      </header>
    </div>
  );
}
