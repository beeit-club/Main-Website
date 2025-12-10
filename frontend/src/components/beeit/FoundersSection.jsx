"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { ChevronLeft, ChevronRight, Linkedin, Mail, Github } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Sample founders data - you can replace with actual data
const founders = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    role: "Chủ nhiệm CLB",
    image: "/api/placeholder/300/300",
    bio: "Sinh viên năm 3, chuyên ngành Công nghệ Thông tin. Đam mê phát triển phần mềm và xây dựng cộng đồng.",
    social: {
      linkedin: "#",
      email: "mailto:example@beeit.club",
      github: "#",
    },
  },
  {
    id: 2,
    name: "Trần Thị B",
    role: "Phó Chủ nhiệm",
    image: "/api/placeholder/300/300",
    bio: "Sinh viên năm 2, chuyên về Frontend Development. Yêu thích thiết kế UI/UX và React.",
    social: {
      linkedin: "#",
      email: "mailto:example@beeit.club",
      github: "#",
    },
  },
  {
    id: 3,
    name: "Lê Văn C",
    role: "Trưởng ban Kỹ thuật",
    image: "/api/placeholder/300/300",
    bio: "Sinh viên năm 3, chuyên về Backend Development. Có kinh nghiệm với Node.js và Python.",
    social: {
      linkedin: "#",
      email: "mailto:example@beeit.club",
      github: "#",
    },
  },
  {
    id: 4,
    name: "Phạm Thị D",
    role: "Trưởng ban Sự kiện",
    image: "/api/placeholder/300/300",
    bio: "Sinh viên năm 2, đam mê tổ chức sự kiện và kết nối cộng đồng. Chuyên về Marketing Digital.",
    social: {
      linkedin: "#",
      email: "mailto:example@beeit.club",
      github: "#",
    },
  },
];

const FoundersSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const carouselRef = useRef(null);
  const slidesRef = useRef([]);

  useEffect(() => {
    if (!inView) return;

    const ctx = gsap.context(() => {
      // Title animation
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          {
            opacity: 0,
            y: -50,
            scale: 0.8,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
          }
        );
      }

      // Animate slides on mount
      slidesRef.current.forEach((slide, index) => {
        if (slide && index === currentIndex) {
          gsap.fromTo(
            slide,
            {
              opacity: 0,
              scale: 0.9,
              x: 100,
            },
            {
              opacity: 1,
              scale: 1,
              x: 0,
              duration: 0.8,
              ease: "power3.out",
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [inView, currentIndex]);

  const nextSlide = () => {
    const nextIndex = (currentIndex + 1) % founders.length;
    animateSlideChange(currentIndex, nextIndex, "next");
    setCurrentIndex(nextIndex);
  };

  const prevSlide = () => {
    const prevIndex = (currentIndex - 1 + founders.length) % founders.length;
    animateSlideChange(currentIndex, prevIndex, "prev");
    setCurrentIndex(prevIndex);
  };

  const animateSlideChange = (fromIndex, toIndex, direction) => {
    const fromSlide = slidesRef.current[fromIndex];
    const toSlide = slidesRef.current[toIndex];

    if (!fromSlide || !toSlide) return;

    const xOffset = direction === "next" ? -100 : 100;

    // Animate out current slide
    gsap.to(fromSlide, {
      opacity: 0,
      x: -xOffset,
      scale: 0.9,
      duration: 0.5,
      ease: "power2.in",
    });

    // Animate in new slide
    gsap.fromTo(
      toSlide,
      {
        opacity: 0,
        x: xOffset,
        scale: 0.9,
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.6,
        delay: 0.2,
        ease: "power3.out",
      }
    );
  };

  const goToSlide = (index) => {
    if (index === currentIndex) return;
    const direction = index > currentIndex ? "next" : "prev";
    animateSlideChange(currentIndex, index, direction);
    setCurrentIndex(index);
  };

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 bg-foreground/5 relative overflow-hidden">
      <div ref={sectionRef} className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-6"
          >
            Ban Chủ Nhiệm
          </h2>
          <p className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto">
            Những người đã và đang dẫn dắt BeeIT Club phát triển
          </p>
        </div>

        {/* Carousel */}
        <div ref={carouselRef} className="relative">
          <div className="overflow-hidden rounded-2xl">
            <div className="flex">
              {founders.map((founder, index) => (
                <div
                  key={founder.id}
                  ref={(el) => (slidesRef.current[index] = el)}
                  className="min-w-full px-4 md:px-8"
                  style={{ flex: "0 0 100%" }}
                >
                  <div className="max-w-4xl mx-auto">
                    <div className="bg-card rounded-2xl p-8 md:p-12 shadow-2xl border border-border">
                      <div className="flex flex-col md:flex-row gap-8 items-center">
                        {/* Image */}
                        <div className="flex-shrink-0">
                          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl">
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                              <span className="text-6xl font-bold text-primary/30">
                                {founder.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-center md:text-left">
                          <h3 className="text-3xl md:text-4xl font-black mb-2">{founder.name}</h3>
                          <p className="text-xl md:text-2xl text-primary mb-6 font-semibold">
                            {founder.role}
                          </p>
                          <p className="text-base md:text-lg text-foreground/70 leading-relaxed mb-6">
                            {founder.bio}
                          </p>

                          {/* Social links */}
                          <div className="flex justify-center md:justify-start gap-4">
                            <a
                              href={founder.social.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                            >
                              <Linkedin className="w-5 h-5" />
                            </a>
                            <a
                              href={founder.social.email}
                              className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                            >
                              <Mail className="w-5 h-5" />
                            </a>
                            <a
                              href={founder.social.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                            >
                              <Github className="w-5 h-5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg flex items-center justify-center hover:bg-background transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg flex items-center justify-center hover:bg-background transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {founders.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? "bg-primary w-8" : "bg-foreground/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoundersSection;
