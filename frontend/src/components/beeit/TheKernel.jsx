"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Github, Linkedin, Facebook, Mail, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Default leaders nếu không có data
const defaultLeaders = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    role: "FOUNDER / CỐ VẤN",
    image_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop",
    bio: 'Người đặt viên gạch đầu tiên cho BEE IT. Với tầm nhìn kiến tạo một "tổ ong" kỹ thuật số, anh đã dẫn dắt CLB từ nhóm học tập nhỏ thành cộng đồng công nghệ lớn mạnh.',
    github_url: null,
    linkedin_url: null,
    facebook_url: null,
    email: "founder@beeit.club",
  },
];

const TheKernel = ({ leaders = [] }) => {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Sử dụng leaders từ props hoặc default
  const displayLeaders = leaders.length > 0 ? leaders : defaultLeaders;
  const activeLeader = displayLeaders[activeIndex] || displayLeaders[0];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const stepCount = displayLeaders.length;

      // Pin the section and scrub through indices
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${stepCount * 500}`, // 500px scroll per person
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          // Calculate index based on scroll progress
          const idx = Math.floor(self.progress * stepCount * 0.999);
          const safeIdx = Math.max(0, Math.min(idx, stepCount - 1));
          setActiveIndex(safeIdx);
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [displayLeaders.length]);

  // Animation when activeIndex changes
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. Image Transition (Zoom out effect)
      gsap.fromTo(
        ".kernel-image",
        { scale: 1.1, filter: "brightness(0.5)" },
        { scale: 1, filter: "brightness(1)", duration: 1.5, ease: "power2.out" }
      );

      // 2. Text Animation (Stagger up)
      gsap.fromTo(
        [".kernel-role", ".kernel-name", ".kernel-bio", ".kernel-socials"],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );

      // 3. Counter Animation
      gsap.fromTo(
        ".kernel-counter",
        { scale: 1.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [activeIndex]);

  if (!activeLeader) return null;

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full bg-background overflow-hidden flex flex-col md:flex-row"
    >
      {/* === LEFT COLUMN: VISUAL / IMAGE === */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden bg-black">
        {/* The Image */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent z-10 md:hidden"></div>
          <div className="absolute inset-0 bg-gradient-to-l from-background via-transparent to-transparent z-10 hidden md:block"></div>
          <img
            key={activeLeader.image_url || activeLeader.id}
            src={activeLeader.image_url || "/logo.jpg"}
            alt={activeLeader.name}
            className="kernel-image w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Decorative Tech Overlay on Image */}
        <div className="absolute bottom-8 left-8 z-20 hidden md:block">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-primary animate-pulse"></div>
            <span className="font-mono text-xs text-primary/80 tracking-widest">
              LIVE_FEED :: CAM_0{activeIndex + 1}
            </span>
          </div>
          <div className="h-[1px] w-32 bg-white/20"></div>
        </div>
      </div>

      {/* === RIGHT COLUMN: CONTENT === */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center px-6 md:px-16 lg:px-24 relative bg-background border-t border-white/10 md:border-t-0 md:border-l">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
          <ArrowRight size={100} className="text-white -rotate-45" />
        </div>

        <div className="max-w-xl">
          {/* 1. Counter / Status */}
          <div className="flex items-end gap-4 mb-8 text-white/30 font-mono">
            <span className="kernel-counter text-6xl font-bold text-white/10 block leading-none">
              0{activeIndex + 1}
            </span>
            <span className="text-sm pb-2">/ 0{displayLeaders.length}</span>
            <div className="h-[1px] flex-1 bg-white/10 mb-2">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{
                  width: `${((activeIndex + 1) / displayLeaders.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* 2. Main Text Info */}
          <div className="mb-2">
            <span className="kernel-role inline-block py-1 px-2 border border-primary/30 text-primary text-xs font-mono tracking-widest mb-4">
              {activeLeader.role}
            </span>
          </div>

          <h2 className="kernel-name text-4xl md:text-5xl lg:text-7xl font-display font-bold text-heading mb-6 leading-[1.1]">
            {activeLeader.name}
          </h2>

          <p className="kernel-bio text-lg md:text-xl text-gray-400 font-light leading-relaxed mb-10 border-l-2 border-white/10 pl-6">
            {activeLeader.bio}
          </p>

          {/* 3. Social Actions */}
          <div className="kernel-socials flex items-center gap-6">
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
              Connect:
            </span>
            {activeLeader.github_url && (
              <a
                href={activeLeader.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github size={24} />
              </a>
            )}
            {activeLeader.linkedin_url && (
              <a
                href={activeLeader.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
            )}
            {activeLeader.facebook_url && (
              <a
                href={activeLeader.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
            )}
            {activeLeader.email && (
              <a
                href={`mailto:${activeLeader.email}`}
                className="text-gray-400 hover:text-red-400 transition-colors"
                aria-label="Email"
              >
                <Mail size={24} />
              </a>
            )}
          </div>
        </div>

        {/* Scroll Indicator Hint */}
        <div className="absolute bottom-8 right-8 font-mono text-[10px] text-gray-600 animate-pulse hidden md:block">
          SCROLL_TO_NAVIGATE [ v ]
        </div>
      </div>
    </section>
  );
};

export default TheKernel;
