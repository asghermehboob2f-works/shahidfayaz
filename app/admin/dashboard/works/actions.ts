"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteWork(id: number) {
  try {
    await prisma.work.delete({
      where: { id },
    });
    revalidatePath("/works");
    revalidatePath("/admin/dashboard/works");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Delete work error:", error);
    return { error: "Failed to delete work." };
  }
}

export async function createWork(data: {
  title: string;
  slug: string;
  type: string;
  description?: string;
  externalLink?: string;
  tags?: string;
}) {
  try {
    const newWork = await prisma.work.create({
      data: {
        title: data.title,
        slug: data.slug,
        type: data.type || "research",
        description: data.description || null,
        externalLink: data.externalLink || null,
        tags: data.tags || null,
        isPublished: true,
        date: new Date(),
      },
    });
    revalidatePath("/works");
    revalidatePath("/admin/dashboard/works");
    revalidatePath("/");
    return { success: true, work: newWork };
  } catch (error) {
    console.error("Create work error:", error);
    return { error: "Failed to create work." };
  }
}

export async function updateWork(
  id: number,
  data: {
    title: string;
    slug: string;
    type: string;
    description?: string;
    externalLink?: string;
    tags?: string;
  }
) {
  try {
    const updatedWork = await prisma.work.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        type: data.type,
        description: data.description || null,
        externalLink: data.externalLink || null,
        tags: data.tags || null,
      },
    });
    revalidatePath("/works");
    revalidatePath("/admin/dashboard/works");
    revalidatePath("/");
    return { success: true, work: updatedWork };
  } catch (error) {
    console.error("Update work error:", error);
    return { error: "Failed to update work." };
  }
}
