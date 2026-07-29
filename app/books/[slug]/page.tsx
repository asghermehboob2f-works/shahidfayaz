import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, ShoppingBag, Calendar, Layers, Globe, Bookmark, Sparkles } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export const revalidate = 0;

interface BookPageProps {
  params: Promise<{ slug: string }>;
}

import { slugify } from "@/lib/slug";

export default async function BookDetailPage({ params }: BookPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).trim();
  const normalizedSlug = slugify(decodedSlug);

  let book: any = null;
  let relatedBooks: any[] = [];

  try {
    book = await prisma.book.findFirst({
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
        reviews: true,
        purchaseLinks: true,
      },
    });

    if (!book) {
      const allBooks = await prisma.book.findMany({
        include: {
          category: true,
          reviews: true,
          purchaseLinks: true,
        },
      });
      book = allBooks.find(
        (b) =>
          slugify(b.slug) === normalizedSlug ||
          slugify(b.title) === normalizedSlug
      );
    }

    if (book) {
      relatedBooks = await prisma.book.findMany({
        where: {
          isPublished: true,
          categoryId: book.categoryId,
          NOT: { id: book.id },
        },
        take: 3,
      });
    }
  } catch (error) {
    console.error("Book detail query error:", error);
  }

  if (!book) {
    notFound();
  }

  return (
    <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24 space-y-24">
      {/* Back to books */}
      <ScrollReveal variant="fadeUp">
        <Link
          href="/books"
          className="text-xs uppercase tracking-[0.25em] font-bold text-text-secondary hover:text-forest inline-flex items-center gap-2 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Back to Bibliography</span>
        </Link>
      </ScrollReveal>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Book Cover Container with 3D Elevate */}
        <ScrollReveal variant="blurIn" className="lg:col-span-5 flex justify-center sticky top-32 z-10">
          <div className="w-full max-w-sm aspect-[2/3] overflow-hidden shadow-editorial-hover bg-white rounded-xs border-2 border-gold/40 relative group">
            <img
              src={book.coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600"}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 bottom-0 left-0 w-[4%] bg-gradient-to-r from-white/40 to-transparent pointer-events-none" />
          </div>
        </ScrollReveal>

        {/* Book Metadata & Purchase */}
        <ScrollReveal variant="editorialReveal" delay={0.15} className="lg:col-span-7 space-y-10">
          <div className="space-y-4">
            <h1 className="text-editorial-hero font-heading text-forest leading-tight font-medium">
              {book.title}
            </h1>
            {book.subtitle && (
              <p className="text-2xl font-heading italic text-text-secondary">
                {book.subtitle}
              </p>
            )}
          </div>

          {/* Key Facts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-border-editorial bg-soft-ivory/30 px-6 rounded-xs">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-text-tertiary font-body font-bold">Format</span>
              <p className="text-sm font-semibold text-forest flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-gold" />
                <span>{book.format || "Hardcover"}</span>
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-text-tertiary font-body font-bold">Pages</span>
              <p className="text-sm font-semibold text-forest flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-gold" />
                <span>{book.pages || "—"}</span>
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-text-tertiary font-body font-bold">Language</span>
              <p className="text-sm font-semibold text-forest flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-gold" />
                <span>{book.language || "English"}</span>
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-text-tertiary font-body font-bold">Published</span>
              <p className="text-sm font-semibold text-forest flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gold" />
                <span>
                  {book.publicationDate
                    ? new Date(book.publicationDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })
                    : "—"}
                </span>
              </p>
            </div>
          </div>

          {/* Description / Synopsis */}
          <div className="space-y-6">
            <h3 className="text-xs uppercase tracking-[0.25em] font-bold text-forest">Synopsis</h3>
            <p className="text-editorial-body leading-relaxed">{book.description}</p>
            {book.synopsis && (
              <p className="text-editorial-body leading-relaxed text-text-secondary">{book.synopsis}</p>
            )}
          </div>

          {/* Purchase Options */}
          <div className="space-y-6 pt-6">
            <h3 className="text-xs uppercase tracking-[0.25em] font-bold text-forest">Purchase Editions</h3>
            <div className="flex flex-wrap gap-4">
              {book.purchaseLinks && book.purchaseLinks.length > 0 ? (
                book.purchaseLinks.map((link: any) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary uppercase group"
                  >
                    <ShoppingBag className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                    <span>Buy from {link.storeName} {link.priceLabel ? `(${link.priceLabel})` : ""}</span>
                  </a>
                ))
              ) : (
                <div className="text-xs text-text-tertiary font-body">
                  Purchase links coming soon.
                </div>
              )}
            </div>
          </div>

          {/* Meta Details */}
          {book.isbn && (
            <div className="text-xs text-text-tertiary space-y-1 pt-4 font-body">
              <p>ISBN: {book.isbn}</p>
              <p>Publisher: {book.publisher || "Oxford University Press"}</p>
            </div>
          )}
        </ScrollReveal>
      </div>

      {/* Excerpts Block */}
      {book.excerpts && (
        <ScrollReveal variant="blurIn" className="bg-obsidian text-white py-20 px-8 rounded-xs border border-gold/30 shadow-2xl relative overflow-hidden">
          <div className="max-w-4xl mx-auto space-y-6 text-center">
            <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-gold">Selected Excerpt</h3>
            <div className="w-16 h-[1px] bg-gold/50 mx-auto" />
            <blockquote className="font-heading text-2xl md:text-3.5xl italic leading-relaxed text-warm-white font-light">
              “{book.excerpts}”
            </blockquote>
          </div>
        </ScrollReveal>
      )}

      {/* Critical Praise / Reviews */}
      {book.reviews && book.reviews.length > 0 && (
        <ScrollReveal variant="fadeUp" className="space-y-12">
          <h3 className="text-xs uppercase tracking-[0.25em] font-bold text-forest text-center">Critical Praise</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {book.reviews.map((review: any) => (
              <div key={review.id} className="border border-border-editorial/80 p-8 rounded-xs bg-warm-white/80 backdrop-blur-md shadow-editorial space-y-4 hover:border-gold/60 transition-colors duration-300">
                <p className="text-editorial-body text-sm italic">
                  “{review.content}”
                </p>
                <div className="text-xs tracking-[0.2em] text-gold font-bold uppercase font-body">
                  — {review.reviewerName}, {review.reviewerSource}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      )}

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <ScrollReveal variant="fadeUp" className="space-y-12 pt-12 border-t border-border-editorial">
          <h3 className="text-xs uppercase tracking-[0.25em] font-bold text-forest text-center">Related Publications</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedBooks.map((relBook) => (
              <Link
                key={relBook.id}
                href={`/books/${relBook.slug}`}
                className="group flex flex-col items-center text-center space-y-4"
              >
                <div className="w-36 aspect-[2/3] overflow-hidden shadow-editorial bg-white group-hover:scale-105 transition-transform duration-500 rounded-xs border border-border-editorial">
                  <img
                    src={relBook.coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600"}
                    alt={relBook.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="font-heading text-lg font-semibold text-forest group-hover:text-gold transition-colors duration-200">
                    {relBook.title}
                  </h4>
                  <p className="text-[10px] tracking-[0.2em] text-text-tertiary uppercase font-body font-semibold">
                    {relBook.format}
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

