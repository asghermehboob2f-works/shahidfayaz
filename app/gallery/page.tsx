import React from "react";
import { prisma } from "@/lib/prisma";
import { Sparkles } from "lucide-react";
import GalleryGrid from "@/components/GalleryGrid";
import ScrollReveal from "@/components/ScrollReveal";

export const revalidate = 0;

export default async function GalleryPage() {
  let galleries: any[] = [];
  try {
    galleries = await prisma.gallery.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
      include: {
        media: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });
  } catch (error) {
    console.error("Gallery query error:", error);
  }

  return (
    <div className="w-full px-6 md:px-10 lg:px-12 py-16 md:py-24 space-y-16">
      <ScrollReveal variant="editorialReveal" className="space-y-5 max-w-3xl border-b border-border-editorial pb-10">
        <h1 className="text-editorial-hero font-heading text-forest font-medium">
          Events &amp; Moments
        </h1>
        <p className="text-editorial-lead text-text-secondary font-light">
          A visual record of book launches, philosophical readings, lectures, and academic awards from literary houses worldwide.
        </p>
      </ScrollReveal>

      <GalleryGrid galleries={galleries} />
    </div>
  );
}

