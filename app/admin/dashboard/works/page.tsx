import React from "react";
import { prisma } from "@/lib/prisma";
import WorksManager from "@/components/WorksManager";

export const revalidate = 0;

export default async function AdminWorksPage() {
  let works: any[] = [];
  let categories: any[] = [];

  try {
    works = await prisma.work.findMany({
      orderBy: { sortOrder: "asc" },
    });
    categories = await prisma.category.findMany({
      where: { type: "work" },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Works load error:", error);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-heading text-forest font-semibold">Research &amp; Works</h1>
        <p className="text-xs text-text-secondary">Register academic research papers, monographs, social mapping projects, and manage external references.</p>
      </div>

      <WorksManager works={works} categories={categories} />
    </div>
  );
}
