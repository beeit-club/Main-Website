"use client";
import SafeImage from "@/components/common/SafeImage";
import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const Banner = ({ latestEvent }) => {
  const [mounted, setMounted] = useState(false);
  const bannerRef = useRef(null);

  // Constants
  const HERO_CHANGE_INTERVAL = 5000;

  // Pool of hero images (for the main large slot)
  const heroImages = [
    { src: "/1.jpg", title: "BeeIT Club", caption: "Hoạt động CLB" },
    { src: "/6.jpg", title: "BeeIT Club", caption: "Talkshow" },
    { src: "/7.jpg", title: "BeeIT Club", caption: "Giao lưu" },
  ];

  // Static images for the small slots (indices 1, 2, 3, 4)
  const smallImages = [
    { src: "/2.jpg", title: "BeeIT Club", caption: "Workshop" },
    { src: "/3.jpg", title: "BeeIT Club", caption: "Sự kiện" },
    { src: "/4.jpg", title: "BeeIT Club", caption: "Thành viên" },
    { src: "/5.jpg", title: "BeeIT Club", caption: "Cộng đồng" },
  ];

  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    setMounted(true);

    // Timer to change only the HERO image
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, HERO_CHANGE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return <div className="h-screen bg-background" />;

  // Animation variants for the Hero Image (Crossfade + Subtle Zoom)
  const heroVariants = {
    initial: { opacity: 0, scale: 1.05 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0 },
  };

  const renderSlot = (slotIndex, className = "") => {
    // Slot 0: Dynamic Hero
    if (slotIndex === 0) {
      const image = heroImages[currentHeroIndex];
      return (
        <div className={`relative overflow-hidden group ${className}`}>
          <div className="relative w-full h-full">
            <AnimatePresence mode="popLayout">
              <motion.img
                key={`hero-${currentHeroIndex}`}
                src={image.src}
                alt={image.caption}
                variants={heroVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Overlay for Hero */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 z-10" />

            {/* Text also animates gently */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${currentHeroIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute bottom-6 left-6 text-white z-20"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                  {image.title}
                </p>
                <p className="text-sm font-medium">{image.caption}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      );
    }

    // Slots 1-4: Static Images
    else {
      // Adjust index to map 1->0, 2->1 for smallImages array
      // slotIndex 1 uses smallImages[0], etc.
      const image = smallImages[slotIndex - 1];
      if (!image) return null;

      return (
        <div className={`relative overflow-hidden group ${className}`}>
          <img
            src={image.src}
            alt={image.caption}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {slotIndex === 1 && (
            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity z-10" />
          )}

          {slotIndex === 4 && latestEvent && (
            <div className="absolute top-4 right-4 p-4 rounded-2xl bg-card/80 backdrop-blur-xl border border-border shadow-xl text-foreground animate-bounce-slow z-20">
              <p className="text-[10px] font-black uppercase tracking-tighter text-primary">
                Sắp diễn ra
              </p>
              <p className="text-xs font-bold line-clamp-1">
                {latestEvent.title}
              </p>
            </div>
          )}
        </div>
      );
    }
  };

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
              Kiến tạo tương lai thông qua những dòng code, kết nối cộng đồng lập
              trình viên đam mê tại{" "}
              <span className="text-foreground italic font-bold text-slate-900 dark:text-slate-100">
                FPT Polytechnic
              </span>
              .
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href={latestEvent ? `/events/${latestEvent.slug}` : "/apply"}
              className="group relative px-8 py-4 bg-primary text-white font-bold rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] active:scale-95 flex items-center gap-2"
            >
              <span className="relative z-10">
                {latestEvent ? "Đăng ký sự kiện" : "Gia nhập ngay"}
              </span>
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
          <div className="relative w-full h-full grid grid-cols-12 grid-rows-12 gap-4">
            {/* Slot 0: Main large image - col-span-8 row-span-7 */}
            {renderSlot(
              0,
              "col-span-8 row-span-7 rounded-3xl border border-border shadow-2xl"
            )}

            {/* Slot 1: Top right small - col-span-4 row-span-4 */}
            {renderSlot(
              1,
              "col-span-4 row-span-4 rounded-3xl border border-border shadow-xl"
            )}

            {/* Slot 2: Middle right small - col-span-4 row-span-4 */}
            {renderSlot(
              2,
              "col-span-4 row-span-4 rounded-3xl border border-border shadow-xl"
            )}

            {/* Slot 3: Bottom left small - col-span-5 row-span-5 */}
            {renderSlot(
              3,
              "col-span-5 row-span-5 rounded-3xl border border-border shadow-xl"
            )}

            {/* Slot 4: Bottom right image - col-span-7 row-span-5 */}
            {renderSlot(
              4,
              "col-span-7 row-span-5 rounded-3xl border border-border shadow-xl"
            )}
          </div>

          {/* Abstract background shapes */}
          <div className="absolute -top-10 -right-10 w-32 h-32 border border-primary/10 rounded-full animate-spin-slow" />
          <div className="absolute -bottom-10 -left-10 w-20 h-20 border border-primary/10 rounded-lg rotate-45 animate-pulse" />
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        .animate-spin-slow {
          animation: spin 15s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        /* Bounce slow used by Event badge if present */
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Banner;
