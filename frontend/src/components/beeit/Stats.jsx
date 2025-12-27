"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Default stats nếu không có data
const defaultStats = [
  { id: '1', label: 'THÀNH VIÊN', value: 350, suffix: '+' },
  { id: '2', label: 'SỰ KIỆN TỔ CHỨC', value: 42 },
  { id: '3', label: 'DỰ ÁN', value: 150, suffix: '+' },
  { id: '4', label: 'ĐỐI TÁC', value: 12 },
];

const DecryptText = ({ value, suffix = '' }) => {
  const [display, setDisplay] = useState('000');
  const elementRef = useRef(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
        ScrollTrigger.create({
            trigger: elementRef.current,
            start: "top 80%",
            once: true,
            onEnter: () => {
                const chars = 'ABCDEF0123456789!@#$%^&*';
                let iter = 0;
                const finalValue = value.toString();
                
                const interval = setInterval(() => {
                    setDisplay(prev => 
                        finalValue.split('').map((char, index) => {
                            if (index < iter) return char;
                            return chars[Math.floor(Math.random() * chars.length)];
                        }).join('')
                    );
                    
                    if (iter >= finalValue.length) {
                        clearInterval(interval);
                        setDisplay(finalValue);
                    }
                    iter += 1 / 3; // Speed of decryption
                }, 50);
            }
        });
    }, elementRef);

    return () => ctx.revert();
  }, [value]);

  return <span ref={elementRef} className="font-mono text-primary">{display}{suffix}</span>;
};

const Stats = ({ stats = [] }) => {
  // Log stats khi component nhận được
  useEffect(() => {
    console.log('📊 [STATS] Component received stats:', stats);
    console.log('📊 [STATS] Stats count:', stats?.length || 0);
    if (stats?.length > 0) {
      stats.forEach((stat, index) => {
        console.log(`📊 [STATS] Stat ${index + 1}:`, {
          id: stat.id,
          stat_key: stat.stat_key,
          value: stat.value,
          label: stat.label,
          suffix: stat.suffix,
          updated_at: stat.updated_at,
        });
      });
    } else {
      console.log('⚠️ [STATS] No stats data, using defaultStats');
    }
  }, [stats]);

  // Sử dụng stats từ props hoặc default
  const displayStats = stats.length > 0 ? stats : defaultStats;

  return (
    <section className="py-32 bg-background border-y border-white/5 relative">
        <div className="absolute inset-0 flex justify-center items-center opacity-10 pointer-events-none">
            <div className="w-[80vw] h-[80vw] border border-accent rounded-full animate-spin-slow duration-[30s]"></div>
            <div className="absolute w-[60vw] h-[60vw] border border-primary/50 rounded-full animate-reverse-spin"></div>
        </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
        {displayStats.map((stat) => (
          <div key={stat.id || stat.stat_key} className="text-center group">
            <div className="mb-4 h-1 w-full bg-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-accent w-0 group-hover:w-full transition-all duration-500 ease-out"></div>
            </div>
            <div className="text-5xl md:text-7xl font-bold font-display text-heading mb-2">
              <DecryptText value={stat.value} suffix={stat.suffix || ''} />
            </div>
            <div className="text-sm font-mono text-text tracking-widest uppercase">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
