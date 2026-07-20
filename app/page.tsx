import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowRight, BookOpen, FileText, Calendar, Clock, Briefcase } from "lucide-react";

export const revalidate = 0; // Dynamic server page

export default async function HomePage() {
  let heroSec, aboutSec, quoteSec, featuredSec, worksSec, articleSec, contactSec;
  let featuredBooks: any[] = [];
  let latestArticle: any = null;
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
      take: 2,
    });

    latestArticle = await prisma.article.findFirst({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
    });

    latestWorks = await prisma.work.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
      take: 3,
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
  const contactSubtitle = contactSec?.subtitle || "Get in Touch";
  const contactContent = contactSec?.content || "For academic correspondence, lecture bookings, or publishing inquiries, get in touch directly.";

  return (
    <div className="space-y-32 pb-32">
      {/* 1. CINEMATIC HERO SECTION */}
      {showHero && (
        <section className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center pt-8">
          <div className="lg:col-span-7 flex flex-col space-y-8">
            <div className="space-y-4">
              <span className="section-label">{heroSubtitle}</span>
              <h1 className="text-editorial-hero font-heading text-forest">
                {heroTitle}
              </h1>
            </div>
            <p className="text-editorial-lead text-text-secondary max-w-xl">
              {heroContent}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              {heroSec?.buttonText && heroSec?.buttonLink && (
                <Link href={heroSec.buttonLink} className="btn-primary">
                  <span>{heroSec.buttonText}</span>
                  <BookOpen className="w-4 h-4" />
                </Link>
              )}
              <Link href="/about" className="btn-secondary">
                <span>Read Biography</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-[3/4] overflow-hidden shadow-editorial float-slow">
              <img
                src={heroImage}
                alt="Shahid Fayaz Portrait"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/10 to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 text-white text-xs tracking-widest font-semibold uppercase opacity-80">
                Shahid Fayaz, London 2025
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. BIOGRAPHY PREVIEW */}
      {showAbout && (
        <section className="bg-soft-ivory border-y border-border-editorial py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-4 space-y-4">
              <span className="section-label">{aboutSubtitle}</span>
              <h2 className="text-editorial-title font-heading text-forest">
                {aboutTitle}
              </h2>
            </div>
            <div className="lg:col-span-8 space-y-8">
              <p className="text-editorial-body text-lg leading-relaxed">
                {aboutContent}
              </p>
              <div>
                <Link href="/about" className="btn-secondary">
                  <span>{aboutSec?.buttonText || "Read Full Story"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. FEATURED BOOKS */}
      {showFeatured && featuredBooks.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
          <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-end md:space-y-0">
            <div className="space-y-2">
              <span className="section-label">{featuredSubtitle}</span>
              <h2 className="text-editorial-title font-heading text-forest">{featuredTitle}</h2>
            </div>
            <Link
              href="/books"
              className="text-sm font-semibold tracking-wider uppercase text-forest hover:text-gold transition-colors inline-flex items-center gap-2"
            >
              <span>View All Books</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {featuredBooks.map((book) => (
              <div
                key={book.id}
                className="book-card border border-border-editorial bg-soft-ivory/30 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center"
              >
                <div className="w-44 shrink-0 aspect-[2/3] overflow-hidden shadow-editorial bg-white">
                  <img
                    src={book.coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600"}
                    alt={book.title}
                    className="book-cover-img w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <span className="text-xs font-semibold tracking-widest text-gold uppercase">
                      {book.format}
                    </span>
                    <h3 className="font-heading text-2xl font-semibold text-forest leading-tight">
                      {book.title}
                    </h3>
                    <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed">
                      {book.description}
                    </p>
                  </div>
                  <div>
                    <Link
                      href={`/books/${book.slug}`}
                      className="text-xs font-bold tracking-widest uppercase text-forest hover:text-gold inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>Explore Edition</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. PHILOSOPHICAL QUOTE */}
      {showQuote && (
        <section className="bg-forest text-white py-28 relative overflow-hidden">
          <div className="absolute inset-0 philosophy-dots opacity-20 pointer-events-none" />
          <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
              {quoteSubtitle}
            </span>
            <blockquote className="font-heading text-2xl md:text-3.5xl italic leading-relaxed text-warm-white">
              {quoteContent}
            </blockquote>
            <div className="w-12 h-[1px] bg-gold mx-auto" />
            <cite className="block text-xs uppercase tracking-widest font-semibold text-gold not-italic">
              — {quoteTitle}
            </cite>
          </div>
        </section>
      )}

      {/* 5. LATEST WORKS / RESEARCH */}
      {showWorks && latestWorks.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4 space-y-4">
            <span className="section-label">{worksSubtitle}</span>
            <h2 className="text-editorial-title font-heading text-forest">
              {worksTitle}
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
              {worksContent}
            </p>
            <div className="pt-4">
              <Link href="/works" className="btn-secondary">
                <span>View All Contributions</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col divide-y divide-border-editorial border-y border-border-editorial">
            {latestWorks.map((work) => (
              <div key={work.id} className="work-item py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-gold font-semibold">
                    {work.type}
                  </span>
                  <h3 className="font-heading text-xl font-medium text-forest">
                    {work.title}
                  </h3>
                  <p className="text-xs text-text-secondary max-w-xl">
                    {work.description}
                  </p>
                </div>
                {work.externalLink && (
                  <a
                    href={work.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold tracking-wider text-forest hover:text-gold uppercase inline-flex items-center gap-1 mt-2 md:mt-0"
                  >
                    <span>View Project</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. LATEST ARTICLE / ESSAY */}
      {showArticle && latestArticle && (
        <section className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
          <div className="text-center space-y-2">
            <span className="section-label font-body">{articleSubtitle}</span>
            <h2 className="text-editorial-title font-heading text-forest">{articleTitle}</h2>
          </div>

          <div className="border border-border-editorial bg-soft-ivory/20 shadow-editorial grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            <div className="lg:col-span-6 aspect-[4/3] lg:aspect-auto relative bg-soft-ivory">
              <img
                src={latestArticle.coverImage || "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800"}
                alt={latestArticle.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:col-span-6 p-8 md:p-16 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4 text-xs text-text-tertiary">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {latestArticle.publishedAt
                        ? new Date(latestArticle.publishedAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                        : ""}
                    </span>
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-border-editorial" />
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{latestArticle.readingTime} min read</span>
                  </span>
                </div>
                <h3 className="font-heading text-3xl font-medium text-forest leading-tight">
                  {latestArticle.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {latestArticle.excerpt}
                </p>
              </div>
              <div>
                <Link href={`/articles/${latestArticle.slug}`} className="btn-primary">
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. CONTACT & NEWSLETTER CALL TO ACTION */}
      {showContact && (
        <section className="bg-soft-ivory border-y border-border-editorial py-24">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
            <span className="section-label">{contactSubtitle}</span>
            <h2 className="text-editorial-title font-heading text-forest">
              {contactTitle}
            </h2>
            <p className="text-editorial-body max-w-xl mx-auto">
              {contactContent}
            </p>
            <div className="pt-4">
              <Link href="/contact" className="btn-primary">
                <span>Send Message</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
