import React from "react";
import { prisma } from "@/lib/prisma";
import GalleryManager from "@/components/GalleryManager";

export const revalidate = 0;

export default async function AdminGalleryPage() {
  let galleries: any[] = [];
  try {
    galleries = await prisma.gallery.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        media: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });
  } catch (error) {
    console.error("Gallery albums load error:", error);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-heading text-forest font-semibold">Media Gallery</h1>
        <p className="text-xs text-text-secondary">Link photographs and moment descriptions to specific event albums and manage media uploads.</p>
      </div>

      <GalleryManager galleries={galleries} />
    </div>
  );
}
