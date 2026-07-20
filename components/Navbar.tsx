"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  id: number;
  label: string;
  url: string;
}

interface NavbarProps {
  navItems: NavItem[];
  siteName: string;
}

export default function Navbar({ navItems, siteName }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Hide navbar on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Filter out legal items from right desktop nav to avoid duplication
  const mainNavItems = navItems.filter(
    (item) => item.url !== "/privacy-policy" && item.url !== "/terms"
  );

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "navbar-glass py-2.5 shadow-sm"
          : "bg-transparent py-4 border-b border-transparent"
      }`}
    >
      <div className="w-full px-6 md:px-10 lg:px-16 flex justify-between items-center">
        {/* Left Section: Logo */}
        <div className="flex items-center">
          <Link href="/" className="group flex items-center shrink-0">
            <Image
              src="/media/logo.png?v=2"
              alt={siteName || "Logo"}
              width={180}
              height={50}
              priority
              unoptimized
              className="h-7 md:h-9 lg:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Desktop Navigation (Right Side) */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-5">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.url;
            const isContact = item.url === "/contact" || item.label.toLowerCase() === "contact";

            if (isContact) {
              return (
                <Link
                  key={item.id}
                  href={item.url}
                  className={`text-[11px] uppercase tracking-[0.2em] font-semibold font-body px-4 py-1.5 rounded-full transition-all duration-300 shadow-xs ${
                    isActive
                      ? "bg-forest text-warm-white shadow-md scale-105"
                      : "bg-forest/10 text-forest border border-forest/30 hover:bg-forest hover:text-warm-white hover:border-forest hover:shadow-md hover:scale-102"
                  }`}
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.url}
                className={`text-[11px] uppercase tracking-[0.25em] font-medium font-body nav-link-editorial transition-colors duration-300 ${
                  isActive
                    ? "text-forest active font-semibold"
                    : "text-text-secondary hover:text-forest"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Legal Links: Privacy Policy & Terms of Service */}
          <div className="flex items-center space-x-2 border-l border-border-editorial/60 pl-3.5 py-0.5 ml-1">
            <Link
              href="/privacy-policy"
              className={`text-[9px] uppercase tracking-[0.18em] font-medium font-body transition-colors duration-300 ${
                pathname === "/privacy-policy"
                  ? "text-forest font-semibold"
                  : "text-text-tertiary hover:text-forest"
              }`}
            >
              Privacy Policy
            </Link>
            <span className="text-border-editorial/70 text-[8px] select-none">•</span>
            <Link
              href="/terms"
              className={`text-[9px] uppercase tracking-[0.18em] font-medium font-body transition-colors duration-300 ${
                pathname === "/terms"
                  ? "text-forest font-semibold"
                  : "text-text-tertiary hover:text-forest"
              }`}
            >
              Terms of Service
            </Link>
          </div>

          {/* Search Button (Far Right) */}
          <Link
            href="/search"
            aria-label="Search"
            className="text-text-secondary hover:text-forest transition-colors duration-300 p-1.5 rounded-full hover:bg-forest/5 border-l border-border-editorial/40 pl-2.5 ml-1"
          >
            <Search className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center space-x-4">
          <Link
            href="/search"
            aria-label="Search"
            className="text-text-secondary hover:text-forest transition-colors duration-300 p-1"
          >
            <Search className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-forest hover:text-gold transition-colors duration-300 focus:outline-none z-50 relative"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Premium Slide-in Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 md:hidden"
            />

            {/* Slide-in Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[80%] max-w-[360px] bg-warm-white shadow-2xl z-40 flex flex-col justify-between p-8 pt-28 pb-10 md:hidden border-l border-border-editorial"
            >
              <div className="flex flex-col space-y-5">
                {mainNavItems.map((item) => {
                  const isActive = pathname === item.url;
                  const isContact = item.url === "/contact" || item.label.toLowerCase() === "contact";

                  if (isContact) {
                    return (
                      <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="pt-2"
                      >
                        <Link
                          href={item.url}
                          onClick={() => setIsOpen(false)}
                          className="w-full text-center text-xs uppercase tracking-widest font-body font-semibold px-5 py-3 rounded-full bg-forest text-warm-white hover:bg-gold transition-colors duration-300 shadow-md block"
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ x: 6 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Link
                        href={item.url}
                        onClick={() => setIsOpen(false)}
                        className={`text-xl uppercase tracking-wider font-heading font-medium pb-2 block border-b border-border-editorial/40 transition-colors duration-300 ${
                          isActive ? "text-gold" : "text-forest hover:text-gold"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Mobile Legal Links (Privacy & Terms) */}
              <div className="pt-6 border-t border-border-editorial/60 flex flex-col space-y-2 text-xs">
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-gold">Legal & Policy</span>
                <div className="flex space-x-4">
                  <Link
                    href="/privacy-policy"
                    onClick={() => setIsOpen(false)}
                    className={`text-[11px] uppercase tracking-wider font-body ${
                      pathname === "/privacy-policy" ? "text-forest font-semibold" : "text-text-secondary hover:text-forest"
                    }`}
                  >
                    Privacy Policy
                  </Link>
                  <span className="text-border-editorial">•</span>
                  <Link
                    href="/terms"
                    onClick={() => setIsOpen(false)}
                    className={`text-[11px] uppercase tracking-wider font-body ${
                      pathname === "/terms" ? "text-forest font-semibold" : "text-text-secondary hover:text-forest"
                    }`}
                  >
                    Terms of Service
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

