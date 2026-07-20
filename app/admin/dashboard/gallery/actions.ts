"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteGalleryMedia(id: number) {
  try {
    await prisma.galleryMedia.delete({
      where: { id },
    });
    revalidatePath("/gallery");
    revalidatePath("/admin/dashboard/gallery");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Delete gallery media error:", error);
    return { error: "Failed to delete media item." };
  }
}

export async function createGalleryMedia(data: {
  filePath: string;
  caption?: string;
  altText?: string;
  galleryId: number;
}) {
  try {
    const newMedia = await prisma.galleryMedia.create({
      data: {
        filePath: data.filePath,
        caption: data.caption || null,
        altText: data.altText || null,
        galleryId: data.galleryId,
        type: "image",
      },
    });
    revalidatePath("/gallery");
    revalidatePath("/admin/dashboard/gallery");
    revalidatePath("/");
    return { success: true, media: newMedia };
  } catch (error) {
    console.error("Create gallery media error:", error);
    return { error: "Failed to upload/link gallery media." };
  }
}

export async function createGallery(data: {
  title: string;
  album: string;
  description?: string;
}) {
  try {
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newGallery = await prisma.gallery.create({
      data: {
        title: data.title,
        slug,
        album: data.album,
        description: data.description || null,
        sortOrder: 0,
      },
    });
    revalidatePath("/gallery");
    revalidatePath("/admin/dashboard/gallery");
    revalidatePath("/");
    return { success: true, gallery: newGallery };
  } catch (error) {
    console.error("Create gallery error:", error);
    return { error: "Failed to create gallery album." };
  }
}

export async function deleteGallery(id: number) {
  try {
    // Delete all linked media first
    await prisma.galleryMedia.deleteMany({
      where: { galleryId: id },
    });
    await prisma.gallery.delete({
      where: { id },
    });
    revalidatePath("/gallery");
    revalidatePath("/admin/dashboard/gallery");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Delete gallery error:", error);
    return { error: "Failed to delete gallery album." };
  }
}
