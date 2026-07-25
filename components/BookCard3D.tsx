"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface BookCard3DProps {
  book: {
    id: number;
    title: string;
    subtitle?: string | null;
    description: string | null;
    coverImage?: string | null;
    format?: string | null;
    price?: number | null;
    currency?: string | null;
    slug: string;
    category?: { name: string } | null;
  };
  layout?: "grid" | "horizontal";
}

export default function BookCard3D({ book, layout = "horizontal" }: BookCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -12;
    const rY = ((x - centerX) / centerX) * 12;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.35,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative border border-border-editorial/80 bg-gradient-to-b from-warm-white/90 via-soft-ivory/40 to-warm-white/90 backdrop-blur-md p-7 md:p-10 rounded-sm shadow-editorial hover:shadow-2xl transition-all duration-500 hover:border-gold/60 overflow-hidden flex flex-col justify-between"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Background Subtle Spotlight Glow on Hover */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-sm z-0"
        style={{
          background: `radial-gradient(600px circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(185, 152, 91, 0.12), transparent 40%)`,
        }}
      />

      <div className={`relative z-10 flex ${layout === "horizontal" ? "flex-col md:flex-row gap-8 md:gap-10 items-center" : "flex-col gap-6"}`}>
        {/* 3D Book Cover Presentation Container */}
        <div
          className="relative shrink-0 w-44 md:w-48 aspect-[2/3] transition-transform duration-300 ease-out cursor-pointer"
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Realistic Book Shadow */}
          <div className="absolute inset-0 bg-black/30 blur-xl translate-y-4 translate-x-2 scale-95 group-hover:scale-100 group-hover:translate-y-6 transition-all duration-500 pointer-events-none" />

          {/* Book Spine 3D Layer Simulation */}
          <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-forest-dark via-forest to-transparent opacity-80 -translate-x-1.5 transform -rotate-y-90 origin-right pointer-events-none" />

          {/* Main Book Cover Image */}
          <div className="relative w-full h-full overflow-hidden shadow-2xl rounded-xs border border-border-editorial/40 bg-white">
            <img
              src={book.coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600"}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />

            {/* Dynamic Glare Reflection overlay */}
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-300"
              style={{
                opacity: glarePosition.opacity,
                background: `linear-gradient(135deg, rgba(255, 255, 255, ${glarePosition.opacity * 1.5}) 0%, transparent 60%)`,
              }}
            />

            {/* Book Spine Highlight Overlay */}
            <div className="absolute top-0 bottom-0 left-0 w-[4%] bg-gradient-to-r from-white/40 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Book Details */}
        <div className="flex flex-col justify-between space-y-5 flex-grow">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 items-center">
              {book.format && (
                <span className="text-[10px] font-bold tracking-[0.2em] text-gold uppercase px-2 py-0.5 bg-gold/10 border border-gold/20 rounded-xs">
                  {book.format}
                </span>
              )}
              {book.category && (
                <>
                  <span className="text-text-tertiary text-xs">•</span>
                  <span className="text-[10px] font-semibold tracking-widest text-text-secondary uppercase">
                    {book.category.name}
                  </span>
                </>
              )}
            </div>

            <h3 className="font-heading text-2xl md:text-3xl font-semibold text-forest leading-snug group-hover:text-gold transition-colors duration-300">
              {book.title}
            </h3>

            {book.subtitle && (
              <p className="text-xs font-heading italic text-text-secondary">
                {book.subtitle}
              </p>
            )}

            <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed font-body">
              {book.description}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-border-editorial/40">
            {book.price ? (
              <span className="text-xs font-bold tracking-wider text-forest uppercase font-body">
                {book.currency || "USD"} ${book.price.toFixed(2)}
              </span>
            ) : (
              <span className="text-[10px] uppercase tracking-widest text-gold font-bold">
                Collector&apos;s Edition
              </span>
            )}

            <Link
              href={`/books/${book.slug}`}
              className="text-xs font-bold tracking-[0.18em] uppercase text-forest group-hover:text-gold inline-flex items-center gap-2 transition-all duration-300 group-hover:translate-x-1"
            >
              <span>Explore Edition</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
