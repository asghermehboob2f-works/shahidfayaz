"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deletePage(id: number) {
  try {
    const page = await prisma.page.findUnique({ where: { id } });
    if (!page) return { error: "Page not found." };

    await prisma.page.delete({
      where: { id },
    });

    revalidatePath(`/${page.slug}`);
    revalidatePath("/admin/dashboard/pages");
    return { success: true };
  } catch (error) {
    console.error("Delete page error:", error);
    return { error: "Failed to delete page." };
  }
}

export async function createPage(data: {
  title: string;
  slug: string;
  body: string;
  metaTitle?: string;
  metaDescription?: string;
}) {
  try {
    const newPage = await prisma.page.create({
      data: {
        title: data.title,
        slug: data.slug,
        body: data.body,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        isPublished: true,
      },
    });
    revalidatePath(`/${data.slug}`);
    revalidatePath("/admin/dashboard/pages");
    return { success: true, page: newPage };
  } catch (error) {
    console.error("Create page error:", error);
    return { error: "Failed to create page." };
  }
}

export async function updatePage(
  id: number,
  data: {
    title: string;
    slug: string;
    body: string;
    metaTitle?: string;
    metaDescription?: string;
  }
) {
  try {
    const updatedPage = await prisma.page.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        body: data.body,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
      },
    });
    revalidatePath(`/${data.slug}`);
    revalidatePath("/admin/dashboard/pages");
    return { success: true, page: updatedPage };
  } catch (error) {
    console.error("Update page error:", error);
    return { error: "Failed to update page." };
  }
}
