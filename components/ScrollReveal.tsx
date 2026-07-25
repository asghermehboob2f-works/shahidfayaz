"use client";

import React from "react";
import { motion, useInView } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: "fadeUp" | "fadeIn" | "blurIn" | "scaleUp" | "slideRight" | "slideLeft" | "editorialReveal";
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  variant = "fadeUp",
  delay = 0,
  duration = 0.8,
  className = "",
  once = true,
}: ScrollRevealProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once, margin: "-60px" });

  const getVariants = () => {
    switch (variant) {
      case "fadeUp":
        return {
          hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)" },
        };
      case "fadeIn":
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
      case "blurIn":
        return {
          hidden: { opacity: 0, filter: "blur(16px)", scale: 0.95 },
          visible: { opacity: 1, filter: "blur(0px)", scale: 1 },
        };
      case "scaleUp":
        return {
          hidden: { opacity: 0, scale: 0.9, y: 25 },
          visible: { opacity: 1, scale: 1, y: 0 },
        };
      case "slideRight":
        return {
          hidden: { opacity: 0, x: -50, filter: "blur(6px)" },
          visible: { opacity: 1, x: 0, filter: "blur(0px)" },
        };
      case "slideLeft":
        return {
          hidden: { opacity: 0, x: 50, filter: "blur(6px)" },
          visible: { opacity: 1, x: 0, filter: "blur(0px)" },
        };
      case "editorialReveal":
        return {
          hidden: { opacity: 0, y: 60, rotate: -1.5, filter: "blur(8px)" },
          visible: { opacity: 1, y: 0, rotate: 0, filter: "blur(0px)" },
        };
      default:
        return {
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 },
        };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={getVariants()}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.12,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 35, filter: "blur(6px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function KineticMarquee({
  items,
  speed = 25,
  className = "",
}: {
  items: string[];
  speed?: number;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden whitespace-nowrap flex select-none ${className}`}>
      <motion.div
        className="flex gap-8 shrink-0 items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: speed,
        }}
      >
        {[...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center gap-8">
            <span className="font-heading text-4xl md:text-6xl tracking-widest text-gold/30 uppercase italic">
              {text}
            </span>
            <span className="w-2 h-2 rounded-full bg-gold/40 inline-block" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
