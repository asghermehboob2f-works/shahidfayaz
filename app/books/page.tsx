import React from "react";
import { prisma } from "@/lib/prisma";
import { Sparkles } from "lucide-react";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import BookCard3D from "@/components/BookCard3D";

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
    <div className="w-full px-6 md:px-10 lg:px-12 py-16 md:py-24 space-y-16">
      <ScrollReveal variant="editorialReveal" className="space-y-4 max-w-3xl border-b border-border-editorial pb-8">
        <h1 className="text-editorial-hero font-heading text-forest font-medium">
          Selected Bibliography
        </h1>
        <p className="text-editorial-lead text-text-secondary font-light">
          Exploring the intersections of political geography, memory, and silence. Discover translations, critical editions, and monograph treatises.
        </p>
      </ScrollReveal>

      {books.length > 0 ? (
        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14" staggerDelay={0.12}>
          {books.map((book) => (
            <StaggerItem key={book.id}>
              <BookCard3D book={book} layout="horizontal" />
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        <div className="text-center py-20 text-text-tertiary font-heading text-lg">
          No books published at the moment.
        </div>
      )}
    </div>
  );
}

