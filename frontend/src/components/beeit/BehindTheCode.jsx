"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import SafeImage from "@/components/common/SafeImage";

gsap.registerPlugin(Draggable);

// Default photos nếu không có data
const defaultPhotos = [
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop", // Meeting
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop", // Working
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop", // Group High five
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600&auto=format&fit=crop", // Meeting 2
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop", // Friends
  "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=600&auto=format&fit=crop", // Conference
  "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop", // Workshop
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=600&auto=format&fit=crop", // Office
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop", // Team collaboration
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=600&auto=format&fit=crop", // Team discussion
  "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop", // Coding session
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop", // Learning
  "https://images.unsplash.com/photo-1504384308090-c54be3855833?q=80&w=600&auto=format&fit=crop", // Hackathon
  "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=600&auto=format&fit=crop", // Presentation
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop", // Data analysis
  "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=600&auto=format&fit=crop", // Team work
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600&auto=format&fit=crop", // Brainstorming
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop", // Group work
  "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=600&auto=format&fit=crop", // Planning
  "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop", // Development
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop", // Team meeting
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=600&auto=format&fit=crop", // Innovation
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600&auto=format&fit=crop", // Strategy
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop", // Celebration
  "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=600&auto=format&fit=crop", // Workshop 2
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop", // Tech talk
  "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=600&auto=format&fit=crop", // Collaboration
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop", // Team building
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600&auto=format&fit=crop", // Networking
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=600&auto=format&fit=crop", // Creative session
];

const BehindTheCode = ({ photos = [] }) => {
  const containerRef = useRef(null);

  // Sử dụng photos từ props hoặc default
  const displayPhotos = photos.length > 0
    ? photos.sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
    : defaultPhotos;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Make elements draggable
      Draggable.create(".draggable-photo", {
        bounds: containerRef.current,
        zIndexBoost: true,
        type: "x,y",
        edgeResistance: 0.65,
        onDragStart: function () {
          gsap.to(this.target, {
            scale: 1.1,
            rotation: 0,
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            duration: 0.2,
            zIndex: 100,
          });
        },
        onDragEnd: function () {
          gsap.to(this.target, {
            scale: 1,
            rotation: gsap.utils.random(-10, 10),
            boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
            duration: 0.2,
          });
        },
      });

      // Initial wide random scatter
      const w = containerRef.current?.offsetWidth || window.innerWidth;
      const h = containerRef.current?.offsetHeight || window.innerHeight;

      // Calculate safe spread area (leaving some padding so they don't go strictly to the edge)
      const xRange = w * 0.35; // Spread across 70% of width
      const yRange = h * 0.35; // Spread across 70% of height

      gsap.utils.toArray(".draggable-photo").forEach((photo) => {
        gsap.set(photo, {
          x: gsap.utils.random(-xRange, xRange),
          y: gsap.utils.random(-yRange, yRange),
          rotation: gsap.utils.random(-25, 25), // More chaotic rotation
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative py-20 min-h-screen bg-background overflow-hidden flex flex-col items-center justify-center">
      {/* Background Text Overlay for texture */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
        <span className="text-[20vw] font-black text-white leading-none">
          CHAOS
        </span>
      </div>

      <div className="z-10 text-center mb-10 pointer-events-none relative select-none">
        <h2 className="text-5xl md:text-7xl font-display font-bold text-heading">
          HẬU TRƯỜNG VUI NHỘN
        </h2>
        <p className="text-accent font-mono mt-4 bg-black/50 inline-block px-4 py-1 rounded backdrop-blur-sm">
          Sự hỗn loạn là một phần của quy trình. Kéo để khám phá.
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden"
      >
        {displayPhotos.map((photo, index) => {
          const src = typeof photo === 'string' ? photo : photo.image_url;
          const alt = typeof photo === 'string' ? 'Culture' : (photo.alt_text || 'Culture');
          return (
            <div
              key={photo.id || index}
              className="draggable-photo absolute p-3 bg-white transform cursor-grab active:cursor-grabbing shadow-lg transition-transform"
              style={{
                width: "280px", // Slightly smaller for better scattering on mobile
                top: "50%",
                left: "50%",
                marginTop: "-180px", // Center offset based on height approx
                marginLeft: "-140px", // Center offset based on width
              }}
            >

              <div className="w-full h-[220px] overflow-hidden border border-gray-100 bg-gray-100 relative">
                <SafeImage
                  src={src}
                  alt={alt}
                  className="w-full h-full object-cover pointer-events-none select-none"
                  fill
                />
              </div>
              <div className="pt-3 pb-1 text-center">
                <span className="font-handwriting text-black font-mono text-xs tracking-widest opacity-70">
                  IMG_0{(photo.id || index) + 802}.Raw
                </span>
              </div>

              {/* Tape Effect */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-8 bg-white/30 backdrop-blur-sm rotate-2 shadow-sm border border-white/40"></div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default BehindTheCode;

