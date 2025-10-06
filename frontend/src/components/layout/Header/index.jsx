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
        className={`border-b-2 fixed left-0 right-0 top-0 z-50 bg-background transition-transform duration-300 ${
          show ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex justify-between max-w-7xl mx-auto h-20 items-center px-4 py-6">
          <div className="flex gap-11 items-center">
            {/* logo */}
            <Logo />
            {/* nav */}
            <Nav />
          </div>
          <div className="flex gap-5 items-center">
            <Search />
            <ModeToggle />
            <Account />
          </div>
        </div>
      </header>
    </div>
  );
}
