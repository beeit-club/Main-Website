"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Terminal, Mic, Share2, BookOpen, Swords, Rocket, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const activitiesList = [
    {
        icon: <Terminal size={40} />,
        title: "Workshop & Training",
        desc: "Các buổi training chuyên sâu về lập trình (Web, Mobile, AI) và cập nhật công nghệ mới nhất.",
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop"
    },
    {
        icon: <Mic size={40} />,
        title: "Sự kiện & Hội thảo",
        desc: "Tổ chức Job Fair, Tech Talk với diễn giả từ các công ty công nghệ hàng đầu.",
        image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=800&auto=format&fit=crop"
    },
    {
        icon: <Share2 size={40} />,
        title: "Networking",
        desc: "Kết nối thành viên với cựu sinh viên và doanh nghiệp, mở rộng cơ hội nghề nghiệp.",
        image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop"
    },
    {
        icon: <BookOpen size={40} />,
        title: "Chia sẻ kiến thức",
        desc: "Hệ thống Blog, Wiki và các buổi seminar chia sẻ kinh nghiệm thực chiến.",
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop"
    },
    {
        icon: <Swords size={40} />,
        title: "Bug Slayer & Hackathon",
        desc: "Sân chơi thi đấu lập trình đỉnh cao, nơi kỹ năng được rèn giũa qua áp lực thời gian.",
        image: "https://images.unsplash.com/photo-1504384308090-c54be3855833?q=80&w=800&auto=format&fit=crop"
    },
    {
        icon: <Rocket size={40} />,
        title: "Dự án thực tế",
        desc: "Tham gia các team Product, xây dựng sản phẩm thực tế để làm đẹp Portfolio.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"
    }
];

const Activities = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Batch animation for grid items entrance
            ScrollTrigger.batch(".activity-card", {
                onEnter: (elements) => {
                    gsap.from(elements, {
                        y: 50,
                        opacity: 0,
                        stagger: 0.15,
                        duration: 0.8,
                        ease: "power3.out"
                    });
                },
                start: "top 85%"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="py-24 bg-background relative">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <span className="font-mono text-primary text-sm tracking-[0.2em] uppercase">
                            // System_Modules
                        </span>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-heading mt-4">
                            HOẠT ĐỘNG <br/> NỔI BẬT
                        </h2>
                    </div>
                    <div className="max-w-sm text-gray-400 text-sm font-mono text-right hidden md:block">
                        &lt;status&gt; ACTIVE &lt;/status&gt;<br/>
                        &lt;load&gt; 100% &lt;/load&gt;
                    </div>
                </div>

                {/* 3x2 Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 bg-white/10 p-[1px]"> 
                {/* Gap-1 and p-[1px] creates a thin border effect between cells */}
                    
                    {activitiesList.map((item, idx) => (
                        <div 
                            key={idx} 
                            className="activity-card group relative h-[320px] bg-[#0a0a0a] overflow-hidden"
                        >
                            {/* 1. Background Image (Reveals on Hover) */}
                            <div className="absolute inset-0 z-0">
                                <img 
                                    src={item.image} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover opacity-0 group-hover:opacity-40 transition-opacity duration-500 scale-105 group-hover:scale-100 ease-out"
                                />
                                {/* Overlay Gradient for readability when image is shown */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>

                            {/* 2. Content */}
                            <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
                                
                                {/* Icon: Moves up slightly on hover */}
                                <div className="mb-4 text-primary transform group-hover:-translate-y-2 transition-transform duration-500 origin-bottom-left">
                                    {item.icon}
                                </div>

                                {/* Title: Always visible */}
                                <div className="flex justify-between items-end border-b border-white/10 pb-4 group-hover:border-primary/50 transition-colors duration-500">
                                    <h3 className="text-2xl font-display font-bold text-white leading-tight">
                                        {item.title}
                                    </h3>
                                    <ArrowUpRight className="text-white/20 group-hover:text-primary transition-colors duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                </div>

                                {/* Description: Slides up and fades in on hover */}
                                <div className="overflow-hidden max-h-0 group-hover:max-h-[100px] transition-all duration-500 ease-in-out">
                                    <p className="text-gray-300 text-sm leading-relaxed pt-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                        {item.desc}
                                    </p>
                                </div>

                            </div>
                            
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-transparent border-r-white/5 group-hover:border-r-primary transition-all duration-300"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Activities;

