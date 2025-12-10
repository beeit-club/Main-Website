"use client";

import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { Mail, MapPin, Phone, Facebook, Linkedin, Github, Send } from "lucide-react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ContactSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const contactItemsRef = useRef([]);
  const formRef = useRef(null);

  const contactInfo = [
    {
      icon: MapPin,
      label: "Địa chỉ",
      value: "Tòa nhà FPT Polytechnic, 13 phố Trịnh Văn Bô",
      link: null,
    },
    {
      icon: Mail,
      label: "Email",
      value: "contact@beeit.club",
      link: "mailto:contact@beeit.club",
    },
    {
      icon: Phone,
      label: "Hotline",
      value: "0123 456 789",
      link: "tel:0123456789",
    },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      label: "Facebook",
      link: "https://www.facebook.com/BeeIT.Club",
      color: "hover:text-blue-500",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      link: "#",
      color: "hover:text-blue-600",
    },
    {
      icon: Github,
      label: "GitHub",
      link: "#",
      color: "hover:text-gray-400",
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

      // Contact items animation
      contactItemsRef.current.forEach((item, index) => {
        if (item) {
          const icon = item.querySelector(".contact-icon");
          const content = item.querySelector(".contact-content");

          gsap.fromTo(
            item,
            {
              opacity: 0,
              x: -50,
            },
            {
              opacity: 1,
              x: 0,
              duration: 0.6,
              delay: 0.2 + index * 0.15,
              ease: "power2.out",
            }
          );

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
                delay: 0.3 + index * 0.15,
                ease: "back.out(2)",
              }
            );
          }

          if (content) {
            gsap.fromTo(
              content,
              {
                opacity: 0,
                y: 20,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: 0.4 + index * 0.15,
                ease: "power2.out",
              }
            );
          }

          // Hover effect
          item.addEventListener("mouseenter", () => {
            gsap.to(item, {
              x: 8,
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

          item.addEventListener("mouseleave", () => {
            gsap.to(item, {
              x: 0,
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

      // Form animation
      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          {
            opacity: 0,
            x: 50,
            scale: 0.95,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            delay: 0.4,
            ease: "power3.out",
          }
        );

        // Animate form inputs
        const inputs = formRef.current.querySelectorAll("input, textarea");
        inputs.forEach((input, index) => {
          gsap.fromTo(
            input,
            {
              opacity: 0,
              y: 20,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              delay: 0.6 + index * 0.1,
              ease: "power2.out",
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [inView]);

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 bg-foreground/5 relative overflow-hidden">
      <div ref={sectionRef} className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-6"
          >
            Liên hệ với chúng tôi
          </h2>
          <p className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto">
            Hãy kết nối với BeeIT Club để cùng nhau phát triển
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              const Content = info.link ? (
                <a
                  href={info.link}
                  className="hover:text-primary transition-colors"
                >
                  {info.value}
                </a>
              ) : (
                <span>{info.value}</span>
              );

              return (
                <div
                  key={index}
                  ref={(el) => (contactItemsRef.current[index] = el)}
                  className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border shadow-lg transition-all cursor-pointer"
                >
                  <div className="contact-icon flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="contact-content">
                    <h3 className="font-bold text-lg mb-1">{info.label}</h3>
                    <p className="text-foreground/70">{Content}</p>
                  </div>
                </div>
              );
            })}

            {/* Social links */}
            <div className="pt-6">
              <h3 className="font-bold text-lg mb-4">Theo dõi chúng tôi</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 rounded-lg bg-card border border-border flex items-center justify-center ${social.color} transition-colors`}
                    >
                      <Icon className="w-6 h-6" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div
            ref={formRef}
            className="p-8 rounded-2xl bg-card border border-border shadow-xl"
          >
            <h3 className="text-2xl font-bold mb-6">Gửi tin nhắn</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Họ và tên</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tin nhắn</label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                  placeholder="Nhập tin nhắn của bạn..."
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
              >
                <Send className="w-5 h-5" />
                Gửi tin nhắn
              </button>
            </form>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
            <h3 className="text-2xl font-bold mb-4">Sẵn sàng tham gia?</h3>
            <p className="text-foreground/70 mb-6">
              Đăng ký ngay để trở thành thành viên của BeeIT Club
            </p>
            <Link href="/apply">
              <button className="px-8 py-4 rounded-full font-bold text-lg bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105 hover:-translate-y-1">
                Đăng ký tham gia
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
