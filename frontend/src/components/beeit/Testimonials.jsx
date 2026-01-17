"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import SafeImage from "@/components/common/SafeImage";

const Testimonials = ({ testimonials = [] }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef(null);
    const contentRef = useRef(null);

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    useEffect(() => {
        // Simple animation when activeIndex changes
        if (contentRef.current) {
            gsap.fromTo(contentRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5 }
            );
        }
    }, [activeIndex]);

    if (!testimonials.length) return null;

    return (
        <section ref={containerRef} className="py-24 bg-background relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-6 relative z-10">

                <div className="flex justify-center mb-12">
                    <div className="bg-primary/20 p-4 rounded-full">
                        <Quote className="text-primary w-12 h-12" />
                    </div>
                </div>

                <div className="relative bg-card border border-border/50 rounded-2xl p-8 md:p-12 mb-10 shadow-lg">
                    {/* Content */}
                    <div ref={contentRef} className="text-center">
                        <p className="text-xl md:text-2xl text-text font-light italic leading-relaxed mb-8">
                            "{testimonials[activeIndex].content}"
                        </p>

                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary mb-4 relative">
                                <SafeImage
                                    src={testimonials[activeIndex].avatar}
                                    alt={testimonials[activeIndex].author}
                                    className="w-full h-full object-cover"
                                    fill
                                />
                            </div>
                            <h4 className="text-lg font-bold text-heading">{testimonials[activeIndex].author}</h4>
                            <p className="text-primary font-mono text-sm">{testimonials[activeIndex].role}</p>
                            <span className="text-text text-xs mt-1">{testimonials[activeIndex].year}</span>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-full md:-ml-8 bg-background border border-border p-3 rounded-full text-text hover:bg-primary hover:text-white hover:border-primary transition-all shadow-md"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-full md:-mr-8 bg-background border border-border p-3 rounded-full text-text hover:bg-primary hover:text-white hover:border-primary transition-all shadow-md"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* Indicators */}
                <div className="flex justify-center gap-2">
                    {testimonials.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveIndex(idx)}
                            className={`w-3 h-3 rounded-full transition-all ${idx === activeIndex ? "bg-primary w-8" : "bg-border hover:bg-gray-400"
                                }`}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Testimonials;
