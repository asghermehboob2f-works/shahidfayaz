import React from "react";
import { prisma } from "@/lib/prisma";
import CategoriesManager from "@/components/CategoriesManager";

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  let categories: any[] = [];
  try {
    categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Categories load error:", error);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-heading text-forest font-semibold">Taxonomy Categories</h1>
        <p className="text-xs text-text-secondary">
          Configure tags and event filters for articles, publications, research papers, and media galleries.
        </p>
      </div>

      <CategoriesManager categories={categories} />
    </div>
  );
}
