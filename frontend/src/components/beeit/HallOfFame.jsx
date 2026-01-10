"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Default achievements nếu không có data
const defaultAchievements = [
  // ROW 1
  {
    id: "1",
    title: "HACKATHON 2023",
    year: "2023",
    description: "Vô địch Quốc gia AI",
    image:
      "https://images.unsplash.com/photo-1504384308090-c54be3855833?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "TECH TALK S1",
    year: "2023",
    description: "1000+ Sinh viên tham dự",
    image:
      "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "BEST PROJECT",
    year: "2022",
    description: "Giải pháp Smart City",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "CODE CAMP",
    year: "2022",
    description: "Trại hè lập trình",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "5",
    title: "OPEN DAY",
    year: "2021",
    description: "Ngày hội tuyển thành viên",
    image:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "6",
    title: "WEB SUMMIT",
    year: "2021",
    description: "Hội thảo chuyên đề",
    image:
      "https://images.unsplash.com/photo-1505373877841-8d43f703fb8f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "7",
    title: "GAME JAM",
    year: "2020",
    description: "48h Lập trình Game",
    image:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "8",
    title: "FOUNDING",
    year: "2019",
    description: "Lễ ra mắt CLB",
    image:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop",
  },
  // ROW 2
  {
    id: "9",
    title: "AI CHALLENGE",
    year: "2023",
    description: "Giải nhì toàn thành",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "10",
    title: "CHARITY CODE",
    year: "2023",
    description: "Dạy code cho trẻ em",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "11",
    title: "MENTORSHIP",
    year: "2022",
    description: "Khóa đào tạo F1",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "12",
    title: "ROBOTICS",
    year: "2022",
    description: "Triển lãm IoT",
    image:
      "https://images.unsplash.com/photo-1581092921461-eab62e97a782?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "13",
    title: "DESIGN THON",
    year: "2021",
    description: "Sáng tạo UI/UX",
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "14",
    title: "DATA SCIENCE",
    year: "2021",
    description: "Workshop Big Data",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "15",
    title: "CTF ARENA",
    year: "2020",
    description: "An toàn thông tin",
    image:
      "https://images.unsplash.com/photo-1563206767-5b1d972b9fb9?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "16",
    title: "DEV NIGHT",
    year: "2019",
    description: "Giao lưu Acoustic",
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop",
  },
];

const HallOfFame = ({ achievements = [] }) => {
  const sectionRef = useRef(null);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);

  // Sử dụng achievements từ props hoặc default
  const displayAchievements =
    achievements.length > 0 ? achievements : defaultAchievements;

  // Split data into two rows based on row_number
  const row1Data = displayAchievements
    .filter((a) => a.row_number === 1 || a.row_number === undefined)
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  const row2Data = displayAchievements
    .filter((a) => a.row_number === 2)
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scrollDuration = 3000; // Total scroll distance (pixels)

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${scrollDuration}`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          // Logic handled in animations below via scrub
        },
        animation: gsap
          .timeline()
          // Row 1: Move Right (Start from -20% go to 0% or positive)
          // Assumes content overflows. We start "shifted left" and move "right".
          .fromTo(
            row1Ref.current,
            { xPercent: -50 },
            { xPercent: -10, ease: "none" },
            0
          )
          // Row 2: Move Left (Start from 0% go to -50%)
          .fromTo(
            row2Ref.current,
            { xPercent: -10 },
            { xPercent: -50, ease: "none" },
            0
          ),
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen bg-background overflow-hidden flex flex-col justify-center py-20"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary/10 via-background to-background pointer-events-none"></div>

      {/* Section Header */}
      <div className="absolute top-8 left-8 md:top-12 md:left-12 z-20 mix-blend-difference">
        <span className="text-primary font-bold text-sm border-b border-primary pb-1 tracking-widest uppercase">
          Bảng Vàng Thành Tích
        </span>
        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mt-2">
          GƯƠNG MẶT TIÊU BIỂU
        </h2>
      </div>

      <div className="flex flex-col gap-6 md:gap-10 relative z-10 w-full">
        {/* === ROW 1: SCROLLS RIGHT === */}
        {/* We make the width very large so it overflows off screen */}
        <div
          ref={row1Ref}
          className="flex gap-4 md:gap-8 w-[250vw] md:w-[200vw] pl-4"
        >
          {row1Data.map((item) => (
            <div
              key={item.id || `row1-${item.title}`}
              className="group relative w-[300px] h-[200px] md:w-[450px] md:h-[320px] shrink-0 overflow-hidden rounded-sm border border-white/5 bg-white/5 transition-transform duration-500 hover:scale-[1.02] hover:z-20 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(255,214,10,0.2)]"
            >
              {/* Image */}
              <img
                src={item.image_url || item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0 grayscale-[0.5]"
                onError={(e) => {
                  e.target.src = "/logo.jpg";
                }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90"></div>

              {/* Text Content */}
              <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-accent font-mono text-xs md:text-sm tracking-widest bg-accent/10 px-2 py-1 border border-accent/20">
                    {item.year}
                  </span>
                  <div className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 animate-pulse"></div>
                </div>
                <h3 className="text-xl md:text-3xl font-display font-bold text-white mb-1 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-400 font-mono line-clamp-1 border-l border-white/30 pl-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* === ROW 2: SCROLLS LEFT === */}
        <div
          ref={row2Ref}
          className="flex gap-4 md:gap-8 w-[250vw] md:w-[200vw] pl-4"
        >
          {row2Data.map((item) => (
            <div
              key={item.id || `row2-${item.title}`}
              className="group relative w-[300px] h-[200px] md:w-[450px] md:h-[320px] shrink-0 overflow-hidden rounded-sm border border-white/5 bg-white/5 transition-transform duration-500 hover:scale-[1.02] hover:z-20 hover:border-secondary/50 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)]"
            >
              {/* Image */}
              <img
                src={item.image_url || item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0 grayscale-[0.5]"
                onError={(e) => {
                  e.target.src = "/logo.jpg";
                }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90"></div>

              {/* Text Content */}
              <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-secondary font-mono text-xs md:text-sm tracking-widest bg-secondary/10 px-2 py-1 border border-secondary/20">
                    {item.year}
                  </span>
                  <div className="w-1 h-1 bg-secondary rounded-full opacity-0 group-hover:opacity-100 animate-pulse"></div>
                </div>
                <h3 className="text-xl md:text-3xl font-display font-bold text-white mb-1 group-hover:text-secondary transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-400 font-mono line-clamp-1 border-l border-white/30 pl-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HallOfFame;
