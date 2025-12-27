"use client";

import React, { useEffect, useRef, useLayoutEffect } from "react";
import gsap from "gsap";

const Loading = ({ onComplete }) => {
  const loaderRef = useRef(null);
  const textContainerRef = useRef(null);
  const isCompletedRef = useRef(false);

  // Text to display - "Beeitclub" (no spaces, all lowercase)
  const text = "Beeitclub";
  const letters = text.split(""); // Split into individual letters for animation

  // Set initial state BEFORE browser paint to prevent flash
  useLayoutEffect(() => {
    // Reset state when component mounts (for page reload)
    isCompletedRef.current = false;

    // Disable scroll when loading
    document.body.style.overflow = "hidden";

    // Set initial position IMMEDIATELY in useLayoutEffect (before paint)
    // This prevents any flash of text in wrong position
    if (textContainerRef.current && typeof window !== "undefined") {
      const viewportWidth = window.innerWidth;

      // Set position immediately via inline style BEFORE browser paints
      // Text starts from left side of viewport (left: 0, visible on screen)
      const startX = 0; // Start at left edge of viewport
      textContainerRef.current.style.transform = `translate3d(${startX}px, 0, 0)`;
      textContainerRef.current.style.willChange = "transform";
      textContainerRef.current.style.backfaceVisibility = "hidden";
      textContainerRef.current.style.opacity = "1"; // Show text now that position is set

      // Set all letters to gray initially
      const letterElements = document.querySelectorAll(".loading-letter");
      letterElements.forEach((letter) => {
        letter.style.color = "#666666";
        letter.style.textShadow = "0 0 0px rgba(102, 102, 102, 0)";
        letter.style.WebkitTextStroke = "1px rgba(102, 102, 102, 0.3)";
      });

      // Also set via GSAP immediately for consistency
      gsap.set(textContainerRef.current, {
        x: startX,
        opacity: 1,
        force3D: true,
        immediateRender: true, // Render immediately, don't wait
      });
    }
  }, []);

  useEffect(() => {
    // Reset animation state on mount
    isCompletedRef.current = false;

    let ctx = null;
    let timeoutId = null;

    // Wait for DOM to be ready, then start animation
    // Use requestAnimationFrame for smoother start
    timeoutId = setTimeout(() => {
      requestAnimationFrame(() => {
        ctx = gsap.context(() => {
          const tl = gsap.timeline({
            onComplete: () => {
              isCompletedRef.current = true;
              document.body.style.overflow = "";
              onComplete();
            },
          });

          // Calculate scroll distance and duration
          // Text should start from left side of viewport (left: 0, visible)
          // and scroll until it's completely off-screen on the left
          const textWidth = textContainerRef.current?.offsetWidth || 0;
          const viewportWidth = window.innerWidth;

          // Get current position (should already be set in useLayoutEffect)
          const currentX = gsap.getProperty(textContainerRef.current, "x");
          // Start position: text at left edge of viewport (left: 0)
          const startX =
            currentX !== undefined && currentX !== 0 ? currentX : 0;

          // Ensure text is at correct starting position (no jump)
          gsap.set(textContainerRef.current, {
            x: startX,
            force3D: true,
          });

          // Calculate scroll distance: from left (0) to left (off-screen)
          // End position: right edge of text at left edge of viewport (text completely off-screen left)
          const endX = -textWidth;
          const scrollDistance = startX - endX; // Total distance to travel (from left to left, going left)
          // Fixed scroll duration: 3 seconds
          const scrollDuration = 3; // Fixed 3 seconds

          // Wait 500ms before starting scroll (text stays in place)
          tl.to({}, { duration: 0.22 }, 0);

          // Animate letters: from gray to yellow as they scroll into view
          // Each letter lights up when it appears in viewport (from left)
          const letterElements = document.querySelectorAll(".loading-letter");

          // Calculate approximate width per letter (for positioning)
          const avgLetterWidth = textWidth / letters.length;

          letterElements.forEach((letter, index) => {
            // Calculate when this letter should light up
            // Since text starts at left (x=0) and scrolls left, letters light up progressively
            // Each letter lights up when it's visible in viewport
            // Position of letter's left edge = startX + (index * avgLetterWidth)
            // Since startX = 0, letters are already visible, so light them up progressively as they scroll left
            const letterDelay =
              (index * avgLetterWidth) / (scrollDistance / scrollDuration);
            const letterStartTime = 0.22 + letterDelay;

            // Animate color from gray to yellow with glow effect
            tl.to(
              letter,
              {
                color: "#FFD60A", // Yellow color
                textShadow:
                  "0 0 40px rgba(255, 214, 10, 0.4), 0 0 80px rgba(255, 214, 10, 0.2)",
                WebkitTextStroke: "1px rgba(255, 214, 10, 0.1)", // Yellow stroke
                duration: 0.4, // Smooth transition duration
                ease: "power2.out",
              },
              letterStartTime
            );
          });

          // Scroll until text is completely off-screen on the left
          // Use force3D for better GPU acceleration and smoother animation
          tl.to(
            textContainerRef.current,
            {
              x: endX, // Move text completely off-screen to the left
              duration: scrollDuration, // Dynamic duration based on distance
              ease: "none", // Linear easing for smoothest animation (no acceleration/deceleration)
              force3D: true, // Force GPU acceleration
            },
            0.22
          ); // Start after 0.22s delay (synchronized with letter animation)

          // Wait 300ms after scroll completes
          const scrollEndTime = 0.22 + scrollDuration;
          tl.to({}, { duration: 0.3 }, scrollEndTime);

          // --- PHASE 2: SLIDE UP REVEAL ---
          // Slide the entire loading screen up to reveal content below
          // Start after: 0.22s delay + scrollDuration + 0.3s wait
          const slideStartTime = scrollEndTime + 0.3;

          // Slide up smoothly to reveal content below
          tl.to(
            loaderRef.current,
            {
              y: "-100%", // Move completely off-screen to the top
              duration: 1.2, // Longer duration for more visible effect
              ease: "power2.inOut", // Smooth easing for better visual effect
              force3D: true, // GPU acceleration
              onStart: () => {
                // Call onComplete early so content becomes visible during slide
                // This allows content to be revealed as loading slides up
                setTimeout(() => {
                  onComplete();
                }, 200); // Small delay to ensure slide animation starts
              },
            },
            slideStartTime
          );

          // Hide completely after slide completes (no fade, just slide up)
          tl.to(
            loaderRef.current,
            {
              autoAlpha: 0,
              pointerEvents: "none",
              zIndex: -1, // Move behind content after slide
              duration: 0.1,
            },
            slideStartTime + 1.2
          );
        }, loaderRef);
      });
    }, 100);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (ctx && !isCompletedRef.current) {
        ctx.revert();
      }
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] flex items-center justify-start bg-[#050505] overflow-hidden"
      style={{
        willChange: isCompletedRef.current ? "transform" : "auto",
        transform: "translateZ(0)", // Force GPU acceleration for smooth slide
        backfaceVisibility: "hidden", // Prevent flickering
      }}
    >
      {/* Large text that scrolls horizontally */}
      <div
        ref={textContainerRef}
        className="absolute left-0 whitespace-nowrap bottom-0 md:bottom-[-60px]"
        style={{
          transformOrigin: "right center",
          // Use CSS variable or fixed value to avoid hydration mismatch
          // Will be set properly in useLayoutEffect
          // Start from left edge of viewport (left: 0, visible)
          transform: "translate3d(0, 0, 0)",
          willChange: "transform",
          backfaceVisibility: "hidden",
          opacity: 0, // Hide initially, will be shown in useLayoutEffect
          overflow: "visible", // Ensure text is not clipped
          zIndex: 10, // Ensure text is above background
        }}
      >
        {letters.map((letter, index) => (
          <span
            key={index}
            className="loading-letter font-display font-black leading-none inline-block italic"
            style={{
              fontSize: "clamp(10rem, 35vw, 43vw)", // Font size as requested
              color: "#666666", // Start with gray color
              fontStyle: "italic", // Italic font style
              lineHeight: "1",
              letterSpacing: "0.02em",
              willChange: "color, text-shadow",
              WebkitTextStroke: "1px rgba(102, 102, 102, 0.3)", // Gray stroke initially
              whiteSpace: "nowrap", // Ensure text doesn't wrap
              transform: "translateZ(0)", // Force GPU acceleration
              backfaceVisibility: "hidden", // Prevent flickering
              display: "inline-block", // Ensure full text rendering
              overflow: "visible", // Ensure text is not clipped
              visibility: "visible", // Ensure text is visible
              textShadow: "0 0 0px rgba(102, 102, 102, 0)", // No shadow initially
              transition: "color 0.3s ease, text-shadow 0.3s ease", // Smooth color transition
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Loading;
