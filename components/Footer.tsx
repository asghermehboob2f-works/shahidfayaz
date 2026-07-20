"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown } from "lucide-react";

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface NavItem {
  id: number;
  label: string;
  url: string;
}

interface FooterProps {
  navItems: NavItem[];
  siteName: string;
  bioShort: string;
  socials: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export default function Footer({ navItems, siteName, bioShort, socials }: FooterProps) {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [navExpanded, setNavExpanded] = useState(false);
  const [newsletterExpanded, setNewsletterExpanded] = useState(false);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const headerNav = navItems.filter((item) => !item.url.includes("privacy") && !item.url.includes("terms"));
  const legalNav = navItems.filter((item) => item.url.includes("privacy") || item.url.includes("terms"));

  return (
    <footer className="bg-soft-ivory border-t border-border-editorial pt-12 pb-8 mt-auto w-full">
      <div className="max-w-[1800px] mx-auto px-6 md:px-10 lg:px-16 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6 pb-8 border-b border-border-editorial">
        {/* Author Brand & Bio */}
        <div className="md:col-span-5 flex flex-col space-y-4">
          <Link href="/" className="inline-block shrink-0">
            <Image
              src="/media/logo.png?v=2"
              alt={siteName || "Logo"}
              width={260}
              height={80}
              unoptimized
              className="h-12 md:h-16 lg:h-18 w-auto object-contain"
            />
          </Link>
          <p className="text-xs leading-relaxed max-w-sm text-text-secondary font-body">
            {bioShort}
          </p>
          <div className="flex space-x-5 pt-1.5 items-center">
            {socials.twitter && (
              <a
                href={socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-forest hover:scale-108 transition-all duration-300"
                aria-label="Twitter"
              >
                <TwitterIcon className="w-4.5 h-4.5" />
              </a>
            )}
            {socials.instagram && (
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-forest hover:scale-108 transition-all duration-300"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4.5 h-4.5" />
              </a>
            )}
            {socials.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-forest hover:scale-108 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4.5 h-4.5" />
              </a>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-3 md:col-start-7 flex flex-col space-y-4">
          <button 
            onClick={() => setNavExpanded(!navExpanded)}
            className="flex items-center justify-between w-full md:cursor-default md:pointer-events-none focus:outline-none"
          >
            <h4 className="text-[10px] uppercase tracking-[0.25em] font-bold text-forest font-body">
              Navigation
            </h4>
            <ChevronDown className={`w-4 h-4 text-forest transition-transform md:hidden ${navExpanded ? "rotate-180" : ""}`} />
          </button>
          <ul className={`flex-col space-y-2.5 overflow-hidden transition-all duration-300 ${navExpanded ? "max-h-64 mt-4" : "max-h-0"} md:max-h-none md:mt-0 flex`}>
            {headerNav.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.url}
                  className="text-xs text-text-secondary hover:text-forest transition-colors duration-200 hover:underline underline-offset-4"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div className="md:col-span-3 flex flex-col space-y-4">
          <button 
            onClick={() => setNewsletterExpanded(!newsletterExpanded)}
            className="flex items-center justify-between w-full md:cursor-default md:pointer-events-none focus:outline-none"
          >
            <h4 className="text-[10px] uppercase tracking-[0.25em] font-bold text-forest font-body">
              Newsletter
            </h4>
            <ChevronDown className={`w-4 h-4 text-forest transition-transform md:hidden ${newsletterExpanded ? "rotate-180" : ""}`} />
          </button>
          <div className={`flex-col space-y-4 overflow-hidden transition-all duration-300 ${newsletterExpanded ? "max-h-64 mt-4" : "max-h-0"} md:max-h-none md:mt-0 flex`}>
          <p className="text-[11px] text-text-secondary leading-relaxed font-body">
            Subscribe to receive publication notices and essays.
          </p>
          <form onSubmit={handleSubscribe} className="relative flex flex-col space-y-2">
            <div className="relative">
              <input
                type="email"
                placeholder="YOUR EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-warm-white border border-border-editorial text-[10px] px-3.5 py-2.5 tracking-wider pr-10 focus:outline-none focus:border-forest transition-colors font-semibold"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-text-secondary hover:text-forest transition-colors"
                aria-label="Subscribe"
                disabled={status === "loading"}
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {status === "success" && (
              <span className="text-[10px] text-forest font-semibold">Thank you for subscribing.</span>
            )}
            {status === "error" && (
              <span className="text-[10px] text-red-700 font-semibold">An error occurred. Try again.</span>
            )}
          </form>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-10 lg:px-16 pt-4 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 text-[11px] text-text-tertiary">
        <div className="flex items-center space-x-1 font-body">
          <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
        </div>
        <div className="flex space-x-5 font-semibold">
          {legalNav.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              className="hover:text-forest transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
          {legalNav.length === 0 && (
            <>
              <Link href="/privacy-policy" className="hover:text-forest transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-forest transition-colors duration-200">
                Terms of Service
              </Link>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
