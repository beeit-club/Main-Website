"use client";

import React, { useEffect, useRef, useState } from "react";
import Hero from "@/components/beeit/Hero";
import About from "@/components/beeit/About";
import Activities from "@/components/beeit/Activities";
import Timeline from "@/components/beeit/Timeline";
import HallOfFame from "@/components/beeit/HallOfFame";
import TheKernel from "@/components/beeit/TheKernel";
import Stats from "@/components/beeit/Stats";
import BehindTheCode from "@/components/beeit/BehindTheCode";
import Loading from "@/components/beeit/Loading";
import ProjectShowcase from "@/components/beeit/ProjectShowcase";
import MemberMoments from "@/components/beeit/MemberMoments";
import Testimonials from "@/components/beeit/Testimonials";
import JoinProcess from "@/components/beeit/JoinProcess";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register globally to ensure it's ready
gsap.registerPlugin(ScrollTrigger);

const BeeITPageClient = ({ initialData }) => {
  const contentRef = useRef(null);
  // State always starts from true on every mount/reload
  const [isLoading, setIsLoading] = useState(true);

  // Scroll to top when component mounts (page reload)
  useEffect(() => {
    // Scroll to top immediately on mount
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    // Only initialize Lenis after loading completes (if Lenis is available)
    if (!isLoading) {
      let lenis;
      let reqId;

      if (typeof window !== "undefined" && window.Lenis) {
        lenis = new window.Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 2,
          infinite: false,
        });

        // Update ScrollTrigger on Lenis scroll event
        lenis.on("scroll", ScrollTrigger.update);

        // Use standard requestAnimationFrame for maximum compatibility
        const raf = (time) => {
          lenis.raf(time);
          reqId = requestAnimationFrame(raf);
        };

        reqId = requestAnimationFrame(raf);

        // Refresh ScrollTrigger to ensure start/end positions are correct after init
        ScrollTrigger.refresh();
      }

      return () => {
        if (lenis) {
          lenis.destroy();
          cancelAnimationFrame(reqId);
        }
      };
    }
  }, [isLoading]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Scroll to top when loading completes
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  useEffect(() => {
    console.log("🔥CLIENT RECEIVED DATA:", initialData);
  }, [initialData]);

  // Extract data from initialData
  const heroData = initialData?.hero || null;
  const statsData = initialData?.stats || [];
  const leadersData = initialData?.leaders || [];
  const achievementsData = initialData?.achievements || [];
  const photosData = initialData?.photos || [];

  // New props
  const timelineData = initialData?.timeline || {};
  const activitiesData = initialData?.activities || [];
  const projectsData = initialData?.projects || [];
  const momentsData = initialData?.moments || [];
  const testimonialsData = initialData?.testimonials || [];
  const joinProcessData = initialData?.joinProcess || [];

  return (
    <div className="bg-background min-h-screen text-text selection:bg-primary selection:text-background">
      {/* Loading Screen - Shows first, blocks scroll */}
      {isLoading && <Loading onComplete={handleLoadingComplete} />}

      {/* Main Content - Pre-render but hide until loading completes for instant display */}
      <div
        ref={contentRef}
        className={`relative bg-background shadow-2xl ${isLoading ? "opacity-0 pointer-events-none" : "opacity-100 z-10"
          }`}
        style={{
          // Ensure content is visible when loading completes
          willChange: isLoading ? "opacity" : "auto",
          // Remove transition to allow slide up reveal
          transition: isLoading ? "none" : "opacity 0.2s ease-in",
        }}
      >
        {/* Background gradient effects */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/95" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        {/* Sections - Pass data as props */}
        <Hero data={heroData} />
        <Timeline corePillars={timelineData?.pillars} events={timelineData?.events} />
        <Activities activities={activitiesData} />
        <TheKernel leaders={leadersData} />
        <HallOfFame achievements={achievementsData} />
        <ProjectShowcase projects={projectsData} />
        <Stats stats={statsData} />
        <MemberMoments moments={momentsData} />
        <Testimonials testimonials={testimonialsData} />
        <JoinProcess steps={joinProcessData} />
        <BehindTheCode photos={photosData} />
      </div>
    </div>
  );
};

export default BeeITPageClient;
