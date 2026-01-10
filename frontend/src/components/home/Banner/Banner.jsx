"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Play,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
// import { memoryMedia } from "@/data/beeitMedia";

import Logo from "../../layout/Header/logo";
import Nav from "../../layout/Header/nav";
import Search from "../../layout/Header/search";
import Account from "../../layout/Header/account";
import { ModeToggle } from "@/components/mode-toggle";
import Header from "@/components/layout/Header";

const Banner = ({ latestEvent }) => {
  const [mounted, setMounted] = useState(false);
  const bannerRef = useRef(null);

  // Lấy ra 7 hình ảnh tiêu biểu từ local
  const galleryImages = [
    { src: "/1.jpg", title: "BeeIT Club", caption: "Hoạt động CLB" },
    { src: "/2.jpg", title: "BeeIT Club", caption: "Workshop" },
    { src: "/3.jpg", title: "BeeIT Club", caption: "Sự kiện" },
    { src: "/4.jpg", title: "BeeIT Club", caption: "Thành viên" },
    { src: "/5.jpg", title: "BeeIT Club", caption: "Cộng đồng" },
    { src: "/6.jpg", title: "BeeIT Club", caption: "Talkshow" },
    { src: "/7.jpg", title: "BeeIT Club", caption: "Giao lưu" },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-screen bg-background" />;

  return (
    <div
      ref={bannerRef}
      className="relative w-full min-h-screen lg:h-screen overflow-hidden flex flex-col bg-background transition-colors duration-500 pt-[50px]"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 dark:bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 dark:bg-orange-600/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Subtle Noise Texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="relative z-10 flex-1 flex items-center w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* === LEFT CONTENT (40%) === */}
        <div className="lg:col-span-5 space-y-8 order-2 lg:order-1 pb-12 lg:pb-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            The Digital Hive
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter">
              <span className="text-primary">BEE</span>{" "}
              <span className="text-slate-600 dark:text-slate-300">IT</span>{" "}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600 dark:from-primary dark:to-orange-400">
                CLUB
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-md font-medium leading-relaxed">
              Kiến tạo tương lai thông qua những dòng code, kết nối cộng đồng lập trình viên đam mê tại <span className="text-foreground italic font-bold text-slate-900 dark:text-slate-100">FPT Polytechnic</span>.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href={latestEvent ? `/events/${latestEvent.slug}` : "/apply"}
              className="group relative px-8 py-4 bg-primary text-white font-bold rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] active:scale-95 flex items-center gap-2"
            >
              <span className="relative z-10">{latestEvent ? "Đăng ký sự kiện" : "Gia nhập ngay"}</span>
              <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <Link
              href="/post"
              className="px-8 py-4 bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold rounded-full backdrop-blur-md hover:bg-slate-100 dark:hover:bg-white/10 transition-all flex items-center gap-2 group active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              Khám phá Blog
            </Link>
          </div>

        </div>

        {/* === RIGHT GALLERY (60%) === */}
        <div className="lg:col-span-7 order-1 lg:order-2 h-[500px] lg:h-[700px] relative mt-12 lg:mt-0">
          {/* Bento Grid Gallery */}
          <div className="relative w-full h-full grid grid-cols-12 grid-rows-12 gap-4">

            {/* Main large image */}
            <div className="col-span-8 row-span-7 rounded-3xl overflow-hidden border border-border shadow-xl group relative">
              <img
                src={galleryImages[0].src}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="BeeIT Activity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">{galleryImages[0].title}</p>
                <p className="text-sm font-medium">{galleryImages[0].caption}</p>
              </div>
            </div>

            {/* Top right small image */}
            <div className="col-span-4 row-span-4 rounded-3xl overflow-hidden border border-border shadow-lg group relative">
              <img
                src={galleryImages[1].src}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="BeeIT Workshop"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay group-hover:opacity-0 transition-opacity" />
            </div>

            {/* Middle right small image */}
            <div className="col-span-4 row-span-4 rounded-3xl overflow-hidden border border-border shadow-lg group relative">
              <img
                src={galleryImages[2].src}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="BeeIT Awards"
              />
            </div>

            {/* Bottom left small image */}
            <div className="col-span-5 row-span-5 rounded-3xl overflow-hidden border border-border shadow-lg group relative">
              <img
                src={galleryImages[3].src}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="BeeIT Members"
              />
            </div>

            {/* Bottom right image */}
            <div className="col-span-7 row-span-5 rounded-3xl overflow-hidden border border-border shadow-lg group relative">
              <img
                src={galleryImages[4].src}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="BeeIT Community"
              />
              {/* Event Floating Badge if exist */}
              {latestEvent && (
                <div className="absolute top-4 right-4 p-4 rounded-2xl bg-card/80 backdrop-blur-xl border border-border shadow-xl text-foreground animate-bounce-slow">
                  <p className="text-[10px] font-black uppercase tracking-tighter text-primary">Sắp diễn ra</p>
                  <p className="text-xs font-bold line-clamp-1">{latestEvent.title}</p>
                </div>
              )}
            </div>
          </div>

          {/* Abstract background shapes */}
          <div className="absolute -top-10 -right-10 w-32 h-32 border border-primary/10 rounded-full animate-spin-slow" />
          <div className="absolute -bottom-10 -left-10 w-20 h-20 border border-primary/10 rounded-lg rotate-45 animate-pulse" />
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin 15s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Banner;
