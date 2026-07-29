"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/slug";

interface PurchaseLinkData {
  storeName: string;
  url: string;
  priceLabel?: string;
}

export async function deleteBook(id: number) {
  try {
    await prisma.book.delete({
      where: { id },
    });
    revalidatePath("/books");
    revalidatePath("/admin/dashboard/books");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Delete book error:", error);
    return { error: "Failed to delete book." };
  }
}

export async function createBook(data: {
  title: string;
  slug: string;
  subtitle?: string;
  description?: string;
  coverImage?: string;
  coverImage2?: string;
  isbn?: string;
  price?: number;
  pages?: number;
  format?: string;
  publisher?: string;
  publicationDate?: string | Date | null;
  purchaseLinks?: PurchaseLinkData[];
}) {
  try {
    const cleanSlug = slugify(data.slug || data.title);
    const newBook = await prisma.book.create({
      data: {
        title: data.title,
        slug: cleanSlug,
        subtitle: data.subtitle || null,
        description: data.description || null,
        coverImage: data.coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600",
        coverImage2: data.coverImage2 || null,
        isbn: data.isbn || null,
        price: data.price || null,
        pages: data.pages || null,
        format: data.format || "Hardcover",
        publisher: data.publisher || null,
        publicationDate: data.publicationDate ? new Date(data.publicationDate) : null,
        isPublished: true,
        purchaseLinks: {
          create: data.purchaseLinks?.map((link, index) => ({
            storeName: link.storeName,
            url: link.url,
            priceLabel: link.priceLabel || null,
            sortOrder: index,
          })) || [],
        },
      },
    });
    revalidatePath("/books");
    revalidatePath("/admin/dashboard/books");
    revalidatePath("/");
    return { success: true, book: newBook };
  } catch (error) {
    console.error("Create book error:", error);
    return { error: "Failed to register book." };
  }
}

export async function updateBook(
  id: number,
  data: {
    title: string;
    slug: string;
    subtitle?: string;
    description?: string;
    coverImage?: string;
    coverImage2?: string;
    isbn?: string;
    price?: number;
    pages?: number;
    format?: string;
    publisher?: string;
    publicationDate?: string | Date | null;
    purchaseLinks?: PurchaseLinkData[];
  }
) {
  try {
    const cleanSlug = slugify(data.slug || data.title);
    const updatedBook = await prisma.book.update({
      where: { id },
      data: {
        title: data.title,
        slug: cleanSlug,
        subtitle: data.subtitle || null,
        description: data.description || null,
        coverImage: data.coverImage || null,
        coverImage2: data.coverImage2 || null,
        isbn: data.isbn || null,
        price: data.price !== undefined ? data.price : null,
        pages: data.pages !== undefined ? data.pages : null,
        format: data.format || "Hardcover",
        publisher: data.publisher || null,
        publicationDate: data.publicationDate ? new Date(data.publicationDate) : null,
      },
    });

    if (data.purchaseLinks !== undefined) {
      await prisma.bookPurchaseLink.deleteMany({
        where: { bookId: id },
      });
      if (data.purchaseLinks.length > 0) {
        await prisma.bookPurchaseLink.createMany({
          data: data.purchaseLinks.map((link, index) => ({
            bookId: id,
            storeName: link.storeName,
            url: link.url,
            priceLabel: link.priceLabel || null,
            sortOrder: index,
          })),
        });
      }
    }
    revalidatePath("/books");
    revalidatePath(`/books/${data.slug}`);
    revalidatePath("/admin/dashboard/books");
    revalidatePath("/");
    return { success: true, book: updatedBook };
  } catch (error) {
    console.error("Update book error:", error);
    return { error: "Failed to update book." };
  }
}
