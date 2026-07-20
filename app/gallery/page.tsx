import React from "react";
import { prisma } from "@/lib/prisma";
import GalleryGrid from "@/components/GalleryGrid";

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
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-12">
      <div className="space-y-4 max-w-2xl">
        <span className="section-label">Media Archive</span>
        <h1 className="text-editorial-title font-heading text-forest">
          Events &amp; Moments
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed">
          A visual record of book launches, philosophical readings, lectures, and academic awards from literary houses worldwide.
        </p>
      </div>

      <GalleryGrid galleries={galleries} />
    </div>
  );
}
