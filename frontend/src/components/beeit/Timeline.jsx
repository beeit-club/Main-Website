"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Target, Flag, Zap, Users, ShieldCheck } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// --- DATA: CORE PILLARS (Formerly About) ---
const corePillars = [
  {
    icon: <Target size={32} />,
    title: "Mục Tiêu",
    desc: "Xây dựng cộng đồng CNTT vững mạnh.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    icon: <Flag size={32} />,
    title: "Sứ Mệnh",
    desc: "Lan tỏa đam mê, trang bị kỹ năng thực chiến.",
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/20",
  },
  {
    icon: <Zap size={32} />,
    title: "Giá Trị",
    desc: "Đam mê - Sáng tạo - Hợp tác - Học hỏi.",
    color: "text-secondary",
    bg: "bg-secondary/10",
    border: "border-secondary/20",
  },
  {
    icon: <Users size={32} />,
    title: "Cộng Đồng",
    desc: "Kết nối Mentor, Alumni và Doanh nghiệp.",
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
];

// --- DATA: TIMELINE EVENTS ---
const events = [
  {
    id: "1",
    year: "2018",
    title: "Khởi Tạo (Beta)",
    description:
      "Ý tưởng về một sân chơi công nghệ tại FPT Polytechnic được hình thành.",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "2",
    year: "01/07/2023",
    title: "Chính Thức Ra Mắt",
    description:
      "BEE IT Club chính thức thành lập (Version 1.0). Đặt nền móng đầu tiên cho hệ sinh thái.",
    image:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    year: "2023",
    title: "Hackathon Đầu Tiên",
    description:
      'Tổ chức thành công "Code Battle S1" - Thu hút 50+ đội thi tham gia.',
    image:
      "https://images.unsplash.com/photo-1504384308090-c54be3855833?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "4",
    year: "2024",
    title: "Kỷ Nguyên Mới",
    description:
      "Mở rộng hợp tác với 10+ Doanh nghiệp công nghệ. Ra mắt hệ thống Mentor F1.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
  },
];

const Timeline = () => {
  const containerRef = useRef(null);
  const lineRef = useRef(null);
  const coreRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Animate Core Pillars (The Cards at the top)
      gsap.from(".core-card", {
        y: 50,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: coreRef.current,
          start: "top 80%",
        },
      });

      // 2. Animate the SVG circuit line
      // Ensure the line draws down as we scroll through the events
      if (lineRef.current) {
        const length = lineRef.current.getTotalLength() || 0;
        gsap.set(lineRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ".timeline-events-container", // Start drawing when events section hits
            start: "top center",
            end: "bottom center",
            scrub: 1,
          },
        });
      }

      // 3. Animate Timeline Items appearing
      gsap.utils.toArray(".timeline-item").forEach((item) => {
        gsap.from(item, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative py-24 bg-[#080808] overflow-hidden"
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* === PART 1: IDENTITY CORE (Formerly About) === */}
        <div ref={coreRef} className="mb-24">
          {/* Intro Header */}
          <div className="flex flex-col md:flex-row gap-12 items-start mb-16 border-b border-white/10 pb-12">
            <div className="md:w-1/3">
              <div className="flex items-center gap-2 mb-4 text-primary">
                <ShieldCheck size={20} />
                <span className="font-mono text-xs tracking-widest uppercase">
                  System_Identity
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-heading leading-tight">
                MẠCH ĐIỆN <br />{" "}
                <span
                  className="text-transparent stroke-text"
                  style={{ WebkitTextStroke: "1px #FFD60A" }}
                >
                  KÝ ỨC
                </span>
              </h2>
            </div>

            <div className="md:w-2/3 space-y-6 text-gray-400 text-lg leading-relaxed">
              <p>
                <strong className="text-white block mb-2 font-display text-xl">
                  Thành lập: 01/07/2023 @ FPT Polytechnic
                </strong>
                BeeIT Club không chỉ là một câu lạc bộ, chúng tôi là một{" "}
                <span className="text-primary italic">
                  "Tổ Ong Kỹ Thuật Số"
                </span>
                . Nơi những dòng code gặp gỡ niềm đam mê, và những ý tưởng điên
                rồ nhất trở thành hiện thực.
              </p>
            </div>
          </div>

          {/* Core Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {corePillars.map((pillar, idx) => (
              <div
                key={idx}
                className={`core-card p-6 rounded-xl border ${pillar.border} bg-[#0a0a0a] hover:bg-white/5 transition-all duration-300 group`}
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${pillar.bg} ${pillar.color} group-hover:scale-110 transition-transform`}
                >
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm text-gray-200 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* === PART 2: THE TIMELINE === */}
        <div className="timeline-events-container relative max-w-5xl mx-auto">
          {/* Connector Node from Core to Timeline */}
          <div className="flex justify-center mb-12 relative z-10">
            <div className="flex flex-col items-center">
              <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-primary"></div>
              <div className="px-4 py-1 border-2 border-primary rounded-full text-xs font-mono font-bold text-primary bg-primary/20 backdrop-blur-sm tracking-widest uppercase shadow-[0_0_15px_rgba(255,214,10,0.3)]">
                Start_Log
              </div>
              <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-primary"></div>
            </div>
          </div>

          {/* Circuit Line SVG - Absolute Centered */}
          <div className="absolute left-[20px] md:left-1/2 top-24 bottom-0 w-1 md:-translate-x-1/2 h-full hidden md:block pointer-events-none z-0">
            <svg
              className="h-full w-[40px] -ml-[20px] overflow-visible"
              preserveAspectRatio="none"
            >
              <path
                ref={lineRef}
                d={`M 20 0 V ${events.length * 400}`} // Approximate height
                fill="none"
                stroke="#FFD60A"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Mobile Line */}
          <div className="absolute left-[19px] top-24 bottom-0 w-[2px] bg-white/10 md:hidden z-0"></div>

          <div className="space-y-24 relative z-10">
            {events.map((event, index) => (
              <div
                key={event.id}
                className={`timeline-item flex flex-col md:flex-row items-center gap-8 md:gap-16 ${
                  index % 2 === 0 ? "" : "md:flex-row-reverse"
                }`}
              >
                {/* Text Content */}
                <div
                  className={`flex-1 pl-12 md:pl-0 ${
                    index % 2 === 0 ? "md:text-right" : "md:text-left"
                  } relative`}
                >
                  {/* Mobile Node */}
                  <div className="absolute left-0 top-1 w-10 h-10 md:hidden flex items-center justify-center">
                    <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_#FFD60A]"></div>
                  </div>

                  <div className="font-mono text-secondary text-xl font-bold mb-2 tracking-widest">
                    {event.year}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-heading mb-3">
                    {event.title}
                  </h3>
                  <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* Center Node Point (Desktop) */}
                <div className="w-4 h-4 rounded-full bg-background border-4 border-primary shadow-[0_0_20px_rgba(255,214,10,0.8)] z-20 shrink-0 hidden md:block"></div>

                {/* Image */}
                <div className="flex-1 w-full pl-12 md:pl-0">
                  <div className="relative group w-full max-w-sm mx-auto md:mx-0">
                    <div className="absolute -inset-2 bg-gradient-to-r from-secondary to-accent opacity-20 blur-lg group-hover:opacity-50 transition-opacity"></div>
                    <div className="relative border border-white/10 bg-black overflow-hidden aspect-video rounded-sm shadow-2xl">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                      />

                      {/* Tech Overlay lines */}
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20"></div>
                      <div className="absolute bottom-0 right-0 w-full h-[1px] bg-white/20"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* End Connector */}
          <div className="flex justify-center mt-12">
            <div className="flex flex-col items-center">
              <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent"></div>
              <div className="w-2 h-2 rounded-full bg-gray-700"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;

