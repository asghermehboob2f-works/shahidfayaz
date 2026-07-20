"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteCategory(id: number) {
  try {
    await prisma.category.delete({
      where: { id },
    });
    revalidatePath("/articles");
    revalidatePath("/books");
    revalidatePath("/gallery");
    revalidatePath("/admin/dashboard/categories");
    return { success: true };
  } catch (error) {
    console.error("Delete category error:", error);
    return { error: "Failed to delete category. Verify no records are assigned to it." };
  }
}

export async function createCategory(data: {
  name: string;
  slug: string;
  type: string;
}) {
  try {
    const newCategory = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        type: data.type || "article",
      },
    });
    revalidatePath("/articles");
    revalidatePath("/books");
    revalidatePath("/gallery");
    revalidatePath("/admin/dashboard/categories");
    return { success: true, category: newCategory };
  } catch (error) {
    console.error("Create category error:", error);
    return { error: "Failed to create category." };
  }
}

export async function updateCategory(
  id: number,
  data: {
    name: string;
    slug: string;
    type: string;
  }
) {
  try {
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        type: data.type,
      },
    });
    revalidatePath("/articles");
    revalidatePath("/books");
    revalidatePath("/gallery");
    revalidatePath("/admin/dashboard/categories");
    return { success: true, category: updatedCategory };
  } catch (error) {
    console.error("Update category error:", error);
    return { error: "Failed to update category." };
  }
}
