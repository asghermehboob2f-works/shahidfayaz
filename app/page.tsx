import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowRight, BookOpen, Calendar, Clock, Sparkles, Award, Compass, Feather } from "lucide-react";
import ScrollReveal, { StaggerContainer, StaggerItem, KineticMarquee } from "@/components/ScrollReveal";
import BookCard3D from "@/components/BookCard3D";
import HorizontalSlider from "@/components/HorizontalSlider";

export const revalidate = 0; // Dynamic server page

export default async function HomePage() {
  let heroSec, aboutSec, quoteSec, featuredSec, worksSec, articleSec, contactSec;
  let featuredBooks: any[] = [];
  let latestArticle: any = null;
  let articlesList: any[] = [];
  let latestWorks: any[] = [];

  try {
    const sections = await prisma.homepageSection.findMany();

    heroSec = sections.find((s) => s.key === "hero");
    aboutSec = sections.find((s) => s.key === "about_preview");
    quoteSec = sections.find((s) => s.key === "quote");
    featuredSec = sections.find((s) => s.key === "featured_books");
    worksSec = sections.find((s) => s.key === "works");
    articleSec = sections.find((s) => s.key === "latest_article");
    contactSec = sections.find((s) => s.key === "contact_banner");

    featuredBooks = await prisma.book.findMany({
      where: { isFeatured: true, isPublished: true },
      orderBy: { sortOrder: "asc" },
      take: 8,
    });

    articlesList = await prisma.article.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 6,
    });

    latestArticle = articlesList[0] || null;

    latestWorks = await prisma.work.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
      take: 4,
    });
  } catch (error) {
    console.error("Home page query error:", error);
  }

  // Fallbacks
  const heroTitle = heroSec?.title || "Writing the Spaces Between Silences";
  const heroSubtitle = heroSec?.subtitle || "Shahid Fayaz";
  const heroContent = heroSec?.content || "An acclaimed author, philosopher, and social thinker examining geopolitical memory, language, and the power of the unsaid.";
  const heroImage = heroSec?.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800";
  const showHero = heroSec ? heroSec.isVisible : true;
  let heroStats = [
    { value: "03", label: "Published Books" },
    { value: "LSE", label: "Doctoral Fellow" },
    { value: "12+", label: "Global Honors" },
  ];

  let heroMarquee = [
    "POST-COLONIAL PHILOSOPHY",
    "GEOPOLITICAL MEMORY",
    "SUB-HIMALAYAN ARCHIVES",
    "LITERARY SOVEREIGNTY",
    "THE ANATOMY OF SILENCES",
  ];

  if (heroSec?.extraData) {
    try {
      const parsed = JSON.parse(heroSec.extraData);
      if (Array.isArray(parsed?.stats)) {
        heroStats = parsed.stats;
      } else if (Array.isArray(parsed)) {
        heroStats = parsed;
      }
      if (Array.isArray(parsed?.marquee)) {
        heroMarquee = parsed.marquee;
      }
    } catch (e) {
      console.error("Hero extraData parse error:", e);
    }
  }

  const showAbout = aboutSec ? aboutSec.isVisible : true;
  const aboutTitle = aboutSec?.title || "A Life Dedicated to Ideas";
  const aboutSubtitle = aboutSec?.subtitle || "Biography Brief";
  const aboutContent = aboutSec?.content || "Shahid Fayaz is a post-colonial scholar and writer whose novels and philosophical treatises examine borders, language loss, and political resistance.";

  const showQuote = quoteSec ? quoteSec.isVisible : true;
  const quoteTitle = quoteSec?.title || "The Anatomy of Silences";
  const quoteSubtitle = quoteSec?.subtitle || "Philosophical Anchor";
  const quoteContent = quoteSec?.content || "“He who controls the grammar of power dictates what can be spoken. Therefore, silence is not merely a retreat; it is the final, unassailable fortress of human sovereignty.”";

  const showFeatured = featuredSec ? featuredSec.isVisible : true;
  const featuredTitle = featuredSec?.title || "Featured Publications";
  const featuredSubtitle = featuredSec?.subtitle || "Selected Bibliography";

  const showWorks = worksSec ? worksSec.isVisible : true;
  const worksTitle = worksSec?.title || "Research & Works";
  const worksSubtitle = worksSec?.subtitle || "Contributions";
  const worksContent = worksSec?.content || "Academic contributions, community-led initiatives, and social essays documenting border realities.";

  const showArticle = articleSec ? articleSec.isVisible : true;
  const articleTitle = articleSec?.title || "Latest Essay";
  const articleSubtitle = articleSec?.subtitle || "Editorial Diary";

  const showContact = contactSec ? contactSec.isVisible : true;
  const contactTitle = contactSec?.title || "Collaboration & Inquiries";
  const contactContent = contactSec?.content || "For academic correspondence, lecture bookings, or publishing inquiries, get in touch directly.";

  return (
    <div className="space-y-28 md:space-y-36 pb-28 overflow-hidden">
      {/* ── 1. CINEMATIC LUXURY MAGAZINE HERO (REDESIGNED) ── */}
      {showHero && (
        <section className="relative pt-8 md:pt-16 w-full px-6 md:px-10 lg:px-12 min-h-[82vh] flex flex-col justify-between overflow-hidden">
          {/* Enhanced Landing Page Hero Ambient Background */}
          <div className="absolute inset-0 pointer-events-none select-none z-0">
            {/* Rich Radial Glow */}
            <div className="absolute -top-24 right-1/4 w-[45rem] h-[45rem] bg-radial from-gold/12 via-gold/3 to-transparent blur-3xl" />
            
            {/* Fine Architectural Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(197,160,89,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(197,160,89,0.06)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-60" />
            
            {/* Static Architectural Signature Watermark */}
            <div className="absolute top-10 left-12 text-[9vw] font-heading font-extrabold text-stroke-gold opacity-[0.08] leading-none tracking-tight hidden md:block">
              SHAHID FAYAZ
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center relative z-10 my-auto py-6">
            {/* Left Content Side */}
            <ScrollReveal variant="editorialReveal" className="lg:col-span-7 flex flex-col space-y-7">
              {/* Monogram Crest Header */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-gold font-body">
                  LITERARY &amp; ACADEMIC PORTAL
                </span>
                <span className="h-[1px] w-16 bg-gradient-to-r from-gold/50 to-transparent" />
              </div>

              <div className="space-y-3">
                <h1 className="text-editorial-hero-giant text-forest font-heading font-medium tracking-tight leading-tight">
                  {heroTitle}
                </h1>
              </div>

              <p className="text-editorial-lead text-text-secondary max-w-xl font-light leading-relaxed">
                {heroContent}
              </p>

              {/* Action Trigger Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                {heroSec?.buttonText && heroSec?.buttonLink && (
                  <Link href={heroSec.buttonLink} className="btn-primary group">
                    <span>{heroSec.buttonText}</span>
                    <BookOpen className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
                  </Link>
                )}
                <Link href="/about" className="btn-secondary group">
                  <span>Read Biography</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Accolades Bar */}
              {heroStats.length > 0 && (
                <div className="pt-6 border-t border-border-editorial/70 flex flex-wrap items-center gap-6 max-w-lg">
                  {heroStats.map((stat: any, idx: number) => (
                    <div key={idx} className={`space-y-0.5 ${idx > 0 ? "border-l border-border-editorial/60 pl-6" : ""}`}>
                      <span className="font-heading text-xl md:text-2xl font-bold text-forest">{stat.value}</span>
                      <span className="block text-[9px] uppercase tracking-wider text-text-tertiary font-semibold font-body">{stat.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </ScrollReveal>

            {/* Right Side: Clean High-Resolution Editorial Photo Presentation */}
            <ScrollReveal variant="blurIn" delay={0.15} className="lg:col-span-5 relative flex justify-center lg:justify-end mr-2 md:mr-6">
              <div className="relative w-full max-w-md lg:max-w-[460px] aspect-[4/5] group">
                
                {/* Subtle Ambient Backlight Glow */}
                <div className="absolute -inset-6 bg-radial from-gold/15 via-forest/5 to-transparent blur-3xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-1000 pointer-events-none z-0" />

                {/* Clean Photo Container */}
                <div className="relative w-full h-full overflow-hidden rounded-xs border border-gold/35 bg-soft-ivory z-10 shadow-lg transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:border-gold/60 group-hover:shadow-[0_25px_50px_-12px_rgba(30,58,41,0.18)]">
                  {/* High-Resolution Portrait Image with Smooth Lens Zoom */}
                  <img
                    src={heroImage}
                    alt="Shahid Fayaz Portrait"
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                  />

                  {/* Subtle Professional Lighting Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/30 via-transparent to-transparent pointer-events-none z-10 opacity-70 group-hover:opacity-50 transition-opacity duration-700" />
                </div>

              </div>
            </ScrollReveal>
          </div>

          {/* Continuous Typography Marquee Banner */}
          <div className="pt-12 relative z-10">
            <KineticMarquee
              items={heroMarquee}
              speed={28}
            />
          </div>
        </section>
      )}

      {/* ── 2. BIOGRAPHY EDITORIAL FEATURE SPREAD ── */}
      {showAbout && (
        <section className="relative bg-soft-ivory/80 border-y border-border-editorial py-28 overflow-hidden backdrop-blur-md">
          <div className="w-full px-6 md:px-10 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start relative z-10">
            {/* Left Column: Index & Heading */}
            <ScrollReveal variant="slideRight" className="lg:col-span-5 space-y-4">
              <span className="index-number block">01 //</span>
              <h2 className="text-editorial-title font-heading text-forest">
                {aboutTitle}
              </h2>
              <div className="w-20 h-[1.5px] bg-gold" />
            </ScrollReveal>

            {/* Right Column: Editorial Text & Drop Cap */}
            <ScrollReveal variant="fadeUp" delay={0.15} className="lg:col-span-7 space-y-8">
              <p className="text-editorial-body text-xl md:text-2xl leading-relaxed font-heading italic text-forest font-light drop-cap-editorial">
                {aboutContent}
              </p>
              <div className="pt-2">
                <Link href="/about" className="btn-secondary group">
                  <span>{aboutSec?.buttonText || "Read Full Biography"}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── 3. FEATURED PUBLICATIONS EXHIBITION (SLIDING CAROUSEL) ── */}
      {showFeatured && featuredBooks.length > 0 && (
        <section className="w-full px-6 md:px-10 lg:px-12 space-y-8">
          <ScrollReveal variant="fadeUp" className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-end border-b border-border-editorial pb-6">
            <div className="space-y-2">
              <span className="index-number block">02 //</span>
              <h2 className="text-editorial-title font-heading text-forest">{featuredTitle}</h2>
            </div>
            <Link
              href="/books"
              className="text-xs font-bold tracking-[0.2em] uppercase text-forest hover:text-gold transition-colors inline-flex items-center gap-2 group md:mr-24"
            >
              <span>Explore Complete Catalog</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </ScrollReveal>

          <HorizontalSlider>
            {featuredBooks.map((book) => (
              <div key={book.id} className="flex-none w-[320px] sm:w-[420px] md:w-[520px] lg:w-[600px] snap-start">
                <BookCard3D book={book} layout="horizontal" />
              </div>
            ))}
          </HorizontalSlider>
        </section>
      )}

      {/* ── 4. DARK ROOM PHILOSOPHICAL ANCHOR (QUOTE ROOM) ── */}
      {showQuote && (
        <section className="bg-obsidian text-white py-32 relative overflow-hidden shadow-2xl border-y border-gold/30">
          {/* Giant Quote Watermark Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-heading text-[22rem] text-gold/5 font-bold pointer-events-none select-none">
            “
          </div>
          <div className="absolute inset-0 philosophy-dots opacity-25 pointer-events-none" />

          <ScrollReveal variant="blurIn" className="max-w-5xl mx-auto px-6 text-center space-y-10 relative z-10">
            <blockquote className="font-heading text-3xl md:text-5xl italic leading-relaxed text-warm-white font-light max-w-4xl mx-auto tracking-wide">
              {quoteContent}
            </blockquote>

            <div className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto" />

            <cite className="block text-xs uppercase tracking-[0.3em] font-bold text-gold not-italic font-body">
              — {quoteTitle}
            </cite>
          </ScrollReveal>
        </section>
      )}

      {/* ── 5. RESEARCH & CONTRIBUTIONS INDEX ── */}
      {showWorks && latestWorks.length > 0 && (
        <section className="w-full px-6 md:px-10 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <ScrollReveal variant="slideRight" className="lg:col-span-5 space-y-6 sticky top-32">
            <span className="index-number block">03 //</span>
            <h2 className="text-editorial-title font-heading text-forest">
              {worksTitle}
            </h2>
            <p className="text-editorial-body max-w-md">
              {worksContent}
            </p>
            <div className="pt-2">
              <Link href="/works" className="btn-secondary group">
                <span>View All Contributions</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </ScrollReveal>

          <StaggerContainer className="lg:col-span-7 flex flex-col gap-6" staggerDelay={0.12}>
            {latestWorks.map((work, idx) => (
              <StaggerItem key={work.id}>
                <div className="bg-warm-white border border-border-editorial p-6 md:p-8 rounded-xs shadow-sm hover:shadow-editorial-hover transition-all duration-300 flex flex-col justify-between space-y-4 group">
                  <div className="flex items-center justify-between border-b border-border-editorial/40 pb-3">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold">
                      0{idx + 1} — {work.type}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl md:text-2xl font-medium text-forest group-hover:text-gold transition-colors duration-300">
                    {work.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed font-body max-w-2xl">
                    {work.description}
                  </p>
                  {work.externalLink && (
                    <div className="pt-2 border-t border-border-editorial/40">
                      <a
                        href={work.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold tracking-widest text-forest hover:text-gold uppercase inline-flex items-center gap-2 transition-colors group-hover:translate-x-1"
                      >
                        <span>Access Archival Document</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </a>
                    </div>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      )}

      {/* ── 6. LATEST ESSAYS SLIDING GALLERY (SLIDER) ── */}
      {showArticle && articlesList.length > 0 && (
        <section className="w-full px-6 md:px-10 lg:px-12 space-y-4">
          <ScrollReveal variant="fadeUp" className="flex items-center justify-between border-b border-border-editorial pb-3">
            <div className="flex items-center gap-3">
              <span className="index-number block text-[10px]">04 //</span>
              <h2 className="text-xl md:text-2xl font-heading text-forest">{articleTitle}</h2>
            </div>
            <Link href="/articles" className="text-[11px] font-bold tracking-widest text-forest hover:text-gold uppercase inline-flex items-center gap-1.5 transition-colors group md:mr-24">
              <span>View Archives</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </ScrollReveal>

          <HorizontalSlider>
            {articlesList.map((article: any) => (
              <div key={article.id} className="flex-none w-[320px] sm:w-[460px] md:w-[580px] lg:w-[680px] snap-start">
                <div className="border border-border-editorial bg-warm-white shadow-editorial hover:shadow-editorial-hover grid grid-cols-1 md:grid-cols-12 overflow-hidden rounded-xs group h-full">
                  {/* Ultra-Slim Image Thumbnail */}
                  <div className="md:col-span-4 lg:col-span-4 aspect-[16/9] md:aspect-auto relative bg-soft-ivory overflow-hidden h-36 md:h-full min-h-[140px]">
                    <img
                      src={article.coverImage || "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800"}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Compact Horizontal Text & CTA Content */}
                  <div className="md:col-span-8 lg:col-span-8 p-4 md:px-6 md:py-4 flex flex-col justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-3 text-[10px] text-text-tertiary">
                        <span className="flex items-center gap-1 font-body">
                          <Calendar className="w-3 h-3 text-gold" />
                          <span>
                            {article.publishedAt
                              ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                               })
                              : ""}
                          </span>
                        </span>
                        <span className="w-1 h-1 rounded-full bg-border-editorial" />
                        <span className="flex items-center gap-1 font-body">
                          <Clock className="w-3 h-3 text-gold" />
                          <span>{article.readingTime} min read</span>
                        </span>
                      </div>
                      <h3 className="font-heading text-base md:text-lg font-medium text-forest leading-snug group-hover:text-gold transition-colors duration-300 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-text-secondary text-xs leading-relaxed font-body line-clamp-2">
                        {article.excerpt}
                      </p>
                    </div>

                    <div className="shrink-0 pt-1">
                      <Link href={`/articles/${article.slug}`} className="btn-secondary py-1.5 px-4 text-[11px] group inline-flex items-center gap-1.5 whitespace-nowrap">
                        <span>Read Full Essay</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </HorizontalSlider>
        </section>
      )}

      {/* ── 7. CORRESPONDENCE BANNER ── */}
      {showContact && (
        <section className="bg-soft-ivory/80 border-y border-border-editorial py-28 relative overflow-hidden backdrop-blur-md">
          <ScrollReveal variant="fadeUp" className="max-w-4xl mx-auto px-6 text-center space-y-6">
            <h2 className="text-editorial-title font-heading text-forest">
              {contactTitle}
            </h2>
            <p className="text-editorial-body max-w-xl mx-auto">
              {contactContent}
            </p>
            <div className="pt-2">
              <Link href="/contact" className="btn-primary group">
                <span>Send Correspondence</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </ScrollReveal>
        </section>
      )}
    </div>
  );
}


