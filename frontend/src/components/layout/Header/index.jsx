// common/Header.js
"use client";
import React, { useEffect, useState } from "react";
import Logo from "./logo";
import Nav from "./nav";
import HamburgerMenu from "./hamburger-menu";
import Search from "./search";
import Account from "./account";
import dynamic from "next/dynamic";

const ModeToggle = dynamic(
  () => import("@/components/mode-toggle").then((mod) => mod.ModeToggle),
  { ssr: false }
);
import { usePathname } from "next/navigation";

export default function Header() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const isHomePage = pathname === "/";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

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
  }, [lastScrollY, mounted]);

  // Show header if mounted and show state is true
  const shouldShowHeader = mounted && show;

  // Adaptive background opacity
  // On HomePage at top: transparent/20
  // Scrolled or other pages: background/60
  const isTransparent = isHomePage && lastScrollY <= 100;
  const pillClass = `backdrop-blur-md border border-border/40 px-2 h-12 rounded-full flex items-center shadow-sm hover:shadow-md transition-all ${isTransparent ? "bg-background/20" : "bg-background/60"
    }`;

  // Larger padding for Logo pill
  const logoPillClass = `backdrop-blur-md border border-border/40 px-4 h-12 rounded-full flex items-center shadow-sm hover:shadow-md transition-all ${isTransparent ? "bg-background/20" : "bg-background/60"
    }`;

  return (
    <>
      {/* On HomePage, we don't want the spacer because Banner is at top. 
          On other pages, we want h-20 spacer. 
      */}
      {!isHomePage && <div className="h-20" />}

      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 py-4 ${shouldShowHeader ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center gap-2">
            <div className={`lg:hidden ${pillClass}`}>
              <HamburgerMenu />
            </div>
            {/* 1. LEFT: Mobile Menu (Visible < lg) + Logo */}
            <div className="flex items-center gap-2">
              <div className={logoPillClass}>
                <Logo />
              </div>
            </div>

            {/* 2. CENTER: Desktop Nav (Visible >= lg) */}
            <div className={`hidden lg:flex ${pillClass}`}>
              <Nav />
            </div>

            {/* 3. RIGHT: Actions */}
            <div className="flex items-center gap-2">
              <div className={pillClass}>
                <div className="flex items-center gap-1">
                  <Search />
                  <div className="w-[1px] h-5 bg-border/60 mx-1" />
                  <ModeToggle />
                  <div className="hidden sm:flex items-center">
                    <div className="w-[1px] h-5 bg-border/60 mx-1" />
                    <Account />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}