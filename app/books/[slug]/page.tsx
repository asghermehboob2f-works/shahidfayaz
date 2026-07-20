import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, ShoppingBag, Book, Calendar, Layers, Globe, FileText, Bookmark } from "lucide-react";

export const revalidate = 0;

interface BookPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BookDetailPage({ params }: BookPageProps) {
  const { slug } = await params;

  let book: any = null;
  let relatedBooks: any[] = [];

  try {
    book = await prisma.book.findUnique({
      where: { slug },
      include: {
        category: true,
        reviews: true,
        purchaseLinks: true,
      },
    });

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
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-24">
      {/* Back to books */}
      <div>
        <Link
          href="/books"
          className="text-xs uppercase tracking-widest font-semibold text-text-secondary hover:text-forest inline-flex items-center gap-2 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bibliography</span>
        </Link>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Book Cover */}
        <div className="lg:col-span-5 flex justify-center sticky top-28">
          <div className="w-full max-w-sm aspect-[2/3] overflow-hidden shadow-editorial bg-white">
            <img
              src={book.coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600"}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Book Metadata & Purchase */}
        <div className="lg:col-span-7 space-y-10">
          <div className="space-y-4">
            <span className="section-label">
              {book.category?.name || "Book"}
            </span>
            <h1 className="text-editorial-title font-heading text-forest leading-tight">
              {book.title}
            </h1>
            {book.subtitle && (
              <p className="text-xl font-heading italic text-text-secondary">
                {book.subtitle}
              </p>
            )}
          </div>

          {/* Key Facts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-border-editorial">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-text-tertiary font-body font-semibold">Format</span>
              <p className="text-sm font-semibold text-forest flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5" />
                <span>{book.format || "Hardcover"}</span>
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-text-tertiary font-body font-semibold">Pages</span>
              <p className="text-sm font-semibold text-forest flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>{book.pages || "—"}</span>
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-text-tertiary font-body font-semibold">Language</span>
              <p className="text-sm font-semibold text-forest flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>{book.language || "English"}</span>
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-text-tertiary font-body font-semibold">Published</span>
              <p className="text-sm font-semibold text-forest flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
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
            <h3 className="text-xs uppercase tracking-widest font-bold text-forest">Synopsis</h3>
            <p className="text-editorial-body leading-relaxed">{book.description}</p>
            {book.synopsis && (
              <p className="text-editorial-body leading-relaxed text-text-secondary">{book.synopsis}</p>
            )}
          </div>

          {/* Purchase Options */}
          <div className="space-y-6 pt-6">
            <h3 className="text-xs uppercase tracking-widest font-bold text-forest">Purchase Editions</h3>
            <div className="flex flex-wrap gap-4">
              {book.purchaseLinks && book.purchaseLinks.length > 0 ? (
                book.purchaseLinks.map((link: any) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary uppercase"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Buy from {link.storeName} {link.priceLabel ? `(${link.priceLabel})` : ""}</span>
                  </a>
                ))
              ) : (
                <div className="text-xs text-text-tertiary">
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
        </div>
      </div>

      {/* Excerpts Block */}
      {book.excerpts && (
        <section className="bg-soft-ivory border-y border-border-editorial py-16 px-6 md:px-12 rounded-sm">
          <div className="max-w-3xl mx-auto space-y-6">
            <h3 className="text-xs uppercase tracking-widest font-bold text-forest text-center">Selected Excerpt</h3>
            <div className="w-8 h-[1px] bg-gold mx-auto" />
            <blockquote className="font-heading text-xl italic leading-relaxed text-text-secondary text-center">
              “{book.excerpts}”
            </blockquote>
          </div>
        </section>
      )}

      {/* Critical Praise / Reviews */}
      {book.reviews && book.reviews.length > 0 && (
        <section className="space-y-12">
          <h3 className="text-xs uppercase tracking-widest font-bold text-forest text-center">Critical Praise</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {book.reviews.map((review: any) => (
              <div key={review.id} className="border border-border-editorial p-8 rounded-sm bg-soft-ivory/10 space-y-4">
                <p className="text-editorial-body text-sm italic">
                  “{review.content}”
                </p>
                <div className="text-xs tracking-wider text-gold font-semibold uppercase">
                  — {review.reviewerName}, {review.reviewerSource}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <section className="space-y-12 pt-12 border-t border-border-editorial">
          <h3 className="text-xs uppercase tracking-widest font-bold text-forest text-center">Related Publications</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedBooks.map((relBook) => (
              <Link
                key={relBook.id}
                href={`/books/${relBook.slug}`}
                className="group flex flex-col items-center text-center space-y-4"
              >
                <div className="w-36 aspect-[2/3] overflow-hidden shadow-editorial bg-white group-hover:scale-105 transition-transform duration-300">
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
                  <p className="text-[10px] tracking-wider text-text-tertiary uppercase">
                    {relBook.format}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
