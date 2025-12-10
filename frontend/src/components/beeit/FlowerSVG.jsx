"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { gsap } from "gsap";

const FlowerSVG = forwardRef(({
  x = 0,
  y = 0,
  size = 60,
  color = "#4CAF50",
  bloomProgress = 0, // 0 = bud, 1 = fully bloomed
  className = "",
}, ref) => {
  const flowerRef = useRef(null);
  const petalsRef = useRef([]);

  useImperativeHandle(ref, () => flowerRef.current);

  useEffect(() => {
    if (flowerRef.current) {
      gsap.set(flowerRef.current, {
        x,
        y,
        scale: size / 60,
      });
    }
  }, [x, y, size]);

  useEffect(() => {
    // Animate petals based on bloom progress
    petalsRef.current.forEach((petal, index) => {
      if (petal) {
        const angle = (index * 60) - 90; // 6 petals, 60 degrees apart
        const radius = 20 * bloomProgress;
        const petalX = Math.cos((angle * Math.PI) / 180) * radius;
        const petalY = Math.sin((angle * Math.PI) / 180) * radius;
        const rotation = angle + 90;
        const scale = 0.3 + bloomProgress * 0.7;

        gsap.to(petal, {
          x: petalX,
          y: petalY,
          rotation: rotation,
          scale: scale,
          opacity: bloomProgress,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });

    // Center circle
    const center = flowerRef.current?.querySelector(".flower-center");
    if (center) {
      gsap.to(center, {
        scale: bloomProgress,
        opacity: bloomProgress,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [bloomProgress]);

  const petals = Array.from({ length: 6 }, (_, i) => i);

  return (
    <svg
      ref={flowerRef}
      className={`flower-svg ${className}`}
      width={size}
      height={size}
      viewBox="0 0 60 60"
      style={{
        position: "absolute",
        pointerEvents: "none",
        transformOrigin: "center center",
      }}
    >
      {/* Petals */}
      {petals.map((_, index) => (
        <ellipse
          key={index}
          ref={(el) => (petalsRef.current[index] = el)}
          cx="30"
          cy="30"
          rx="8"
          ry="12"
          fill={color}
          stroke={color}
          strokeWidth="0.5"
          opacity="0"
          transformOrigin="30 30"
        />
      ))}

      {/* Center circle */}
      <circle
        className="flower-center"
        cx="30"
        cy="30"
        r="6"
        fill="#FFC107"
        stroke="#FF8F00"
        strokeWidth="1"
        opacity="0"
      />

      {/* Stem (always visible) */}
      <line
        x1="30"
        y1="50"
        x2="30"
        y2="60"
        stroke="#4CAF50"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
});

FlowerSVG.displayName = "FlowerSVG";

export default FlowerSVG;

