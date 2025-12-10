"use client";

import { useEffect } from "react";
import HeroSection from "@/components/beeit/HeroSection";
import AboutSection from "@/components/beeit/AboutSection";
import FounderSection from "@/components/beeit/FounderSection";
import ActivitiesSection from "@/components/beeit/ActivitiesSection";
import ContactSection from "@/components/beeit/ContactSection";
import MemoryScroller from "@/components/beeit/MemoryScroller";

export default function BeeITLandingPage() {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      {/* Background gradient effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/95" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Sections */}
      <HeroSection />
      <ActivitiesSection />
      <MemoryScroller />
      <AboutSection />
      <FounderSection />
      <ContactSection />
    </main>
  );
}
