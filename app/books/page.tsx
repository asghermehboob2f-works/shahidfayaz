import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowRight, BookOpen } from "lucide-react";

export const revalidate = 0;

export default async function BooksPage() {
  let books: any[] = [];
  try {
    books = await prisma.book.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
      include: { category: true },
    });
  } catch (error) {
    console.error("Books list query error:", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-16">
      <div className="space-y-4 max-w-2xl">
        <span className="section-label">Publications</span>
        <h1 className="text-editorial-title font-heading text-forest">
          Selected Bibliography
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed">
          Exploring the intersections of political geography, memory, and silence. Discover translations, essays, and novels available worldwide.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {books.map((book) => (
          <div
            key={book.id}
            className="book-card border border-border-editorial bg-soft-ivory/20 hover:bg-soft-ivory/40 p-8 md:p-12 flex flex-col sm:flex-row gap-8 items-center rounded-sm transition-all duration-300"
          >
            {/* Book Cover Container */}
            <div className="w-48 sm:w-44 shrink-0 aspect-[2/3] overflow-hidden shadow-editorial bg-white relative">
              <img
                src={book.coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600"}
                alt={book.title}
                className="book-cover-img w-full h-full object-cover"
              />
            </div>

            {/* Book Details */}
            <div className="flex flex-col justify-between h-full space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[10px] font-semibold tracking-widest text-gold uppercase">
                    {book.format}
                  </span>
                  {book.category && (
                    <>
                      <span className="text-text-tertiary text-xs">•</span>
                      <span className="text-[10px] font-semibold tracking-widest text-text-secondary uppercase">
                        {book.category.name}
                      </span>
                    </>
                  )}
                </div>
                <h2 className="font-heading text-2xl font-semibold text-forest leading-snug">
                  {book.title}
                </h2>
                {book.subtitle && (
                  <p className="text-xs italic text-text-secondary font-heading">
                    {book.subtitle}
                  </p>
                )}
                <p className="text-xs text-text-secondary line-clamp-4 leading-relaxed font-body">
                  {book.description}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-forest font-body">
                  {book.price ? `${book.currency || "USD"} $${book.price.toFixed(2)}` : "Unavailable"}
                </span>
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
    </div>
  );
}
