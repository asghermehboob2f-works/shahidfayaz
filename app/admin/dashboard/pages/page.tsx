import React from "react";
import { prisma } from "@/lib/prisma";
import PagesManager from "@/components/PagesManager";

export const revalidate = 0;

export default async function AdminPagesPage() {
  let pages: any[] = [];
  try {
    pages = await prisma.page.findMany({
      orderBy: { title: "asc" },
    });
  } catch (error) {
    console.error("Pages load error:", error);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-heading text-forest font-semibold">Custom Pages</h1>
        <p className="text-xs text-text-secondary">
          Compose structural pages like Privacy Policies, Terms of Service, or dynamic custom content maps with HTML body rendering.
        </p>
      </div>

      <PagesManager pages={pages} />
    </div>
  );
}
