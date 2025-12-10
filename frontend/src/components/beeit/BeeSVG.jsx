"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const BeeSVG = ({ 
  x = 0, 
  y = 0, 
  scale = 1, 
  rotation = 0,
  wingFlapSpeed = 0.3,
  className = "" 
}) => {
  const beeRef = useRef(null);
  const leftWingRef = useRef(null);
  const rightWingRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (!leftWingRef.current || !rightWingRef.current) return;

    // Wing flapping animation
    const wingAnimation = gsap.to([leftWingRef.current, rightWingRef.current], {
      rotation: 30,
      transformOrigin: "center center",
      duration: wingFlapSpeed,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.05,
    });

    // Body slight movement
    if (bodyRef.current) {
      gsap.to(bodyRef.current, {
        y: -2,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    return () => {
      wingAnimation.kill();
    };
  }, [wingFlapSpeed]);

  useEffect(() => {
    if (beeRef.current) {
      gsap.set(beeRef.current, {
        x,
        y,
        scale,
        rotation,
      });
    }
  }, [x, y, scale, rotation]);

  return (
    <svg
      ref={beeRef}
      className={`bee-svg ${className}`}
      width="80"
      height="80"
      viewBox="0 0 80 80"
      style={{ 
        position: "absolute",
        pointerEvents: "none",
        zIndex: 1000,
      }}
    >
      {/* Left wing */}
      <path
        ref={leftWingRef}
        d="M 20 25 Q 15 20 10 25 Q 15 30 20 25"
        fill="rgba(255, 255, 255, 0.6)"
        stroke="rgba(0, 0, 0, 0.1)"
        strokeWidth="0.5"
        transformOrigin="25 25"
      />
      
      {/* Right wing */}
      <path
        ref={rightWingRef}
        d="M 60 25 Q 65 20 70 25 Q 65 30 60 25"
        fill="rgba(255, 255, 255, 0.6)"
        stroke="rgba(0, 0, 0, 0.1)"
        strokeWidth="0.5"
        transformOrigin="55 25"
      />
      
      {/* Body */}
      <ellipse
        ref={bodyRef}
        cx="40"
        cy="40"
        rx="18"
        ry="12"
        fill="#FFC107"
        stroke="#FF8F00"
        strokeWidth="1.5"
      />
      
      {/* Body stripes */}
      <line x1="30" y1="35" x2="30" y2="45" stroke="#FF8F00" strokeWidth="2" />
      <line x1="40" y1="33" x2="40" y2="47" stroke="#FF8F00" strokeWidth="2" />
      <line x1="50" y1="35" x2="50" y2="45" stroke="#FF8F00" strokeWidth="2" />
      
      {/* Head */}
      <circle cx="40" cy="30" r="10" fill="#FFC107" stroke="#FF8F00" strokeWidth="1.5" />
      
      {/* Eyes */}
      <circle cx="37" cy="28" r="2" fill="#000" />
      <circle cx="43" cy="28" r="2" fill="#000" />
      
      {/* Antennae */}
      <line x1="35" y1="22" x2="32" y2="18" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="45" y1="22" x2="48" y2="18" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="32" cy="18" r="1.5" fill="#000" />
      <circle cx="48" cy="18" r="1.5" fill="#000" />
      
      {/* Stinger */}
      <path d="M 25 40 L 22 45 L 25 44 Z" fill="#000" />
    </svg>
  );
};

export default BeeSVG;

