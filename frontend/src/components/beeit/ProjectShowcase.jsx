"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink, Github, Code2, Layers } from "lucide-react";
import SafeImage from "@/components/common/SafeImage";

gsap.registerPlugin(ScrollTrigger);

const ProjectShowcase = ({ projects = [] }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray(".project-card");

            cards.forEach((card, i) => {
                // 1. Text Content Reveal (Fade In Up)
                const content = card.querySelector(".project-content");
                if (content) {
                    gsap.from(content, {
                        y: 50,
                        opacity: 0,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        }
                    });
                }

                // 2. Image Parallax Effect
                const imageContainer = card.querySelector(".project-image-container");
                const image = card.querySelector("img");

                if (imageContainer && image) {
                    gsap.fromTo(imageContainer,
                        { scale: 0.9, opacity: 0 },
                        {
                            scale: 1,
                            opacity: 1,
                            duration: 1.2,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: card,
                                start: "top 85%",
                            }
                        }
                    );

                    // Parallax: Move image slightly within its container
                    gsap.to(image, {
                        yPercent: 15, // Move image down 15% as we scroll
                        ease: "none",
                        scrollTrigger: {
                            trigger: card,
                            start: "top bottom", // Start when card hits bottom of viewport
                            end: "bottom top",   // End when card leaves top
                            scrub: 1
                        }
                    });
                }
            });

        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="py-24 bg-background relative overflow-hidden">
            {/* Background Decorative */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-3xl -z-10" />

            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="mb-20">
                    <span className="font-mono text-primary text-sm tracking-[0.2em] uppercase">
            // Output_Projects
                    </span>
                    <h2 className="text-4xl md:text-6xl font-display font-bold text-heading mt-4">
                        DỰ ÁN <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">TIÊU BIỂU</span>
                    </h2>
                    <p className="mt-6 text-text max-w-2xl text-lg">
                        Những sản phẩm thực tế được xây dựng bởi chính thành viên BeeIT, từ ý tưởng đến triển khai.
                    </p>
                </div>

                {/* Projects List */}
                <div className="flex flex-col gap-32">
                    {projects.map((project, index) => (
                        <div
                            key={index}
                            className={`project-card flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
                        >
                            {/* Image Side */}
                            <div className="w-full lg:w-3/5 group relative project-image-container">
                                <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:blur-2xl transition-all duration-500 rounded-2xl opacity-50" />
                                <div className="relative rounded-2xl overflow-hidden border border-border aspect-video shadow-2xl">
                                    <SafeImage
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                        fill
                                    />

                                    {/* Overlay Links */}
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                                        {project.links?.demo && (
                                            <a href={project.links.demo} className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition-colors">
                                                <ExternalLink size={20} /> Live Demo
                                            </a>
                                        )}
                                        {project.links?.github && (
                                            <a href={project.links.github} className="flex items-center gap-2 bg-black/50 border border-white/20 text-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition-colors">
                                                <Github size={20} /> Code
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="w-full lg:w-2/5 space-y-6 project-content">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono border border-primary/20">
                                    <Code2 size={14} />
                                    {project.category}
                                </div>

                                <h3 className="text-3xl md:text-4xl font-bold text-heading">
                                    {project.title}
                                </h3>

                                <p className="text-text text-lg leading-relaxed">
                                    {project.description}
                                </p>

                                <div>
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-heading mb-3">
                                        <Layers size={16} className="text-primary" /> Tech Stack
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tech?.map((tech, i) => (
                                            <span key={i} className="px-3 py-1 bg-accent border border-border rounded text-sm text-text hover:border-primary/50 transition-colors">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="mt-20 text-center">
                    <button className="px-8 py-4 bg-transparent border border-border hover:border-primary hover:bg-primary/10 text-heading rounded-full transition-all duration-300 font-mono flex items-center gap-2 mx-auto group">
                        XEM TOÀN BỘ PROJECT
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                </div>

            </div>
        </section>
    );
};

export default ProjectShowcase;
