"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Helper to split text into words wrapped in spans
const SplitText = ({ children, className }) => {
  if (typeof children !== 'string') return children;
  return (
    <span className={`inline-block ${className}`}>
      {children.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-top mr-[0.2em] -mb-[0.2em] pb-[0.2em]">
          <span className="inline-block" data-animate="text-reveal">
            {word}
          </span>
        </span>
      ))}
    </span>
  );
};

const Hero = ({ data }) => {
  const containerRef = useRef(null);
  const heroContentRef = useRef(null);

  // Default values nếu không có data
  const backgroundImage = data?.background_image_url || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop";
  const backgroundImageAlt = data?.background_image_alt || "BEE IT Club";
  const overlayOpacity = data?.overlay_opacity || 0.5;
  const titleLine1 = data?.title_line1 || "BUILDING THE";
  const titleLine2 = data?.title_line2 || "DIGITAL HIVE";
  const subtitle = data?.subtitle || "Cộng đồng lập trình viên đam mê công nghệ. Nơi kết nối tri thức, chia sẻ kinh nghiệm và kiến tạo những sản phẩm đột phá.";

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial State Set
      gsap.set('[data-animate="text-reveal"]', { y: "100%" });
      gsap.set(".hero-subtitle", { y: 20, opacity: 0 });
      gsap.set(".hero-arrow", { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // 2. Animate Background Scale
      tl.fromTo(
        ".hero-bg-image",
        { scale: 1.2, filter: "brightness(0.5)" },
        { scale: 1, filter: "brightness(1)", duration: 2, ease: "power2.out" }
      );

      // 3. Text Reveal (Staggered Words)
      tl.to('[data-animate="text-reveal"]', {
        y: "0%",
        duration: 1.2,
        stagger: 0.05,
      }, "-=1.5");

      // 4. Subtitle Fade Up
      tl.to(".hero-subtitle", {
        y: 0,
        opacity: 1,
        duration: 0.8,
      }, "-=0.8");

      // 5. Arrow Fade In
      tl.to(".hero-arrow", {
        opacity: 1,
        duration: 0.5,
      }, "-=0.5");

      // --- PARALLAX SCROLL ---
      gsap.to(".hero-bg-image", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-black text-white"
    >
      {/* === HERO CONTENT === */}
      <div
        ref={heroContentRef}
        className="absolute inset-0 z-10 w-full h-full flex items-center justify-center pointer-events-none"
      >
        {/* Parallax Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-auto">
          <div
            className="absolute inset-0 z-10"
            style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
          ></div>
          <img
            src={backgroundImage}
            alt={backgroundImageAlt}
            className="hero-bg-image w-full h-[120%] object-cover object-center origin-top will-change-transform"
            loading="eager"
            fetchPriority="high"
          />
        </div>

        {/* Main Content */}
        <div className="relative z-20 text-center px-6 max-w-5xl">
          <h1 className="font-display text-5xl md:text-8xl lg:text-9xl font-bold leading-[1.1] text-white mb-8">
            <SplitText>{titleLine1}</SplitText>
            <br />
            <span className="text-primary block mt-2">
              <SplitText>{titleLine2}</SplitText>
            </span>
          </h1>

          <div className="overflow-hidden">
            <p className="hero-subtitle text-lg md:text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed mb-12">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hero-arrow absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <ArrowDown className="text-white/70 w-8 h-8" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
