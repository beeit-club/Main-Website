"use client";

import React from "react";
import { UserPlus, FileText, Code, Users } from "lucide-react";

const iconMap = {
    UserPlus: <UserPlus size={24} />,
    FileText: <FileText size={24} />,
    Code: <Code size={24} />,
    Users: <Users size={24} />,
};

const JoinProcess = ({ steps = [] }) => {
    return (
        <section className="py-24 bg-background relative border-t border-border">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="font-bold text-sm text-primary uppercase tracking-wider mb-2 block">
                        Quy Trình
                    </span>
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-heading mt-4">
                        LỘ TRÌNH <span className="text-primary">GIA NHẬP</span>
                    </h2>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[45px] left-0 w-full h-0.5 bg-border" />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {steps.map((step, idx) => (
                            <div key={idx} className="relative group">
                                {/* Step Number Node */}
                                <div className="mx-auto md:mx-0 w-[90px] h-[90px] bg-background border border-border rounded-full flex items-center justify-center relative z-10 group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(255,107,0,0.4)] transition-all duration-300">
                                    <div className="w-[70px] h-[70px] bg-accent rounded-full flex items-center justify-center text-text group-hover:text-white group-hover:bg-primary/20 transition-all">
                                        {iconMap[step.icon]}
                                    </div>
                                    {/* Small circle indicator */}
                                    <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                                        {idx + 1}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="text-center md:text-left mt-6 md:pl-2">
                                    <span className="inline-block px-2 py-1 bg-accent rounded text-primary text-xs font-mono mb-2">
                                        {step.date}
                                    </span>
                                    <h3 className="text-xl font-bold text-heading mb-2 group-hover:text-primary transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-text text-sm leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <button className="bg-primary hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-full shadow-lg shadow-orange-500/20 transform hover:-translate-y-1 transition-all duration-300 text-lg">
                        ỨNG TUYỂN NGAY
                    </button>
                    <p className="mt-4 text-gray-500 text-sm">
                        *Đợt tuyển thành viên Gen 7 đang mở
                    </p>
                </div>

            </div>
        </section>
    );
};

export default JoinProcess;
