"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Camera } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const MemberMoments = ({ moments = [] }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".moment-item", {
                scrollTrigger: {
                    trigger: ".masonry-grid",
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl font-display font-bold text-heading flex items-center gap-3">
                            <Camera className="text-primary" size={32} />
                            BEE MOMENTS
                        </h2>
                        <p className="mt-2 text-text">Những khoảnh khắc đáng nhớ của đại gia đình BeeIT</p>
                    </div>
                </div>

                <div className="masonry-grid columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {moments.map((item, idx) => (
                        <div key={idx} className="moment-item break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer">
                            <div className={`w-full ${item.height} relative`}>
                                <img
                                    src={item.src}
                                    alt={item.caption}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                    <span className="text-white font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        {item.caption}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MemberMoments;
