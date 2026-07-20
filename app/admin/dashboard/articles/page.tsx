import React from "react";
import { prisma } from "@/lib/prisma";
import ArticlesManager from "@/components/ArticlesManager";

export const revalidate = 0;

export default async function AdminArticlesPage() {
  let articles: any[] = [];
  let categories: any[] = [];

  try {
    articles = await prisma.article.findMany({
      orderBy: { publishedAt: "desc" },
    });
    categories = await prisma.category.findMany({
      where: { type: "article" },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Articles data load error:", error);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-heading text-forest font-semibold">Essays &amp; Articles</h1>
        <p className="text-xs text-text-secondary">Compose new essays, post literary articles, and manage published editorial commentary.</p>
      </div>

      <ArticlesManager articles={articles} categories={categories} />
    </div>
  );
}
