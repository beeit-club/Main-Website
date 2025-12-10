"use client";

import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { Target, Lightbulb, Heart, Users } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const AboutSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const cardsRef = useRef([]);

  const features = [
    {
      icon: Target,
      title: "Mục tiêu",
      description:
        "Xây dựng cộng đồng CNTT mạnh mẽ, nơi mọi người có thể học hỏi, chia sẻ và phát triển cùng nhau.",
    },
    {
      icon: Lightbulb,
      title: "Sứ mệnh",
      description:
        "Lan tỏa đam mê công nghệ, tạo môi trường học tập và phát triển kỹ năng cho sinh viên.",
    },
    {
      icon: Heart,
      title: "Giá trị cốt lõi",
      description:
        "Đam mê, sáng tạo, hợp tác và không ngừng học hỏi - những giá trị làm nên BeeIT Club.",
    },
    {
      icon: Users,
      title: "Cộng đồng",
      description:
        "Kết nối các thành viên yêu thích CNTT, tạo mạng lưới hỗ trợ và phát triển nghề nghiệp.",
    },
  ];

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

      // Description animation
      if (descriptionRef.current) {
        gsap.fromTo(
          descriptionRef.current,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.2,
            ease: "power2.out",
          }
        );
      }

      // Cards animation with stagger
      cardsRef.current.forEach((card, index) => {
        if (card) {
          const icon = card.querySelector(".icon-wrapper");
          const title = card.querySelector(".card-title");
          const text = card.querySelector(".card-text");

          gsap.fromTo(
            card,
            {
              opacity: 0,
              y: 80,
              scale: 0.9,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              delay: 0.4 + index * 0.15,
              ease: "back.out(1.2)",
            }
          );

          // Icon rotation
          if (icon) {
            gsap.fromTo(
              icon,
              {
                rotation: -180,
                scale: 0,
              },
              {
                rotation: 0,
                scale: 1,
                duration: 0.6,
                delay: 0.5 + index * 0.15,
                ease: "back.out(2)",
              }
            );
          }

          // Text reveal
          if (title && text) {
            gsap.fromTo(
              [title, text],
              {
                opacity: 0,
                y: 20,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: 0.6 + index * 0.15,
                stagger: 0.1,
                ease: "power2.out",
              }
            );
          }

          // Hover effect
          card.addEventListener("mouseenter", () => {
            gsap.to(card, {
              y: -8,
              scale: 1.02,
              duration: 0.3,
              ease: "power2.out",
            });
            if (icon) {
              gsap.to(icon, {
                rotation: 360,
                duration: 0.6,
                ease: "power2.out",
              });
            }
          });

          card.addEventListener("mouseleave", () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              duration: 0.3,
              ease: "power2.out",
            });
            if (icon) {
              gsap.to(icon, {
                rotation: 0,
                duration: 0.6,
                ease: "power2.out",
              });
            }
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [inView]);

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div ref={sectionRef} className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-6"
          >
            Về BeeIT Club
          </h2>
          <p
            ref={descriptionRef}
            className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed"
          >
            Thành lập vào ngày <span className="font-bold text-primary">01/07/2023</span>, BeeIT
            Club là một cộng đồng năng động trực thuộc FPT Polytechnic, nơi các bạn có thể giao
            lưu, học hỏi và chia sẻ kiến thức trong lĩnh vực Công nghệ Thông tin.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                ref={(el) => (cardsRef.current[index] = el)}
                className="relative group cursor-pointer"
              >
                <div className="h-full p-6 rounded-2xl bg-card border border-border shadow-lg transition-all duration-300">
                  <div className="icon-wrapper inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-4">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="card-title text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="card-text text-foreground/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional info */}
        <div className="mt-16 text-center">
          <div className="inline-block p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
            <p className="text-lg md:text-xl text-foreground/80">
              <span className="font-bold text-primary">Địa chỉ:</span> Tòa nhà FPT Polytechnic, 13
              phố Trịnh Văn Bô
            </p>
            <p className="text-lg md:text-xl text-foreground/80 mt-2">
              <span className="font-bold text-primary">Email:</span>{" "}
              <a href="mailto:contact@beeit.club" className="hover:text-primary transition-colors">
                contact@beeit.club
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
