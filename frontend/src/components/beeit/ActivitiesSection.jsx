"use client";

import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { Calendar, Code2, Users, Trophy, BookOpen, Zap } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const activities = [
  {
    icon: Code2,
    title: "Workshop & Training",
    description:
      "Các buổi workshop về lập trình, công nghệ mới, và kỹ năng phát triển phần mềm.",
    color: "from-blue-500/20 to-blue-600/20",
    iconColor: "text-blue-500",
  },
  {
    icon: Calendar,
    title: "Sự kiện & Hội thảo",
    description:
      "Tổ chức các sự kiện lớn như Job Fair, Tech Talk, và các cuộc thi lập trình.",
    color: "from-purple-500/20 to-purple-600/20",
    iconColor: "text-purple-500",
  },
  {
    icon: Users,
    title: "Networking",
    description:
      "Kết nối với các chuyên gia trong ngành, cựu sinh viên và doanh nghiệp đối tác.",
    color: "from-green-500/20 to-green-600/20",
    iconColor: "text-green-500",
  },
  {
    icon: BookOpen,
    title: "Chia sẻ kiến thức",
    description:
      "Blog, tài liệu học tập, và các bài viết chia sẻ kinh nghiệm từ thành viên.",
    color: "from-orange-500/20 to-orange-600/20",
    iconColor: "text-orange-500",
  },
  {
    icon: Trophy,
    title: "Cuộc thi & Thử thách",
    description:
      "Bug Slayer, Hackathon, và các cuộc thi lập trình để nâng cao kỹ năng.",
    color: "from-red-500/20 to-red-600/20",
    iconColor: "text-red-500",
  },
  {
    icon: Zap,
    title: "Dự án thực tế",
    description:
      "Tham gia các dự án thực tế, xây dựng portfolio và tích lũy kinh nghiệm.",
    color: "from-yellow-500/20 to-yellow-600/20",
    iconColor: "text-yellow-500",
  },
];

const ActivitiesSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);

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

      // Cards animation with stagger and scroll trigger
      cardsRef.current.forEach((card, index) => {
        if (card) {
          const icon = card.querySelector(".icon-wrapper");
          const title = card.querySelector(".card-title");
          const text = card.querySelector(".card-text");

          // ScrollTrigger for each card
          ScrollTrigger.create({
            trigger: card,
            start: "top 80%",
            animation: gsap.fromTo(
              card,
              {
                opacity: 0,
                y: 100,
                scale: 0.9,
                rotationY: -15,
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                rotationY: 0,
                duration: 0.8,
                ease: "back.out(1.2)",
              }
            ),
          });

          // Icon animation
          if (icon) {
            ScrollTrigger.create({
              trigger: card,
              start: "top 80%",
              animation: gsap.fromTo(
                icon,
                {
                  rotation: -180,
                  scale: 0,
                },
                {
                  rotation: 0,
                  scale: 1,
                  duration: 0.6,
                  delay: 0.2,
                  ease: "back.out(2)",
                }
              ),
            });
          }

          // Text reveal
          if (title && text) {
            ScrollTrigger.create({
              trigger: card,
              start: "top 80%",
              animation: gsap.fromTo(
                [title, text],
                {
                  opacity: 0,
                  y: 20,
                },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.5,
                  delay: 0.3,
                  stagger: 0.1,
                  ease: "power2.out",
                }
              ),
            });
          }

          // Hover effects
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

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [inView]);

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div ref={sectionRef} className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-6"
          >
            Hoạt động nổi bật
          </h2>
          <p className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto">
            Khám phá các hoạt động đa dạng mà BeeIT Club tổ chức
          </p>
        </div>

        {/* Activities grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div
                key={index}
                ref={(el) => (cardsRef.current[index] = el)}
                className="group cursor-pointer"
              >
                <div
                  className={`h-full p-8 rounded-2xl bg-gradient-to-br ${activity.color} border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden`}
                >
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                    <Icon className="w-full h-full" />
                  </div>

                  {/* Icon */}
                  <div className="icon-wrapper relative z-10 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-background/50 backdrop-blur-sm mb-6">
                    <Icon className={`w-8 h-8 ${activity.iconColor}`} />
                  </div>

                  {/* Content */}
                  <h3 className="card-title text-2xl font-bold mb-3 relative z-10">
                    {activity.title}
                  </h3>
                  <p className="card-text text-foreground/70 leading-relaxed relative z-10">
                    {activity.description}
                  </p>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to action */}
        <div className="mt-16 text-center">
          <a
            href="/events"
            className="inline-block px-8 py-4 rounded-full font-bold text-lg bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105 hover:-translate-y-1"
          >
            Xem tất cả sự kiện
          </a>
        </div>
      </div>
    </section>
  );
};

export default ActivitiesSection;
