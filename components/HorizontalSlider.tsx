"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HorizontalSliderProps {
  children: React.ReactNode;
  className?: string;
  itemWidth?: string;
}

export default function HorizontalSlider({ children, className = "" }: HorizontalSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group/slider w-full">
      {/* Scroll Navigation Arrows */}
      <div className="absolute -top-12 right-0 flex items-center space-x-2 z-20">
        <button
          onClick={() => handleScroll("left")}
          disabled={!canScrollLeft}
          aria-label="Previous Slide"
          className={`p-2 rounded-full border border-border-editorial transition-all duration-300 ${
            canScrollLeft
              ? "bg-warm-white/90 text-forest hover:border-gold hover:text-gold shadow-sm cursor-pointer"
              : "opacity-30 text-text-tertiary cursor-not-allowed"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleScroll("right")}
          disabled={!canScrollRight}
          aria-label="Next Slide"
          className={`p-2 rounded-full border border-border-editorial transition-all duration-300 ${
            canScrollRight
              ? "bg-warm-white/90 text-forest hover:border-gold hover:text-gold shadow-sm cursor-pointer"
              : "opacity-30 text-text-tertiary cursor-not-allowed"
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className={`flex overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth pb-4 pt-2 -mx-2 px-2 gap-6 md:gap-8 ${className}`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>
    </div>
  );
}
