"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Hero = ({ data }) => {
  const containerRef = useRef(null);
  const heroContentRef = useRef(null);

  // Log data khi component nhận được
  useEffect(() => {
    console.log('🦸 [HERO] Component received data:', data);
    console.log('🦸 [HERO] background_image_url:', data?.background_image_url);
    console.log('🦸 [HERO] title_line1:', data?.title_line1);
    console.log('🦸 [HERO] title_line2:', data?.title_line2);
    console.log('🦸 [HERO] subtitle:', data?.subtitle);
    console.log('🦸 [HERO] updated_at:', data?.updated_at);
  }, [data]);

  // Default values nếu không có data
  const backgroundImage = data?.background_image_url || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop";
  const backgroundImageAlt = data?.background_image_alt || "BEE IT Club";
  const overlayOpacity = data?.overlay_opacity || 0.5;
  const titleLine1 = data?.title_line1 || "BUILDING THE";
  const titleLine2 = data?.title_line2 || "DIGITAL HIVE";
  const subtitle = data?.subtitle || "Cộng đồng lập trình viên đam mê công nghệ. Nơi kết nối tri thức, chia sẻ kinh nghiệm và kiến tạo những sản phẩm đột phá.";

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate Hero Content entrance
      gsap.from(heroContentRef.current, {
        autoAlpha: 0,
        scale: 1.1,
        duration: 1.5,
        ease: "power3.out",
      });

      // Animate Hero Text elements
      gsap.from(".hero-line-reveal", {
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
        delay: 0.3,
      });

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
        className="absolute inset-0 z-10 w-full h-full flex items-center justify-center"
      >
        {/* Parallax Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
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
          <h1 className="hero-line-reveal font-display text-5xl md:text-8xl lg:text-9xl font-bold leading-[0.9] text-white mb-8">
            {titleLine1} <br />
            <span
              className="text-transparent stroke-text bg-clip-text bg-gradient-to-b from-white to-white/50"
              style={{ WebkitTextStroke: "1px rgba(255,255,255,0.5)" }}
            >
              {titleLine2}
            </span>
          </h1>

          <p className="hero-line-reveal text-lg md:text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed mb-12">
            {subtitle}
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <ArrowDown className="text-white/50 w-6 h-6" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
