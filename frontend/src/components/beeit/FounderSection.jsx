"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { ChevronLeft, ChevronRight, Linkedin, Mail, Github, Award, GraduationCap, Users } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BeeSVG from "./BeeSVG";
import FlowerSVG from "./FlowerSVG";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Sample data - replace with actual data
const founder = {
  name: "Thầy Nguyễn Hoàng Anh",
  role: "Người sáng lập BeeIT Club",
  image: "https://scontent.fhan14-1.fna.fbcdn.net/v/t1.6435-9/51057920_10211149961184134_8931413989867388928_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=Bw1Dn5ILOzcQ7kNvwHumRKU&_nc_oc=AdmfyBuC0xlfaR_rdDKVeqxcc-RL-Sc7fJjcmbKawN8sMmP1zy8SNqYm3juLqJyKDVFTW8B5on9hG61cgtxV1NPb&_nc_zt=23&_nc_ht=scontent.fhan14-1.fna&_nc_gid=S8_gXKKfR8cpA-pO7f5FlQ&oh=00_AfmrXCalM5z79xqgISMwhUig9sDGeDSTNU78PQfoK5QpAQ&oe=6960FF21",
  bio: "Giảng viên tâm huyết, khởi xướng BeeIT từ 2023 với sứ mệnh tạo cộng đồng công nghệ năng động cho sinh viên FPT Polytechnic.",
  achievements: [
    "Giảng viên FPT Polytechnic",
    "Sáng lập BeeIT Club (2023)",
    "Hướng dẫn nhiều dự án sinh viên đạt giải",
  ],
  social: {
    email: "mailto:founder@beeit.club",
    linkedin: "#",
  },
};

const coreMembers = [
  {
    id: 1,
    name: "Phạm Hồng Thái",
    role: "Chủ nhiệm CLB",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    bio: "Sinh viên năm 3, chuyên ngành CNTT. Đam mê xây dựng sản phẩm và gắn kết cộng đồng BeeIT.",
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
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80&sat=-10",
    bio: "Frontend lead, yêu thích UI/UX và các hoạt động cộng đồng.",
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
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
    bio: "Sinh viên năm 3, chuyên Backend. Kinh nghiệm Node.js, Python và triển khai dịch vụ.",
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
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80&sat=-15",
    bio: "Sinh viên năm 2, đam mê tổ chức sự kiện, kết nối cộng đồng và marketing digital.",
    social: {
      linkedin: "#",
      email: "mailto:example@beeit.club",
      github: "#",
    },
  },
];

const FounderSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const founderCardRef = useRef(null);
  const flowersRef = useRef([]);
  const beeRef = useRef(null);
  const [flowerBloomProgress, setFlowerBloomProgress] = useState([0, 0, 0, 0]);
  const [beePosition, setBeePosition] = useState({ x: 0, y: 0 });

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

      // Founder card animation
      if (founderCardRef.current) {
        gsap.fromTo(
          founderCardRef.current,
          {
            opacity: 0,
            scale: 0.9,
            y: 50,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            delay: 0.3,
            ease: "power3.out",
          }
        );

        // Image animation
        const image = founderCardRef.current.querySelector(".founder-image");
        if (image) {
          gsap.fromTo(
            image,
            {
              scale: 1.2,
              opacity: 0,
            },
            {
              scale: 1,
              opacity: 1,
              duration: 1,
              delay: 0.5,
              ease: "power2.out",
            }
          );
        }
      }

      // Flowers bloom animation
      flowersRef.current.forEach((flower, index) => {
        if (flower) {
          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top 80%",
            onEnter: () => {
              gsap.to({ progress: 0 }, {
                progress: 1,
                duration: 1.5,
                delay: index * 0.2,
                ease: "power2.out",
                onUpdate: function () {
                  const progress = this.targets()[0].progress;
                  setFlowerBloomProgress((prev) => {
                    const newProgress = [...prev];
                    newProgress[index] = progress;
                    return newProgress;
                  });
                },
              });
            },
          });
        }
      });

      // Bee flies to founder card
      if (beeRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 80%",
          animation: gsap.to(beeRef.current, {
            x: "50%",
            y: "40%",
            duration: 2,
            ease: "power2.inOut",
            onUpdate: function () {
              const x = gsap.getProperty(beeRef.current, "x");
              const y = gsap.getProperty(beeRef.current, "y");
              setBeePosition({ x: Number(x), y: Number(y) });
            },
          }),
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [inView]);

  const nextMember = () => {
    const nextIndex = (currentMemberIndex + 1) % coreMembers.length;
    animateMemberChange(currentMemberIndex, nextIndex, "next");
    setCurrentMemberIndex(nextIndex);
  };

  const prevMember = () => {
    const prevIndex = (currentMemberIndex - 1 + coreMembers.length) % coreMembers.length;
    animateMemberChange(currentMemberIndex, prevIndex, "prev");
    setCurrentMemberIndex(prevIndex);
  };

  const animateMemberChange = (fromIndex, toIndex, direction) => {
    const fromSlide = sectionRef.current?.querySelector(`[data-member-index="${fromIndex}"]`);
    const toSlide = sectionRef.current?.querySelector(`[data-member-index="${toIndex}"]`);

    if (!fromSlide || !toSlide) return;

    const xOffset = direction === "next" ? -100 : 100;

    gsap.to(fromSlide, {
      opacity: 0,
      x: -xOffset,
      scale: 0.9,
      duration: 0.5,
      ease: "power2.in",
    });

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

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 bg-foreground/5 relative overflow-hidden">
      <div ref={sectionRef} className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-6"
          >
            Người sáng lập & Ban Chủ Nhiệm
          </h2>
          <p className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto">
            Những người đã và đang dẫn dắt BeeIT Club phát triển
          </p>
        </div>

        {/* Founder Card */}
        <div className="mb-20 relative">
          {/* Flowers around founder card */}
          <div className="absolute -top-12 -left-12">
            <FlowerSVG
              ref={(el) => (flowersRef.current[0] = el)}
              x={0}
              y={0}
              size={80}
              bloomProgress={flowerBloomProgress[0] || 0}
            />
          </div>
          <div className="absolute -top-8 right-0">
            <FlowerSVG
              ref={(el) => (flowersRef.current[1] = el)}
              x={0}
              y={0}
              size={70}
              bloomProgress={flowerBloomProgress[1] || 0}
            />
          </div>
          <div className="absolute -bottom-8 -left-8">
            <FlowerSVG
              ref={(el) => (flowersRef.current[2] = el)}
              x={0}
              y={0}
              size={75}
              bloomProgress={flowerBloomProgress[2] || 0}
            />
          </div>
          <div className="absolute -bottom-6 right-0">
            <FlowerSVG
              ref={(el) => (flowersRef.current[3] = el)}
              x={0}
              y={0}
              size={65}
              bloomProgress={flowerBloomProgress[3] || 0}
            />
          </div>

          {/* Bee */}
          <div ref={beeRef} style={{ position: "absolute", zIndex: 100 }}>
            <BeeSVG x={beePosition.x} y={beePosition.y} scale={0.8} />
          </div>

          {/* Founder card */}
          <div
            ref={founderCardRef}
            className="max-w-5xl mx-auto bg-card rounded-3xl p-8 md:p-12 shadow-2xl border-4 border-primary/30 relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />

            <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
              {/* Image */}
              <div className="flex-shrink-0">
                <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-primary/50 shadow-2xl">
                  <div className="founder-image w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <GraduationCap className="w-32 h-32 text-primary/30" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <Award className="w-6 h-6 text-primary" />
                  <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                    Người sáng lập
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-black mb-3">{founder.name}</h3>
                <p className="text-xl md:text-2xl text-primary mb-6 font-semibold">
                  {founder.role}
                </p>
                <p className="text-base md:text-lg text-foreground/70 leading-relaxed mb-6">
                  {founder.bio}
                </p>

                {/* Achievements */}
                <div className="flex flex-wrap gap-3 mb-6 justify-center md:justify-start">
                  {founder.achievements.map((achievement, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
                    >
                      {achievement}
                    </span>
                  ))}
                </div>

                {/* Social links */}
                <div className="flex justify-center md:justify-start gap-4">
                  <a
                    href={founder.social.email}
                    className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                  <a
                    href={founder.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Members Section */}
        <div className="mt-20">
          <h3 className="text-3xl md:text-4xl font-black text-center mb-12 flex items-center justify-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Thành viên cốt cán
          </h3>

          {/* Carousel */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <div className="flex">
                {coreMembers.map((member, index) => (
                  <div
                    key={member.id}
                    data-member-index={index}
                    className={`min-w-full px-4 md:px-8 transition-all ${
                      index === currentMemberIndex ? "opacity-100" : "opacity-0 absolute"
                    }`}
                    style={{ flex: "0 0 100%" }}
                  >
                    <div className="max-w-4xl mx-auto">
                      <div className="bg-card rounded-2xl p-8 md:p-12 shadow-xl border border-border">
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                          {/* Image */}
                          <div className="flex-shrink-0">
                            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl">
                              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                                <span className="text-6xl font-bold text-primary/30">
                                  {member.name.charAt(0)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 text-center md:text-left">
                            <h4 className="text-3xl md:text-4xl font-black mb-2">
                              {member.name}
                            </h4>
                            <p className="text-xl md:text-2xl text-primary mb-6 font-semibold">
                              {member.role}
                            </p>
                            <p className="text-base md:text-lg text-foreground/70 leading-relaxed mb-6">
                              {member.bio}
                            </p>

                            {/* Social links */}
                            <div className="flex justify-center md:justify-start gap-4">
                              <a
                                href={member.social.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                              >
                                <Linkedin className="w-5 h-5" />
                              </a>
                              <a
                                href={member.social.email}
                                className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                              >
                                <Mail className="w-5 h-5" />
                              </a>
                              <a
                                href={member.social.github}
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

            {/* Navigation */}
            <button
              onClick={prevMember}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg flex items-center justify-center hover:bg-background transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextMember}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg flex items-center justify-center hover:bg-background transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {coreMembers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const direction = index > currentMemberIndex ? "next" : "prev";
                    animateMemberChange(currentMemberIndex, index, direction);
                    setCurrentMemberIndex(index);
                  }}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentMemberIndex ? "bg-primary w-8" : "bg-foreground/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;

