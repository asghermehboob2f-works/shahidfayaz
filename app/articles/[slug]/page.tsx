import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Calendar, Clock, User, Link as LinkIcon } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export const revalidate = 0;

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

import { slugify } from "@/lib/slug";

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).trim();
  const normalizedSlug = slugify(decodedSlug);

  let article: any = null;
  let relatedArticles: any[] = [];

  try {
    article = await prisma.article.findFirst({
      where: {
        OR: [
          { slug: decodedSlug },
          { slug: normalizedSlug },
          { slug: decodedSlug.toLowerCase() },
          { slug: normalizedSlug.toLowerCase() },
        ],
      },
      include: {
        category: true,
        user: true,
      },
    });

    if (!article) {
      const allArticles = await prisma.article.findMany({
        include: {
          category: true,
          user: true,
        },
      });
      article = allArticles.find(
        (a) =>
          slugify(a.slug) === normalizedSlug ||
          slugify(a.title) === normalizedSlug
      );
    }

    if (article) {
      relatedArticles = await prisma.article.findMany({
        where: {
          isPublished: true,
          categoryId: article.categoryId,
          NOT: { id: article.id },
        },
        take: 3,
      });
    }
  } catch (error) {
    console.error("Article detail query error:", error);
  }

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-8 py-16 space-y-12">
      {/* Back Button */}
      <ScrollReveal variant="fadeUp">
        <Link
          href="/articles"
          className="text-xs uppercase tracking-[0.2em] font-semibold text-text-secondary hover:text-forest inline-flex items-center gap-2 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Back to Essays</span>
        </Link>
      </ScrollReveal>

      {/* Article Header */}
      <ScrollReveal variant="fadeUp" delay={0.1} className="space-y-6">
        {article.category && (
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            {article.category.name}
          </span>
        )}
        <h1 className="font-heading text-4xl md:text-5.5xl font-medium text-forest leading-tight">
          {article.title}
        </h1>
        <p className="text-editorial-lead text-text-secondary leading-relaxed font-light">
          {article.excerpt}
        </p>

        {/* Author / Date / Time */}
        <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-border-editorial text-xs text-text-tertiary font-body">
          <span className="flex items-center gap-1.5 font-semibold text-forest">
            <User className="w-3.5 h-3.5 text-gold" />
            <span>By {article.user?.name || "Shahid Fayaz"}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gold" />
            <span>
              {article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                : ""}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gold" />
            <span>{article.readingTime || "5"} min read</span>
          </span>
        </div>
      </ScrollReveal>

      {/* Cover Image */}
      <ScrollReveal variant="blurIn" delay={0.2} className="aspect-[16/9] w-full overflow-hidden shadow-editorial-hover bg-soft-ivory rounded-xs border border-border-editorial/60 relative group">
        <img
          src={article.coverImage || "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800"}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-103"
        />
      </ScrollReveal>

      {/* Main Body Content */}
      <ScrollReveal variant="fadeUp" delay={0.25}>
        <article
          className="prose-editorial text-editorial-body max-w-none"
          dangerouslySetInnerHTML={{ __html: article.body }}
        />
      </ScrollReveal>

      {/* Social Share & Tags */}
      <ScrollReveal variant="fadeUp" className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 border-y border-border-editorial gap-4">
        <span className="text-xs text-text-tertiary font-body">
          Published under <strong className="text-forest">{article.category?.name || "Essays"}</strong>
        </span>
        <div className="flex items-center space-x-3 text-text-secondary font-body">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary pr-2">Share:</span>
          <button className="hover:text-forest transition-colors p-1.5 hover:bg-soft-ivory rounded-full" aria-label="Share Facebook">
            <FacebookIcon className="w-4 h-4" />
          </button>
          <button className="hover:text-forest transition-colors p-1.5 hover:bg-soft-ivory rounded-full" aria-label="Share Twitter">
            <TwitterIcon className="w-4 h-4" />
          </button>
          <button className="hover:text-forest transition-colors p-1.5 hover:bg-soft-ivory rounded-full" aria-label="Copy Link">
            <LinkIcon className="w-4 h-4" />
          </button>
        </div>
      </ScrollReveal>

      {/* Related Essays */}
      {relatedArticles.length > 0 && (
        <ScrollReveal variant="fadeUp" className="space-y-8 pt-12">
          <h3 className="text-xs uppercase tracking-[0.25em] font-bold text-forest">Related Essays</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((relArt) => (
              <Link
                key={relArt.id}
                href={`/articles/${relArt.slug}`}
                className="group space-y-3 block"
              >
                <div className="aspect-[16/10] overflow-hidden bg-soft-ivory shadow-editorial rounded-xs border border-border-editorial/60">
                  <img
                    src={relArt.coverImage || "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800"}
                    alt={relArt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="font-heading text-lg font-semibold text-forest leading-snug group-hover:text-gold transition-colors duration-200 line-clamp-2">
                    {relArt.title}
                  </h4>
                  <p className="text-[10px] text-text-tertiary font-body">
                    {relArt.readingTime || "5"} min read
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
