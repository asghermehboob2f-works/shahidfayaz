"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/slug";

export async function deleteArticle(id: number) {
  try {
    await prisma.article.delete({
      where: { id },
    });
    revalidatePath("/articles");
    revalidatePath("/admin/dashboard/articles");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Delete article error:", error);
    return { error: "Failed to delete article." };
  }
}

export async function createArticle(data: {
  title: string;
  slug: string;
  excerpt?: string;
  body?: string;
  coverImage?: string;
  readingTime?: number;
}) {
  try {
    const cleanSlug = slugify(data.slug || data.title);
    // Fetch default admin user
    const admin = await prisma.user.findFirst({
      where: { role: "admin" },
    });

    if (!admin) {
      return { error: "No admin user found to assign article author." };
    }

    const newArticle = await prisma.article.create({
      data: {
        title: data.title,
        slug: cleanSlug,
        excerpt: data.excerpt || null,
        body: data.body || "",
        coverImage: data.coverImage || "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800",
        readingTime: data.readingTime || 5,
        userId: admin.id,
        isPublished: true,
        publishedAt: new Date(),
      },
    });
    revalidatePath("/articles");
    revalidatePath("/admin/dashboard/articles");
    revalidatePath("/");
    return { success: true, article: newArticle };
  } catch (error) {
    console.error("Create article error:", error);
    return { error: "Failed to create article." };
  }
}

export async function updateArticle(
  id: number,
  data: {
    title: string;
    slug: string;
    excerpt?: string;
    body?: string;
    coverImage?: string;
    readingTime?: number;
    categoryId?: number;
  }
) {
  try {
    const cleanSlug = slugify(data.slug || data.title);
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        title: data.title,
        slug: cleanSlug,
        excerpt: data.excerpt || null,
        body: data.body || "",
        coverImage: data.coverImage || null,
        readingTime: data.readingTime || 5,
        categoryId: data.categoryId || null,
      },
    });
    revalidatePath("/articles");
    revalidatePath(`/articles/${data.slug}`);
    revalidatePath("/admin/dashboard/articles");
    revalidatePath("/");
    return { success: true, article: updatedArticle };
  } catch (error) {
    console.error("Update article error:", error);
    return { error: "Failed to update article." };
  }
}
