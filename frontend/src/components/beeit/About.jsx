"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Flag, Zap, Users, Hexagon } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);
  const leftColRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
        // Animation for the Right Side Grid Cards
        gsap.from(".about-card", {
            y: 100,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
                trigger: cardsRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
        
        // Animation for Left Side Text
        gsap.from(leftColRef.current, {
            x: -50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 70%",
            }
        });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative py-32 bg-background overflow-hidden">
        {/* Background Decorative Hexagons (Faint) */}
        <div className="absolute top-20 right-0 opacity-5 pointer-events-none">
             <Hexagon size={400} strokeWidth={0.5} />
        </div>

        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-16 relative z-10">
            
            {/* === LEFT COLUMN: STICKY INFO === */}
            <div className="lg:w-1/3 lg:h-[calc(100vh-200px)] lg:sticky lg:top-32 flex flex-col justify-center" ref={leftColRef}>
                <div className="mb-8">
                    <span className="font-mono text-primary text-xs tracking-widest uppercase border border-primary/30 px-3 py-1 rounded-full bg-primary/5">
                        Established 01/07/2023
                    </span>
                </div>
                
                <h2 className="text-5xl md:text-6xl font-display font-bold text-heading mb-6 leading-tight">
                    VỀ <br/>
                    <span className="text-primary">BEE IT</span> CLUB
                </h2>
                
                <div className="space-y-6 text-gray-400 leading-relaxed text-lg border-l-2 border-white/10 pl-6">
                    <p>
                        Trực thuộc <strong className="text-orange-500">FPT Polytechnic</strong>, chúng tôi không chỉ là một câu lạc bộ.
                    </p>
                    <p>
                        Chúng tôi là một <span className="text-white italic">"Tổ Ong Kỹ Thuật Số"</span> (Digital Hive) - nơi những dòng code kiến tạo tương lai và niềm đam mê công nghệ được kết nối không giới hạn.
                    </p>
                </div>

                <div className="mt-12 hidden lg:block">
                     <div className="w-16 h-16 border border-dashed border-gray-600 rounded-full animate-spin-slow grid place-items-center">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                     </div>
                </div>
            </div>

            {/* === RIGHT COLUMN: BENTO GRID 2x2 === */}
            <div className="lg:w-2/3" ref={cardsRef}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Card 1: MỤC TIÊU */}
                    <div className="about-card group relative p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:border-[#FFD60A] hover:bg-white/[0.08]">
                        <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
                            <Target size={64} className="text-white stroke-1" />
                        </div>
                        <div className="mb-6 relative">
                            {/* Hexagon Shape CSS */}
                            <div className="w-14 h-16 bg-primary/20 flex items-center justify-center text-primary" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
                                <Target size={24} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-display font-bold text-heading mb-3">Mục Tiêu</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Xây dựng cộng đồng CNTT vững mạnh, nơi mọi thành viên đều là một "mắt xích" quan trọng trong hệ sinh thái công nghệ.
                        </p>
                    </div>

                    {/* Card 2: SỨ MỆNH */}
                    <div className="about-card group relative p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:border-[#FFD60A] hover:bg-white/[0.08]">
                        <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
                            <Flag size={64} className="text-white stroke-1" />
                        </div>
                        <div className="mb-6 relative">
                             <div className="w-14 h-16 bg-accent/20 flex items-center justify-center text-accent" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
                                <Flag size={24} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-display font-bold text-heading mb-3">Sứ Mệnh</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Lan tỏa ngọn lửa đam mê, trang bị vũ khí kiến thức thực chiến để sinh viên tự tin chinh phục thị trường việc làm IT.
                        </p>
                    </div>

                    {/* Card 3: GIÁ TRỊ CỐT LÕI */}
                    <div className="about-card group relative p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:border-[#FFD60A] hover:bg-white/[0.08]">
                        <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
                            <Zap size={64} className="text-white stroke-1" />
                        </div>
                        <div className="mb-6 relative">
                             <div className="w-14 h-16 bg-secondary/20 flex items-center justify-center text-secondary" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
                                <Zap size={24} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-display font-bold text-heading mb-3">Giá Trị Cốt Lõi</h3>
                        <ul className="text-gray-400 text-sm space-y-2">
                            <li className="flex items-center gap-2"><span className="w-1 h-1 bg-secondary rounded-full"></span> Đam mê (Passion)</li>
                            <li className="flex items-center gap-2"><span className="w-1 h-1 bg-secondary rounded-full"></span> Sáng tạo (Creativity)</li>
                            <li className="flex items-center gap-2"><span className="w-1 h-1 bg-secondary rounded-full"></span> Hợp tác (Collaboration)</li>
                        </ul>
                    </div>

                    {/* Card 4: CỘNG ĐỒNG */}
                    <div className="about-card group relative p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:border-[#FFD60A] hover:bg-white/[0.08]">
                        <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
                            <Users size={64} className="text-white stroke-1" />
                        </div>
                        <div className="mb-6 relative">
                             <div className="w-14 h-16 bg-green-500/20 flex items-center justify-center text-green-500" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
                                <Users size={24} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-display font-bold text-heading mb-3">Cộng Đồng</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Mạng lưới kết nối Alumni, Mentor và Doanh nghiệp. Nơi hỗ trợ nhau từ dòng code đầu tiên đến dự án triệu đô.
                        </p>
                    </div>

                </div>
            </div>

        </div>
    </section>
  );
};

export default About;

