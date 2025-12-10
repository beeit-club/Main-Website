"use client";

import { useEffect, useRef } from "react";
import { memoryMedia } from "@/data/beeitMedia";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Pinned horizontal gallery: khi cuộn xuống, trang được ghim và chỉ thay đổi ảnh.
 * Khi cuộn ngược lên, không áp dụng hiệu ứng, unpin ngay.
 */
const MemoryScroller = () => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(0); // Lưu progress để không lùi lại

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const track = trackRef.current;
      
      // Tính toán chiều rộng cần scroll
      const totalWidth = track.scrollWidth - container.offsetWidth;
      
      // Tween để di chuyển track
      const tween = gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        duration: 1,
        paused: true,
      });

      let trigger = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: () => `+=${totalWidth + window.innerHeight * 0.3}`,
        scrub: 0.5, // Smooth scrub
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Chỉ cho progress tăng, không giảm khi cuộn ngược
          const currentProgress = self.progress;
          if (currentProgress > progressRef.current) {
            progressRef.current = currentProgress;
            tween.progress(currentProgress);
          } else {
            // Khi cuộn ngược, giữ nguyên progress hiện tại
            tween.progress(progressRef.current);
          }
        },
        onEnter: () => {
          // Reset progress khi vào section từ trên xuống
          progressRef.current = 0;
          tween.progress(0);
        },
        onLeave: () => {
          // Khi cuộn xuống hết section, đảm bảo progress = 1
          progressRef.current = 1;
          tween.progress(1);
        },
        onLeaveBack: () => {
          // Khi cuộn ngược lên ra khỏi section, kill trigger để unpin ngay
          trigger.kill();
          // Tạo lại trigger khi vào lại từ trên xuống
          setTimeout(() => {
            progressRef.current = 0;
            tween.progress(0);
          }, 100);
        },
      });

      // Cleanup
      return () => {
        trigger?.kill();
      };
    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === containerRef.current) {
          st.kill();
        }
      });
    };
  }, []);

  // Chỉ dùng 7 ảnh đầu
  const images = memoryMedia.slice(0, 7);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-gradient-to-b from-black via-[#0b0b0f] to-[#0b0b0f]"
      style={{ minHeight: "80vh" }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle_at_20%_30%,rgba(255,193,7,0.18),transparent_35%),radial-gradient(circle_at_80%_60%,rgba(255,255,255,0.1),transparent_30%)]" />
      <div className="absolute top-6 left-6 text-white/70 uppercase tracking-[0.3em] text-xs font-semibold z-10">
        Memory Flow
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center z-10">
        <p className="text-white/80 text-sm">
          Cuộn để xem ảnh tiếp theo • Hết ảnh sẽ tiếp tục trang
        </p>
      </div>

      <div
        ref={trackRef}
        className="flex h-[70vh] items-center gap-6 px-8"
        style={{ willChange: "transform" }}
      >
        {images.map((item) => (
          <div
            key={item.id}
            className="relative w-[70vw] sm:w-[55vw] md:w-[45vw] lg:w-[35vw] h-[60vh] flex-shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur"
          >
            <img
              src={item.src}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2 text-white">
              <div className="text-xs uppercase tracking-[0.25em] text-[#FFC107] font-semibold">
                {item.title}
              </div>
              <div className="text-lg font-bold leading-tight">{item.caption}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MemoryScroller;
