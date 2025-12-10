"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

const HERO_BEE_IMG =
  "https://scontent.fhan14-5.fna.fbcdn.net/v/t39.30808-6/356893364_106371362513103_5755489272171968894_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=1S6aY1668yEQ7kNvwEVunYL&_nc_oc=AdlL6gqNhvv0ZIWq0K5tm2txBgEAZWlebyWQhXHm3RqwFXlMjbNI9eySb7-eJqsS-yDG9HZq8drBlvn5mNM1HAya&_nc_zt=23&_nc_ht=scontent.fhan14-5.fna&_nc_gid=DO2F8Br2iKRSeNSSMl9CYA&oh=00_AfkgeuBbDfYeisaXgOGT0W7YZGl2hyk8GnuDwdBaEUw3pQ&oe=693F7A83";

const HeroSection = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonsRef = useRef(null);
  const beeImgRef = useRef(null);
  const pathRef = useRef(null);
  const [typeTextIndex, setTypeTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero intro timeline
      const tl = gsap.timeline();
      tl.fromTo(
        ".hero-bg",
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
      )
        .fromTo(
          titleRef.current?.querySelectorAll(".letter"),
          { opacity: 0, y: 60, scale: 0.85 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "back.out(1.5)",
            stagger: 0.1,
          },
          "-=0.2"
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out" },
          "-=0.2"
        )
        .fromTo(
          descriptionRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          "-=0.1"
        )
        .fromTo(
          buttonsRef.current?.children || [],
          { opacity: 0, y: 15, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.3)",
            stagger: 0.12,
          },
          "-=0.1"
        );

      // Bee MotionPath
      if (beeImgRef.current && pathRef.current) {
        gsap.set(beeImgRef.current, { opacity: 0, scale: 0.85 });
        gsap.to(beeImgRef.current, {
          opacity: 1,
          duration: 0.6,
          delay: 0.4,
          ease: "power1.out",
        });
        gsap.to(beeImgRef.current, {
          motionPath: {
            path: pathRef.current,
            align: pathRef.current,
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
          },
          duration: 6,
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true,
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Typewriter text handling
  useEffect(() => {
    const texts = [
      "Hành trình BeeIT - Together We Grow",
      "Cộng đồng công nghệ năng động tại FPT Polytechnic",
      "Nơi kiến thức, đam mê và kết nối gặp nhau",
    ];

    const current = texts[typeTextIndex];
    let timeout;
    const isComplete = displayText === current;

    if (!isComplete) {
      timeout = setTimeout(() => {
        setDisplayText(current.slice(0, displayText.length + 1));
      }, 70);
    } else {
      timeout = setTimeout(() => {
        setDisplayText("");
        setTypeTextIndex((prev) => (prev + 1) % texts.length);
      }, 2200);
    }

    return () => clearTimeout(timeout);
  }, [displayText, typeTextIndex]);

  const titleText = "BeeIT";
  const subtitleText = "Club Journey";

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-black via-[#0b0b0f] to-[#0b0b0f]"
    >
      <div className="hero-bg absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(255,193,7,0.12),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.08),transparent_22%)]" />
      <div className="absolute inset-0 opacity-[0.08]">
        <div
          className="grid-bg absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23FFC107' stroke-opacity='0.35' stroke-width='1'%3E%3Cpath d='M30 1.1547L52.5 14.4234v26.5386L30 54.2304 7.5 40.962V14.4234z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-10 px-6 md:px-10 lg:px-16 w-full max-w-7xl">
        {/* Text side */}
        <div className="text-center lg:text-left space-y-6">
          <div>
            <h1
              ref={titleRef}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight"
            >
              {titleText.split("").map((char, i) => (
                <span
                  key={i}
                  className="letter inline-block"
                  style={{
                    color: i < 3 ? "#FFC107" : "white",
                    marginRight: i === 2 ? "0.18em" : "0",
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}{" "}
              <span ref={subtitleRef} className="text-[#FFC107] drop-shadow-lg">
                {subtitleText}
              </span>
            </h1>
          </div>

          <div className="typewriter-container text-lg sm:text-xl md:text-2xl text-white/80 font-medium min-h-[2.5rem]">
            {displayText}
            <span className="inline-block w-1 h-6 bg-[#FFC107] ml-1 align-middle animate-pulse" />
          </div>

          <p
            ref={descriptionRef}
            className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed mx-auto lg:mx-0"
          >
            BeeIT Club - hành trình kiến tạo cộng đồng công nghệ tại FPT Polytechnic:
            học tập, chia sẻ, kết nối và tạo nên những kỷ niệm đáng nhớ.
          </p>

          <div ref={buttonsRef} className="flex flex-wrap justify-center lg:justify-start gap-4">
            <Link href="/apply">
              <button className="px-7 py-3 rounded-full font-semibold text-lg bg-[#FFC107] text-black shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                Tham gia ngay
              </button>
            </Link>
            <Link href="#memory-reel">
              <button className="px-7 py-3 rounded-full font-semibold text-lg border border-white/30 text-white hover:bg-white/10 transition-all hover:-translate-y-1">
                Xem hành trình ảnh
              </button>
            </Link>
          </div>
        </div>

        {/* Visual side */}
        <div className="relative w-full h-[360px] sm:h-[420px] lg:h-[480px]">
          {/* Motion path SVG (invisible) */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 600 400"
            className="absolute inset-0"
          >
            <path
              ref={pathRef}
              d="M50,320 C200,180 320,220 420,120 C520,40 560,200 520,260 C460,340 300,340 180,300 C80,270 40,230 100,200"
              fill="none"
              stroke="transparent"
            />
          </svg>

          {/* Bee image */}
          <img
            ref={beeImgRef}
            src={HERO_BEE_IMG}
            alt="BeeIT mascot"
            className="absolute w-40 h-40 object-cover rounded-full border-4 border-[#FFC107]/70 shadow-2xl"
            style={{ top: "50%", left: "10%", transform: "translate(-50%, -50%)" }}
          />

          {/* Logo glass card */}
          <div className="absolute right-4 top-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg">
            <div className="text-sm uppercase tracking-[0.2em] text-[#FFC107] font-semibold">
              BeeIT
            </div>
            <div className="text-white text-lg font-bold">Cộng đồng công nghệ</div>
            <div className="text-white/60 text-sm">FPT Polytechnic</div>
          </div>

          {/* Highlights */}
          <div className="absolute -left-2 bottom-6 space-y-3">
            {[
              "Workshops & Hackathons",
              "Dự án thực chiến",
              "Cộng đồng 200+ thành viên",
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white text-sm backdrop-blur"
              >
                <span className="w-2 h-2 rounded-full bg-[#FFC107]" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
};

// Scroll indicator with GSAP
const ScrollIndicator = () => {
  const indicatorRef = useRef(null);

  useEffect(() => {
    if (indicatorRef.current) {
      gsap.to(indicatorRef.current, {
        y: 10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }, []);

  return (
    <div
      ref={indicatorRef}
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
    >
      <ArrowDown className="w-6 h-6 text-foreground/50" />
    </div>
  );
};

export default HeroSection;
