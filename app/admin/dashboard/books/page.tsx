import React from "react";
import { prisma } from "@/lib/prisma";
import BooksManager from "@/components/BooksManager";

export const revalidate = 0;

export default async function AdminBooksPage() {
  let books: any[] = [];
  try {
    books = await prisma.book.findMany({
      include: { purchaseLinks: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Books load error:", error);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-heading text-forest font-semibold">Book Publications</h1>
        <p className="text-xs text-text-secondary">Register new book editions, define back-cover descriptions, links, and manage the bibliography.</p>
      </div>

      <BooksManager books={books} />
    </div>
  );
}
