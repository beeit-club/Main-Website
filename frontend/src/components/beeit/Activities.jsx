"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Terminal, Mic, Share2, BookOpen, Swords, Rocket, ArrowUpRight } from 'lucide-react';
import SafeImage from "@/components/common/SafeImage";

gsap.registerPlugin(ScrollTrigger);

const iconMap = {
    Terminal: <Terminal size={40} />,
    Mic: <Mic size={40} />,
    Share2: <Share2 size={40} />,
    BookOpen: <BookOpen size={40} />,
    Swords: <Swords size={40} />,
    Rocket: <Rocket size={40} />,
};

const Activities = ({ activities = [] }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Batch animation for grid items entrance - Pop-up effect
            ScrollTrigger.batch(".activity-card", {
                onEnter: (elements) => {
                    gsap.from(elements, {
                        y: 60,
                        opacity: 0,
                        scale: 0.8,
                        stagger: 0.1,
                        duration: 1,
                        ease: "back.out(1.7)", // Slight overshoot for pop effect
                        overwrite: true
                    });
                },
                once: true, // Only animate once
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
                        <span className="font-bold text-sm text-primary uppercase tracking-wider mb-2 block">
                            Hoạt Động
                        </span>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-heading mt-4">
                            SỰ KIỆN <br /> NỔI BẬT
                        </h2>
                    </div>
                </div>

                {/* 3x2 Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 bg-border/50 p-[1px]">
                    {/* Gap-1 and p-[1px] creates a thin border effect between cells */}

                    {activities.map((item, idx) => (
                        <div
                            key={idx}
                            className="activity-card group relative h-[320px] bg-card overflow-hidden"
                        >

                            {/* 1. Background Image (Reveals on Hover) */}
                            <div className="absolute inset-0 z-0">
                                <SafeImage
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover opacity-0 group-hover:opacity-40 transition-opacity duration-500 scale-105 group-hover:scale-100 ease-out"
                                    fill
                                />
                                {/* Overlay Gradient for readability when image is shown */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>

                            {/* 2. Content */}
                            <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">

                                {/* Icon: Moves up slightly on hover */}
                                <div className="mb-4 text-primary transform group-hover:-translate-y-2 transition-transform duration-500 origin-bottom-left">
                                    {iconMap[item.icon]}
                                </div>

                                {/* Title: Always visible */}
                                <div className="flex justify-between items-end border-b border-border pb-4 group-hover:border-primary/50 transition-colors duration-500">
                                    <h3 className="text-2xl font-display font-bold text-heading leading-tight">
                                        {item.title}
                                    </h3>
                                    <ArrowUpRight className="text-text group-hover:text-primary transition-colors duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                </div>

                                {/* Description: Slides up and fades in on hover */}
                                <div className="overflow-hidden max-h-0 group-hover:max-h-[100px] transition-all duration-500 ease-in-out">
                                    <p className="text-text text-sm leading-relaxed pt-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
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

